/**
 * BYOP (Bring Your Own Project) Routes
 * Handles GitHub repository import and analysis
 */

import { Hono } from 'hono';
import { AppEnv } from '../../types/appenv';
import { adaptController } from '../honoAdapter';
import { BYOPController } from '../controllers/byop/controller';
import { AuthConfig, setAuthLevel } from '../../middleware/auth/routeAuth';

/**
 * Setup BYOP routes
 */
export function setupBYOPRoutes(app: Hono<AppEnv>): void {
    const byopRouter = new Hono<AppEnv>();

    // List user's GitHub repositories (requires authentication)
    byopRouter.get(
        '/repositories',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(BYOPController, BYOPController.listRepositories)
    );

    // Initiate repository import (requires authentication)
    byopRouter.post(
        '/import',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(BYOPController, BYOPController.initiateImport)
    );

    // Get analysis status
    byopRouter.get(
        '/analysis/:analysisId/status',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(BYOPController, BYOPController.getAnalysisStatus)
    );

    // Get completed blueprint
    byopRouter.get(
        '/analysis/:analysisId/blueprint',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(BYOPController, BYOPController.getBlueprint)
    );

    // Mount the BYOP router under /api/byop
    app.route('/api/byop', byopRouter);
}
