/**
 * BYOP (Bring Your Own Project) API Types
 * Types for GitHub repository import and analysis
 */

export interface GitHubRepository {
    id: number;
    name: string;
    fullName: string;
    url: string;
    cloneUrl: string;
    description: string | null;
    language: string | null;
    stargazersCount: number;
    forksCount: number;
    isPrivate: boolean;
    defaultBranch: string;
    updatedAt: string;
    createdAt: string;
}

export interface ListRepositoriesResponse {
    repositories: GitHubRepository[];
    total: number;
}

export interface ImportRepositoryRequest {
    repositoryUrl: string;
    branch?: string;
}

export interface ImportRepositoryResponse {
    success: boolean;
    analysisId: string;
    repositoryName: string;
    filesCount: number;
    message: string;
}

export type AnalysisStatus = 'pending' | 'analyzing' | 'completed' | 'failed';

export interface AnalysisStateResponse {
    repositoryUrl: string;
    repositoryName: string;
    clonePath: string;
    status: AnalysisStatus;
    progress: number;
    currentPhase?: string;
    fileCount?: number;
    startedAt?: string;
    completedAt?: string;
    analysisResult?: CodebaseAnalysisResult;
    error?: string;
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

export interface GeneratedBlueprint {
    projectName: string;
    description: string;
    currentState: {
        framework?: string;
        totalFiles: number;
        totalLinesOfCode: number;
        completenessPercentage: number;
        implementedFeatures: string[];
        missingComponents: string[];
    };
    recommendations: Recommendation[];
    nextSteps: string[];
    technicalDebt: string[];
    completionPhases: CompletionPhase[];
}

export interface Recommendation {
    priority: 'high' | 'medium' | 'low';
    category: 'functionality' | 'security' | 'performance' | 'quality' | 'testing';
    title: string;
    description: string;
    estimatedEffort?: string;
}

export interface CompletionPhase {
    phase: number;
    title: string;
    tasks: string[];
    estimatedTime?: string;
}

export interface BlueprintResponse {
    blueprint: GeneratedBlueprint;
}
