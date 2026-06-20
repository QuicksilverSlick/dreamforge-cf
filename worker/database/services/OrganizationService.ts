/**
 * Organization Service — Phase 2 tenant model.
 *
 * Phase 2.0/2.1 established the personal-org-per-user foundation and
 * org-membership app access. Phase 2.2 turns this into real teams: create team
 * orgs, invite/accept members, manage roles, and resolve the per-request
 * "active org" that backs AuthUser.orgId/orgRole.
 *
 * Invariants enforced here (the server is the boundary — never trust the UI):
 *  - Org roles ('owner' | 'admin' | 'member') live on organizationMembers,
 *    never on users.role (the separate platform-role plane).
 *  - Personal orgs are solo: they never carry invitations or extra members.
 *  - Last-owner protection: an org always retains ≥1 owner.
 *  - Only owners manage owners (promote/demote/remove an owner, invite an owner).
 *  - Mutations fold their audit row into the SAME D1 batch() as the state
 *    change (fail-closed, mirroring AdminService), so an unrecorded mutation is
 *    rolled back.
 *  - Invite tokens are bearer capabilities: only a SHA-256 hash is stored, the
 *    raw token is surfaced once to the caller for the email/copy-link.
 */

import { BaseService } from './BaseService';
import * as schema from '../schema';
import { and, desc, eq, sql, type SQL } from 'drizzle-orm';
import { generateId } from '../../utils/idGenerator';
import { generateSecureToken, sha256Hash } from '../../utils/cryptoUtils';
import { AuditLogService, OrgAuditAction } from './AuditLogService';
import type { OrgRole } from '../../types/auth-types';
import type {
    ActiveOrg,
    EnsurePersonalOrgInput,
    OrgInvitationView,
    OrgMemberView,
    OrgMutationContext,
} from './organizationTypes';

export type {
    ActiveOrg,
    EnsurePersonalOrgInput,
    OrgInvitationView,
    OrgMemberView,
    OrgMutationContext,
} from './organizationTypes';

/** A pending or terminal invitation expires this long after creation. */
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** An org-management action rejected by a guard (lockout, permission, etc.). */
export class OrgActionError extends Error {
    constructor(message: string, readonly statusCode: number = 400) {
        super(message);
        this.name = 'OrgActionError';
    }
}

export class OrganizationService extends BaseService {
    /**
     * Idempotently ensure the user has a personal org (+ owner membership).
     * Returns the personal org id. Safe to call repeatedly (e.g. on every
     * login) — it no-ops when one already exists.
     */
    async ensurePersonalOrg(userId: string, input: EnsurePersonalOrgInput = {}): Promise<string> {
        const existing = await this.getPersonalOrgId(userId);
        if (existing) {
            return existing;
        }

        const orgId = generateId();
        const base = input.displayName?.trim() || input.email?.split('@')[0] || 'My';
        const name = `${base}'s workspace`;
        const slug = this.buildSlug(input.displayName || input.email || userId);

        // Create the personal org guarded by the partial unique index (one
        // personal org per owner). On a lost race the insert no-ops and returns
        // no row, so we re-read the winning org id.
        const inserted = await this.database
            .insert(schema.organizations)
            .values({ id: orgId, name, slug, isPersonal: true, ownerUserId: userId })
            .onConflictDoNothing()
            .returning({ id: schema.organizations.id });

        const resolvedOrgId = inserted[0]?.id ?? (await this.getPersonalOrgId(userId));
        if (!resolvedOrgId) {
            throw new Error(`Failed to resolve personal org for user ${userId}`);
        }

        // Ensure the owner membership exists, idempotent via the unique
        // (org_id, user_id) index — safe whether we created the org or lost the race.
        await this.database
            .insert(schema.organizationMembers)
            .values({ id: generateId(), orgId: resolvedOrgId, userId, role: 'owner' })
            .onConflictDoNothing();

        return resolvedOrgId;
    }

    /** The user's personal org id, or null if none yet. */
    async getPersonalOrgId(userId: string): Promise<string | null> {
        const row = await this.database
            .select({ id: schema.organizations.id })
            .from(schema.organizations)
            .where(
                and(
                    eq(schema.organizations.ownerUserId, userId),
                    eq(schema.organizations.isPersonal, true),
                ),
            )
            .get();
        return row?.id ?? null;
    }

    /** Orgs the user is a member of (with their org role). */
    async getUserOrganizations(
        userId: string,
    ): Promise<Array<{ org: schema.Organization; role: OrgRole }>> {
        const rows = await this.getReadDb('fast')
            .select({ org: schema.organizations, role: schema.organizationMembers.role })
            .from(schema.organizationMembers)
            .innerJoin(schema.organizations, eq(schema.organizationMembers.orgId, schema.organizations.id))
            .where(eq(schema.organizationMembers.userId, userId))
            .orderBy(desc(schema.organizations.isPersonal), schema.organizations.createdAt);
        return rows;
    }

    /**
     * Resolve the active org for a request from the session's currentOrgId,
     * re-validating membership EVERY request (reads the primary, not a replica,
     * so an org-switch or a membership revocation is effective immediately).
     * Falls back to the personal org when the session has no active org, the
     * active org was deleted, or the user is no longer a member of it.
     */
    async resolveActiveOrg(userId: string, sessionId: string | null): Promise<ActiveOrg> {
        if (sessionId) {
            // One indexed read: the session's active org joined to the caller's
            // membership in it. role !== null ⇒ the active org is still valid.
            const row = await this.database
                .select({
                    orgId: schema.sessions.currentOrgId,
                    role: schema.organizationMembers.role,
                })
                .from(schema.sessions)
                .leftJoin(
                    schema.organizationMembers,
                    and(
                        eq(schema.organizationMembers.orgId, schema.sessions.currentOrgId),
                        eq(schema.organizationMembers.userId, userId),
                    ),
                )
                .where(and(eq(schema.sessions.id, sessionId), eq(schema.sessions.userId, userId)))
                .get();

            if (row?.orgId && row.role) {
                return { orgId: row.orgId, orgRole: row.role };
            }
        }

        // Fallback: the user always owns their personal org.
        const personalOrgId = await this.getPersonalOrgId(userId);
        if (personalOrgId) {
            return { orgId: personalOrgId, orgRole: 'owner' };
        }
        return {};
    }

    /**
     * Point a session at a different org. Validates the caller is a member of
     * the target org (fail-closed) before persisting currentOrgId.
     */
    async setActiveOrg(sessionId: string, userId: string, orgId: string): Promise<schema.Organization> {
        const membership = await this.getMembership(orgId, userId);
        if (!membership) {
            throw new OrgActionError('You are not a member of that organization.', 403);
        }
        await this.database
            .update(schema.sessions)
            .set({ currentOrgId: orgId })
            .where(and(eq(schema.sessions.id, sessionId), eq(schema.sessions.userId, userId)));
        return this.requireOrg(orgId);
    }

    /** Create a TEAM org (isPersonal=false) + the creator's owner membership. */
    async createTeamOrg(name: string, ctx: OrgMutationContext): Promise<schema.Organization> {
        const trimmed = name.trim();
        if (!trimmed) {
            throw new OrgActionError('Organization name is required.', 400);
        }
        if (trimmed.length > 100) {
            throw new OrgActionError('Organization name must be 100 characters or fewer.', 400);
        }

        const orgId = generateId();
        const slug = this.buildSlug(trimmed);

        const auditRow = AuditLogService.buildRow({
            actorId: ctx.actorUserId,
            actorRole: ctx.actorRole,
            entityType: 'organization',
            entityId: orgId,
            action: OrgAuditAction.TEAM_CREATE,
            newValues: { name: trimmed, slug, isPersonal: false, ownerUserId: ctx.actorUserId },
            metadata: ctx.metadata,
        });

        await this.database.batch([
            this.database.insert(schema.organizations).values({
                id: orgId,
                name: trimmed,
                slug,
                isPersonal: false,
                ownerUserId: ctx.actorUserId,
            }),
            this.database.insert(schema.organizationMembers).values({
                id: generateId(),
                orgId,
                userId: ctx.actorUserId,
                role: 'owner',
            }),
            this.database.insert(schema.auditLogs).values(auditRow),
        ]);

        return this.requireOrg(orgId);
    }

    /** Rename an org the actor owns or administers (personal or team). */
    async renameOrg(orgId: string, name: string, ctx: OrgMutationContext): Promise<schema.Organization> {
        const org = await this.requireOrg(orgId);
        await this.requireActorRole(orgId, ctx.actorUserId, ['owner', 'admin']);

        const trimmed = name.trim();
        if (!trimmed) {
            throw new OrgActionError('Organization name is required.', 400);
        }
        if (trimmed.length > 100) {
            throw new OrgActionError('Organization name must be 100 characters or fewer.', 400);
        }

        const auditRow = AuditLogService.buildRow({
            actorId: ctx.actorUserId,
            actorRole: ctx.actorRole,
            entityType: 'organization',
            entityId: orgId,
            action: OrgAuditAction.ORG_RENAME,
            oldValues: { name: org.name },
            newValues: { name: trimmed },
            metadata: ctx.metadata,
        });

        await this.database.batch([
            this.database
                .update(schema.organizations)
                .set({ name: trimmed, updatedAt: new Date() })
                .where(eq(schema.organizations.id, orgId)),
            this.database.insert(schema.auditLogs).values(auditRow),
        ]);

        return this.requireOrg(orgId);
    }

    /**
     * Create an invitation to a TEAM org. Returns the raw token ONCE (for the
     * email/copy-link); only its hash is stored. Supersedes any prior pending
     * invite for the same (org, email). Rejects personal orgs, existing members,
     * and (for owner invites) non-owner actors.
     */
    async createInvitation(
        orgId: string,
        inviteeEmail: string,
        role: OrgRole,
        ctx: OrgMutationContext,
    ): Promise<{ invitation: schema.OrgInvitation; token: string }> {
        await this.requireTeamOrg(orgId);
        // Only an owner may grant ownership; owners/admins may invite admin/member.
        await this.requireActorRole(orgId, ctx.actorUserId, role === 'owner' ? ['owner'] : ['owner', 'admin']);

        const email = inviteeEmail.trim().toLowerCase();
        if (!email) {
            throw new OrgActionError('Invitee email is required.', 400);
        }

        // Reject if a user with that email is already a member of this org.
        const existingMember = await this.database
            .select({ id: schema.organizationMembers.id })
            .from(schema.organizationMembers)
            .innerJoin(schema.users, eq(schema.users.id, schema.organizationMembers.userId))
            .where(and(eq(schema.organizationMembers.orgId, orgId), eq(schema.users.email, email)))
            .get();
        if (existingMember) {
            throw new OrgActionError('That person is already a member of this organization.', 409);
        }

        const token = generateSecureToken(32);
        const tokenHash = await sha256Hash(token);
        const invitationId = generateId();
        const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

        const auditRow = AuditLogService.buildRow({
            actorId: ctx.actorUserId,
            actorRole: ctx.actorRole,
            entityType: 'organization',
            entityId: orgId,
            action: OrgAuditAction.MEMBER_INVITE,
            newValues: { inviteeEmail: email, role, invitationId },
            metadata: ctx.metadata,
        });

        await this.database.batch([
            // Supersede any prior pending invite for this (org, email).
            this.database
                .update(schema.orgInvitations)
                .set({ status: 'revoked', updatedAt: new Date() })
                .where(
                    and(
                        eq(schema.orgInvitations.orgId, orgId),
                        eq(schema.orgInvitations.inviteeEmail, email),
                        eq(schema.orgInvitations.status, 'pending'),
                    ),
                ),
            this.database.insert(schema.orgInvitations).values({
                id: invitationId,
                orgId,
                inviteeEmail: email,
                role,
                tokenHash,
                inviterUserId: ctx.actorUserId,
                status: 'pending',
                expiresAt,
            }),
            this.database.insert(schema.auditLogs).values(auditRow),
        ]);

        const invitation = await this.database
            .select()
            .from(schema.orgInvitations)
            .where(eq(schema.orgInvitations.id, invitationId))
            .get();
        if (!invitation) {
            throw new OrgActionError('Failed to create invitation.', 500);
        }
        return { invitation, token };
    }

    /**
     * Accept an invitation by its raw token. Idempotent: re-accepting (or
     * accepting while already a member) inserts no duplicate membership and is
     * not an error. Returns the joined org so the caller can auto-switch to it.
     */
    async acceptInvitation(
        rawToken: string,
        userId: string,
        ctx?: Pick<OrgMutationContext, 'metadata'>,
    ): Promise<schema.Organization> {
        const tokenHash = await sha256Hash(rawToken);
        const invitation = await this.database
            .select()
            .from(schema.orgInvitations)
            .where(eq(schema.orgInvitations.tokenHash, tokenHash))
            .get();

        if (!invitation || invitation.status !== 'pending') {
            throw new OrgActionError('This invitation is no longer valid.', 400);
        }
        if (invitation.expiresAt.getTime() < Date.now()) {
            throw new OrgActionError('This invitation has expired.', 400);
        }

        // Bind acceptance to the invited email. The token is a bearer secret,
        // but it was ISSUED to a specific address (and emailed there), so only
        // an account with that email may redeem it — a forwarded/leaked link
        // can't let an arbitrary logged-in user join. Case-insensitive.
        const acceptingUser = await this.database
            .select({ email: schema.users.email })
            .from(schema.users)
            .where(eq(schema.users.id, userId))
            .get();
        if (!acceptingUser || acceptingUser.email.toLowerCase() !== invitation.inviteeEmail.toLowerCase()) {
            throw new OrgActionError('This invitation was issued to a different email address.', 403);
        }

        const org = await this.getOrgById(invitation.orgId);
        if (!org) {
            throw new OrgActionError('The organization no longer exists.', 404);
        }

        const auditRow = AuditLogService.buildRow({
            actorId: userId,
            entityType: 'organization',
            entityId: invitation.orgId,
            action: OrgAuditAction.MEMBER_INVITE_ACCEPT,
            newValues: { invitationId: invitation.id, role: invitation.role, joinedUserId: userId },
            metadata: ctx?.metadata,
        });

        await this.database.batch([
            this.database
                .insert(schema.organizationMembers)
                .values({ id: generateId(), orgId: invitation.orgId, userId, role: invitation.role })
                .onConflictDoNothing(),
            this.database
                .update(schema.orgInvitations)
                .set({ status: 'accepted', acceptedAt: new Date(), acceptedUserId: userId, updatedAt: new Date() })
                .where(eq(schema.orgInvitations.id, invitation.id)),
            this.database.insert(schema.auditLogs).values(auditRow),
        ]);

        return org;
    }

    /** Members of an org with display fields, owners first then by join time. */
    async listMembers(orgId: string): Promise<OrgMemberView[]> {
        return this.getReadDb('fast')
            .select({
                membershipId: schema.organizationMembers.id,
                userId: schema.organizationMembers.userId,
                role: schema.organizationMembers.role,
                email: schema.users.email,
                displayName: schema.users.displayName,
                avatarUrl: schema.users.avatarUrl,
                joinedAt: schema.organizationMembers.createdAt,
            })
            .from(schema.organizationMembers)
            .innerJoin(schema.users, eq(schema.users.id, schema.organizationMembers.userId))
            .where(eq(schema.organizationMembers.orgId, orgId))
            .orderBy(schema.organizationMembers.createdAt);
    }

    /** Pending invitations for an org (never exposes the token hash). */
    async listInvitations(orgId: string): Promise<OrgInvitationView[]> {
        return this.getReadDb('fast')
            .select({
                id: schema.orgInvitations.id,
                inviteeEmail: schema.orgInvitations.inviteeEmail,
                role: schema.orgInvitations.role,
                status: schema.orgInvitations.status,
                expiresAt: schema.orgInvitations.expiresAt,
                createdAt: schema.orgInvitations.createdAt,
                inviterUserId: schema.orgInvitations.inviterUserId,
            })
            .from(schema.orgInvitations)
            .where(and(eq(schema.orgInvitations.orgId, orgId), eq(schema.orgInvitations.status, 'pending')))
            .orderBy(desc(schema.orgInvitations.createdAt));
    }

    /** Change a member's org role, enforcing owner-management + last-owner rules. */
    async updateMemberRole(
        orgId: string,
        targetUserId: string,
        newRole: OrgRole,
        ctx: OrgMutationContext,
    ): Promise<OrgMemberView> {
        await this.requireTeamOrg(orgId);
        const target = await this.getMembership(orgId, targetUserId);
        if (!target) {
            throw new OrgActionError('That user is not a member of this organization.', 404);
        }

        // Touching an owner (current or target role) requires owner privileges.
        const managingOwner = target.role === 'owner' || newRole === 'owner';
        await this.requireActorRole(orgId, ctx.actorUserId, managingOwner ? ['owner'] : ['owner', 'admin']);

        if (target.role === newRole) {
            return this.requireMemberView(orgId, targetUserId);
        }

        const auditRow = AuditLogService.buildRow({
            actorId: ctx.actorUserId,
            actorRole: ctx.actorRole,
            entityType: 'organization_member',
            entityId: target.id,
            action: OrgAuditAction.MEMBER_ROLE_CHANGE,
            oldValues: { role: target.role, orgId, userId: targetUserId },
            newValues: { role: newRole, orgId, userId: targetUserId },
            metadata: ctx.metadata,
        });

        if (target.role === 'owner' && newRole !== 'owner') {
            // Last-owner protection. The pre-check gives a clean error in the
            // common case; the WHERE-guarded UPDATE is the REAL enforcement —
            // atomic, so a concurrent owner demotion cannot race us to zero
            // owners. The audit row is written only after a confirmed change
            // (no orphan audit when the guard wins the race).
            if ((await this.countOwners(orgId)) <= 1) {
                throw new OrgActionError('An organization must always have at least one owner.', 400);
            }
            const res = await this.database
                .update(schema.organizationMembers)
                .set({ role: newRole, updatedAt: new Date() })
                .where(
                    and(
                        eq(schema.organizationMembers.orgId, orgId),
                        eq(schema.organizationMembers.userId, targetUserId),
                        eq(schema.organizationMembers.role, 'owner'),
                        this.ownerCountAtLeastTwo(orgId),
                    ),
                );
            if (!res.meta.changes) {
                throw new OrgActionError('An organization must always have at least one owner.', 400);
            }
            await this.database.insert(schema.auditLogs).values(auditRow);
        } else {
            await this.database.batch([
                this.database
                    .update(schema.organizationMembers)
                    .set({ role: newRole, updatedAt: new Date() })
                    .where(
                        and(
                            eq(schema.organizationMembers.orgId, orgId),
                            eq(schema.organizationMembers.userId, targetUserId),
                        ),
                    ),
                this.database.insert(schema.auditLogs).values(auditRow),
            ]);
        }

        return this.requireMemberView(orgId, targetUserId);
    }

    /**
     * Remove a member, or let a member leave (self-removal). Non-self removals
     * require owner/admin (and owner to remove an owner). The last owner can
     * never be removed. Also clears the removed user's active-org pointer on any
     * session scoped to this org, so they lose access on their next request.
     */
    async removeMember(
        orgId: string,
        targetUserId: string,
        ctx: OrgMutationContext,
    ): Promise<{ removedUserId: string }> {
        await this.requireTeamOrg(orgId);
        const target = await this.getMembership(orgId, targetUserId);
        if (!target) {
            throw new OrgActionError('That user is not a member of this organization.', 404);
        }

        const isSelf = ctx.actorUserId === targetUserId;
        if (!isSelf) {
            await this.requireActorRole(orgId, ctx.actorUserId, target.role === 'owner' ? ['owner'] : ['owner', 'admin']);
        }

        const auditRow = AuditLogService.buildRow({
            actorId: ctx.actorUserId,
            actorRole: ctx.actorRole,
            entityType: 'organization_member',
            entityId: target.id,
            action: OrgAuditAction.MEMBER_REMOVE,
            oldValues: { role: target.role, orgId, userId: targetUserId, self: isSelf },
            metadata: ctx.metadata,
        });

        // Clearing the removed user's active-org pointer on any session scoped to
        // this org makes their next request fall back to their personal org
        // (instant access loss; resolveActiveOrg also re-validates membership).
        const clearActiveOrg = this.database
            .update(schema.sessions)
            .set({ currentOrgId: null })
            .where(
                and(
                    eq(schema.sessions.userId, targetUserId),
                    eq(schema.sessions.currentOrgId, orgId),
                ),
            );

        if (target.role === 'owner') {
            // Last-owner protection (atomic). Pre-check for a clean error, then a
            // WHERE-guarded DELETE so a concurrent owner removal cannot race the
            // org to zero owners. Audit only after a confirmed delete.
            if ((await this.countOwners(orgId)) <= 1) {
                throw new OrgActionError('The last owner cannot be removed. Transfer ownership first.', 400);
            }
            const res = await this.database
                .delete(schema.organizationMembers)
                .where(
                    and(
                        eq(schema.organizationMembers.orgId, orgId),
                        eq(schema.organizationMembers.userId, targetUserId),
                        eq(schema.organizationMembers.role, 'owner'),
                        this.ownerCountAtLeastTwo(orgId),
                    ),
                );
            if (!res.meta.changes) {
                throw new OrgActionError('The last owner cannot be removed. Transfer ownership first.', 400);
            }
            await this.database.batch([clearActiveOrg, this.database.insert(schema.auditLogs).values(auditRow)]);
        } else {
            await this.database.batch([
                this.database
                    .delete(schema.organizationMembers)
                    .where(
                        and(
                            eq(schema.organizationMembers.orgId, orgId),
                            eq(schema.organizationMembers.userId, targetUserId),
                        ),
                    ),
                clearActiveOrg,
                this.database.insert(schema.auditLogs).values(auditRow),
            ]);
        }

        return { removedUserId: targetUserId };
    }

    /** Revoke a pending invitation. */
    async revokeInvitation(
        orgId: string,
        inviteId: string,
        ctx: OrgMutationContext,
    ): Promise<{ invitationId: string }> {
        await this.requireTeamOrg(orgId);
        await this.requireActorRole(orgId, ctx.actorUserId, ['owner', 'admin']);

        const invite = await this.database
            .select()
            .from(schema.orgInvitations)
            .where(and(eq(schema.orgInvitations.id, inviteId), eq(schema.orgInvitations.orgId, orgId)))
            .get();
        if (!invite) {
            throw new OrgActionError('Invitation not found.', 404);
        }
        if (invite.status !== 'pending') {
            throw new OrgActionError('Only pending invitations can be revoked.', 400);
        }

        const auditRow = AuditLogService.buildRow({
            actorId: ctx.actorUserId,
            actorRole: ctx.actorRole,
            entityType: 'organization',
            entityId: orgId,
            action: OrgAuditAction.INVITE_REVOKE,
            oldValues: { inviteeEmail: invite.inviteeEmail, role: invite.role, invitationId: invite.id },
            metadata: ctx.metadata,
        });

        await this.database.batch([
            this.database
                .update(schema.orgInvitations)
                .set({ status: 'revoked', updatedAt: new Date() })
                .where(eq(schema.orgInvitations.id, inviteId)),
            this.database.insert(schema.auditLogs).values(auditRow),
        ]);

        return { invitationId: inviteId };
    }

    /** A single (org, user) membership row, read fresh from the primary. */
    async getMembership(orgId: string, userId: string): Promise<schema.OrganizationMember | null> {
        const row = await this.database
            .select()
            .from(schema.organizationMembers)
            .where(
                and(
                    eq(schema.organizationMembers.orgId, orgId),
                    eq(schema.organizationMembers.userId, userId),
                ),
            )
            .get();
        return row ?? null;
    }

    /** An org row by id (primary read), or null. */
    async getOrgById(orgId: string): Promise<schema.Organization | null> {
        const row = await this.database
            .select()
            .from(schema.organizations)
            .where(eq(schema.organizations.id, orgId))
            .get();
        return row ?? null;
    }

    /**
     * SQL predicate: the org currently has more than one owner. Folded into the
     * WHERE of an owner-reducing write so the last-owner check is evaluated
     * atomically AT WRITE TIME — closing the check-then-act race where two
     * concurrent owner removals each see two owners and both commit, leaving
     * zero. Parameterized (no sql.raw with user input).
     */
    private ownerCountAtLeastTwo(orgId: string): SQL {
        return sql`(SELECT COUNT(*) FROM organization_members WHERE org_id = ${orgId} AND role = 'owner') > 1`;
    }

    private async countOwners(orgId: string): Promise<number> {
        const row = await this.database
            .select({ count: sql<number>`COUNT(*)` })
            .from(schema.organizationMembers)
            .where(
                and(
                    eq(schema.organizationMembers.orgId, orgId),
                    eq(schema.organizationMembers.role, 'owner'),
                ),
            )
            .get();
        return Number(row?.count ?? 0);
    }

    /** Require the org to exist and be a TEAM org (members/invites disallowed on personal). */
    private async requireTeamOrg(orgId: string): Promise<schema.Organization> {
        const org = await this.requireOrg(orgId);
        if (org.isPersonal) {
            throw new OrgActionError('Personal organizations cannot have members or invitations.', 400);
        }
        return org;
    }

    private async requireOrg(orgId: string): Promise<schema.Organization> {
        const org = await this.getOrgById(orgId);
        if (!org) {
            throw new OrgActionError('Organization not found.', 404);
        }
        return org;
    }

    /** Defense-in-depth: the actor must hold one of `allowed` roles in the org. */
    private async requireActorRole(
        orgId: string,
        actorUserId: string,
        allowed: OrgRole[],
    ): Promise<schema.OrganizationMember> {
        const membership = await this.getMembership(orgId, actorUserId);
        if (!membership || !allowed.includes(membership.role)) {
            throw new OrgActionError('You do not have permission to manage this organization.', 403);
        }
        return membership;
    }

    private async requireMemberView(orgId: string, userId: string): Promise<OrgMemberView> {
        // Read from the primary (post-write) so the response reflects the change.
        const row = await this.database
            .select({
                membershipId: schema.organizationMembers.id,
                userId: schema.organizationMembers.userId,
                role: schema.organizationMembers.role,
                email: schema.users.email,
                displayName: schema.users.displayName,
                avatarUrl: schema.users.avatarUrl,
                joinedAt: schema.organizationMembers.createdAt,
            })
            .from(schema.organizationMembers)
            .innerJoin(schema.users, eq(schema.users.id, schema.organizationMembers.userId))
            .where(
                and(
                    eq(schema.organizationMembers.orgId, orgId),
                    eq(schema.organizationMembers.userId, userId),
                ),
            )
            .get();
        if (!row) {
            throw new OrgActionError('That user is not a member of this organization.', 404);
        }
        return row;
    }

    /**
     * URL-safe, collision-resistant slug: a slugified base plus a short id
     * suffix (the slug column is uniquely indexed).
     */
    private buildSlug(base: string): string {
        const normalized = base
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 32);
        return `${normalized || 'workspace'}-${generateId().slice(0, 8)}`;
    }
}
