/**
 * Shared, env-only screenshot capture + store.
 *
 * Single source of truth for turning a publicly-reachable app URL into a stored
 * preview thumbnail: Cloudflare Browser Rendering snapshot → blank/retry guard →
 * R2 upload → apps.screenshot_url persistence. It depends on nothing but `env`,
 * an appId, and a URL, so every caller shares one implementation:
 *  - the chat preview WebSocket path (behaviors/base.ts captureScreenshot, which
 *    wraps this with broadcasts + visual analysis),
 *  - the post-deploy auto-capture (objectives/base.ts deploy success),
 *  - the operator backfill / manual capture endpoints.
 */

import { ImageType, uploadImage, detectBlankScreenshot } from '../../utils/images';
import type { ImageAttachment } from '../../types/image-attachment';
import { AppService } from '../../database';

export const SCREENSHOT_CONFIG = {
    PAGE_LOAD_TIMEOUT: 15000, // 15s for page load
    WAIT_FOR_TIMEOUT: 2000, // 2s additional wait after network idle
    MAX_RETRIES: 2, // 2 retries = 3 total attempts
    RETRY_DELAY_BASE: 2000, // 2s base delay between retries
    MIN_FILE_SIZE: 10000, // 10KB minimum for valid screenshot
    MIN_ENTROPY: 2.0, // Minimum entropy threshold
} as const;

export interface Viewport {
    width: number;
    height: number;
}

export interface CaptureResult {
    /** The stored (unsigned) public screenshot URL persisted to apps.screenshot_url. */
    publicUrl: string;
    /** Raw base64 PNG of the captured frame (for callers that run visual analysis). */
    base64Screenshot: string;
    /** True when every attempt produced a blank frame (the last frame is stored anyway). */
    isBlank: boolean;
}

const DEFAULT_VIEWPORT: Viewport = { width: 1280, height: 720 };

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** One Cloudflare Browser Rendering snapshot attempt; returns base64 PNG. */
async function browserRenderingSnapshot(env: Env, url: string, viewport: Viewport): Promise<string> {
    const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/browser-rendering/snapshot`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url,
            viewport,
            gotoOptions: {
                waitUntil: 'networkidle2',
                timeout: SCREENSHOT_CONFIG.PAGE_LOAD_TIMEOUT,
            },
            waitForTimeout: SCREENSHOT_CONFIG.WAIT_FOR_TIMEOUT,
            screenshotOptions: {
                fullPage: false,
                type: 'png',
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Browser Rendering API failed: ${response.status} - ${errorText}`);
    }

    const result = (await response.json()) as {
        success: boolean;
        result: { screenshot: string; content: string };
    };

    if (!result.success || !result.result.screenshot) {
        throw new Error('Browser Rendering API succeeded but no screenshot returned');
    }

    return result.result.screenshot;
}

/** Upload the PNG to R2 (key screenshots/{appId}/latest.png) and persist the URL. */
async function storeScreenshot(env: Env, appId: string, base64Screenshot: string): Promise<string> {
    const screenshot: ImageAttachment = {
        id: appId,
        filename: 'latest.png',
        mimeType: 'image/png',
        base64Data: base64Screenshot,
    };
    const uploadedImage = await uploadImage(env, screenshot, ImageType.SCREENSHOTS);
    await new AppService(env).updateAppScreenshot(appId, uploadedImage.publicUrl);
    return uploadedImage.publicUrl;
}

/**
 * Capture a screenshot of `url` and store it as the preview thumbnail for `appId`.
 * Retries blank/failed frames with exponential backoff; if every attempt is blank
 * the last frame is stored anyway (matching the prior behaviour). Throws only when
 * no frame could be captured at all — callers decide how to surface that.
 */
export async function captureAndStoreScreenshot(
    env: Env,
    appId: string,
    url: string,
    viewport: Viewport = DEFAULT_VIEWPORT,
): Promise<CaptureResult> {
    if (!env.DB) {
        throw new Error('Cannot capture screenshot: DB not available');
    }
    if (!appId) {
        throw new Error('Cannot capture screenshot: appId not available');
    }
    if (!url) {
        throw new Error('URL is required for screenshot capture');
    }

    const maxRetries = SCREENSHOT_CONFIG.MAX_RETRIES;
    let lastError: Error | null = null;
    let lastBlankReason: string | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const base64Screenshot = await browserRenderingSnapshot(env, url, viewport);

            const blankDetection = detectBlankScreenshot(
                base64Screenshot,
                SCREENSHOT_CONFIG.MIN_FILE_SIZE,
                SCREENSHOT_CONFIG.MIN_ENTROPY,
            );

            if (blankDetection.isBlank) {
                lastBlankReason = blankDetection.reason;
                if (attempt < maxRetries) {
                    await delay(SCREENSHOT_CONFIG.RETRY_DELAY_BASE * Math.pow(2, attempt));
                    continue;
                }
            }

            const publicUrl = await storeScreenshot(env, appId, base64Screenshot);
            return { publicUrl, base64Screenshot, isBlank: blankDetection.isBlank };
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt < maxRetries) {
                await delay(SCREENSHOT_CONFIG.RETRY_DELAY_BASE * Math.pow(2, attempt));
            }
        }
    }

    throw new Error(
        `Screenshot capture failed: ${lastError?.message ?? lastBlankReason ?? 'Unknown error after retries'}`,
    );
}
