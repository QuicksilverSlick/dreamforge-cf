/**
 * Admin Controller — operator (superadmin) console endpoints (/api/admin/*).
 *
 * Every route that reaches these methods is gated by AuthConfig.superadminOnly
 * (declared in adminRoutes.ts), so context.user is a superadmin. Reads are
 * cross-user and audited best-effort via ctx.waitUntil (fail-open, off the
 * response path). Mutations are audited fail-closed inside AdminService's
 * atomic batch. No method decrypts secrets/tokens — secret views surface
 * keyPreview/metadata only.
 */

import { BaseController } from '../baseController';
import { RouteContext } from '../../types/route-context';
import { ApiResponse, ControllerResponse } from '../types';
import { createLogger } from '../../../logger';
import { extractRequestMetadata } from '../../../utils/authUtils';
import type { AuthUser } from '../../../types/auth-types';
import {
    AdminService,
    AdminActionError,
} from '../../../database/services/AdminService';
import {
    AuditLogService,
    AdminAuditAction,
    type AuditEntry,
} from '../../../database/services/AuditLogService';
import { AnalyticsService } from '../../../database/services/AnalyticsService';
import { AppService } from '../../../database/services/AppService';
import { captureAndStoreScreenshot } from '../../../services/screenshots/screenshotCapture';
import { buildUserWorkerUrl } from '../../../utils/urls';
import { SecretsService } from '../../../database/services/SecretsService';
import { SessionService } from '../../../database/services/SessionService';
import { GitHubTokenService } from '../../../database/services/GitHubTokenService';
import { parseBoundedInt, parseUserRole, parseUserStatus, suspendBodySchema, reactivateBodySchema } from './schemas';
import type {
    AdminOverviewData,
    AdminUsersListData,
    AdminUserDetailData,
    AdminUserAppsData,
    AdminUserSessionsData,
    AdminUserSecretsData,
    AdminAppDetailData,
    AdminAuditListData,
    AdminScreenshotCaptureData,
    AdminScreenshotBackfillData,
} from './types';

export class AdminController extends BaseController {
    static logger = createLogger('AdminController');

    /**
     * Fire a best-effort read-access audit off the response path. Never throws
     * into the caller — AuditLogService.record swallows its own errors.
     */
    private static fireViewAudit(
        ctx: ExecutionContext,
        env: Env,
        request: Request,
        actor: AuthUser,
        entry: Omit<AuditEntry, 'actorId' | 'actorRole' | 'metadata'>,
    ): void {
        const metadata = extractRequestMetadata(request);
        const audit = new AuditLogService(env);
        ctx.waitUntil(
            audit.record({
                ...entry,
                actorId: actor.id,
                actorRole: actor.role,
                metadata: { ipAddress: metadata.ipAddress, userAgent: metadata.userAgent },
            }),
        );
    }

    /** GET /api/admin/overview — platform counts. */
    static async getOverview(
        _request: Request,
        env: Env,
        _ctx: ExecutionContext,
        _context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<AdminOverviewData>>> {
        try {
            const overview = await new AdminService(env).getOverview();
            return AdminController.createSuccessResponse(overview);
        } catch (error) {
            this.logger.error('Error building admin overview', error);
            return AdminController.createErrorResponse<AdminOverviewData>('Failed to load overview', 500);
        }
    }

    /** GET /api/admin/users — search/list users (audited as an access event). */
    static async listUsers(
        request: Request,
        env: Env,
        ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<AdminUsersListData>>> {
        try {
            const actor = context.user!;
            const q = context.queryParams.get('q')?.trim() || undefined;
            const role = parseUserRole(context.queryParams.get('role'));
            const status = parseUserStatus(context.queryParams.get('status'));
            const limit = parseBoundedInt(context.queryParams.get('limit'), 25, 1, 100);
            const offset = parseBoundedInt(context.queryParams.get('offset'), 0, 0, Number.MAX_SAFE_INTEGER);

            const result = await new AdminService(env).listUsers({ search: q, role, status, limit, offset });

            AdminController.fireViewAudit(ctx, env, request, actor, {
                entityType: 'user',
                entityId: '*',
                action: AdminAuditAction.USER_SEARCH,
                context: { query: q ?? null, role: role ?? null, status: status ?? null, total: result.pagination.total },
            });

            return AdminController.createSuccessResponse(result);
        } catch (error) {
            this.logger.error('Error listing users', error);
            return AdminController.createErrorResponse<AdminUsersListData>('Failed to list users', 500);
        }
    }

    /** GET /api/admin/users/:id — user detail + usage stats (audited). */
    static async getUser(
        request: Request,
        env: Env,
        ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<AdminUserDetailData>>> {
        try {
            const actor = context.user!;
            const userId = context.pathParams.id;
            if (!userId) {
                return AdminController.createErrorResponse<AdminUserDetailData>('User ID is required', 400);
            }

            const adminService = new AdminService(env);
            const user = await adminService.getUserById(userId);
            if (!user) {
                return AdminController.createErrorResponse<AdminUserDetailData>('User not found', 404);
            }

            const stats = await new AnalyticsService(env).getUserStats(userId);

            AdminController.fireViewAudit(ctx, env, request, actor, {
                entityType: 'user',
                entityId: userId,
                action: AdminAuditAction.USER_VIEW,
            });

            return AdminController.createSuccessResponse({ user, stats });
        } catch (error) {
            this.logger.error('Error fetching user detail', error);
            return AdminController.createErrorResponse<AdminUserDetailData>('Failed to load user', 500);
        }
    }

    /** GET /api/admin/users/:id/apps — that user's apps (drill-down, audited). */
    static async getUserApps(
        request: Request,
        env: Env,
        ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<AdminUserAppsData>>> {
        try {
            const actor = context.user!;
            const userId = context.pathParams.id;
            if (!userId) {
                return AdminController.createErrorResponse<AdminUserAppsData>('User ID is required', 400);
            }

            const limit = parseBoundedInt(context.queryParams.get('limit'), 25, 1, 100);
            const offset = parseBoundedInt(context.queryParams.get('offset'), 0, 0, Number.MAX_SAFE_INTEGER);

            const appService = new AppService(env);
            const [data, total] = await Promise.all([
                appService.getUserAppsWithAnalytics(userId, { limit, offset }),
                appService.getUserAppsCount(userId, {}),
            ]);

            AdminController.fireViewAudit(ctx, env, request, actor, {
                entityType: 'user',
                entityId: userId,
                action: AdminAuditAction.USER_APPS_VIEW,
                context: { total },
            });

            return AdminController.createSuccessResponse({
                data,
                pagination: { limit, offset, total, hasMore: offset + data.length < total },
            });
        } catch (error) {
            this.logger.error('Error fetching user apps', error);
            return AdminController.createErrorResponse<AdminUserAppsData>('Failed to load user apps', 500);
        }
    }

    /** GET /api/admin/users/:id/sessions — active session metadata (audited; surfaces IP/UA). */
    static async getUserSessions(
        request: Request,
        env: Env,
        ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<AdminUserSessionsData>>> {
        try {
            const actor = context.user!;
            const userId = context.pathParams.id;
            if (!userId) {
                return AdminController.createErrorResponse<AdminUserSessionsData>('User ID is required', 400);
            }
            const sessions = await new SessionService(env).getUserSessions(userId);

            AdminController.fireViewAudit(ctx, env, request, actor, {
                entityType: 'user',
                entityId: userId,
                action: AdminAuditAction.USER_SESSIONS_VIEW,
                context: { sessionCount: sessions.length },
            });

            return AdminController.createSuccessResponse({ sessions });
        } catch (error) {
            this.logger.error('Error fetching user sessions', error);
            return AdminController.createErrorResponse<AdminUserSessionsData>('Failed to load sessions', 500);
        }
    }

    /**
     * GET /api/admin/users/:id/secrets — secret + GitHub metadata. keyPreview
     * only; never decrypts. Audited as a sensitive access event.
     */
    static async getUserSecrets(
        request: Request,
        env: Env,
        ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<AdminUserSecretsData>>> {
        try {
            const actor = context.user!;
            const userId = context.pathParams.id;
            if (!userId) {
                return AdminController.createErrorResponse<AdminUserSecretsData>('User ID is required', 400);
            }

            const [secrets, github] = await Promise.all([
                new SecretsService(env).getAllUserSecrets(userId),
                new GitHubTokenService(env).getTokenStatus(userId),
            ]);

            AdminController.fireViewAudit(ctx, env, request, actor, {
                entityType: 'user',
                entityId: userId,
                action: AdminAuditAction.USER_SECRETS_VIEW,
                context: { secretCount: secrets.length, githubConnected: github?.connected ?? false },
            });

            return AdminController.createSuccessResponse({ secrets, github });
        } catch (error) {
            this.logger.error('Error fetching user secrets metadata', error);
            return AdminController.createErrorResponse<AdminUserSecretsData>('Failed to load secrets', 500);
        }
    }

    /** GET /api/admin/apps/:id — cross-user app drill-down (audited). */
    static async getApp(
        request: Request,
        env: Env,
        ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<AdminAppDetailData>>> {
        try {
            const actor = context.user!;
            const appId = context.pathParams.id;
            if (!appId) {
                return AdminController.createErrorResponse<AdminAppDetailData>('App ID is required', 400);
            }

            const app = await new AppService(env).getAppDetails(appId);
            if (!app) {
                return AdminController.createErrorResponse<AdminAppDetailData>('App not found', 404);
            }

            AdminController.fireViewAudit(ctx, env, request, actor, {
                entityType: 'app',
                entityId: appId,
                action: AdminAuditAction.APP_VIEW,
            });

            return AdminController.createSuccessResponse(app);
        } catch (error) {
            this.logger.error('Error fetching app detail', error);
            return AdminController.createErrorResponse<AdminAppDetailData>('Failed to load app', 500);
        }
    }

    /**
     * Build the publicly reachable deployed URL from a stored deployment_id,
     * which is either a full https URL (new agent) or a bare subdomain label
     * (legacy agent) that needs the preview domain appended.
     */
    private static resolveDeployedUrl(env: Env, deploymentId: string): string {
        return deploymentId.startsWith('http') ? deploymentId : buildUserWorkerUrl(env, deploymentId);
    }

    /** POST /api/admin/apps/:id/screenshot — capture a fresh preview thumbnail for one deployed app. */
    static async captureAppScreenshot(
        _request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<AdminScreenshotCaptureData>>> {
        try {
            const appId = context.pathParams.id;
            if (!appId) {
                return AdminController.createErrorResponse<AdminScreenshotCaptureData>('App ID is required', 400);
            }

            const app = await new AppService(env).getAppDetails(appId);
            if (!app) {
                return AdminController.createErrorResponse<AdminScreenshotCaptureData>('App not found', 404);
            }
            if (!app.deploymentId) {
                return AdminController.createErrorResponse<AdminScreenshotCaptureData>(
                    'App has no deployment to screenshot',
                    400,
                );
            }

            const url = AdminController.resolveDeployedUrl(env, app.deploymentId);
            const { publicUrl } = await captureAndStoreScreenshot(env, appId, url);

            return AdminController.createSuccessResponse({ appId, url, screenshotUrl: publicUrl });
        } catch (error) {
            this.logger.error('Error capturing app screenshot', error);
            return AdminController.createErrorResponse<AdminScreenshotCaptureData>('Failed to capture screenshot', 500);
        }
    }

    /**
     * POST /api/admin/screenshots/backfill — capture preview thumbnails for
     * deployed apps. Defaults to apps missing a thumbnail; ?all=true refreshes
     * every deployed app. Best-effort and idempotent (re-capture overwrites
     * latest.png); a single unreachable URL never aborts the batch.
     */
    static async backfillScreenshots(
        _request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<AdminScreenshotBackfillData>>> {
        try {
            const refreshAll = context.queryParams.get('all') === 'true';
            const deployed = await new AppService(env).listDeployedApps({ missingScreenshotOnly: !refreshAll });

            const result: AdminScreenshotBackfillData = { total: deployed.length, succeeded: 0, failed: [] };
            // Sequential — respect Browser Rendering concurrency/rate limits.
            for (const app of deployed) {
                try {
                    const url = AdminController.resolveDeployedUrl(env, app.deploymentId);
                    await captureAndStoreScreenshot(env, app.id, url);
                    result.succeeded++;
                } catch (error) {
                    result.failed.push({
                        appId: app.id,
                        error: error instanceof Error ? error.message : String(error),
                    });
                }
            }

            this.logger.info('Screenshot backfill complete', { ...result, refreshAll });
            return AdminController.createSuccessResponse(result);
        } catch (error) {
            this.logger.error('Error during screenshot backfill', error);
            return AdminController.createErrorResponse<AdminScreenshotBackfillData>(
                'Failed to backfill screenshots',
                500,
            );
        }
    }

    /** GET /api/admin/audit-logs — the audit trail viewer (audited). */
    static async getAuditLogs(
        request: Request,
        env: Env,
        ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<AdminAuditListData>>> {
        try {
            const actor = context.user!;
            const userId = context.queryParams.get('userId')?.trim() || undefined;
            const entityType = context.queryParams.get('entityType')?.trim() || undefined;
            const action = context.queryParams.get('action')?.trim() || undefined;
            const limit = parseBoundedInt(context.queryParams.get('limit'), 50, 1, 200);
            const offset = parseBoundedInt(context.queryParams.get('offset'), 0, 0, Number.MAX_SAFE_INTEGER);

            const result = await new AuditLogService(env).list({ userId, entityType, action, limit, offset });

            AdminController.fireViewAudit(ctx, env, request, actor, {
                entityType: 'audit_log',
                entityId: '*',
                action: AdminAuditAction.AUDIT_VIEW,
                context: { filterUserId: userId ?? null, filterEntityType: entityType ?? null, filterAction: action ?? null },
            });

            return AdminController.createSuccessResponse(result);
        } catch (error) {
            this.logger.error('Error listing audit logs', error);
            return AdminController.createErrorResponse<AdminAuditListData>('Failed to load audit logs', 500);
        }
    }

    /** POST /api/admin/users/:id/suspend — suspend an account (audited). */
    static async suspendUser(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<AdminUserDetailData['user']>>> {
        return AdminController.runStatusMutation(request, env, context, 'suspend');
    }

    /** POST /api/admin/users/:id/reactivate — lift a suspension (audited). */
    static async reactivateUser(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<AdminUserDetailData['user']>>> {
        return AdminController.runStatusMutation(request, env, context, 'reactivate');
    }

    private static async runStatusMutation(
        request: Request,
        env: Env,
        context: RouteContext,
        kind: 'suspend' | 'reactivate',
    ): Promise<ControllerResponse<ApiResponse<AdminUserDetailData['user']>>> {
        try {
            const actor = context.user!;
            const targetUserId = context.pathParams.id;
            if (!targetUserId) {
                return AdminController.createErrorResponse('User ID is required', 400);
            }

            const parsed = await BaseController.parseJsonBody<unknown>(request);
            if (!parsed.success) {
                return parsed.response as ControllerResponse<ApiResponse<AdminUserDetailData['user']>>;
            }

            const schema = kind === 'suspend' ? suspendBodySchema : reactivateBodySchema;
            const validation = schema.safeParse(parsed.data ?? {});
            if (!validation.success) {
                const message = validation.error.issues[0]?.message ?? 'Invalid request body';
                return AdminController.createErrorResponse(message, 400);
            }

            const metadata = extractRequestMetadata(request);
            const adminService = new AdminService(env);
            const mutationParams = {
                actorId: actor.id,
                actorRole: actor.role,
                targetUserId,
                reason: validation.data.reason ?? null,
                metadata: { ipAddress: metadata.ipAddress, userAgent: metadata.userAgent },
            };

            const updated =
                kind === 'suspend'
                    ? await adminService.suspendUser(mutationParams)
                    : await adminService.reactivateUser(mutationParams);

            return AdminController.createSuccessResponse(updated);
        } catch (error) {
            if (error instanceof AdminActionError) {
                return AdminController.createErrorResponse(error.message, error.statusCode);
            }
            this.logger.error(`Error during ${kind} mutation`, error);
            return AdminController.createErrorResponse(`Failed to ${kind} user`, 500);
        }
    }
}
