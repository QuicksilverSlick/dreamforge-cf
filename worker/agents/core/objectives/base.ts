import type { BaseProjectState } from '../state';
import type {
    ProjectType,
    ExportResult,
    ExportOptions,
    DeployResult,
    DeployOptions,
} from '../types';
import { AgentComponent } from '../AgentComponent';
import { WebSocketMessageResponses } from '../../constants';
import { AppService } from '../../../database/services/AppService';
import { GitHubService } from '../../../services/github';
import {
    getAdditionalExportStrategy,
    type AdditionalExportStrategy,
    type ExportContext,
} from './strategies';

/**
 * Project-level objective coordinator. Owns the deploy/export lifecycle
 * for a single project type and delegates the sandbox + Cloudflare push
 * to the injected {@link AgentInfrastructure}.
 *
 * Adapted from upstream `cloudflare/vibesdk` `worker/agents/objectives/
 * base.ts` (commit-2b M3 port). Three deltas vs upstream:
 *
 *   1. `deploymentManager.deployToCloudflare(...)` does not accept a
 *      `callbacks` bag in this fork (see `AgentCore.ts:58-62`). The
 *      `onStarted` / `onCompleted` / `onError` broadcasts happen inline
 *      around the call here instead.
 *   2. `deploymentManager.deployToCloudflare(...)` returns
 *      `{deployedUrl?, error?}`; upstream's `deploymentUrl`,
 *      `deploymentId`, and `workersUrl` fields collapse into the single
 *      `deployedUrl`. `AppService.updateDeploymentId` runs against
 *      `deployedUrl` when present.
 *   3. The fork's `GitHubService` does not expose `exportToGitHub`;
 *      `exportToGitHub` here delegates to
 *      `GitHubService.pushFilesToRepository(...)` with files pulled from
 *      `fileManager.getAllFiles()` instead of going through the
 *      git-objects bundle. The fork's REST push doesn't need the
 *      template / query metadata upstream passes through; those values
 *      are still surfaced via the AppService update.
 */
export class ProjectObjective<
    TState extends BaseProjectState = BaseProjectState,
> extends AgentComponent<TState> {
    private projectType: ProjectType;
    private additionalExportStrategy: AdditionalExportStrategy | null;

    protected githubTokenCache: {
        token: string;
        username: string;
        expiresAt: number;
    } | null = null;

    constructor(
        infrastructure: ConstructorParameters<typeof AgentComponent<TState>>[0],
        projectType: ProjectType,
    ) {
        super(infrastructure);
        this.projectType = projectType;
        this.additionalExportStrategy = getAdditionalExportStrategy(projectType);
    }

    getType(): ProjectType {
        return this.projectType;
    }

    async deploy(options?: DeployOptions): Promise<DeployResult> {
        const target = options?.target ?? 'platform';
        if (target !== 'platform') {
            return {
                success: false,
                target,
                error: `Unsupported deployment target "${target}"`,
            };
        }

        try {
            this.logger.info('Deploying to Workers for Platforms', {
                projectType: this.projectType,
            });

            if (!this.state.sandboxInstanceId) {
                this.logger.info('No sandbox instance, deploying to sandbox first');
                await this.deploymentManager.deployToSandbox();

                if (!this.state.sandboxInstanceId) {
                    this.broadcast(WebSocketMessageResponses.CLOUDFLARE_DEPLOYMENT_ERROR, {
                        message: 'Deployment failed: Sandbox service unavailable',
                        instanceId: '',
                        error: 'Sandbox service unavailable',
                    });
                    return {
                        success: false,
                        target,
                        error: 'Failed to deploy to sandbox service',
                    };
                }
            }

            const instanceId = this.state.sandboxInstanceId;

            this.broadcast(WebSocketMessageResponses.CLOUDFLARE_DEPLOYMENT_STARTED, {
                message: 'Cloudflare deployment started',
                instanceId,
            });

            const result = await this.deploymentManager.deployToCloudflare({
                target,
                token: options?.token,
                metadata: options?.metadata,
            });

            if (result.error || !result.deployedUrl) {
                const errorMessage = result.error ?? 'Cloudflare deploy returned no URL';
                this.broadcast(WebSocketMessageResponses.CLOUDFLARE_DEPLOYMENT_ERROR, {
                    message: 'Cloudflare deployment failed',
                    instanceId,
                    error: errorMessage,
                });
                return { success: false, target, error: errorMessage };
            }

            this.broadcast(WebSocketMessageResponses.CLOUDFLARE_DEPLOYMENT_COMPLETED, {
                message: 'Cloudflare deployment completed',
                instanceId,
                deploymentUrl: result.deployedUrl,
            });

            const appService = new AppService(this.env);
            try {
                await appService.updateDeploymentId(this.getAgentId(), result.deployedUrl);
                this.logger.info('Updated deployment URL in database', {
                    deploymentUrl: result.deployedUrl,
                });
            } catch (dbErr) {
                this.logger.warn('Failed to persist deployment URL', dbErr);
            }

            return {
                success: true,
                target,
                url: result.deployedUrl,
                metadata: {
                    deploymentUrl: result.deployedUrl,
                },
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown deployment error';
            this.logger.error('Deployment failed', error);
            this.broadcast(WebSocketMessageResponses.CLOUDFLARE_DEPLOYMENT_ERROR, {
                message: 'Deployment failed',
                instanceId: this.state.sandboxInstanceId ?? '',
                error: message,
            });
            return { success: false, target, error: message };
        }
    }

    async export(options: ExportOptions): Promise<ExportResult> {
        if (options.kind === 'github') {
            return this.exportToGitHub(options);
        }

        if (this.additionalExportStrategy?.getSupportedKinds().includes(options.kind)) {
            return this.additionalExportStrategy.export(options, this.createExportContext());
        }

        return {
            success: false,
            error: `Export kind '${options.kind}' not supported for ${this.projectType}`,
        };
    }

    private async exportToGitHub(options: ExportOptions): Promise<ExportResult> {
        if (!options.github) {
            return { success: false, error: 'GitHub export requires github options' };
        }

        const githubOptions = options.github;

        try {
            this.logger.info('Starting GitHub export');

            this.broadcast(WebSocketMessageResponses.GITHUB_EXPORT_STARTED, {
                message: `Starting GitHub export to repository "${githubOptions.repositoryHtmlUrl}"`,
                repositoryName: githubOptions.repositoryHtmlUrl,
                isPrivate: githubOptions.isPrivate,
            });

            this.broadcast(WebSocketMessageResponses.GITHUB_EXPORT_PROGRESS, {
                message: 'Preparing files for upload...',
                step: 'creating_repository',
                progress: 20,
            });

            const files = this.fileManager.getAllFiles();

            this.logger.info('Collected files for GitHub export', {
                fileCount: files.length,
            });

            this.broadcast(WebSocketMessageResponses.GITHUB_EXPORT_PROGRESS, {
                message: 'Uploading to GitHub repository...',
                step: 'uploading_files',
                progress: 50,
            });

            const result = await GitHubService.pushFilesToRepository(files, githubOptions);

            if (!result.success) {
                throw new Error(result.error || 'Failed to push to GitHub');
            }

            if (githubOptions.token && githubOptions.username) {
                this.setGitHubToken(githubOptions.token, githubOptions.username);
            }

            this.broadcast(WebSocketMessageResponses.GITHUB_EXPORT_PROGRESS, {
                message: 'Finalizing GitHub export...',
                step: 'finalizing',
                progress: 90,
            });

            const agentId = this.getAgentId();
            const appService = new AppService(this.env);
            try {
                await appService.updateGitHubRepository(
                    agentId || '',
                    githubOptions.repositoryHtmlUrl || '',
                    githubOptions.isPrivate ? 'private' : 'public',
                );
            } catch (dbErr) {
                this.logger.warn('Failed to persist GitHub repository link', dbErr);
            }

            this.broadcast(WebSocketMessageResponses.GITHUB_EXPORT_COMPLETED, {
                message: `Successfully exported to GitHub repository: ${githubOptions.repositoryHtmlUrl}`,
                repositoryUrl: githubOptions.repositoryHtmlUrl,
            });

            this.logger.info('GitHub export completed', {
                repositoryUrl: githubOptions.repositoryHtmlUrl,
                commitSha: result.commitSha,
            });

            return {
                success: true,
                url: githubOptions.repositoryHtmlUrl,
                metadata: {
                    repositoryUrl: githubOptions.repositoryHtmlUrl,
                    cloneUrl: githubOptions.cloneUrl,
                    commitSha: result.commitSha,
                },
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error('GitHub export failed', error);
            this.broadcast(WebSocketMessageResponses.GITHUB_EXPORT_ERROR, {
                message: `GitHub export failed: ${message}`,
                error: message,
            });
            return {
                success: false,
                url: options.github?.repositoryHtmlUrl,
                error: message,
            };
        }
    }

    private createExportContext(): ExportContext {
        return {
            env: this.env,
            logger: this.logger,
            agentId: this.getAgentId(),
            state: this.state,
            broadcast: this.broadcast.bind(this),
        };
    }

    setGitHubToken(token: string, username: string, ttl: number = 3600000): void {
        this.githubTokenCache = {
            token,
            username,
            expiresAt: Date.now() + ttl,
        };
    }

    getGitHubToken(): { token: string; username: string } | null {
        if (!this.githubTokenCache) return null;
        if (Date.now() >= this.githubTokenCache.expiresAt) {
            this.githubTokenCache = null;
            return null;
        }
        return {
            token: this.githubTokenCache.token,
            username: this.githubTokenCache.username,
        };
    }

    clearGitHubToken(): void {
        this.githubTokenCache = null;
    }
}
