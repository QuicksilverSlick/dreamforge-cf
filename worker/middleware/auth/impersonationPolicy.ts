/**
 * Impersonation request policy (Phase 1.2). Enforced in the auth middleware for
 * any request whose resolved AuthUser carries `impersonatedBy` — in the SERVER,
 * never the UI. Two layers:
 *
 *  1. READ-ONLY (the AI-agent default, Phase 2; an optional human mode): when
 *     `impersonationReadOnly` is set, EVERY mutating (non-idempotent) method is
 *     denied. Complete by construction — a route added later is denied by
 *     default for a read-only session.
 *
 *  2. BLOCK-LIST: a documented, ADJUSTABLE deny-list of sensitive routes that are
 *     forbidden during ANY impersonation, even a human full-write session. The
 *     real actor is a trusted operator (they could reach these via direct
 *     superadmin access), so this is defense-in-depth against ACCIDENTAL damage
 *     to a customer account + a hard audit boundary — NOT an anti-malicious-
 *     operator control. Add/remove entries in BLOCK_RULES as routes evolve; the
 *     authoritative list is also mirrored in docs/handoff/IMPERSONATION-PHASE-1.md.
 *
 * LIMITATION — this gate is method+path based, so STATE-CHANGING GET endpoints
 * (e.g. an OAuth-connect initiator that mints a binding to user.id, then a PUBLIC
 * callback consumes it) are NOT caught here and MUST self-gate at their
 * controller on `user.impersonatedBy`. See CloudflareConnectController.initiateConnect.
 */

import type { AuthUser } from '../../types/auth-types';

/** Non-idempotent HTTP methods — denied wholesale for a read-only impersonation. */
const MUTATING_METHODS: ReadonlySet<string> = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function isMutatingMethod(method: string): boolean {
    return MUTATING_METHODS.has(method.toUpperCase());
}

interface BlockRule {
    /** Human-readable category (also the audited denial reason). */
    label: string;
    /** True if this rule blocks the given request path (already known to be mutating). */
    matches: (path: string) => boolean;
}

/** Matches an exact path or any sub-path under it. */
const underPrefix = (prefix: string) => (path: string): boolean =>
    path === prefix || path.startsWith(`${prefix}/`);

/**
 * The block-list. Each rule denies a MUTATING request to a sensitive surface.
 * Grouped by the categories in docs/handoff/IMPERSONATION-PHASE-1.md.
 */
const BLOCK_RULES: readonly BlockRule[] = [
    // Credentials / identity
    { label: 'profile or identity change', matches: (p) => p === '/api/auth/profile' || p === '/api/user/profile' },
    { label: 'session revocation', matches: underPrefix('/api/auth/sessions') },
    // BYOK secrets + model-provider keys
    { label: 'BYOK secret change', matches: underPrefix('/api/secrets') },
    { label: 'BYOK model-provider change', matches: underPrefix('/api/user/providers') },
    // Money / deploy identity (connecting the user's own Cloudflare account)
    { label: 'Cloudflare account connection', matches: underPrefix('/api/cloudflare') },
    // Destructive: app deletion (DELETE /api/apps/:id). Sub-paths like
    // /api/apps/:id/star|favorite|visibility are NOT matched (benign).
    { label: 'app deletion', matches: (p) => /^\/api\/apps\/[^/]+$/.test(p) },
    // Org structure + membership + consent (create/rename/delete/members/invites)
    { label: 'organization or membership change', matches: underPrefix('/api/orgs') },
    { label: 'accepting an organization invite', matches: (p) => /^\/api\/invites\/[^/]+\/accept$/.test(p) },
    // Escalation: any platform-admin mutation, incl. starting a NESTED
    // impersonation. (Also blocked by the superadmin role gate, since the
    // effective user is the target — kept here as explicit defense-in-depth.)
    { label: 'platform-admin action (incl. nested impersonation)', matches: underPrefix('/api/admin') },
];

/**
 * Impersonation-control endpoints that must ALWAYS be reachable while
 * impersonating — so an operator can always EXIT or extend — even for a
 * read-only session and even though they are mutations. Evaluated before any
 * deny logic. (The /api/admin block-list would otherwise trap a stop/extend, and
 * read-only would deny it as a mutation; hence these live OUTSIDE /api/admin.)
 */
const ALWAYS_ALLOWED: ReadonlySet<string> = new Set([
    '/api/impersonation/stop',
    '/api/impersonation/extend',
]);

export interface ImpersonationDenial {
    /** The block category, surfaced to the client + the audit row. */
    reason: string;
}

/**
 * Decide whether an impersonated request must be denied. Returns a denial (with
 * the category) or null to allow. A no-op for non-impersonated requests and for
 * reads (GET/HEAD/OPTIONS — the whole point of "view as").
 */
export function evaluateImpersonationPolicy(
    user: AuthUser,
    method: string,
    path: string,
): ImpersonationDenial | null {
    if (!user.impersonatedBy || !isMutatingMethod(method)) {
        return null;
    }
    if (ALWAYS_ALLOWED.has(path)) {
        return null; // exit / extend are always permitted, so a session can never trap itself
    }
    if (user.impersonationReadOnly) {
        return { reason: 'read-only impersonation session' };
    }
    for (const rule of BLOCK_RULES) {
        if (rule.matches(path)) {
            return { reason: rule.label };
        }
    }
    return null;
}
