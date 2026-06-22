/**
 * Impersonation-control routes (/api/impersonation/*).
 *
 * Invoked by the OPERATOR while impersonating, so the effective identity is the
 * TARGET and these gate on AuthConfig.authenticated — the controller authorizes
 * off context.user.impersonatedBy (the real operator), not a role (the effective
 * user is no longer a superadmin). They live OUTSIDE /api/admin and are carved
 * out of the impersonation block-list (impersonationPolicy.ts ALWAYS_ALLOWED) so
 * an operator can ALWAYS exit / extend a session. The reason-gated, superadmin-
 * only `start` endpoint lives in adminRoutes.ts.
 */

import { Hono } from 'hono';
import { AppEnv } from '../../types/appenv';
import { AuthConfig, setAuthLevel } from '../../middleware/auth/routeAuth';
import { adaptController } from '../honoAdapter';
import { ImpersonationController } from '../controllers/impersonation/controller';

export function setupImpersonationRoutes(app: Hono<AppEnv>): void {
    app.get(
        '/api/impersonation/status',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(ImpersonationController, ImpersonationController.status),
    );
    app.post(
        '/api/impersonation/extend',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(ImpersonationController, ImpersonationController.extend),
    );
    app.post(
        '/api/impersonation/stop',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(ImpersonationController, ImpersonationController.stop),
    );
}
