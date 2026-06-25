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
    AdminAppSummary,
    GitHubTokenStatus,
    AdminSessionInfo,
} from '../../../database/types';
import type { AuditLog } from '../../../database/schema';

export type AdminOverviewData = AdminOverview;

export type AdminUsersListData = PaginatedResult<AdminUserSummary>;

/** The operator's global app list (every app across all users/orgs). */
export type AdminAppsListData = PaginatedResult<AdminAppSummary>;

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

export interface AdminScreenshotCaptureData {
    appId: string;
    /** The public URL that was snapshotted. */
    url: string;
    /** The stored screenshot URL now on apps.screenshot_url. */
    screenshotUrl: string;
}

export interface AdminScreenshotBackfillData {
    /** Deployed apps considered for capture. */
    total: number;
    /** Apps whose screenshot was (re)captured successfully. */
    succeeded: number;
    /** Per-app failures (best-effort — one bad URL never aborts the batch). */
    failed: Array<{ appId: string; error: string }>;
}
