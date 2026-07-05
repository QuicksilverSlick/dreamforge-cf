import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import type {
    ApiResponse,
    AdminOverviewData,
    AdminUsersListData,
    AdminAppsListData,
    AdminUserDetailData,
    AdminUserAppsData,
    AdminUserSessionsData,
    AdminUserSecretsData,
    AdminAuditListData,
    AdminUserStatusFilter,
    AdminAppStatusFilter,
    AdminAppVisibilityFilter,
    AdminProduceApplicationsListData,
    ProduceApplicationStatus,
    UserRole,
} from '@/api-types';

export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

function messageOf(err: unknown): string {
    return err instanceof Error ? err.message : 'Request failed';
}

/**
 * Run a fetcher and expose {data,loading,error,refetch}, re-running whenever
 * `deps` change. A monotonic sequence guard ensures only the latest in-flight
 * request applies its result — so a slow earlier request (e.g. a stale offset
 * after a filter change, or an overtaken debounce) can never overwrite newer
 * data. `deps` are intentionally the dependency array (exhaustive-deps off).
 */
export function useAsyncData<T>(fetcher: () => Promise<ApiResponse<T>>, deps: React.DependencyList): AsyncState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const seqRef = useRef(0);

    const refetch = useCallback(async () => {
        const seq = ++seqRef.current;
        setLoading(true);
        try {
            const res = await fetcher();
            if (seq !== seqRef.current) return; // superseded by a newer request
            setData(res.data ?? null);
            setError(null);
        } catch (err) {
            if (seq !== seqRef.current) return;
            setError(messageOf(err));
        } finally {
            if (seq === seqRef.current) setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    return { data, loading, error, refetch };
}

export function useAdminOverview(): AsyncState<AdminOverviewData> {
    return useAsyncData<AdminOverviewData>(() => apiClient.getAdminOverview(), []);
}

export interface AdminUsersQuery {
    q?: string;
    role?: UserRole;
    status?: AdminUserStatusFilter;
    limit?: number;
    offset?: number;
}

export function useAdminUsers(query: AdminUsersQuery): AsyncState<AdminUsersListData> {
    const { q, role, status, limit, offset } = query;
    return useAsyncData<AdminUsersListData>(
        () => apiClient.getAdminUsers({ q, role, status, limit, offset }),
        [q, role, status, limit, offset],
    );
}

export function useAdminUser(userId: string): AsyncState<AdminUserDetailData> {
    return useAsyncData<AdminUserDetailData>(() => apiClient.getAdminUser(userId), [userId]);
}

export interface AdminAppsQuery {
    q?: string;
    status?: AdminAppStatusFilter;
    visibility?: AdminAppVisibilityFilter;
    plan?: string;
    limit?: number;
    offset?: number;
}

export function useAdminApps(query: AdminAppsQuery): AsyncState<AdminAppsListData> {
    const { q, status, visibility, plan, limit, offset } = query;
    return useAsyncData<AdminAppsListData>(
        () => apiClient.getAdminApps({ q, status, visibility, plan, limit, offset }),
        [q, status, visibility, plan, limit, offset],
    );
}

export function useAdminUserApps(userId: string): AsyncState<AdminUserAppsData> {
    return useAsyncData<AdminUserAppsData>(() => apiClient.getAdminUserApps(userId, { limit: 50 }), [userId]);
}

export interface AdminProduceApplicationsQuery {
    q?: string;
    status?: ProduceApplicationStatus;
    limit?: number;
    offset?: number;
}

export function useAdminProduceApplications(
    query: AdminProduceApplicationsQuery,
): AsyncState<AdminProduceApplicationsListData> {
    const { q, status, limit, offset } = query;
    return useAsyncData<AdminProduceApplicationsListData>(
        () => apiClient.getAdminProduceApplications({ q, status, limit, offset }),
        [q, status, limit, offset],
    );
}

export function useAdminUserSessions(userId: string): AsyncState<AdminUserSessionsData> {
    return useAsyncData<AdminUserSessionsData>(() => apiClient.getAdminUserSessions(userId), [userId]);
}

export function useAdminUserSecrets(userId: string): AsyncState<AdminUserSecretsData> {
    return useAsyncData<AdminUserSecretsData>(() => apiClient.getAdminUserSecrets(userId), [userId]);
}

export interface AdminAuditQuery {
    userId?: string;
    entityType?: string;
    action?: string;
    limit?: number;
    offset?: number;
}

export function useAdminAuditLogs(query: AdminAuditQuery): AsyncState<AdminAuditListData> {
    const { userId, entityType, action, limit, offset } = query;
    return useAsyncData<AdminAuditListData>(
        () => apiClient.getAdminAuditLogs({ userId, entityType, action, limit, offset }),
        [userId, entityType, action, limit, offset],
    );
}
