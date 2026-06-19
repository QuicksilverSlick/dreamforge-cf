/**
 * OrganizationService tests (Phase 2.0, dark) — runs against the real D1 schema
 * (migrations from TEST_MIGRATIONS, incl. the 0009 org tables + backfill).
 * Verifies: every user can be given exactly one personal org idempotently, and
 * new apps dual-write the owner's personal org (anonymous apps get none).
 */

import { env, applyD1Migrations } from 'cloudflare:test';
import type { D1Migration } from 'cloudflare:test';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { OrganizationService } from './OrganizationService';
import { AppService } from './AppService';
import type { NewApp } from '../schema';

declare module 'cloudflare:test' {
    interface ProvidedEnv extends Env {
        TEST_MIGRATIONS: D1Migration[];
    }
}

async function insertUser(id: string, displayName = id): Promise<void> {
    await env.DB.prepare(
        'INSERT INTO users (id, email, display_name, provider, provider_id) VALUES (?, ?, ?, ?, ?)',
    )
        .bind(id, `${id}@example.com`, displayName, 'github', `provider-${id}`)
        .run();
}

beforeAll(async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});

beforeEach(async () => {
    // Children before parents (FK order).
    await env.DB.prepare('DELETE FROM apps').run();
    await env.DB.prepare('DELETE FROM organization_members').run();
    await env.DB.prepare('DELETE FROM organizations').run();
    await env.DB.prepare('DELETE FROM users').run();
});

describe('OrganizationService.ensurePersonalOrg', () => {
    it('creates a personal org + owner membership and is idempotent', async () => {
        await insertUser('u1', 'Alice');
        const service = new OrganizationService(env);

        const orgId = await service.ensurePersonalOrg('u1', { displayName: 'Alice', email: 'u1@example.com' });
        expect(orgId).toBeTruthy();

        const org = await env.DB.prepare(
            'SELECT owner_user_id, is_personal, slug FROM organizations WHERE id = ?',
        )
            .bind(orgId)
            .first<{ owner_user_id: string; is_personal: number; slug: string }>();
        expect(org!.owner_user_id).toBe('u1');
        expect(org!.is_personal).toBe(1);
        expect(org!.slug).toBeTruthy();

        const membership = await env.DB.prepare(
            'SELECT role FROM organization_members WHERE org_id = ? AND user_id = ?',
        )
            .bind(orgId, 'u1')
            .first<{ role: string }>();
        expect(membership!.role).toBe('owner');

        // Second call must not create a duplicate.
        const again = await service.ensurePersonalOrg('u1');
        expect(again).toBe(orgId);

        const orgCount = await env.DB.prepare(
            'SELECT COUNT(*) AS n FROM organizations WHERE owner_user_id = ?',
        )
            .bind('u1')
            .first<{ n: number }>();
        expect(orgCount!.n).toBe(1);

        const memCount = await env.DB.prepare(
            'SELECT COUNT(*) AS n FROM organization_members WHERE user_id = ?',
        )
            .bind('u1')
            .first<{ n: number }>();
        expect(memCount!.n).toBe(1);
    });

    it('getPersonalOrgId returns null before and the id after', async () => {
        await insertUser('u2');
        const service = new OrganizationService(env);

        expect(await service.getPersonalOrgId('u2')).toBeNull();
        const orgId = await service.ensurePersonalOrg('u2');
        expect(await service.getPersonalOrgId('u2')).toBe(orgId);
    });
});

describe('AppService.createApp dual-write (Phase 2 dark)', () => {
    it('stamps the owner personal org and creates it if missing', async () => {
        await insertUser('u3');
        const app = await new AppService(env).createApp({
            id: 'app-1',
            title: 'Test app',
            originalPrompt: 'build me a thing',
            userId: 'u3',
        } as NewApp);

        const personalOrgId = await new OrganizationService(env).getPersonalOrgId('u3');
        expect(personalOrgId).toBeTruthy();
        expect(app.orgId).toBe(personalOrgId);
    });

    it('leaves anonymous apps without an org', async () => {
        const app = await new AppService(env).createApp({
            id: 'app-2',
            title: 'Anon app',
            originalPrompt: 'anon build',
            sessionToken: 'anon-token',
        } as NewApp);
        expect(app.orgId).toBeNull();
    });
});
