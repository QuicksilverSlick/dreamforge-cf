/**
 * Image generation provider layer.
 *
 * Frontier *coding* models output text only; real image assets come from
 * dedicated image models. We reach those models through the project's AI
 * Gateway provider-passthrough endpoints (the same gateway the text path
 * uses), which lets the gateway inject stored BYOK keys and apply
 * observability while running in Authenticated mode.
 *
 * Routing: GPT Image 2 (`gpt-image-2`, OpenAI Images API) is primary; Nano
 * Banana Pro (`gemini-3-pro-image`, Google AI Studio `generateContent`) is the
 * fallback. Each provider uses a different endpoint, request body, and response
 * envelope; both yield base64 image bytes we store in our own R2.
 *
 * Auth:
 *  - `cf-aig-authorization: Bearer CLOUDFLARE_AI_GATEWAY_TOKEN` authenticates to
 *    the gateway (it runs in Authenticated mode), as every text request does.
 *  - OpenAI uses BYOK: the key is stored in the gateway under a non-default
 *    alias, selected via `cf-aig-byok-alias`. No OpenAI key lives in the worker.
 *  - Google passes the worker's `GOOGLE_AI_STUDIO_API_KEY` straight through as
 *    the provider credential (`x-goog-api-key`); the gateway has no Google BYOK
 *    key, so provider-passthrough auth is used instead.
 *
 * The REST `/ai/run` endpoint is intentionally not used here: it authenticates
 * with `CLOUDFLARE_API_TOKEN`, which is scoped for deploys/gateway management
 * and lacks Workers AI permission, returning "10000: Authentication error".
 */
import { createLogger } from '../../logger';
import { base64ToUint8Array } from '../../utils/images';
import { isSupportedImageType, type SupportedImageMimeType } from '../../types/image-attachment';

const logger = createLogger('ImageGeneration');

export type ImageQuality = 'low' | 'medium' | 'high';

/** Image generation providers, in fallback order (primary first). */
export type ImageProvider = 'openai' | 'gemini';

/** Provider-native model id used against each gateway passthrough endpoint. */
export const IMAGE_MODEL_BY_PROVIDER: Record<ImageProvider, string> = {
    openai: 'gpt-image-2',
    gemini: 'gemini-3-pro-image',
};

/** Default provider attempt order: GPT Image 2 primary, Nano Banana Pro fallback. */
export const IMAGE_PROVIDER_ORDER: readonly ImageProvider[] = ['openai', 'gemini'];

/**
 * BYOK alias the OpenAI image key is stored under in the gateway, sent as
 * `cf-aig-byok-alias` so the gateway selects it for OpenAI passthrough requests.
 */
const OPENAI_BYOK_ALIAS = 'dreamforge_cf_image_gen';

export interface GenerateImageParams {
    /** Provider-tuned prompt describing the image to create. */
    prompt: string;
    /** Requested pixel size `WIDTHxHEIGHT` (mapped per-model). */
    size?: string;
    quality?: ImageQuality;
    /** For attribution / rate-limit accounting. */
    userId: string;
    /** Aborts the underlying provider request (e.g. a per-image timeout). */
    signal?: AbortSignal;
}

export interface GeneratedImage {
    /** Raw image bytes. */
    bytes: Uint8Array;
    mimeType: SupportedImageMimeType;
}

const OPENAI_SIZES = new Set(['1024x1024', '1024x1536', '1536x1024']);

function parseSize(size?: string): { width: number; height: number } | undefined {
    if (!size) return undefined;
    const match = /^(\d+)x(\d+)$/.exec(size.trim());
    if (!match) return undefined;
    return { width: Number(match[1]), height: Number(match[2]) };
}

/** Map a requested size to a GPT Image 2 supported size enum. */
function openaiSize(size?: string): string {
    if (size && OPENAI_SIZES.has(size)) return size;
    const parsed = parseSize(size);
    if (parsed) {
        if (parsed.width > parsed.height) return '1536x1024';
        if (parsed.height > parsed.width) return '1024x1536';
    }
    return '1024x1024';
}

/** Map a requested size to a Nano Banana Pro aspect-ratio enum. */
function geminiAspectRatio(size?: string): string {
    const parsed = parseSize(size);
    if (!parsed || parsed.width === parsed.height) return '1:1';
    return parsed.width > parsed.height ? '16:9' : '3:4';
}

/** Base URL for the project's AI Gateway (provider-passthrough root). */
function gatewayBaseUrl(env: Env): string {
    return `https://gateway.ai.cloudflare.com/v1/${env.CLOUDFLARE_ACCOUNT_ID}/${env.CLOUDFLARE_AI_GATEWAY}`;
}

/** Coerce a provider-reported MIME type to a supported one, defaulting to PNG. */
function toSupportedMime(mimeType: string | undefined): SupportedImageMimeType {
    return mimeType && isSupportedImageType(mimeType) ? mimeType : 'image/png';
}

interface OpenAIImageResponse {
    data?: Array<{ b64_json?: string; url?: string }>;
}

interface GeminiInlineData {
    data?: string;
    mimeType?: string;
}

interface GeminiImageResponse {
    candidates?: Array<{ content?: { parts?: Array<{ inlineData?: GeminiInlineData }> } }>;
}

/** Resolve a returned image reference (base64 or URL) to raw bytes. */
async function resolveToBytes(image: string, signal?: AbortSignal): Promise<Uint8Array> {
    if (image.startsWith('http://') || image.startsWith('https://')) {
        const response = await fetch(image, { signal });
        if (!response.ok) {
            throw new Error(`Failed to fetch generated image (${response.status})`);
        }
        return new Uint8Array(await response.arrayBuffer());
    }
    const base64 = image.startsWith('data:') ? image.slice(image.indexOf(',') + 1) : image;
    return base64ToUint8Array(base64);
}

/**
 * Generate an image with GPT Image 2 via the gateway's OpenAI Images
 * passthrough, using the stored BYOK key (selected by alias).
 */
async function runOpenAIImage(
    env: Env,
    model: string,
    params: GenerateImageParams,
): Promise<GeneratedImage> {
    const response = await fetch(`${gatewayBaseUrl(env)}/openai/images/generations`, {
        method: 'POST',
        signal: params.signal,
        headers: {
            'Content-Type': 'application/json',
            'cf-aig-authorization': `Bearer ${env.CLOUDFLARE_AI_GATEWAY_TOKEN}`,
            'cf-aig-byok-alias': OPENAI_BYOK_ALIAS,
        },
        body: JSON.stringify({
            model,
            prompt: params.prompt,
            size: openaiSize(params.size),
            quality: params.quality ?? 'medium',
            output_format: 'png',
            n: 1,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`OpenAI image '${model}' request failed (${response.status}): ${text.slice(0, 300)}`);
    }

    const envelope = await response.json() as OpenAIImageResponse;
    const entry = envelope.data?.[0];
    const reference = entry?.b64_json ?? entry?.url;
    if (!reference) {
        throw new Error(`OpenAI image '${model}' returned no image`);
    }

    return { bytes: await resolveToBytes(reference, params.signal), mimeType: 'image/png' };
}

/**
 * Generate an image with Nano Banana Pro via the gateway's Google AI Studio
 * `generateContent` passthrough, passing the worker's Google key through.
 */
async function runGeminiImage(
    env: Env,
    model: string,
    params: GenerateImageParams,
): Promise<GeneratedImage> {
    const response = await fetch(
        `${gatewayBaseUrl(env)}/google-ai-studio/v1beta/models/${model}:generateContent`,
        {
            method: 'POST',
            signal: params.signal,
            headers: {
                'Content-Type': 'application/json',
                'cf-aig-authorization': `Bearer ${env.CLOUDFLARE_AI_GATEWAY_TOKEN}`,
                'x-goog-api-key': env.GOOGLE_AI_STUDIO_API_KEY,
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: params.prompt }] }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    imageConfig: { aspectRatio: geminiAspectRatio(params.size) },
                },
            }),
        },
    );

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Gemini image '${model}' request failed (${response.status}): ${text.slice(0, 300)}`);
    }

    const envelope = await response.json() as GeminiImageResponse;
    const inline = envelope.candidates
        ?.flatMap((candidate) => candidate.content?.parts ?? [])
        .map((part) => part.inlineData)
        .find((data): data is GeminiInlineData => typeof data?.data === 'string');
    if (!inline?.data) {
        throw new Error(`Gemini image '${model}' returned no image`);
    }

    return { bytes: base64ToUint8Array(inline.data), mimeType: toSupportedMime(inline.mimeType) };
}

/**
 * Generate a single image with one specific provider. Throws on failure so
 * callers can fall back to another provider.
 */
export function generateImageWithProvider(
    env: Env,
    provider: ImageProvider,
    params: GenerateImageParams,
): Promise<GeneratedImage> {
    const model = IMAGE_MODEL_BY_PROVIDER[provider];
    return provider === 'openai'
        ? runOpenAIImage(env, model, params)
        : runGeminiImage(env, model, params);
}

/**
 * Generate a single image, trying providers in {@link IMAGE_PROVIDER_ORDER}
 * (primary then fallback). `buildPrompt` is invoked per attempt so each
 * provider receives a prompt tuned to its own skill guide. Throws only if
 * every provider fails.
 */
export async function generateImage(
    env: Env,
    buildPrompt: (provider: ImageProvider) => string,
    params: Omit<GenerateImageParams, 'prompt'>,
): Promise<{ image: GeneratedImage; provider: ImageProvider }> {
    let lastError: unknown;
    for (const provider of IMAGE_PROVIDER_ORDER) {
        try {
            const image = await generateImageWithProvider(env, provider, {
                ...params,
                prompt: buildPrompt(provider),
            });
            return { image, provider };
        } catch (error) {
            lastError = error;
            logger.warn(`Image model '${provider}' failed; trying next provider`, {
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    throw lastError instanceof Error ? lastError : new Error('All image providers failed');
}
