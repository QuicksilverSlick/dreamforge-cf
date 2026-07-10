/**
 * Route Authentication Middleware
 */

import { createMiddleware } from 'hono/factory';
import { AuthUser, UserRole, PLATFORM_STAFF_ROLES } from '../../types/auth-types';
import { createLogger } from '../../logger';
import { AppService, UserService } from '../../database';
import { authMiddleware } from './auth';
import { RateLimitService } from '../../services/rate-limit/rateLimits';
import { errorResponse } from '../../api/responses';
import { Context } from 'hono';
import { AppEnv } from '../../types/appenv';
import { RateLimitExceededError } from 'shared/types/errors';
import * as Sentry from '@sentry/cloudflare';
import { getUserConfigurableSettings } from 'worker/config';
import { evaluateImpersonationPolicy, isMutatingMethod } from './impersonationPolicy';
import { AuditLogService, AdminAuditAction } from '../../database/services/AuditLogService';
import { extractRequestMetadata } from '../../utils/authUtils';

const logger = createLogger('RouteAuth');

/**
 * Authentication levels for route protection
 */
export type AuthLevel = 'public' | 'authenticated' | 'owner-only' | 'role' | 'org-admin';

/**
 * Authentication requirement configuration
 */
export interface AuthRequirement {
    required: boolean;
    level: AuthLevel;
    resourceOwnershipCheck?: (user: AuthUser, params: Record<string, string>, env: Env) => Promise<boolean>;
    /** For level 'role': the platform roles allowed through (fail-closed). */
    allowedRoles?: readonly UserRole[];
}

/**
 * Common auth requirement configurations
 */
export const AuthConfig = {
    // Public route - no authentication required
    public: { 
        required: false,
        level: 'public' as const
    },
    
    // Require full authentication (no anonymous users)
    authenticated: { 
        required: true, 
        level: 'authenticated' as const 
    },
    
    // Require resource ownership (for app editing)
    ownerOnly: {
        required: true,
        level: 'owner-only' as const,
        resourceOwnershipCheck: checkAppOwnership
    },

    // Platform operator only (the highest role). For destructive admin actions.
    superadminOnly: {
        required: true,
        level: 'role' as const,
        allowedRoles: ['superadmin'] as const,
    },

    // Any platform-staff role (superadmin/support/ai_support/ai_admin). For
    // operator dashboard + read-only support surfaces. Excludes org 'admin'
    // and 'user'.
    platformStaff: {
        required: true,
        level: 'role' as const,
        allowedRoles: PLATFORM_STAFF_ROLES,
    },

    // Org owner/admin of the route's target org — and only when that org is the
    // actor's ACTIVE org. For team member-management surfaces. This plane is
    // entirely separate from the platform-role plane: an org admin is NOT
    // platform staff and can never satisfy superadminOnly/platformStaff.
    orgAdminOnly: {
        required: true,
        level: 'org-admin' as const,
    },

    // Public read access, but owner required for modifications
    publicReadOwnerWrite: {
        required: false
    }
} as const;

/**
 * Route authentication logic that enforces authentication requirements
 */
export async function routeAuthChecks(
    user: AuthUser | null,
    env: Env,
    requirement: AuthRequirement,
    params?: Record<string, string>
): Promise<{ success: boolean; response?: Response }> {
    try {
        // Public routes always pass
        if (requirement.level === 'public') {
            return { success: true };
        }

        // For authenticated routes
        if (requirement.level === 'authenticated') {
            if (!user) {
                return {
                    success: false,
                    response: createAuthRequiredResponse()
                };
            }

            return { success: true };
        }

        // For owner-only routes
        if (requirement.level === 'owner-only') {
            if (!user) {
                return {
                    success: false,
                    response: createAuthRequiredResponse('Account required')
                };
            }

            // Check resource ownership if function provided
            if (requirement.resourceOwnershipCheck) {
                if (params) {
                    const isOwner = await requirement.resourceOwnershipCheck(user, params, env);
                    return {
                        success: isOwner,
                        response: isOwner ? undefined : createForbiddenResponse('You can only access your own resources')
                    }
                }
                return {
                    success: false,
                    response: createForbiddenResponse('Invalid resource ownership')
                };
            }

            return { success: true };
        }

        // For role-gated routes (platform admin/support surfaces). Fail closed:
        // no user => 401; user whose role is not in allowedRoles => 403.
        if (requirement.level === 'role') {
            if (!user) {
                return {
                    success: false,
                    response: createAuthRequiredResponse('Account required')
                };
            }
            const allowed = requirement.allowedRoles ?? [];
            if (!user.role || !allowed.includes(user.role)) {
                return {
                    success: false,
                    response: createForbiddenResponse('Operator access required')
                };
            }
            return { success: true };
        }

        // For org-admin routes (tenant member-management surfaces). Fail closed:
        // no user => 401; otherwise require the actor to be owner/admin AND the
        // route's :id (org id) to equal the actor's ACTIVE org. Tying to the
        // active org means user.orgRole is exactly the actor's role in the org
        // under management, so cross-tenant management is structurally
        // impossible — a member of org A can never act on org B.
        if (requirement.level === 'org-admin') {
            if (!user) {
                return {
                    success: false,
                    response: createAuthRequiredResponse('Account required')
                };
            }
            const targetOrgId = params?.id;
            const isOrgAdmin = user.orgRole === 'owner' || user.orgRole === 'admin';
            if (!targetOrgId || !user.orgId || targetOrgId !== user.orgId || !isOrgAdmin) {
                return {
                    success: false,
                    response: createForbiddenResponse('Organization admin access required')
                };
            }
            return { success: true };
        }

        // Default fallback
        return { success: true };
    } catch (error) {
        logger.error('Error in route auth middleware', error);
        return {
            success: false,
            response: new Response(JSON.stringify({
                success: false,
                error: 'Authentication check failed'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        };
    }
}

/*
 * Enforce authentication requirement
 */
export async function enforceAuthRequirement(c: Context<AppEnv>) : Promise<Response | undefined> {
    let user: AuthUser | null = c.get('user') || null;

    const requirement = c.get('authLevel');
    if (!requirement) {
        logger.error('No authentication level found');
        return errorResponse('No authentication level found', 500);
    }
    
    // Only perform auth if we need it or don't have user yet
    if (!user && (requirement.level === 'authenticated' || requirement.level === 'owner-only' || requirement.level === 'role' || requirement.level === 'org-admin')) {
        const userSession = await authMiddleware(c.req.raw, c.env);
        if (!userSession) {
            return errorResponse('Authentication required', 401);
        }
        user = userSession.user;
        c.set('user', user);
		c.set('sessionId', userSession.sessionId);
		if (user.impersonatedBy) {
			// Attribute errors to the REAL operator, not the impersonated user,
			// and tag the impersonated target for forensics.
			Sentry.setUser({ id: user.impersonatedBy });
			Sentry.setTag('impersonating', user.id);
		} else {
			Sentry.setUser({ id: user.id, email: user.email });
		}

        touchActorActivity(c, user, userSession.actorLastActiveAt);

        const config = await getUserConfigurableSettings(c.env, user.id);
        c.set('config', config);

        try {
            await RateLimitService.enforceAuthRateLimit(c.env, config.security.rateLimit, user, c.req.raw);
        } catch (error) {
            if (error instanceof RateLimitExceededError) {
                return errorResponse(error, 429);
            }
            logger.error('Error enforcing auth rate limit', error);
            return errorResponse('Internal server error', 500);
        }
    }
    
    // Impersonation policy: deny block-listed routes (and, for a read-only
    // session, any mutation) whenever the resolved identity is an impersonation —
    // independent of the route's own auth level, enforced in the server not the UI.
    if (user?.impersonatedBy) {
        const denial = evaluateImpersonationPolicy(user, c.req.method, c.req.path);
        if (denial) {
            await auditImpersonationDenial(c, user, denial.reason);
            return createForbiddenResponse(`Action not permitted while impersonating: ${denial.reason}.`);
        }
        // Allowed mutation under impersonation: record an actor-attributed audit
        // row so every write the operator makes AS the customer is non-repudiable
        // (the "audited-only" guarantee covers the writes, not just lifecycle).
        // Off the response path, fail-open — never blocks or slows the action.
        if (isMutatingMethod(c.req.method)) {
            auditImpersonatedAction(c, user);
        }
    }

    const params = c.req.param();
    const env = c.env;
    const result = await routeAuthChecks(user, env, requirement, params);
    if (!result.success) {
        logger.warn('Authentication check failed', result.response, requirement, user);
        return result.response;
    }
}

/** Refresh `users.lastActiveAt` at most this often per actor. */
const LAST_ACTIVE_TOUCH_INTERVAL_MS = 15 * 60 * 1000;

/**
 * Pure throttle decision for the activity touch. Exported for tests.
 * - `undefined` (chokepoint didn't resolve the value) => never touch — without
 *   a staleness reading, touching would write on EVERY request on that path.
 * - `null` (user has never been stamped) => touch.
 * - stale beyond the interval => touch; fresh => skip.
 */
export function shouldTouchActivity(actorLastActiveAt: Date | null | undefined, now: number): boolean {
    if (actorLastActiveAt === undefined) return false;
    if (actorLastActiveAt === null) return true;
    return now - actorLastActiveAt.getTime() >= LAST_ACTIVE_TOUCH_INTERVAL_MS;
}

/**
 * Throttled, fire-and-forget stamp of the REAL actor's `users.lastActiveAt`
 * (the admin console's "Last active" column). Attribution follows the actor:
 * during impersonation the OPERATOR's row is touched, never the target's, so
 * viewing-as can never fabricate customer activity. The staleness reading
 * rides the chokepoint's existing per-request users select (zero extra reads);
 * the write is off the response path and capped at one per actor per interval.
 */
function touchActorActivity(
    c: Context<AppEnv>,
    user: AuthUser,
    actorLastActiveAt: Date | null | undefined,
): void {
    if (!shouldTouchActivity(actorLastActiveAt, Date.now())) {
        return;
    }
    const actorId = user.impersonatedBy ?? user.id;
    const write = new UserService(c.env)
        .updateUserActivity(actorId)
        .catch((error) => logger.error('Failed to touch lastActiveAt', error));
    try {
        c.executionCtx.waitUntil(write);
    } catch {
        // No execution context available — the write is already best-effort.
        void write;
    }
}

/**
 * Best-effort audit of a denied impersonated action (fail-open — a denial must
 * never be blocked by audit-write health). actorId = the real operator.
 */
async function auditImpersonationDenial(
    c: Context<AppEnv>,
    user: AuthUser,
    reason: string,
): Promise<void> {
    logger.warn('Impersonation policy denied a request', {
        actorId: user.impersonatedBy,
        targetId: user.id,
        method: c.req.method,
        path: c.req.path,
        reason,
    });
    try {
        await new AuditLogService(c.env).record({
            actorId: user.impersonatedBy ?? user.id,
            actorRole: user.impersonatorRole,
            entityType: 'user',
            entityId: user.id,
            action: AdminAuditAction.IMPERSONATION_DENIED,
            newValues: { method: c.req.method, path: c.req.path, reason },
            metadata: extractRequestMetadata(c.req.raw),
        });
    } catch (error) {
        logger.error('Failed to audit impersonation denial', error);
    }
}

/**
 * Best-effort, off-the-response-path audit of an ALLOWED mutating action made
 * while impersonating. actorId = the real operator; never blocks or slows the
 * action (fired through waitUntil, like read audits).
 */
function auditImpersonatedAction(c: Context<AppEnv>, user: AuthUser): void {
    const write = new AuditLogService(c.env)
        .record({
            actorId: user.impersonatedBy ?? user.id,
            actorRole: user.impersonatorRole,
            entityType: 'user',
            entityId: user.id,
            action: AdminAuditAction.IMPERSONATION_ACTION,
            newValues: { method: c.req.method, path: c.req.path },
            metadata: extractRequestMetadata(c.req.raw),
        })
        .catch((error) => logger.error('Failed to audit impersonated action', error));
    try {
        c.executionCtx.waitUntil(write);
    } catch {
        // No execution context available — record() is already best-effort.
        void write;
    }
}

export function setAuthLevel(requirement: AuthRequirement) {
    return createMiddleware(async (c, next) => {
        c.set('authLevel', requirement);
        return await next();
    })
}

/**
 * Create standardized authentication required response
 */
function createAuthRequiredResponse(message?: string): Response {
    return new Response(JSON.stringify({
        success: false,
        error: {
            type: 'AUTHENTICATION_REQUIRED',
            message: message || 'Authentication required',
            action: 'login'
        }
    }), {
        status: 401,
        headers: {
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Bearer realm="API"'
        }
    });
}

/**
 * Create standardized forbidden response
 */
function createForbiddenResponse(message: string): Response {
    return new Response(JSON.stringify({
        success: false,
        error: {
            type: 'FORBIDDEN',
            message,
            action: 'insufficient_permissions'
        }
    }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
    });
}

/**
 * Check if user owns an app by agent/app ID
 */
export async function checkAppOwnership(user: AuthUser, params: Record<string, string>, env: Env): Promise<boolean> {
    try {
        const agentId = params.agentId || params.id;
        if (!agentId) {
            return false;
        }

        const appService = new AppService(env);
        const ownershipResult = await appService.checkAppOwnership(agentId, user.id);
        return ownershipResult.isOwner;
    } catch (error) {
        logger.error('Error checking app ownership', error);
        return false;
    }
}