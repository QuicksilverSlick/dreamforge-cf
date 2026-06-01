/**
 * Per-model image-prompt skill selector. Given the provider, returns a
 * provider-tuned prompt for the asset. Keeps the ImageGenerationOperation
 * decoupled from provider-specific prompting.
 */
import type { ImageAssetRequest, ImagePromptContext, ImageProvider } from './types';
import { buildGptImage2Prompt } from './gptImage2';
import { buildNanoBananaProPrompt } from './nanoBananaPro';

export type { ImageAssetRequest, ImagePromptContext, ImageProvider } from './types';
export { buildGptImage2Prompt } from './gptImage2';
export { buildNanoBananaProPrompt } from './nanoBananaPro';

/** Select the provider-appropriate prompt builder. */
export function buildImagePrompt(
    provider: ImageProvider,
    asset: ImageAssetRequest,
    ctx: ImagePromptContext = {},
): string {
    return provider === 'gemini'
        ? buildNanoBananaProPrompt(asset, ctx)
        : buildGptImage2Prompt(asset, ctx);
}
