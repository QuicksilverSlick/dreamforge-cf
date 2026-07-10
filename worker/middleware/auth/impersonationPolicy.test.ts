/**
 * Impersonation policy tests (Phase 1.2). Pure logic: reads always pass; a
 * non-impersonated request is never gated; a read-only session denies every
 * mutation; a full-write session denies exactly the documented block-list.
 */

import { describe, it, expect } from 'vitest';
import { evaluateImpersonationPolicy, isMutatingMethod } from './impersonationPolicy';
import type { AuthUser } from '../../types/auth-types';

const base: AuthUser = { id: 'target', email: 'target@example.com', role: 'user' };
const impersonated: AuthUser = { ...base, impersonatedBy: 'op', impersonatorRole: 'superadmin', impersonationReadOnly: false };
const readOnly: AuthUser = { ...impersonated, impersonationReadOnly: true };

describe('isMutatingMethod', () => {
    it('flags non-idempotent methods only', () => {
        for (const m of ['POST', 'put', 'Patch', 'DELETE']) expect(isMutatingMethod(m)).toBe(true);
        for (const m of ['GET', 'head', 'OPTIONS']) expect(isMutatingMethod(m)).toBe(false);
    });
});

describe('evaluateImpersonationPolicy', () => {
    it('never gates a non-impersonated request, even a block-listed mutation', () => {
        expect(evaluateImpersonationPolicy(base, 'DELETE', '/api/apps/abc')).toBeNull();
        expect(evaluateImpersonationPolicy(base, 'POST', '/api/secrets')).toBeNull();
    });

    it('always allows reads during impersonation, even on sensitive paths', () => {
        expect(evaluateImpersonationPolicy(impersonated, 'GET', '/api/secrets')).toBeNull();
        expect(evaluateImpersonationPolicy(readOnly, 'GET', '/api/orgs/o1/members')).toBeNull();
        expect(evaluateImpersonationPolicy(impersonated, 'HEAD', '/api/apps/abc')).toBeNull();
    });

    it('read-only session denies EVERY mutation regardless of path', () => {
        expect(evaluateImpersonationPolicy(readOnly, 'POST', '/api/apps/abc/favorite')?.reason).toBe('read-only impersonation session');
        expect(evaluateImpersonationPolicy(readOnly, 'PUT', '/api/anything')?.reason).toBe('read-only impersonation session');
    });

    it('ALWAYS allows the exit/extend control endpoints (even read-only) so a session can never trap itself', () => {
        for (const u of [impersonated, readOnly]) {
            expect(evaluateImpersonationPolicy(u, 'POST', '/api/impersonation/stop')).toBeNull();
            expect(evaluateImpersonationPolicy(u, 'POST', '/api/impersonation/extend')).toBeNull();
        }
    });

    it('full-write session denies exactly the block-list', () => {
        const blocked: Array<[string, string]> = [
            ['PUT', '/api/auth/profile'],
            ['PUT', '/api/user/profile'],
            ['DELETE', '/api/auth/sessions/s1'],
            ['POST', '/api/secrets'],
            ['DELETE', '/api/secrets/x1'],
            ['POST', '/api/user/providers'],
            ['PUT', '/api/user/providers/p1'],
            ['POST', '/api/cloudflare/accounts'],
            ['POST', '/api/github-app/export'],
            ['DELETE', '/api/apps/abc'],
            ['POST', '/api/orgs'],
            ['DELETE', '/api/orgs/o1/members/u2'],
            ['POST', '/api/invites/tok/accept'],
            ['POST', '/api/admin/users/u1/impersonate'],
            // Real inference billed to the target's credits/BYOK quota.
            ['POST', '/api/model-configs/test'],
        ];
        for (const [method, path] of blocked) {
            expect(evaluateImpersonationPolicy(impersonated, method, path), `${method} ${path}`).not.toBeNull();
        }
    });

    it('full-write session allows benign mutations not on the block-list', () => {
        const allowed: Array<[string, string]> = [
            ['POST', '/api/apps/abc/favorite'],
            ['POST', '/api/apps/abc/star'],
            ['PUT', '/api/apps/abc/visibility'],
            ['POST', '/api/agent'],
            ['POST', '/api/auth/switch-org'],
            ['POST', '/api/interview/answer'],
            // The audited support-fix path: EDITING a customer's model config
            // stays allowed — only the /test inference spend is blocked.
            ['PUT', '/api/model-configs/blueprint'],
        ];
        for (const [method, path] of allowed) {
            expect(evaluateImpersonationPolicy(impersonated, method, path), `${method} ${path}`).toBeNull();
        }
    });
});
