/**
 * `BaseCodingBehavior` — abstract base implementing the shared surface of
 * `ICodingBehavior` (see `worker/agents/core/AgentCore.ts`).
 *
 * Ported from upstream `cloudflare/vibesdk` `worker/agents/core/
 * behaviors/base.ts` (1936 LoC). M3 commit 2b lands the port in three
 * sub-slices:
 *
 *   - **Sub-slice A (slice 2b.14)** — scaffolding + lifecycle +
 *     accessors. The 5 `ICodingBehavior` action methods were declared
 *     `abstract` here pending B.
 *   - **Sub-slice B (this slice, 2b.15)** — concrete `deployToSandbox`
 *     / `deployToCloudflare` / `importTemplate` / `handleUserInput` /
 *     `generateAllFiles`, plus the helper surface they need:
 *     `getSandboxServiceClient`, `fetchRuntimeErrors`, the project-
 *     update broadcast override, `waitForGeneration`, and the
 *     `buildWrapper` driver that wraps abstract `build()` with
 *     broadcast + AppService cleanup.
 *   - **Sub-slice C** — concrete `PhasicCodingBehavior` (item 11) and
 *     `AgenticCodingBehavior` (item 12) implement `build()` +
 *     `getOperationOptions()` plus the remaining helpers
 *     (`executeCommands`, `saveExecutedCommands`,
 *     `syncPackageJsonFromSandbox`, `runStaticAnalysisCode`,
 *     `applyDeterministicCodeFixes`, screenshot, deep-debug).
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
 *     sub-slice C's `saveExecutedCommands`.
 *   - `deployToSandbox` / `deployToCloudflare` route through fork's
 *     narrower `DeploymentManager` interface (just `deployToSandbox` /
 *     `deployToCloudflare`); the upstream callback bag and
 *     `runStaticAnalysis` / `fetchRuntimeErrors` / `waitForPreview`
 *     accessors are skipped. The behavior emits broadcasts inline
 *     around the DM calls and maps fork's `{deployedUrl, error}`
 *     return into the `{deploymentUrl, workersUrl}` ICodingBehavior
 *     shape (see Risk 2 in the design doc).
 *   - `fetchRuntimeErrors` calls `getSandboxServiceClient()` (fork's
 *     `getSandboxService` factory) and skips the upstream
 *     `deploymentManager.waitForPreview()` step — the deploy path
 *     resolves the sandbox-ready promise itself.
 *   - `importTemplate` uses fork's static
 *     `BaseSandboxService.listTemplates()` (same as upstream) and
 *     `getTemplateImportantFiles` from `services/sandbox/utils.ts`
 *     (landed in slice 2b.8).
 *   - `handleUserInput` does not track `deepDebugConversationId` — the
 *     deep-debug subsystem is deferred to sub-slice C (the tool fires
 *     but the conversation-id correlation is dropped).
 */

import type { Connection } from 'agents';
import type {
    AgenticBlueprint,
    Blueprint,
    PhasicBlueprint,
} from '../../schemas';
import type {
    PreviewType,
    RuntimeError,
    TemplateDetails,
    TemplateFile,
} from '../../../services/sandbox/sandboxTypes';
import type { FileOutputType } from '../../schemas';
import {
    type AgenticState,
    type BaseProjectState,
    type PhasicState,
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
import { BaseSandboxService } from '../../../services/sandbox/BaseSandboxService';
import { getSandboxService } from '../../../services/sandbox/factory';
import { getTemplateImportantFiles } from '../../../services/sandbox/utils';
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
import { ImageType, uploadImage } from '../../../utils/images';
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
import type {
    WebSocketMessageData,
    WebSocketMessageType,
} from '../../../api/websocketTypes';
import { AppService } from '../../../database';
import { RateLimitExceededError } from 'shared/types/errors';

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
        initArgs: AgentInitArgs<PhasicState | AgenticState>,
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

        // Auto-deploy for browser-render templates — these don't run in
        // the container sandbox; the deploy path immediately broadcasts
        // PREVIEW + COMPLETED with the browser-serving URL. Lands now
        // that `deployToSandbox` is concrete (sub-slice B).
        if (templateDetails.renderMode === 'browser') {
            await this.deployToSandbox();
        }
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
    // ICodingBehavior — Actions
    // ==========================================

    /**
     * Deploy generated files to the sandbox. Routes through fork's
     * narrower `DeploymentManager.deployToSandbox` (options-bag, no
     * callbacks); broadcasts are emitted inline. Browser-render
     * templates short-circuit to the browser-serving URL.
     *
     * Upstream-only side effects skipped on the fork:
     *   - `this.staticAnalysisCache = null` (cache lands sub-slice C)
     *   - `onAfterSetupCommands` → `syncPackageJsonFromSandbox`
     *     (package-sync lands sub-slice C)
     */
    async deployToSandbox(
        files: FileOutputType[] = [],
        redeploy: boolean = false,
        commitMessage?: string,
        clearLogs: boolean = false,
    ): Promise<PreviewType | null> {
        if (!this.isPreviewable()) {
            throw new Error('Project is not previewable');
        }

        this.logger.info('[AGENT] Deploying to sandbox', {
            files: files.length,
            redeploy,
            commitMessage,
            renderMode: this.getTemplateDetails()?.renderMode,
        });

        if (this.getTemplateDetails()?.renderMode === 'browser') {
            this.logger.info('Deploying to browser native sandbox');
            this.broadcast(WebSocketMessageResponses.DEPLOYMENT_STARTED, {
                message: 'Deploying to browser native sandbox',
                files: files.map((f) => ({ filePath: f.filePath })),
            });
            const preview: PreviewType = {
                previewURL: this.getBrowserPreviewURL(),
            };
            this.broadcast(WebSocketMessageResponses.DEPLOYMENT_COMPLETED, {
                message: 'Browser-native deployment complete',
                ...preview,
            });
            this.logger.info('Deployed to browser native sandbox');
            return preview;
        }

        this.broadcast(WebSocketMessageResponses.DEPLOYMENT_STARTED, {
            message: 'Deploying code to sandbox service',
            files: files.map((f) => ({ filePath: f.filePath })),
        });

        try {
            const result = await this.deploymentManager.deployToSandbox({
                files,
                redeploy,
                commitMessage,
                clearLogs,
            });

            const preview: PreviewType = {
                runId: result.deploymentId,
                previewURL: result.previewURL,
                tunnelURL: result.tunnelURL,
            };

            this.broadcast(WebSocketMessageResponses.DEPLOYMENT_COMPLETED, {
                message: 'Deployment completed',
                ...preview,
            });
            this.markSandboxReady();
            return preview;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error('Error deploying to sandbox', { message });
            this.broadcast(WebSocketMessageResponses.DEPLOYMENT_FAILED, {
                message: `Deployment failed: ${message}`,
            });
            throw error;
        }
    }

    /**
     * Deploy the generated code to Cloudflare Workers. Maps fork's
     * `DeploymentManager.deployToCloudflare({deployedUrl, error})`
     * return into the `ICodingBehavior` `{deploymentUrl, workersUrl}`
     * shape; see Risk 2 in the design doc for the field-name mapping.
     */
    async deployToCloudflare(
        target: DeploymentTarget = 'platform',
    ): Promise<{ deploymentUrl?: string; workersUrl?: string } | null> {
        try {
            // Bootstrap a sandbox first if one isn't ready.
            if (!this.state.sandboxInstanceId) {
                this.logger.info('No sandbox instance, deploying to sandbox first');
                await this.deployToSandbox();
                if (!this.state.sandboxInstanceId) {
                    this.logger.error('Failed to deploy to sandbox service');
                    this.broadcast(
                        WebSocketMessageResponses.CLOUDFLARE_DEPLOYMENT_ERROR,
                        {
                            message: 'Deployment failed: Failed to deploy to sandbox service',
                            error: 'Sandbox service unavailable',
                        },
                    );
                    return null;
                }
            }

            const instanceId = this.state.sandboxInstanceId;
            this.broadcast(WebSocketMessageResponses.CLOUDFLARE_DEPLOYMENT_STARTED, {
                message: 'Cloudflare deployment started',
                instanceId,
            });

            const result = await this.deploymentManager.deployToCloudflare({ target });

            if (result.error || !result.deployedUrl) {
                const errorMessage = result.error ?? 'Cloudflare deploy returned no URL';
                this.broadcast(WebSocketMessageResponses.CLOUDFLARE_DEPLOYMENT_ERROR, {
                    message: 'Cloudflare deployment failed',
                    error: errorMessage,
                });
                return null;
            }

            // Persist deployment id (using deployedUrl as identifier in
            // the fork — `AppService.updateDeploymentId` accepts any
            // string).
            try {
                const appService = new AppService(this.env);
                await appService.updateDeploymentId(this.getAgentId(), result.deployedUrl);
            } catch (dbErr) {
                this.logger.warn('Failed to persist deployment URL', dbErr);
            }

            this.broadcast(WebSocketMessageResponses.CLOUDFLARE_DEPLOYMENT_COMPLETED, {
                message: 'Cloudflare deployment completed',
                deploymentUrl: result.deployedUrl,
            });

            return { deploymentUrl: result.deployedUrl };
        } catch (error) {
            this.logger.error('Cloudflare deployment error:', error);
            this.broadcast(WebSocketMessageResponses.CLOUDFLARE_DEPLOYMENT_ERROR, {
                message: 'Deployment failed',
                error: error instanceof Error ? error.message : String(error),
            });
            return null;
        }
    }

    /**
     * Re-import a template into the project. Uses fork's static
     * `BaseSandboxService.listTemplates()` for catalog lookup +
     * `getTemplateImportantFiles` from `services/sandbox/utils.ts`
     * (landed slice 2b.8).
     */
    async importTemplate(templateName: string): Promise<{
        templateName: string;
        filesImported: number;
        files: TemplateFile[];
    }> {
        this.logger.info(`Importing template into project: ${templateName}`);

        if (this.state.templateName !== templateName) {
            const catalogResponse = await BaseSandboxService.listTemplates();
            const catalogInfo = catalogResponse.success
                ? catalogResponse.templates.find((t) => t.name === templateName)
                : null;

            this.setState({
                ...this.state,
                templateName,
                ...(catalogInfo?.projectType
                    ? { projectType: catalogInfo.projectType }
                    : {}),
            });

            this.templateDetailsCache = null;
        }

        await this.ensureTemplateDetails();
        const templateDetails = this.templateDetailsCache;
        if (!templateDetails) {
            throw new Error(`Failed to get template details for: ${templateName}`);
        }

        this.setState({
            ...this.state,
            lastPackageJson:
                templateDetails.allFiles?.['package.json'] ?? this.state.lastPackageJson,
        });

        const importantFiles = getTemplateImportantFiles(templateDetails);

        await this.deployToSandbox();

        this.broadcast(WebSocketMessageResponses.TEMPLATE_UPDATED, {
            templateDetails,
        });

        return {
            templateName: templateDetails.name,
            filesImported: Object.keys(templateDetails.allFiles ?? {}).length,
            files: importantFiles,
        };
    }

    /**
     * Process a user message during conversational generation. Uses
     * `UserConversationProcessor` (the fork's existing operation) and
     * forwards streamed chunks via the `CONVERSATION_RESPONSE`
     * broadcast.
     *
     * The deep-debug conversation-id correlation (upstream tracks it
     * when the `deep_debug` tool fires) is dropped here — the deep-
     * debug machinery lands with sub-slice C.
     */
    async handleUserInput(userMessage: string, images?: ImageAttachment[]): Promise<void> {
        try {
            this.logger.info('Processing user input message', {
                messageLength: userMessage.length,
                pendingInputsCount: this.state.pendingUserInputs.length,
                hasImages: !!images && images.length > 0,
                imageCount: images?.length ?? 0,
            });

            await this.ensureTemplateDetails();

            // Fetch (but don't clear) any runtime errors so the
            // conversation processor can reference them.
            const errors = await this.fetchRuntimeErrors(false);
            const projectUpdates = await this.getAndResetProjectUpdates();
            this.logger.info('Passing context to user conversation processor', {
                errorCount: errors.length,
                projectUpdateCount: projectUpdates.length,
            });

            const conversationState = this.infrastructure.getConversationState();

            let uploadedImages: ProcessedImageAttachment[] = [];
            if (images && images.length > 0) {
                uploadedImages = await Promise.all(
                    images.map((image) => uploadImage(this.env, image, ImageType.UPLOADS)),
                );
                this.logger.info('Uploaded images', {
                    uploadedImagesCount: uploadedImages.length,
                });
            }

            const result = await this.operations.processUserMessage.execute(
                {
                    userMessage,
                    conversationState,
                    conversationResponseCallback: (
                        message,
                        conversationId,
                        isStreaming,
                        tool,
                    ) => {
                        this.broadcast(WebSocketMessageResponses.CONVERSATION_RESPONSE, {
                            message,
                            conversationId,
                            isStreaming,
                            tool,
                        });
                    },
                    errors,
                    projectUpdates,
                    images: uploadedImages,
                },
                this.getOperationOptions(),
            );

            const { conversationResponse, conversationState: newConversationState } = result;
            this.logger.info('User input processed successfully', {
                responseLength: conversationResponse.userResponse.length,
            });

            this.infrastructure.setConversationState(newConversationState);
        } catch (error) {
            this.logger.error('Error processing user input', error);
            throw error;
        }
    }

    /**
     * Long-running state-machine driver for code generation. Delegates
     * to `buildWrapper` which wraps the abstract `build()` with
     * broadcasts, AppService cleanup, and the
     * `RateLimitExceededError` translation. Caller (codingAgent's
     * `handleUserInput`) fires-and-forgets — never `await` from a
     * request handler.
     */
    async generateAllFiles(): Promise<void> {
        if (this.state.mvpGenerated && this.state.pendingUserInputs.length === 0) {
            this.logger.info(
                'Code generation already completed and no user inputs pending',
            );
            return;
        }
        if (this.isCodeGenerating()) {
            this.logger.info('Code generation already in progress');
            return;
        }
        this.generationPromise = this.buildWrapper();
        await this.generationPromise;
    }

    /**
     * Wraps the abstract `build()` with start/complete broadcasts,
     * `RateLimitExceededError` translation, AppService status update,
     * and abort-controller cleanup. Concrete `build()` lands in
     * sub-slice C (phasic / agentic).
     */
    private async buildWrapper(): Promise<void> {
        this.broadcast(WebSocketMessageResponses.GENERATION_STARTED, {
            message: 'Starting code generation',
            totalFiles: this.getTotalFiles(),
        });
        this.logger.info('Starting code generation', {
            totalFiles: this.getTotalFiles(),
        });
        await this.ensureTemplateDetails();
        try {
            await this.build();
        } catch (error) {
            if (error instanceof RateLimitExceededError) {
                this.logger.error('Error in state machine:', error);
                this.broadcast(WebSocketMessageResponses.RATE_LIMIT_ERROR, { error });
            } else {
                this.broadcastError('Error during generation', error);
            }
        } finally {
            this.clearAbortController();
            try {
                const appService = new AppService(this.env);
                await appService.updateApp(this.getAgentId(), { status: 'completed' });
            } catch (dbErr) {
                this.logger.warn('Failed to update app status to completed', dbErr);
            }
            this.generationPromise = null;
            this.broadcast(WebSocketMessageResponses.GENERATION_COMPLETE, {
                message: 'Code generation and review process completed.',
                instanceId: this.state.sandboxInstanceId,
            });
        }
    }

    /**
     * Wait for the currently-running generation (if any) to settle.
     * Used by callers that need to barrier on a pending build.
     */
    async waitForGeneration(): Promise<void> {
        if (this.generationPromise) {
            try {
                await this.generationPromise;
                this.logger.info('Code generation completed successfully');
            } catch (error) {
                this.logger.error('Error during code generation:', error);
            }
        } else {
            this.logger.info('No active generation to wait for');
        }
    }

    // ==========================================
    // Sandbox service accessor + runtime errors
    // ==========================================

    /**
     * Returns a sandbox client bound to the current session. The fork's
     * `getSandboxService` factory takes `(sessionId, agentId)` and
     * always returns a client — the session id is used by the client
     * for instance-scoped operations.
     */
    getSandboxServiceClient(): BaseSandboxService {
        return getSandboxService(this.state.sandboxInstanceId ?? '', this.getAgentId());
    }

    /**
     * Fetch runtime errors from the sandbox. Optionally clears them
     * after the read. Upstream calls
     * `this.deploymentManager.waitForPreview()` first; fork skips
     * that step (the deploy path already resolves
     * `sandboxReadyPromise`).
     */
    async fetchRuntimeErrors(
        clear: boolean = true,
        _shouldWait: boolean = true,
    ): Promise<RuntimeError[]> {
        const sandboxInstanceId = this.state.sandboxInstanceId;
        if (!sandboxInstanceId) {
            return [];
        }

        try {
            const sandboxClient = this.getSandboxServiceClient();
            const response = await sandboxClient.getInstanceErrors(sandboxInstanceId);
            if (!response.success) {
                return [];
            }
            const errors = response.errors;
            if (clear && errors.length > 0) {
                await sandboxClient.clearInstanceErrors(sandboxInstanceId);
            }
            if (errors.length > 0) {
                this.broadcast(WebSocketMessageResponses.RUNTIME_ERROR_FOUND, {
                    errors,
                    message: 'Runtime errors found',
                    count: errors.length,
                });
            }
            return errors;
        } catch (error) {
            this.logger.error('Exception fetching runtime errors:', error);
            // Kick off a redeploy in the background so the next read
            // has a chance to succeed; don't await.
            void this.deployToSandbox().catch(() => undefined);
            const message =
                '<runtime errors not available at the moment as preview is not deployed>';
            return [
                {
                    message,
                    timestamp: new Date().toISOString(),
                    level: 0,
                    rawOutput: message,
                },
            ];
        }
    }

    // ==========================================
    // Project-update tracking + broadcast override
    // ==========================================

    /**
     * Append a "project update" message that the conversation
     * processor later surfaces to the user. Mirrored from upstream so
     * `handleUserInput` has historical context.
     */
    protected async onProjectUpdate(message: string): Promise<void> {
        this.setState({
            ...this.state,
            projectUpdatesAccumulator: [
                ...this.state.projectUpdatesAccumulator,
                message,
            ],
        });
    }

    protected async getAndResetProjectUpdates(): Promise<string[]> {
        const projectUpdates = this.state.projectUpdatesAccumulator ?? [];
        if (projectUpdates.length > 0) {
            this.setState({
                ...this.state,
                projectUpdatesAccumulator: [],
            });
        }
        return projectUpdates;
    }

    /**
     * Widened-visibility broadcast that intercepts project-update WS
     * messages (per `UserConversationProcessor.isProjectUpdateType`)
     * and routes them through `onProjectUpdate` before delegating to
     * the underlying infrastructure broadcaster. Concrete behaviors
     * inherit this routing automatically.
     */
    public broadcast<T extends WebSocketMessageType>(
        type: T,
        data?: WebSocketMessageData<T>,
    ): void {
        if (this.operations.processUserMessage.isProjectUpdateType(type)) {
            let message: string = type as unknown as string;
            if (data && typeof data === 'object' && 'message' in data) {
                const fromData = (data as { message?: unknown }).message;
                if (typeof fromData === 'string') {
                    message = fromData;
                }
            }
            void this.onProjectUpdate(message);
        }
        super.broadcast(type, data);
    }

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
