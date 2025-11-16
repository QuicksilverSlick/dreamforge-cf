/**
 * CodebaseAnalyzer Durable Object
 * Analyzes imported GitHub repositories for BYOP feature
 * Stateful analysis with progress tracking and blueprint generation
 */

import { DurableObject } from 'cloudflare:workers';
import { createLogger } from '../../logger';
import { CodeAnalysisService } from '../../services/analysis/CodeAnalysisService';
import { BlueprintGenerationService, type CodebaseContext, type GeneratedBlueprint } from '../../services/blueprint/BlueprintGenerationService';

const logger = createLogger('CodebaseAnalyzer');

export interface AnalysisState {
    repositoryUrl: string;
    repositoryName: string;
    clonePath: string;
    status: 'pending' | 'analyzing' | 'completed' | 'failed';
    progress: number;
    currentPhase?: string;
    fileCount?: number;
    fileContents?: Record<string, string>;
    packageJson?: Record<string, unknown>;
    analysisResult?: CodebaseAnalysisResult;
    error?: string;
    startedAt?: string;
    completedAt?: string;
}

export interface CodebaseAnalysisResult {
    framework?: string;
    packageManager?: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    fileStructure: FileNode[];
    entryPoints: string[];
    configFiles: string[];
    sourceFiles: SourceFileInfo[];
    completionSuggestions: string[];
    estimatedCompleteness: number;
    blueprint?: GeneratedBlueprint;
}

export interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileNode[];
    size?: number;
}

export interface SourceFileInfo {
    path: string;
    language: string;
    linesOfCode: number;
    functions: string[];
    classes: string[];
    imports: string[];
    exports: string[];
    hasTests: boolean;
}

/**
 * CodebaseAnalyzer Durable Object
 * Provides stateful codebase analysis for imported repositories
 */
export class CodebaseAnalyzer extends DurableObject<Env> {
    private state: AnalysisState | null = null;
    private webSockets: Set<WebSocket> = new Set();

    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env);
    }

    /**
     * Initialize new codebase analysis
     */
    async startAnalysis(options: {
        repositoryUrl: string;
        repositoryName: string;
        clonePath: string;
        fileContents: Record<string, string>;
        packageJson?: Record<string, unknown>;
    }): Promise<{ success: boolean; analysisId: string; error?: string }> {
        try {
            const analysisId = this.ctx.id.toString();

            // Validate input size limits
            const validation = this.validateInput(options.fileContents);
            if (!validation.valid) {
                logger.error('Input validation failed', validation);
                return {
                    success: false,
                    analysisId: '',
                    error: validation.error
                };
            }

            this.state = {
                repositoryUrl: options.repositoryUrl,
                repositoryName: options.repositoryName,
                clonePath: options.clonePath,
                fileContents: options.fileContents,
                packageJson: options.packageJson,
                fileCount: Object.keys(options.fileContents).length,
                status: 'pending',
                progress: 0,
                startedAt: new Date().toISOString()
            };

            await this.ctx.storage.put('state', this.state);

            logger.info('Analysis initialized', {
                analysisId,
                repository: options.repositoryName,
                fileCount: this.state.fileCount,
                totalSize: validation.totalSize
            });

            this.executeAnalysis().catch((error) => {
                logger.error('Analysis failed', { analysisId, error });
            });

            return {
                success: true,
                analysisId
            };
        } catch (error) {
            logger.error('Failed to start analysis', error);
            return {
                success: false,
                analysisId: '',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Validate input file contents for size limits
     */
    private validateInput(fileContents: Record<string, string>): {
        valid: boolean;
        error?: string;
        totalSize?: number;
    } {
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
        const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total
        const MAX_FILES = 1000; // Maximum number of files

        const fileCount = Object.keys(fileContents).length;
        if (fileCount > MAX_FILES) {
            return {
                valid: false,
                error: `Too many files (${fileCount}). Maximum allowed: ${MAX_FILES}`
            };
        }

        let totalSize = 0;
        for (const [path, content] of Object.entries(fileContents)) {
            const fileSize = new Blob([content]).size;

            if (fileSize > MAX_FILE_SIZE) {
                return {
                    valid: false,
                    error: `File too large: ${path} (${(fileSize / 1024 / 1024).toFixed(2)}MB). Maximum: 5MB`
                };
            }

            totalSize += fileSize;
        }

        if (totalSize > MAX_TOTAL_SIZE) {
            return {
                valid: false,
                error: `Total size too large (${(totalSize / 1024 / 1024).toFixed(2)}MB). Maximum: 50MB`
            };
        }

        return {
            valid: true,
            totalSize
        };
    }

    /**
     * Get current analysis state
     */
    async getState(): Promise<AnalysisState | null> {
        if (!this.state) {
            this.state = await this.ctx.storage.get<AnalysisState>('state') ?? null;
        }
        return this.state;
    }

    /**
     * Execute the codebase analysis (runs asynchronously)
     */
    private async executeAnalysis(): Promise<void> {
        const ANALYSIS_TIMEOUT = 300000; // 5 minutes

        try {
            if (!this.state) {
                throw new Error('Analysis state not initialized');
            }

            await this.updateState({
                status: 'analyzing',
                currentPhase: 'Reading repository structure',
                progress: 10
            });

            await this.updateState({
                currentPhase: 'Analyzing package.json',
                progress: 30
            });

            // Execute analysis with timeout
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Analysis timeout after 5 minutes')), ANALYSIS_TIMEOUT)
            );

            const analysisResult = await Promise.race([
                this.performAnalysis(),
                timeoutPromise
            ]);

            await this.updateState({
                status: 'completed',
                progress: 100,
                analysisResult,
                completedAt: new Date().toISOString()
            });

            logger.info('Analysis completed successfully', {
                repository: this.state.repositoryName
            });

        } catch (error) {
            logger.error('Analysis execution failed', error);
            await this.updateState({
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error',
                completedAt: new Date().toISOString()
            });
        }
    }

    /**
     * Perform the actual codebase analysis using ts-morph and Gemini 2.5 Pro
     */
    private async performAnalysis(): Promise<CodebaseAnalysisResult> {
        if (!this.state?.fileContents) {
            throw new Error('No file contents available for analysis');
        }

        // Phase 1: Parse source files with ts-morph
        await this.updateState({
            currentPhase: 'Parsing source files with ts-morph',
            progress: 30
        });

        const fileContentsMap = new Map(Object.entries(this.state.fileContents));
        const sourceFileAnalyses = await CodeAnalysisService.analyzeSourceFiles(fileContentsMap);

        // Phase 2: Extract package.json data
        await this.updateState({
            currentPhase: 'Analyzing dependencies',
            progress: 50
        });

        const packageJson = this.state.packageJson || {};
        const dependencies = (packageJson.dependencies as Record<string, string>) || {};
        const devDependencies = (packageJson.devDependencies as Record<string, string>) || {};
        const framework = this.detectFramework(dependencies);
        const packageManager = this.detectPackageManager();

        // Phase 3: Build codebase context for Gemini
        await this.updateState({
            currentPhase: 'Building codebase context',
            progress: 65
        });

        const context: CodebaseContext = {
            repositoryName: this.state.repositoryName,
            repositoryUrl: this.state.repositoryUrl,
            framework,
            packageManager,
            dependencies,
            devDependencies,
            fileStructure: [],
            sourceFiles: sourceFileAnalyses,
            configFiles: [],
            readmeContent: this.state.fileContents['README.md']
        };

        // Phase 4: Generate blueprint with Gemini 2.5 Pro via AI Gateway
        await this.updateState({
            currentPhase: 'Generating completion blueprint with Gemini 2.5 Pro',
            progress: 80
        });

        const blueprint = await BlueprintGenerationService.generateBlueprint(
            this.env,
            context
        );

        // Convert source file analyses to simpler format
        const sourceFiles = sourceFileAnalyses.map(analysis => ({
            path: analysis.path,
            language: analysis.language,
            linesOfCode: analysis.linesOfCode,
            functions: analysis.functions.map(f => f.name),
            classes: analysis.classes.map(c => c.name),
            imports: analysis.imports,
            exports: analysis.exports,
            hasTests: analysis.hasTests
        }));

        return {
            framework,
            packageManager,
            dependencies,
            devDependencies,
            fileStructure: [],
            entryPoints: this.detectEntryPoints(this.state.fileContents),
            configFiles: this.detectConfigFiles(this.state.fileContents),
            sourceFiles,
            completionSuggestions: blueprint.nextSteps,
            estimatedCompleteness: blueprint.currentState.completenessPercentage,
            blueprint
        };
    }

    /**
     * Detect framework from dependencies
     */
    private detectFramework(dependencies: Record<string, string>): string | undefined {
        if (dependencies.react) return 'react';
        if (dependencies.vue) return 'vue';
        if (dependencies['@angular/core']) return 'angular';
        if (dependencies.svelte) return 'svelte';
        if (dependencies.next) return 'nextjs';
        if (dependencies.nuxt) return 'nuxt';
        return undefined;
    }

    /**
     * Detect package manager
     */
    private detectPackageManager(): string {
        if (this.state?.fileContents?.['pnpm-lock.yaml']) return 'pnpm';
        if (this.state?.fileContents?.['yarn.lock']) return 'yarn';
        if (this.state?.fileContents?.['bun.lockb']) return 'bun';
        return 'npm';
    }

    /**
     * Detect entry points
     */
    private detectEntryPoints(fileContents: Record<string, string>): string[] {
        const entryPoints: string[] = [];
        const commonEntryPoints = [
            'src/index.ts',
            'src/index.tsx',
            'src/index.js',
            'src/index.jsx',
            'src/main.ts',
            'src/main.tsx',
            'src/main.js',
            'src/main.jsx',
            'index.ts',
            'index.js'
        ];

        for (const entryPoint of commonEntryPoints) {
            if (fileContents[entryPoint]) {
                entryPoints.push(entryPoint);
            }
        }

        return entryPoints;
    }

    /**
     * Detect configuration files
     */
    private detectConfigFiles(fileContents: Record<string, string>): string[] {
        const configFiles: string[] = [];
        const configPatterns = [
            'package.json',
            'tsconfig.json',
            'vite.config',
            'webpack.config',
            'rollup.config',
            'tailwind.config',
            'postcss.config',
            '.eslintrc',
            'prettier.config'
        ];

        for (const [path] of Object.entries(fileContents)) {
            if (configPatterns.some(pattern => path.includes(pattern))) {
                configFiles.push(path);
            }
        }

        return configFiles;
    }

    /**
     * Update analysis state and broadcast to connected WebSocket clients
     */
    private async updateState(updates: Partial<AnalysisState>): Promise<void> {
        if (!this.state) {
            throw new Error('Analysis state not initialized');
        }

        this.state = {
            ...this.state,
            ...updates
        };

        await this.ctx.storage.put('state', this.state);
        this.broadcastProgress();
    }

    /**
     * Broadcast current state to all connected WebSocket clients
     */
    private broadcastProgress(): void {
        if (!this.state) {
            return;
        }

        const message = JSON.stringify({
            type: 'progress',
            data: {
                repositoryUrl: this.state.repositoryUrl,
                repositoryName: this.state.repositoryName,
                status: this.state.status,
                progress: this.state.progress,
                currentPhase: this.state.currentPhase,
                fileCount: this.state.fileCount,
                analysisResult: this.state.analysisResult,
                error: this.state.error
            }
        });

        // Send to all connected clients and remove closed connections
        this.webSockets.forEach((ws) => {
            try {
                ws.send(message);
            } catch (error) {
                logger.error('Failed to send WebSocket message', error);
                this.webSockets.delete(ws);
            }
        });
    }

    /**
     * Handle incoming requests to the Durable Object
     */
    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        try {
            // Handle WebSocket upgrade
            const upgradeHeader = request.headers.get('Upgrade');
            if (upgradeHeader?.toLowerCase() === 'websocket') {
                return this.handleWebSocketUpgrade();
            }

            if (path === '/start' && request.method === 'POST') {
                const body = await request.json() as {
                    repositoryUrl: string;
                    repositoryName: string;
                    clonePath: string;
                    fileContents: Record<string, string>;
                    packageJson?: Record<string, unknown>;
                };

                const result = await this.startAnalysis(body);
                return Response.json(result);
            }

            if (path === '/state' && request.method === 'GET') {
                const state = await this.getState();
                return Response.json(state);
            }

            return Response.json(
                { error: 'Not found' },
                { status: 404 }
            );

        } catch (error) {
            logger.error('Request handling error', error);
            return Response.json(
                { error: 'Internal server error' },
                { status: 500 }
            );
        }
    }

    /**
     * Handle WebSocket upgrade requests
     */
    private handleWebSocketUpgrade(): Response {
        const pair = new WebSocketPair();
        const [client, server] = Object.values(pair);

        this.ctx.acceptWebSocket(server);
        this.webSockets.add(server);

        server.addEventListener('close', () => {
            this.webSockets.delete(server);
            logger.info('WebSocket client disconnected', {
                totalConnections: this.webSockets.size
            });
        });

        server.addEventListener('error', (event) => {
            logger.error('WebSocket error', event);
            this.webSockets.delete(server);
        });

        // Send current state immediately upon connection
        if (this.state) {
            const message = JSON.stringify({
                type: 'progress',
                data: {
                    repositoryUrl: this.state.repositoryUrl,
                    repositoryName: this.state.repositoryName,
                    status: this.state.status,
                    progress: this.state.progress,
                    currentPhase: this.state.currentPhase,
                    fileCount: this.state.fileCount,
                    analysisResult: this.state.analysisResult,
                    error: this.state.error
                }
            });

            try {
                server.send(message);
            } catch (error) {
                logger.error('Failed to send initial state', error);
            }
        }

        logger.info('WebSocket client connected', {
            totalConnections: this.webSockets.size
        });

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }
}
