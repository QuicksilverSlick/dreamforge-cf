/**
 * AdminService tests — operator cross-user reads and audited account actions.
 *
 * Runs against the real D1 schema (migrations from TEST_MIGRATIONS). Asserts
 * the Phase 1 security contract: reads never surface passwordHash, soft-deleted
 * users are excluded from listings, suspend/reactivate flip status AND write an
 * audit row atomically, suspension revokes sessions, and an operator cannot
 * suspend their own account (anti-lockout).
 */

import { env, applyD1Migrations } from 'cloudflare:test';
import type { D1Migration } from 'cloudflare:test';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AdminService, AdminActionError } from './AdminService';
import { SecretsService } from './SecretsService';
import type { UserRole } from '../../types/auth-types';

declare module 'cloudflare:test' {
    interface ProvidedEnv extends Env {
        TEST_MIGRATIONS: D1Migration[];
    }
}

interface UserOpts {
    email?: string;
    role?: UserRole;
    isSuspended?: boolean;
    isActive?: boolean;
    deletedAt?: number | null;
    passwordHash?: string | null;
}

async function insertUser(id: string, opts: UserOpts = {}): Promise<void> {
    await env.DB.prepare(
        `INSERT INTO users (id, email, display_name, provider, provider_id, role, is_suspended, is_active, password_hash, deleted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
        .bind(
            id,
            opts.email ?? `${id}@example.com`,
            id,
            'email',
            `provider-${id}`,
            opts.role ?? 'user',
            opts.isSuspended ? 1 : 0,
            opts.isActive === false ? 0 : 1,
            opts.passwordHash ?? null,
            opts.deletedAt ?? null,
        )
        .run();
}

async function insertApp(id: string, userId: string, visibility: 'public' | 'private'): Promise<void> {
    await env.DB.prepare(
        `INSERT INTO apps (id, title, original_prompt, user_id, visibility, status) VALUES (?, ?, ?, ?, ?, ?)`,
    )
        .bind(id, `App ${id}`, 'build me an app', userId, visibility, 'completed')
        .run();
}

async function insertSession(id: string, userId: string): Promise<void> {
    await env.DB.prepare(
        `INSERT INTO sessions (id, user_id, access_token_hash, refresh_token_hash, expires_at, is_revoked)
         VALUES (?, ?, ?, ?, ?, 0)`,
    )
        .bind(id, userId, `hash-${id}`, '', Math.floor(Date.now() / 1000) + 3600)
        .run();
}

beforeAll(async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});

beforeEach(async () => {
    await env.DB.prepare('DELETE FROM audit_logs').run();
    await env.DB.prepare('DELETE FROM sessions').run();
    await env.DB.prepare('DELETE FROM user_secrets').run();
    await env.DB.prepare('DELETE FROM apps').run();
    await env.DB.prepare('DELETE FROM users').run();
});

describe('AdminService reads', () => {
    it('lists users with a safe projection, excluding soft-deleted rows', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('u1', { email: 'alice@example.com', passwordHash: 'secret-hash' });
        await insertUser('u2', { isSuspended: true });
        await insertUser('u3', { deletedAt: Math.floor(Date.now() / 1000) });

        const result = await new AdminService(env).listUsers({});

        expect(result.pagination.total).toBe(3); // u3 (deleted) excluded
        const ids = result.data.map((u) => u.id);
        expect(ids).not.toContain('u3');

        const alice = result.data.find((u) => u.id === 'u1');
        expect(alice).toBeDefined();
        expect('passwordHash' in (alice as object)).toBe(false);
    });

    it('filters by search, role and status', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('alice', { email: 'alice@example.com' });
        await insertUser('bob', { email: 'bob@example.com', isSuspended: true });

        const service = new AdminService(env);

        const bySearch = await service.listUsers({ search: 'alice' });
        expect(bySearch.data.map((u) => u.id)).toEqual(['alice']);

        const byRole = await service.listUsers({ role: 'superadmin' });
        expect(byRole.data.map((u) => u.id)).toEqual(['op']);

        const suspended = await service.listUsers({ status: 'suspended' });
        expect(suspended.data.map((u) => u.id)).toEqual(['bob']);
    });

    it('treats NULL-status (legacy) users as active, matching auth enforcement', async () => {
        await insertUser('op', { role: 'superadmin' });
        // Legacy row with is_suspended/is_active NULL — auth treats these as active
        // (NULL-tolerant), so the operator 'active' filter must include them.
        await env.DB.prepare(
            `INSERT INTO users (id, email, display_name, provider, provider_id, role, is_suspended, is_active)
             VALUES (?, ?, ?, ?, ?, 'user', NULL, NULL)`,
        )
            .bind('legacy', 'legacy@example.com', 'legacy', 'email', 'provider-legacy')
            .run();

        const active = await new AdminService(env).listUsers({ status: 'active' });
        expect(active.data.map((u) => u.id).sort()).toEqual(['legacy', 'op']);
    });

    it('getUserById returns a safe summary or null', async () => {
        await insertUser('u1', { passwordHash: 'secret-hash' });
        const service = new AdminService(env);

        const found = await service.getUserById('u1');
        expect(found?.id).toBe('u1');
        expect('passwordHash' in (found as object)).toBe(false);

        expect(await service.getUserById('nope')).toBeNull();
    });

    it('computes platform overview counts', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('u1');
        await insertUser('u2', { isSuspended: true });
        await insertApp('a1', 'u1', 'public');
        await insertApp('a2', 'u1', 'private');

        const overview = await new AdminService(env).getOverview();
        expect(overview.totalUsers).toBe(3);
        expect(overview.suspendedUsers).toBe(1);
        expect(overview.staffUsers).toBe(1); // only the superadmin
        expect(overview.totalApps).toBe(2);
        expect(overview.publicApps).toBe(1);
    });

    it('serves secret metadata without the encrypted value', async () => {
        await insertUser('u1');
        await env.DB.prepare(
            `INSERT INTO user_secrets (id, user_id, name, provider, secret_type, encrypted_value, key_preview, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        )
            .bind('s1', 'u1', 'Custom Key', 'custom', 'api_key', 'v1:bogus-ciphertext', 'sk-1****6789')
            .run();

        // AdminController serves user secrets via SecretsService.getAllUserSecrets,
        // whose EncryptedSecret shape excludes encryptedValue by construction.
        const secrets = await new SecretsService(env).getAllUserSecrets('u1');
        expect(secrets).toHaveLength(1);
        expect(secrets[0].keyPreview).toBe('sk-1****6789');
        expect('encryptedValue' in (secrets[0] as object)).toBe(false);
    });
});

describe('AdminService account actions', () => {
    it('suspends a user: flips status, writes an audit row, revokes sessions', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('target');
        await insertSession('sess-1', 'target');

        const updated = await new AdminService(env).suspendUser({
            actorId: 'op',
            actorRole: 'superadmin',
            targetUserId: 'target',
            reason: 'abuse',
            metadata: { ipAddress: '1.2.3.4', userAgent: 'test-agent' },
        });

        expect(updated.isSuspended).toBe(true);

        const row = await env.DB.prepare('SELECT is_suspended FROM users WHERE id = ?')
            .bind('target')
            .first<{ is_suspended: number }>();
        expect(row!.is_suspended).toBe(1);

        const audit = await env.DB.prepare(
            'SELECT user_id, entity_id, new_values FROM audit_logs WHERE action = ?',
        )
            .bind('admin.user.suspend')
            .first<{ user_id: string; entity_id: string; new_values: string }>();
        expect(audit!.user_id).toBe('op');
        expect(audit!.entity_id).toBe('target');
        const newValues = JSON.parse(audit!.new_values);
        expect(newValues.isSuspended).toBe(true);
        expect(newValues.reason).toBe('abuse');

        const session = await env.DB.prepare('SELECT is_revoked FROM sessions WHERE id = ?')
            .bind('sess-1')
            .first<{ is_revoked: number }>();
        expect(session!.is_revoked).toBe(1);
    });

    it('blocks an operator from suspending their own account (anti-lockout)', async () => {
        await insertUser('op', { role: 'superadmin' });
        const service = new AdminService(env);

        await expect(
            service.suspendUser({ actorId: 'op', actorRole: 'superadmin', targetUserId: 'op', reason: 'oops' }),
        ).rejects.toBeInstanceOf(AdminActionError);

        const row = await env.DB.prepare('SELECT is_suspended FROM users WHERE id = ?')
            .bind('op')
            .first<{ is_suspended: number }>();
        expect(row!.is_suspended).toBe(0);

        const audit = await env.DB.prepare('SELECT COUNT(*) AS n FROM audit_logs').first<{ n: number }>();
        expect(audit!.n).toBe(0);
    });

    it('rejects suspending a non-existent user', async () => {
        await insertUser('op', { role: 'superadmin' });
        await expect(
            new AdminService(env).suspendUser({ actorId: 'op', targetUserId: 'ghost', reason: 'x' }),
        ).rejects.toBeInstanceOf(AdminActionError);
    });

    it('reactivates a suspended user with an audit row', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('target', { isSuspended: true, isActive: false });

        const updated = await new AdminService(env).reactivateUser({
            actorId: 'op',
            actorRole: 'superadmin',
            targetUserId: 'target',
        });

        expect(updated.isSuspended).toBe(false);
        expect(updated.isActive).toBe(true);

        const audit = await env.DB.prepare('SELECT COUNT(*) AS n FROM audit_logs WHERE action = ?')
            .bind('admin.user.reactivate')
            .first<{ n: number }>();
        expect(audit!.n).toBe(1);
    });
});
