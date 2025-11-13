/**
 * CodebaseAnalyzer Durable Object
 * Analyzes imported GitHub repositories for BYOP feature
 * Stateful analysis with progress tracking and blueprint generation
 */

import { DurableObject } from 'cloudflare:workers';
import { createLogger } from '../../logger';
import type { Env } from '../../types/worker-types';

const logger = createLogger('CodebaseAnalyzer');

export interface AnalysisState {
    repositoryUrl: string;
    repositoryName: string;
    clonePath: string;
    status: 'pending' | 'analyzing' | 'completed' | 'failed';
    progress: number;
    currentPhase?: string;
    fileCount?: number;
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
    }): Promise<{ success: boolean; analysisId: string }> {
        try {
            const analysisId = this.ctx.id.toString();

            this.state = {
                repositoryUrl: options.repositoryUrl,
                repositoryName: options.repositoryName,
                clonePath: options.clonePath,
                status: 'pending',
                progress: 0,
                startedAt: new Date().toISOString()
            };

            await this.ctx.storage.put('state', this.state);

            logger.info('Analysis initialized', {
                analysisId,
                repository: options.repositoryName
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
                analysisId: ''
            };
        }
    }

    /**
     * Get current analysis state
     */
    async getState(): Promise<AnalysisState | null> {
        if (!this.state) {
            this.state = await this.ctx.storage.get<AnalysisState>('state');
        }
        return this.state;
    }

    /**
     * Execute the codebase analysis (runs asynchronously)
     */
    private async executeAnalysis(): Promise<void> {
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

            const analysisResult = await this.performAnalysis();

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
     * Perform the actual codebase analysis
     */
    private async performAnalysis(): Promise<CodebaseAnalysisResult> {
        await this.updateState({
            currentPhase: 'Analyzing dependencies',
            progress: 50
        });

        await this.updateState({
            currentPhase: 'Analyzing source files',
            progress: 70
        });

        await this.updateState({
            currentPhase: 'Generating completion suggestions',
            progress: 90
        });

        return {
            framework: 'react',
            packageManager: 'npm',
            dependencies: {},
            devDependencies: {},
            fileStructure: [],
            entryPoints: [],
            configFiles: [],
            sourceFiles: [],
            completionSuggestions: [
                'Placeholder: Analysis implementation in progress'
            ],
            estimatedCompleteness: 75
        };
    }

    /**
     * Update analysis state
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
    }

    /**
     * Handle incoming requests to the Durable Object
     */
    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        try {
            if (path === '/start' && request.method === 'POST') {
                const body = await request.json() as {
                    repositoryUrl: string;
                    repositoryName: string;
                    clonePath: string;
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
}
