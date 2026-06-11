/**
 * SecretsService tests — the BYOK security surface.
 *
 * Runs against the real D1 schema (migrations applied from the
 * TEST_MIGRATIONS binding, see vitest.config.ts). The properties under test
 * are the ones BYOK re-enablement depends on:
 *   - secrets are encrypted at rest and never returned in API shapes
 *   - decryption is bound to the owning user (anti-theft AAD), so a
 *     ciphertext re-parented onto another user's row never decrypts
 *   - the inference lookup honors isActive, expiry, and provider scoping
 *   - BYOK provider keys upsert (one live key per provider per user)
 */

import { env, applyD1Migrations } from 'cloudflare:test';
import type { D1Migration } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import { SecretsService } from './SecretsService';

declare module 'cloudflare:test' {
    interface ProvidedEnv extends Env {
        TEST_MIGRATIONS: D1Migration[];
    }
}

const USER_A = 'test-user-a';
const USER_B = 'test-user-b';
const OPENAI_BYOK_TEMPLATE_TYPE = 'OPENAI_API_KEY_BYOK';
const USER_A_OPENAI_KEY = 'sk-proj-test-user-a-openai-key-000000000001';

async function insertUser(id: string): Promise<void> {
    await env.DB.prepare(
        'INSERT INTO users (id, email, display_name, provider, provider_id) VALUES (?, ?, ?, ?, ?)'
    )
        .bind(id, `${id}@example.com`, id, 'github', `provider-${id}`)
        .run();
}

function storeOpenAIByokKey(service: SecretsService, userId: string, value: string) {
    return service.storeSecret(userId, {
        name: 'OpenAI (BYOK)',
        provider: 'openai',
        secretType: OPENAI_BYOK_TEMPLATE_TYPE,
        value,
        description: null,
        expiresAt: null,
    });
}

beforeAll(async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
    await insertUser(USER_A);
    await insertUser(USER_B);
});

describe('SecretsService BYOK', () => {
    it('stores a secret encrypted at rest with a masked preview', async () => {
        const service = new SecretsService(env);
        const stored = await storeOpenAIByokKey(service, USER_A, USER_A_OPENAI_KEY);

        expect(stored.userId).toBe(USER_A);
        expect(stored.isActive).toBe(true);
        expect(stored.keyPreview).toMatch(/^sk-p\*+0001$/);
        expect(Object.keys(stored)).not.toContain('encryptedValue');

        const row = await env.DB.prepare(
            'SELECT encrypted_value FROM user_secrets WHERE id = ?'
        )
            .bind(stored.id)
            .first<{ encrypted_value: string }>();
        expect(row).not.toBeNull();
        expect(row!.encrypted_value).not.toContain(USER_A_OPENAI_KEY);
    });

    it('round-trips the key through the BYOK lookup paths for the owner', async () => {
        const service = new SecretsService(env);
        await storeOpenAIByokKey(service, USER_A, USER_A_OPENAI_KEY);

        const keyMap = await service.getUserBYOKKeysMap(USER_A);
        expect(keyMap.get('openai')).toBe(USER_A_OPENAI_KEY);

        const single = await service.getUserBYOKKeyForProvider(USER_A, 'openai');
        expect(single).toBe(USER_A_OPENAI_KEY);
    });

    it('returns nothing for providers without a stored key or unknown providers', async () => {
        const service = new SecretsService(env);
        await storeOpenAIByokKey(service, USER_A, USER_A_OPENAI_KEY);

        expect(await service.getUserBYOKKeyForProvider(USER_A, 'anthropic')).toBeNull();
        expect(await service.getUserBYOKKeyForProvider(USER_A, 'not-a-provider')).toBeNull();
        expect(await service.getUserBYOKKeyForProvider(USER_B, 'openai')).toBeNull();
    });

    it('never decrypts a ciphertext re-parented onto another user (anti-theft)', async () => {
        const service = new SecretsService(env);
        const stored = await storeOpenAIByokKey(service, USER_A, USER_A_OPENAI_KEY);

        const row = await env.DB.prepare(
            'SELECT encrypted_value, key_preview FROM user_secrets WHERE id = ?'
        )
            .bind(stored.id)
            .first<{ encrypted_value: string; key_preview: string }>();

        // Simulate a cross-user leak: user B ends up with user A's ciphertext
        // (query bug, direct DB tampering, or a row-copy attack).
        await env.DB.prepare(
            `INSERT INTO user_secrets (id, user_id, name, provider, secret_type, encrypted_value, key_preview, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
        )
            .bind(
                'stolen-secret-row',
                USER_B,
                'OpenAI (BYOK)',
                'openai',
                OPENAI_BYOK_TEMPLATE_TYPE,
                row!.encrypted_value,
                row!.key_preview
            )
            .run();

        expect(await service.getUserBYOKKeyForProvider(USER_B, 'openai')).toBeNull();
        const keyMapB = await service.getUserBYOKKeysMap(USER_B);
        expect(keyMapB.has('openai')).toBe(false);
        await expect(service.getSecretValue(USER_B, 'stolen-secret-row')).rejects.toThrow();
    });

    it('upserts BYOK keys: storing twice keeps one row with the new value', async () => {
        const service = new SecretsService(env);
        const first = await storeOpenAIByokKey(service, USER_A, USER_A_OPENAI_KEY);
        const replacementKey = 'sk-proj-test-user-a-openai-key-000000000002';
        const second = await storeOpenAIByokKey(service, USER_A, replacementKey);

        expect(second.id).toBe(first.id);
        const count = await env.DB.prepare(
            'SELECT COUNT(*) AS n FROM user_secrets WHERE user_id = ? AND secret_type = ?'
        )
            .bind(USER_A, OPENAI_BYOK_TEMPLATE_TYPE)
            .first<{ n: number }>();
        expect(count!.n).toBe(1);

        expect(await service.getUserBYOKKeyForProvider(USER_A, 'openai')).toBe(replacementKey);
    });

    it('excludes deactivated and expired keys from the inference lookup', async () => {
        const service = new SecretsService(env);
        const stored = await storeOpenAIByokKey(service, USER_A, USER_A_OPENAI_KEY);

        const toggled = await service.toggleSecretActiveStatus(USER_A, stored.id);
        expect(toggled.isActive).toBe(false);
        expect(await service.getUserBYOKKeyForProvider(USER_A, 'openai')).toBeNull();

        await service.toggleSecretActiveStatus(USER_A, stored.id);
        expect(await service.getUserBYOKKeyForProvider(USER_A, 'openai')).toBe(USER_A_OPENAI_KEY);

        await env.DB.prepare('UPDATE user_secrets SET expires_at = ? WHERE id = ?')
            .bind(Math.floor(Date.now() / 1000) - 60, stored.id)
            .run();
        expect(await service.getUserBYOKKeyForProvider(USER_A, 'openai')).toBeNull();
        const keyMap = await service.getUserBYOKKeysMap(USER_A);
        expect(keyMap.has('openai')).toBe(false);
    });

    it('does not let one user toggle or delete another user\'s secret', async () => {
        const service = new SecretsService(env);
        const stored = await storeOpenAIByokKey(service, USER_A, USER_A_OPENAI_KEY);

        await expect(service.toggleSecretActiveStatus(USER_B, stored.id)).rejects.toThrow(
            'Secret not found or access denied'
        );

        await service.deleteSecret(USER_B, stored.id);
        // The delete is userId-scoped, so user A's secret survives.
        expect(await service.getUserBYOKKeyForProvider(USER_A, 'openai')).toBe(USER_A_OPENAI_KEY);

        await service.deleteSecret(USER_A, stored.id);
        expect(await service.getUserBYOKKeyForProvider(USER_A, 'openai')).toBeNull();
    });
});
