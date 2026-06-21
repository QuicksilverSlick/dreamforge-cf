/**
 * Pure org-management types (no runtime imports).
 *
 * These live apart from OrganizationService so the frontend (and the controller
 * response types) can import them WITHOUT pulling the service's runtime
 * dependencies (BaseService → database.ts, cryptoUtils) into the browser
 * tsconfig, which lacks the Workers runtime globals.
 */

import type { Organization, OrgInvitation, OrgRole } from '../schema';
import type { UserRole } from '../../types/auth-types';

export interface EnsurePersonalOrgInput {
    displayName?: string | null;
    email?: string | null;
}

/** Actor identity + request metadata threaded into the audit row of a mutation. */
export interface OrgMutationContext {
    actorUserId: string;
    /** Actor's PLATFORM role, snapshotted into the audit row (usually 'user'). */
    actorRole?: UserRole;
    metadata?: { ipAddress?: string; userAgent?: string };
}

/** The active org resolved for a request (backs AuthUser.orgId/orgRole). */
export interface ActiveOrg {
    orgId?: string;
    orgRole?: OrgRole;
}

/** A member row joined with the user's display fields (no sensitive columns). */
export interface OrgMemberView {
    membershipId: string;
    userId: string;
    role: OrgRole;
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
    joinedAt: Date | null;
}

/** A pending invitation as surfaced to org admins (never includes the token). */
export interface OrgInvitationView {
    id: string;
    inviteeEmail: string;
    role: OrgRole;
    status: OrgInvitation['status'];
    expiresAt: Date;
    createdAt: Date | null;
    inviterUserId: string;
}

/** Re-export the org row type for convenience alongside the view types. */
export type { Organization, OrgInvitation, OrgRole };
