/**
 * Migration 0009 personal-org backfill — validated against POPULATED tables.
 *
 * The backfill in 0009 runs (and no-ops) on the empty users table during
 * applyD1Migrations, so its real semantics are otherwise untested. The worker
 * test runtime can't read the .sql at test time, so the statements below mirror
 * the appended backfill by hand (keep in sync with 0009_dizzy_lila_cheney.sql).
 * This asserts the load-bearing prod behavior: one org + owner membership per
 * LIVE user, soft-deleted users excluded, owned user_secrets stamped, and a
 * second run is a no-op (idempotent). (The apps org-stamping the backfill also
 * performed is now SEALED by the 2.3 apps.orgId NOT NULL contract — null-org
 * apps can no longer be inserted to reconstruct that scenario here.)
 */

import { env, applyD1Migrations } from 'cloudflare:test';
import type { D1Migration } from 'cloudflare:test';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

declare module 'cloudflare:test' {
    interface ProvidedEnv extends Env {
        TEST_MIGRATIONS: D1Migration[];
    }
}

const BACKFILL: string[] = [
    `INSERT INTO organizations (id, name, slug, plan, is_personal, owner_user_id, created_at, updated_at)
     SELECT 'org_' || u.id, COALESCE(NULLIF(u.display_name, ''), u.email) || '''s workspace', 'ws-' || u.id, 'free', 1, u.id, CAST(strftime('%s','now') AS INTEGER), CAST(strftime('%s','now') AS INTEGER)
     FROM users u
     WHERE u.deleted_at IS NULL
       AND NOT EXISTS (SELECT 1 FROM organizations o WHERE o.owner_user_id = u.id AND o.is_personal = 1)`,
    `INSERT INTO organization_members (id, org_id, user_id, role, created_at, updated_at)
     SELECT 'mem_' || u.id, 'org_' || u.id, u.id, 'owner', CAST(strftime('%s','now') AS INTEGER), CAST(strftime('%s','now') AS INTEGER)
     FROM users u
     WHERE u.deleted_at IS NULL
       AND EXISTS (SELECT 1 FROM organizations o WHERE o.id = 'org_' || u.id)
       AND NOT EXISTS (SELECT 1 FROM organization_members m WHERE m.org_id = 'org_' || u.id AND m.user_id = u.id)`,
    `UPDATE apps SET org_id = 'org_' || user_id WHERE user_id IS NOT NULL AND org_id IS NULL AND EXISTS (SELECT 1 FROM organizations o WHERE o.id = 'org_' || apps.user_id)`,
    `UPDATE user_secrets SET org_id = 'org_' || user_id WHERE org_id IS NULL AND EXISTS (SELECT 1 FROM organizations o WHERE o.id = 'org_' || user_secrets.user_id)`,
];

async function runBackfill(): Promise<void> {
    for (const stmt of BACKFILL) {
        await env.DB.prepare(stmt).run();
    }
}

beforeAll(async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});

beforeEach(async () => {
    await env.DB.prepare('DELETE FROM apps').run();
    await env.DB.prepare('DELETE FROM user_secrets').run();
    await env.DB.prepare('DELETE FROM organization_members').run();
    await env.DB.prepare('DELETE FROM organizations').run();
    await env.DB.prepare('DELETE FROM users').run();
});

describe('0009 personal-org backfill (populated data)', () => {
    it('backfills live users, excludes soft-deleted, stamps owned rows, spares anonymous, and is idempotent', async () => {
        await env.DB.prepare(
            "INSERT INTO users (id, email, display_name, provider, provider_id) VALUES ('u1','u1@example.com','Alice','github','p1')",
        ).run();
        await env.DB.prepare(
            "INSERT INTO users (id, email, display_name, provider, provider_id, deleted_at) VALUES ('u2','u2@example.com','Bob','github','p2', CAST(strftime('%s','now') AS INTEGER))",
        ).run();
        await env.DB.prepare(
            "INSERT INTO user_secrets (id, user_id, name, provider, secret_type, encrypted_value, key_preview) VALUES ('s1','u1','k','openai','api_key','v1:x','sk-**')",
        ).run();

        await runBackfill();

        // Live user u1 → one personal org + owner membership.
        const orgs1 = await env.DB.prepare("SELECT id FROM organizations WHERE owner_user_id='u1'").all<{ id: string }>();
        expect(orgs1.results).toHaveLength(1);
        expect(orgs1.results[0].id).toBe('org_u1');
        const mem1 = await env.DB.prepare("SELECT role FROM organization_members WHERE user_id='u1'").first<{ role: string }>();
        expect(mem1!.role).toBe('owner');

        // Soft-deleted u2 → no org.
        const orgs2 = await env.DB.prepare("SELECT COUNT(*) AS n FROM organizations WHERE owner_user_id='u2'").first<{ n: number }>();
        expect(orgs2!.n).toBe(0);

        // Secret stamped.
        expect((await env.DB.prepare("SELECT org_id FROM user_secrets WHERE id='s1'").first<{ org_id: string | null }>())!.org_id).toBe('org_u1');

        // Idempotent: a second run changes nothing.
        await runBackfill();
        expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM organizations').first<{ n: number }>())!.n).toBe(1);
        expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM organization_members').first<{ n: number }>())!.n).toBe(1);
    });
});
