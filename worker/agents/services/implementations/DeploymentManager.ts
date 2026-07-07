import type { BaseSandboxService } from '../../../services/sandbox/BaseSandboxService';
import type { DeploymentManager as IDeploymentManager } from '../../core/AgentCore';
import type { StructuredLogger } from '../../../logger';
import type { KnownResources } from '../../../services/sandbox/sandboxTypes';

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
    /**
     * Resolves the per-session container env (auth secret/url, proxy vars) at
     * deploy time. Callback-style — the manager is a memoised singleton, so a
     * value captured at construction would freeze; a getter stays live. Takes
     * precedence over the static {@link localEnvVars}.
     */
    getLocalEnvVars?: () => Promise<Record<string, string> | undefined>;
    /**
     * Resolves the app's already-provisioned resource ids so a recreation
     * REUSES the same database instead of provisioning a fresh empty one.
     * Callback-style for the same freeze reason as {@link getSessionId}.
     */
    getKnownResources?: () => Promise<KnownResources | undefined>;
    /**
     * Resolves the resources to use for this deploy, EAGERLY provisioning any
     * that must exist before the container env is built — the D1 flagship's
     * proxy token carries the database id, which is otherwise created a build
     * too late (inside {@link BaseSandboxService.createInstance}). A superset of
     * {@link getKnownResources}: it reads the recorded ids and, only when
     * needed, creates + records the missing one. Preferred over
     * getKnownResources when present. Idempotent + best-effort; createInstance's
     * own provisioner REUSES whatever this records (never double-creates).
     */
    ensureResourcesProvisioned?: () => Promise<KnownResources | undefined>;
    /** Persists ids CREATED this deploy, so the next recreation can reuse them. */
    onResourcesProvisioned?: (ids: KnownResources) => Promise<void>;
    /**
     * Resolves the vars + secrets to upload with the DEPLOYED (dispatch) worker
     * — the auth secret and the exact prod origin for the D1 template. Derived
     * DO-side (only the agent has appId + projectName + SECRETS_ENCRYPTION_KEY);
     * callback-style for the memoised-singleton freeze reason.
     */
    getDeployEnv?: () => Promise<{ vars?: Record<string, string>; secrets?: Record<string, string> } | undefined>;
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
            getLocalEnvVars,
            getKnownResources,
            ensureResourcesProvisioned,
            onResourcesProvisioned,
            logger,
        } = this.options;
        const opts = options ?? {};
        let sessionId = getSessionId();

        // Resolved per-deploy (callbacks stay live on the memoised manager):
        // the resource ids to use — provisioned EAGERLY when the container env
        // must embed them (the D1 flagship's proxy token) — then the env to seed.
        // Resolving these before getLocalEnvVars is what lets buildContainerEnv
        // read the just-provisioned id on the first build.
        const knownResources = (await (ensureResourcesProvisioned ?? getKnownResources)?.()) ?? undefined;
        const envVars = (await getLocalEnvVars?.()) ?? localEnvVars;

        // Record ids CREATED this deploy (empty when everything was reused).
        const recordIfNew = async (newlyProvisioned?: KnownResources): Promise<void> => {
            if (newlyProvisioned && (newlyProvisioned.d1DatabaseId || newlyProvisioned.kvNamespaceId)) {
                await onResourcesProvisioned?.(newlyProvisioned);
            }
        };

        if (!sessionId || opts.redeploy) {
            // Cold-start resilience: the first createInstance after a deploy can
            // hit a container that is still booting. Retry once so a just-warmed
            // container succeeds on the second attempt.
            let bootstrap = await sandboxClient.createInstance(
                templateName,
                projectName,
                webhookUrl,
                envVars,
                knownResources,
            );
            if (!bootstrap.success || !bootstrap.runId) {
                logger?.warn(
                    `createInstance failed (cold start?), retrying once: ${bootstrap.error ?? 'unknown error'}`,
                );
                bootstrap = await sandboxClient.createInstance(
                    templateName,
                    projectName,
                    webhookUrl,
                    envVars,
                    knownResources,
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
            await recordIfNew(bootstrap.newlyProvisioned);

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
                envVars,
                knownResources,
            );
            if (fresh.success && fresh.runId) {
                sessionId = fresh.runId;
                onSessionIdChange?.(sessionId);
                await recordIfNew(fresh.newlyProvisioned);
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
            // Do NOT fall through to returning the dead instance — that
            // broadcast DEPLOYMENT_COMPLETED with a corpse previewURL and the
            // UI 404-looped forever. Throw so the behavior can rotate the
            // sandbox session and retry (or surface DEPLOYMENT_FAILED).
            const reason = fresh.error ?? 'unknown error';
            logger?.error(`Self-heal createInstance failed: ${reason}`);
            throw new Error(`SANDBOX_UNREACHABLE: ${reason}`);
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
        const { sandboxClient, getSessionId, getDeployEnv, logger } = this.options;

        const sessionId = getSessionId();
        if (!sessionId) {
            return { error: 'No sandbox instance to deploy from' };
        }

        // Vars + secrets to ship with the deployed worker (auth secret + prod
        // origin for the D1 template; undefined otherwise). `options.token` is
        // the future CF-OAuth user-token surface — threaded so the signature is
        // final, but the sandbox client defaults to the platform env token.
        const deployEnv = await getDeployEnv?.();

        try {
            const result = await sandboxClient.deployToCloudflareWorkers(sessionId, {
                vars: deployEnv?.vars,
                secrets: deployEnv?.secrets,
                token: options?.token,
            });
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
