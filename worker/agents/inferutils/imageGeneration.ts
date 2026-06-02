/**
 * Image generation provider layer.
 *
 * Frontier *coding* models output text only; real image assets come from
 * dedicated image models. Cloudflare exposes these as proxied catalog models
 * invoked through the Workers AI binding (`env.AI.run(model, input)`), routed
 * via the project's AI Gateway for BYOK/observability. This is NOT the OpenAI
 * `/images/generations` compat path — that endpoint only proxies
 * `/chat/completions`.
 *
 * Routing: GPT Image 2 (`openai/gpt-image-2`) is primary; Nano Banana Pro
 * (`google/nano-banana-pro`) is the fallback. Each model takes a different
 * input shape and returns `{ result: { image } }` where `image` is a URL (or
 * data URI / base64); we resolve it to raw bytes for storage in our own R2.
 */
import { createLogger } from '../../logger';
import { base64ToUint8Array } from '../../utils/images';
import type { SupportedImageMimeType } from '../../types/image-attachment';

const logger = createLogger('ImageGeneration');

export type ImageQuality = 'low' | 'medium' | 'high';

/** Image generation providers, in fallback order (primary first). */
export type ImageProvider = 'openai' | 'gemini';

/** Cloudflare AI catalog model id per provider. */
export const IMAGE_MODEL_BY_PROVIDER: Record<ImageProvider, string> = {
    openai: 'openai/gpt-image-2',
    gemini: 'google/nano-banana-pro',
};

/** Default provider attempt order: GPT Image 2 primary, Nano Banana Pro fallback. */
export const IMAGE_PROVIDER_ORDER: readonly ImageProvider[] = ['openai', 'gemini'];

export interface GenerateImageParams {
    /** Provider-tuned prompt describing the image to create. */
    prompt: string;
    /** Requested pixel size `WIDTHxHEIGHT` (mapped per-model). */
    size?: string;
    quality?: ImageQuality;
    /** For attribution / rate-limit accounting. */
    userId: string;
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

/** Build the model-specific input payload. */
function buildInput(modelId: string, params: GenerateImageParams): Record<string, unknown> {
    if (modelId.startsWith('openai/')) {
        return {
            prompt: params.prompt,
            quality: params.quality ?? 'medium',
            size: openaiSize(params.size),
            output_format: 'png',
        };
    }
    return {
        prompt: params.prompt,
        aspect_ratio: geminiAspectRatio(params.size),
        image_size: '2K',
        output_format: 'png',
    };
}

/** Extract the image string from the various result envelope shapes. */
function extractImageString(response: AiRunEnvelope): string | undefined {
    if (typeof response.image === 'string') return response.image;

    const result = response.result;
    if (typeof result === 'string') return result;
    if (result && typeof result.image === 'string') return result.image;
    return undefined;
}

/** Resolve a returned image reference (URL, data URI, or base64) to raw bytes. */
async function resolveToBytes(image: string): Promise<Uint8Array> {
    if (image.startsWith('http://') || image.startsWith('https://')) {
        const response = await fetch(image);
        if (!response.ok) {
            throw new Error(`Failed to fetch generated image (${response.status})`);
        }
        return new Uint8Array(await response.arrayBuffer());
    }
    const base64 = image.startsWith('data:') ? image.slice(image.indexOf(',') + 1) : image;
    return base64ToUint8Array(base64);
}

interface AiRunEnvelope {
    result?: { image?: string } | string;
    image?: string;
    success?: boolean;
    errors?: Array<{ message?: string }>;
}

/**
 * Invoke a catalog image model through the AI Gateway REST endpoint
 * (`POST /accounts/{id}/ai/run`) authenticated with the Cloudflare API token.
 *
 * Why REST and not the `env.AI` binding: routing the binding through the
 * project's Authenticated gateway returned "2021: Invalid User Credentials"
 * because the binding's GatewayOptions cannot carry the required
 * `cf-aig-authorization` token. The REST endpoint authenticates with the
 * account API token instead, needs no provider keys (third-party models are
 * billed via Unified Billing), and auto-routes through the account's default
 * gateway so logging/caching still apply.
 */
async function runImageModel(
    env: Env,
    modelId: string,
    params: GenerateImageParams,
): Promise<GeneratedImage> {
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: modelId, input: buildInput(modelId, params) }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Image model '${modelId}' request failed (${response.status}): ${text.slice(0, 300)}`);
    }

    const envelope = await response.json() as AiRunEnvelope;
    if (envelope.success === false) {
        const message = envelope.errors?.map((e) => e.message).filter(Boolean).join('; ') || 'unknown error';
        throw new Error(`Image model '${modelId}' returned an error: ${message}`);
    }

    const image = extractImageString(envelope);
    if (!image) {
        throw new Error(`Image model '${modelId}' returned no image`);
    }

    return { bytes: await resolveToBytes(image), mimeType: 'image/png' };
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
    return runImageModel(env, IMAGE_MODEL_BY_PROVIDER[provider], params);
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
