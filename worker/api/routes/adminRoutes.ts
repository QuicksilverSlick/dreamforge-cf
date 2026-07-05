/**
 * Operator admin console routes (/api/admin/*).
 *
 * Every route is gated by AuthConfig.superadminOnly (fail-closed, role
 * resolved per-request from D1 — see routeAuth.ts). Reads and mutations alike
 * stay superadmin-only in Phase 1; widening read access to platformStaff later
 * is a one-line change to ADMIN_AUTH below.
 *
 * A server-side kill-switch (ADMIN_CONSOLE_ENABLED) 404s the whole group
 * without a redeploy: set it to 'false' as a dashboard secret/var to disable
 * the console instantly if an endpoint misbehaves in production. Default on.
 */

import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { AppEnv } from '../../types/appenv';
import { AuthConfig, setAuthLevel } from '../../middleware/auth/routeAuth';
import { adaptController } from '../honoAdapter';
import { AdminController } from '../controllers/admin/controller';
import { AdminBillingController } from '../controllers/admin/billingController';
import { AdminProduceApplicationsController } from '../controllers/admin/produceApplicationsController';
import { ImpersonationController } from '../controllers/impersonation/controller';

/** Read/mutation gate for the admin console. superadmin-only in Phase 1. */
const ADMIN_AUTH = AuthConfig.superadminOnly;

/**
 * Whether the admin console is enabled. Off only when explicitly set to
 * 'false'; absent or any other value means enabled (default on), so shipping
 * requires no configuration.
 */
export function isAdminConsoleEnabled(env: Env): boolean {
    return (env.ADMIN_CONSOLE_ENABLED ?? 'true').toLowerCase() !== 'false';
}

/** Kill-switch middleware: 404 the whole group when the console is disabled. */
const requireAdminConsole = createMiddleware<AppEnv>(async (c, next) => {
    if (!isAdminConsoleEnabled(c.env)) {
        return c.json({ success: false, error: { type: 'NOT_FOUND', message: 'Not found' } }, 404);
    }
    return next();
});

export function setupAdminRoutes(app: Hono<AppEnv>): void {
    // ---- Read surfaces ----
    // ---- Sparks billing controls (spec §0.5) ----
    app.get(
        '/api/admin/billing/summary',
        requireAdminConsole,
        setAuthLevel(ADMIN_AUTH),
        adaptController(AdminBillingController, AdminBillingController.getBillingSummary),
    );
    app.post(
        '/api/admin/billing/adjust',
        requireAdminConsole,
        setAuthLevel(ADMIN_AUTH),
        adaptController(AdminBillingController, AdminBillingController.adjustCredits),
    );

    // ---- PRODUCE application pipeline (sales console) ----
    app.get(
        '/api/admin/produce/applications',
        requireAdminConsole,
        setAuthLevel(ADMIN_AUTH),
        adaptController(AdminProduceApplicationsController, AdminProduceApplicationsController.listApplications),
    );
    app.patch(
        '/api/admin/produce/applications/:id',
        requireAdminConsole,
        setAuthLevel(AuthConfig.superadminOnly),
        adaptController(AdminProduceApplicationsController, AdminProduceApplicationsController.updateApplicationStatus),
    );

    app.get(
        '/api/admin/overview',
        requireAdminConsole,
        setAuthLevel(ADMIN_AUTH),
        adaptController(AdminController, AdminController.getOverview),
    );
    app.get(
        '/api/admin/users',
        requireAdminConsole,
        setAuthLevel(ADMIN_AUTH),
        adaptController(AdminController, AdminController.listUsers),
    );
    app.get(
        '/api/admin/users/:id',
        requireAdminConsole,
        setAuthLevel(ADMIN_AUTH),
        adaptController(AdminController, AdminController.getUser),
    );
    app.get(
        '/api/admin/users/:id/apps',
        requireAdminConsole,
        setAuthLevel(ADMIN_AUTH),
        adaptController(AdminController, AdminController.getUserApps),
    );
    app.get(
        '/api/admin/users/:id/sessions',
        requireAdminConsole,
        setAuthLevel(ADMIN_AUTH),
        adaptController(AdminController, AdminController.getUserSessions),
    );
    app.get(
        '/api/admin/users/:id/secrets',
        requireAdminConsole,
        setAuthLevel(ADMIN_AUTH),
        adaptController(AdminController, AdminController.getUserSecrets),
    );
    app.get(
        '/api/admin/apps',
        requireAdminConsole,
        setAuthLevel(ADMIN_AUTH),
        adaptController(AdminController, AdminController.listApps),
    );
    app.get(
        '/api/admin/apps/:id',
        requireAdminConsole,
        setAuthLevel(ADMIN_AUTH),
        adaptController(AdminController, AdminController.getApp),
    );
    app.get(
        '/api/admin/audit-logs',
        requireAdminConsole,
        setAuthLevel(ADMIN_AUTH),
        adaptController(AdminController, AdminController.getAuditLogs),
    );

    // ---- Account actions (mutations stay superadmin-only) ----
    app.post(
        '/api/admin/users/:id/suspend',
        requireAdminConsole,
        setAuthLevel(AuthConfig.superadminOnly),
        adaptController(AdminController, AdminController.suspendUser),
    );
    app.post(
        '/api/admin/users/:id/reactivate',
        requireAdminConsole,
        setAuthLevel(AuthConfig.superadminOnly),
        adaptController(AdminController, AdminController.reactivateUser),
    );

    // Start impersonating a user (reason-gated). Superadmin-only; the operator is
    // NOT yet impersonating here. stop/extend/status live under /api/impersonation
    // (actor-gated) since by then the effective user is the target, not an admin.
    app.post(
        '/api/admin/users/:id/impersonate',
        requireAdminConsole,
        setAuthLevel(AuthConfig.superadminOnly),
        adaptController(ImpersonationController, ImpersonationController.start),
    );

    // ---- Preview screenshots (operator-triggered capture/backfill) ----
    app.post(
        '/api/admin/apps/:id/screenshot',
        requireAdminConsole,
        setAuthLevel(AuthConfig.superadminOnly),
        adaptController(AdminController, AdminController.captureAppScreenshot),
    );
    app.post(
        '/api/admin/screenshots/backfill',
        requireAdminConsole,
        setAuthLevel(AuthConfig.superadminOnly),
        adaptController(AdminController, AdminController.backfillScreenshots),
    );
}
