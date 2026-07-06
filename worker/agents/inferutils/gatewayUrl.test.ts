/**
 * CF-OAuth user-gateway URL routing (review B1/B2 lock). buildGatewayUrl's
 * user-gateway branch returns BEFORE touching env, so it's pure — these assert it
 * constructs the user's gateway base URL exactly, and that an absent userGateway
 * never produces a user URL. The key↔URL coupling (cf-gateway keySource ⟺ user
 * gateway) is enforced in getConfigurationForModel; this locks the URL half.
 *
 * The first two suites only exercise the FALLBACK-to-platform branches (the
 * test env has no encryption key, so the token never decrypts). The third suite
 * encrypts a real blob so the POSITIVE branch is locked too: a decryptable,
 * user-bound, non-expired token must yield keySource 'cf-gateway' paired with
 * the user gateway URL — and the rejection paths (wrong user, expired) must fall
 * cleanly back to a platform key on the platform URL.
 */
import { describe, it, expect } from 'vitest';
import { buildGatewayUrl, getConfigurationForModel } from './core';
import { encryptTokens } from '../../utils/tokenEncryption';
import type { AIGatewayProviders } from './config.types';

/** Minimal env: a configured platform gateway URL + token, no D1/CF-encryption key. */
const platformEnv = {
    CLOUDFLARE_AI_GATEWAY_URL: 'https://gw.example.com/plat',
    CLOUDFLARE_AI_GATEWAY_TOKEN: 'platform-gateway-token-xxxxxxxx',
} as unknown as Env;
const USER_GW_HOST = 'gateway.ai.cloudflare.com';

describe('buildGatewayUrl — user gateway routing', () => {
    const userGateway = { accountId: 'acct123', gatewaySlug: 'my-gw' };

    it('routes to the user gateway /compat when a userGateway is given', async () => {
        const url = await buildGatewayUrl({} as Env, undefined, userGateway);
        expect(url).toBe('https://gateway.ai.cloudflare.com/v1/acct123/my-gw/compat');
    });

    it('appends the provider segment for a provider override on the user gateway', async () => {
        const url = await buildGatewayUrl({} as Env, 'openai' as AIGatewayProviders, userGateway);
        expect(url).toBe('https://gateway.ai.cloudflare.com/v1/acct123/my-gw/openai');
    });

    it('does NOT build a user URL when userGateway is null (falls through to platform logic)', async () => {
        // With a configured platform gateway URL and no userGateway, the user
        // gateway host must never appear.
        const url = await buildGatewayUrl(platformEnv, undefined, null);
        expect(url).not.toContain(USER_GW_HOST);
        expect(url).toBe('https://gw.example.com/plat/compat');
    });
});

describe('getConfigurationForModel — key↔URL coupling (review B1/B2)', () => {
    const gateway = { accountId: 'acct123', gatewaySlug: 'my-gw' };

    it('flag-off / not-over-tier → platform key + platform gateway + wholesaling header', async () => {
        const cfg = await getConfigurationForModel('openai/gpt-4o', platformEnv, 'u1', undefined, false);
        expect(cfg.keySource).toBe('platform');
        expect(cfg.baseURL).not.toContain(USER_GW_HOST);
        expect(cfg.defaultHeaders?.['cf-aig-authorization']).toBeUndefined(); // apiKey === gateway token here
    });

    it('B1: shouldUseUserKey + token but NO gateway → platform (never a cf-gateway key, never a user URL)', async () => {
        const cfg = await getConfigurationForModel(
            'openai/gpt-4o', platformEnv, 'u1', undefined, true, 'some-encrypted-blob', null,
        );
        expect(cfg.keySource).not.toBe('cf-gateway'); // no gateway → no user token used
        expect(cfg.baseURL).not.toContain(USER_GW_HOST);
    });

    it('B2: shouldUseUserKey + gateway but UNDECRYPTABLE token → platform key + platform URL (no platform key on a user URL)', async () => {
        const cfg = await getConfigurationForModel(
            'openai/gpt-4o', platformEnv, 'u1', undefined, true, 'undecryptable-blob', gateway,
        );
        // Decrypt fails (no CF_OAUTH_ENCRYPTION_KEY in env) → falls through to platform.
        expect(cfg.keySource).toBe('platform');
        // The load-bearing invariant: a platform key must NEVER be paired with the
        // user's gateway URL.
        expect(cfg.baseURL).not.toContain(USER_GW_HOST);
        expect(cfg.baseURL).toBe('https://gw.example.com/plat/compat');
    });
});

describe('getConfigurationForModel — positive coupling (decryptable token)', () => {
    const gateway = { accountId: 'acct123', gatewaySlug: 'my-gw' };
    // Same platform env as above PLUS an encryption key, so an encrypted token
    // blob actually decrypts and the cf-gateway branch can be reached.
    const cfEnv = {
        ...platformEnv,
        CF_OAUTH_ENCRYPTION_KEY: 'test-cf-oauth-encryption-key-0123456789abcdef',
    } as unknown as Env;
    const USER_GW_URL = 'https://gateway.ai.cloudflare.com/v1/acct123/my-gw/compat';

    async function blobFor(userId: string, expiresAt: number): Promise<string> {
        return encryptTokens(
            { accessToken: 'cf-user-access-token-abcdef123456', expiresAt, userId },
            cfEnv,
        );
    }

    it('decryptable, user-bound, live token + gateway → cf-gateway key ON the user gateway URL', async () => {
        const blob = await blobFor('u1', Date.now() + 3_600_000);
        const cfg = await getConfigurationForModel('openai/gpt-4o', cfEnv, 'u1', undefined, true, blob, gateway);
        // The positive half of the coupling: key and URL agree on the user gateway.
        expect(cfg.keySource).toBe('cf-gateway');
        expect(cfg.baseURL).toBe(USER_GW_URL);
        // The user's gateway authenticates with the user token, so the platform
        // wholesaling header must NOT ride along.
        expect(cfg.defaultHeaders?.['cf-aig-authorization']).toBeUndefined();
    });

    it('token bound to a DIFFERENT user → rejected → platform key + platform URL', async () => {
        // getAccessTokenFromBlob enforces the userId binding (anti-replay).
        const blob = await blobFor('someone-else', Date.now() + 3_600_000);
        const cfg = await getConfigurationForModel('openai/gpt-4o', cfEnv, 'u1', undefined, true, blob, gateway);
        expect(cfg.keySource).not.toBe('cf-gateway');
        expect(cfg.baseURL).not.toContain(USER_GW_HOST);
        expect(cfg.baseURL).toBe('https://gw.example.com/plat/compat');
    });

    it('expired token → rejected → platform key + platform URL (no user token on a user URL)', async () => {
        const blob = await blobFor('u1', Date.now() - 1_000);
        const cfg = await getConfigurationForModel('openai/gpt-4o', cfEnv, 'u1', undefined, true, blob, gateway);
        expect(cfg.keySource).toBe('platform');
        expect(cfg.baseURL).toBe('https://gw.example.com/plat/compat');
    });

    it('runtime user key wins over cf-gateway and routes the PLATFORM gateway (never the user URL)', async () => {
        // Adapted from upstream d8a2526e: a caller-supplied credential must not
        // change WHOSE gateway the request is routed to. Runtime keys are the
        // fork's only request-supplied credential; even with a decryptable user
        // token + selected gateway present, they stay on the platform gateway
        // with the wholesaling header — only 'cf-gateway' rides the user URL.
        const blob = await blobFor('u1', Date.now() + 3_600_000);
        const cfg = await getConfigurationForModel(
            'openai/gpt-4o', cfEnv, 'u1', { openai: 'user-runtime-key-abcdef123456' }, true, blob, gateway,
        );
        expect(cfg.keySource).toBe('runtime');
        expect(cfg.apiKey).toBe('user-runtime-key-abcdef123456');
        expect(cfg.baseURL).not.toContain(USER_GW_HOST);
        expect(cfg.baseURL).toBe('https://gw.example.com/plat/compat');
        expect(cfg.defaultHeaders?.['cf-aig-authorization']).toBe('Bearer platform-gateway-token-xxxxxxxx');
    });
});

describe('buildGatewayUrl — user gateway origin pinning (upstream d8a2526e)', () => {
    // The user-gateway branch is the fork's only user-linked base URL. Its
    // origin must be structurally unforgeable: whatever the stored account id
    // or gateway slug contains, the request may only ever go to
    // gateway.ai.cloudflare.com — a credential can never be redirected to an
    // attacker-controlled host via a poisoned D1 gateway row.
    const PINNED_ORIGIN = `https://${USER_GW_HOST}`;
    const hostileGateways: Array<[string, { accountId: string; gatewaySlug: string }]> = [
        ['path traversal', { accountId: '../../evil', gatewaySlug: 'gw' }],
        ['embedded authority', { accountId: 'acct@evil.com', gatewaySlug: 'gw' }],
        ['scheme smuggling', { accountId: 'https://evil.com', gatewaySlug: 'gw' }],
        ['query + fragment injection', { accountId: 'acct', gatewaySlug: 'gw?x=1#f' }],
        ['backslash separators', { accountId: 'acct\\evil.com', gatewaySlug: 'gw' }],
        ['protocol-relative', { accountId: '', gatewaySlug: '//evil.com' }],
    ];

    it.each(hostileGateways)('stays on the pinned origin: %s', async (_label, gw) => {
        const url = await buildGatewayUrl({} as Env, undefined, gw);
        expect(new URL(url).origin).toBe(PINNED_ORIGIN);
    });

    it('encodes account and slug as single path segments (no path/query rewriting)', async () => {
        const url = await buildGatewayUrl({} as Env, undefined, { accountId: 'a/b', gatewaySlug: 'c?d' });
        const parsed = new URL(url);
        expect(parsed.origin).toBe(PINNED_ORIGIN);
        expect(parsed.pathname).toBe('/v1/a%2Fb/c%3Fd/compat');
        expect(parsed.search).toBe('');
        expect(parsed.hash).toBe('');
    });
});
