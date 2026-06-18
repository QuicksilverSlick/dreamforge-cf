/**
 * Role-gated auth tier (Phase 0 keystone). The 'role' level must fail closed:
 * anonymous → 401, wrong role → 403, allowed role → pass. Org 'admin' and
 * 'user' must NOT reach platform-staff surfaces.
 */

import { describe, expect, it } from 'vitest';
import { routeAuthChecks, AuthConfig } from './routeAuth';
import type { AuthUser, UserRole } from '../../types/auth-types';

const env = {} as Env;

function user(role?: UserRole): AuthUser {
    return { id: 'u1', email: 'u1@example.com', role };
}

describe('routeAuthChecks — superadminOnly', () => {
    it('rejects anonymous with 401', async () => {
        const r = await routeAuthChecks(null, env, AuthConfig.superadminOnly, {});
        expect(r.success).toBe(false);
        expect(r.response?.status).toBe(401);
    });

    it('rejects a normal user with 403', async () => {
        const r = await routeAuthChecks(user('user'), env, AuthConfig.superadminOnly, {});
        expect(r.success).toBe(false);
        expect(r.response?.status).toBe(403);
    });

    it('rejects org admin with 403 (org admin is not a platform operator)', async () => {
        const r = await routeAuthChecks(user('admin'), env, AuthConfig.superadminOnly, {});
        expect(r.success).toBe(false);
        expect(r.response?.status).toBe(403);
    });

    it('rejects support with 403 (only superadmin passes superadminOnly)', async () => {
        const r = await routeAuthChecks(user('support'), env, AuthConfig.superadminOnly, {});
        expect(r.success).toBe(false);
    });

    it('admits superadmin', async () => {
        const r = await routeAuthChecks(user('superadmin'), env, AuthConfig.superadminOnly, {});
        expect(r.success).toBe(true);
    });

    it('rejects a user with no role (fail closed)', async () => {
        const r = await routeAuthChecks(user(undefined), env, AuthConfig.superadminOnly, {});
        expect(r.success).toBe(false);
    });
});

describe('routeAuthChecks — platformStaff', () => {
    it.each<[UserRole, boolean]>([
        ['superadmin', true],
        ['support', true],
        ['ai_support', true],
        ['ai_admin', true],
        ['admin', false], // org admin is not platform staff
        ['user', false],
    ])('role %s → allowed=%s', async (role, allowed) => {
        const r = await routeAuthChecks(user(role), env, AuthConfig.platformStaff, {});
        expect(r.success).toBe(allowed);
    });
});
