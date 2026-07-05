/**
 * PRODUCE application intake route (/api/produce/apply).
 *
 * Public: the marketing-site form (getdreamforge.com/apply) posts here with
 * no session and no CSRF cookie — app.ts skips the double-submit check for
 * exactly this path, and the controller enforces the Origin allowlist plus a
 * honeypot instead. The global IP rate limiter still applies.
 */

import { Hono } from 'hono';
import { AppEnv } from '../../types/appenv';
import { AuthConfig, setAuthLevel } from '../../middleware/auth/routeAuth';
import { adaptController } from '../honoAdapter';
import { ProduceController } from '../controllers/produce/controller';

export function setupProduceRoutes(app: Hono<AppEnv>): void {
    app.post(
        '/api/produce/apply',
        setAuthLevel(AuthConfig.public),
        adaptController(ProduceController, ProduceController.submitApplication),
    );
}
