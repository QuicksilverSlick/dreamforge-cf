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

const logger = createLogger('ImageGeneration');

export type ImageQuality = 'low' | 'medium' | 'high';

/** Primary/fallback image models (bracket form forces provider routing). */
export const IMAGE_MODEL_PRIMARY = '[openai]gpt-image-2';
export const IMAGE_MODEL_FALLBACK = '[gemini]gemini-3-pro-image';

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
    mimeType: string;
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
 * Generate a single image, trying the primary provider then the fallback.
 * Throws only if both providers fail (callers treat a per-asset failure as
 * non-fatal so the build still completes).
 */
export async function generateImage(env: Env, params: GenerateImageParams): Promise<GeneratedImage> {
    try {
        return await callImagesApi(env, IMAGE_MODEL_PRIMARY, params);
    } catch (primaryError) {
        logger.warn('Primary image model failed; trying fallback', {
            error: primaryError instanceof Error ? primaryError.message : String(primaryError),
        });
        return await callImagesApi(env, IMAGE_MODEL_FALLBACK, params);
    }
}
