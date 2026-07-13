/**
 * Attachment text extraction. Text-like files decode as UTF-8 (bounded
 * truncation); rich documents (pdf/docx/xlsx/odt/ods) convert to markdown via
 * Cloudflare's `env.AI.toMarkdown`.
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
 * Per-file cap for env.AI.toMarkdown conversion — its request envelope tops
 * out around 4 MB. Larger rich documents are stored but carry no extracted
 * text (surfaced to the user as a per-file note at upload).
 */
export const MAX_TOMARKDOWN_BYTES = 4 * 1024 * 1024;

/**
 * Convert a rich document (pdf/docx/xlsx/odt/ods) to markdown via
 * `env.AI.toMarkdown`, truncated to MAX_EXTRACTED_CHARS. Best-effort: any
 * conversion failure returns { ok:false } and the upload still stores the
 * original bytes.
 */
export async function extractRichDocumentText(
    env: Env,
    filename: string,
    mimeType: string,
    bytes: Uint8Array,
): Promise<ExtractResult> {
    if (bytes.length > MAX_TOMARKDOWN_BYTES) {
        return {
            ok: false,
            reason: `"${filename}" is too large to read (${Math.round(MAX_TOMARKDOWN_BYTES / (1024 * 1024))} MB max for documents) — attached without text.`,
        };
    }
    try {
        const result = await env.AI.toMarkdown({
            name: filename,
            blob: new Blob([bytes], { type: mimeType }),
        });
        if (!result || result.format !== 'markdown' || typeof result.data !== 'string') {
            return { ok: false, reason: `Could not read "${filename}" — attached without text.` };
        }
        const truncated = result.data.length > MAX_EXTRACTED_CHARS;
        const text = truncated ? result.data.slice(0, MAX_EXTRACTED_CHARS) : result.data;
        if (text.trim().length === 0) {
            return { ok: false, reason: `"${filename}" contained no readable text.` };
        }
        return { ok: true, text, truncated };
    } catch (error) {
        return {
            ok: false,
            reason: `Could not read "${filename}": ${error instanceof Error ? error.message : 'conversion failed'}`,
        };
    }
}

/**
 * Extract plain text from a TEXT-LIKE attachment's bytes: UTF-8 decode,
 * normalize newlines, truncate to MAX_EXTRACTED_CHARS. Rich documents go
 * through {@link extractRichDocumentText} instead.
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
