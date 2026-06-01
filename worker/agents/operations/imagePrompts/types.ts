/**
 * Shared types for per-model image-prompt "skill" guides.
 *
 * Each provider needs differently-structured prompts for best results (see
 * `gptImage2.ts` / `nanoBananaPro.ts`). A guide takes the manifest asset's
 * base description + light project context and returns a provider-tuned prompt
 * string for the Images API.
 */

/** A single requested image asset (mirrors the blueprint manifest entry). */
export interface ImageAssetRequest {
    /** Project-relative path the image will be written/referenced at. */
    path: string;
    /** Plain-language description of the desired image (from the model/user). */
    prompt: string;
    /** Asset role: 'logo' | 'icon' | 'hero' | 'illustration' | 'background' | 'avatar' | … */
    purpose: string;
    width?: number;
    height?: number;
}

/** Light project context used to keep generated assets on-brand. */
export interface ImagePromptContext {
    /** Blueprint color palette (hex/rgb/hsl strings), if available. */
    colorPalette?: string[];
    /** Short app/brand descriptor (e.g. blueprint name or query summary). */
    projectDescriptor?: string;
}

export type { ImageProvider } from '../../inferutils/imageGeneration';
