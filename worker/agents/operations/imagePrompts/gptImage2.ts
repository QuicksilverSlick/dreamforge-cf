/**
 * GPT Image 2 prompt "skill" guide.
 *
 * Best practices (OpenAI cookbook, June 2026): structure beats length — layer
 * the prompt as subject → style → lighting → composition → constraints; put
 * exact copy in quotes; for UI describe the product "as if it already exists";
 * for photographs "describe the photograph, not the fantasy" (lens, light,
 * texture). Per-purpose presets below encode that.
 */
import type { ImageAssetRequest, ImagePromptContext } from './types';

function paletteClause(ctx: ImagePromptContext): string {
    if (!ctx.colorPalette || ctx.colorPalette.length === 0) return '';
    return ` Use a palette aligned with ${ctx.colorPalette.slice(0, 4).join(', ')}.`;
}

function brandClause(ctx: ImagePromptContext): string {
    return ctx.projectDescriptor ? ` Brand context: ${ctx.projectDescriptor}.` : '';
}

/** Build a GPT Image 2 prompt for an asset, layered per OpenAI guidance. */
export function buildGptImage2Prompt(asset: ImageAssetRequest, ctx: ImagePromptContext): string {
    const base = asset.prompt.trim();
    const palette = paletteClause(ctx);
    const brand = brandClause(ctx);
    const purpose = asset.purpose.toLowerCase();

    if (purpose.includes('logo') || purpose.includes('icon')) {
        return `A clean, modern ${purpose} for a web application: ${base}. ` +
            `Flat vector style, crisp edges, simple geometric forms, high contrast, centered, ` +
            `transparent or solid background, no photographic texture, no drop shadows.` +
            palette + brand +
            ` Constraints: no text unless explicitly requested, no watermark, single subject, ample padding.`;
    }

    if (purpose.includes('hero') || purpose.includes('banner') || purpose.includes('background')) {
        return `A polished hero/background image for a web app, described as part of a shipped product: ${base}. ` +
            `Cinematic composition, soft natural lighting, generous negative space for overlaid UI text, ` +
            `professional and on-brand, subtle depth.` + palette + brand +
            ` Constraints: no embedded UI chrome, no lorem-ipsus text, no watermark.`;
    }

    if (purpose.includes('avatar') || purpose.includes('portrait') || purpose.includes('photo')) {
        return `A realistic photograph: ${base}. ` +
            `Describe as a real photo — 50mm lens, soft key light, shallow depth of field, ` +
            `natural skin/material texture, believable ordinary background detail.` + brand +
            ` Constraints: no text, no watermark, photorealistic (not illustration).`;
    }

    // Default: illustration / general asset.
    return `A high-quality illustration for a web application: ${base}. ` +
        `Cohesive modern style, clear focal subject, balanced composition, soft lighting.` +
        palette + brand +
        ` Constraints: no text unless requested, no watermark, single coherent scene.`;
}
