/**
 * Renders the mechanically-written `src/lib/brand-assets.ts` module for
 * generated projects. Hosted image-asset URLs contain long unguessable ids
 * that language models reliably mistranscribe when typing them into code
 * (verified: corrupted hex tails → 404s → broken images). The coder is
 * instructed to import this module and reference assets by short key; the
 * URLs themselves are written here by the pipeline, never by the model.
 */

import type { ImageAssetType } from '../schemas';

export const BRAND_ASSETS_MODULE_PATH = 'src/lib/brand-assets.ts';

interface BrandAssetEntry {
    key: string;
    url: string;
    purpose: ImageAssetType['purpose'];
    description: string;
}

/**
 * Stable, readable keys: the first asset of a purpose gets the bare purpose
 * name (`logo`, `hero`), later ones get ordinals (`photo1`, `photo2`).
 */
export function brandAssetEntries(assets: ImageAssetType[]): BrandAssetEntry[] {
    const counts = new Map<string, number>();
    const entries: BrandAssetEntry[] = [];
    for (const asset of assets) {
        if (!asset.url) continue;
        const seen = counts.get(asset.purpose) ?? 0;
        counts.set(asset.purpose, seen + 1);
        entries.push({
            key: seen === 0 ? asset.purpose : `${asset.purpose}${seen + 1}`,
            url: asset.url,
            purpose: asset.purpose,
            description: asset.prompt,
        });
    }
    return entries;
}

/**
 * The TypeScript source of the module, or null when no hosted assets exist.
 */
export function renderBrandAssetsModule(assets: ImageAssetType[] | null | undefined): string | null {
    const entries = brandAssetEntries(assets ?? []);
    if (entries.length === 0) {
        return null;
    }
    const lines = entries.map((entry) => {
        const comment = entry.description ? `    /** ${entry.description.replace(/\*\//g, '*\\/').slice(0, 160)} */\n` : '';
        return `${comment}    ${entry.key}: ${JSON.stringify(entry.url)},`;
    });
    return `/**
 * Hosted image assets for this project — written by the build pipeline.
 * DO NOT EDIT and DO NOT hand-copy these URLs elsewhere: import this module
 * and reference assets by key (e.g. \`<img src={BRAND_ASSETS.logo} />\`).
 */

export const BRAND_ASSETS = {
${lines.join('\n')}
} as const;

export type BrandAssetKey = keyof typeof BRAND_ASSETS;
`;
}
