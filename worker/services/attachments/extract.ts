/**
 * Attachment text extraction. v1 handles text-like files (UTF-8 decode +
 * bounded truncation). Rich documents (pdf/docx/xlsx/…) are dispatched here in
 * a follow-up via `env.AI.toMarkdown` — the seam is `extractAttachmentText`,
 * which returns a discriminated result so callers already handle the
 * "unsupported" and "too large" branches.
 *
 * NEVER executes content — it only decodes/parses bytes to text.
 */

import type { AttachmentKind } from '../../types/attachment';

/** Hard cap on extracted text kept per attachment (chars). Full text also
 * lives in R2; this bounds what a single excerpt/injection can cost. */
export const MAX_EXTRACTED_CHARS = 200_000;

/** Inline excerpt length surfaced without reading the full extracted object. */
export const EXCERPT_CHARS = 4_000;

export type ExtractResult =
    | { ok: true; text: string; truncated: boolean }
    | { ok: false; reason: string };

/**
 * Extract plain text from an attachment's bytes.
 * - text-like: UTF-8 decode, normalize newlines, truncate to MAX_EXTRACTED_CHARS.
 * - non-text (rich docs): not supported in v1 — returns { ok:false } so the
 *   upload still stores the original but carries no extracted sibling.
 */
export function extractAttachmentText(
    bytes: Uint8Array,
    opts: { textLike: boolean; kind: AttachmentKind },
): ExtractResult {
    if (!opts.textLike) {
        return { ok: false, reason: 'Text extraction for this file type is coming soon.' };
    }
    try {
        const decoded = new TextDecoder('utf-8', { fatal: false, ignoreBOM: true })
            .decode(bytes)
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n');
        const truncated = decoded.length > MAX_EXTRACTED_CHARS;
        const text = truncated ? decoded.slice(0, MAX_EXTRACTED_CHARS) : decoded;
        if (text.trim().length === 0) {
            return { ok: false, reason: 'File contained no readable text.' };
        }
        return { ok: true, text, truncated };
    } catch (error) {
        return { ok: false, reason: error instanceof Error ? error.message : 'Could not read the file as text.' };
    }
}

/** A short, single-line-safe excerpt of extracted text for inline display. */
export function excerptOf(text: string): string {
    const clean = text.slice(0, EXCERPT_CHARS);
    return text.length > EXCERPT_CHARS ? `${clean}…` : clean;
}
