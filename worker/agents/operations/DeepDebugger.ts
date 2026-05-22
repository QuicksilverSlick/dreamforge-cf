import type { RuntimeError } from '../../services/sandbox/sandboxTypes';
import type { FileState } from '../core/state';
import type { RenderToolCall } from './UserConversationProcessor';
import { AgentOperation, type OperationOptions } from './common';

export interface DeepDebuggerInputs {
    issue: string;
    previousTranscript?: string;
    filesIndex: FileState[];
    runtimeErrors?: RuntimeError[];
    streamCb?: (chunk: string) => void;
    toolRenderer?: RenderToolCall;
}

export interface DeepDebuggerOutputs {
    transcript: string;
}

/**
 * M3 stub. Real implementation deferred to M4 (upstream uses
 * `AgentOperationWithTools` + `DeepDebuggerSession` + tool-driven
 * debug loop with `buildDebugTools`). This placeholder lets behavior
 * ports (items 10-12) compile and import `DeepDebuggerOperation`
 * without pulling in the full tools subsystem.
 */
export class DeepDebuggerOperation extends AgentOperation<DeepDebuggerInputs, DeepDebuggerOutputs> {
    async execute(
        _inputs: DeepDebuggerInputs,
        _options: OperationOptions,
    ): Promise<DeepDebuggerOutputs> {
        return { transcript: '[stub] DeepDebugger not yet implemented in this fork; deferred to M4' };
    }
}
