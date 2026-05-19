/**
 * Infrastructure contract exposed by the agent DO to its behaviors and
 * objectives. Ported from upstream `cloudflare/vibesdk` with two
 * fork-local stubs so M3 can land without pulling in M4 work:
 *
 *   - `GitVersionControl` is upstream's M4/PR-6 Git Durable Object. M3
 *     does not port that subsystem; instead this file declares a minimal
 *     interface that a no-op shim (lands in commit 2 at
 *     `worker/services/git/GitVersionControlStub.ts`) implements. The
 *     `git` field on the infrastructure is non-null so behaviors don't
 *     need null-guards everywhere; the stub returns `{ ok: false }` from
 *     every operation so the LLM gets an informative error and plans
 *     without git tooling.
 *
 *   - `DeploymentManager` is an upstream service module; the fork ships
 *     an equivalent through `worker/agents/services/implementations/`
 *     (see `IFileManager`, `FileManager`). Behaviors call into both via
 *     the contract below.
 *
 * If/when M4 lands, replace the stub interface here with a re-export
 * from the real `worker/agents/git/` module.
 */

import type { StructuredLogger } from '../../logger';
import type {
    WebSocketMessageData,
    WebSocketMessageType,
} from '../../api/websocketTypes';
import type {
    ConversationMessage,
    ConversationState,
} from '../inferutils/common';
import type { TemplateDetails } from '../../services/sandbox/sandboxTypes';
import type { FileManager } from '../services/implementations/FileManager';
import type { BaseProjectState } from './state';

// ---------------------------------------------------------------------------
// Service stubs — replaced by real implementations in later M3 commits and
// in M4.
// ---------------------------------------------------------------------------

/**
 * Minimal deployment-manager surface. M3 commit 2 lands a concrete
 * implementation built on the existing fork sandbox client; this
 * interface enumerates what the behaviors call into.
 */
export interface DeploymentManager {
    deployToSandbox(options?: {
        files?: Array<{ filePath: string; fileContents: string }>;
        redeploy?: boolean;
        commitMessage?: string;
        clearLogs?: boolean;
    }): Promise<{
        deploymentId?: string;
        previewURL?: string;
        tunnelURL?: string;
    }>;
    deployToCloudflare(options?: {
        target?: 'platform' | 'user';
        token?: string;
        metadata?: Record<string, unknown>;
    }): Promise<{ deployedUrl?: string; error?: string }>;
}

/**
 * Minimal git-version-control surface. M3 ships this as an informative
 * no-op via `GitVersionControlStub`; M4/PR-6 replaces with the real Git
 * Durable Object client. Method shapes mirror upstream so the upgrade is
 * a re-export, not a rewrite.
 */
export interface GitVersionControl {
    /** True when a real implementation is wired; false when stubbed. */
    readonly available: boolean;
    init(): Promise<{ ok: boolean; reason?: string }>;
    commit(message: string): Promise<{ ok: boolean; sha?: string; reason?: string }>;
    push(): Promise<{ ok: boolean; reason?: string }>;
    status(): Promise<{
        ok: boolean;
        clean?: boolean;
        files?: string[];
        reason?: string;
    }>;
}

// ---------------------------------------------------------------------------
// Infrastructure contract
// ---------------------------------------------------------------------------

/**
 * Infrastructure interface for agent implementations.
 *
 * Behaviors (`BaseCodingBehavior`, `PhasicCodingBehavior`,
 * `AgenticCodingBehavior`) and objectives extend `AgentComponent`, which
 * wraps an `AgentInfrastructure<TState>` and exposes typed accessors.
 * This keeps the DO class (`CodeGeneratorAgent`, ported in commit 2)
 * separate from generation logic.
 */
export interface AgentInfrastructure<TState extends BaseProjectState> {
    // ---- Core DO surface ----
    readonly state: TState;
    setState(state: TState): void;
    getWebSockets(): WebSocket[];
    broadcast<T extends WebSocketMessageType>(
        type: T,
        data?: WebSocketMessageData<T>,
    ): void;
    getAgentId(): string;
    logger(): StructuredLogger;
    readonly env: Env;

    // ---- Conversation accessors ----
    setConversationState(state: ConversationState): void;
    getConversationState(): ConversationState;
    addConversationMessage(message: ConversationMessage): void;
    clearConversation(): void;

    // ---- Services ----
    readonly fileManager: FileManager;
    readonly deploymentManager: DeploymentManager;
    readonly git: GitVersionControl;

    // ---- Git export ----
    /**
     * Snapshots the current project as a git-object bundle for export
     * (e.g. /api/github-exporter/push). Returns an empty `gitObjects`
     * array + `hasCommits: false` when the git stub is in use.
     */
    exportGitObjects(): Promise<{
        gitObjects: Array<{ path: string; data: Uint8Array }>;
        query: string;
        hasCommits: boolean;
        templateDetails: TemplateDetails | null;
    }>;
}
