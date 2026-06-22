import type { BaseSandboxService } from '../../../services/sandbox/BaseSandboxService';
import type { DeploymentManager as IDeploymentManager } from '../../core/AgentCore';
import type { StructuredLogger } from '../../../logger';

/**
 * Construction dependencies for {@link DeploymentManager}.
 *
 * The manager is intentionally stateless about which sandbox instance is
 * "current" — it pulls the id through {@link getSessionId} on every call
 * and reports new ids via {@link onSessionIdChange}. This keeps the
 * owning agent's state authoritative for the active sandbox instance.
 */
export interface DeploymentManagerOptions {
    sandboxClient: BaseSandboxService;
    /** Returns the current sandbox instance id, or undefined if none exists yet. */
    getSessionId: () => string | undefined;
    /** Called when this manager creates a new sandbox instance. */
    onSessionIdChange?: (sessionId: string) => void;
    /** Template name used when bootstrapping a new sandbox. */
    templateName: string;
    /** Project name used when bootstrapping a new sandbox. */
    projectName: string;
    /** Optional webhook URL the sandbox should call back into. */
    webhookUrl?: string;
    /** Optional environment variables to seed the new sandbox with. */
    localEnvVars?: Record<string, string>;
    /** Optional logger; falls back to the sandbox client's own logger via console-style methods if omitted. */
    logger?: StructuredLogger;
}

/**
 * Minimal `DeploymentManager` adapter satisfying the contract in
 * `worker/agents/core/AgentCore.ts`.
 *
 * Deliberately omits in-flight dedupe, 60s deploy timeout + session reset,
 * health-check polling, preview-url caching, and broadcast plumbing — the
 * behavior layer handles broadcasts inline, and the remaining features are
 * added back if a concrete behavior proves it needs them.
 */
export class DeploymentManager implements IDeploymentManager {
    constructor(private readonly options: DeploymentManagerOptions) {}

    async deployToSandbox(options?: {
        files?: Array<{ filePath: string; fileContents: string }>;
        redeploy?: boolean;
        commitMessage?: string;
        clearLogs?: boolean;
    }): Promise<{
        deploymentId?: string;
        previewURL?: string;
        tunnelURL?: string;
    }> {
        const {
            sandboxClient,
            getSessionId,
            onSessionIdChange,
            templateName,
            projectName,
            webhookUrl,
            localEnvVars,
            logger,
        } = this.options;
        const opts = options ?? {};
        let sessionId = getSessionId();

        if (!sessionId || opts.redeploy) {
            // Cold-start resilience: the first createInstance after a deploy can
            // hit a container that is still booting. Retry once so a just-warmed
            // container succeeds on the second attempt.
            let bootstrap = await sandboxClient.createInstance(
                templateName,
                projectName,
                webhookUrl,
                localEnvVars,
            );
            if (!bootstrap.success || !bootstrap.runId) {
                logger?.warn(
                    `createInstance failed (cold start?), retrying once: ${bootstrap.error ?? 'unknown error'}`,
                );
                bootstrap = await sandboxClient.createInstance(
                    templateName,
                    projectName,
                    webhookUrl,
                    localEnvVars,
                );
            }
            if (!bootstrap.success || !bootstrap.runId) {
                // Throw (don't return {}). Returning empty made the behavior
                // broadcast DEPLOYMENT_COMPLETED with an empty previewURL, which
                // the UI loops on forever ("Bootstrapping" never resolves). A
                // throw surfaces DEPLOYMENT_FAILED — a clear, retryable error.
                const reason = bootstrap.error ?? 'unknown error';
                logger?.error(`createInstance failed after retry: ${reason}`);
                throw new Error(`Failed to start the build environment: ${reason}`);
            }
            sessionId = bootstrap.runId;
            onSessionIdChange?.(sessionId);

            if (opts.files && opts.files.length > 0) {
                const write = await sandboxClient.writeFiles(sessionId, opts.files, opts.commitMessage);
                if (!write.success) {
                    logger?.warn(`writeFiles after bootstrap reported failure: ${write.error ?? ''}`);
                }
            }

            return {
                deploymentId: sessionId,
                previewURL: bootstrap.previewURL,
                tunnelURL: bootstrap.tunnelURL,
            };
        }

        if (opts.files && opts.files.length > 0) {
            const write = await sandboxClient.writeFiles(sessionId, opts.files, opts.commitMessage);
            if (!write.success) {
                logger?.warn(`writeFiles failed on existing instance ${sessionId}: ${write.error ?? ''}`);
            }
        }

        // `clearLogs` is not yet wired through `BaseSandboxService`; deferred
        // until a consumer needs it (see commit-2b deferred work).

        const status = await sandboxClient.getInstanceStatus(sessionId);

        // Self-heal a wedged instance. If the existing instance is unhealthy or
        // has no preview URL after the write, the app is not actually serving
        // (a stuck container / dead dev server). Tear it down and bring up a
        // fresh instance, then re-write the files — rather than returning a dead
        // preview that the UI loops on forever (deployment_completed with an
        // empty previewURL + WebSocket reconnect churn).
        if (!status.isHealthy || !status.previewURL) {
            logger?.warn(
                `Instance ${sessionId} is wedged after deploy (healthy=${status.isHealthy}, previewURL=${status.previewURL ? 'set' : 'empty'}); resetting and recreating`,
            );
            try {
                await sandboxClient.shutdownInstance(sessionId);
            } catch (error) {
                logger?.warn(
                    `shutdownInstance failed during self-heal: ${error instanceof Error ? error.message : String(error)}`,
                );
            }

            const fresh = await sandboxClient.createInstance(
                templateName,
                projectName,
                webhookUrl,
                localEnvVars,
            );
            if (fresh.success && fresh.runId) {
                sessionId = fresh.runId;
                onSessionIdChange?.(sessionId);
                if (opts.files && opts.files.length > 0) {
                    const write = await sandboxClient.writeFiles(sessionId, opts.files, opts.commitMessage);
                    if (!write.success) {
                        logger?.warn(`writeFiles after self-heal reported failure: ${write.error ?? ''}`);
                    }
                }
                return {
                    deploymentId: sessionId,
                    previewURL: fresh.previewURL,
                    tunnelURL: fresh.tunnelURL,
                };
            }
            logger?.error(`Self-heal createInstance failed: ${fresh.error ?? 'unknown error'}`);
        }

        return {
            deploymentId: sessionId,
            previewURL: status.previewURL,
            tunnelURL: status.tunnelURL,
        };
    }

    async deployToCloudflare(options?: {
        target?: 'platform' | 'user';
        token?: string;
        metadata?: Record<string, unknown>;
    }): Promise<{ deployedUrl?: string; error?: string }> {
        const { sandboxClient, getSessionId, logger } = this.options;

        // `target`/`token`/`metadata` are upstream surfaces for the
        // user-token deployment path. The fork's sandbox client takes only
        // the instance id and uses Workers env credentials; per-call target
        // selection will land alongside the behavior port that needs it.
        void options;

        const sessionId = getSessionId();
        if (!sessionId) {
            return { error: 'No sandbox instance to deploy from' };
        }

        try {
            const result = await sandboxClient.deployToCloudflareWorkers(sessionId);
            if (!result.success) {
                return { error: result.error ?? result.message ?? 'Cloudflare deploy failed' };
            }
            return { deployedUrl: result.deployedUrl };
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            logger?.error(`deployToCloudflare exception: ${message}`);
            return { error: message };
        }
    }
}
