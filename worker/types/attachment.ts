/**
 * Generalized build attachments. Extends the image-only attachment model
 * (worker/types/image-attachment.ts, kept as the `image` branch) to any
 * allow-listed file a user attaches to a build. Text-like files are extracted
 * to plain text and injected into the blueprint as context; images keep the
 * existing multimodal path; rich documents (pdf/docx/xlsx/…) are added in a
 * follow-up (PR2) alongside their extractor.
 *
 * SECURITY: attachments are USER-SUPPLIED and never executed. Uploads are
 * validated three ways that must all agree — extension allow-list, declared
 * MIME, and content sniff (image magic bytes / UTF-8 text validity) — before
 * anything is stored. Only references (R2 keys) live in agent state, never
 * blobs; extracted text is wrapped as untrusted when interpolated into prompts.
 */

import { SUPPORTED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from './image-attachment';

/** Coarse category driving how an attachment reaches the model. */
export type AttachmentKind = 'image' | 'text' | 'document' | 'data';

/** Per-file cap for non-image attachments (25 MB). Images keep their 10 MB cap. */
export const MAX_ATTACHMENT_SIZE_BYTES = 25 * 1024 * 1024;

/** Max attachments accepted per build. */
export const MAX_ATTACHMENTS_PER_BUILD = 8;

/** R2 object key suffix for a file's extracted plain-text sibling. */
export const EXTRACTED_SUFFIX = 'extracted.md';

interface TypeSpec {
    kind: AttachmentKind;
    /** MIME types a browser may plausibly report for this extension. */
    mimes: readonly string[];
    /** Whether the content is decoded as UTF-8 text (vs. binary sniffed). */
    textLike: boolean;
}

/**
 * Allow-list keyed by lowercase extension. v1 (PR1): text-like files + images.
 * Rich documents (pdf/docx/xlsx/ods/odt/html/xml) join here in PR2 with their
 * `env.AI.toMarkdown` extractor — deliberately absent now so an upload of one
 * is rejected with a clear "not yet supported" message rather than stored
 * un-extractable.
 */
export const SUPPORTED_ATTACHMENT_TYPES: Readonly<Record<string, TypeSpec>> = {
    // Images — unchanged multimodal path.
    png: { kind: 'image', mimes: ['image/png'], textLike: false },
    jpg: { kind: 'image', mimes: ['image/jpeg'], textLike: false },
    jpeg: { kind: 'image', mimes: ['image/jpeg'], textLike: false },
    webp: { kind: 'image', mimes: ['image/webp'], textLike: false },
    // Prose / notes.
    txt: { kind: 'text', mimes: ['text/plain', ''], textLike: true },
    md: { kind: 'text', mimes: ['text/markdown', 'text/plain', ''], textLike: true },
    markdown: { kind: 'text', mimes: ['text/markdown', 'text/plain', ''], textLike: true },
    rtf: { kind: 'text', mimes: ['text/rtf', 'application/rtf', ''], textLike: true },
    // Structured data / config.
    json: { kind: 'data', mimes: ['application/json', 'text/plain', ''], textLike: true },
    yaml: { kind: 'data', mimes: ['application/x-yaml', 'text/yaml', 'text/plain', ''], textLike: true },
    yml: { kind: 'data', mimes: ['application/x-yaml', 'text/yaml', 'text/plain', ''], textLike: true },
    toml: { kind: 'data', mimes: ['application/toml', 'text/plain', ''], textLike: true },
    csv: { kind: 'data', mimes: ['text/csv', 'text/plain', ''], textLike: true },
    tsv: { kind: 'data', mimes: ['text/tab-separated-values', 'text/plain', ''], textLike: true },
    // Source code (common languages; extension is the signal — content is UTF-8).
    js: { kind: 'text', mimes: [], textLike: true },
    ts: { kind: 'text', mimes: [], textLike: true },
    jsx: { kind: 'text', mimes: [], textLike: true },
    tsx: { kind: 'text', mimes: [], textLike: true },
    py: { kind: 'text', mimes: [], textLike: true },
    rb: { kind: 'text', mimes: [], textLike: true },
    go: { kind: 'text', mimes: [], textLike: true },
    rs: { kind: 'text', mimes: [], textLike: true },
    java: { kind: 'text', mimes: [], textLike: true },
    php: { kind: 'text', mimes: [], textLike: true },
    c: { kind: 'text', mimes: [], textLike: true },
    h: { kind: 'text', mimes: [], textLike: true },
    cpp: { kind: 'text', mimes: [], textLike: true },
    cs: { kind: 'text', mimes: [], textLike: true },
    css: { kind: 'text', mimes: ['text/css', ''], textLike: true },
    sql: { kind: 'text', mimes: [], textLike: true },
    sh: { kind: 'text', mimes: [], textLike: true },
    env: { kind: 'text', mimes: [], textLike: true },
} as const;

/** A stored, processed attachment — references only, never blob data. */
export interface ProcessedAttachment {
    id: string;
    kind: AttachmentKind;
    filename: string;
    mimeType: string;
    size: number;
    /** R2 key of the original bytes (`uploads/<id>/<filename>`). */
    r2Key: string;
    /** Public URL (images only — served openly for previews; others gated). */
    publicUrl?: string;
    /** R2 key of the extracted plain-text sibling (text-like/document). */
    extractedKey?: string;
    /** Short inline excerpt of extracted text (bounded) for quick context. */
    excerpt?: string;
}

/** Lowercase extension of a filename, or '' when there is none. */
export function extensionOf(filename: string): string {
    const dot = filename.lastIndexOf('.');
    if (dot <= 0 || dot === filename.length - 1) return '';
    return filename.slice(dot + 1).toLowerCase();
}

const IMAGE_MAGIC: ReadonlyArray<{ mime: string; bytes: readonly number[] }> = [
    { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
    { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
    // WebP: "RIFF"??"WEBP" — check RIFF prefix + WEBP at offset 8.
    { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] },
];

function matchesMagic(bytes: Uint8Array, magic: readonly number[]): boolean {
    if (bytes.length < magic.length) return false;
    return magic.every((b, i) => bytes[i] === b);
}

/** True when a byte stream is valid, control-clean UTF-8 text (not binary). */
export function looksLikeUtf8Text(bytes: Uint8Array): boolean {
    // A NUL byte is the strongest binary tell; reject outright.
    const sample = bytes.subarray(0, Math.min(bytes.length, 65536));
    if (sample.includes(0)) return false;
    try {
        // `fatal` throws on malformed UTF-8 → a binary file masquerading as .txt.
        new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(sample);
        return true;
    } catch {
        return false;
    }
}

export type ClassifyResult =
    | { ok: true; ext: string; kind: AttachmentKind; textLike: boolean; mimeType: string }
    | { ok: false; reason: string };

/**
 * Validate an upload by extension + declared MIME + content sniff (all must
 * agree) and resolve its kind. Rejects anything not on the allow-list, size
 * overruns, and content that contradicts its extension (binary-as-.txt,
 * wrong image magic).
 */
export function classifyUpload(
    filename: string,
    declaredMime: string,
    bytes: Uint8Array,
): ClassifyResult {
    const ext = extensionOf(filename);
    if (!ext) {
        return { ok: false, reason: `"${filename}" has no file extension.` };
    }
    const spec = SUPPORTED_ATTACHMENT_TYPES[ext];
    if (!spec) {
        return { ok: false, reason: `.${ext} files aren't supported yet.` };
    }

    const sizeCap = spec.kind === 'image' ? MAX_IMAGE_SIZE_BYTES : MAX_ATTACHMENT_SIZE_BYTES;
    if (bytes.length > sizeCap) {
        return { ok: false, reason: `"${filename}" is larger than ${Math.round(sizeCap / (1024 * 1024))} MB.` };
    }
    if (bytes.length === 0) {
        return { ok: false, reason: `"${filename}" is empty.` };
    }

    const mime = (declaredMime || '').split(';')[0].trim().toLowerCase();

    if (spec.kind === 'image') {
        const magic = IMAGE_MAGIC.find((m) => matchesMagic(bytes, m.bytes));
        const webpOk = magic?.mime === 'image/webp'
            ? bytes.length >= 12 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
            : true;
        if (!magic || !webpOk || !SUPPORTED_IMAGE_MIME_TYPES.includes(magic.mime as never)) {
            return { ok: false, reason: `"${filename}" is not a valid PNG/JPEG/WebP image.` };
        }
        // JPEG reports both jpg/jpeg extensions; accept either against the magic.
        return { ok: true, ext, kind: 'image', textLike: false, mimeType: magic.mime };
    }

    // Text-like: declared MIME (when present) must be plausible AND the content
    // must actually be UTF-8 text.
    if (spec.mimes.length > 0 && mime && !spec.mimes.includes(mime)) {
        return { ok: false, reason: `"${filename}" has an unexpected content type (${mime}).` };
    }
    if (!looksLikeUtf8Text(bytes)) {
        return { ok: false, reason: `"${filename}" doesn't look like a valid text file.` };
    }
    return { ok: true, ext, kind: spec.kind, textLike: true, mimeType: mime || 'text/plain' };
}
