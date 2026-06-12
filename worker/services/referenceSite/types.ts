/**
 * Reference-site ingestion types: the profile extracted from a website the
 * user pointed at during the intake interview.
 * Plan: memory project_reference_site_ingestion / spec §3 Phase 4.
 */

import type { ProcessedImageAttachment } from '../../types/image-attachment';

/**
 * Consent tier from the interview. Asset and content harvesting only happens
 * with an "it's my site, reuse it" attestation; third-party sites contribute
 * style tokens and an internal screenshot only — never their assets.
 */
export type ReferenceOwnership = 'own-reuse' | 'own-fresh' | 'style-only';

export interface ReferencePaletteEntry {
    /** CSS color value as computed (rgb()/rgba()/hex). */
    color: string;
    /** Occurrence count across sampled elements. */
    count: number;
}

export interface ReferenceFontEntry {
    /** Where the font was observed: body, heading, button, nav. */
    role: string;
    family: string;
}

export interface ReferenceStyleTokens {
    palette: ReferencePaletteEntry[];
    cssVariables: Record<string, string>;
    fonts: ReferenceFontEntry[];
    /** Hosted font stylesheet URLs (Google Fonts, Typekit, …). */
    fontLinks: string[];
    borderRadii: string[];
    boxShadows: string[];
    themeColor: string | null;
}

export interface ReferenceAsset {
    publicUrl: string;
    sourceUrl: string;
    alt?: string;
}

export interface ReferenceSiteProfile {
    url: string;
    status: 'complete' | 'partial' | 'failed';
    failureReason?: string;
    ownership: ReferenceOwnership;
    /** What the user said they like (interview chip ids). */
    likes: string[];
    fetchedAt: number;
    styleTokens?: ReferenceStyleTokens;
    meta?: {
        title?: string;
        description?: string;
    };
    /** Qualitative design-system description from the vision pass. */
    visionDescription?: string;
    /**
     * Viewport screenshot stored in R2 (base64 stripped before persisting)
     * — passed as a multimodal image to blueprint generation.
     */
    screenshot?: ProcessedImageAttachment;
    /** Harvested only with own-site reuse consent. */
    logo?: ReferenceAsset;
    images?: ReferenceAsset[];
    /** Page text content (capped), only with own-site reuse consent. */
    contentText?: string;
}

/** Raw shape returned by the in-page probe script. */
export interface ProbeResult {
    palette: ReferencePaletteEntry[];
    cssVariables: Record<string, string>;
    fonts: ReferenceFontEntry[];
    fontLinks: string[];
    borderRadii: string[];
    boxShadows: string[];
    themeColor: string | null;
    title: string;
    description: string;
    logoCandidates: { url: string; source: string }[];
    imageCandidates: { url: string; alt: string; area: number }[];
    contentText: string;
}
