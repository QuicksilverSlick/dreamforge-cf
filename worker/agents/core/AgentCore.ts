/**
 * Infrastructure contract exposed by the agent DO to its behaviors and
 * objectives. Ported from upstream `cloudflare/vibesdk`.
 *
 *   - `GitVersionControl` is the real git subsystem (isomorphic-git over the
 *     DO's SQLite via SqliteFS), re-exported above from `worker/agents/git/`.
 *     Every file write is auto-committed (see `FileManager`), so each change is
 *     a revertible checkpoint.
 *
 *   - `DeploymentManager` is an upstream service module; the fork ships
 *     an equivalent through `worker/agents/services/implementations/`
 *     (see `IFileManager`, `FileManager`). Behaviors call into both via
 *     the contract below.
 */

import type { StructuredLogger } from '../../logger';
import type {
    ModelConfigsInfo,
    WebSocketMessageData,
    WebSocketMessageType,
} from '../../api/websocketTypes';
import type {
    ConversationMessage,
    ConversationState,
} from '../inferutils/common';
import type {
    PreviewType,
    TemplateDetails,
    TemplateFile,
} from '../../services/sandbox/sandboxTypes';
import type { FileManager } from '../services/implementations/FileManager';
import type { BaseProjectState } from './state';
// The real git subsystem (isomorphic-git over the DO's SQLite). Re-exported so
// any consumer can keep importing the type from AgentCore.
import type { GitVersionControl } from '../git';
export type { GitVersionControl };
import type {
    AgentActionKey,
    ModelConfig,
} from '../inferutils/config.types';
import type { ImageAttachment } from '../../types/image-attachment';
import type { AttachedDocument } from '../../types/attachment';
import type { FileOutputType } from '../schemas';
import type {
    AgentInitArgs,
    AgentSummary,
    DeploymentTarget,
} from './types';

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

// ---------------------------------------------------------------------------
// Behavior contract
// ---------------------------------------------------------------------------

/**
 * Behavior surface that `CodeGeneratorAgent` (`codingAgent.ts`) calls
 * into. Concrete implementations are `PhasicCodingBehavior` and
 * `AgenticCodingBehavior` (`behaviors/phasic.ts` / `agentic.ts`).
 * Behaviors extend `AgentComponent<TState>` and own all generation-
 * orchestration logic so the DO class stays thin (lifecycle wiring +
 * websocket / persistence only).
 *
 * The 15 methods below are everything `codingAgent.ts` touches on
 * `this.behavior`. Signatures match upstream `behaviors/base.ts`
 * verbatim; the contract reflects the single-agent topology. See
 * `docs/m3/ICodingBehavior-design.md` for the per-method call-site
 * mapping and the rationale for each signature.
 */
export interface ICodingBehavior<
    TState extends BaseProjectState = BaseProjectState,
> {
    // ===== Lifecycle =====

    /**
     * Called from `CodeGeneratorAgent.initialize()`. Behavior owns
     * blueprint synthesis, project-name slug, and all initial state
     * population. `initArgs` carries `inferenceContext`, `templateInfo`,
     * `query`, and the `sandboxSessionId` the agent generated. The
     * `...rest` tail preserves forward-compat with agents-SDK subclass
     * override patterns; current call sites do not pass extra args.
     */
    initialize(initArgs: AgentInitArgs, ...rest: unknown[]): Promise<TState>;

    /**
     * Called from `CodeGeneratorAgent.onStart()` after each (re)attach.
     * Behavior re-reads per-process caches that don't survive DO
     * restarts (e.g. the template-details cache). `props` is the same
     * opaque bag passed through from the agents-sdk `onStart`.
     */
    onStart(props?: Record<string, unknown> | undefined): Promise<void>;

    /**
     * Called from `CodeGeneratorAgent.onStart()` before any state-
     * dependent access. Phasic behavior performs phasic-specific state
     * shape migrations; default implementation in base is a no-op.
     * Synchronous on purpose — must run before `ensureTemplateDetails()`
     * or any other state-dependent call (see Risk 4 in the design doc).
     */
    migrateStateIfNeeded(): void;

    /**
     * Called from `CodeGeneratorAgent.onStart()` and again on the
     * conversation processor path. Lazily fetches template details from
     * the sandbox service if not cached. Idempotent.
     */
    ensureTemplateDetails(): Promise<void>;

    /**
     * Called from `CodeGeneratorAgent.onStart()` after user-config
     * loading. Stashes per-user model config overrides on the behavior
     * so subsequent generation calls pick them up. `undefined` clears
     * the override.
     */
    setUserModelConfigs(
        configs: Record<AgentActionKey, ModelConfig> | undefined,
    ): void;

    // ===== Accessors =====

    /**
     * Called from `CodeGeneratorAgent.onConnect()` to send the initial
     * `AGENT_CONNECTED` payload. Throws if details aren't loaded — the
     * caller MUST have called `ensureTemplateDetails()` first (the agent
     * does this implicitly through `onStart`). Synthesizes a scratch
     * template on demand when `state.templateName === 'scratch'`. The
     * throw is purely defensive — pre-load on behavior construction so
     * the call-ordering invariant holds.
     */
    getTemplateDetails(): TemplateDetails;

    /**
     * Called from `CodeGeneratorAgent.onConnect()` when the template's
     * `renderMode === 'browser'`. Returns the URL the frontend should
     * iframe instead of the sandbox preview. Empty string for non-
     * browser-render templates.
     */
    getBrowserPreviewURL(): string;

    /**
     * Called from `CodeGeneratorAgent.getFullState()`. Hot path —
     * `behavior.state` is the source of truth, this just returns it.
     */
    getFullState(): Promise<TState>;

    /**
     * Called from `CodeGeneratorAgent.getSummary()`. Returns the
     * `{query, generatedCode}` summary used by app-list endpoints.
     */
    getSummary(): Promise<AgentSummary>;

    /**
     * Called from `CodeGeneratorAgent.handleUserInput()`. True when a
     * `generateAllFiles()` promise is in-flight; gates redundant
     * kickoffs.
     */
    isCodeGenerating(): boolean;

    // ===== Action methods (delegated from CodeGeneratorAgent public API) =====

    /**
     * Called from `CodeGeneratorAgent.deployToSandbox(...)` (public API,
     * relayed verbatim). 4 positional args match upstream's signature.
     * Default-empty `files` means "redeploy current state."
     */
    deployToSandbox(
        files?: FileOutputType[],
        redeploy?: boolean,
        commitMessage?: string,
        clearLogs?: boolean,
    ): Promise<PreviewType | null>;

    /**
     * Called from `CodeGeneratorAgent.deployToCloudflare(target?)`.
     * Behavior returns the legacy `{deploymentUrl, workersUrl}` shape;
     * the underlying `DeploymentManager` returns `{deployedUrl, error}`
     * — the behavior is the bridge that maps DeploymentManager results
     * into broadcast payloads + this wider shape. See Risk 2 in the
     * design doc for the name mapping (`deployedUrl` → `deploymentUrl`).
     */
    deployToCloudflare(
        target?: DeploymentTarget,
    ): Promise<{ deploymentUrl?: string; workersUrl?: string } | null>;

    /**
     * Called from `CodeGeneratorAgent.importTemplate(name)`. Loads the
     * template's files into the behavior's state and returns the file
     * manifest. Mirrors upstream's return shape so the frontend handler
     * does not change.
     */
    importTemplate(templateName: string): Promise<{
        templateName: string;
        filesImported: number;
        files: TemplateFile[];
    }>;

    /**
     * Called from `CodeGeneratorAgent.handleUserInput(message, images?, docs?)`.
     * Behavior owns the input handling and decides whether to kick off
     * generation. The agent calls `isCodeGenerating()` afterward to
     * decide whether to fire `generateAllFiles()`. `attachedDocuments` carries
     * text extracted from files attached to this mid-build message.
     */
    handleUserInput(
        userMessage: string,
        images?: ImageAttachment[],
        attachedDocuments?: AttachedDocument[],
    ): Promise<void>;

    /**
     * Called from `CodeGeneratorAgent.handleUserInput()` when idle.
     * Long-running; returns when generation completes or errors. Caller
     * fires-and-forgets with `.catch(...)` rather than awaiting (see
     * Risk 3 in the design doc). Implementations MUST NOT throw
     * synchronously and MUST catch their own internal errors
     * aggressively.
     */
    generateAllFiles(): Promise<void>;

    /**
     * Generate the blueprint-declared image assets after the user consents
     * (images debit Sparks, so they never run without an explicit choice).
     * Optional: behaviors without blueprint images need not implement it.
     */
    resumeBlueprintImages?(): Promise<void>;

    /** Re-broadcast the pending image-consent card (reconnect support). */
    broadcastImageConsentRequest?(): void;

    // ===== WebSocket-handler surface (called via agent.getBehavior()) =====

    /**
     * Called from the WS handler's STOP_GENERATION path. Aborts the
     * in-flight inference operation; returns true if one was cancelled.
     */
    cancelCurrentInference(): boolean;

    /**
     * Called from the WS handler's CAPTURE_SCREENSHOT path. Captures a
     * screenshot of `url` via the Browser Rendering API and returns a
     * signed URL.
     */
    captureScreenshot(
        url: string,
        viewport?: { width: number; height: number },
    ): Promise<string>;

    /**
     * Called from the WS handler's GET_MODEL_CONFIGS path. Returns the
     * merged default + per-user model configuration surface.
     */
    getModelConfigsInfo(): Promise<ModelConfigsInfo>;

    /**
     * Called from the WS handler's GET_CONVERSATION_STATE path. Returns
     * the active deep-debug session id, or null when none is running.
     */
    getDeepDebugSessionState(): { conversationId: string } | null;
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

    /**
     * Rotate to a FRESH sandbox Durable Object. Used when the current
     * sandbox's container is permanently unreachable (e.g. killed by a code
     * rollout and wedged) — every call fails "Network connection lost",
     * including self-heal createInstance, so recovery requires a new DO.
     */
    rotateSandboxSession?(): void;

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
