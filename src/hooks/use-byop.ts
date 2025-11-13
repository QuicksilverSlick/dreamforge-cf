/**
 * BYOP (Bring Your Own Project) Hooks
 * React hooks for GitHub repository import and analysis
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
    GitHubRepository,
    ImportRepositoryRequest,
    ImportRepositoryResponse,
    AnalysisStateResponse,
    BlueprintResponse,
} from '@/api-types-byop';

const API_BASE = '/api/byop';

/**
 * Fetch user's GitHub repositories
 */
export function useGitHubRepositories() {
    const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRepositories = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/repositories`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to fetch repositories' }));
                throw new Error(errorData.error || 'Failed to fetch repositories');
            }

            const data = await response.json();
            setRepositories(data.data.repositories);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRepositories();
    }, [fetchRepositories]);

    return {
        repositories,
        loading,
        error,
        refetch: fetchRepositories,
    };
}

/**
 * Import a GitHub repository for analysis
 */
export function useImportRepository() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const importRepository = useCallback(async (request: ImportRepositoryRequest): Promise<ImportRepositoryResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to import repository' }));
                throw new Error(errorData.error || 'Failed to import repository');
            }

            const data = await response.json();
            return data.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        importRepository,
        loading,
        error,
    };
}

/**
 * Poll analysis status until completion
 */
export function useAnalysisStatus(analysisId: string | null) {
    const [status, setStatus] = useState<AnalysisStateResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchStatus = useCallback(async (id: string) => {
        try {
            const response = await fetch(`${API_BASE}/analysis/${id}/status`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to fetch status' }));
                throw new Error(errorData.error || 'Failed to fetch status');
            }

            const data = await response.json();
            setStatus(data.data);
            setError(null);

            // Stop polling if completed or failed
            if (data.data.status === 'completed' || data.data.status === 'failed') {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, []);

    const startPolling = useCallback((id: string) => {
        setLoading(true);
        setError(null);

        // Fetch immediately
        fetchStatus(id);

        // Then poll every 5 seconds
        intervalRef.current = setInterval(() => {
            fetchStatus(id);
        }, 5000);
    }, [fetchStatus]);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (analysisId) {
            startPolling(analysisId);
        }

        return () => {
            stopPolling();
        };
    }, [analysisId, startPolling, stopPolling]);

    return {
        status,
        loading,
        error,
        refetch: () => analysisId && fetchStatus(analysisId),
        stopPolling,
    };
}

/**
 * Fetch completed blueprint
 */
export function useBlueprint(analysisId: string | null) {
    const [blueprint, setBlueprint] = useState<BlueprintResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBlueprint = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/analysis/${id}/blueprint`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to fetch blueprint' }));
                throw new Error(errorData.error || 'Failed to fetch blueprint');
            }

            const data = await response.json();
            setBlueprint(data.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (analysisId) {
            fetchBlueprint(analysisId);
        }
    }, [analysisId, fetchBlueprint]);

    return {
        blueprint,
        loading,
        error,
        refetch: () => analysisId && fetchBlueprint(analysisId),
    };
}
