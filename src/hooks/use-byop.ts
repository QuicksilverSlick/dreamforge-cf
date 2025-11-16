/**
 * BYOP (Bring Your Own Project) Hooks
 * React hooks for GitHub repository import and analysis
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { apiClient, ApiError } from '@/lib/api-client';
import type {
    GitHubRepository,
    ImportRepositoryRequest,
    ImportRepositoryResponse,
    AnalysisStateResponse,
    BlueprintResponse,
} from '@/api-types-byop';

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
            const response = await apiClient.listGitHubRepositories();
            setRepositories(response.data?.repositories ?? []);
        } catch (err) {
            const errorMessage = err instanceof ApiError
                ? err.message
                : err instanceof Error
                    ? err.message
                    : 'Unknown error';
            setError(errorMessage);
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
 * Import a GitHub repository for analysis with automatic retry logic
 */
export function useImportRepository() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const MAX_RETRIES = 3;
    const INITIAL_RETRY_DELAY = 1000; // 1 second

    const attemptImport = useCallback(async (
        request: ImportRepositoryRequest,
        attempt: number
    ): Promise<ImportRepositoryResponse> => {
        try {
            const response = await apiClient.importRepository(request);
            setRetryCount(0);

            if (!response.data) {
                throw new Error('No data in response');
            }

            return response.data;
        } catch (err) {
            const isApiError = err instanceof ApiError;
            const shouldRetry = isApiError
                ? err.status >= 500 || err.status === 0
                : err instanceof TypeError || (err instanceof Error && err.message.includes('fetch'));

            // Retry on network errors or 5xx server errors
            if (shouldRetry && attempt < MAX_RETRIES) {
                const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
                console.log(`Import failed${isApiError ? ` with ${(err as ApiError).status}` : ''}, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
                setRetryCount(attempt + 1);

                await new Promise(resolve => setTimeout(resolve, delay));
                return attemptImport(request, attempt + 1);
            }

            throw err;
        }
    }, []);

    const importRepository = useCallback(async (request: ImportRepositoryRequest): Promise<ImportRepositoryResponse | undefined> => {
        setLoading(true);
        setError(null);
        setRetryCount(0);

        try {
            const result = await attemptImport(request, 0);
            return result;
        } catch (err) {
            const errorMessage = err instanceof ApiError
                ? err.message
                : err instanceof Error
                    ? err.message
                    : 'Unknown error';
            setError(errorMessage);
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [attemptImport]);

    return {
        importRepository,
        loading,
        error,
        retryCount,
    };
}

/**
 * Monitor analysis status with WebSocket real-time updates (with polling fallback)
 */
export function useAnalysisStatus(analysisId: string | null) {
    const [status, setStatus] = useState<AnalysisStateResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttempts = useRef(0);
    const MAX_RECONNECT_ATTEMPTS = 3;

    const fetchStatus = useCallback(async (id: string) => {
        try {
            const response = await apiClient.getAnalysisStatus(id);
            const statusData = response.data ?? null;
            setStatus(statusData);
            setError(null);

            // Stop polling if completed or failed
            if (statusData && (statusData.status === 'completed' || statusData.status === 'failed')) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        } catch (err) {
            const errorMessage = err instanceof ApiError
                ? err.message
                : err instanceof Error
                    ? err.message
                    : 'Unknown error';
            setError(errorMessage);
        }
    }, []);

    const startPolling = useCallback((id: string) => {
        // Clear any existing polling
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

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
    }, []);

    const connectWebSocket = useCallback((id: string) => {
        // Clean up existing WebSocket
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        try {
            // Construct WebSocket URL
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/api/byop/analysis/${id}/ws`;

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.addEventListener('open', () => {
                console.log('WebSocket connected for analysis:', id);
                reconnectAttempts.current = 0;
                setLoading(false);
                setError(null);
                // Stop polling since WebSocket is connected
                stopPolling();
            });

            let isCompleted = false;

            ws.addEventListener('message', (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'progress' && message.data) {
                        setStatus(message.data);
                        setError(null);

                        // Close WebSocket if analysis completed or failed
                        if (message.data.status === 'completed' || message.data.status === 'failed') {
                            isCompleted = true;
                            ws.close();
                        }
                    }
                } catch (err) {
                    console.error('Failed to parse WebSocket message:', err);
                }
            });

            ws.addEventListener('close', (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                wsRef.current = null;

                // Only attempt reconnect if not completed and haven't exceeded max attempts
                if (!isCompleted && status?.status !== 'completed' && status?.status !== 'failed') {
                    if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                        reconnectAttempts.current++;
                        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
                        console.log(`Reconnecting WebSocket in ${delay}ms (attempt ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`);

                        reconnectTimeoutRef.current = setTimeout(() => {
                            connectWebSocket(id);
                        }, delay);
                    } else {
                        console.log('Max reconnection attempts reached, falling back to polling');
                        startPolling(id);
                    }
                }
            });

            ws.addEventListener('error', (event) => {
                console.error('WebSocket error:', event);
                // Fall back to polling on error
                startPolling(id);
            });

        } catch (err) {
            console.error('Failed to create WebSocket:', err);
            // Fall back to polling if WebSocket creation fails
            startPolling(id);
        }
    }, [status?.status, startPolling, stopPolling]);

    useEffect(() => {
        if (!analysisId) {
            return;
        }

        setLoading(true);
        setError(null);

        // Try WebSocket first
        connectWebSocket(analysisId);

        // Cleanup on unmount or analysisId change
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            stopPolling();
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };
    }, [analysisId, connectWebSocket, stopPolling]);

    return {
        status,
        loading,
        error,
        refetch: () => analysisId && fetchStatus(analysisId),
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
            const response = await apiClient.getBlueprint(id);
            setBlueprint(response.data ?? null);
        } catch (err) {
            const errorMessage = err instanceof ApiError
                ? err.message
                : err instanceof Error
                    ? err.message
                    : 'Unknown error';
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
