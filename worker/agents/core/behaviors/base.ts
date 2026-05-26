/**
 * `BaseCodingBehavior` — abstract base implementing the shared surface of
 * `ICodingBehavior` (see `worker/agents/core/AgentCore.ts`).
 *
 * Ported from upstream `cloudflare/vibesdk` `worker/agents/core/
 * behaviors/base.ts` (1936 LoC). M3 commit 2b lands the port in three
 * sub-slices:
 *
 *   - **Sub-slice A (this file, slice 2b.14)** — scaffolding +
 *     lifecycle + accessors. The 5 `ICodingBehavior` action methods are
 *     declared `abstract` here; concrete implementations land in
 *     sub-slice B alongside the deploy / generation orchestration
 *     helpers (`buildWrapper`, `fetchRuntimeErrors`, the screenshot /
 *     review-cycle methods, etc.).
 *   - **Sub-slice B** — concrete `deployToSandbox` /
 *     `deployToCloudflare` / `importTemplate` / `handleUserInput` /
 *     `generateAllFiles`, plus the `BaseSandboxService`-bound helpers
 *     that depend on a wider `DeploymentManager` surface than the M3
 *     `AgentCore.ts` interface currently exposes.
 *   - **Sub-slice C** — concrete `PhasicCodingBehavior` (item 11) and
 *     `AgenticCodingBehavior` (item 12) implement `build()` +
 *     `getOperationOptions()`.
 *
 * **Wiring state.** This class is NOT yet referenced by the new
 * `CodeGeneratorAgent` (`worker/agents/core/codingAgent.ts:onStart`
 * throws before constructing a behavior). `SimpleCodeGeneratorAgent`
 * remains the live runtime path until M3 commit 4. Atomic-green
 * compile is the only gate this slice has to clear.
 *
 * **Adaptations vs upstream** (documented inline at each call site):
 *   - Drops `implements ICodingAgent`: fork's `ICodingAgent` (the tool-
 *     wrapper abstract class in `worker/agents/services/interfaces/`)
 *     has narrower signatures than `ICodingBehavior` (3-arg
 *     `deployToSandbox` vs 4, 0-arg `deployToCloudflare` vs 1).
 *     `CodingAgentInterface` continues to wrap `SimpleCodeGeneratorAgent`
 *     until commit 4 cuts over.
 *   - `BaseSandboxService.getTemplateDetails(name)` is an instance
 *     method on the fork (upstream is static); `ensureTemplateDetails`
 *     fetches a client via `getSandboxService(...)` to call it.
 *   - `getInferenceContext()` returns the fork's narrower
 *     `InferenceContext` shape: it does NOT carry `abortSignal`,
 *     `runtimeOverrides`, `userApiToken`, or `onUsageConsumed`. Those
 *     fields land when the fork's `infer()` wires them through.
 *   - `getBootstrapCommands()` does not call
 *     `validateAndCleanBootstrapCommands` (not in the fork); it returns
 *     the raw `state.commandsHistory` array. Cleanup lands with
 *     sub-slice B's bootstrap-script writes.
 *   - `getModelConfigsInfo`, `getSandboxServiceClient`,
 *     `executeDeepDebug`, `fetchRuntimeErrors`, `runStaticAnalysisCode`,
 *     and the file-regeneration / screenshot helpers are deferred to
 *     sub-slice B — they depend on a wider `DeploymentManager` surface
 *     (`getClient`, `waitForPreview`, `runStaticAnalysis`,
 *     `fetchRuntimeErrors`) than `AgentCore.ts` currently declares.
 *   - `generateReadme` and `updateBootstrapScript` / `saveExecutedCommands`
 *     are deferred to sub-slice B because they depend on
 *     `getOperationOptions` (abstract here) and on a wider
 *     `IFileManager.saveGeneratedFile` signature than the fork ships.
 */

import type { Connection } from 'agents';
import type {
    AgenticBlueprint,
    Blueprint,
    PhasicBlueprint,
} from '../../schemas';
import type {
    PreviewType,
    TemplateDetails,
    TemplateFile,
} from '../../../services/sandbox/sandboxTypes';
import type { FileOutputType } from '../../schemas';
import {
    type AgenticState,
    type BaseProjectState,
} from '../state';
import type {
    AgentInitArgs,
    AgentSummary,
    BehaviorType,
    DeploymentTarget,
    ProjectType,
} from '../types';
import { WebSocketMessageResponses } from '../../constants';
import { ProjectSetupAssistant } from '../../assistants/projectsetup';
import { UserConversationProcessor } from '../../operations/UserConversationProcessor';
import { FileRegenerationOperation } from '../../operations/FileRegeneration';
import type { BaseSandboxService } from '../../../services/sandbox/BaseSandboxService';
import { getSandboxService } from '../../../services/sandbox/factory';
import { customizeTemplateFiles } from '../../utils/templateCustomizer';
import { createScratchTemplateDetails } from '../../utils/templates';
import type {
    AgentActionKey,
    InferenceContext,
    InferenceRuntimeOverrides,
    ModelConfig,
} from '../../inferutils/config.types';
import { FastCodeFixerOperation } from '../../operations/FastCodeFixer';
import { SimpleCodeGenerationOperation } from '../../operations/SimpleCodeGeneration';
import type { ImageAttachment, ProcessedImageAttachment } from '../../../types/image-attachment';
import type { OperationOptions } from '../../operations/common';
import { generatePortToken } from '../../../utils/cryptoUtils';
import { getPreviewDomain, getProtocolForHost } from '../../../utils/urls';
import { isDev } from '../../../utils/envs';
import { AgentComponent } from '../AgentComponent';
import type {
    AgentInfrastructure,
    GitVersionControl,
    ICodingBehavior,
} from '../AgentCore';

/**
 * Operations the base behavior pre-instantiates. Subclasses extend this
 * with phase / blueprint operations in sub-slice C.
 */
export interface BaseCodingOperations {
    regenerateFile: FileRegenerationOperation;
    fastCodeFixer: FastCodeFixerOperation;
    processUserMessage: UserConversationProcessor;
    simpleGenerateFiles: SimpleCodeGenerationOperation;
}

/**
 * Abstract base for all coding behaviors.
 *
 * Concrete subclasses (`PhasicCodingBehavior`, `AgenticCodingBehavior`)
 * specialize `TState` to `PhasicState` / `AgenticState` and supply the
 * abstract `build()` + `getOperationOptions()` + action-method
 * implementations.
 */
export abstract class BaseCodingBehavior<TState extends BaseProjectState>
    extends AgentComponent<TState>
    implements ICodingBehavior<TState>
{
    protected static readonly MAX_COMMANDS_HISTORY = 10;

    protected projectSetupAssistant: ProjectSetupAssistant | undefined;
    protected templateDetailsCache: TemplateDetails | null = null;

    /**
     * In-memory user-uploaded images. Not persisted in DO state — lost on
     * DO eviction, by design (the controller persists the file blobs to
     * R2 separately and rehydrates them on demand).
     */
    protected pendingUserImages: ProcessedImageAttachment[] = [];

    protected generationPromise: Promise<void> | null = null;
    protected currentAbortController?: AbortController;

    private sandboxReadyPromise: Promise<void>;
    private resolveSandboxReady!: () => void;

    protected userModelConfigs?: Record<AgentActionKey, ModelConfig>;
    protected runtimeOverrides?: InferenceRuntimeOverrides;

    protected operations: BaseCodingOperations = {
        regenerateFile: new FileRegenerationOperation(),
        fastCodeFixer: new FastCodeFixerOperation(),
        processUserMessage: new UserConversationProcessor(),
        simpleGenerateFiles: new SimpleCodeGenerationOperation(),
    };

    constructor(
        infrastructure: AgentInfrastructure<TState>,
        protected projectType: ProjectType,
    ) {
        super(infrastructure);

        this.sandboxReadyPromise = new Promise((resolve) => {
            this.resolveSandboxReady = resolve;
        });
        if (this.state.sandboxInstanceId) {
            this.resolveSandboxReady();
        }

        this.setState({
            ...this.state,
            behaviorType: this.getBehavior(),
            projectType: this.projectType,
        });
    }

    // ==========================================
    // Type / behavior helpers
    // ==========================================

    /**
     * `behaviorType` from state. Concrete subclasses override to return
     * their narrower literal (`'phasic'` / `'agentic'`).
     */
    getBehavior(): BehaviorType {
        return this.state.behaviorType;
    }

    protected isAgenticState(state: BaseProjectState): state is AgenticState {
        return state.behaviorType === 'agentic';
    }

    getProjectType(): ProjectType {
        return this.state.projectType;
    }

    // ==========================================
    // Sandbox readiness
    // ==========================================

    /**
     * Resolves when a sandbox instance id is present on state.
     * Used by sub-slice B's deploy orchestration to gate work that
     * requires a live sandbox.
     */
    protected async waitForSandboxReady(timeoutMs: number = 5000): Promise<boolean> {
        const ready = await Promise.race([
            this.sandboxReadyPromise.then(() => true),
            new Promise<false>((resolve) => setTimeout(() => resolve(false), timeoutMs)),
        ]);
        if (!ready) {
            this.logger.warn(`Sandbox not ready after ${timeoutMs}ms`);
        }
        return ready;
    }

    /**
     * Called by sub-slice B's deploy path when a sandbox session id is
     * assigned, so any pending `waitForSandboxReady` resolves.
     */
    protected markSandboxReady(): void {
        this.resolveSandboxReady();
    }

    // ==========================================
    // ICodingBehavior — Lifecycle
    // ==========================================

    /**
     * Phasic and agentic behaviors override to seed blueprint, project
     * name, and any behavior-specific state. The base implementation
     * just caches `templateInfo.templateDetails` (when present) and
     * ensures details are loaded.
     */
    async initialize(
        initArgs: AgentInitArgs,
        ..._args: unknown[]
    ): Promise<TState> {
        this.logger.info('Initializing behavior');
        const { templateInfo } = initArgs;
        if (templateInfo) {
            this.templateDetailsCache = templateInfo.templateDetails;
            await this.ensureTemplateDetails();
        }
        return this.state;
    }

    /**
     * Default `onStart` is a no-op. The DO class
     * (`CodeGeneratorAgent.onStart`) wires per-process caches (logger,
     * objective). Behaviors override only if they need to rehydrate
     * behavior-specific in-memory caches across DO restarts.
     */
    onStart(_props?: Record<string, unknown> | undefined): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Agents-SDK lifecycle hook for state updates. Default no-op;
     * behaviors override to react to external state writes.
     */
    onStateUpdate(_state: TState, _source: 'server' | Connection): void {
        // no-op
    }

    /**
     * Synchronous on purpose — see `ICodingBehavior` Risk 4 in the
     * design doc. Phasic behavior overrides to perform phasic-specific
     * shape migrations. Default no-op.
     */
    migrateStateIfNeeded(): void {
        // no-op
    }

    /**
     * Lazily fetch template details from the sandbox service if the
     * in-memory cache is empty. Adapts to the fork's instance-method
     * `BaseSandboxService.getTemplateDetails` (upstream is static).
     */
    async ensureTemplateDetails(): Promise<void> {
        if (this.templateDetailsCache) {
            return;
        }
        if (this.state.templateName === 'scratch') {
            this.logger.info('Skipping template details fetch for scratch baseline');
            return;
        }

        this.logger.info(`Loading template details for: ${this.state.templateName}`);

        const sandboxClient: BaseSandboxService = getSandboxService(
            this.state.sandboxInstanceId ?? '',
            this.getAgentId(),
        );
        const results = await sandboxClient.getTemplateDetails(this.state.templateName);
        if (!results.success || !results.templateDetails) {
            throw new Error(
                `Failed to get template details for: ${this.state.templateName}`,
            );
        }

        const templateDetails = results.templateDetails;
        const customizedAllFiles: Record<string, string> = { ...(templateDetails.allFiles ?? {}) };

        // Skip customisation when the template ships no `allFiles`
        // bundle (BYOP / unusual templates) — sub-slice B's deploy path
        // is responsible for surfacing that case.
        if (templateDetails.allFiles) {
            this.logger.info('Customizing template files for project');
            const customizedFiles = customizeTemplateFiles(templateDetails.allFiles, {
                projectName: this.state.projectName,
                commandsHistory: this.getBootstrapCommands(),
            });
            Object.assign(customizedAllFiles, customizedFiles);
        }

        this.templateDetailsCache = {
            ...templateDetails,
            allFiles: customizedAllFiles,
        };
        this.logger.info('Template details loaded and customized');

        // Auto-deploy for browser-render templates is upstream behavior;
        // it depends on the abstract `deployToSandbox` and lands with
        // sub-slice B. Behaviors that need it can override
        // `ensureTemplateDetails` and invoke deploy after super().
    }

    /**
     * Returns the cached template details or synthesises a scratch
     * baseline. Throws if no cache and templateName isn't 'scratch' —
     * callers MUST have called `ensureTemplateDetails()` first. See
     * `ICodingBehavior` Risk 1 in the design doc.
     */
    getTemplateDetails(): TemplateDetails {
        if (!this.templateDetailsCache) {
            if (this.state.templateName === 'scratch') {
                this.templateDetailsCache = createScratchTemplateDetails();
                return this.templateDetailsCache;
            }
            // Best-effort kick-off — caller still gets the throw below.
            void this.ensureTemplateDetails();
            throw new Error(
                'Template details not loaded. Call ensureTemplateDetails() first.',
            );
        }
        return this.templateDetailsCache;
    }

    setUserModelConfigs(configs: Record<AgentActionKey, ModelConfig> | undefined): void {
        this.userModelConfigs = configs;
    }

    getUserModelConfigs(): Record<AgentActionKey, ModelConfig> | undefined {
        return this.userModelConfigs;
    }

    setRuntimeOverrides(overrides: InferenceRuntimeOverrides | undefined): void {
        this.runtimeOverrides = overrides;
    }

    getRuntimeOverrides(): InferenceRuntimeOverrides | undefined {
        return this.runtimeOverrides;
    }

    // ==========================================
    // ICodingBehavior — Accessors
    // ==========================================

    isCodeGenerating(): boolean {
        return this.generationPromise !== null;
    }

    async getFullState(): Promise<TState> {
        return this.state;
    }

    getSummary(): Promise<AgentSummary> {
        return Promise.resolve({
            query: this.state.query,
            generatedCode: this.fileManager.getGeneratedFiles(),
        });
    }

    /**
     * Returns the iframe URL for `renderMode === 'browser'` templates.
     * Pattern: `b-{agentid}-{token}.{previewDomain}`. The token is
     * generated lazily and persisted on `state.fileServingToken`.
     */
    getBrowserPreviewURL(): string {
        const token = this.getOrCreateFileServingToken();
        const agentId = this.getAgentId();
        const previewDomain = isDev(this.env)
            ? 'localhost:5173'
            : getPreviewDomain(this.env);
        return `${getProtocolForHost(previewDomain)}://b-${agentId}-${token}.${previewDomain}`;
    }

    // ==========================================
    // ICodingBehavior — Actions (abstract; sub-slice B/C)
    // ==========================================

    /**
     * Deploy generated files to the sandbox. Concrete impl lands in
     * sub-slice B (along with the wider `DeploymentManager` surface
     * accessors).
     */
    abstract deployToSandbox(
        files?: FileOutputType[],
        redeploy?: boolean,
        commitMessage?: string,
        clearLogs?: boolean,
    ): Promise<PreviewType | null>;

    /**
     * Deploy to Cloudflare Workers (platform or user-token target).
     * Concrete impl lands in sub-slice B.
     */
    abstract deployToCloudflare(
        target?: DeploymentTarget,
    ): Promise<{ deploymentUrl?: string; workersUrl?: string } | null>;

    /**
     * Re-import a template after initial agent setup. Concrete impl
     * lands in sub-slice B alongside the template-file fetch helpers.
     */
    abstract importTemplate(templateName: string): Promise<{
        templateName: string;
        filesImported: number;
        files: TemplateFile[];
    }>;

    /**
     * Process a user message during conversational generation. Concrete
     * impl lands in sub-slice B (drives `UserConversationProcessor`).
     */
    abstract handleUserInput(
        userMessage: string,
        images?: ImageAttachment[],
    ): Promise<void>;

    /**
     * Long-running state-machine driver for code generation. Concrete
     * impl in sub-slice B wraps the abstract `build()` with broadcast +
     * abort plumbing; sub-slice C supplies `build()` in phasic /
     * agentic concretes.
     */
    abstract generateAllFiles(): Promise<void>;

    // ==========================================
    // Internal abstract surface (subclass-supplied)
    // ==========================================

    /**
     * Returns the inference + agent-tool options bag every operation
     * needs. Implemented by phasic / agentic concretes in sub-slice C
     * because the `agent: CodingAgentInterface` field requires a
     * concrete tool-stub wired to the DO class.
     */
    abstract getOperationOptions(): OperationOptions;

    /**
     * The behavior-specific code-generation orchestrator. Wrapped by
     * `generateAllFiles` (sub-slice B); concrete implementations in
     * sub-slice C drive phasic (phase-by-phase) vs agentic (LLM-
     * orchestrated open-ended) loops.
     */
    abstract build(): Promise<void>;

    // ==========================================
    // Pending-input + image queue
    // ==========================================

    async queueUserRequest(
        request: string,
        images?: ProcessedImageAttachment[],
    ): Promise<void> {
        this.setState({
            ...this.state,
            pendingUserInputs: [...this.state.pendingUserInputs, request],
        });
        if (images && images.length > 0) {
            this.logger.info('Storing user images in-memory for phase generation', {
                imageCount: images.length,
            });
            this.pendingUserImages = [...this.pendingUserImages, ...images];
        }
    }

    protected fetchPendingUserRequests(): string[] {
        const inputs = this.state.pendingUserInputs;
        if (inputs.length > 0) {
            this.setState({
                ...this.state,
                pendingUserInputs: [],
            });
        }
        return inputs;
    }

    // ==========================================
    // Blueprint + MVP state
    // ==========================================

    async setBlueprint(blueprint: Blueprint): Promise<void> {
        this.setState({
            ...this.state,
            blueprint: blueprint as AgenticBlueprint | PhasicBlueprint,
        });
        this.broadcast(WebSocketMessageResponses.BLUEPRINT_UPDATED, {
            message: 'Blueprint updated',
            updatedKeys: Object.keys(blueprint || {}),
        });
    }

    setMVPGenerated(): boolean {
        if (!this.state.mvpGenerated) {
            this.setState({ ...this.state, mvpGenerated: true });
            this.logger.info('MVP generated');
            return true;
        }
        return false;
    }

    isMVPGenerated(): boolean {
        return this.state.mvpGenerated;
    }

    // ==========================================
    // Project setup assistant
    // ==========================================

    /**
     * Lazily construct the project setup assistant. Fork and upstream
     * share the 6-key constructor surface (`{env, agentId, query,
     * blueprint, template, inferenceContext}`).
     */
    getProjectSetupAssistant(): ProjectSetupAssistant {
        if (this.projectSetupAssistant === undefined) {
            this.projectSetupAssistant = new ProjectSetupAssistant({
                env: this.env,
                agentId: this.getAgentId(),
                inferenceContext: this.getInferenceContext(),
                query: this.state.query,
                blueprint: this.state.blueprint,
                template: this.getTemplateDetails(),
            });
        }
        return this.projectSetupAssistant;
    }

    // ==========================================
    // File-serving token (browser-render templates)
    // ==========================================

    /**
     * Lazy port-token generation, persisted on `state.fileServingToken`.
     * Tokens are 16-char hex strings used in the browser-preview
     * subdomain pattern `b-{agentid}-{token}`.
     */
    private getOrCreateFileServingToken(): string {
        if (!this.state.fileServingToken) {
            const token = generatePortToken();
            this.setState({
                ...this.state,
                fileServingToken: {
                    token,
                    createdAt: Date.now(),
                },
            });
        }
        return this.state.fileServingToken!.token;
    }

    // ==========================================
    // Previewability + bootstrap commands
    // ==========================================

    protected isPreviewable(): boolean {
        return (
            this.fileManager.fileExists('package.json') &&
            (this.fileManager.fileExists('wrangler.jsonc') ||
                this.fileManager.fileExists('wrangler.toml'))
        );
    }

    /**
     * Returns the recorded bootstrap commands. Upstream additionally
     * runs them through `validateAndCleanBootstrapCommands` (not yet in
     * the fork) — the validate / dedup step lands with sub-slice B's
     * `saveExecutedCommands`. For now the helper just hands back the
     * raw list.
     */
    protected getBootstrapCommands(): string[] {
        return this.state.commandsHistory ?? [];
    }

    // ==========================================
    // Abort controller
    // ==========================================

    /**
     * Returns the in-flight abort controller, or creates a new one. The
     * fork's `InferenceContext` does NOT yet carry an `abortSignal`
     * field — the controller is tracked per behavior for the
     * `cancelCurrentInference` API, but does not plumb into `infer()`
     * until that field is added. Sub-slice B may revisit if needed.
     */
    protected getOrCreateAbortController(): AbortController {
        if (this.currentAbortController && !this.currentAbortController.signal.aborted) {
            return this.currentAbortController;
        }
        this.currentAbortController = new AbortController();
        return this.currentAbortController;
    }

    public cancelCurrentInference(): boolean {
        if (this.currentAbortController) {
            this.logger.info('Cancelling current inference operation');
            this.currentAbortController.abort();
            this.currentAbortController = undefined;
            return true;
        }
        return false;
    }

    protected clearAbortController(): void {
        this.currentAbortController = undefined;
    }

    // ==========================================
    // InferenceContext (fork-shaped)
    // ==========================================

    /**
     * Build the inference context handed to every operation. Returns
     * the fork's narrower `InferenceContext` shape — extends
     * `InferenceMetadata` with `userModelConfigs` and the
     * `enableRealtimeCodeFix` / `enableFastSmartCodeFix` toggles. The
     * upstream extension fields (`abortSignal`, `runtimeOverrides`,
     * `userApiToken`, `onUsageConsumed`) are not part of the fork's
     * type yet and will be added when the relevant call paths land.
     */
    protected getInferenceContext(): InferenceContext {
        // Touch the abort controller so the lifecycle stays in sync
        // with upstream's pattern even though the signal isn't wired
        // through yet.
        this.getOrCreateAbortController();

        return {
            ...this.state.metadata,
            userModelConfigs: this.userModelConfigs,
            enableRealtimeCodeFix: false,
            enableFastSmartCodeFix: false,
        };
    }

    // ==========================================
    // Miscellaneous accessors
    // ==========================================

    getSessionId(): string | undefined {
        return this.state.sandboxInstanceId;
    }

    clearConversation(): void {
        this.infrastructure.clearConversation();
    }

    getGit(): GitVersionControl {
        return this.git;
    }

    getTotalFiles(): number {
        return this.fileManager.getGeneratedFilePaths().length;
    }

    getFileGenerated(filePath: string): FileOutputType | null {
        return this.fileManager.getGeneratedFile(filePath);
    }
}
