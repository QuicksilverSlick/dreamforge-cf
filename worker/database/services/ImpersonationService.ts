/**
 * Impersonation grant service (Phase 1 — human superadmin "act as").
 *
 * Owns the lifecycle of the `impersonation_sessions` grant: a server-side,
 * per-session record that the auth chokepoint (AuthService.validateTokenAndGetUser)
 * consults every request to decide whether to resolve the effective identity as
 * a TARGET user instead of the actor. Because the grant lives in D1 (never in the
 * JWT) and is re-read per request, a stop/revoke is effective on the very next
 * request — mirroring the sessions.current_org_id + resolveActiveOrg discipline.
 *
 * Mutations are fail-closed: each grant create/extend/stop folds its audit row
 * into the SAME batch() as the state change (the AdminService.suspendUser
 * pattern), so an impersonation that cannot be recorded never takes effect.
 *
 * Phase 2 (read-only AI-agent "diagnose as") is a SEPARATE token/credential
 * plane and does NOT flow through this human-grant service.
 */

import { BaseService } from './BaseService';
import * as schema from '../schema';
import { and, desc, eq } from 'drizzle-orm';
import { generateId } from '../../utils/idGenerator';
import { AuditLogService, AdminAuditAction } from './AuditLogService';
import type { UserRole } from '../../types/auth-types';
import type { ImpersonationSession, NewImpersonationSession } from '../schema';

/**
 * Time-box for HUMAN superadmin impersonation (Phase 1). Dual-clock: the idle
 * window is granted at start and re-granted on each (re-validated) extend;
 * the absolute lifetime is anchored at issue and NEVER moves. A grant dies at
 * whichever clock fires first. Tunable in one place.
 */
export const IMPERSONATION_CONFIG = {
    /** Idle window granted at start and on each extend. */
    idleWindowMs: 30 * 60 * 1000,
    /** Hard cap measured from issue; immovable. */
    absoluteLifetimeMs: 120 * 60 * 1000,
    /** Increment added by an extend (clamped to the absolute cap). */
    extendIncrementMs: 30 * 60 * 1000,
} as const;

/** Platform roles permitted to HOLD a human impersonation grant (Phase 1). */
const IMPERSONATION_ACTOR_ROLES: readonly UserRole[] = ['superadmin'];

/**
 * Target roles that may NEVER be impersonated: no impersonating up into an
 * operator, nor laterally into another staff/agent account (privilege-escalation
 * guard). Normal 'user'/'admin' (org-admin) accounts are impersonable.
 */
const PROTECTED_TARGET_ROLES: readonly UserRole[] = ['superadmin', 'support', 'ai_support', 'ai_admin'];

/** Whether a platform role may act-as another user via the human grant path. */
export function actorRoleMayImpersonate(role: UserRole | undefined): boolean {
    return role !== undefined && IMPERSONATION_ACTOR_ROLES.includes(role);
}

/**
 * Whether a user with this platform role may be the TARGET of an impersonation.
 * Enforced at start AND re-checked at the auth chokepoint every request, so a
 * target promoted into a staff/operator role mid-grant collapses the grant on
 * the next request (the privilege-escalation guard is symmetric with the actor
 * re-check). An undefined role (legacy NULL) is the baseline user — impersonable.
 */
export function targetRoleMayBeImpersonated(role: UserRole | undefined): boolean {
    return role === undefined || !PROTECTED_TARGET_ROLES.includes(role);
}

export class ImpersonationError extends Error {
    constructor(
        message: string,
        readonly status: number = 400,
    ) {
        super(message);
        this.name = 'ImpersonationError';
    }
}

interface RequestMetadata {
    ipAddress?: string;
    userAgent?: string;
}

export interface StartImpersonationParams {
    actorId: string;
    actorRole: UserRole;
    targetUserId: string;
    /** The actor's session this grant is bound to (per-device). */
    sessionId: string;
    reason: string;
    /** Phase 1 human default is full-write (false). */
    readOnly?: boolean;
    metadata?: RequestMetadata;
}

export interface ImpersonationControlParams {
    /** The real actor (read from AuthUser.impersonatedBy on an impersonated request). */
    actorId: string;
    sessionId: string;
    metadata?: RequestMetadata;
}

export class ImpersonationService extends BaseService {
    /**
     * The auth-chokepoint read: the live grant for an actor session, or null.
     * A pure read (no writes on the hot auth path) — an expired or revoked grant
     * is simply not returned; teardown belongs to stop/extend/cleanup.
     */
    async resolveActiveGrant(
        sessionId: string,
        now: Date = new Date(),
    ): Promise<ImpersonationSession | null> {
        const grant = await this.database
            .select()
            .from(schema.impersonationSessions)
            .where(
                and(
                    eq(schema.impersonationSessions.sessionId, sessionId),
                    eq(schema.impersonationSessions.isRevoked, false),
                ),
            )
            .orderBy(desc(schema.impersonationSessions.createdAt))
            .get();

        if (!grant || !this.isLive(grant, now)) {
            return null;
        }
        return grant;
    }

    private isLive(grant: ImpersonationSession, now: Date): boolean {
        return !grant.isRevoked && now < grant.expiresAt && now < grant.absoluteExpiresAt;
    }

    /**
     * Point the active grant's IMPERSONATED VIEW at a different org. This is
     * the impersonation analogue of {@link OrganizationService.setActiveOrg}:
     * an org switch while viewing-as must never touch the operator's real
     * session row (their own working org survives the impersonation), so the
     * choice is carried on the grant instead. The caller validates the
     * TARGET's membership first; the chokepoint re-validates it on every
     * request, so a stored id never outlives a revoked membership.
     */
    async setGrantActiveOrg(sessionId: string, actorId: string, orgId: string): Promise<void> {
        const grant = await this.resolveActiveGrant(sessionId);
        if (!grant) {
            throw new ImpersonationError('No active impersonation session.', 409);
        }
        if (grant.actorUserId !== actorId) {
            throw new ImpersonationError('This impersonation session does not belong to you.', 403);
        }
        await this.database
            .update(schema.impersonationSessions)
            .set({ activeOrgId: orgId })
            .where(
                and(
                    eq(schema.impersonationSessions.id, grant.id),
                    eq(schema.impersonationSessions.isRevoked, false),
                ),
            );
    }

    /**
     * Open an impersonation grant. Fail-closed: any pre-existing active grant on
     * this session is superseded, and the new grant + audit row are written in
     * one batch. Guards: actor role permitted, no self-impersonation, target
     * exists + active + not a protected (staff/operator) account, reason given.
     */
    async start(params: StartImpersonationParams): Promise<ImpersonationSession> {
        const { actorId, actorRole, targetUserId, sessionId } = params;

        if (!actorRoleMayImpersonate(actorRole)) {
            throw new ImpersonationError('Your role may not impersonate users.', 403);
        }
        if (actorId === targetUserId) {
            throw new ImpersonationError('You cannot impersonate yourself.', 400);
        }
        const reason = params.reason?.trim();
        if (!reason) {
            throw new ImpersonationError('A reason is required to start impersonation.', 400);
        }

        const target = await this.database
            .select({
                id: schema.users.id,
                role: schema.users.role,
                isSuspended: schema.users.isSuspended,
                isActive: schema.users.isActive,
                deletedAt: schema.users.deletedAt,
            })
            .from(schema.users)
            .where(eq(schema.users.id, targetUserId))
            .get();

        if (!target || target.deletedAt) {
            throw new ImpersonationError('Target user not found.', 404);
        }
        if (target.isSuspended === true || target.isActive === false) {
            throw new ImpersonationError('Cannot impersonate a suspended or inactive account.', 409);
        }
        if (!targetRoleMayBeImpersonated(target.role)) {
            throw new ImpersonationError('Cannot impersonate a platform-staff or operator account.', 403);
        }

        const now = new Date();
        const readOnly = params.readOnly ?? false;
        const absoluteExpiresAt = new Date(now.getTime() + IMPERSONATION_CONFIG.absoluteLifetimeMs);
        const expiresAt = new Date(now.getTime() + IMPERSONATION_CONFIG.idleWindowMs);

        const grant: NewImpersonationSession = {
            id: generateId(),
            actorUserId: actorId,
            actorRole,
            targetUserId,
            sessionId,
            reason,
            readOnly,
            issuedAt: now,
            expiresAt,
            absoluteExpiresAt,
            extendCount: 0,
            isRevoked: false,
            ipAddress: params.metadata?.ipAddress ?? null,
            userAgent: params.metadata?.userAgent ?? null,
            createdAt: now,
        };

        const auditRow = AuditLogService.buildRow({
            actorId,
            actorRole,
            entityType: 'user',
            entityId: targetUserId,
            action: AdminAuditAction.IMPERSONATION_START,
            reason,
            newValues: {
                sessionId,
                readOnly,
                expiresAt: expiresAt.toISOString(),
                absoluteExpiresAt: absoluteExpiresAt.toISOString(),
            },
            metadata: params.metadata,
        });

        await this.database.batch([
            this.database
                .update(schema.impersonationSessions)
                .set({ isRevoked: true, revokedAt: now, endedReason: 'superseded' })
                .where(
                    and(
                        eq(schema.impersonationSessions.sessionId, sessionId),
                        eq(schema.impersonationSessions.isRevoked, false),
                    ),
                ),
            this.database.insert(schema.impersonationSessions).values(grant),
            this.database.insert(schema.auditLogs).values(auditRow),
        ]);

        const created = await this.database
            .select()
            .from(schema.impersonationSessions)
            .where(eq(schema.impersonationSessions.id, grant.id))
            .get();
        if (!created) {
            throw new ImpersonationError('Failed to create impersonation session.', 500);
        }
        return created;
    }

    /**
     * Tear down the active grant on a session (manual exit / kill-switch).
     * Idempotent: a no-op if nothing is active. Only the grant's own actor may
     * stop it.
     */
    async stop(
        params: ImpersonationControlParams,
        endedReason: 'manual_stop' | 'killed' = 'manual_stop',
    ): Promise<void> {
        const grant = await this.resolveActiveGrant(params.sessionId);
        if (!grant) {
            return;
        }
        if (grant.actorUserId !== params.actorId) {
            throw new ImpersonationError('This impersonation session does not belong to you.', 403);
        }

        const auditRow = AuditLogService.buildRow({
            actorId: params.actorId,
            actorRole: grant.actorRole,
            entityType: 'user',
            entityId: grant.targetUserId,
            action: AdminAuditAction.IMPERSONATION_STOP,
            newValues: { sessionId: params.sessionId, extendCount: grant.extendCount, endedReason },
            metadata: params.metadata,
        });

        await this.database.batch([
            this.database
                .update(schema.impersonationSessions)
                .set({ isRevoked: true, revokedAt: new Date(), endedReason })
                .where(eq(schema.impersonationSessions.id, grant.id)),
            this.database.insert(schema.auditLogs).values(auditRow),
        ]);
    }

    /**
     * Force-end a specific grant (system-initiated teardown — e.g. the target
     * became suspended/deleted or was promoted into a protected role mid-session,
     * so it must never resurrect if the target is later reactivated). Idempotent;
     * writes an audit row so the lifecycle stays accountable.
     */
    async endGrant(grantId: string, endedReason: string): Promise<void> {
        const grant = await this.database
            .select()
            .from(schema.impersonationSessions)
            .where(
                and(
                    eq(schema.impersonationSessions.id, grantId),
                    eq(schema.impersonationSessions.isRevoked, false),
                ),
            )
            .get();
        if (!grant) {
            return;
        }

        const auditRow = AuditLogService.buildRow({
            actorId: grant.actorUserId,
            actorRole: grant.actorRole,
            entityType: 'user',
            entityId: grant.targetUserId,
            action: AdminAuditAction.IMPERSONATION_STOP,
            newValues: { sessionId: grant.sessionId, extendCount: grant.extendCount, endedReason },
        });

        await this.database.batch([
            this.database
                .update(schema.impersonationSessions)
                .set({ isRevoked: true, revokedAt: new Date(), endedReason })
                .where(eq(schema.impersonationSessions.id, grantId)),
            this.database.insert(schema.auditLogs).values(auditRow),
        ]);
    }

    /**
     * Extend the idle window. Server-side re-validation (never a client timer):
     * actor still privileged, target still impersonable, the absolute cap not
     * exhausted. The new window is clamped to the immovable absolute cap.
     */
    async extend(params: ImpersonationControlParams): Promise<ImpersonationSession> {
        const now = new Date();
        const grant = await this.resolveActiveGrant(params.sessionId, now);
        if (!grant) {
            throw new ImpersonationError('No active impersonation session to extend.', 409);
        }
        if (grant.actorUserId !== params.actorId) {
            throw new ImpersonationError('This impersonation session does not belong to you.', 403);
        }

        const actor = await this.database
            .select({ role: schema.users.role })
            .from(schema.users)
            .where(eq(schema.users.id, params.actorId))
            .get();
        if (!actor || !actorRoleMayImpersonate(actor.role)) {
            throw new ImpersonationError('Your role may no longer impersonate users.', 403);
        }

        const target = await this.database
            .select({
                role: schema.users.role,
                isSuspended: schema.users.isSuspended,
                isActive: schema.users.isActive,
                deletedAt: schema.users.deletedAt,
            })
            .from(schema.users)
            .where(eq(schema.users.id, grant.targetUserId))
            .get();
        if (
            !target ||
            target.deletedAt ||
            target.isSuspended === true ||
            target.isActive === false ||
            !targetRoleMayBeImpersonated(target.role)
        ) {
            throw new ImpersonationError('Target user is no longer impersonable.', 409);
        }

        if (now >= grant.absoluteExpiresAt) {
            throw new ImpersonationError('This impersonation session has reached its maximum lifetime.', 409);
        }

        const proposed = new Date(now.getTime() + IMPERSONATION_CONFIG.extendIncrementMs);
        const expiresAt = proposed < grant.absoluteExpiresAt ? proposed : grant.absoluteExpiresAt;
        const extendCount = grant.extendCount + 1;

        const auditRow = AuditLogService.buildRow({
            actorId: params.actorId,
            actorRole: actor.role,
            entityType: 'user',
            entityId: grant.targetUserId,
            action: AdminAuditAction.IMPERSONATION_EXTEND,
            reason: grant.reason,
            newValues: { sessionId: params.sessionId, expiresAt: expiresAt.toISOString(), extendCount },
            metadata: params.metadata,
        });

        await this.database.batch([
            this.database
                .update(schema.impersonationSessions)
                .set({ expiresAt, extendCount })
                .where(eq(schema.impersonationSessions.id, grant.id)),
            this.database.insert(schema.auditLogs).values(auditRow),
        ]);

        return { ...grant, expiresAt, extendCount };
    }
}
