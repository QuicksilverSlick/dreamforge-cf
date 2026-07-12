import { PreviewType } from "../../../services/sandbox/sandboxTypes";
import type { ImageAttachment } from '../../../types/image-attachment';
import type { AttachmentRef } from '../../../types/attachment';

/**
 * Hard cap on user query length applied during state migration (legacy
 * payloads from before the limit was enforced get truncated) and at the
 * controller boundary (new requests are rejected before reaching the
 * agent). 50_000 chars covers realistic product briefs while keeping
 * prompt-injection / accidental-paste impact bounded.
 */
export const MAX_AGENT_QUERY_LENGTH = 50_000;

export interface CodeGenArgs {
    query: string;
    language?: string;
    frameworks?: string[];
    selectedTemplate?: string;
    agentMode: 'deterministic' | 'smart';
    images?: ImageAttachment[];
    /** Already-uploaded build attachments (refs; server re-verifies ownership). */
    attachments?: AttachmentRef[];
    /** Intake-interview session whose spec should drive the blueprint. */
    interviewSessionId?: string;
}

/**
 * Data structure for connectToExistingAgent response
 */
export interface AgentConnectionData {
    websocketUrl: string;
    agentId: string;
}

export type AgentPreviewResponse = PreviewType;
    