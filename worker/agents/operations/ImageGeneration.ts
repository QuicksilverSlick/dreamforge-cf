import { AgentOperation, OperationOptions } from './common';
import { buildImagePrompt } from './imagePrompts';
import type { ImageAssetType } from '../schemas';
import {
    generateImageWithProvider,
    IMAGE_PROVIDER_ORDER,
    type ImageProvider,
    type ImageQuality,
} from '../inferutils/imageGeneration';
import { uploadImageToR2, ImageType } from '../../utils/images';
import { generateNanoId } from '../../utils/idGenerator';
import { meterSparkAction } from '../../services/billing/metering';

/**
 * Per-image provider-call timeout. A hung provider request (network/gateway
 * stall) must not block the sequential generation loop — and thus the whole
 * build — indefinitely. On timeout the call aborts, the next provider is tried,
 * and a fully-failed asset is skipped (non-fatal) so the build continues.
 */
const IMAGE_GENERATION_TIMEOUT_MS = 90_000;

/** A successfully generated and stored image asset. */
export interface GeneratedImageResult {
    /** Project-relative path the asset was requested at (manifest key). */
    path: string;
    /** Public URL the asset is served from (`/api/generated/<id>/<file>`). */
    url: string;
    purpose: ImageAssetType['purpose'];
    /** Provider that produced the asset. */
    provider: ImageProvider;
}

export interface ImageGenerationInputs {
    /** Assets to generate (typically the manifest entries without a `url`). */
    assets: ImageAssetType[];
    /** Default render quality (cost guardrail). */
    quality?: ImageQuality;
    /** Per-asset progress callback (1-based index). */
    onImageGenerated?: (result: GeneratedImageResult, index: number, total: number) => void;
    /** Per-asset failure callback — surfaces the provider error (path + reason). */
    onImageError?: (path: string, error: string) => void;
}

/** Filename to store an asset under, derived from its manifest path. */
function fileNameForAsset(path: string): string {
    const segments = path.split('/');
    const last = segments[segments.length - 1]?.trim();
    return last && last.length > 0 ? last : 'image.png';
}

function sizeForAsset(asset: ImageAssetType): string {
    return asset.width && asset.height ? `${asset.width}x${asset.height}` : '1024x1024';
}

/**
 * Generates the blueprint's declared image assets via dedicated image models
 * (GPT Image 2 primary, Nano Banana Pro fallback), stores each in R2 under
 * `generated/<id>/<file>`, and returns the public URLs. Each provider attempt
 * uses a prompt tuned to that model's skill guide. A per-asset failure is
 * non-fatal — it is skipped so the build still completes.
 */
export class ImageGenerationOperation extends AgentOperation<ImageGenerationInputs, GeneratedImageResult[]> {
    async execute(
        inputs: ImageGenerationInputs,
        options: OperationOptions,
    ): Promise<GeneratedImageResult[]> {
        const { env, logger, context, inferenceContext } = options;
        const { blueprint } = context;
        const userId = inferenceContext.userId;
        const quality: ImageQuality = inputs.quality ?? 'medium';

        const promptContext = {
            colorPalette: blueprint.colorPalette,
            projectDescriptor: blueprint.description || blueprint.title,
        };

        const total = inputs.assets.length;

        // Generate all assets concurrently rather than one-at-a-time: a build
        // should not wait out the sum of every image's latency. Each call is
        // independently timed out and failure-isolated, so one slow/failed
        // asset never holds up the others. Progress fires in completion order
        // (a shared counter, safe under the single-threaded event loop) so the
        // UI can populate images as they arrive.
        let completed = 0;
        const settled = await Promise.all(
            inputs.assets.map(async (asset) => {
                try {
                    const result = await this.generateAndStore(env, asset, promptContext, userId, quality, {
                        orgId: inferenceContext.orgId,
                        agentId: options.agentId,
                        shouldUseUserKey: inferenceContext.shouldUseUserKey,
                    });
                    completed += 1;
                    inputs.onImageGenerated?.(result, completed, total);
                    logger.info('Generated image asset', {
                        path: result.path,
                        provider: result.provider,
                        url: result.url,
                    });
                    return result;
                } catch (error) {
                    completed += 1;
                    const message = error instanceof Error ? error.message : String(error);
                    logger.error('Failed to generate image asset; skipping', {
                        path: asset.path,
                        error: message,
                    });
                    inputs.onImageError?.(asset.path, message);
                    return null;
                }
            }),
        );

        return settled.filter((result): result is GeneratedImageResult => result !== null);
    }

    private async generateAndStore(
        env: Env,
        asset: ImageAssetType,
        promptContext: { colorPalette?: string[]; projectDescriptor?: string },
        userId: string,
        quality: ImageQuality,
        meter: { orgId?: string; agentId: string; shouldUseUserKey?: boolean },
    ): Promise<GeneratedImageResult> {
        const size = sizeForAsset(asset);

        // Sparks metering: each generated image = 65 Sparks (spec §0.2 +
        // §6.4 leak fix). Debited ONCE per asset, before the provider loop,
        // so provider-fallback retries never double-charge. Fails closed —
        // the thrown error is caught by the caller and the asset is skipped
        // non-fatally (the build continues without it).
        const imageMeter = await meterSparkAction(env, {
            orgId: meter.orgId,
            userId,
            actionType: 'image',
            agentId: meter.agentId,
            callId: `image:${generateNanoId()}`,
            shouldUseUserKey: meter.shouldUseUserKey,
        });
        if (!imageMeter.ok) {
            throw new Error(imageMeter.reason ?? 'Out of Sparks for image generation');
        }

        let lastError: unknown;
        for (const provider of IMAGE_PROVIDER_ORDER) {
            try {
                const image = await generateImageWithProvider(env, provider, {
                    prompt: buildImagePrompt(provider, asset, promptContext),
                    size,
                    quality,
                    userId,
                    signal: AbortSignal.timeout(IMAGE_GENERATION_TIMEOUT_MS),
                });

                const { url } = await uploadImageToR2(
                    env,
                    {
                        id: generateNanoId(),
                        filename: fileNameForAsset(asset.path),
                        mimeType: image.mimeType,
                        base64Data: '',
                    },
                    ImageType.GENERATED,
                    undefined,
                    image.bytes,
                );

                return { path: asset.path, url, purpose: asset.purpose, provider };
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError instanceof Error ? lastError : new Error(`All providers failed for ${asset.path}`);
    }
}
