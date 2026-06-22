/**
 * Impersonation controller — the operator "act as a user" lifecycle (Phase 1.3).
 *
 * `start` is reached only via the superadmin-gated admin route, so context.user
 * is the operator (NOT yet impersonating). `stop` / `extend` / `status` run
 * WHILE impersonating, so context.user is the TARGET and the real operator is
 * context.user.impersonatedBy — they authorize off the actor, not a role gate
 * (the effective user is no longer a superadmin). Those routes live OUTSIDE
 * /api/admin and are carved out of the impersonation block-list so an operator
 * can always exit/extend. The grant lifecycle + fail-closed audit live in
 * ImpersonationService.
 */

import { z } from 'zod';
import { BaseController } from '../baseController';
import { RouteContext } from '../../types/route-context';
import { ApiResponse, ControllerResponse } from '../types';
import { createLogger } from '../../../logger';
import { extractRequestMetadata } from '../../../utils/authUtils';
import {
    ImpersonationService,
    ImpersonationError,
} from '../../../database/services/ImpersonationService';
import type { ImpersonationSession } from '../../../database/schema';

const startBodySchema = z.object({
    reason: z.string().trim().min(1, 'A reason is required to impersonate.').max(500, 'Reason is too long.'),
});

/** A grant as the SPA needs it — drives the banner + the extend countdown. */
export interface ImpersonationGrantData {
    targetUserId: string;
    readOnly: boolean;
    expiresAt: string;
    absoluteExpiresAt: string;
    extendCount: number;
}

/** Current impersonation state for the SPA (null-ish when not impersonating). */
export interface ImpersonationStatusData {
    impersonating: boolean;
    target?: { id: string; displayName?: string; email: string };
    reason?: string;
    readOnly?: boolean;
    expiresAt?: string;
    absoluteExpiresAt?: string;
    extendCount?: number;
}

export class ImpersonationController extends BaseController {
    static logger = createLogger('ImpersonationController');

    static async start(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<ImpersonationGrantData>>> {
        try {
            const actor = context.user;
            const sessionId = context.sessionId;
            if (!actor || !sessionId) {
                return ImpersonationController.createErrorResponse('Authentication required', 401);
            }
            if (!actor.role) {
                return ImpersonationController.createErrorResponse('Operator access required', 403);
            }
            const targetUserId = context.pathParams.id;
            if (!targetUserId) {
                return ImpersonationController.createErrorResponse('User ID is required', 400);
            }

            const parsed = await BaseController.parseJsonBody<unknown>(request);
            if (!parsed.success) {
                return parsed.response as ControllerResponse<ApiResponse<ImpersonationGrantData>>;
            }
            const validation = startBodySchema.safeParse(parsed.data ?? {});
            if (!validation.success) {
                return ImpersonationController.createErrorResponse(
                    validation.error.issues[0]?.message ?? 'Invalid request body',
                    400,
                );
            }

            const metadata = extractRequestMetadata(request);
            const grant = await new ImpersonationService(env).start({
                actorId: actor.id,
                actorRole: actor.role,
                targetUserId,
                sessionId,
                reason: validation.data.reason,
                metadata: { ipAddress: metadata.ipAddress, userAgent: metadata.userAgent },
            });

            return ImpersonationController.createSuccessResponse(ImpersonationController.toGrantData(grant));
        } catch (error) {
            return ImpersonationController.mapError<ImpersonationGrantData>(error, 'start impersonation');
        }
    }

    static async stop(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<{ stopped: boolean }>>> {
        try {
            const actorId = context.user?.impersonatedBy;
            const sessionId = context.sessionId;
            if (!actorId || !sessionId) {
                return ImpersonationController.createErrorResponse('No active impersonation session.', 400);
            }
            const metadata = extractRequestMetadata(request);
            await new ImpersonationService(env).stop({
                actorId,
                sessionId,
                metadata: { ipAddress: metadata.ipAddress, userAgent: metadata.userAgent },
            });
            return ImpersonationController.createSuccessResponse({ stopped: true });
        } catch (error) {
            return ImpersonationController.mapError<{ stopped: boolean }>(error, 'stop impersonation');
        }
    }

    static async extend(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<ImpersonationGrantData>>> {
        try {
            const actorId = context.user?.impersonatedBy;
            const sessionId = context.sessionId;
            if (!actorId || !sessionId) {
                return ImpersonationController.createErrorResponse('No active impersonation session.', 400);
            }
            const metadata = extractRequestMetadata(request);
            const grant = await new ImpersonationService(env).extend({
                actorId,
                sessionId,
                metadata: { ipAddress: metadata.ipAddress, userAgent: metadata.userAgent },
            });
            return ImpersonationController.createSuccessResponse(ImpersonationController.toGrantData(grant));
        } catch (error) {
            return ImpersonationController.mapError<ImpersonationGrantData>(error, 'extend impersonation');
        }
    }

    static async status(
        _request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<ImpersonationStatusData>>> {
        try {
            const user = context.user;
            const sessionId = context.sessionId;
            if (!user?.impersonatedBy || !sessionId) {
                return ImpersonationController.createSuccessResponse({ impersonating: false });
            }
            const grant = await new ImpersonationService(env).resolveActiveGrant(sessionId);
            if (!grant) {
                return ImpersonationController.createSuccessResponse({ impersonating: false });
            }
            return ImpersonationController.createSuccessResponse({
                impersonating: true,
                target: { id: user.id, displayName: user.displayName, email: user.email },
                reason: grant.reason,
                readOnly: grant.readOnly,
                expiresAt: grant.expiresAt.toISOString(),
                absoluteExpiresAt: grant.absoluteExpiresAt.toISOString(),
                extendCount: grant.extendCount,
            });
        } catch (error) {
            return ImpersonationController.mapError<ImpersonationStatusData>(error, 'get impersonation status');
        }
    }

    private static toGrantData(grant: ImpersonationSession): ImpersonationGrantData {
        return {
            targetUserId: grant.targetUserId,
            readOnly: grant.readOnly,
            expiresAt: grant.expiresAt.toISOString(),
            absoluteExpiresAt: grant.absoluteExpiresAt.toISOString(),
            extendCount: grant.extendCount,
        };
    }

    private static mapError<T>(error: unknown, action: string): ControllerResponse<ApiResponse<T>> {
        if (error instanceof ImpersonationError) {
            return ImpersonationController.createErrorResponse<T>(error.message, error.status);
        }
        ImpersonationController.logger.error(`Error during ${action}`, error);
        return ImpersonationController.createErrorResponse<T>(`Failed to ${action}`, 500);
    }
}
