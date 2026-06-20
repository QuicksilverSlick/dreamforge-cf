import type { OrgRole } from '@/api-types';

/**
 * Org roles allowed into member-management surfaces. Mirrors the server gate
 * (AuthConfig.orgAdminOnly in worker/middleware/auth/routeAuth.ts) — widen here
 * and on the server together. This is the ORG-role plane (owner/admin/member),
 * entirely separate from the platform-role plane (users.role).
 */
export const ORG_ADMIN_ROLES: readonly OrgRole[] = ['owner', 'admin'];

/** True if the active-org role may manage members/invites. */
export function isOrgAdminRole(role: OrgRole | undefined): boolean {
    return !!role && ORG_ADMIN_ROLES.includes(role);
}

/** Human label for an org role. */
export function formatOrgRole(role: OrgRole): string {
    switch (role) {
        case 'owner':
            return 'Owner';
        case 'admin':
            return 'Admin';
        case 'member':
            return 'Member';
    }
}
