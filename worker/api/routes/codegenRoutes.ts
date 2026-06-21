import { CodingAgentController } from '../controllers/agent/controller';
import { AppEnv } from '../../types/appenv';
import { Hono } from 'hono';
import { AuthConfig, setAuthLevel } from '../../middleware/auth/routeAuth';
import { adaptController } from '../honoAdapter';

/**
 * Setup and configure the application router
 */
export function setupCodegenRoutes(app: Hono<AppEnv>): void {
    // ========================================
    // CODE GENERATION ROUTES
    // ========================================
    
    // CRITICAL: Create new app - requires full authentication
    app.post('/api/agent', setAuthLevel(AuthConfig.authenticated), adaptController(CodingAgentController, CodingAgentController.startCodeGeneration));
    
    // ========================================
    // APP EDITING ROUTES (/chat/:id frontend)
    // ========================================
    
    // WebSocket for app editing — ORG MEMBERS of the app's org (for /chat/:id).
    // AuthConfig.ownerOnly resolves to checkAppOwnership (org-membership based),
    // so any member of the app's org can connect and drive — not just the creator.
    app.get('/api/agent/:agentId/ws', setAuthLevel(AuthConfig.ownerOnly), adaptController(CodingAgentController, CodingAgentController.handleWebSocketConnection));

    // Connect to existing agent for editing — org members (same org-membership gate).
    app.get('/api/agent/:agentId/connect', setAuthLevel(AuthConfig.ownerOnly), adaptController(CodingAgentController, CodingAgentController.connectToExistingAgent));

    // Deploy a live preview — org members only (was AuthConfig.authenticated, which
    // let any signed-in user trigger a preview deploy on another tenant's app).
    app.get('/api/agent/:agentId/preview', setAuthLevel(AuthConfig.ownerOnly), adaptController(CodingAgentController, CodingAgentController.deployPreview));
}