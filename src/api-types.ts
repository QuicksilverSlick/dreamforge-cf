/**
 * Centralized API types - imports and re-exports types from worker
 * This file serves as the single source of truth for frontend-worker API communication
 */
import { SessionResponse } from 'worker/utils/authUtils';
import { AuthUser } from './api-types';

export type { SecretTemplate } from 'worker/types/secretsTemplates';

// Base API Response Types
export type { ControllerResponse, ApiResponse } from 'worker/api/controllers/types';

// Database Types
export type {
  PaginationInfo,
  EnhancedAppData,
  AppWithFavoriteStatus,
  TimePeriod,
  AppSortOption,
  SortOrder,
  AppQueryOptions,
  PublicAppQueryOptions
} from 'worker/database/types';

// App-related API Types
export type { 
  AppsListData,
  PublicAppsData, 
  SingleAppData,
  FavoriteToggleData,
  CreateAppData,
  UpdateAppVisibilityData,
  AppDeleteData,
  DatabaseRestoreInfo,
  DatabaseRestoreResult,
  AppWithUserAndStats
} from 'worker/api/controllers/apps/types';

export type {
  AppDetailsData,
  AppStarToggleData,
  GeneratedCodeFile
} from 'worker/api/controllers/appView/types';

// User-related API Types
export type {
  UserAppsData,
  ProfileUpdateData,
} from 'worker/api/controllers/user/types';

// Stats API Types
export type {
  UserStatsData,
  UserActivityData
} from 'worker/api/controllers/stats/types';

// Analytics API Types
export type {
  UserAnalyticsResponseData,
  AgentAnalyticsResponseData,
} from 'worker/api/controllers/analytics/types';

export type { PlatformStatusData } from 'worker/api/controllers/status/types';

// Model Config API Types
export type {
  ModelConfigsData,
  ModelConfigData,
  ModelConfigUpdateData,
  ModelConfigTestData,
  ModelConfigResetData,
  ModelConfigDefaultsData,
  ModelConfigDeleteData,
  ByokProvidersData,
  UserProviderStatus,
  ModelsByProvider
} from 'worker/api/controllers/modelConfig/types';

// Model Provider API Types
export type {
  ModelProvidersListData,
  ModelProviderData,
  ModelProviderCreateData,
  ModelProviderUpdateData,
  ModelProviderDeleteData,
  ModelProviderTestData,
  CreateProviderRequest,
  UpdateProviderRequest,
  TestProviderRequest
} from 'worker/api/controllers/modelProviders/types';

// Frontend model config update interface that matches backend schema
export interface ModelConfigUpdate {
  modelName?: string | null;
  maxTokens?: number | null;
  temperature?: number | null;
  reasoningEffort?: string | null;
  fallbackModel?: string | null;
  isUserOverride?: boolean;
}

// Secrets API Types
export type {
  SecretsData,
  SecretStoreData,
  SecretDeleteData,
  SecretTemplatesData
} from 'worker/api/controllers/secrets/types';

// Agent/CodeGen API Types  
export type {
  AgentConnectionData,
} from 'worker/api/controllers/agent/types';

// WebSocket Types
export type {
  WebSocketMessage,
  WebSocketMessageData,
  CodeFixEdits,
  ModelConfigsInfo,
  ModelConfigsInfoMessage,
  AgentDisplayConfig,
  PresenceMember
} from 'worker/api/websocketTypes';

// Database/Schema Types commonly used in frontend
export type { 
  App,
  User,
  UserModelConfig,
  UserModelProvider
} from 'worker/database/schema';

export type {
  FavoriteToggleResult,
  UserStats,
  UserActivity,
  EncryptedSecret,
  UserModelConfigWithMetadata,
  ModelTestResult
} from 'worker/database/types';

// Agent/Generator Types
export type { 
  Blueprint as BlueprintType,
  ClientReportedErrorType,
  CodeReviewOutputType,
  FileConceptType,
  FileOutputType as GeneratedFile,
} from 'worker/agents/schemas';

export type { 
  CodeGenState 
} from 'worker/agents/core/state';

export type {
  ConversationMessage,
} from 'worker/agents/inferutils/common';

export type { 
  RuntimeError,
  StaticAnalysisResponse 
} from 'worker/services/sandbox/sandboxTypes';

// Config/Inference Types
export type { 
  AgentActionKey,
  AgentConfig,
  ModelConfig,
  ReasoningEffortType as ReasoningEffort,
  ProviderOverrideType as ProviderOverride
} from 'worker/agents/inferutils/config.types';

export type { RateLimitError } from "worker/services/rate-limit/errors";
export type { AgentPreviewResponse, CodeGenArgs } from 'worker/api/controllers/agent/types';
export type { RateLimitErrorResponse } from 'worker/api/responses';
export { RateLimitExceededError, SecurityError, SecurityErrorType } from 'shared/types/errors';

export type { AIModels } from 'worker/agents/inferutils/config.types';
// Model selection types
export type ModelSelectionMode = 'platform' | 'byok' | 'custom';

// Match chat FileType interface
export interface FileType {
	filePath: string;
	fileContents: string;
	explanation?: string;
	isGenerating?: boolean;
	needsFixing?: boolean;
	hasErrors?: boolean;
	language?: string;
}

// Streaming response wrapper types for agent session creation
export interface StreamingResponse {
  success: boolean;
  stream: Response;
}

export type AgentStreamingResponse = StreamingResponse;

export {
	type ImageAttachment,
	isSupportedImageType,
	MAX_IMAGE_SIZE_BYTES,
	MAX_IMAGES_PER_MESSAGE,
	SUPPORTED_IMAGE_MIME_TYPES
} from 'worker/types/image-attachment';

// Build attachments (any-file ingestion). attachment.ts is a leaf type module
// (only imports from image-attachment) — safe for the SPA bundle.
export {
	type ProcessedAttachment,
	type AttachmentRef,
	type AttachmentKind,
	SUPPORTED_ATTACHMENT_TYPES,
	MAX_ATTACHMENT_SIZE_BYTES,
	MAX_ATTACHMENTS_PER_BUILD,
	extensionOf,
} from 'worker/types/attachment';
import type { ProcessedAttachment as _ProcessedAttachment } from 'worker/types/attachment';

/** Result of POST /api/attachments — accepted refs + per-file rejections. */
export interface UploadAttachmentsResult {
	attachments: _ProcessedAttachment[];
	rejected: Array<{ filename: string; reason: string }>;
}

// Auth types imported from worker
export type {
  AuthSession,
  ApiKeyInfo,
  AuthResult,
  AuthUser,
  OAuthProvider,
} from 'worker/types/auth-types';
// Runtime const (auth-types is a leaf module — safe for the SPA; mirrors the
// image-attachment value re-export below). The single source of truth for which
// roles are platform staff, shared with the server's impersonation guard.
export { PLATFORM_STAFF_ROLES } from 'worker/types/auth-types';
export type {
  SessionResponse
} from 'worker/utils/authUtils';

// Impersonation controller response types (Phase 1.4). Imported from the leaf
// types module (no runtime/worker-ambient imports) so the SPA tsconfig doesn't
// pull the worker module graph.
export type {
  ImpersonationGrantData,
  ImpersonationStatusData,
} from 'worker/api/controllers/impersonation/types';

// Auth API Response Types (using existing worker types)
export type LoginResponseData = SessionResponse;

export type RegisterResponseData = SessionResponse & {
  requiresVerification?: boolean;
};

export type ProfileResponseData = {
  user: AuthUser;
  sessionId: string;
};

export interface AuthProvidersResponseData {
  providers: {
    google: boolean;
    github: boolean;
    email: boolean;
  };
  hasOAuth: boolean;
  requiresEmailAuth: boolean;
  csrfToken?: string;
  csrfExpiresIn?: number;
}

export interface CsrfTokenResponseData {
  token: string;
  headerName: string;
  expiresIn?: number;
}

// Active Sessions Response - matches getUserSessions + isCurrent from controller
export interface ActiveSessionsData {
  sessions: Array<{
    id: string;
    userAgent: string | null;
    ipAddress: string | null;
    lastActivity: Date;
    createdAt: Date;
    isCurrent: boolean;
  }>;
}

// API Keys Response - matches controller response format
export interface ApiKeysData {
  keys: Array<{
    id: string;
    name: string;
    keyPreview: string;
    createdAt: Date | null;
    lastUsed: Date | null;
    isActive: boolean;
  }>;
}

export type {
    GitHubExportOptions,
    GitHubExportResult,
} from 'worker/services/github/types';

// Platform Capabilities (PR 10a)
export type { CapabilitiesData } from 'worker/api/controllers/capabilities/types';

// Project / behavior taxonomy + export options (worker/agents/core/types)
export type {
  ProjectType,
  BehaviorType,
  ExportOptions
} from 'worker/agents/core/types';

// Feature registry types + defaults (worker/agents/core/features)
export type {
  ViewMode,
  FeatureCapabilities,
  FeatureDefinition,
  ViewDefinition,
  PlatformCapabilities,
  PlatformCapabilitiesConfig
} from 'worker/agents/core/features';

export {
  DEFAULT_FEATURE_DEFINITIONS,
  getBehaviorTypeForProject
} from 'worker/agents/core/features';

// Sandbox template details (used by features/core/types)
export type { TemplateDetails } from 'worker/services/sandbox/sandboxTypes';

// Intake interview ("21 Questions")
export type {
  InterviewStateData,
  StartInterviewRequest,
  SubmitAnswerRequest
} from 'worker/api/controllers/interview/types';
export type {
  InterviewAnswer,
  InterviewSpec,
  InterviewSummary,
  QuestionPayload as InterviewQuestion,
  TranscriptEntry as InterviewTranscriptEntry
} from 'worker/agents/interview/types';

// Admin console API Types (Phase 1)
export type {
  AdminOverviewData,
  AdminUsersListData,
  AdminAppsListData,
  AdminUserDetailData,
  AdminUserAppsData,
  AdminUserSessionsData,
  AdminUserSecretsData,
  AdminAppDetailData,
  AdminAuditListData,
  AdminBillingSummaryData,
  AdminBillingLedgerRow,
  AdminBillingAdjustData,
  AdminProduceApplicationRow,
  AdminProduceApplicationsListData,
  AdminProduceApplicationStatusData,
} from 'worker/api/controllers/admin/types';
export type {
  ProduceApplicationTier,
  ProduceApplicationStatus,
} from 'shared/constants/produce';
export type {
  AdminUserSummary,
  AdminUserStatusFilter,
  AdminAppSummary,
  AdminAppStatusFilter,
  AdminAppVisibilityFilter,
  GitHubTokenStatus,
} from 'worker/database/types';
export type { Acquisition } from 'worker/types/acquisition';
export type { AuditLog } from 'worker/database/schema';
export type { UserRole } from 'worker/types/auth-types';

// Organization management API Types (Phase 2.2)
export type {
  MyOrgsData,
  OrgData,
  MembersData,
  InvitesData,
  CreateInviteData,
  MemberData,
  RemoveMemberData,
  RevokeInviteData,
  DeleteOrgData,
} from 'worker/api/controllers/organizations/types';
export type {
  OrgMemberView,
  OrgInvitationView,
} from 'worker/database/services/organizationTypes';
export type { Organization, OrgInvitation, OrgRole } from 'worker/database/schema';
