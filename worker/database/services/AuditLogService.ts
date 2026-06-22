/**
 * Audit Log Service — the operator/admin accountability trail.
 *
 * Phase 1 logs BOTH cross-user reads (who viewed which customer) and
 * mutations (suspend/reactivate), per the SOC 2 / GDPR / HIPAA expectation
 * that staff access to customer data is itself an auditable event — not just
 * changes. Granularity is one row per access event (operator opens a user /
 * runs a search / views an app), never one per sub-fetch.
 *
 * Two write disciplines:
 *  - Reads: best-effort via `record()` (swallows errors) and fired through
 *    `ctx.waitUntil()` in the controller so the operator view is never slowed
 *    or failed by audit-write health.
 *  - Mutations: fail-closed. The caller folds `buildRow()` into the same D1
 *    `batch()` as the state change, so a state change that cannot be recorded
 *    is rolled back (a suspend that isn't logged never happened).
 *
 * Records carry identifiers and metadata only — NEVER decrypted secrets,
 * tokens, passwords, or raw PII payloads.
 */

import { BaseService } from './BaseService';
import * as schema from '../schema';
import { desc, eq, sql } from 'drizzle-orm';
import { generateId } from '../../utils/idGenerator';
import type { UserRole } from '../../types/auth-types';
import type { PaginatedResult } from '../types';

/**
 * Approved, namespaced operator action verbs. Centralized so the `action`
 * column never holds an ad-hoc string and the set is greppable/auditable.
 */
export const AdminAuditAction = {
    USER_SEARCH: 'admin.user.search',
    USER_VIEW: 'admin.user.view',
    USER_APPS_VIEW: 'admin.user.apps.view',
    USER_SESSIONS_VIEW: 'admin.user.sessions.view',
    USER_SECRETS_VIEW: 'admin.user.secrets.view',
    APP_VIEW: 'admin.app.view',
    AUDIT_VIEW: 'admin.audit.view',
    USER_SUSPEND: 'admin.user.suspend',
    USER_REACTIVATE: 'admin.user.reactivate',
    // Impersonation lifecycle (Phase 1). actorId = the real operator, entityId =
    // the impersonated target. START/EXTEND are fail-closed (batched with the
    // grant row); STOP is recorded when a grant is torn down.
    IMPERSONATION_START: 'admin.user.impersonate.start',
    IMPERSONATION_EXTEND: 'admin.user.impersonate.extend',
    IMPERSONATION_STOP: 'admin.user.impersonate.stop',
    // A blocked-action attempt during impersonation (read-only violation or a
    // block-listed route) — attempted misuse is itself a security signal.
    IMPERSONATION_DENIED: 'admin.user.impersonate.denied',
} as const;

export type AdminAuditActionType = (typeof AdminAuditAction)[keyof typeof AdminAuditAction];

/**
 * Org-management action verbs (Phase 2.2). Namespaced under `org.*` and
 * distinct from the operator `admin.*` plane — these are tenant-internal
 * mutations by an org owner/admin, not platform-operator actions.
 */
export const OrgAuditAction = {
    TEAM_CREATE: 'org.team.create',
    ORG_RENAME: 'org.renamed',
    MEMBER_INVITE: 'org.member.invite',
    MEMBER_INVITE_ACCEPT: 'org.member.invite_accept',
    MEMBER_ROLE_CHANGE: 'org.member.role_change',
    MEMBER_REMOVE: 'org.member.remove',
    INVITE_REVOKE: 'org.invite.revoke',
    TEAM_DELETE: 'org.team.delete',
} as const;

export type OrgAuditActionType = (typeof OrgAuditAction)[keyof typeof OrgAuditAction];

/** Any audited action verb (operator `admin.*` or tenant `org.*`). */
export type AuditActionType = AdminAuditActionType | OrgAuditActionType;

/**
 * A single audit event. `actorId` is the operator; `entityType`/`entityId`
 * identify the target resource. `oldValues`/`newValues` capture before/after
 * for mutations; `context` carries non-sensitive read context (search terms,
 * result counts). `actorRole` and `reason` are snapshotted into the stored
 * `newValues` JSON so the record stands alone after a later role change.
 */
export interface AuditEntry {
    actorId: string;
    actorRole?: UserRole;
    entityType: string;
    entityId: string;
    action: AuditActionType;
    oldValues?: Record<string, unknown> | null;
    newValues?: Record<string, unknown> | null;
    reason?: string | null;
    context?: Record<string, unknown> | null;
    metadata?: { ipAddress?: string; userAgent?: string };
}

/** Filters for the audit-log read API. */
export interface AuditLogQuery {
    userId?: string;
    entityType?: string;
    action?: string;
    limit?: number;
    offset?: number;
}

export class AuditLogService extends BaseService {
    /**
     * Map an AuditEntry onto the `audit_logs` row shape. Pure (aside from id
     * and timestamp generation) so callers can fold the returned values into a
     * transactional `batch()` alongside the state change they describe.
     */
    static buildRow(entry: AuditEntry): schema.NewAuditLog {
        const newValues = {
            ...(entry.newValues ?? {}),
            ...(entry.actorRole !== undefined ? { actorRole: entry.actorRole } : {}),
            ...(entry.reason ? { reason: entry.reason } : {}),
            ...(entry.context ? { context: entry.context } : {}),
        };

        return {
            id: generateId(),
            userId: entry.actorId,
            entityType: entry.entityType,
            entityId: entry.entityId,
            action: entry.action,
            oldValues: entry.oldValues ?? null,
            newValues: Object.keys(newValues).length > 0 ? newValues : null,
            ipAddress: entry.metadata?.ipAddress ?? null,
            userAgent: entry.metadata?.userAgent ?? null,
            createdAt: new Date(),
        };
    }

    /**
     * Best-effort write for read-access audits. Swallows errors (fail-open):
     * read telemetry must never fail or slow the operator's view. Intended to
     * be fired via `ctx.waitUntil()`.
     */
    async record(entry: AuditEntry): Promise<void> {
        try {
            await this.database.insert(schema.auditLogs).values(AuditLogService.buildRow(entry));
        } catch (error) {
            this.logger.error('Failed to write audit log', { action: entry.action, error });
        }
    }

    /**
     * Read the audit trail (operator viewer). Newest first. Returns full audit
     * rows — these contain identifiers/metadata only by construction.
     */
    async list(query: AuditLogQuery = {}): Promise<PaginatedResult<schema.AuditLog>> {
        const limit = Math.min(Math.max(query.limit ?? 50, 1), 200);
        const offset = Math.max(query.offset ?? 0, 0);

        const whereClause = this.buildWhereConditions([
            query.userId ? eq(schema.auditLogs.userId, query.userId) : undefined,
            query.entityType ? eq(schema.auditLogs.entityType, query.entityType) : undefined,
            query.action ? eq(schema.auditLogs.action, query.action) : undefined,
        ]);

        const readDb = this.getReadDb('fast');

        const [rows, totalResult] = await Promise.all([
            readDb
                .select()
                .from(schema.auditLogs)
                .where(whereClause)
                .orderBy(desc(schema.auditLogs.createdAt))
                .limit(limit)
                .offset(offset),
            readDb
                .select({ count: sql<number>`COUNT(*)` })
                .from(schema.auditLogs)
                .where(whereClause)
                .get(),
        ]);

        const total = Number(totalResult?.count ?? 0);
        return {
            data: rows,
            pagination: { limit, offset, total, hasMore: offset + rows.length < total },
        };
    }
}
