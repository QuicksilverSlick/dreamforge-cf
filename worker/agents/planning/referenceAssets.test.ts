/**
 * applyReferenceAssets tests: harvested own-site assets must take over the
 * blueprint's image manifest (skipping generation), while third-party and
 * fresh-start profiles never touch it.
 */

import { describe, expect, it } from 'vitest';
import { applyReferenceAssets } from './referenceAssets';
import type { ImageAssetType } from '../schemas';
import type { ReferenceSiteProfile } from '../../services/referenceSite/types';

function makeProfile(overrides: Partial<ReferenceSiteProfile> = {}): ReferenceSiteProfile {
    return {
        url: 'https://example-client.com/',
        status: 'complete',
        ownership: 'own-reuse',
        likes: ['images'],
        fetchedAt: 0,
        logo: { publicUrl: 'https://r2.example/logo.png', sourceUrl: 'https://example-client.com/logo.png' },
        images: [
            { publicUrl: 'https://r2.example/img-1.jpg', sourceUrl: 'https://example-client.com/a.jpg', alt: 'Storefront' },
            { publicUrl: 'https://r2.example/img-2.jpg', sourceUrl: 'https://example-client.com/b.jpg' },
        ],
        ...overrides,
    };
}

function makeAsset(overrides: Partial<ImageAssetType> = {}): ImageAssetType {
    return {
        path: 'public/logo.png',
        prompt: 'A modern logo',
        purpose: 'logo',
        width: null,
        height: null,
        url: null,
        ...overrides,
    };
}

describe('applyReferenceAssets', () => {
    it('binds the harvested logo and photos onto declared entries', () => {
        const result = applyReferenceAssets(
            [makeAsset(), makeAsset({ path: 'public/hero-image.jpg', purpose: 'hero', prompt: 'A hero image' })],
            makeProfile(),
        );
        expect(result?.[0].url).toBe('https://r2.example/logo.png');
        expect(result?.[1].url).toBe('https://r2.example/img-1.jpg');
    });

    it('appends unmatched harvested photos so phases can still reference them', () => {
        const result = applyReferenceAssets([makeAsset()], makeProfile());
        expect(result).toHaveLength(3);
        expect(result?.[1].url).toBe('https://r2.example/img-1.jpg');
        expect(result?.[1].prompt).toContain('Storefront');
        expect(result?.[2].url).toBe('https://r2.example/img-2.jpg');
        expect(result?.every((asset) => asset.url)).toBe(true);
    });

    it('appends a logo entry when the blueprint declared none', () => {
        const result = applyReferenceAssets(
            [makeAsset({ path: 'public/hero.jpg', purpose: 'hero' })],
            makeProfile({ images: [] }),
        );
        expect(result?.some((asset) => asset.purpose === 'logo' && asset.url === 'https://r2.example/logo.png')).toBe(true);
    });

    it('handles a null manifest by surfacing all harvested assets', () => {
        const result = applyReferenceAssets(null, makeProfile());
        expect(result).toHaveLength(3);
    });

    it('leaves already-resolved urls and icon entries alone', () => {
        const result = applyReferenceAssets(
            [
                makeAsset({ url: 'https://elsewhere.example/fixed.png' }),
                makeAsset({ path: 'public/favicon.png', purpose: 'icon', prompt: 'Favicon' }),
            ],
            makeProfile({ images: [] }),
        );
        expect(result?.[0].url).toBe('https://elsewhere.example/fixed.png');
        expect(result?.[1].url).toBeNull();
    });

    it('does nothing for style-only and own-fresh profiles', () => {
        const assets = [makeAsset()];
        expect(applyReferenceAssets(assets, makeProfile({ ownership: 'style-only' }))).toBe(assets);
        expect(applyReferenceAssets(assets, makeProfile({ ownership: 'own-fresh' }))).toBe(assets);
    });

    it('does nothing when nothing was harvested (failed ingestion)', () => {
        const assets = [makeAsset()];
        const profile = makeProfile({ status: 'failed', logo: undefined, images: undefined });
        expect(applyReferenceAssets(assets, profile)).toBe(assets);
    });
});
