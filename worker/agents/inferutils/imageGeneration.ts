/**
 * Image generation provider layer.
 *
 * Frontier *coding* models output text only; real image assets come from
 * dedicated image models. This calls them through the OpenAI-style Images API
 * ("/images/generations", base64 response), routed via Cloudflare AI Gateway
 * using the same configuration/auth path as text inference
 * ({@link getConfigurationForModel}).
 *
 * Routing decision: GPT Image 2 (OpenAI) is primary; Nano Banana Pro
 * (Google `gemini-3-pro-image`) is the fallback. The bracket forms below force
 * provider routing in `getConfigurationForModel` (`[openai]` → AI Gateway
 * OpenAI route + `OPENAI_API_KEY`; `[gemini]` → Google's OpenAI-compatible
 * endpoint + `GOOGLE_AI_STUDIO_API_KEY`).
 */
import { getConfigurationForModel } from './core';
import { createLogger } from '../../logger';
import type { SupportedImageMimeType } from '../../types/image-attachment';

const logger = createLogger('ImageGeneration');

export type ImageQuality = 'low' | 'medium' | 'high';

/** Image-generation providers, in fallback order (primary first). */
export type ImageProvider = 'openai' | 'gemini';

/**
 * Model spec per provider (bracket form forces provider routing in
 * {@link getConfigurationForModel}).
 */
export const IMAGE_MODEL_BY_PROVIDER: Record<ImageProvider, string> = {
    openai: '[openai]gpt-image-2',
    gemini: '[gemini]gemini-3-pro-image',
};

/** Default provider attempt order: GPT Image 2 primary, Nano Banana Pro fallback. */
export const IMAGE_PROVIDER_ORDER: readonly ImageProvider[] = ['openai', 'gemini'];

/** @deprecated Use {@link IMAGE_MODEL_BY_PROVIDER}. */
export const IMAGE_MODEL_PRIMARY = IMAGE_MODEL_BY_PROVIDER.openai;
/** @deprecated Use {@link IMAGE_MODEL_BY_PROVIDER}. */
export const IMAGE_MODEL_FALLBACK = IMAGE_MODEL_BY_PROVIDER.gemini;

export interface GenerateImageParams {
    /** Provider-tuned prompt describing the image to create. */
    prompt: string;
    /** `WIDTHxHEIGHT`, e.g. `1024x1024` (width/height divisible by 16). */
    size?: string;
    quality?: ImageQuality;
    /** For per-user key resolution / rate-limit attribution. */
    userId: string;
}

export interface GeneratedImage {
    /** Base64-encoded image bytes (no data-URI prefix). */
    base64: string;
    mimeType: SupportedImageMimeType;
}

interface ImagesApiResponse {
    data?: Array<{ b64_json?: string }>;
    error?: { message?: string };
}

/**
 * Build the Images-API endpoint from a (possibly trailing-slashed) gateway
 * base URL. Pure — unit-testable without network.
 */
export function buildImagesEndpoint(baseURL: string): string {
    return `${baseURL.replace(/\/+$/, '')}/images/generations`;
}

async function callImagesApi(
    env: Env,
    modelSpec: string,
    params: GenerateImageParams,
): Promise<GeneratedImage> {
    const { baseURL, apiKey, defaultHeaders } = await getConfigurationForModel(modelSpec, env, params.userId);
    const model = modelSpec.replace(/\[.*?\]/, '');
    const endpoint = buildImagesEndpoint(baseURL);

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            ...(defaultHeaders ?? {}),
        },
        body: JSON.stringify({
            model,
            prompt: params.prompt,
            size: params.size ?? '1024x1024',
            quality: params.quality ?? 'medium',
            n: 1,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Image model '${model}' request failed (${response.status}): ${text.slice(0, 300)}`);
    }

    const json = await response.json() as ImagesApiResponse;
    const base64 = json.data?.[0]?.b64_json;
    if (!base64) {
        throw new Error(`Image model '${model}' returned no image data${json.error?.message ? `: ${json.error.message}` : ''}`);
    }
    return { base64, mimeType: 'image/png' };
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
    return callImagesApi(env, IMAGE_MODEL_BY_PROVIDER[provider], params);
}

/**
 * Generate a single image, trying providers in {@link IMAGE_PROVIDER_ORDER}
 * (primary then fallback). `buildPrompt` is invoked per attempt so each
 * provider receives a prompt tuned to its own skill guide. Throws only if
 * every provider fails (callers treat a per-asset failure as non-fatal so the
 * build still completes).
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
    throw lastError instanceof Error
        ? lastError
        : new Error('All image providers failed');
}
