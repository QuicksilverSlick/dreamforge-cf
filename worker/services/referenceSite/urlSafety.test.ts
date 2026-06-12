/**
 * URL-safety tests: the SSRF posture for user-supplied reference sites and
 * the free-text URL extractor the interview branches on.
 */

import { describe, expect, it } from 'vitest';
import { extractUrlFromText, validateReferenceUrl } from './urlSafety';

describe('validateReferenceUrl', () => {
    it('accepts ordinary https sites', () => {
        const result = validateReferenceUrl('https://www.7shifts.com/features');
        expect(result.ok).toBe(true);
    });

    it('rejects non-http schemes', () => {
        expect(validateReferenceUrl('ftp://example.com').ok).toBe(false);
        expect(validateReferenceUrl('javascript:alert(1)').ok).toBe(false);
        expect(validateReferenceUrl('file:///etc/passwd').ok).toBe(false);
    });

    it('rejects IP literals, localhost, and internal names', () => {
        expect(validateReferenceUrl('https://192.168.1.1/admin').ok).toBe(false);
        expect(validateReferenceUrl('https://[::1]/').ok).toBe(false);
        expect(validateReferenceUrl('https://localhost:8787').ok).toBe(false);
        expect(validateReferenceUrl('https://router.local').ok).toBe(false);
        expect(validateReferenceUrl('https://service.internal/x').ok).toBe(false);
        expect(validateReferenceUrl('https://intranet').ok).toBe(false);
    });

    it('blocks our own platform surfaces', () => {
        expect(validateReferenceUrl('https://app.getdreamforge.com/settings').ok).toBe(false);
        expect(validateReferenceUrl('https://getdreamforge.com').ok).toBe(false);
        expect(validateReferenceUrl('https://api.cloudflare.com/client/v4').ok).toBe(false);
    });

    it('rejects embedded credentials', () => {
        expect(validateReferenceUrl('https://user:pass@example.com').ok).toBe(false);
    });
});

describe('extractUrlFromText', () => {
    it('finds explicit URLs in conversational answers', () => {
        expect(extractUrlFromText('I really love how https://linear.app feels')).toBe('https://linear.app/');
    });

    it('normalizes bare domains and www mentions', () => {
        expect(extractUrlFromText('something like www.7shifts.com would be great')).toBe('https://www.7shifts.com/');
        expect(extractUrlFromText('check out stripe.com.')).toBe('https://stripe.com/');
    });

    it('returns null for plain prose and unsafe URLs', () => {
        expect(extractUrlFromText('clean and modern, lots of white space')).toBeNull();
        expect(extractUrlFromText('use http://localhost:3000 as reference')).toBeNull();
        expect(extractUrlFromText('https://app.getdreamforge.com/chat/123')).toBeNull();
    });
});
