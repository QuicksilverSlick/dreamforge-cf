
import type { RuntimeError, StaticAnalysisResponse, GitHubPushRequest } from '../../services/sandbox/sandboxTypes';
import type { ClientReportedErrorType, FileOutputType, PhaseConceptType } from '../schemas';
import type { ConversationMessage } from '../inferutils/common';
import type { InferenceContext } from '../inferutils/config.types';
import type { TemplateDetails } from '../../services/sandbox/sandboxTypes';
import { TemplateSelection } from '../schemas';
import { CurrentDevState } from './state';
import { ProcessedImageAttachment } from 'worker/types/image-attachment';

/**
 * Project category that the agent is generating. Drives feature gating in
 * the platform capabilities registry (worker/agents/core/features).
 */
export type ProjectType = 'app' | 'workflow' | 'presentation' | 'general';

/**
 * Generation behavior. Phasic agents iterate phase-by-phase; agentic agents
 * run a single open-ended loop. Determined per project type via the
 * features registry.
 */
export type BehaviorType = 'phasic' | 'agentic';

/**
 * Options for project export / deployment. The `kind` enumerates the
 * supported export targets exposed through the features registry.
 */
export interface ExportOptions {
    kind: 'github' | 'pdf' | 'pptx' | 'googleslides' | 'workflow';
    format?: string;
    token?: string;
    github?: GitHubPushRequest;
    metadata?: Record<string, unknown>;
}

export interface AgentInitArgs {
    query: string;
    language?: string;
    frameworks?: string[];
    hostname: string;
    inferenceContext: InferenceContext;
    templateInfo: {
        templateDetails: TemplateDetails;
        selection: TemplateSelection;
    }
    sandboxSessionId: string
    images?: ProcessedImageAttachment[];
    onBlueprintChunk: (chunk: string) => void;
}

export interface AllIssues {
    runtimeErrors: RuntimeError[];
    staticAnalysis: StaticAnalysisResponse;
    clientErrors: ClientReportedErrorType[];
}

/**
 * Agent state definition for code generation
 */
export interface ScreenshotData {
    url: string;
    timestamp: number;
    viewport: { width: number; height: number };
    userAgent?: string;
    screenshot?: string; // Base64 data URL from Cloudflare Browser Rendering REST API
}

export interface AgentSummary {
    query: string;
    generatedCode: FileOutputType[];
    conversation: ConversationMessage[];
}

export interface UserContext {
    suggestions?: string[];
    images?: ProcessedImageAttachment[];  // Image URLs
}

export interface PhaseExecutionResult {
    currentDevState: CurrentDevState;
    staticAnalysis?: StaticAnalysisResponse;
    result?: PhaseConceptType;
    userSuggestions?: string[];
    userContext?: UserContext;
}