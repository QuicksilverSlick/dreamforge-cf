/**
 * Billing routes (/api/billing/* + /api/orgs/:id/billing/*) — spec §5.2.
 *
 * Auth gates (§9.1-F1):
 *  - orgAdminOnly for the two MUTATING surfaces (checkout, portal): only an
 *    owner/admin of the route's org — which must be their ACTIVE org — can
 *    charge the shared pool, change the plan, or see invoices/payment method.
 *  - authenticated for the read-only summary (any member; active-org scoped).
 *  - public for the Stripe webhook: the signature IS the authentication, and
 *    app.ts exempts exactly this path from CSRF + the global API rate limiter
 *    (§9.1-F2/F3).
 */

import { Hono } from 'hono';
import { AppEnv } from '../../types/appenv';
import { AuthConfig, setAuthLevel } from '../../middleware/auth/routeAuth';
import { adaptController } from '../honoAdapter';
import { BillingController } from '../controllers/billing/controller';

export function setupBillingRoutes(app: Hono<AppEnv>): void {
    // ---- Org admin only (mutating) ----
    app.post(
        '/api/orgs/:id/billing/checkout-session',
        setAuthLevel(AuthConfig.orgAdminOnly),
        adaptController(BillingController, BillingController.createCheckoutSession),
    );
    app.post(
        '/api/orgs/:id/billing/portal-session',
        setAuthLevel(AuthConfig.orgAdminOnly),
        adaptController(BillingController, BillingController.createPortalSession),
    );

    // ---- Any authenticated member (read-only) ----
    app.get(
        '/api/billing/summary',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(BillingController, BillingController.getSummary),
    );

    // ---- Stripe webhook (signature-authenticated) ----
    app.post(
        '/api/billing/webhook',
        setAuthLevel(AuthConfig.public),
        adaptController(BillingController, BillingController.handleWebhook),
    );
}
