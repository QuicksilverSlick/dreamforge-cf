/**
 * Attachment classification is the security gate for user-supplied build
 * files: extension allow-list + declared MIME + content sniff must all agree.
 * These lock the accept/reject boundary — especially binary-masquerading-as-
 * text and mismatched image magic, the paths an attacker would probe.
 */
import { describe, it, expect } from 'vitest';
import {
    classifyUpload,
    extensionOf,
    looksLikeUtf8Text,
    MAX_ATTACHMENT_SIZE_BYTES,
} from './attachment';

const enc = (s: string) => new TextEncoder().encode(s);

describe('extensionOf', () => {
    it('extracts a lowercase extension, or empty', () => {
        expect(extensionOf('notes.TXT')).toBe('txt');
        expect(extensionOf('archive.tar.gz')).toBe('gz');
        expect(extensionOf('Dockerfile')).toBe('');
        expect(extensionOf('.gitignore')).toBe('');
        expect(extensionOf('trailing.')).toBe('');
    });
});

describe('looksLikeUtf8Text', () => {
    it('accepts clean UTF-8 and rejects NUL / invalid bytes', () => {
        expect(looksLikeUtf8Text(enc('hello — café 你好'))).toBe(true);
        expect(looksLikeUtf8Text(new Uint8Array([0x68, 0x00, 0x69]))).toBe(false); // NUL
        expect(looksLikeUtf8Text(new Uint8Array([0xff, 0xfe, 0x00, 0x01]))).toBe(false); // binary
    });
});

describe('classifyUpload', () => {
    it('accepts a text file whose content is valid UTF-8', () => {
        const r = classifyUpload('spec.md', 'text/markdown', enc('# Title\nbody'));
        expect(r.ok).toBe(true);
        if (r.ok) { expect(r.kind).toBe('text'); expect(r.textLike).toBe(true); }
    });

    it('accepts a data file (csv/json) and tags its kind', () => {
        expect(classifyUpload('data.csv', 'text/csv', enc('a,b\n1,2')).ok).toBe(true);
        const j = classifyUpload('config.json', 'application/json', enc('{"a":1}'));
        expect(j.ok && j.kind).toBe('data');
    });

    it('accepts source code by extension even with no declared MIME', () => {
        expect(classifyUpload('main.py', '', enc('print(1)')).ok).toBe(true);
    });

    it('rejects an unsupported / not-yet-supported extension', () => {
        expect(classifyUpload('deck.pptx', 'application/vnd.ms-powerpoint', enc('x')).ok).toBe(false);
        expect(classifyUpload('movie.mp4', 'video/mp4', enc('x')).ok).toBe(false);
        expect(classifyUpload('noext', '', enc('x')).ok).toBe(false);
    });

    it('rejects a binary file masquerading as .txt (content sniff)', () => {
        const binary = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00, 0x01]); // zip magic
        const r = classifyUpload('sneaky.txt', 'text/plain', binary);
        expect(r.ok).toBe(false);
    });

    it('rejects a declared MIME that contradicts the extension', () => {
        const r = classifyUpload('data.csv', 'application/octet-stream', enc('a,b'));
        expect(r.ok).toBe(false);
    });

    it('rejects oversize and empty files', () => {
        expect(classifyUpload('big.txt', 'text/plain', new Uint8Array(MAX_ATTACHMENT_SIZE_BYTES + 1)).ok).toBe(false);
        expect(classifyUpload('empty.txt', 'text/plain', new Uint8Array(0)).ok).toBe(false);
    });

    it('validates image magic bytes and rejects a fake image', () => {
        const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
        const okPng = classifyUpload('logo.png', 'image/png', png);
        expect(okPng.ok && okPng.kind).toBe('image');
        const fake = classifyUpload('logo.png', 'image/png', enc('not really a png'));
        expect(fake.ok).toBe(false);
    });
});

describe('classifyUpload (rich documents)', () => {
    const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]); // %PDF-1.7
    const zipBytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00]); // PK

    it('accepts a PDF with correct magic and tags it document', () => {
        const result = classifyUpload('spec.pdf', 'application/pdf', pdfBytes);
        expect(result).toMatchObject({ ok: true, kind: 'document', textLike: false, mimeType: 'application/pdf' });
    });

    it('accepts ZIP-container Office/OpenDocument formats', () => {
        for (const name of ['report.docx', 'data.xlsx', 'notes.odt', 'sheet.ods']) {
            const result = classifyUpload(name, '', zipBytes);
            expect(result).toMatchObject({ ok: true, kind: 'document', textLike: false });
        }
    });

    it('rejects a document whose magic contradicts its extension', () => {
        expect(classifyUpload('fake.pdf', 'application/pdf', zipBytes).ok).toBe(false);
        expect(classifyUpload('fake.docx', '', pdfBytes).ok).toBe(false);
        const utf8 = new TextEncoder().encode('hello world, plain text');
        expect(classifyUpload('fake.xlsx', '', utf8).ok).toBe(false);
    });

    it('accepts vendor/variant MIMEs for documents — container magic is the gate', () => {
        expect(classifyUpload('report.docx', 'application/wps-office.docx', zipBytes).ok).toBe(true);
        expect(classifyUpload('spec.pdf', 'application/x-pdf', pdfBytes).ok).toBe(true);
        expect(classifyUpload('spec.pdf', 'application/octet-stream', pdfBytes).ok).toBe(true);
    });

    it('defaults the canonical MIME when the browser omits it', () => {
        const result = classifyUpload('spec.pdf', '', pdfBytes);
        expect(result.ok && result.mimeType).toBe('application/pdf');
    });
});
