/**
 * CF-OAuth user-gateway URL routing (review B1/B2 lock). buildGatewayUrl's
 * user-gateway branch returns BEFORE touching env, so it's pure — these assert it
 * constructs the user's gateway base URL exactly, and that an absent userGateway
 * never produces a user URL. The key↔URL coupling (cf-gateway keySource ⟺ user
 * gateway) is enforced in getConfigurationForModel; this locks the URL half.
 */
import { describe, it, expect } from 'vitest';
import { buildGatewayUrl, getConfigurationForModel } from './core';
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
