/**
 * Impersonation controller response shapes. A leaf type module (no runtime or
 * worker-ambient imports) so the React SPA can re-export it through api-types.ts
 * without pulling the worker module graph into the frontend tsconfig.
 */

/** A grant as the SPA needs it — drives the banner + the extend countdown. */
export interface ImpersonationGrantData {
    targetUserId: string;
    readOnly: boolean;
    expiresAt: string;
    absoluteExpiresAt: string;
    extendCount: number;
}

/** Current impersonation state for the SPA (null-ish when not impersonating). */
export interface ImpersonationStatusData {
    impersonating: boolean;
    target?: { id: string; displayName?: string; email: string };
    reason?: string;
    readOnly?: boolean;
    expiresAt?: string;
    absoluteExpiresAt?: string;
    extendCount?: number;
}
