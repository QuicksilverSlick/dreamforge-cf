/**
 * AuditLogService tests — the operator accountability trail.
 *
 * Runs against the real D1 schema (migrations from TEST_MIGRATIONS). Verifies
 * the write/read contract Phase 1 depends on: rows capture actor/target/action
 * with actorRole/reason/context folded into newValues, reads filter and
 * paginate, and read-writes fail open (a bad write never throws into the
 * caller, since reads are audited off the response path).
 */

import { env, applyD1Migrations } from 'cloudflare:test';
import type { D1Migration } from 'cloudflare:test';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AuditLogService, AdminAuditAction } from './AuditLogService';

declare module 'cloudflare:test' {
    interface ProvidedEnv extends Env {
        TEST_MIGRATIONS: D1Migration[];
    }
}

const ACTOR = 'audit-actor';
const TARGET = 'audit-target';

async function insertUser(id: string): Promise<void> {
    await env.DB.prepare(
        'INSERT INTO users (id, email, display_name, provider, provider_id) VALUES (?, ?, ?, ?, ?)',
    )
        .bind(id, `${id}@example.com`, id, 'github', `provider-${id}`)
        .run();
}

beforeAll(async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
    await insertUser(ACTOR);
    await insertUser(TARGET);
});

beforeEach(async () => {
    await env.DB.prepare('DELETE FROM audit_logs').run();
});

describe('AuditLogService', () => {
    it('writes a row capturing actor, target, action and folds context/role into newValues', async () => {
        const service = new AuditLogService(env);
        await service.record({
            actorId: ACTOR,
            actorRole: 'superadmin',
            entityType: 'user',
            entityId: TARGET,
            action: AdminAuditAction.USER_VIEW,
            context: { query: 'acme', total: 3 },
        });

        const row = await env.DB.prepare(
            'SELECT user_id, entity_type, entity_id, action, new_values FROM audit_logs WHERE entity_id = ?',
        )
            .bind(TARGET)
            .first<{ user_id: string; entity_type: string; entity_id: string; action: string; new_values: string }>();

        expect(row).not.toBeNull();
        expect(row!.user_id).toBe(ACTOR);
        expect(row!.entity_type).toBe('user');
        expect(row!.action).toBe('admin.user.view');

        const newValues = JSON.parse(row!.new_values);
        expect(newValues.actorRole).toBe('superadmin');
        expect(newValues.context).toEqual({ query: 'acme', total: 3 });
    });

    it('records before/after and reason for mutations', async () => {
        const service = new AuditLogService(env);
        await service.record({
            actorId: ACTOR,
            actorRole: 'superadmin',
            entityType: 'user',
            entityId: TARGET,
            action: AdminAuditAction.USER_SUSPEND,
            oldValues: { isSuspended: false },
            newValues: { isSuspended: true },
            reason: 'spam abuse',
        });

        const row = await env.DB.prepare(
            'SELECT old_values, new_values FROM audit_logs WHERE entity_id = ? AND action = ?',
        )
            .bind(TARGET, 'admin.user.suspend')
            .first<{ old_values: string; new_values: string }>();

        expect(JSON.parse(row!.old_values)).toEqual({ isSuspended: false });
        const newValues = JSON.parse(row!.new_values);
        expect(newValues.isSuspended).toBe(true);
        expect(newValues.reason).toBe('spam abuse');
    });

    it('lists newest first and filters by action', async () => {
        const service = new AuditLogService(env);
        await service.record({ actorId: ACTOR, entityType: 'user', entityId: TARGET, action: AdminAuditAction.USER_VIEW });
        await service.record({ actorId: ACTOR, entityType: 'user', entityId: TARGET, action: AdminAuditAction.USER_SUSPEND });

        const all = await service.list({});
        expect(all.pagination.total).toBe(2);

        const onlySuspends = await service.list({ action: AdminAuditAction.USER_SUSPEND });
        expect(onlySuspends.pagination.total).toBe(1);
        expect(onlySuspends.data[0].action).toBe('admin.user.suspend');
    });

    it('paginates', async () => {
        const service = new AuditLogService(env);
        for (let i = 0; i < 3; i++) {
            await service.record({ actorId: ACTOR, entityType: 'user', entityId: `t-${i}`, action: AdminAuditAction.USER_VIEW });
        }

        const page = await service.list({ limit: 2, offset: 0 });
        expect(page.data).toHaveLength(2);
        expect(page.pagination.total).toBe(3);
        expect(page.pagination.hasMore).toBe(true);
    });

    it('fails open: a bad write neither throws nor records', async () => {
        const service = new AuditLogService(env);
        // userId references users(id); an unknown actor violates the FK. record()
        // must swallow the error (reads are best-effort, off the response path).
        await expect(
            service.record({ actorId: 'ghost-user', entityType: 'user', entityId: TARGET, action: AdminAuditAction.USER_VIEW }),
        ).resolves.toBeUndefined();

        const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM audit_logs').first<{ n: number }>();
        expect(count!.n).toBe(0);
    });
});
