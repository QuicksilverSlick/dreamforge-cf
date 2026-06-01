/**
 * Nano Banana Pro (Gemini 3 Pro Image) prompt "skill" guide.
 *
 * Best practices (Google guides, June 2026): direct the scene rather than
 * listing keywords — `[Subject + Adjectives] doing [Action] in [Location] +
 * [Composition/Camera] + [Lighting] + [Style]`; for any text, specify the exact
 * string in quotes (Nano Banana Pro excels at text rendering); name subjects
 * for cross-image consistency. Per-purpose presets encode that scene-direction
 * structure.
 */
import type { ImageAssetRequest, ImagePromptContext } from './types';

function styleSuffix(ctx: ImagePromptContext): string {
    const palette = ctx.colorPalette && ctx.colorPalette.length
        ? ` Color palette: ${ctx.colorPalette.slice(0, 4).join(', ')}.`
        : '';
    const brand = ctx.projectDescriptor ? ` Brand: ${ctx.projectDescriptor}.` : '';
    return palette + brand;
}

/** Build a Nano Banana Pro prompt using scene-direction structure. */
export function buildNanoBananaProPrompt(asset: ImageAssetRequest, ctx: ImagePromptContext): string {
    const base = asset.prompt.trim();
    const purpose = asset.purpose.toLowerCase();
    const style = styleSuffix(ctx);

    if (purpose.includes('logo') || purpose.includes('icon')) {
        return `Subject: a minimalist, modern ${purpose} — ${base}. ` +
            `Composition: centered, single mark, generous padding, flat vector aesthetic. ` +
            `Lighting: even, no shadows. Style: clean geometric, high contrast, app-ready.` +
            style + ` Render no text unless explicitly described.`;
    }

    if (purpose.includes('hero') || purpose.includes('banner') || purpose.includes('background')) {
        return `Subject: ${base}. Action/Setting: a hero scene for a web application. ` +
            `Composition: wide framing with clear negative space for overlaid UI text. ` +
            `Camera: cinematic wide angle. Lighting: soft, atmospheric. Style: polished, professional, on-brand.` +
            style;
    }

    if (purpose.includes('avatar') || purpose.includes('portrait') || purpose.includes('photo')) {
        return `Subject: ${base}. Composition: tight portrait framing. ` +
            `Camera: 50mm, shallow depth of field. Lighting: soft key light, natural. ` +
            `Style: photorealistic, authentic texture and color.` + style;
    }

    return `Subject: ${base}. Composition: balanced with a clear focal point. ` +
        `Lighting: soft and natural. Style: cohesive modern illustration for a web app.` + style +
        ` Render no text unless explicitly described.`;
}
