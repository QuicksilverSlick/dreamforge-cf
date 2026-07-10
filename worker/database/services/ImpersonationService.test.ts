/**
 * ImpersonationService tests — the human superadmin grant lifecycle (Phase 1).
 *
 * Runs against the real D1 schema (TEST_MIGRATIONS incl. 0012). Asserts the
 * security contract: only superadmins may hold a grant; no self / suspended /
 * protected-staff targets; start/extend/stop write a fail-closed audit row;
 * resolveActiveGrant honors the dual-clock (idle + immovable absolute) and
 * revocation; extend re-validates and clamps to the absolute cap.
 */

import { env, applyD1Migrations } from 'cloudflare:test';
import type { D1Migration } from 'cloudflare:test';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
    ImpersonationService,
    ImpersonationError,
    IMPERSONATION_CONFIG,
    actorRoleMayImpersonate,
    targetRoleMayBeImpersonated,
} from './ImpersonationService';
import type { UserRole } from '../../types/auth-types';

declare module 'cloudflare:test' {
    interface ProvidedEnv extends Env {
        TEST_MIGRATIONS: D1Migration[];
    }
}

async function insertUser(
    id: string,
    opts: { role?: UserRole; isSuspended?: boolean; isActive?: boolean; deletedAt?: number | null } = {},
): Promise<void> {
    await env.DB.prepare(
        `INSERT INTO users (id, email, display_name, provider, provider_id, role, is_suspended, is_active, deleted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            opts.deletedAt ?? null,
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

const nowSec = (): number => Math.floor(Date.now() / 1000);

async function insertGrant(
    id: string,
    opts: {
        actorUserId: string;
        targetUserId: string;
        sessionId: string;
        actorRole?: UserRole;
        expiresAtSec: number;
        absoluteExpiresAtSec: number;
        extendCount?: number;
        isRevoked?: boolean;
    },
): Promise<void> {
    await env.DB.prepare(
        `INSERT INTO impersonation_sessions
           (id, actor_user_id, actor_role, target_user_id, session_id, reason, read_only,
            issued_at, expires_at, absolute_expires_at, extend_count, is_revoked)
         VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`,
    )
        .bind(
            id,
            opts.actorUserId,
            opts.actorRole ?? 'superadmin',
            opts.targetUserId,
            opts.sessionId,
            'diagnose',
            nowSec(),
            opts.expiresAtSec,
            opts.absoluteExpiresAtSec,
            opts.extendCount ?? 0,
            opts.isRevoked ? 1 : 0,
        )
        .run();
}

beforeAll(async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});

beforeEach(async () => {
    await env.DB.prepare('DELETE FROM audit_logs').run();
    await env.DB.prepare('DELETE FROM impersonation_sessions').run();
    await env.DB.prepare('DELETE FROM sessions').run();
    await env.DB.prepare('DELETE FROM users').run();
});

describe('impersonation role guards', () => {
    it('permits only superadmin actors and forbids staff/operator targets', () => {
        expect(actorRoleMayImpersonate('superadmin')).toBe(true);
        for (const role of ['support', 'ai_support', 'ai_admin', 'admin', 'user'] as UserRole[]) {
            expect(actorRoleMayImpersonate(role)).toBe(false);
        }
        expect(actorRoleMayImpersonate(undefined)).toBe(false);

        // Protected (staff/operator) targets can never be impersonated; normal
        // user/org-admin accounts (and legacy undefined role) can.
        for (const role of ['superadmin', 'support', 'ai_support', 'ai_admin'] as UserRole[]) {
            expect(targetRoleMayBeImpersonated(role)).toBe(false);
        }
        expect(targetRoleMayBeImpersonated('user')).toBe(true);
        expect(targetRoleMayBeImpersonated('admin')).toBe(true);
        expect(targetRoleMayBeImpersonated(undefined)).toBe(true);
    });
});

describe('ImpersonationService.start', () => {
    it('opens a grant resolvable at the chokepoint and writes a fail-closed audit row', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('target');
        await insertSession('sess-1', 'op');
        const service = new ImpersonationService(env);

        const grant = await service.start({
            actorId: 'op',
            actorRole: 'superadmin',
            targetUserId: 'target',
            sessionId: 'sess-1',
            reason: 'repro bug #42',
            metadata: { ipAddress: '1.2.3.4', userAgent: 'test' },
        });
        expect(grant.targetUserId).toBe('target');
        expect(grant.readOnly).toBe(false);

        const active = await service.resolveActiveGrant('sess-1');
        expect(active?.id).toBe(grant.id);

        const audit = await env.DB.prepare(
            'SELECT user_id, entity_id, new_values FROM audit_logs WHERE action = ?',
        )
            .bind('admin.user.impersonate.start')
            .first<{ user_id: string; entity_id: string; new_values: string }>();
        expect(audit!.user_id).toBe('op'); // actor, not target
        expect(audit!.entity_id).toBe('target');
        expect(JSON.parse(audit!.new_values).reason).toBe('repro bug #42');
    });

    it('rejects self-impersonation, a missing reason, and a non-superadmin actor', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('target');
        await insertSession('sess-1', 'op');
        const service = new ImpersonationService(env);

        await expect(
            service.start({ actorId: 'op', actorRole: 'superadmin', targetUserId: 'op', sessionId: 'sess-1', reason: 'x' }),
        ).rejects.toBeInstanceOf(ImpersonationError);
        await expect(
            service.start({ actorId: 'op', actorRole: 'superadmin', targetUserId: 'target', sessionId: 'sess-1', reason: '  ' }),
        ).rejects.toBeInstanceOf(ImpersonationError);
        await expect(
            service.start({ actorId: 'op', actorRole: 'support', targetUserId: 'target', sessionId: 'sess-1', reason: 'x' }),
        ).rejects.toBeInstanceOf(ImpersonationError);

        const n = await env.DB.prepare('SELECT COUNT(*) AS n FROM impersonation_sessions').first<{ n: number }>();
        expect(n!.n).toBe(0);
    });

    it('refuses to impersonate a protected (staff/operator) or suspended target', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('peer', { role: 'superadmin' });
        await insertUser('agent', { role: 'ai_support' });
        await insertUser('banned', { isSuspended: true });
        await insertSession('sess-1', 'op');
        const service = new ImpersonationService(env);

        for (const target of ['peer', 'agent', 'banned']) {
            await expect(
                service.start({ actorId: 'op', actorRole: 'superadmin', targetUserId: target, sessionId: 'sess-1', reason: 'x' }),
            ).rejects.toBeInstanceOf(ImpersonationError);
        }
    });

    it('supersedes a pre-existing active grant so a session holds at most one', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('t1');
        await insertUser('t2');
        await insertSession('sess-1', 'op');
        const service = new ImpersonationService(env);

        await service.start({ actorId: 'op', actorRole: 'superadmin', targetUserId: 't1', sessionId: 'sess-1', reason: 'a' });
        const second = await service.start({ actorId: 'op', actorRole: 'superadmin', targetUserId: 't2', sessionId: 'sess-1', reason: 'b' });

        const active = await service.resolveActiveGrant('sess-1');
        expect(active?.id).toBe(second.id);
        expect(active?.targetUserId).toBe('t2');

        const liveCount = await env.DB.prepare(
            'SELECT COUNT(*) AS n FROM impersonation_sessions WHERE session_id = ? AND is_revoked = 0',
        )
            .bind('sess-1')
            .first<{ n: number }>();
        expect(liveCount!.n).toBe(1);
    });
});

describe('ImpersonationService.resolveActiveGrant', () => {
    it('returns null for an expired (idle clock) or revoked grant', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('target');
        await insertSession('sess-1', 'op');
        const service = new ImpersonationService(env);

        await insertGrant('g-expired', {
            actorUserId: 'op',
            targetUserId: 'target',
            sessionId: 'sess-1',
            expiresAtSec: nowSec() - 10, // idle window already passed
            absoluteExpiresAtSec: nowSec() + 3600,
        });
        expect(await service.resolveActiveGrant('sess-1')).toBeNull();

        await env.DB.prepare('DELETE FROM impersonation_sessions').run();
        await insertGrant('g-revoked', {
            actorUserId: 'op',
            targetUserId: 'target',
            sessionId: 'sess-1',
            expiresAtSec: nowSec() + 900,
            absoluteExpiresAtSec: nowSec() + 3600,
            isRevoked: true,
        });
        expect(await service.resolveActiveGrant('sess-1')).toBeNull();
    });
});

describe('ImpersonationService.stop', () => {
    it('revokes the active grant, audits, and is idempotent + actor-scoped', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('other', { role: 'superadmin' });
        await insertUser('target');
        await insertSession('sess-1', 'op');
        const service = new ImpersonationService(env);

        await service.start({ actorId: 'op', actorRole: 'superadmin', targetUserId: 'target', sessionId: 'sess-1', reason: 'x' });

        // A different actor cannot stop someone else's grant.
        await expect(service.stop({ actorId: 'other', sessionId: 'sess-1' })).rejects.toBeInstanceOf(ImpersonationError);

        await service.stop({ actorId: 'op', sessionId: 'sess-1' });
        expect(await service.resolveActiveGrant('sess-1')).toBeNull();

        const audit = await env.DB.prepare('SELECT COUNT(*) AS n FROM audit_logs WHERE action = ?')
            .bind('admin.user.impersonate.stop')
            .first<{ n: number }>();
        expect(audit!.n).toBe(1);

        // Idempotent: stopping again is a no-op (no throw).
        await expect(service.stop({ actorId: 'op', sessionId: 'sess-1' })).resolves.toBeUndefined();
    });
});

describe('ImpersonationService.extend', () => {
    it('pushes the idle window, increments the count, and audits', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('target');
        await insertSession('sess-1', 'op');
        const service = new ImpersonationService(env);

        const grant = await service.start({ actorId: 'op', actorRole: 'superadmin', targetUserId: 'target', sessionId: 'sess-1', reason: 'x' });
        const extended = await service.extend({ actorId: 'op', sessionId: 'sess-1' });

        expect(extended.extendCount).toBe(1);
        expect(extended.expiresAt.getTime()).toBeGreaterThanOrEqual(grant.expiresAt.getTime());
        expect(extended.expiresAt.getTime()).toBeLessThanOrEqual(extended.absoluteExpiresAt.getTime());

        const audit = await env.DB.prepare('SELECT COUNT(*) AS n FROM audit_logs WHERE action = ?')
            .bind('admin.user.impersonate.extend')
            .first<{ n: number }>();
        expect(audit!.n).toBe(1);
    });

    it('clamps the new window to the immovable absolute cap', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('target');
        await insertSession('sess-1', 'op');
        const service = new ImpersonationService(env);

        // Absolute cap only ~2 min out, well under the +15 min increment.
        const cap = nowSec() + 120;
        await insertGrant('g1', {
            actorUserId: 'op',
            targetUserId: 'target',
            sessionId: 'sess-1',
            expiresAtSec: nowSec() + 60,
            absoluteExpiresAtSec: cap,
        });

        const extended = await service.extend({ actorId: 'op', sessionId: 'sess-1' });
        // Proposed = now + 15 min would exceed the cap, so it clamps to the cap.
        expect(extended.expiresAt.getTime()).toBe(extended.absoluteExpiresAt.getTime());
        expect(IMPERSONATION_CONFIG.extendIncrementMs).toBeGreaterThan(120 * 1000);
    });

    it('rejects extend with no active grant', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertSession('sess-1', 'op');
        await expect(
            new ImpersonationService(env).extend({ actorId: 'op', sessionId: 'sess-1' }),
        ).rejects.toBeInstanceOf(ImpersonationError);
    });
});

describe('setGrantActiveOrg', () => {
    async function insertOrg(id: string, ownerUserId: string): Promise<void> {
        await env.DB.prepare(
            `INSERT INTO organizations (id, name, slug, is_personal, owner_user_id) VALUES (?, ?, ?, 0, ?)`,
        )
            .bind(id, `Org ${id}`, `slug-${id}`, ownerUserId)
            .run();
    }

    it('stores the org choice on the active grant (visible to resolveActiveGrant)', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('target');
        await insertSession('sess-1', 'op');
        await insertOrg('org-1', 'target');
        await insertGrant('g1', {
            actorUserId: 'op',
            targetUserId: 'target',
            sessionId: 'sess-1',
            expiresAtSec: nowSec() + 600,
            absoluteExpiresAtSec: nowSec() + 3600,
        });

        const service = new ImpersonationService(env);
        await service.setGrantActiveOrg('sess-1', 'op', 'org-1');

        const grant = await service.resolveActiveGrant('sess-1');
        expect(grant?.activeOrgId).toBe('org-1');
    });

    it("never touches the operator's own session row", async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('target');
        await insertSession('sess-1', 'op');
        await insertOrg('org-1', 'target');
        await insertGrant('g1', {
            actorUserId: 'op',
            targetUserId: 'target',
            sessionId: 'sess-1',
            expiresAtSec: nowSec() + 600,
            absoluteExpiresAtSec: nowSec() + 3600,
        });

        await new ImpersonationService(env).setGrantActiveOrg('sess-1', 'op', 'org-1');

        const row = await env.DB.prepare('SELECT current_org_id FROM sessions WHERE id = ?')
            .bind('sess-1')
            .first<{ current_org_id: string | null }>();
        expect(row?.current_org_id).toBeNull();
    });

    it('409s with no active grant and 403s for a non-owning actor', async () => {
        await insertUser('op', { role: 'superadmin' });
        await insertUser('other', { role: 'superadmin' });
        await insertUser('target');
        await insertSession('sess-1', 'op');
        await insertOrg('org-1', 'target');

        await expect(
            new ImpersonationService(env).setGrantActiveOrg('sess-1', 'op', 'org-1'),
        ).rejects.toBeInstanceOf(ImpersonationError);

        await insertGrant('g1', {
            actorUserId: 'op',
            targetUserId: 'target',
            sessionId: 'sess-1',
            expiresAtSec: nowSec() + 600,
            absoluteExpiresAtSec: nowSec() + 3600,
        });
        await expect(
            new ImpersonationService(env).setGrantActiveOrg('sess-1', 'other', 'org-1'),
        ).rejects.toBeInstanceOf(ImpersonationError);
    });
});
