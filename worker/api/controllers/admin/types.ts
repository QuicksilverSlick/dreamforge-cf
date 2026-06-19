/**
 * Response payload types for the operator admin console (/api/admin/*).
 * All shapes are plaintext-safe: no passwordHash, no encrypted secret/token
 * values — secret views carry keyPreview/metadata only.
 */

import type { PaginatedResult, EnhancedAppData, EncryptedSecret, UserStats } from '../../../database/types';
import type { AdminUserSummary, AdminOverview } from '../../../database/services/AdminService';
import type { GitHubTokenStatus } from '../../../database/services/GitHubTokenService';
import type { SessionService } from '../../../database/services/SessionService';
import type { AuditLog } from '../../../database/schema';

export type AdminOverviewData = AdminOverview;

export type AdminUsersListData = PaginatedResult<AdminUserSummary>;

export interface AdminUserDetailData {
    user: AdminUserSummary;
    stats: UserStats;
}

export type AdminUserAppsData = PaginatedResult<EnhancedAppData>;

export type AdminUserSessionsData = {
    sessions: Awaited<ReturnType<SessionService['getUserSessions']>>;
};

export interface AdminUserSecretsData {
    secrets: EncryptedSecret[];
    github: GitHubTokenStatus | null;
}

export type AdminAppDetailData = EnhancedAppData;

export type AdminAuditListData = PaginatedResult<AuditLog>;
