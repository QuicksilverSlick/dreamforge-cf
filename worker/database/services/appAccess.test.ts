/**
 * Phase 2.1 org-access enforcement — the cross-tenant isolation gate.
 *
 * Runs against the real D1 schema (migrations incl. 0009). Proves that app
 * access is now scoped by org membership: two users in separate personal orgs
 * cannot see, mutate, or claim ownership of each other's apps; the owner keeps
 * full access; and a legacy null-org app stays accessible to its userId owner
 * (the transition fallback) without leaking to others.
 */

import { env, applyD1Migrations } from 'cloudflare:test';
import type { D1Migration } from 'cloudflare:test';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AppService } from './AppService';
import type { NewApp } from '../schema';

declare module 'cloudflare:test' {
    interface ProvidedEnv extends Env {
        TEST_MIGRATIONS: D1Migration[];
    }
}

async function insertUser(id: string): Promise<void> {
    await env.DB.prepare(
        'INSERT INTO users (id, email, display_name, provider, provider_id) VALUES (?, ?, ?, ?, ?)',
    )
        .bind(id, `${id}@example.com`, id, 'github', `provider-${id}`)
        .run();
}

/** Two users, each with a personal org (via createApp's dual-write) + one app. */
async function seedTwoOrgs(svc: AppService): Promise<void> {
    await insertUser('A');
    await insertUser('B');
    await svc.createApp({ id: 'app-A', title: 'A app', originalPrompt: 'p', userId: 'A' } as NewApp);
    await svc.createApp({ id: 'app-B', title: 'B app', originalPrompt: 'p', userId: 'B' } as NewApp);
}

beforeAll(async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});

beforeEach(async () => {
    await env.DB.prepare('DELETE FROM apps').run();
    await env.DB.prepare('DELETE FROM organization_members').run();
    await env.DB.prepare('DELETE FROM organizations').run();
    await env.DB.prepare('DELETE FROM users').run();
});

describe('Phase 2.1 org access enforcement', () => {
    it('scopes app lists + counts to the user’s org', async () => {
        const svc = new AppService(env);
        await seedTwoOrgs(svc);

        const aList = await svc.getUserAppsWithFavorites('A');
        expect(aList.map((x) => x.id)).toEqual(['app-A']);

        const bList = await svc.getUserAppsWithAnalytics('B');
        expect(bList.map((x) => x.id)).toEqual(['app-B']);

        expect(await svc.getUserAppsCount('A')).toBe(1);
        expect(await svc.getUserAppsCount('B')).toBe(1);
    });

    it('isolates ownership + mutations across orgs', async () => {
        const svc = new AppService(env);
        await seedTwoOrgs(svc);

        const ownA = await svc.checkAppOwnership('app-A', 'A');
        expect(ownA).toMatchObject({ exists: true, isOwner: true, orgRole: 'owner' });

        const crossB = await svc.checkAppOwnership('app-A', 'B');
        expect(crossB.exists).toBe(true);
        expect(crossB.isOwner).toBe(false);
        expect(crossB.orgRole).toBeNull();

        // B cannot mutate A's app.
        expect((await svc.updateAppVisibility('app-A', 'B', 'public')).success).toBe(false);
        expect((await svc.deleteApp('app-A', 'B')).success).toBe(false);
        // A's app survives B's attempts.
        expect((await svc.checkAppOwnership('app-A', 'A')).exists).toBe(true);

        // The owner retains full access.
        expect((await svc.updateAppVisibility('app-A', 'A', 'public')).success).toBe(true);
        expect((await svc.deleteApp('app-B', 'B')).success).toBe(true);
    });

    it('keeps a legacy null-org app accessible to its userId owner, isolated from others', async () => {
        const svc = new AppService(env);
        await insertUser('A');
        await insertUser('B');
        await env.DB.prepare(
            "INSERT INTO apps (id, title, original_prompt, user_id, org_id) VALUES ('legacy', 'L', 'p', 'A', NULL)",
        ).run();

        const ownerView = await svc.checkAppOwnership('legacy', 'A');
        expect(ownerView.isOwner).toBe(true);
        expect(ownerView.orgRole).toBeNull();

        const otherView = await svc.checkAppOwnership('legacy', 'B');
        expect(otherView.exists).toBe(true);
        expect(otherView.isOwner).toBe(false);

        // The fallback surfaces it in the owner's list (no lockout).
        const aList = await svc.getUserAppsWithFavorites('A');
        expect(aList.map((x) => x.id)).toContain('legacy');
        // …but never in another user's list.
        expect((await svc.getUserAppsCount('B'))).toBe(0);
    });

    it('grants access via org membership alone (not userId) — fails if the org branch is dropped', async () => {
        const svc = new AppService(env);
        await seedTwoOrgs(svc);

        // C is a plain MEMBER (neither owner nor the userId owner) of A's org.
        const row = await env.DB.prepare("SELECT org_id FROM apps WHERE id = 'app-A'").first<{ org_id: string }>();
        const orgA = row!.org_id;
        expect(orgA).toBeTruthy();
        await insertUser('C');
        await env.DB.prepare(
            'INSERT INTO organization_members (id, org_id, user_id, role) VALUES (?, ?, ?, ?)',
        )
            .bind(`mem-C-${orgA}`, orgA, 'C', 'member')
            .run();

        // C is NOT app-A's userId owner, so these can only pass if the
        // org-membership branch of userAppAccessCondition / checkAppOwnership fires.
        const ownership = await svc.checkAppOwnership('app-A', 'C');
        expect(ownership).toMatchObject({ exists: true, isOwner: true, orgRole: 'member' });

        expect((await svc.getUserAppsWithFavorites('C')).map((x) => x.id)).toContain('app-A');
        expect(await svc.getUserAppsCount('C')).toBeGreaterThanOrEqual(1);

        // C is not a member of B's org → no access.
        expect((await svc.checkAppOwnership('app-B', 'C')).isOwner).toBe(false);
    });
});
