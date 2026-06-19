/**
 * Response payload types for the operator admin console (/api/admin/*).
 * All shapes are plaintext-safe: no passwordHash, no encrypted secret/token
 * values — secret views carry keyPreview/metadata only.
 */

import type {
    PaginatedResult,
    EnhancedAppData,
    EncryptedSecret,
    UserStats,
    AdminUserSummary,
    AdminOverview,
    GitHubTokenStatus,
    AdminSessionInfo,
} from '../../../database/types';
import type { AuditLog } from '../../../database/schema';

export type AdminOverviewData = AdminOverview;

export type AdminUsersListData = PaginatedResult<AdminUserSummary>;

export interface AdminUserDetailData {
    user: AdminUserSummary;
    stats: UserStats;
}

export type AdminUserAppsData = PaginatedResult<EnhancedAppData>;

export type AdminUserSessionsData = {
    sessions: AdminSessionInfo[];
};

export interface AdminUserSecretsData {
    secrets: EncryptedSecret[];
    github: GitHubTokenStatus | null;
}

export type AdminAppDetailData = EnhancedAppData;

export type AdminAuditListData = PaginatedResult<AuditLog>;
