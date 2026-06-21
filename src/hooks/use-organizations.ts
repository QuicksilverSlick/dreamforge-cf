import { apiClient } from '@/lib/api-client';
import { useAsyncData, type AsyncState } from './use-admin';
import type { ApiResponse, MyOrgsData, MembersData, InvitesData } from '@/api-types';

/** The caller's organizations + active-org context. */
export function useMyOrgs(): AsyncState<MyOrgsData> {
    return useAsyncData<MyOrgsData>(() => apiClient.getMyOrgs(), []);
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
