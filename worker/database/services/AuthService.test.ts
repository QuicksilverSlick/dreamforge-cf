/**
 * AuthService impersonation-chokepoint tests — the per-request identity swap in
 * validateTokenAndGetUser → tryResolveImpersonation, the single most security-
 * load-bearing path in the impersonation feature. Drives the real method with
 * minted access tokens + D1 grants (cloudflare:test + TEST_MIGRATIONS).
 *
 * Asserts the security invariants: an active grant swaps the effective identity
 * to the target (stamping the actor); a non-superadmin actor's grant is ignored;
 * a grant bound to a different actor is ignored; a target promoted into a
 * protected role or suspended collapses the grant (and tears it down so it can't
 * resurrect); and a non-impersonated session resolves as the actor.
 */

import { env, applyD1Migrations } from 'cloudflare:test';
import type { D1Migration } from 'cloudflare:test';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from './AuthService';
import { JWTUtils } from '../../utils/jwtUtils';
import type { UserRole } from '../../types/auth-types';

declare module 'cloudflare:test' {
    interface ProvidedEnv extends Env {
        TEST_MIGRATIONS: D1Migration[];
    }
}

async function insertUser(
    id: string,
    opts: { role?: UserRole; isSuspended?: boolean; isActive?: boolean } = {},
): Promise<void> {
    await env.DB.prepare(
        `INSERT INTO users (id, email, display_name, provider, provider_id, role, is_suspended, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
        .bind(
            id,
            `${id}@example.com`,
            id,
            'email',
            `provider-${id}`,
            opts.role ?? 'user',
            opts.isSuspended ? 1 : 0,
            opts.isActive === false ? 0 : 1,
        )
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

async function insertGrant(
    id: string,
    opts: { actorUserId: string; actorRole?: UserRole; targetUserId: string; sessionId: string; readOnly?: boolean },
): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    await env.DB.prepare(
        `INSERT INTO impersonation_sessions
           (id, actor_user_id, actor_role, target_user_id, session_id, reason, read_only,
            issued_at, expires_at, absolute_expires_at, extend_count, is_revoked)
         VALUES (?, ?, ?, ?, ?, 'diagnose', ?, ?, ?, ?, 0, 0)`,
    )
        .bind(
            id,
            opts.actorUserId,
            opts.actorRole ?? 'superadmin',
            opts.targetUserId,
            opts.sessionId,
            opts.readOnly ? 1 : 0,
            now,
            now + 1800,
            now + 7200,
        )
        .run();
}

async function tokenFor(userId: string, sessionId: string): Promise<string> {
    const { accessToken } = await JWTUtils.getInstance(env).createAccessToken(
        userId,
        `${userId}@example.com`,
        sessionId,
    );
    return accessToken;
}

async function grantRevoked(grantId: string): Promise<boolean> {
    const row = await env.DB.prepare('SELECT is_revoked FROM impersonation_sessions WHERE id = ?')
        .bind(grantId)
        .first<{ is_revoked: number }>();
    return row?.is_revoked === 1;
}

beforeAll(async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});

beforeEach(async () => {
    await env.DB.prepare('DELETE FROM impersonation_sessions').run();
    await env.DB.prepare('DELETE FROM sessions').run();
    await env.DB.prepare('DELETE FROM users').run();
});

describe('AuthService.validateTokenAndGetUser impersonation chokepoint', () => {
    it('a superadmin with an active grant resolves as the TARGET, stamping the actor', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertSession('sess-1', 'op');
        await insertUser('target');
        await insertGrant('g1', { actorUserId: 'op', targetUserId: 'target', sessionId: 'sess-1', readOnly: true });

        const result = await new AuthService(env).validateTokenAndGetUser(await tokenFor('op', 'sess-1'), env);

        expect(result?.user.id).toBe('target');
        expect(result?.user.impersonatedBy).toBe('op');
        expect(result?.user.impersonatorRole).toBe('superadmin');
        expect(result?.user.impersonationReadOnly).toBe(true);
    });

    it('a non-impersonated session resolves as the actor (no swap)', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertSession('sess-1', 'op');

        const result = await new AuthService(env).validateTokenAndGetUser(await tokenFor('op', 'sess-1'), env);

        expect(result?.user.id).toBe('op');
        expect(result?.user.impersonatedBy).toBeUndefined();
    });

    it('ignores a grant when the actor role may not impersonate', async () => {
        await insertUser('u1', { role: 'user' });
        await insertSession('sess-1', 'u1');
        await insertUser('target');
        await insertGrant('g1', { actorUserId: 'u1', actorRole: 'user', targetUserId: 'target', sessionId: 'sess-1' });

        const result = await new AuthService(env).validateTokenAndGetUser(await tokenFor('u1', 'sess-1'), env);

        expect(result?.user.id).toBe('u1'); // not swapped
        expect(result?.user.impersonatedBy).toBeUndefined();
    });

    it('ignores a grant bound to a different actor on the same session', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertSession('sess-1', 'op');
        await insertUser('target');
        await insertUser('someone-else', { role: 'superadmin' });
        // Grant claims a different actor than the token's subject.
        await insertGrant('g1', { actorUserId: 'someone-else', targetUserId: 'target', sessionId: 'sess-1' });

        const result = await new AuthService(env).validateTokenAndGetUser(await tokenFor('op', 'sess-1'), env);

        expect(result?.user.id).toBe('op'); // not swapped
        expect(await grantRevoked('g1')).toBe(false); // not this actor's grant — left alone
    });

    it('collapses + tears down the grant when the target was promoted into a protected role', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertSession('sess-1', 'op');
        await insertUser('target', { role: 'support' }); // now platform-staff → protected
        await insertGrant('g1', { actorUserId: 'op', targetUserId: 'target', sessionId: 'sess-1' });

        const result = await new AuthService(env).validateTokenAndGetUser(await tokenFor('op', 'sess-1'), env);

        expect(result?.user.id).toBe('op'); // degraded to acting as self
        expect(result?.user.impersonatedBy).toBeUndefined();
        expect(await grantRevoked('g1')).toBe(true); // torn down so it can't resurrect
    });

    it('collapses + tears down the grant when the target is suspended', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertSession('sess-1', 'op');
        await insertUser('target', { isSuspended: true });
        await insertGrant('g1', { actorUserId: 'op', targetUserId: 'target', sessionId: 'sess-1' });

        const result = await new AuthService(env).validateTokenAndGetUser(await tokenFor('op', 'sess-1'), env);

        expect(result?.user.id).toBe('op');
        expect(result?.user.impersonatedBy).toBeUndefined();
        expect(await grantRevoked('g1')).toBe(true);
    });
});
