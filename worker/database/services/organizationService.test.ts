/**
 * OrganizationService tests (Phase 2.0, dark) — runs against the real D1 schema
 * (migrations from TEST_MIGRATIONS, incl. the 0009 org tables + backfill).
 * Verifies: every user can be given exactly one personal org idempotently, and
 * new apps dual-write the owner's personal org (anonymous apps get none).
 */

import { env, applyD1Migrations } from 'cloudflare:test';
import type { D1Migration } from 'cloudflare:test';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { OrganizationService, OrgActionError } from './OrganizationService';
import { AppService } from './AppService';
import { sha256Hash } from '../../utils/cryptoUtils';
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
    await env.DB.prepare('DELETE FROM org_invitations').run();
    await env.DB.prepare('DELETE FROM organization_members').run();
    await env.DB.prepare('DELETE FROM sessions').run();
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

    it('rejects an anonymous app (no userId) — orgId is NOT NULL after 2.3', async () => {
        await expect(
            new AppService(env).createApp({
                id: 'app-2',
                title: 'Anon app',
                originalPrompt: 'anon build',
                sessionToken: 'anon-token',
            } as NewApp),
        ).rejects.toThrow();
    });

    it('files the app under an explicit active org the creator is a member of (team sharing)', async () => {
        await insertUser('u4');
        const orgSvc = new OrganizationService(env);
        const teamOrg = await orgSvc.createTeamOrg('Acme', { actorUserId: 'u4' });
        const app = await new AppService(env).createApp({
            id: 'app-team',
            title: 'Team app',
            originalPrompt: 'build',
            userId: 'u4',
            orgId: teamOrg.id,
        } as NewApp);
        expect(app.orgId).toBe(teamOrg.id);
    });

    it('ignores an org the creator is NOT a member of and falls back to personal (cross-tenant guard)', async () => {
        await insertUser('u5');
        await insertUser('outsider');
        const orgSvc = new OrganizationService(env);
        const teamOrg = await orgSvc.createTeamOrg('Acme', { actorUserId: 'u5' }); // outsider is NOT a member
        const app = await new AppService(env).createApp({
            id: 'app-foreign',
            title: 'Foreign',
            originalPrompt: 'build',
            userId: 'outsider',
            orgId: teamOrg.id,
        } as NewApp);
        const outsiderPersonal = await orgSvc.getPersonalOrgId('outsider');
        expect(app.orgId).toBe(outsiderPersonal);
        expect(app.orgId).not.toBe(teamOrg.id);
    });
});

describe('OrganizationService Phase 2.2 — teams, invitations, members', () => {
    const ctx = (actorUserId: string) => ({ actorUserId });

    function team(svc: OrganizationService, ownerId: string, name = 'Acme') {
        return svc.createTeamOrg(name, ctx(ownerId));
    }

    it('createTeamOrg creates a non-personal org with an owner membership', async () => {
        await insertUser('owner1');
        const svc = new OrganizationService(env);
        const org = await team(svc, 'owner1');
        expect(org.isPersonal).toBe(false);
        expect(org.name).toBe('Acme');
        expect((await svc.getMembership(org.id, 'owner1'))?.role).toBe('owner');
    });

    it('stores only a hash of the invite token; accept adds the member; token is single-use', async () => {
        await insertUser('owner1');
        await insertUser('invitee1');
        const svc = new OrganizationService(env);
        const org = await team(svc, 'owner1');

        const { token, invitation } = await svc.createInvitation(
            org.id,
            'INVITEE1@example.com',
            'member',
            ctx('owner1'),
        );
        expect(invitation.status).toBe('pending');
        expect(invitation.inviteeEmail).toBe('invitee1@example.com'); // normalized lowercase

        const stored = await env.DB.prepare('SELECT token_hash FROM org_invitations WHERE id = ?')
            .bind(invitation.id)
            .first<{ token_hash: string }>();
        expect(stored!.token_hash).not.toBe(token);
        expect(stored!.token_hash).toBe(await sha256Hash(token));

        const joined = await svc.acceptInvitation(token, 'invitee1');
        expect(joined.id).toBe(org.id);
        expect((await svc.getMembership(org.id, 'invitee1'))?.role).toBe('member');

        // Single-use: a second accept of the same (now-accepted) token is rejected.
        await expect(svc.acceptInvitation(token, 'invitee1')).rejects.toBeInstanceOf(OrgActionError);
    });

    it('lets any authenticated user accept with a valid token, even when their email differs from the invited address (capability model)', async () => {
        await insertUser('owner1');
        await insertUser('wrong'); // account email wrong@example.com, invite is for someone-else@
        const svc = new OrganizationService(env);
        const org = await team(svc, 'owner1');
        const { token } = await svc.createInvitation(org.id, 'someone-else@example.com', 'member', ctx('owner1'));

        const joined = await svc.acceptInvitation(token, 'wrong');
        expect(joined.id).toBe(org.id);
        expect((await svc.getMembership(org.id, 'wrong'))?.role).toBe('member');
    });

    it('rejects invitations on a personal org', async () => {
        await insertUser('solo');
        const svc = new OrganizationService(env);
        const personalOrgId = await svc.ensurePersonalOrg('solo');
        await expect(
            svc.createInvitation(personalOrgId, 'x@example.com', 'member', ctx('solo')),
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('protects the last owner from removal and demotion', async () => {
        await insertUser('owner1');
        const svc = new OrganizationService(env);
        const org = await team(svc, 'owner1');
        await expect(svc.removeMember(org.id, 'owner1', ctx('owner1'))).rejects.toBeInstanceOf(OrgActionError);
        await expect(svc.updateMemberRole(org.id, 'owner1', 'member', ctx('owner1'))).rejects.toBeInstanceOf(
            OrgActionError,
        );
        // Owner is still there.
        expect((await svc.getMembership(org.id, 'owner1'))?.role).toBe('owner');
    });

    it('only owners can manage owners; admins cannot', async () => {
        await insertUser('owner1');
        await insertUser('admin2');
        const svc = new OrganizationService(env);
        const org = await team(svc, 'owner1');
        const { token } = await svc.createInvitation(org.id, 'admin2@example.com', 'admin', ctx('owner1'));
        await svc.acceptInvitation(token, 'admin2');
        expect((await svc.getMembership(org.id, 'admin2'))?.role).toBe('admin');

        await expect(svc.removeMember(org.id, 'owner1', ctx('admin2'))).rejects.toMatchObject({ statusCode: 403 });
        await expect(svc.updateMemberRole(org.id, 'owner1', 'member', ctx('admin2'))).rejects.toMatchObject({
            statusCode: 403,
        });
        await expect(svc.updateMemberRole(org.id, 'admin2', 'owner', ctx('admin2'))).rejects.toMatchObject({
            statusCode: 403,
        });
    });

    it('a non-member cannot mutate the org', async () => {
        await insertUser('owner1');
        await insertUser('outsider');
        const svc = new OrganizationService(env);
        const org = await team(svc, 'owner1');
        await expect(svc.renameOrg(org.id, 'Hacked', ctx('outsider'))).rejects.toMatchObject({ statusCode: 403 });
        await expect(
            svc.createInvitation(org.id, 'x@example.com', 'member', ctx('outsider')),
        ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('ownership transfer unblocks the old owner leaving', async () => {
        await insertUser('owner1');
        await insertUser('member2');
        const svc = new OrganizationService(env);
        const org = await team(svc, 'owner1');
        const { token } = await svc.createInvitation(org.id, 'member2@example.com', 'member', ctx('owner1'));
        await svc.acceptInvitation(token, 'member2');

        await svc.updateMemberRole(org.id, 'member2', 'owner', ctx('owner1'));
        await svc.removeMember(org.id, 'owner1', ctx('owner1'));

        expect(await svc.getMembership(org.id, 'owner1')).toBeNull();
        expect((await svc.getMembership(org.id, 'member2'))?.role).toBe('owner');
    });
});

describe('OrganizationService.deleteOrg (Phase 2.4 — team deletion)', () => {
    const ctx = (actorUserId: string) => ({ actorUserId });

    it('deletes a team, reassigns its apps to the owner’s personal workspace, removes members, and audits', async () => {
        await insertUser('owner1');
        await insertUser('member2');
        const orgSvc = new OrganizationService(env);
        const appSvc = new AppService(env);

        const ownerPersonal = await orgSvc.ensurePersonalOrg('owner1');
        const org = await orgSvc.createTeamOrg('Acme', ctx('owner1'));
        const { token } = await orgSvc.createInvitation(org.id, 'member2@example.com', 'member', ctx('owner1'));
        await orgSvc.acceptInvitation(token, 'member2');

        // An app built in the team, with an analytics row, to prove they survive deletion.
        await appSvc.createApp({ id: 'app1', title: 'T', originalPrompt: 'p', userId: 'owner1', orgId: org.id } as NewApp);
        expect((await env.DB.prepare("SELECT org_id FROM apps WHERE id='app1'").first<{ org_id: string }>())!.org_id).toBe(org.id);
        await env.DB.prepare("INSERT INTO app_views (id, app_id) VALUES ('v1','app1')").run();

        const result = await orgSvc.deleteOrg(org.id, ctx('owner1'));
        expect(result).toMatchObject({ deletedOrgId: org.id, reassignedToOrgId: ownerPersonal });

        // Org + its memberships are gone.
        expect(await orgSvc.getOrgById(org.id)).toBeNull();
        expect(await orgSvc.getMembership(org.id, 'owner1')).toBeNull();
        expect(await orgSvc.getMembership(org.id, 'member2')).toBeNull();

        // App PRESERVED and reassigned to the owner's personal org (NOT cascade-deleted)...
        expect((await env.DB.prepare("SELECT org_id FROM apps WHERE id='app1'").first<{ org_id: string }>())!.org_id).toBe(ownerPersonal);
        // ...and its analytics survive (attached to the surviving app).
        expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM app_views WHERE app_id='app1'").first<{ n: number }>())!.n).toBe(1);

        // Audited.
        const audit = await env.DB.prepare("SELECT COUNT(*) AS n FROM audit_logs WHERE action='org.team.delete' AND entity_id=?")
            .bind(org.id)
            .first<{ n: number }>();
        expect(audit!.n).toBe(1);
    });

    it('refuses to delete a personal org', async () => {
        await insertUser('solo');
        const svc = new OrganizationService(env);
        const personalOrgId = await svc.ensurePersonalOrg('solo');
        await expect(svc.deleteOrg(personalOrgId, ctx('solo'))).rejects.toMatchObject({ statusCode: 400 });
        expect(await svc.getOrgById(personalOrgId)).not.toBeNull();
    });

    it('only the owner can delete (admins and non-members cannot)', async () => {
        await insertUser('owner1');
        await insertUser('admin2');
        await insertUser('outsider');
        const svc = new OrganizationService(env);
        const org = await svc.createTeamOrg('Acme', ctx('owner1'));
        const { token } = await svc.createInvitation(org.id, 'admin2@example.com', 'admin', ctx('owner1'));
        await svc.acceptInvitation(token, 'admin2');

        await expect(svc.deleteOrg(org.id, ctx('admin2'))).rejects.toMatchObject({ statusCode: 403 });
        await expect(svc.deleteOrg(org.id, ctx('outsider'))).rejects.toMatchObject({ statusCode: 403 });
        expect(await svc.getOrgById(org.id)).not.toBeNull(); // survived both attempts
    });

    it('refuses to delete a team that still holds connected resources (no silent cascade-wipe)', async () => {
        await insertUser('owner1');
        const svc = new OrganizationService(env);
        const org = await svc.createTeamOrg('Acme', ctx('owner1'));
        // A credential-bearing resource scoped to the team org (org_id CASCADE-deletes).
        await env.DB.prepare(
            "INSERT INTO user_secrets (id, user_id, org_id, name, provider, secret_type, encrypted_value, key_preview, is_active) VALUES ('s1','owner1',?,'k','custom','api_key','v1:x','sk-**',1)",
        )
            .bind(org.id)
            .run();

        await expect(svc.deleteOrg(org.id, ctx('owner1'))).rejects.toMatchObject({ statusCode: 409 });
        expect(await svc.getOrgById(org.id)).not.toBeNull(); // org survived
        expect(
            (await env.DB.prepare("SELECT COUNT(*) AS n FROM user_secrets WHERE org_id=?").bind(org.id).first<{ n: number }>())!.n,
        ).toBe(1); // secret survived
    });
});

describe('OrganizationService.resolveActiveOrg', () => {
    async function insertSession(id: string, userId: string, currentOrgId: string | null): Promise<void> {
        await env.DB.prepare(
            'INSERT INTO sessions (id, user_id, current_org_id, access_token_hash, refresh_token_hash, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
        )
            .bind(id, userId, currentOrgId, 'hash', '', 9999999999)
            .run();
    }

    it('returns the session active org when the user is still a member', async () => {
        await insertUser('owner1');
        const svc = new OrganizationService(env);
        await svc.ensurePersonalOrg('owner1');
        const teamOrg = await svc.createTeamOrg('Acme', { actorUserId: 'owner1' });
        await insertSession('s1', 'owner1', teamOrg.id);

        const active = await svc.resolveActiveOrg('owner1', 's1');
        expect(active.orgId).toBe(teamOrg.id);
        expect(active.orgRole).toBe('owner');
    });

    it('falls back to the personal org for a stale active org (no longer a member)', async () => {
        await insertUser('owner1');
        await insertUser('other');
        const svc = new OrganizationService(env);
        const personal = await svc.ensurePersonalOrg('owner1');
        const othersTeam = await svc.createTeamOrg('Theirs', { actorUserId: 'other' });
        await insertSession('s1', 'owner1', othersTeam.id); // owner1 is NOT a member

        const active = await svc.resolveActiveOrg('owner1', 's1');
        expect(active.orgId).toBe(personal);
        expect(active.orgRole).toBe('owner');
    });

    it('falls back to the personal org when the session has no active org', async () => {
        await insertUser('owner1');
        const svc = new OrganizationService(env);
        const personal = await svc.ensurePersonalOrg('owner1');
        await insertSession('s1', 'owner1', null);

        const active = await svc.resolveActiveOrg('owner1', 's1');
        expect(active.orgId).toBe(personal);
    });
});
