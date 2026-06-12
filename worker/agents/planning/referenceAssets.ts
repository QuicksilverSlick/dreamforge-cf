/**
 * Binds harvested own-site assets (logo, photos) onto the blueprint's
 * imageAssets manifest after inference. Entries that receive a `url` here
 * skip image generation entirely and ride the hosted-images prompt block,
 * so every phase references the client's real assets instead of freshly
 * generated lookalikes.
 */

import type { ImageAssetType } from '../schemas';
import type { ReferenceSiteProfile } from '../../services/referenceSite/types';

/** Manifest purposes that harvested site photography can stand in for. */
const IMAGERY_PURPOSES: ReadonlySet<ImageAssetType['purpose']> = new Set([
    'hero',
    'photo',
    'illustration',
    'background',
    'avatar',
]);

export function applyReferenceAssets(
    assets: ImageAssetType[] | null,
    profile: ReferenceSiteProfile,
): ImageAssetType[] | null {
    if (profile.ownership !== 'own-reuse') {
        return assets;
    }
    const logo = profile.logo ?? null;
    const remaining = [...(profile.images ?? [])];
    if (!logo && remaining.length === 0) {
        return assets;
    }

    const bound = (assets ?? []).map((asset) => {
        if (asset.url) {
            return asset;
        }
        if (asset.purpose === 'logo' && logo) {
            return { ...asset, url: logo.publicUrl };
        }
        if (IMAGERY_PURPOSES.has(asset.purpose)) {
            const image = remaining.shift();
            if (image) {
                return { ...asset, url: image.publicUrl };
            }
        }
        return asset;
    });

    // Surface assets the blueprint did not declare slots for, so every
    // phase still sees them in the hosted-images manifest.
    if (logo && !bound.some((asset) => asset.purpose === 'logo')) {
        bound.push({
            path: 'public/brand/logo.png',
            prompt: `The client's existing brand logo from ${profile.url}`,
            purpose: 'logo',
            width: null,
            height: null,
            url: logo.publicUrl,
        });
    }
    bound.push(
        ...remaining.map((image, index) => ({
            path: `public/reference/photo-${index + 1}.png`,
            prompt: image.alt || `Photograph from the client's own website (${profile.url})`,
            purpose: 'photo' as const,
            width: null,
            height: null,
            url: image.publicUrl,
        })),
    );

    return bound;
}
