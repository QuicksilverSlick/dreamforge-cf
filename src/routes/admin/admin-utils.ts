import { format, isValid } from 'date-fns';
import type { UserRole } from '@/api-types';

/**
 * Roles allowed into the operator console. Mirrors the server gate
 * (AuthConfig.superadminOnly in worker/middleware/auth/routeAuth.ts) — widen
 * here and on the server together.
 */
export const ADMIN_ROLES: readonly UserRole[] = ['superadmin'];

/** True if the role may access the admin console. */
export function isAdminRole(role: UserRole | undefined): boolean {
    return !!role && ADMIN_ROLES.includes(role);
}

/** Format an API date (Date | ISO string | null) for display, or em-dash. */
export function formatDate(value: Date | string | null | undefined, withTime = false): string {
    if (!value) {
        return '—';
    }
    const date = value instanceof Date ? value : new Date(value);
    if (!isValid(date)) {
        return '—';
    }
    return format(date, withTime ? 'PPp' : 'PP');
}
