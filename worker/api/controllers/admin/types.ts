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
import type {
	ProduceApplicationTier,
	ProduceApplicationStatus,
} from 'shared/constants/produce';

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

// ---- Sparks billing operator controls (spec §0.5) ----

export interface AdminBillingLedgerRow {
	id: string;
	kind: string;
	actionType: string | null;
	delta: number;
	balanceAfter: number;
	reason: string | null;
	userId: string | null;
	createdAt: Date | string | null;
}

export interface AdminBillingSummaryData {
	org: {
		id: string;
		name: string;
		slug: string;
		isPersonal: boolean;
		ownerEmail: string | null;
	};
	matchedUser: { id: string; email: string } | null;
	balance: number;
	debt: number;
	subscription: { planKey: string; status: string; currentPeriodEnd: Date | string | null } | null;
	ledger: AdminBillingLedgerRow[];
}

export interface AdminBillingAdjustData {
	orgId: string;
	delta: number;
	balanceAfter: number;
}

// ---- PRODUCE application pipeline (operator sales console) ----

/** One application row as serialized over the API (createdAt is a JSON string on the wire). */
export interface AdminProduceApplicationRow {
	id: string;
	name: string;
	email: string;
	company: string | null;
	tier: ProduceApplicationTier;
	projectDescription: string;
	source: string | null;
	status: ProduceApplicationStatus;
	ackSent: boolean;
	createdAt: Date | string | null;
}

export interface AdminProduceApplicationsListData extends PaginatedResult<AdminProduceApplicationRow> {
	/** Whole-table counts per pipeline stage (independent of the active filter). */
	statusCounts: Record<ProduceApplicationStatus, number>;
}

export interface AdminProduceApplicationStatusData {
	application: AdminProduceApplicationRow;
}
