import { setupAuthRoutes } from './authRoutes';
import { setupAppRoutes } from './appRoutes';
import { setupUserRoutes } from './userRoutes';
import { setupStatsRoutes } from './statsRoutes';
import { setupAnalyticsRoutes } from './analyticsRoutes';
import { setupSecretsRoutes } from './secretsRoutes';
import { setupModelConfigRoutes } from './modelConfigRoutes';
import { setupModelProviderRoutes } from './modelProviderRoutes';
import { setupGitHubExporterRoutes } from './githubExporterRoutes';
import { setupCodegenRoutes } from './codegenRoutes';
import { setupScreenshotRoutes } from './imagesRoutes';
import { setupSentryRoutes } from './sentryRoutes';
import { setupBYOPRoutes } from './byopRoutes';
import { setupCloudflareAccountRoutes } from './cloudflareAccountRoutes';
import { setupCloudflareConnectRoutes } from './cloudflareConnectRoutes';
import { setupLimitsRoutes } from './limitsRoutes';
import { setupCapabilitiesRoutes } from './capabilitiesRoutes';
import { setupInterviewRoutes } from './interviewRoutes';
import { setupAdminRoutes } from './adminRoutes';
import { setupImpersonationRoutes } from './impersonationRoutes';
import { setupOrgRoutes } from './orgRoutes';
import { setupBillingRoutes } from './billingRoutes';
import { setupProduceRoutes } from './produceRoutes';
import { Hono } from "hono";
import { AppEnv } from "../../types/appenv";
import { setupStatusRoutes } from './statusRoutes';

export function setupRoutes(app: Hono<AppEnv>): void {
    // Health check route
    app.get('/api/health', (c) => {
        return c.json({ status: 'ok' });
    }); 
    
    // Sentry tunnel routes (public - no auth required)
    setupSentryRoutes(app);

    // Platform status routes (public)
    setupStatusRoutes(app);

    // Authentication and user management routes
    setupAuthRoutes(app);
    
    // Codegen routes
    setupCodegenRoutes(app);
    
    // User dashboard and profile routes
    setupUserRoutes(app);
    
    // App management routes
    setupAppRoutes(app);
    
    // Stats routes
    setupStatsRoutes(app);
    
    // AI Gateway Analytics routes
    setupAnalyticsRoutes(app);
    
    // Secrets management routes
    setupSecretsRoutes(app);
    
    // Model configuration and provider keys routes
    setupModelConfigRoutes(app);
    
    // Model provider routes
    setupModelProviderRoutes(app);

    // GitHub Exporter routes
    setupGitHubExporterRoutes(app);

    // Screenshot serving routes (public)
    setupScreenshotRoutes(app);

    // BYOP (Bring Your Own Project) routes
    setupBYOPRoutes(app);

    // Cloudflare account + gateway management (PR 10a)
    setupCloudflareAccountRoutes(app);

    // Cloudflare OAuth Connect (initiate + callback) (PR 10a)
    setupCloudflareConnectRoutes(app);

    // Usage limits readout (PR 10a)
    setupLimitsRoutes(app);

    // Platform capabilities / feature registry (PR 10a)
    setupCapabilitiesRoutes(app);

    // Intake interview ("21 Questions") routes
    setupInterviewRoutes(app);

    // Operator admin console (Phase 1) — superadmin-only, kill-switchable
    setupAdminRoutes(app);

    // Impersonation control (stop/extend/status; start is in setupAdminRoutes)
    setupImpersonationRoutes(app);

    // Organization management & teams (Phase 2.2) — active-org context,
    // invitations, member management (orgAdminOnly), org-switcher backend.
    setupOrgRoutes(app);

    // Sparks billing: checkout/portal (org-admin), summary (member), Stripe
    // webhook (public, signature-authenticated).
    setupBillingRoutes(app);

    // PRODUCE application intake (public, marketing-site form).
    setupProduceRoutes(app);
}
