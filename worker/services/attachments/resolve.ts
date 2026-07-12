/**
 * Resolve client-supplied attachment references into extracted document text
 * for blueprint injection — with two hard guarantees:
 *  1. OWNERSHIP: an `extractedKey` is only read when it lives under this
 *     user's own prefix (`attachments/<userId>/…`). A client cannot point the
 *     build at another user's R2 object.
 *  2. BUDGET: total injected text is capped at
 *     {@link ATTACHMENT_INJECTION_BUDGET_CHARS} across all attachments, so a
 *     pile of large docs can't blow the blueprint's context window.
 */

import {
    ATTACHMENT_INJECTION_BUDGET_CHARS,
    MAX_ATTACHMENTS_PER_BUILD,
    type AttachmentRef,
    type AttachedDocument,
} from '../../types/attachment';
import { createLogger } from '../../logger';

const logger = createLogger('AttachmentResolve');

/** R2 key prefix that scopes an attachment to a user (matches the controller). */
export function ownedAttachmentPrefix(userId: string): string {
    return `attachments/${userId}/`;
}

/**
 * Bound the client-supplied refs on the AUTHORITATIVE server path: keep only
 * those with an extracted key, dedupe by that key, and cap at the documented
 * per-build limit. The client enforces the same cap, but a build can be posted
 * directly — this makes the cap real (and bounds R2 reads / prompt growth).
 */
export function boundAttachmentRefs(refs: AttachmentRef[]): AttachmentRef[] {
    const seen = new Set<string>();
    const bounded: AttachmentRef[] = [];
    for (const ref of refs) {
        if (!ref.extractedKey || seen.has(ref.extractedKey)) continue;
        seen.add(ref.extractedKey);
        bounded.push(ref);
        if (bounded.length >= MAX_ATTACHMENTS_PER_BUILD) break;
    }
    return bounded;
}

/**
 * Fetch + budget the extracted text for a build's attachments. Skips refs with
 * no extracted text (e.g. an unextractable upload) and any whose key isn't
 * owned by `userId`. Best-effort per-ref: a missing/unreadable object is
 * dropped, never fatal. Order is preserved; later docs are truncated (or
 * omitted) once the global budget is exhausted.
 */
export async function resolveAttachedDocuments(
    env: Env,
    userId: string,
    refs: AttachmentRef[] | undefined,
): Promise<AttachedDocument[]> {
    if (!refs || refs.length === 0) return [];
    const prefix = ownedAttachmentPrefix(userId);
    const docs: AttachedDocument[] = [];
    let remaining = ATTACHMENT_INJECTION_BUDGET_CHARS;

    for (const ref of boundAttachmentRefs(refs)) {
        if (remaining <= 0) break;
        const key = ref.extractedKey;
        if (!key) continue;
        if (!key.startsWith(prefix) || key.includes('..')) {
            logger.warn('Skipping attachment with non-owned extracted key', { userId, key });
            continue;
        }
        try {
            const obj = await env.TEMPLATES_BUCKET.get(key);
            if (!obj) continue;
            const full = await obj.text();
            if (full.trim().length === 0) continue;
            const truncated = full.length > remaining;
            const text = truncated ? full.slice(0, remaining) : full;
            remaining -= text.length;
            docs.push({ filename: ref.filename, kind: ref.kind, text, truncated });
        } catch (error) {
            logger.warn('Failed to read attachment extracted text', {
                key,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    return docs;
}
