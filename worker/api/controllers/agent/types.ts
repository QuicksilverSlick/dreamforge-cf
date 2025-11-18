import { PreviewType } from "../../../services/sandbox/sandboxTypes";
import type { ImageAttachment } from '../../../types/image-attachment';

export interface CodeGenArgs {
    query: string;
    language?: string;
    frameworks?: string[];
    selectedTemplate?: string;
    agentMode: 'deterministic' | 'smart';
    images?: ImageAttachment[];
    /**
     * Imported repository files from BYOP (Bring Your Own Project)
     * When provided, the agent should modify/extend these files instead of generating from scratch
     */
    importedRepository?: {
        fileContents: Record<string, string>;
        repositoryName: string;
        repositoryUrl?: string;
        framework?: string;
        packageJson?: Record<string, unknown>;
    };
}

/**
 * Data structure for connectToExistingAgent response
 */
export interface AgentConnectionData {
    websocketUrl: string;
    agentId: string;
}

export interface AgentPreviewResponse extends PreviewType {
}
    