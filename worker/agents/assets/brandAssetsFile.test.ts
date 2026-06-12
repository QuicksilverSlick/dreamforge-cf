/**
 * brand-assets module renderer tests: URL-bearing manifest entries become a
 * keyed module the coder imports, so models never hand-transcribe asset URLs.
 */

import { describe, expect, it } from 'vitest';
import { brandAssetEntries, renderBrandAssetsModule } from './brandAssetsFile';
import type { ImageAssetType } from '../schemas';

function asset(overrides: Partial<ImageAssetType>): ImageAssetType {
    return {
        path: 'public/logo.png',
        prompt: 'The brand logo',
        purpose: 'logo',
        width: null,
        height: null,
        url: 'https://app.getdreamforge.com/api/uploads/abc/asset.png',
        ...overrides,
    };
}

describe('brandAssetEntries', () => {
    it('keys the first asset per purpose bare and later ones with ordinals', () => {
        const entries = brandAssetEntries([
            asset({ purpose: 'logo' }),
            asset({ purpose: 'photo', url: 'https://x/1.webp' }),
            asset({ purpose: 'photo', url: 'https://x/2.webp' }),
            asset({ purpose: 'hero', url: 'https://x/h.webp' }),
        ]);
        expect(entries.map((entry) => entry.key)).toEqual(['logo', 'photo', 'photo2', 'hero']);
    });

    it('skips entries without a hosted url', () => {
        const entries = brandAssetEntries([asset({ url: null }), asset({ purpose: 'hero' })]);
        expect(entries.map((entry) => entry.key)).toEqual(['hero']);
    });
});

describe('renderBrandAssetsModule', () => {
    it('renders a typed module with exact URLs', () => {
        const source = renderBrandAssetsModule([
            asset({ url: 'https://app.getdreamforge.com/api/uploads/f9-c734/asset.webp', prompt: 'Storefront photo' }),
        ]);
        expect(source).toContain('export const BRAND_ASSETS = {');
        expect(source).toContain('"https://app.getdreamforge.com/api/uploads/f9-c734/asset.webp"');
        expect(source).toContain('Storefront photo');
        expect(source).toContain('DO NOT EDIT');
    });

    it('returns null when nothing is hosted', () => {
        expect(renderBrandAssetsModule([asset({ url: null })])).toBeNull();
        expect(renderBrandAssetsModule([])).toBeNull();
        expect(renderBrandAssetsModule(null)).toBeNull();
    });

    it('escapes comment terminators in descriptions', () => {
        const source = renderBrandAssetsModule([asset({ prompt: 'tricky */ comment' })]);
        expect(source).not.toContain('tricky */ comment');
    });
});
