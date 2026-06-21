/**
 * Org-routes gate test (route-level, pure unit — no D1, no worker entry).
 *
 * Like adminGate.test.ts, this intentionally avoids `cloudflare:test` (which
 * loads the worker entry and dies on the MCP-SDK ajv shim). The anonymous-401
 * path needs no real bindings — authMiddleware returns null for a tokenless
 * request before any binding is touched.
 *
 * The 401/403 semantics of AuthConfig.orgAdminOnly are proven in
 * worker/middleware/auth/routeAuth.test.ts. Here we prove every org route is
 * auth-gated — an anonymous request gets 401, never 200 (catches a route that
 * forgot setAuthLevel or is accidentally public).
 */

import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';
import { setupOrgRoutes } from '../../routes/orgRoutes';
import type { AppEnv } from '../../../types/appenv';

const mockCtx = {
    waitUntil: () => {},
    passThroughOnException: () => {},
} as unknown as ExecutionContext;

const ORG_ROUTES: Array<[string, string]> = [
    ['GET', '/api/orgs'],
    ['POST', '/api/orgs'],
    ['POST', '/api/auth/switch-org'],
    ['POST', '/api/invites/tok-123/accept'],
    ['PATCH', '/api/orgs/o1'],
    ['DELETE', '/api/orgs/o1'],
    ['GET', '/api/orgs/o1/members'],
    ['PATCH', '/api/orgs/o1/members/u1'],
    ['DELETE', '/api/orgs/o1/members/u1'],
    ['GET', '/api/orgs/o1/invites'],
    ['POST', '/api/orgs/o1/invites'],
    ['DELETE', '/api/orgs/o1/invites/i1'],
];

function buildApp(): Hono<AppEnv> {
    const app = new Hono<AppEnv>();
    setupOrgRoutes(app);
    return app;
}

describe('org route gating', () => {
    it('rejects anonymous requests on every org route with 401', async () => {
        const app = buildApp();
        for (const [method, path] of ORG_ROUTES) {
            const res = await app.request(path, { method }, {} as Env, mockCtx);
            expect(res.status, `${method} ${path} should require auth`).toBe(401);
        }
    });
});
