/**
 * Names of platform templates the worker special-cases. Kept in one place so
 * the gate that delivers auth env / provisions per-app resources references a
 * single source rather than a scattered string literal.
 */

/**
 * The D1 + better-auth flagship (continuity arc). Apps built on it get a real
 * per-app database and email/password auth, so the agent delivers the auth
 * env (BETTER_AUTH_SECRET / BETTER_AUTH_URL) into the sandbox for it.
 */
export const D1_AUTH_TEMPLATE_NAME = 'vite-cf-d1-runner';
