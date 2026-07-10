import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/auth-context';
import { useAsyncData, type AsyncState } from './use-admin';
import type { ApiResponse, MyOrgsData, MembersData, InvitesData } from '@/api-types';

/**
 * The caller's organizations + active-org context. Keyed on the EFFECTIVE
 * identity so the org switcher refetches when impersonation starts or ends
 * without a full reload (e.g. the banner's poll-driven auto-exit on grant
 * expiry) — a fetch-once hook here left the OPERATOR's org list on screen
 * while viewing-as a customer.
 */
export function useMyOrgs(): AsyncState<MyOrgsData> {
    const { user } = useAuth();
    return useAsyncData<MyOrgsData>(() => apiClient.getMyOrgs(), [user?.id, user?.impersonatedBy]);
}

/** Members of an org (owner/admin only). No-ops when orgId is undefined. */
export function useOrgMembers(orgId: string | undefined): AsyncState<MembersData> {
    return useAsyncData<MembersData>(
        () =>
            orgId
                ? apiClient.getOrgMembers(orgId)
                : Promise.resolve<ApiResponse<MembersData>>({ success: true, data: { members: [] } }),
        [orgId],
    );
}

/** Pending invitations for an org (owner/admin only). No-ops when orgId is undefined. */
export function useOrgInvites(orgId: string | undefined): AsyncState<InvitesData> {
    return useAsyncData<InvitesData>(
        () =>
            orgId
                ? apiClient.getOrgInvites(orgId)
                : Promise.resolve<ApiResponse<InvitesData>>({ success: true, data: { invitations: [] } }),
        [orgId],
    );
}
