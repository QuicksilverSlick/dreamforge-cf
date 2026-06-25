/**
 * Admin Service — operator (superadmin) cross-user reads and audited account
 * actions for the Phase 1 admin console.
 *
 * Reads are cross-user by design (an operator may inspect any account) and
 * return safe projections only — never `passwordHash` or any encrypted value.
 * Mutations (suspend/reactivate) are fail-closed: the state change and its
 * audit row are written in a single D1 `batch()`, so a change that cannot be
 * recorded is rolled back. Self-suspension is blocked to avoid operator
 * lockout. Role changes are intentionally NOT exposed here in Phase 1.
 *
 * All filters use Drizzle prepared placeholders — never `sql.raw` with
 * operator input.
 */

import { BaseService } from './BaseService';
import * as schema from '../schema';
import { SQL, and, desc, eq, isNull, like, or, sql } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { AuditLogService, AdminAuditAction } from './AuditLogService';
import { SessionService } from './SessionService';
import type { UserRole } from '../../types/auth-types';
import { PLATFORM_STAFF_ROLES } from '../../types/auth-types';
import type {
    PaginatedResult,
    AdminUserSummary,
    AdminUserStatusFilter,
    AdminOverview,
    AdminAppSummary,
    AdminAppStatusFilter,
    AdminAppVisibilityFilter,
} from '../types';

export type {
    AdminUserSummary,
    AdminUserStatusFilter,
    AdminOverview,
    AdminAppSummary,
    AdminAppStatusFilter,
    AdminAppVisibilityFilter,
} from '../types';

export interface AdminListUsersParams {
    search?: string;
    role?: UserRole;
    status?: AdminUserStatusFilter;
    limit?: number;
    offset?: number;
}

export interface AdminListAppsParams {
    search?: string;
    status?: AdminAppStatusFilter;
    visibility?: AdminAppVisibilityFilter;
    /** Org plan filter (e.g. 'free'); undefined / 'all' = no filter. */
    plan?: string;
    limit?: number;
    offset?: number;
}

export interface AdminMutationParams {
    actorId: string;
    actorRole?: UserRole;
    targetUserId: string;
    reason?: string | null;
    metadata?: { ipAddress?: string; userAgent?: string };
}

/** Operator action rejected by a guard (e.g. self-suspension, missing user). */
export class AdminActionError extends Error {
    constructor(message: string, readonly statusCode: number = 400) {
        super(message);
        this.name = 'AdminActionError';
    }
}

/** Safe column set shared by list and detail reads. Excludes passwordHash. */
const USER_SUMMARY_COLUMNS = {
    id: schema.users.id,
    email: schema.users.email,
    displayName: schema.users.displayName,
    username: schema.users.username,
    avatarUrl: schema.users.avatarUrl,
    role: schema.users.role,
    isActive: schema.users.isActive,
    isSuspended: schema.users.isSuspended,
    emailVerified: schema.users.emailVerified,
    provider: schema.users.provider,
    createdAt: schema.users.createdAt,
    updatedAt: schema.users.updatedAt,
    lastActiveAt: schema.users.lastActiveAt,
    deletedAt: schema.users.deletedAt,
} as const;

/** Safe column set for the operator's global app list (owner + org-plan joined). */
const APP_SUMMARY_COLUMNS = {
    id: schema.apps.id,
    title: schema.apps.title,
    description: schema.apps.description,
    framework: schema.apps.framework,
    status: schema.apps.status,
    visibility: schema.apps.visibility,
    screenshotUrl: schema.apps.screenshotUrl,
    deploymentId: schema.apps.deploymentId,
    createdAt: schema.apps.createdAt,
    updatedAt: schema.apps.updatedAt,
    lastDeployedAt: schema.apps.lastDeployedAt,
    ownerId: schema.apps.userId,
    ownerEmail: schema.users.email,
    ownerDisplayName: schema.users.displayName,
    ownerProvider: schema.users.provider,
    orgId: schema.apps.orgId,
    orgName: schema.organizations.name,
    orgPlan: schema.organizations.plan,
} as const;

export class AdminService extends BaseService {
    private statusCondition(status?: AdminUserStatusFilter): SQL<unknown> | undefined {
        if (status === 'suspended') {
            return eq(schema.users.isSuspended, true);
        }
        if (status === 'active') {
            // NULL-tolerant to match auth enforcement (AuthService.getUserForAuth),
            // where only an explicit `true` blocks: a legacy NULL-isSuspended row
            // is treated as active, so it must surface under the 'active' filter.
            return or(isNull(schema.users.isSuspended), eq(schema.users.isSuspended, false));
        }
        return undefined;
    }

    /**
     * Search/list users for the operator console. Excludes soft-deleted rows.
     * `search` is a parameterized contains-match across email/displayName/
     * username.
     */
    async listUsers(params: AdminListUsersParams = {}): Promise<PaginatedResult<AdminUserSummary>> {
        const limit = Math.min(Math.max(params.limit ?? 25, 1), 100);
        const offset = Math.max(params.offset ?? 0, 0);

        const search = params.search?.trim();
        const searchCondition = search
            ? or(
                  like(schema.users.email, `%${search}%`),
                  like(schema.users.displayName, `%${search}%`),
                  like(schema.users.username, `%${search}%`),
              )
            : undefined;

        const whereClause = this.buildWhereConditions([
            isNull(schema.users.deletedAt),
            params.role ? eq(schema.users.role, params.role) : undefined,
            this.statusCondition(params.status),
            searchCondition,
        ]);

        const readDb = this.getReadDb('fast');

        const [rows, totalResult] = await Promise.all([
            readDb
                .select(USER_SUMMARY_COLUMNS)
                .from(schema.users)
                .where(whereClause)
                .orderBy(desc(schema.users.createdAt))
                .limit(limit)
                .offset(offset),
            readDb
                .select({ count: sql<number>`COUNT(*)` })
                .from(schema.users)
                .where(whereClause)
                .get(),
        ]);

        const total = Number(totalResult?.count ?? 0);
        return {
            data: rows,
            pagination: { limit, offset, total, hasMore: offset + rows.length < total },
        };
    }

    /**
     * Global app list for the operator console — every app across all users and
     * orgs (the one cross-tenant app read; the normal app list is org-scoped). Joins
     * the owner (safe columns) and the org plan. `search` is a parameterized
     * contains-match across app title/description and owner email. Newest first.
     */
    async listAllApps(params: AdminListAppsParams = {}): Promise<PaginatedResult<AdminAppSummary>> {
        const limit = Math.min(Math.max(params.limit ?? 25, 1), 100);
        const offset = Math.max(params.offset ?? 0, 0);

        const search = params.search?.trim();
        const searchCondition = search
            ? or(
                  like(schema.apps.title, `%${search}%`),
                  like(schema.apps.description, `%${search}%`),
                  like(schema.users.email, `%${search}%`),
              )
            : undefined;

        const whereClause = this.buildWhereConditions([
            params.status && params.status !== 'all' ? eq(schema.apps.status, params.status) : undefined,
            params.visibility && params.visibility !== 'all'
                ? eq(schema.apps.visibility, params.visibility)
                : undefined,
            params.plan && params.plan !== 'all' ? eq(schema.organizations.plan, params.plan) : undefined,
            searchCondition,
        ]);

        const readDb = this.getReadDb('fast');

        const [rows, totalResult] = await Promise.all([
            readDb
                .select(APP_SUMMARY_COLUMNS)
                .from(schema.apps)
                .leftJoin(schema.users, eq(schema.users.id, schema.apps.userId))
                .leftJoin(schema.organizations, eq(schema.organizations.id, schema.apps.orgId))
                .where(whereClause)
                .orderBy(desc(schema.apps.createdAt))
                .limit(limit)
                .offset(offset),
            readDb
                .select({ count: sql<number>`COUNT(*)` })
                .from(schema.apps)
                .leftJoin(schema.users, eq(schema.users.id, schema.apps.userId))
                .leftJoin(schema.organizations, eq(schema.organizations.id, schema.apps.orgId))
                .where(whereClause)
                .get(),
        ]);

        const total = Number(totalResult?.count ?? 0);
        return {
            data: rows,
            pagination: { limit, offset, total, hasMore: offset + rows.length < total },
        };
    }

    /** Single user, safe projection. Returns null when not found. */
    async getUserById(userId: string): Promise<AdminUserSummary | null> {
        return this.selectSummary(this.getReadDb('fast'), userId);
    }

    private async selectSummary(
        db: DrizzleD1Database<typeof schema>,
        userId: string,
    ): Promise<AdminUserSummary | null> {
        const row = await db
            .select(USER_SUMMARY_COLUMNS)
            .from(schema.users)
            .where(eq(schema.users.id, userId))
            .get();
        return row ?? null;
    }

    /** Platform-wide counts for the console landing. */
    async getOverview(): Promise<AdminOverview> {
        const readDb = this.getReadDb('fast');
        const countOf = (where: SQL<unknown> | undefined) =>
            readDb
                .select({ count: sql<number>`COUNT(*)` })
                .from(schema.users)
                .where(where)
                .get()
                .then((r) => Number(r?.count ?? 0));

        const [totalUsers, suspendedUsers, staffUsers, totalApps, publicApps] = await Promise.all([
            countOf(isNull(schema.users.deletedAt)),
            countOf(and(isNull(schema.users.deletedAt), eq(schema.users.isSuspended, true))),
            countOf(
                and(
                    isNull(schema.users.deletedAt),
                    or(...PLATFORM_STAFF_ROLES.map((role) => eq(schema.users.role, role))),
                ),
            ),
            readDb
                .select({ count: sql<number>`COUNT(*)` })
                .from(schema.apps)
                .get()
                .then((r) => Number(r?.count ?? 0)),
            readDb
                .select({ count: sql<number>`COUNT(*)` })
                .from(schema.apps)
                .where(eq(schema.apps.visibility, 'public'))
                .get()
                .then((r) => Number(r?.count ?? 0)),
        ]);

        return { totalUsers, suspendedUsers, staffUsers, totalApps, publicApps };
    }

    /**
     * Suspend an account. Fail-closed: the status flip and the audit row are
     * written in one batch. Then the user's sessions are revoked (best-effort
     * — suspension is already enforced per-request, so revocation is cleanup).
     */
    async suspendUser(params: AdminMutationParams): Promise<AdminUserSummary> {
        if (params.actorId === params.targetUserId) {
            throw new AdminActionError('You cannot suspend your own account.', 400);
        }

        const current = await this.requireTargetStatus(params.targetUserId);

        const auditRow = AuditLogService.buildRow({
            actorId: params.actorId,
            actorRole: params.actorRole,
            entityType: 'user',
            entityId: params.targetUserId,
            action: AdminAuditAction.USER_SUSPEND,
            oldValues: { isSuspended: current.isSuspended },
            newValues: { isSuspended: true },
            reason: params.reason,
            metadata: params.metadata,
        });

        await this.database.batch([
            this.database
                .update(schema.users)
                .set({ isSuspended: true, updatedAt: new Date() })
                .where(eq(schema.users.id, params.targetUserId)),
            this.database.insert(schema.auditLogs).values(auditRow),
        ]);

        try {
            await new SessionService(this.env).revokeAllUserSessions(params.targetUserId);
        } catch (error) {
            this.logger.error('Failed to revoke sessions after suspension', {
                targetUserId: params.targetUserId,
                error,
            });
        }

        return this.requireSummary(params.targetUserId);
    }

    /** Lift a suspension and reactivate. Status flip + audit row in one batch. */
    async reactivateUser(params: AdminMutationParams): Promise<AdminUserSummary> {
        const current = await this.requireTargetStatus(params.targetUserId);

        const auditRow = AuditLogService.buildRow({
            actorId: params.actorId,
            actorRole: params.actorRole,
            entityType: 'user',
            entityId: params.targetUserId,
            action: AdminAuditAction.USER_REACTIVATE,
            oldValues: { isSuspended: current.isSuspended, isActive: current.isActive },
            newValues: { isSuspended: false, isActive: true },
            reason: params.reason,
            metadata: params.metadata,
        });

        await this.database.batch([
            this.database
                .update(schema.users)
                .set({ isSuspended: false, isActive: true, updatedAt: new Date() })
                .where(eq(schema.users.id, params.targetUserId)),
            this.database.insert(schema.auditLogs).values(auditRow),
        ]);

        return this.requireSummary(params.targetUserId);
    }

    private async requireTargetStatus(
        userId: string,
    ): Promise<{ isSuspended: boolean | null; isActive: boolean | null }> {
        const row = await this.database
            .select({ isSuspended: schema.users.isSuspended, isActive: schema.users.isActive })
            .from(schema.users)
            .where(and(eq(schema.users.id, userId), isNull(schema.users.deletedAt)))
            .get();
        if (!row) {
            throw new AdminActionError('User not found.', 404);
        }
        return row;
    }

    private async requireSummary(userId: string): Promise<AdminUserSummary> {
        // Read from the primary (this.database), not a read replica: this runs
        // right after a write, and 'fast'/replica reads aren't bookmark-chained
        // to it, so a replica could return pre-mutation state in the response.
        const summary = await this.selectSummary(this.database, userId);
        if (!summary) {
            throw new AdminActionError('User not found.', 404);
        }
        return summary;
    }
}
