/**
 * Response payload shapes for the organization-management API.
 */

import type { Organization, OrgRole } from '../../../database/schema';
import type { OrgMemberView, OrgInvitationView } from '../../../database/services/organizationTypes';

export interface MyOrgsData {
    organizations: Array<{ org: Organization; role: OrgRole }>;
    activeOrgId?: string;
    activeOrgRole?: OrgRole;
}

export interface OrgData {
    organization: Organization;
}

export interface MembersData {
    members: OrgMemberView[];
}

export interface InvitesData {
    invitations: OrgInvitationView[];
}

export interface CreateInviteData {
    invitation: OrgInvitationView;
    /** The tokenized accept-link — always returned so the inviter can copy it. */
    acceptUrl: string;
    /** Email-delivery outcome; false means use the copy-link. */
    email: { sent: boolean; messageId?: string };
}

export interface MemberData {
    member: OrgMemberView;
}

export interface RemoveMemberData {
    removedUserId: string;
}

export interface RevokeInviteData {
    invitationId: string;
}

export interface DeleteOrgData {
    deletedOrgId: string;
    /** The personal workspace the org's apps were reassigned to. */
    reassignedToOrgId: string;
}
