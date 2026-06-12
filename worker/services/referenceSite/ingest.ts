/**
 * Reference-site ingestion: one Browser Run session extracts style tokens
 * (DOM probe — exact values), a viewport screenshot (vision context), and —
 * only with own-site consent — assets and content for reuse. Every step is
 * individually fault-tolerant; the worst outcome is a 'failed' profile and a
 * build that proceeds without reference data.
 */

import puppeteer from '@cloudflare/puppeteer';
import { z } from 'zod';
import { createLogger } from '../../logger';
import { executeInference } from '../../agents/inferutils/infer';
import { createSystemMessage, createMultiModalUserMessage } from '../../agents/inferutils/common';
import type { InferenceContext } from '../../agents/inferutils/config.types';
import { ImageType, uploadImage } from '../../utils/images';
import type { SupportedImageMimeType } from '../../types/image-attachment';
import { isAllowedByRobots, validateReferenceUrl } from './urlSafety';
import type { ProbeResult, ReferenceAsset, ReferenceOwnership, ReferenceSiteProfile } from './types';

const logger = createLogger('ReferenceSiteIngest');

const PAGE_TIMEOUT_MS = 30_000;
const MAX_ASSET_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 8;
const MAX_CONTENT_CHARS = 12_000;

export interface IngestArgs {
    url: string;
    ownership: ReferenceOwnership;
    likes: string[];
    sessionId: string;
    inferenceContext: InferenceContext;
}

/**
 * In-page probe, shipped as source text because the worker tsconfig has no
 * DOM lib. Returns the ProbeResult shape; the worker validates it with zod
 * before trusting it.
 */
const PROBE_SCRIPT = `(() => {
    const sampleSelectors = ['body', 'h1', 'h2', 'h3', 'p', 'a', 'button', 'nav', 'header', 'footer', 'input'];
    const fonts = [];
    const radii = new Set();
    const shadows = new Set();

    for (const selector of sampleSelectors) {
        const el = document.querySelector(selector);
        if (!el) continue;
        const style = getComputedStyle(el);
        if (style.fontFamily) fonts.push({ role: selector, family: style.fontFamily });
        if (style.borderRadius && style.borderRadius !== '0px') radii.add(style.borderRadius);
        if (style.boxShadow && style.boxShadow !== 'none') shadows.add(style.boxShadow);
    }

    const colorCounts = new Map();
    const elements = Array.from(document.querySelectorAll('*')).slice(0, 2000);
    for (const el of elements) {
        const style = getComputedStyle(el);
        for (const value of [style.color, style.backgroundColor, style.borderColor]) {
            if (!value || value === 'rgba(0, 0, 0, 0)' || value === 'transparent') continue;
            colorCounts.set(value, (colorCounts.get(value) || 0) + 1);
        }
    }
    const palette = Array.from(colorCounts.entries())
        .map(([color, count]) => ({ color, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 16);

    const cssVariables = {};
    try {
        for (const sheet of Array.from(document.styleSheets)) {
            let rules;
            try { rules = sheet.cssRules; } catch { continue; }
            for (const rule of Array.from(rules)) {
                if (rule.selectorText === ':root' && rule.style) {
                    for (const name of Array.from(rule.style)) {
                        if (name.startsWith('--')) {
                            cssVariables[name] = rule.style.getPropertyValue(name).trim();
                        }
                    }
                }
            }
        }
    } catch { /* best-effort */ }

    const fontLinks = Array.from(
        document.querySelectorAll('link[href*="fonts.googleapis"], link[href*="use.typekit"], link[href*="fonts.bunny"]'),
    ).map((link) => link.href);

    const logoCandidates = [];
    const push = (url, source) => {
        if (url) {
            try { logoCandidates.push({ url: new URL(url, location.href).toString(), source }); } catch { /* skip */ }
        }
    };
    const q = (selector) => document.querySelector(selector);
    push(q('link[rel="apple-touch-icon"]')?.href, 'apple-touch-icon');
    push(q('meta[property="og:image"]')?.content, 'og:image');
    push(q('link[rel~="icon"]')?.href, 'icon');
    push(q('header img, img[alt*="logo" i]')?.src, 'header-img');

    const imageCandidates = Array.from(document.images)
        .filter((img) => img.naturalWidth >= 120 && img.naturalHeight >= 120 && img.src.startsWith('http'))
        .map((img) => ({ url: img.src, alt: img.alt || '', area: img.naturalWidth * img.naturalHeight }))
        .sort((a, b) => b.area - a.area)
        .slice(0, 20);

    return {
        palette,
        cssVariables,
        fonts,
        fontLinks,
        borderRadii: Array.from(radii).slice(0, 6),
        boxShadows: Array.from(shadows).slice(0, 6),
        themeColor: q('meta[name="theme-color"]')?.content || null,
        title: document.title,
        description: q('meta[name="description"]')?.content || '',
        logoCandidates,
        imageCandidates,
        contentText: (document.body.innerText || '').slice(0, 20000),
    };
})()`;

const ProbeResultSchema = z.object({
    palette: z.array(z.object({ color: z.string(), count: z.number() })),
    cssVariables: z.record(z.string(), z.string()),
    fonts: z.array(z.object({ role: z.string(), family: z.string() })),
    fontLinks: z.array(z.string()),
    borderRadii: z.array(z.string()),
    boxShadows: z.array(z.string()),
    themeColor: z.string().nullable(),
    title: z.string(),
    description: z.string(),
    logoCandidates: z.array(z.object({ url: z.string(), source: z.string() })),
    imageCandidates: z.array(z.object({ url: z.string(), alt: z.string(), area: z.number() })),
    contentText: z.string(),
});

const VisionSchema = z.object({
    description: z.string().describe('3-5 sentence design-system description: palette mood, typography character, layout style, spacing, overall feel'),
    standoutElements: z.array(z.string()).describe('Up to 5 specific design elements worth emulating'),
});

async function describeDesign(
    env: Env,
    inferenceContext: InferenceContext,
    screenshotDataUrl: string,
    likes: string[],
): Promise<{ description: string; standoutElements: string[] } | null> {
    try {
        const { object } = await executeInference({
            env,
            agentActionName: 'referenceSiteAnalysis',
            schema: VisionSchema,
            context: inferenceContext,
            maxTokens: 2000,
            messages: [
                createSystemMessage(
                    'You analyze website screenshots and describe their design system so another design team can capture the same feel without copying assets. Be concrete: name the palette mood, typography character, density, and layout patterns.',
                ),
                createMultiModalUserMessage(
                    `Describe this website's design system.${likes.length > 0 ? ` The client specifically likes: ${likes.join(', ')}.` : ''}`,
                    [screenshotDataUrl],
                    'high',
                ),
            ],
        });
        return object;
    } catch (error) {
        logger.warn('Vision pass failed (non-fatal)', { error: error instanceof Error ? error.message : String(error) });
        return null;
    }
}

async function harvestAsset(env: Env, sourceUrl: string, sessionId: string, alt?: string): Promise<ReferenceAsset | null> {
    try {
        const validation = validateReferenceUrl(sourceUrl);
        if (!validation.ok) return null;
        const response = await fetch(validation.url.toString(), { signal: AbortSignal.timeout(10_000) });
        if (!response.ok) return null;
        const contentType = response.headers.get('Content-Type') ?? '';
        if (!contentType.startsWith('image/') || contentType.includes('svg')) {
            // SVGs are skipped: they can carry scripts and our image pipeline
            // expects raster types.
            return null;
        }
        const buffer = await response.arrayBuffer();
        if (buffer.byteLength > MAX_ASSET_BYTES || buffer.byteLength < 1024) return null;

        const uploaded = await uploadImage(
            env,
            {
                id: `${sessionId}-${crypto.randomUUID()}`,
                filename: validation.url.pathname.split('/').pop() || 'asset',
                mimeType: contentType.split(';')[0] as SupportedImageMimeType,
                base64Data: Buffer.from(buffer).toString('base64'),
            },
            ImageType.UPLOADS,
        );
        return { publicUrl: uploaded.publicUrl, sourceUrl, alt };
    } catch {
        return null;
    }
}

export async function ingestReferenceSite(env: Env, args: IngestArgs): Promise<ReferenceSiteProfile> {
    const { ownership, likes, sessionId, inferenceContext } = args;
    const base: ReferenceSiteProfile = {
        url: args.url,
        status: 'failed',
        ownership,
        likes,
        fetchedAt: Date.now(),
    };

    const validation = validateReferenceUrl(args.url);
    if (!validation.ok) {
        return { ...base, failureReason: validation.reason };
    }
    const url = validation.url;

    // Courtesy check for sites the user doesn't own.
    if (ownership === 'style-only' && !(await isAllowedByRobots(url))) {
        return { ...base, failureReason: 'The site\'s robots.txt disallows automated access' };
    }

    let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;
    try {
        browser = await puppeteer.launch(env.BROWSER);
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
        await page.goto(url.toString(), { waitUntil: 'networkidle2', timeout: PAGE_TIMEOUT_MS });
        // Small settle delay for late hydration/animations.
        await new Promise((resolve) => setTimeout(resolve, 1500));

        let probe: ProbeResult | null = null;
        try {
            const raw: unknown = await page.evaluate(PROBE_SCRIPT);
            const parsed = ProbeResultSchema.safeParse(raw);
            if (parsed.success) {
                probe = parsed.data;
            } else {
                logger.warn('Probe returned an unexpected shape (continuing with screenshot only)', { issues: parsed.error.issues.slice(0, 3) });
            }
        } catch (error) {
            logger.warn('Probe failed (continuing with screenshot only)', { error: error instanceof Error ? error.message : String(error) });
        }

        const screenshotBase64 = (await page.screenshot({ type: 'png', encoding: 'base64' })) as string;
        await browser.close();
        browser = null;

        const uploadedScreenshot = await uploadImage(
            env,
            {
                id: `${sessionId}-reference`,
                filename: 'reference-site.png',
                mimeType: 'image/png',
                base64Data: screenshotBase64,
            },
            ImageType.SCREENSHOTS,
        );

        const vision = await describeDesign(
            env,
            inferenceContext,
            `data:image/png;base64,${screenshotBase64}`,
            likes,
        );

        const profile: ReferenceSiteProfile = {
            ...base,
            status: probe ? 'complete' : 'partial',
            // base64 stripped: the D1 session blob must stay small; the
            // build re-hydrates from R2 via the r2Key.
            screenshot: { ...uploadedScreenshot, base64Data: undefined },
            visionDescription: vision
                ? [vision.description, ...vision.standoutElements.map((element) => `Standout: ${element}`)].join('\n')
                : undefined,
        };

        if (probe) {
            profile.styleTokens = {
                palette: probe.palette,
                cssVariables: probe.cssVariables,
                fonts: probe.fonts,
                fontLinks: probe.fontLinks,
                borderRadii: probe.borderRadii,
                boxShadows: probe.boxShadows,
                themeColor: probe.themeColor,
            };
            profile.meta = { title: probe.title, description: probe.description };

            // Assets and content are harvested ONLY with the "my site, reuse
            // it" attestation — third-party sites contribute style only.
            if (ownership === 'own-reuse') {
                profile.contentText = probe.contentText.slice(0, MAX_CONTENT_CHARS);

                const logoCandidate = probe.logoCandidates[0];
                if (logoCandidate) {
                    profile.logo = (await harvestAsset(env, logoCandidate.url, sessionId)) ?? undefined;
                }
                const harvested = await Promise.all(
                    probe.imageCandidates.slice(0, MAX_IMAGES).map((candidate) =>
                        harvestAsset(env, candidate.url, sessionId, candidate.alt),
                    ),
                );
                profile.images = harvested.filter((asset): asset is ReferenceAsset => asset !== null);
            }
        }

        logger.info('Reference site ingested', {
            url: profile.url,
            status: profile.status,
            paletteSize: profile.styleTokens?.palette.length ?? 0,
            images: profile.images?.length ?? 0,
            hasLogo: Boolean(profile.logo),
        });
        return profile;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.warn('Reference site ingestion failed', { url: url.toString(), error: message });
        return { ...base, failureReason: message };
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch {
                // already closed / crashed
            }
        }
    }
}
