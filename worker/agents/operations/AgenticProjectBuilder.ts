import type { ConversationMessage, Message } from '../inferutils/common';
import type { FileState } from '../core/state';
import type { ProjectType } from '../core/types';
import type { Blueprint } from '../schemas';
import type { RenderToolCall } from './UserConversationProcessor';
import { AgentOperation, type OperationOptions } from './common';

export interface AgenticProjectBuilderInputs {
    query: string;
    projectName: string;
    blueprint?: Blueprint;
    filesIndex: FileState[];
    projectType: ProjectType;
    selectedTemplate?: string;
    operationalMode: 'initial' | 'followup';
    conversationHistory?: ConversationMessage[];
    streamCb?: (chunk: string) => void;
    toolRenderer: RenderToolCall;
    onToolComplete?: (message: Message) => Promise<void>;
    onAssistantMessage?: (message: Message) => Promise<void>;
}

export interface AgenticProjectBuilderOutputs {
    output: string;
}

/**
 * M3 stub. Real implementation deferred to M4 — upstream depends on:
 *
 *   - `AgentOperationWithTools` + `ToolSession` / `ToolCallbacks` (the
 *     tool-driven inference loop), which the fork doesn't yet expose
 *   - ~14 tool factories under `tools/toolkit/*` (`createGenerateBlueprintTool`,
 *     `createGenerateFilesTool`, `createDeployPreviewTool`, etc.) that
 *     compose the agentic build/debug surface
 *   - `tools/customTools.withRenderer`, `tools/toolkit/completion-signals`,
 *     and the `prompts/agenticBuilderPrompts` module
 *
 * This placeholder lets the behavior ports (items 10–12 in
 * `M3_COMMIT2_DEPMAP.md` §8) compile against `AgenticProjectBuilderOperation`
 * without pulling the full toolchain forward. Same pattern as
 * `DeepDebugger` (slice 2b.9).
 */
export class AgenticProjectBuilderOperation extends AgentOperation<
    AgenticProjectBuilderInputs,
    AgenticProjectBuilderOutputs
> {
    async execute(
        _inputs: AgenticProjectBuilderInputs,
        _options: OperationOptions,
    ): Promise<AgenticProjectBuilderOutputs> {
        return {
            output: '[stub] AgenticProjectBuilder not yet implemented in this fork; deferred to M4 (depends on AgentOperationWithTools + tools/toolkit/*).',
        };
    }
}
