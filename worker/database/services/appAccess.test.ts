/**
 * Org-access enforcement — the cross-tenant isolation gate (Phase 2.1 → 2.3).
 *
 * Runs against the real D1 schema. Proves app access is scoped PURELY by org
 * membership (the 2.3 contract enforced apps.orgId NOT NULL and dropped the
 * transition userId fallback): two users in separate personal orgs cannot see,
 * mutate, or claim ownership of each other's apps; the owner keeps full access;
 * and a plain org member (not the userId creator) gets access via membership
 * alone.
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

    it('rejects creating an app with no organization (orgId is NOT NULL)', async () => {
        const svc = new AppService(env);
        // A null-org / anonymous app (no userId) can no longer exist after the
        // 2.3 contract — createApp throws rather than insert a null orgId.
        await expect(
            svc.createApp({ id: 'anon', title: 'L', originalPrompt: 'p', sessionToken: 'tok' } as NewApp),
        ).rejects.toThrow();
        const count = await env.DB.prepare("SELECT COUNT(*) AS n FROM apps WHERE id = 'anon'").first<{ n: number }>();
        expect(count!.n).toBe(0);
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

describe('org-scope display decoration (Private vs Shared indicator)', () => {
    it('stamps a viewer’s personal-org app as orgIsPersonal=true with the org name', async () => {
        const svc = new AppService(env);
        await seedTwoOrgs(svc); // app-A lives in A's personal org (createApp dual-write)

        const [appA] = await svc.getUserAppsWithFavorites('A');
        expect(appA.orgIsPersonal).toBe(true);
        expect(typeof appA.orgName).toBe('string');
        expect(appA.orgName!.length).toBeGreaterThan(0);
    });

    it('lists deployed apps and filters to those missing a screenshot (backfill)', async () => {
        const svc = new AppService(env);
        await insertUser('A');
        await env.DB.prepare(
            "INSERT INTO organizations (id, name, slug, is_personal, owner_user_id) VALUES ('orgA','A ws','ws-a',1,'A')",
        ).run();
        const insApp = (id: string, dep: string | null, shot: string | null) =>
            env.DB.prepare(
                'INSERT INTO apps (id, title, original_prompt, user_id, org_id, deployment_id, screenshot_url, visibility, status) VALUES (?,?,?,?,?,?,?,?,?)',
            )
                .bind(id, id, 'p', 'A', 'orgA', dep, shot, 'private', 'completed')
                .run();
        await insApp('d1', 'https://d1.app.getdreamforge.com', 'https://app/api/screenshots/d1/latest.png');
        await insApp('d2', 'v1-bare-label', null);
        await insApp('nd', null, null);

        const all = await svc.listDeployedApps();
        expect(all.map((a) => a.id).sort()).toEqual(['d1', 'd2']); // 'nd' (no deployment) excluded

        const missing = await svc.listDeployedApps({ missingScreenshotOnly: true });
        expect(missing.map((a) => a.id)).toEqual(['d2']); // 'd1' already has a screenshot
        expect(missing[0].deploymentId).toBe('v1-bare-label'); // bare label preserved for normalization
    });

    it('stamps a team-org app as orgIsPersonal=false with the team name', async () => {
        const svc = new AppService(env);
        await insertUser('A');
        await env.DB.prepare(
            "INSERT INTO organizations (id, name, slug, is_personal, owner_user_id) VALUES ('team1','Acme','acme',0,'A')",
        ).run();
        await env.DB.prepare(
            "INSERT INTO organization_members (id, org_id, user_id, role) VALUES ('m1','team1','A','owner')",
        ).run();
        await svc.createApp({ id: 'team-app', title: 'T', originalPrompt: 'p', userId: 'A', orgId: 'team1' } as NewApp);

        const teamApp = (await svc.getUserAppsWithFavorites('A')).find((a) => a.id === 'team-app');
        expect(teamApp?.orgIsPersonal).toBe(false);
        expect(teamApp?.orgName).toBe('Acme');

        // The same decoration flows through the analytics list path used by /apps.
        const analyticsApp = (await svc.getUserAppsWithAnalytics('A')).find((a) => a.id === 'team-app');
        expect(analyticsApp?.orgIsPersonal).toBe(false);
        expect(analyticsApp?.orgName).toBe('Acme');
    });
});
