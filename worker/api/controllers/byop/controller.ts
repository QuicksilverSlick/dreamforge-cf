/**
 * BYOP (Bring Your Own Project) Controller
 * Handles GitHub repository imports and analysis
 */

import { BaseController } from '../baseController';
import { RouteContext } from '../../types/route-context';
import { createLogger } from '../../../logger';
import { GitHubTokenService } from '../../../database/services/GitHubTokenService';
import { BlueprintCacheService } from '../../../database/services/BlueprintCacheService';
import { Octokit } from '@octokit/rest';
import { SandboxSdkClient } from '../../../services/sandbox/sandboxSdkClient';
import type { GeneratedBlueprint } from '../../../services/blueprint/BlueprintGenerationService';
import type { AnalysisState } from '../../../agents/analyzer/codebaseAnalyzer';
import { getProjectDisplayName } from '../../../utils/readmeParser';
import { CodingAgentController } from '../agent/controller';

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
            logger.info('=== BYOP listRepositories START ===', {
                timestamp: new Date().toISOString(),
                url: _request.url,
                method: _request.method
            });

            const user = routeContext.user;
            logger.info('User from routeContext:', {
                hasUser: !!user,
                userId: user?.id,
                userEmail: user?.email,
                userProvider: user?.provider,
                hasRouteContext: !!routeContext,
                hasSessionId: !!routeContext.sessionId
            });

            if (!user) {
                logger.error('❌ CRITICAL: No user found in routeContext', {
                    routeContext: JSON.stringify(routeContext, null, 2)
                });
                return this.createErrorResponse('Unauthorized', 401);
            }

            // Get user's GitHub token
            logger.info('Creating GitHubTokenService', {
                env: !!env,
                DB: !!env?.DB,
                hasEncryptionKey: !!env?.SECRETS_ENCRYPTION_KEY
            });
            const tokenService = new GitHubTokenService(env);

            logger.info('Fetching active GitHub token for user', {
                userId: user.id,
                userEmail: user.email
            });
            const tokenData = await tokenService.getActiveToken(user.id);

            logger.info('GitHub token retrieval result:', {
                hasToken: !!tokenData,
                tokenLength: tokenData?.token?.length,
                tokenPrefix: tokenData?.token?.substring(0, 4),
                scopes: tokenData?.scopes,
                userId: user.id
            });

            if (!tokenData) {
                logger.error('❌ No GitHub token found for user', {
                    userId: user.id,
                    userEmail: user.email,
                    userProvider: user?.provider,
                    message: 'User authenticated but no GitHub token in database'
                });
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

            // Validate token format and viability
            logger.info('=== VALIDATING GITHUB TOKEN ===', {
                tokenPrefix: tokenData.token.substring(0, 4),
                tokenSuffix: tokenData.token.substring(tokenData.token.length - 4),
                tokenLength: tokenData.token.length,
                tokenFormat: tokenData.token.startsWith('ghp_') ? 'PAT' :
                             tokenData.token.startsWith('gho_') ? 'OAuth' :
                             tokenData.token.startsWith('ghs_') ? 'Installation' : 'Unknown',
                scopes: tokenData.scopes
            });

            // Pre-flight test: Validate token with GitHub API
            try {
                logger.info('Testing token validity with GitHub API');
                const testResponse = await fetch('https://api.github.com/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenData.token}`,
                        'Accept': 'application/vnd.github+json',
                        'User-Agent': 'Dreamforge-BYOP'
                    }
                });

                if (!testResponse.ok) {
                    logger.error('GitHub token validation FAILED', {
                        status: testResponse.status,
                        statusText: testResponse.statusText
                    });
                    return this.createErrorResponse(
                        `GitHub token is invalid or expired (HTTP ${testResponse.status}). Please reconnect your GitHub account.`,
                        401
                    );
                }

                const userData = await testResponse.json() as { login: string | undefined };
                const githubUsername = userData.login ?? 'unknown';

                // Get actual token scopes from response headers
                const scopesHeader = testResponse.headers.get('x-oauth-scopes');
                const actualScopes = scopesHeader ? scopesHeader.split(',').map(s => s.trim()) : [];

                logger.info('Token validation SUCCESS', {
                    githubUsername,
                    tokenScopes: actualScopes,
                    hasRepoScope: actualScopes.includes('repo'),
                    hasPublicRepoScope: actualScopes.includes('public_repo')
                });

                // Verify token has required scopes
                if (!actualScopes.includes('repo') && !actualScopes.includes('public_repo')) {
                    logger.warn('Token lacks required repository scopes', {
                        actualScopes,
                        requiredScopes: ['repo', 'public_repo']
                    });
                    return this.createErrorResponse(
                        'GitHub token lacks required permissions. Please reconnect with "repo" or "public_repo" scope.',
                        403
                    );
                }
            } catch (error) {
                logger.error('Token validation request failed', {
                    error: error instanceof Error ? error.message : String(error)
                });
                // Don't fail the request if validation check itself fails (network issues, etc.)
                // The git clone will fail anyway if the token is truly invalid
                logger.warn('Proceeding with clone despite validation check failure');
            }

            logger.info('Starting repository import', {
                userId: user.id,
                repositoryUrl,
                branch: branch || 'default'
            });

            // Check cache first
            const cacheService = new BlueprintCacheService(env);
            const effectiveBranch = branch || 'main';
            const cached = await cacheService.get(user.id, repositoryUrl, effectiveBranch);

            if (cached) {
                logger.info('Cache hit - returning cached blueprint immediately', {
                    userId: user.id,
                    repositoryUrl,
                    cacheId: cached.id,
                    completeness: cached.completenessPercentage
                });

                // Return cached result with a special flag
                return this.createSuccessResponse({
                    success: true,
                    fromCache: true,
                    analysisId: cached.id,
                    repositoryName: cached.repositoryName,
                    filesCount: cached.fileCount,
                    blueprint: cached.blueprint as unknown as GeneratedBlueprint,
                    fileContentsR2Key: cached.fileContentsR2Key,
                    message: 'Blueprint retrieved from cache'
                });
            }

            // Step 1: Get sandbox instance
            logger.info('Step 1: Getting sandbox instance', { userId: user.id });
            const sandboxInstanceId = await this.getOrCreateSandboxInstance(user.id);
            const sandboxClient = new SandboxSdkClient(sandboxInstanceId, `byop-${user.id}`);

            // Initialize the sandbox client (ensures container is ready)
            logger.info('Step 1.5: Initializing sandbox client');
            await sandboxClient.initialize();
            logger.info('Sandbox client initialized successfully');

            // Step 2: Clone repository into sandbox
            logger.info('Step 2: Starting repository clone', {
                repositoryUrl,
                branch: branch || 'default'
            });
            const cloneResult = await sandboxClient.cloneGitHubRepository({
                repositoryUrl,
                accessToken: tokenData.token,
                targetPath: '/app/imported-repo',
                branch
            });

            logger.info('Clone operation completed', {
                success: cloneResult.success,
                error: cloneResult.error
            });

            if (!cloneResult.success) {
                logger.error('Repository clone failed', { error: cloneResult.error });
                return this.createErrorResponse(
                    `Failed to clone repository: ${cloneResult.error}`,
                    500
                );
            }

            // Step 3: Read file contents (limit to important files)
            logger.info('Step 3: Reading repository files', { clonePath: cloneResult.clonePath });
            const fileContents = await this.readRepositoryFiles(sandboxClient, cloneResult.clonePath);
            logger.info('Read repository files completed', { fileCount: Object.keys(fileContents).length });

            // Step 4: Read package.json if it exists
            logger.info('Step 4: Reading package.json');
            const packageJsonPath = `${cloneResult.clonePath}/package.json`;
            logger.info('About to read package.json file', { path: packageJsonPath });

            const packageJsonContent = await sandboxClient.readFileAsString(packageJsonPath);
            logger.info('Package.json file read completed', { hasContent: !!packageJsonContent });

            const packageJson = packageJsonContent ? JSON.parse(packageJsonContent) : undefined;
            logger.info('Package.json parsed', { hasPackageJson: !!packageJson });

            // Step 4.5: Extract project name from README.md
            logger.info('Step 4.5: Extracting project name from README.md');
            const readmeContent = fileContents['README.md'];
            const gitHubRepoName = cloneResult.repositoryName || 'unknown';
            const projectName = getProjectDisplayName(readmeContent, gitHubRepoName);
            logger.info('Project name determined', {
                gitHubRepoName,
                extractedProjectName: projectName,
                hasReadme: !!readmeContent
            });

            // Step 5: Start analysis using CodebaseAnalyzer Durable Object
            logger.info('Step 5: Creating CodebaseAnalyzer Durable Object');
            logger.info('Getting Durable Object ID from name');

            const analyzerId = env.CodebaseAnalyzerObject.idFromName(`${user.id}-${Date.now()}`);
            logger.info('Durable Object ID created', { analyzerId: analyzerId.toString() });

            logger.info('Getting Durable Object stub');
            const analyzerStub = env.CodebaseAnalyzerObject.get(analyzerId);
            logger.info('CodebaseAnalyzer stub created successfully');

            // Calculate payload size before sending
            logger.info('Calculating payload size');
            const payloadSize = JSON.stringify({
                repositoryUrl,
                repositoryName: projectName,
                clonePath: cloneResult.clonePath,
                fileContents,
                packageJson
            }).length;
            logger.info('Preparing to send analysis request', {
                payloadSizeBytes: payloadSize,
                payloadSizeMB: (payloadSize / 1024 / 1024).toFixed(2),
                fileCount: Object.keys(fileContents).length,
                projectName
            });

            logger.info('About to send fetch request to CodebaseAnalyzer DO');
            const startResult = await analyzerStub.fetch('http://analyzer/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repositoryUrl,
                    repositoryName: projectName,
                    clonePath: cloneResult.clonePath,
                    fileContents,
                    packageJson
                })
            });
            logger.info('Received response from CodebaseAnalyzer fetch');

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
                filesCount: cloneResult.filesCount,
                projectName
            });

            return this.createSuccessResponse({
                success: true,
                analysisId: analysisResponse.analysisId,
                repositoryName: projectName,
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
        ctx: ExecutionContext,
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
            const state = await stateResult.json() as AnalysisState;

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

            // Cache the blueprint for future use
            const cacheService = new BlueprintCacheService(env);
            const blueprint = state.analysisResult.blueprint as GeneratedBlueprint;
            const repositoryUrl = state.repositoryUrl ?? '';
            const repositoryName = state.repositoryName ?? 'unknown';

            // Calculate total lines of code
            const sourceFiles = state.analysisResult.sourceFiles ?? [];
            const totalLinesOfCode = sourceFiles.reduce(
                (sum: number, file) => sum + (('linesOfCode' in file && typeof file.linesOfCode === 'number') ? file.linesOfCode : 0),
                0
            );

            // Save to cache without blocking the response. ctx.waitUntil
            // keeps the isolate alive past the response flush so the D1 write
            // reliably completes — without it the runtime may tear down
            // before the cache insert lands.
            ctx.waitUntil(
                cacheService.set({
                    userId: user.id,
                    repositoryUrl,
                    repositoryName,
                    branch: 'main',
                    blueprint,
                    fileContentsR2Key: state.fileContentsR2Key,
                    fileCount: sourceFiles.length,
                    totalLinesOfCode,
                    framework: state.analysisResult.framework,
                    ttlDays: 7
                }).catch((error) => {
                    logger.error('Failed to cache blueprint (non-blocking)', { error });
                })
            );

            return this.createSuccessResponse({
                blueprint: state.analysisResult.blueprint,
                fileContentsR2Key: state.fileContentsR2Key, // CRITICAL: Include R2 key for BYOP flow
                repositoryUrl,
                repositoryName
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
        // Reduced to 2 to prevent Docker container overload in local development
        const BATCH_SIZE = 2;
        logger.info('Starting file reading loop', { totalFiles: filePaths.length, batchSize: BATCH_SIZE });

        for (let i = 0; i < filePaths.length; i += BATCH_SIZE) {
            logger.info('Processing batch', { batchNumber: Math.floor(i / BATCH_SIZE) + 1, startIndex: i });

            const batch = filePaths.slice(i, i + BATCH_SIZE);
            logger.info('Batch prepared', { batchSize: batch.length, firstFile: batch[0] });

            logger.info('Starting parallel file reads for batch');
            const batchResults = await Promise.all(
                batch.map(async (filePath) => {
                    try {
                        // Add 10-second timeout to prevent individual file reads from hanging indefinitely
                        const timeoutPromise = new Promise<null>((_, reject) => {
                            setTimeout(() => reject(new Error('File read timeout after 10 seconds')), 10000);
                        });

                        const content = await Promise.race([
                            sandboxClient.readFileAsString(filePath),
                            timeoutPromise
                        ]);
                        return { filePath, content, error: null };
                    } catch (error) {
                        logger.warn('Failed to read file, skipping', {
                            filePath,
                            error: error instanceof Error ? error.message : String(error)
                        });
                        return { filePath, content: null, error: String(error) };
                    }
                })
            );
            logger.info('Batch file reads completed', {
                filesRead: batchResults.length,
                successfulReads: batchResults.filter(r => r.content !== null).length,
                failedReads: batchResults.filter(r => r.content === null).length
            });

            // Store results
            for (const result of batchResults) {
                if (result.content !== null) {
                    // Store with relative path (remove repositoryPath prefix)
                    const relativePath = result.filePath.replace(`${repositoryPath}/`, '');
                    fileContents[relativePath] = result.content;
                }
            }
            logger.info('Batch results stored', { currentTotalFiles: Object.keys(fileContents).length });
        }

        logger.info('File reading loop completed successfully');
        logger.info('Read repository files', {
            repositoryPath,
            filesRead: Object.keys(fileContents).length
        });

        return fileContents;
    }

    /**
     * Start building on imported project
     * POST /api/byop/analysis/:analysisId/start-building
     */
    static async startBuilding(
        request: Request,
        env: Env,
        ctx: ExecutionContext,
        routeContext: RouteContext
    ): Promise<Response> {
        logger.info('=== startBuilding endpoint CALLED ===', {
            url: request.url,
            method: request.method,
            hasUser: !!routeContext.user,
            hasPathParams: !!routeContext.pathParams
        });

        try {
            const user = routeContext.user;
            if (!user) {
                logger.error('startBuilding: No user found');
                return this.createErrorResponse('Unauthorized', 401);
            }

            const analysisId = routeContext.pathParams.analysisId;
            if (!analysisId) {
                logger.error('startBuilding: No analysisId in path params');
                return this.createErrorResponse('Missing analysisId', 400);
            }

            logger.info('Starting build process for imported project', {
                userId: user.id,
                analysisId
            });

            // Get analyzer Durable Object to retrieve blueprint and repository data
            const analyzerId = env.CodebaseAnalyzerObject.idFromString(analysisId);
            const analyzerStub = env.CodebaseAnalyzerObject.get(analyzerId);

            logger.info('Fetching analysis state from CodebaseAnalyzer', { analysisId });
            const stateResult = await analyzerStub.fetch('http://analyzer/state');
            const state = await stateResult.json() as {
                status: string;
                repositoryUrl?: string;
                repositoryName?: string;
                fileContentsR2Key?: string;
                packageJson?: Record<string, unknown>;
                analysisResult?: {
                    blueprint?: GeneratedBlueprint;
                    framework?: string;
                    packageManager?: string;
                    entryPoints?: string[];
                    sourceFiles?: Array<{
                        path: string;
                        language: string;
                    }>;
                };
                error?: string;
            };

            logger.info('Analysis state retrieved', {
                analysisId,
                status: state.status,
                hasR2Key: !!state.fileContentsR2Key
            });

            // Verify analysis is completed
            if (state.status !== 'completed') {
                return this.createErrorResponse(
                    state.status === 'failed'
                        ? `Analysis failed: ${state.error}`
                        : 'Analysis not yet completed. Please wait for blueprint generation to finish.',
                    state.status === 'failed' ? 500 : 202
                );
            }

            if (!state.analysisResult?.blueprint) {
                return this.createErrorResponse('Blueprint not available', 404);
            }

            // Verify we have the R2 key for imported files
            if (!state.fileContentsR2Key) {
                logger.error('Missing R2 key for imported files', { analysisId });
                return this.createErrorResponse(
                    'Repository files not available. Please try re-importing the project.',
                    500
                );
            }

            logger.info('Using R2 key for imported files', {
                analysisId,
                r2Key: state.fileContentsR2Key
            });

            const blueprint = state.analysisResult.blueprint;
            const repositoryName = state.repositoryName || 'imported-project';
            const framework = state.analysisResult.framework || 'react';
            const packageManager = state.analysisResult.packageManager || 'npm';

            // Build comprehensive query for CodeGeneratorAgent
            const query = this.buildCodeGenQueryFromBlueprint(
                repositoryName,
                blueprint,
                framework,
                packageManager
            );

            logger.info('Generated query for CodeGeneratorAgent', {
                repositoryName,
                framework,
                queryLength: query.length,
                recommendationsCount: blueprint.recommendations.length
            });

            // Create request body for code generation
            const codeGenBody = {
                query,
                language: 'typescript',
                frameworks: this.inferFrameworks(framework),
                selectedTemplate: 'auto',
                agentMode: 'smart' as const,
                // Pass R2 key for agent to fetch imported files
                fileContentsR2Key: state.fileContentsR2Key,
                repositoryUrl: state.repositoryUrl
            };

            logger.info('Prepared code generation request with R2 key', {
                analysisId,
                r2Key: state.fileContentsR2Key,
                repositoryName,
                repositoryUrl: state.repositoryUrl,
                framework
            });

            // Create internal request to code generation endpoint
            const url = new URL(request.url);
            const codeGenUrl = `${url.protocol}//${url.host}/api/agent`;

            const codeGenRequest = new Request(codeGenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(codeGenBody)
            });

            // Start code generation using existing controller
            const codeGenResponse = await CodingAgentController.startCodeGeneration(
                codeGenRequest,
                env,
                ctx,
                routeContext
            );

            if (!codeGenResponse.ok) {
                const error = await codeGenResponse.text();
                logger.error('Failed to start code generation', { error });
                return this.createErrorResponse(
                    `Failed to start code generation: ${error}`,
                    codeGenResponse.status
                );
            }

            // Parse first line of streaming response to get agentId
            const reader = codeGenResponse.body?.getReader();
            if (!reader) {
                return this.createErrorResponse('Failed to read code generation response', 500);
            }

            const { value } = await reader.read();
            reader.releaseLock();

            if (!value) {
                return this.createErrorResponse('Empty response from code generation', 500);
            }

            const firstLine = new TextDecoder().decode(value);
            const firstMessage = JSON.parse(firstLine.trim());

            logger.info('Code generation started successfully', {
                agentId: firstMessage.agentId,
                websocketUrl: firstMessage.websocketUrl
            });

            return this.createSuccessResponse({
                success: true,
                agentId: firstMessage.agentId,
                websocketUrl: firstMessage.websocketUrl,
                message: 'AI-assisted development session started'
            });

        } catch (error) {
            logger.error('Failed to start building', error);
            return this.handleError(error, 'start building');
        }
    }

    /**
     * Build comprehensive query from blueprint for CodeGeneratorAgent
     */
    private static buildCodeGenQueryFromBlueprint(
        repositoryName: string,
        blueprint: GeneratedBlueprint,
        framework: string,
        packageManager: string
    ): string {
        const highPriorityRecs = blueprint.recommendations
            .filter(r => r.priority === 'high')
            .slice(0, 5);

        const nextSteps = blueprint.nextSteps.slice(0, 5);
        const completeness = blueprint.currentState.completenessPercentage;

        return `Continue development of ${repositoryName} (${framework} project, ${completeness}% complete).

# Current Project State
${blueprint.description}

**Framework:** ${framework}
**Package Manager:** ${packageManager}
**Completeness:** ${completeness}%

## Implemented Features
${blueprint.currentState.implementedFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}

## Missing Components
${blueprint.currentState.missingComponents.map((c, i) => `${i + 1}. ${c}`).join('\n')}

# High Priority Recommendations
${highPriorityRecs.map((rec, i) => `
${i + 1}. **${rec.title}** (${rec.category})
   ${rec.description}
   ${rec.estimatedEffort ? `Estimated: ${rec.estimatedEffort}` : ''}
`).join('\n')}

# Next Steps
${nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

${blueprint.completionPhases.length > 0 ? `
# Completion Phases
${blueprint.completionPhases.map(phase => `
## Phase ${phase.phase}: ${phase.title} ${phase.estimatedTime ? `(${phase.estimatedTime})` : ''}
${phase.tasks.map((task, i) => `${i + 1}. ${task}`).join('\n')}
`).join('\n')}
` : ''}

Please analyze the project and implement the highest priority improvements. Focus on:
1. Completing missing components
2. Addressing high-priority recommendations
3. Following the next steps outlined above

Start by examining the existing code structure and then propose a specific plan of action.`;
    }

    /**
     * Infer frameworks array from framework string
     */
    private static inferFrameworks(framework?: string): string[] {
        if (!framework) {
            return ['react', 'vite'];
        }

        const frameworkMap: Record<string, string[]> = {
            'react': ['react', 'vite'],
            'vue': ['vue', 'vite'],
            'angular': ['angular'],
            'svelte': ['svelte', 'vite'],
            'nextjs': ['react', 'next'],
            'nuxt': ['vue', 'nuxt']
        };

        return frameworkMap[framework.toLowerCase()] || ['react', 'vite'];
    }
}
