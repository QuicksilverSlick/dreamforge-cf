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

        const results: GeneratedImageResult[] = [];
        const total = inputs.assets.length;

        for (let i = 0; i < total; i++) {
            const asset = inputs.assets[i];
            try {
                const result = await this.generateAndStore(env, asset, promptContext, userId, quality);
                results.push(result);
                inputs.onImageGenerated?.(result, i + 1, total);
                logger.info('Generated image asset', {
                    path: result.path,
                    provider: result.provider,
                    url: result.url,
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                logger.error('Failed to generate image asset; skipping', {
                    path: asset.path,
                    error: message,
                });
                inputs.onImageError?.(asset.path, message);
            }
        }

        return results;
    }

    private async generateAndStore(
        env: Env,
        asset: ImageAssetType,
        promptContext: { colorPalette?: string[]; projectDescriptor?: string },
        userId: string,
        quality: ImageQuality,
    ): Promise<GeneratedImageResult> {
        const size = sizeForAsset(asset);

        let lastError: unknown;
        for (const provider of IMAGE_PROVIDER_ORDER) {
            try {
                const image = await generateImageWithProvider(env, provider, {
                    prompt: buildImagePrompt(provider, asset, promptContext),
                    size,
                    quality,
                    userId,
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
