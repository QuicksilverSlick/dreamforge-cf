/**
 * The server-side ref bound is the load-bearing cap on the authoritative build
 * path (the client cap is bypassable). Locks: dedupe by key, drop keyless refs,
 * and hard-cap at MAX_ATTACHMENTS_PER_BUILD so a crafted body can't amplify R2
 * reads / prompt size.
 */
import { describe, it, expect } from 'vitest';
import { boundAttachmentRefs, ownedAttachmentPrefix, resolveAttachedDocuments } from './resolve';
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

describe('resolveAttachedDocuments summary preference', () => {
    const makeEnv = (objects: Record<string, string>, throwOn?: string) => ({
        TEMPLATES_BUCKET: {
            get: async (key: string) => {
                if (throwOn && key === throwOn) throw new Error('transient R2 error');
                return key in objects ? { text: async () => objects[key] } : null;
            },
        },
    }) as unknown as Env;

    const extractedKey = 'attachments/u1/doc1/extracted.md';
    const summaryKey = 'attachments/u1/doc1/summary.md'; // derived server-side
    const docRef = (): AttachmentRef => ({
        id: 'doc1',
        filename: 'big.pdf',
        kind: 'document',
        extractedKey,
    });

    it('injects full text when it fits the budget', async () => {
        const env = makeEnv({ [extractedKey]: 'short full text' });
        const docs = await resolveAttachedDocuments(env, 'u1', [docRef()]);
        expect(docs).toHaveLength(1);
        expect(docs[0]).toMatchObject({ text: 'short full text', truncated: false });
    });

    it('prefers the derived-key summary when full text exceeds the budget', async () => {
        const env = makeEnv({
            [extractedKey]: 'F'.repeat(60_000), // > 50k budget
            [summaryKey]: 'the summary',
        });
        const docs = await resolveAttachedDocuments(env, 'u1', [docRef()]);
        expect(docs).toHaveLength(1);
        expect(docs[0]).toMatchObject({ text: 'the summary', truncated: true });
    });

    it('head-truncates when oversized with no summary object', async () => {
        const env = makeEnv({ [extractedKey]: 'F'.repeat(60_000) });
        const docs = await resolveAttachedDocuments(env, 'u1', [docRef()]);
        expect(docs).toHaveLength(1);
        expect(docs[0].truncated).toBe(true);
        expect(docs[0].text).toHaveLength(50_000);
    });

    it('degrades to head-truncation when the summary fetch throws (never drops the doc)', async () => {
        const env = makeEnv({ [extractedKey]: 'F'.repeat(60_000) }, summaryKey);
        const docs = await resolveAttachedDocuments(env, 'u1', [docRef()]);
        expect(docs).toHaveLength(1);
        expect(docs[0].text).toHaveLength(50_000);
    });
});
