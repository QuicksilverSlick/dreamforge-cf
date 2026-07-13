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
    EXTRACTED_SUFFIX,
    SUMMARY_SUFFIX,
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

/** True when `key` is safe to read on behalf of `userId`. */
function isOwnedKey(key: string, prefix: string): boolean {
    return key.startsWith(prefix) && !key.includes('..');
}

/**
 * Fetch + budget the extracted text for a build's attachments. Skips refs with
 * no extracted text (e.g. an unextractable upload) and any whose key isn't
 * owned by `userId`. Best-effort per-ref: a missing/unreadable object is
 * dropped, never fatal. Order is preserved. When a document's full text
 * exceeds the remaining global budget, its upload-time AI summary is injected
 * instead (when present) — falling back to head-truncation only when there is
 * no summary.
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
        if (!isOwnedKey(key, prefix)) {
            logger.warn('Skipping attachment with non-owned extracted key', { userId, key });
            continue;
        }
        try {
            const obj = await env.TEMPLATES_BUCKET.get(key);
            if (!obj) continue;
            const full = await obj.text();
            if (full.trim().length === 0) continue;

            let text = full;
            let truncated = false;
            if (full.length > remaining) {
                truncated = true;
                // The summary sibling's key is DERIVED from the (already
                // owner-verified) extracted key — never client-supplied. Its
                // fetch is isolated: any summary failure degrades to
                // head-truncation, never to dropping the document.
                let summary: string | null = null;
                if (key.endsWith(`/${EXTRACTED_SUFFIX}`)) {
                    const summaryKey = key.slice(0, -EXTRACTED_SUFFIX.length) + SUMMARY_SUFFIX;
                    try {
                        const summaryObj = await env.TEMPLATES_BUCKET.get(summaryKey);
                        summary = summaryObj ? (await summaryObj.text()).trim() || null : null;
                    } catch (error) {
                        logger.warn('Failed to read attachment summary; falling back to truncation', {
                            summaryKey,
                            error: error instanceof Error ? error.message : String(error),
                        });
                    }
                }
                text = summary && summary.length <= remaining
                    ? summary
                    : full.slice(0, remaining);
            }
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
