import type { ToolDefinition } from './types';
import { StructuredLogger } from '../../logger';
import { toolWebSearchDefinition } from './toolkit/web-search';
import { toolFeedbackDefinition } from './toolkit/feedback';
import { createQueueRequestTool } from './toolkit/queue-request';
import { createGetLogsTool } from './toolkit/get-logs';
import { createDeployPreviewTool } from './toolkit/deploy-preview';
import { createGenerateImageTool } from './toolkit/generate-image';
import { createUseAttachedImageTool } from './toolkit/use-attached-image';
import { CodingAgentInterface } from 'worker/agents/services/implementations/CodingAgent';
import type { ProcessedImageAttachment } from 'worker/types/image-attachment';

/** Per-turn context the tools close over (the current message's attachments). */
export interface ToolTurnContext {
    images?: ProcessedImageAttachment[];
}

export async function executeToolWithDefinition<TArgs, TResult>(
    toolDef: ToolDefinition<TArgs, TResult>,
    args: TArgs
): Promise<TResult> {
    toolDef.onStart?.(args);
    try {
        const result = await toolDef.implementation(args);
        // Pass the real result to onComplete so it can report a FAILED tool as
        // an error in the UI (toolkit tools return { error } on failure) rather
        // than a false "Completed".
        toolDef.onComplete?.(args, result);
        return result;
    } catch (error) {
        // A THROWN tool never returned a result; synthesize an error result so
        // onComplete still marks it failed, then rethrow (caller handling
        // unchanged).
        const message = error instanceof Error ? error.message : String(error);
        toolDef.onComplete?.(args, { error: message } as unknown as TResult);
        throw error;
    }
}

/**
 * Build all available tools for the agent
 * Add new tools here - they're automatically included in the conversation
 */
export function buildTools(
    agent: CodingAgentInterface,
    logger: StructuredLogger,
    turnContext: ToolTurnContext = {}
): ToolDefinition<any, any>[] {
    // use_attached_image is ALWAYS registered (the system prompt and
    // generate_image's description both reference it — an unregistered tool
    // the model is primed to call yields an unhelpful "tool not found").
    // With no images on the current turn its implementation returns an
    // instructive error that steers the model to ask for a re-attach.
    return [
        toolWebSearchDefinition,
        toolFeedbackDefinition,
        createQueueRequestTool(agent, logger, turnContext.images),
        createGetLogsTool(agent, logger),
        createDeployPreviewTool(agent, logger),
        createGenerateImageTool(agent, logger),
        createUseAttachedImageTool(agent, logger, turnContext.images ?? []),
    ];
}
