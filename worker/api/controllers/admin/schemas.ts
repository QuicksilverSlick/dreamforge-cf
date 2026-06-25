/**
 * Request validation for the operator admin console.
 */

import { z } from 'zod';
import type { UserRole } from '../../../types/auth-types';
import type {
    AdminUserStatusFilter,
    AdminAppStatusFilter,
    AdminAppVisibilityFilter,
} from '../../../database/services/AdminService';

const USER_ROLES: readonly UserRole[] = [
    'superadmin',
    'admin',
    'user',
    'support',
    'ai_support',
    'ai_admin',
];

const USER_STATUSES: readonly AdminUserStatusFilter[] = ['all', 'active', 'suspended'];
const APP_STATUSES: readonly AdminAppStatusFilter[] = ['all', 'generating', 'completed'];
const APP_VISIBILITIES: readonly AdminAppVisibilityFilter[] = ['all', 'private', 'public'];

/** Suspension requires an operator-supplied justification (audited). */
export const suspendBodySchema = z.object({
    reason: z.string().trim().min(3, 'A reason is required').max(500),
});
export type SuspendBody = z.infer<typeof suspendBodySchema>;

/** Reactivation reason is optional but captured when present. */
export const reactivateBodySchema = z.object({
    reason: z.string().trim().max(500).optional(),
});
export type ReactivateBody = z.infer<typeof reactivateBodySchema>;

export function parseUserRole(value: string | null): UserRole | undefined {
    if (value && (USER_ROLES as readonly string[]).includes(value)) {
        return value as UserRole;
    }
    return undefined;
}

export function parseUserStatus(value: string | null): AdminUserStatusFilter | undefined {
    if (value && (USER_STATUSES as readonly string[]).includes(value)) {
        return value as AdminUserStatusFilter;
    }
    return undefined;
}

export function parseAppStatus(value: string | null): AdminAppStatusFilter | undefined {
    if (value && (APP_STATUSES as readonly string[]).includes(value)) {
        return value as AdminAppStatusFilter;
    }
    return undefined;
}

export function parseAppVisibility(value: string | null): AdminAppVisibilityFilter | undefined {
    if (value && (APP_VISIBILITIES as readonly string[]).includes(value)) {
        return value as AdminAppVisibilityFilter;
    }
    return undefined;
}

/** Parse a positive integer query param, clamped to [min, max]. */
export function parseBoundedInt(
    value: string | null,
    fallback: number,
    min: number,
    max: number,
): number {
    if (!value) {
        return fallback;
    }
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
        return fallback;
    }
    return Math.min(Math.max(parsed, min), max);
}
