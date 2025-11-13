/**
 * BYOP (Bring Your Own Project) Controller
 * Handles GitHub repository imports and analysis
 */

import { BaseController } from '../baseController';
import { RouteContext } from '../../types/route-context';
import { createLogger } from '../../../logger';
import { GitHubTokenService } from '../../../database/services/GitHubTokenService';
import { Octokit } from '@octokit/rest';
import { SandboxSdkClient } from '../../../services/sandbox/sandboxSdkClient';

const logger = createLogger('BYOPController');

export class BYOPController extends BaseController {
    /**
     * List user's GitHub repositories
     * GET /api/byop/repositories
     */
    static async listRepositories(
        _request: Request,
        env: Env,
        _ctx: ExecutionContext,
        routeContext: RouteContext
    ): Promise<Response> {
        try {
            const user = routeContext.user;
            if (!user) {
                return this.createErrorResponse('Unauthorized', 401);
            }

            // Get user's GitHub token
            const tokenService = new GitHubTokenService(env);
            const tokenData = await tokenService.getActiveToken(user.id);

            if (!tokenData) {
                return this.createErrorResponse(
                    'No GitHub account connected. Please authenticate with GitHub first.',
                    403
                );
            }

            // Check if token has repo scope
            if (!tokenData.scopes.includes('repo') && !tokenData.scopes.includes('public_repo')) {
                return this.createErrorResponse(
                    'GitHub token does not have repository access. Please re-authenticate.',
                    403
                );
            }

            // Fetch repositories from GitHub
            const octokit = new Octokit({
                auth: tokenData.token
            });

            const { data: repos } = await octokit.repos.listForAuthenticatedUser({
                sort: 'updated',
                per_page: 100,
                affiliation: 'owner'
            });

            const repositories = repos.map(repo => ({
                id: repo.id,
                name: repo.name,
                fullName: repo.full_name,
                url: repo.html_url,
                cloneUrl: repo.clone_url,
                description: repo.description,
                language: repo.language,
                stargazersCount: repo.stargazers_count,
                forksCount: repo.forks_count,
                isPrivate: repo.private,
                defaultBranch: repo.default_branch,
                updatedAt: repo.updated_at,
                createdAt: repo.created_at
            }));

            return this.createSuccessResponse({
                repositories,
                total: repositories.length
            });

        } catch (error) {
            logger.error('Failed to list repositories', error);
            return this.handleError(error, 'list repositories');
        }
    }

    /**
     * Initiate repository import and analysis
     * POST /api/byop/import
     */
    static async initiateImport(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        routeContext: RouteContext
    ): Promise<Response> {
        try {
            const user = routeContext.user;
            if (!user) {
                return this.createErrorResponse('Unauthorized', 401);
            }

            const bodyResult = await this.parseJsonBody<{
                repositoryUrl: string;
                branch?: string;
            }>(request);

            if (!bodyResult.success) {
                return bodyResult.response!;
            }

            const { repositoryUrl, branch } = bodyResult.data!;

            // Validate repository URL
            if (!repositoryUrl || !repositoryUrl.startsWith('https://github.com/')) {
                return this.createErrorResponse('Invalid repository URL', 400);
            }

            // Get user's GitHub token
            const tokenService = new GitHubTokenService(env);
            const tokenData = await tokenService.getActiveToken(user.id);

            if (!tokenData) {
                return this.createErrorResponse('No GitHub account connected', 403);
            }

            logger.info('Starting repository import', {
                userId: user.id,
                repositoryUrl,
                branch: branch || 'default'
            });

            // Step 1: Get sandbox instance
            const sandboxInstanceId = await this.getOrCreateSandboxInstance(user.id);
            const sandboxClient = new SandboxSdkClient(sandboxInstanceId, `byop-${user.id}`);

            // Step 2: Clone repository into sandbox
            const cloneResult = await sandboxClient.cloneGitHubRepository({
                repositoryUrl,
                accessToken: tokenData.token,
                targetPath: '/app/imported-repo',
                branch
            });

            if (!cloneResult.success) {
                return this.createErrorResponse(
                    `Failed to clone repository: ${cloneResult.error}`,
                    500
                );
            }

            // Step 3: Read file contents (limit to important files)
            const fileContents = await this.readRepositoryFiles(sandboxClient, cloneResult.clonePath);

            // Step 4: Read package.json if it exists
            const packageJsonPath = `${cloneResult.clonePath}/package.json`;
            const packageJsonContent = await sandboxClient.readFileAsString(packageJsonPath);
            const packageJson = packageJsonContent ? JSON.parse(packageJsonContent) : undefined;

            // Step 5: Start analysis using CodebaseAnalyzer Durable Object
            const analyzerId = env.CodebaseAnalyzerObject.idFromName(`${user.id}-${Date.now()}`);
            const analyzerStub = env.CodebaseAnalyzerObject.get(analyzerId);

            const startResult = await analyzerStub.fetch('http://analyzer/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repositoryUrl,
                    repositoryName: cloneResult.repositoryName || 'unknown',
                    clonePath: cloneResult.clonePath,
                    fileContents,
                    packageJson
                })
            });

            const analysisResponse = await startResult.json() as {
                success: boolean;
                analysisId: string;
                error?: string;
            };

            if (!analysisResponse.success) {
                return this.createErrorResponse(
                    `Failed to start analysis: ${analysisResponse.error}`,
                    500
                );
            }

            logger.info('Repository import initiated', {
                userId: user.id,
                analysisId: analysisResponse.analysisId,
                filesCount: cloneResult.filesCount
            });

            return this.createSuccessResponse({
                success: true,
                analysisId: analysisResponse.analysisId,
                repositoryName: cloneResult.repositoryName,
                filesCount: cloneResult.filesCount,
                message: 'Repository import started. Analysis in progress.'
            });

        } catch (error) {
            logger.error('Failed to initiate import', error);
            return this.handleError(error, 'initiate import');
        }
    }

    /**
     * Get analysis status
     * GET /api/byop/analysis/:analysisId/status
     */
    static async getAnalysisStatus(
        _request: Request,
        env: Env,
        _ctx: ExecutionContext,
        routeContext: RouteContext
    ): Promise<Response> {
        try {
            const user = routeContext.user;
            if (!user) {
                return this.createErrorResponse('Unauthorized', 401);
            }

            const analysisId = routeContext.pathParams.analysisId;
            if (!analysisId) {
                return this.createErrorResponse('Missing analysisId', 400);
            }

            // Get analyzer Durable Object
            const analyzerId = env.CodebaseAnalyzerObject.idFromString(analysisId);
            const analyzerStub = env.CodebaseAnalyzerObject.get(analyzerId);

            const stateResult = await analyzerStub.fetch('http://analyzer/state');
            const state = await stateResult.json();

            return this.createSuccessResponse(state);

        } catch (error) {
            logger.error('Failed to get analysis status', error);
            return this.handleError(error, 'get analysis status');
        }
    }

    /**
     * Get completed blueprint
     * GET /api/byop/analysis/:analysisId/blueprint
     */
    static async getBlueprint(
        _request: Request,
        env: Env,
        _ctx: ExecutionContext,
        routeContext: RouteContext
    ): Promise<Response> {
        try {
            const user = routeContext.user;
            if (!user) {
                return this.createErrorResponse('Unauthorized', 401);
            }

            const analysisId = routeContext.pathParams.analysisId;
            if (!analysisId) {
                return this.createErrorResponse('Missing analysisId', 400);
            }

            // Get analyzer Durable Object
            const analyzerId = env.CodebaseAnalyzerObject.idFromString(analysisId);
            const analyzerStub = env.CodebaseAnalyzerObject.get(analyzerId);

            const stateResult = await analyzerStub.fetch('http://analyzer/state');
            const state = await stateResult.json() as {
                status: string;
                analysisResult?: {
                    blueprint?: unknown;
                };
                error?: string;
            };

            if (state.status !== 'completed') {
                return this.createErrorResponse(
                    state.status === 'failed'
                        ? `Analysis failed: ${state.error}`
                        : 'Analysis not yet completed',
                    state.status === 'failed' ? 500 : 202
                );
            }

            if (!state.analysisResult?.blueprint) {
                return this.createErrorResponse('Blueprint not available', 404);
            }

            return this.createSuccessResponse({
                blueprint: state.analysisResult.blueprint
            });

        } catch (error) {
            logger.error('Failed to get blueprint', error);
            return this.handleError(error, 'get blueprint');
        }
    }

    /**
     * Get or create sandbox instance for user
     */
    private static async getOrCreateSandboxInstance(userId: string): Promise<string> {
        // For now, create a new instance
        // In production, you'd want to reuse existing instances
        const instanceId = `byop-${userId}-${Date.now()}`;
        return instanceId;
    }

    /**
     * Read important files from repository
     */
    private static async readRepositoryFiles(
        sandboxClient: SandboxSdkClient,
        repositoryPath: string
    ): Promise<Record<string, string>> {
        const fileContents: Record<string, string> = {};

        // Define patterns for important files to analyze
        const importantPatterns = [
            '*.ts',
            '*.tsx',
            '*.js',
            '*.jsx',
            '*.json',
            '*.md',
            '*.yml',
            '*.yaml'
        ];

        logger.info('Reading repository files', { repositoryPath });

        // List files matching patterns
        const filePaths = await sandboxClient.listRepositoryFiles({
            repositoryPath,
            patterns: importantPatterns,
            maxFiles: 500 // Limit to 500 files to avoid overwhelming the analysis
        });

        logger.info('Found files to analyze', { count: filePaths.length });

        // Read file contents in parallel (with concurrency limit)
        const BATCH_SIZE = 10;
        for (let i = 0; i < filePaths.length; i += BATCH_SIZE) {
            const batch = filePaths.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.all(
                batch.map(async (filePath) => {
                    const content = await sandboxClient.readFileAsString(filePath);
                    return { filePath, content };
                })
            );

            // Store results
            for (const result of batchResults) {
                if (result.content !== null) {
                    // Store with relative path (remove repositoryPath prefix)
                    const relativePath = result.filePath.replace(`${repositoryPath}/`, '');
                    fileContents[relativePath] = result.content;
                }
            }
        }

        logger.info('Read repository files', {
            repositoryPath,
            filesRead: Object.keys(fileContents).length
        });

        return fileContents;
    }
}
