/**
 * The server-side ref bound is the load-bearing cap on the authoritative build
 * path (the client cap is bypassable). Locks: dedupe by key, drop keyless refs,
 * and hard-cap at MAX_ATTACHMENTS_PER_BUILD so a crafted body can't amplify R2
 * reads / prompt size.
 */
import { describe, it, expect } from 'vitest';
import { boundAttachmentRefs, ownedAttachmentPrefix } from './resolve';
import { MAX_ATTACHMENTS_PER_BUILD, type AttachmentRef } from '../../types/attachment';

const ref = (id: string, extractedKey?: string): AttachmentRef => ({
    id,
    filename: `${id}.txt`,
    kind: 'text',
    extractedKey,
});

describe('ownedAttachmentPrefix', () => {
    it('scopes to the user id', () => {
        expect(ownedAttachmentPrefix('u1')).toBe('attachments/u1/');
    });
});

describe('boundAttachmentRefs', () => {
    it('drops refs with no extracted key', () => {
        const out = boundAttachmentRefs([ref('a'), ref('b', 'attachments/u/b/extracted.md')]);
        expect(out.map((r) => r.id)).toEqual(['b']);
    });

    it('dedupes by extracted key', () => {
        const k = 'attachments/u/x/extracted.md';
        const out = boundAttachmentRefs([ref('a', k), ref('b', k), ref('c', k)]);
        expect(out).toHaveLength(1);
    });

    it('caps at MAX_ATTACHMENTS_PER_BUILD regardless of body size', () => {
        const many = Array.from({ length: 5000 }, (_, i) => ref(`r${i}`, `attachments/u/${i}/extracted.md`));
        expect(boundAttachmentRefs(many)).toHaveLength(MAX_ATTACHMENTS_PER_BUILD);
    });
});
