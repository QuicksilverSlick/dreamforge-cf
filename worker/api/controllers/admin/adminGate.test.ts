/**
 * Admin console gate tests (route-level, pure unit — no D1, no worker entry).
 *
 * Intentionally does NOT import from `cloudflare:test`: in the main vitest
 * project that pulls in the worker entry and dies on the MCP-SDK ajv shim
 * (the reason D1 service tests are split out). The anonymous-401 path needs no
 * real bindings — authMiddleware returns null for a tokenless request before
 * any binding is touched — so a mock env + ctx suffices.
 *
 * The 401/403/200 role semantics of AuthConfig.superadminOnly are proven in
 * worker/middleware/auth/routeAuth.test.ts (the config every admin route uses).
 * Here we prove the two things specific to this group:
 *   1. Every admin route is auth-gated — an anonymous request gets 401, never
 *      200 (catches a route that forgot setAuthLevel or is public).
 *   2. The ADMIN_CONSOLE_ENABLED kill-switch 404s the whole group when off.
 */

import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';
import { setupAdminRoutes, isAdminConsoleEnabled } from '../../routes/adminRoutes';
import type { AppEnv } from '../../../types/appenv';

const mockCtx = {
    waitUntil: () => {},
    passThroughOnException: () => {},
} as unknown as ExecutionContext;

const ADMIN_ROUTES: Array<[string, string]> = [
    ['GET', '/api/admin/overview'],
    ['GET', '/api/admin/users'],
    ['GET', '/api/admin/users/u1'],
    ['GET', '/api/admin/users/u1/apps'],
    ['GET', '/api/admin/users/u1/sessions'],
    ['GET', '/api/admin/users/u1/secrets'],
    ['GET', '/api/admin/apps/a1'],
    ['GET', '/api/admin/audit-logs'],
    ['POST', '/api/admin/users/u1/suspend'],
    ['POST', '/api/admin/users/u1/reactivate'],
];

function buildApp(): Hono<AppEnv> {
    const app = new Hono<AppEnv>();
    setupAdminRoutes(app);
    return app;
}

describe('isAdminConsoleEnabled', () => {
    it('defaults on when unset', () => {
        expect(isAdminConsoleEnabled({} as Env)).toBe(true);
    });

    it('is off only when explicitly false (case-insensitive)', () => {
        expect(isAdminConsoleEnabled({ ADMIN_CONSOLE_ENABLED: 'false' } as Env)).toBe(false);
        expect(isAdminConsoleEnabled({ ADMIN_CONSOLE_ENABLED: 'FALSE' } as Env)).toBe(false);
        expect(isAdminConsoleEnabled({ ADMIN_CONSOLE_ENABLED: 'true' } as Env)).toBe(true);
        expect(isAdminConsoleEnabled({ ADMIN_CONSOLE_ENABLED: 'anything' } as Env)).toBe(true);
    });
});

describe('admin route gating', () => {
    it('rejects anonymous requests on every admin route with 401', async () => {
        const app = buildApp();
        for (const [method, path] of ADMIN_ROUTES) {
            const res = await app.request(path, { method }, {} as Env, mockCtx);
            expect(res.status, `${method} ${path} should require auth`).toBe(401);
        }
    });

    it('404s the whole group when the kill-switch is off (before auth runs)', async () => {
        const app = buildApp();
        const disabledEnv = { ADMIN_CONSOLE_ENABLED: 'false' } as Env;
        for (const [method, path] of ADMIN_ROUTES) {
            const res = await app.request(path, { method }, disabledEnv, mockCtx);
            expect(res.status, `${method} ${path} should 404 when disabled`).toBe(404);
        }
    });
});
