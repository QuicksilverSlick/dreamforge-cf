/**
 * `CodeGeneratorAgent` — the new single-agent DO topology landed by M3.
 *
 * Ported from upstream `cloudflare/vibesdk` `worker/agents/core/codingAgent.ts`.
 * This file is the keystone of M3 commit 2b: it consumes the
 * `ICodingBehavior` interface (added to `AgentCore.ts` in the same slice
 * — see `docs/m3/ICodingBehavior-design.md`) so the agent class compiles
 * before the concrete `PhasicCodingBehavior` / `AgenticCodingBehavior`
 * implementations land (items 11 / 12 of `M3_COMMIT2_DEPMAP.md` §8).
 *
 * **Wiring state.** The class is NOT yet exported from `worker/index.ts`
 * — `simpleGeneratorAgent.ts` remains the live `CodeGenObject` Durable
 * Object class until M3 commit 4. This port establishes the new shape
 * for downstream slices to fill in; it must `typecheck + lint + test +
 * build` cleanly but does not have to RUN end-to-end yet.
 *
 * **Adaptations vs upstream** (each documented inline where it bites):
 *   - Behavior factory in `onStart` throws — the `PhasicCodingBehavior`
 *     and `AgenticCodingBehavior` classes don't exist in the fork yet.
 *     This is the explicit blocker that items 11 / 12 unblock.
 *   - `git`: fork ships `GitVersionControlStub` (informative no-op) —
 *     upstream's `getHead()` / `.fs.exportGitObjects()` accessors don't
 *     exist on the stub interface, so `gitInit` and `exportGitObjects`
 *     are adapted to the stub's narrower surface.
 *   - `DeploymentManager`: fork's options shape needs `templateName` +
 *     `projectName` (strings, not lambdas) — constructed lazily via
 *     getter after state has been initialized.
 *   - `FileManager`: fork takes a single `IStateManager` arg; the state
 *     manager is built from `() => this.state as PhasicState` —
 *     transitional narrowing through the discriminated union, valid
 *     because behaviors that need `AgenticState` aren't ported yet.
 *   - `WsTicketManager` / `SecretsClient.notifyUnlocked` patterns are
 *     out of scope: the fork tombstoned `UserSecretsStore` (DO migration
 *     v5) and doesn't ship a ticket-manager class. The vault, ticket-
 *     storage, and `getDecryptedSecret` methods are omitted; the
 *     controller layer handles secret access via D1.
 *   - `onMessage` is a stub that logs + broadcasts a "not yet wired"
 *     error: the existing `handleWebSocketMessage` (websocket.ts:10) is
 *     typed against `SimpleCodeGeneratorAgent`; widening it to accept
 *     this class is out of scope for the keystone slice and lands when
 *     behaviors take over the WS message types.
 */

import {
    Agent,
    type AgentContext,
    type Connection,
    type ConnectionContext,
} from 'agents';
import { getMimeType } from 'hono/utils/mime';

import type { Blueprint } from '../schemas';
import { FileOutputType } from '../schemas';
import {
    AgenticState,
    AgentState,
    BaseProjectState,
    CurrentDevState,
    MAX_PHASES,
    PhasicState,
} from './state';
import {
    AgentInitArgs,
    AgentSummary,
    BehaviorType,
    DeployOptions,
    DeployResult,
    DeploymentTarget,
    ExportOptions,
    ExportResult,
    ProjectType,
} from './types';
import { createObjectLogger, StructuredLogger } from '../../logger';
import { InferenceMetadata } from '../inferutils/config.types';
import { normalizePath, isPathSafe } from '../../utils/pathUtils';
import { FileManager } from '../services/implementations/FileManager';
import { StateManager } from '../services/implementations/StateManager';
import { DeploymentManager } from '../services/implementations/DeploymentManager';
import { GitVersionControlStub } from '../../services/git/GitVersionControlStub';
import { getSandboxService } from '../../services/sandbox/factory';
import {
    AgentInfrastructure,
    type DeploymentManager as IDeploymentManager,
    type GitVersionControl,
    type ICodingBehavior,
} from './AgentCore';
import {
    broadcastToConnections,
    sendToConnection,
} from './websocket';
import {
    handleWebSocketMessage,
    handleWebSocketClose,
} from './codingAgentWebsocket';
import {
    WebSocketMessageData,
    WebSocketMessageType,
} from '../../api/websocketTypes';
import { PreviewType, TemplateDetails, TemplateFile, type GitHubPushRequest } from '../../services/sandbox/sandboxTypes';
import type { GitHubExportResult } from '../../services/github/types';
import { WebSocketMessageResponses } from '../constants';
import { AppService } from '../../database';
import { ConversationMessage, ConversationState } from '../inferutils/common';
import { ImageAttachment } from '../../types/image-attachment';
import { RateLimitExceededError } from 'shared/types/errors';
import { ProjectObjective } from './objectives/base';
import { PhasicCodingBehavior } from './behaviors/phasic';
import { AgenticCodingBehavior } from './behaviors/agentic';
import { StateMigration } from './stateMigration';
import { readTokenCookie } from '../../utils/oauthCookie';
import { generateId } from '../../utils/idGenerator';

const DEFAULT_CONVERSATION_SESSION_ID = 'default';

interface AgentBootstrapProps {
    behaviorType?: BehaviorType;
    projectType?: ProjectType;
}

/**
 * Durable Object class implementing the new single-agent topology.
 *
 * Implements `AgentInfrastructure<AgentState>` so behaviors and
 * objectives — which extend `AgentComponent<TState>` — can call back
 * into the agent through the interface without coupling to this class
 * directly.
 */
export class CodeGeneratorAgent
    extends Agent<Env, AgentState>
    implements AgentInfrastructure<AgentState>
{
    public _logger: StructuredLogger | undefined;
    private behavior!: ICodingBehavior<AgentState>;
    private objective!: ProjectObjective<BaseProjectState>;
    protected static readonly PROJECT_NAME_PREFIX_MAX_LENGTH = 20;

    readonly fileManager: FileManager;
    readonly git: GitVersionControl;

    // Redeclare `env` as public to satisfy the `AgentInfrastructure`
    // interface (`Agent` base class has it as `protected`).
    declare public readonly env: Env;

    /**
     * Lazy `DeploymentManager` — needs `templateName` + `projectName`
     * from state, which are not populated at constructor time. The
     * getter constructs the manager on first access (after `initialize`
     * has run) and memoises the result. Subsequent state changes do not
     * rebuild the manager; behaviours that need a fresh sandbox client
     * should call into the sandbox factory directly.
     */
    private _deploymentManager: DeploymentManager | null = null;
    get deploymentManager(): IDeploymentManager {
        if (!this._deploymentManager) {
            const sessionId = this.state.sandboxInstanceId ?? '';
            this._deploymentManager = new DeploymentManager({
                sandboxClient: getSandboxService(sessionId, this.getAgentId()),
                getSessionId: () => this.state.sandboxInstanceId,
                onSessionIdChange: (id) => {
                    this.setState({ ...this.state, sandboxInstanceId: id });
                },
                templateName: this.state.templateName,
                projectName: this.state.projectName,
                logger: this.logger(),
            });
        }
        return this._deploymentManager;
    }

    initialState: AgentState = {
        behaviorType: 'phasic',
        projectType: 'app',
        projectName: '',
        query: '',
        sessionId: '',
        hostname: '',
        blueprint: {} as Blueprint,
        templateName: '',
        generatedFilesMap: {},
        conversationMessages: [],
        metadata: {} as InferenceMetadata,
        shouldBeGenerating: false,
        sandboxInstanceId: undefined,
        commandsHistory: [],
        lastPackageJson: '',
        pendingUserInputs: [],
        projectUpdatesAccumulator: [],
        lastDeepDebugTranscript: null,
        mvpGenerated: false,
        reviewingInitiated: false,
        generatedPhases: [],
        currentDevState: CurrentDevState.IDLE,
        phasesCounter: MAX_PHASES,
        clientReportedErrors: [],
        inferenceContext: {
            agentId: '',
            userId: '',
            enableRealtimeCodeFix: false,
        } as unknown as PhasicState['inferenceContext'],
        agentMode: 'deterministic',
    } as AgentState;

    constructor(ctx: AgentContext, env: Env) {
        super(ctx, env);

        this.sql`CREATE TABLE IF NOT EXISTS full_conversations (id TEXT PRIMARY KEY, messages TEXT)`;
        this.sql`CREATE TABLE IF NOT EXISTS compact_conversations (id TEXT PRIMARY KEY, messages TEXT)`;

        this.git = new GitVersionControlStub();

        // The state manager is typed against `CodeGenState` (= `PhasicState`
        // alias). The agent's runtime state is `AgentState` (the
        // `PhasicState | AgenticState` union). `as PhasicState` is a
        // transition-time narrowing through the union — valid because every
        // `AgentState` member structurally satisfies `PhasicState`'s
        // BaseProjectState fields, and the agentic-specific fields are
        // gated by `behaviorType` discriminator checks. Resolved when
        // `IStateManager` is regenericised (post-commit-4 cleanup).
        const stateManager = new StateManager(
            () => this.state as PhasicState,
            (s) => this.setState(s),
        );
        this.fileManager = new FileManager(stateManager);
    }

    private createObjective(projectType: ProjectType): ProjectObjective<BaseProjectState> {
        return new ProjectObjective<BaseProjectState>(
            this as AgentInfrastructure<BaseProjectState>,
            projectType,
        );
    }

    /**
     * Initialize the agent with project blueprint and template.
     * Only called once in an app's lifecycle.
     */
    async initialize(
        initArgs: AgentInitArgs,
        ..._args: unknown[]
    ): Promise<AgentState> {
        const { inferenceContext } = initArgs;
        const sandboxSessionId = generateId();
        this.initLogger(
            inferenceContext.agentId,
            inferenceContext.userId,
            sandboxSessionId,
        );

        await this.gitInit();

        await this.behavior.initialize({
            ...initArgs,
            sandboxSessionId,
        });

        await this.saveToDatabase();

        return this.state;
    }

    async isInitialized() {
        return this.getAgentId() ? true : false;
    }

    /**
     * Called every time the agent is started or re-started.
     */
    async onStart(props?: Record<string, unknown> | undefined): Promise<void> {
        const migratedState = StateMigration.migrateCommon(this.state);
        if (migratedState) {
            this.setState(migratedState);
        }

        this.logger().info(
            `Agent ${this.getAgentId()} session: ${this.state.sessionId} onStart`,
            { props },
        );

        const agentProps = props as AgentBootstrapProps | undefined;
        const behaviorType: BehaviorType =
            agentProps?.behaviorType ?? this.state.behaviorType ?? 'phasic';
        const projectType: ProjectType =
            agentProps?.projectType ?? this.state.projectType ?? 'app';

        // Objective is project-type driven and does not depend on the
        // behavior — wire it up first so behaviors can call into it.
        this.objective = this.createObjective(projectType);

        // Behavior factory — wired in slice 2b.16 (sub-slice C).
        // PhasicCodingBehavior and AgenticCodingBehavior structurally
        // satisfy `ICodingBehavior<TState>`; their `build()` is still
        // a "not yet ported" stub pending the follow-on slice that
        // lands the phase state machine + the agentic loop. This DO
        // class is not yet exported as the `CodeGenObject` Durable
        // Object — `SimpleCodeGeneratorAgent` remains the live
        // runtime path until M3 commit 4.
        if (behaviorType === 'phasic') {
            this.behavior = new PhasicCodingBehavior(
                this as AgentInfrastructure<PhasicState>,
                projectType,
            ) as ICodingBehavior<AgentState>;
        } else {
            this.behavior = new AgenticCodingBehavior(
                this as AgentInfrastructure<AgenticState>,
                projectType,
            ) as ICodingBehavior<AgentState>;
        }

        this.logger().info(`Constructed ${behaviorType} behavior`, {
            behaviorType,
            projectType,
        });
    }

    onConnect(connection: Connection, ctx: ConnectionContext) {
        this.logger().info(`Agent connected for agent ${this.getAgentId()}`, {
            connection,
            ctx,
        });

        // Capture the encrypted Cloudflare OAuth blob from the WS upgrade
        // request's HttpOnly cookie and stash it on the DO state. Per-frame
        // WS messages don't carry cookies, so the upgrade handshake is the
        // one chance to read it.
        try {
            const blob = readTokenCookie(ctx.request, this.env);
            const origin = new URL(ctx.request.url).origin;
            const needsUpdate =
                (blob && blob !== this.state.cloudflareToken) ||
                (origin && origin !== this.state.wsOrigin);
            if (needsUpdate) {
                this.setState({
                    ...this.state,
                    cloudflareToken: blob || this.state.cloudflareToken,
                    wsOrigin: origin || this.state.wsOrigin,
                });
            }
        } catch (error) {
            this.logger().warn('Failed to capture CF token cookie on WS connect', { error });
        }

        let previewUrl = '';
        try {
            if (this.behavior.getTemplateDetails().renderMode === 'browser') {
                previewUrl = this.behavior.getBrowserPreviewURL();
            }
        } catch (error) {
            this.logger().error('Error getting preview URL:', error);
        }
        sendToConnection(connection, WebSocketMessageResponses.AGENT_CONNECTED, {
            state: this.state,
            templateDetails: this.behavior.getTemplateDetails(),
            previewUrl,
        });
    }

    private initLogger(agentId: string, userId: string, sessionId?: string) {
        this._logger = createObjectLogger(this, 'CodeGeneratorAgent');
        this._logger.setObjectId(agentId);
        this._logger.setFields({
            agentId,
            userId,
            projectType: this.state.projectType,
            behaviorType: this.state.behaviorType,
        });
        if (sessionId) {
            this._logger.setField('sessionId', sessionId);
        }
        return this._logger;
    }

    // ==========================================
    // Utilities
    // ==========================================

    logger(): StructuredLogger {
        if (!this._logger) {
            this._logger = this.initLogger(
                this.getAgentId(),
                this.state.metadata.userId,
                this.state.sessionId,
            );
        }
        return this._logger;
    }

    getAgentId() {
        return this.state.metadata.agentId;
    }

    getWebSockets(): WebSocket[] {
        return this.ctx.getWebSockets();
    }

    /**
     * Get the project objective (defines what is being built).
     */
    getObjective(): ProjectObjective<BaseProjectState> {
        return this.objective;
    }

    /**
     * Get the behavior (defines how code is generated).
     */
    getBehavior(): ICodingBehavior<AgentState> {
        return this.behavior;
    }

    async getFullState(): Promise<AgentState> {
        return this.behavior.getFullState();
    }

    async getSummary(): Promise<AgentSummary> {
        return this.behavior.getSummary();
    }

    getPreviewUrlCache(): string {
        return '';
    }

    deployToSandbox(
        files: FileOutputType[] = [],
        redeploy: boolean = false,
        commitMessage?: string,
        clearLogs: boolean = false,
    ): Promise<PreviewType | null> {
        return this.behavior.deployToSandbox(files, redeploy, commitMessage, clearLogs);
    }

    deployToCloudflare(
        target?: DeploymentTarget,
    ): Promise<{ deploymentUrl?: string; workersUrl?: string } | null> {
        return this.behavior.deployToCloudflare(target);
    }

    deployProject(options?: DeployOptions): Promise<DeployResult> {
        return this.objective.deploy(options);
    }

    exportProject(options: ExportOptions): Promise<ExportResult> {
        return this.objective.export(options);
    }

    /**
     * GitHub-export entry point invoked by the `githubExporter`
     * controller (`agentStub.pushToGitHub(...)`). Bridges the controller's
     * `GitHubPushRequest`/`GitHubExportResult` shapes onto the objective's
     * generic `export({ kind: 'github', github })` flow. Kept as a
     * dedicated method (rather than changing the controller to call
     * `exportProject`) so the live `SimpleCodeGeneratorAgent` — which
     * exposes its own `pushToGitHub` — keeps working until commit 4.
     */
    async pushToGitHub(options: GitHubPushRequest): Promise<GitHubExportResult> {
        const result = await this.exportProject({ kind: 'github', github: options });
        return {
            success: result.success,
            error: result.error,
            repositoryUrl: result.url,
        };
    }

    importTemplate(
        templateName: string,
    ): Promise<{ templateName: string; filesImported: number; files: TemplateFile[] }> {
        return this.behavior.importTemplate(templateName);
    }

    protected async saveToDatabase() {
        this.logger().info(`Saving agent ${this.getAgentId()} to database`);
        const appService = new AppService(this.env);
        await appService.createApp({
            id: this.state.metadata.agentId,
            userId: this.state.metadata.userId,
            sessionToken: null,
            title: this.state.blueprint.title || this.state.query.substring(0, 100),
            description: this.state.blueprint.description,
            originalPrompt: this.state.query,
            finalPrompt: this.state.query,
            framework: this.state.blueprint.frameworks?.[0],
            visibility: 'private',
            status: 'generating',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        this.logger().info(
            `App saved successfully to database for agent ${this.state.metadata.agentId}`,
            {
                agentId: this.state.metadata.agentId,
                userId: this.state.metadata.userId,
                visibility: 'private',
            },
        );
        this.logger().info(
            `Agent initialized successfully for agent ${this.state.metadata.agentId}`,
        );
    }

    // ==========================================
    // Conversation Management
    // ==========================================

    /*
     * Each DO has 10 GB of sqlite storage. However, the agents SDK stores
     * the `state` object as a single row in `cf_agents_state`, and row
     * size has a much smaller limit in sqlite. We therefore keep only the
     * compactified conversation inside the agent's core state, and store
     * the full conversation in a separate DO table.
     */
    getConversationState(id: string = DEFAULT_CONVERSATION_SESSION_ID): ConversationState {
        const rows = this.sql<{ messages: string; id: string }>`SELECT * FROM full_conversations WHERE id = ${id}`;
        let fullHistory: ConversationMessage[] = [];
        if (rows.length > 0 && rows[0].messages) {
            try {
                const parsed = JSON.parse(rows[0].messages);
                if (Array.isArray(parsed)) {
                    fullHistory = parsed as ConversationMessage[];
                }
            } catch (_e) {
                this.logger().warn('Failed to parse full conversation history', _e);
            }
        }

        const compactRows = this.sql<{ messages: string; id: string }>`SELECT * FROM compact_conversations WHERE id = ${id}`;
        let runningHistory: ConversationMessage[] = [];
        if (compactRows.length > 0 && compactRows[0].messages) {
            try {
                const parsed = JSON.parse(compactRows[0].messages);
                if (Array.isArray(parsed)) {
                    runningHistory = parsed as ConversationMessage[];
                }
            } catch (_e) {
                this.logger().warn('Failed to parse compact conversation history', _e);
            }
        }
        if (runningHistory.length === 0) {
            runningHistory = fullHistory;
        }

        // Dedup by `conversationId-role` rather than upstream's
        // `conversationId-role-tool_call_id`: fork's `ConversationMessage`
        // does not carry a top-level `tool_call_id` (tool calls live in
        // `tool_calls`), and the post-dedup uniqueness on the pair is
        // sufficient for the loaded-history use case here.
        const deduplicateMessages = (
            messages: ConversationMessage[],
        ): ConversationMessage[] => {
            const seen = new Set<string>();
            return messages.filter((msg) => {
                const key = `${msg.conversationId}-${msg.role}`;
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });
        };

        runningHistory = deduplicateMessages(runningHistory);
        fullHistory = deduplicateMessages(fullHistory);

        this.logger().info(
            `Loaded conversation state ${id}, full_length: ${fullHistory.length}, compact_length: ${runningHistory.length}`,
            fullHistory,
        );

        return { id, runningHistory, fullHistory };
    }

    setConversationState(conversations: ConversationState) {
        const serializedFull = JSON.stringify(conversations.fullHistory);
        const serializedCompact = JSON.stringify(conversations.runningHistory);
        try {
            this.logger().info(
                `Saving conversation state ${conversations.id}, full_length: ${serializedFull.length}, compact_length: ${serializedCompact.length}`,
                serializedFull,
            );
            this.sql`INSERT OR REPLACE INTO compact_conversations (id, messages) VALUES (${conversations.id}, ${serializedCompact})`;
            this.sql`INSERT OR REPLACE INTO full_conversations (id, messages) VALUES (${conversations.id}, ${serializedFull})`;
        } catch (error) {
            this.logger().error(
                `Failed to save conversation state ${conversations.id}`,
                error,
            );
        }
    }

    addConversationMessage(message: ConversationMessage) {
        const conversationState = this.getConversationState();
        if (
            !conversationState.runningHistory.find(
                (msg) => msg.conversationId === message.conversationId,
            )
        ) {
            this.logger().info('Adding conversation message', {
                message,
                conversationId: message.conversationId,
                runningHistoryLength: conversationState.runningHistory.length,
                fullHistoryLength: conversationState.fullHistory.length,
            });
            conversationState.runningHistory.push(message);
        } else {
            conversationState.runningHistory = conversationState.runningHistory.map((msg) =>
                msg.conversationId === message.conversationId ? message : msg,
            );
        }
        if (
            !conversationState.fullHistory.find(
                (msg) => msg.conversationId === message.conversationId,
            )
        ) {
            conversationState.fullHistory.push(message);
        } else {
            conversationState.fullHistory = conversationState.fullHistory.map((msg) =>
                msg.conversationId === message.conversationId ? message : msg,
            );
        }
        this.setConversationState(conversationState);
    }

    public clearConversation(): void {
        try {
            this.logger().info('Clearing conversation history');

            this.sql`DELETE FROM full_conversations WHERE id = ${DEFAULT_CONVERSATION_SESSION_ID}`;
            this.sql`DELETE FROM compact_conversations WHERE id = ${DEFAULT_CONVERSATION_SESSION_ID}`;

            this.logger().info('Conversation history cleared successfully');

            this.broadcast(WebSocketMessageResponses.CONVERSATION_CLEARED, {
                message: 'Conversation history cleared',
            });
        } catch (error) {
            this.logger().error('Error clearing conversation history:', error);
            this.broadcastError('Failed to clear conversation history', error);
        }
    }

    /**
     * Handle user input during conversational code generation.
     * Processes user messages and updates pendingUserInputs state.
     */
    async handleUserInput(userMessage: string, images?: ImageAttachment[]): Promise<void> {
        try {
            this.logger().info('Processing user input message', {
                messageLength: userMessage.length,
                pendingInputsCount: this.state.pendingUserInputs.length,
                hasImages: !!images && images.length > 0,
                imageCount: images?.length || 0,
            });

            await this.behavior.handleUserInput(userMessage, images);
            if (!this.behavior.isCodeGenerating()) {
                this.logger().info(
                    'User input during IDLE state, starting generation',
                );
                this.behavior.generateAllFiles().catch((error) => {
                    this.logger().error(
                        'Error starting generation from user input:',
                        error,
                    );
                });
            }
        } catch (error) {
            if (error instanceof RateLimitExceededError) {
                this.logger().error('Rate limit exceeded:', error);
                this.broadcast(WebSocketMessageResponses.RATE_LIMIT_ERROR, { error });
                return;
            }
            this.broadcastError('Error processing user input', error);
        }
    }

    // ==========================================
    // WebSocket Management
    // ==========================================

    /**
     * WebSocket message handler. Delegates to the centralized handler in
     * `codingAgentWebsocket.ts` (ported from upstream `websocket.ts`),
     * which routes each message type to the behavior + agent surface.
     * Coexists with the legacy `SimpleCodeGeneratorAgent` handler
     * (`./websocket.ts`) until M3 commit 4 retires simpleGen.
     */
    async onMessage(connection: Connection, message: string): Promise<void> {
        await handleWebSocketMessage(this, connection, message);
    }

    async onClose(connection: Connection): Promise<void> {
        handleWebSocketClose(connection);
    }

    /**
     * Broadcast message to all connected WebSocket clients.
     */
    public broadcast<T extends WebSocketMessageType>(
        type: T,
        data?: WebSocketMessageData<T>,
    ): void {
        broadcastToConnections(this, type, (data ?? {}) as WebSocketMessageData<T>);
    }

    protected broadcastError(context: string, error: unknown): void {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger().error(`${context}:`, error);
        this.broadcast(WebSocketMessageResponses.ERROR, {
            error: `${context}: ${errorMessage}`,
        });
    }

    // ==========================================
    // Git Management
    // ==========================================

    protected async gitInit() {
        try {
            const result = await this.git.init();
            if (!result.ok) {
                this.logger().info(
                    'Git stub returned not-available (M3 ships without Git DO subsystem)',
                    { reason: result.reason },
                );
                return;
            }
            this.logger().info('Git initialized successfully');
        } catch (error) {
            this.logger().error('Error during git init:', error);
        }
    }

    /**
     * Export git objects — adapted to the fork's `GitVersionControlStub`,
     * which does not yet expose a `.fs.exportGitObjects()` accessor or a
     * `getHead()` query. Returns the empty-bundle shape; the route
     * handler at `worker/api/controllers/github-exporter` falls back to
     * pushing files via REST (see `objectives/base.ts` export path).
     */
    async exportGitObjects(): Promise<{
        gitObjects: Array<{ path: string; data: Uint8Array }>;
        query: string;
        hasCommits: boolean;
        templateDetails: TemplateDetails | null;
    }> {
        try {
            await this.gitInit();
            await this.behavior.ensureTemplateDetails();
            const templateDetails = this.behavior.getTemplateDetails();
            return {
                gitObjects: [],
                query: this.state.query || 'N/A',
                hasCommits: false,
                templateDetails,
            };
        } catch (error) {
            this.logger().error('exportGitObjects failed', error);
            throw error;
        }
    }

    /**
     * Handle browser file serving requests for `renderMode === 'browser'`
     * templates. The URL pattern is `b-{agentid}-{token}.{previewDomain}/
     * {filepath}`; the token is the 16-char trailing segment after the
     * last hyphen.
     */
    async handleBrowserFileServing(request: Request): Promise<Response> {
        const url = new URL(request.url);

        this.logger().info('[BROWSER SERVING] Request received', {
            hostname: url.hostname,
            pathname: url.pathname,
            method: request.method,
        });

        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Max-Age': '86400',
                },
            });
        }

        const subdomain = url.hostname.split('.')[0];

        if (!subdomain.startsWith('b-')) {
            this.logger().warn('[BROWSER SERVING] Invalid hostname pattern - missing b- prefix', {
                hostname: url.hostname,
            });
            return new Response('Invalid request', {
                status: 400,
                headers: { 'Content-Type': 'text/plain' },
            });
        }

        const withoutPrefix = subdomain.substring(2);
        const lastHyphenIndex = withoutPrefix.lastIndexOf('-');

        if (lastHyphenIndex === -1) {
            this.logger().warn(
                '[BROWSER SERVING] Invalid hostname pattern - no hyphen after prefix',
                { hostname: url.hostname },
            );
            return new Response('Invalid request', {
                status: 400,
                headers: { 'Content-Type': 'text/plain' },
            });
        }

        const providedToken = withoutPrefix.substring(lastHyphenIndex + 1);

        const filePath =
            url.pathname === '/' || url.pathname === ''
                ? 'public/index.html'
                : url.pathname.replace(/^\//, '');

        this.logger().info('[BROWSER SERVING] Extracted', { providedToken, filePath });

        const storedToken = this.state.fileServingToken?.token;
        if (!storedToken || providedToken !== storedToken.toLowerCase()) {
            this.logger().warn('[BROWSER SERVING] Token mismatch', {
                providedToken,
                storedToken,
            });
            return new Response('Unauthorized', {
                status: 403,
                headers: { 'Content-Type': 'text/plain' },
            });
        }

        if (!isPathSafe(filePath)) {
            return new Response('Invalid path', {
                status: 400,
                headers: { 'Content-Type': 'text/plain' },
            });
        }
        const normalized = normalizePath(filePath);
        let file = this.fileManager.getFile(normalized);

        if (!file && !normalized.startsWith('public/')) {
            file = this.fileManager.getFile(`public/${normalized}`);
        }

        if (!file) {
            this.logger().warn('[BROWSER SERVING] File not found', { normalized });
            return new Response('File not found', {
                status: 404,
                headers: { 'Content-Type': 'text/plain' },
            });
        }

        const contentType = getMimeType(normalized) || 'application/octet-stream';

        this.logger().info('[BROWSER SERVING] Serving file', {
            path: normalized,
            contentType,
        });

        let content = file.fileContents;

        if (normalized.endsWith('.html') || contentType.includes('text/html')) {
            const baseTag = `<base href="/">`;

            if (content.includes('<head>')) {
                content = content.replace(/<head>/i, `<head>\n  ${baseTag}`);
            } else {
                content = baseTag + '\n' + content;
            }

            this.logger().info('[BROWSER SERVING] Injected base tag');
        }

        return new Response(content, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'X-Sandbox-Type': 'browser-native',
            },
        });
    }

    /**
     * Cache a GitHub OAuth token in memory for subsequent exports.
     * Delegates to the project objective's per-instance cache.
     */
    setGitHubToken(token: string, username: string, ttl: number = 3600000): void {
        this.objective.setGitHubToken(token, username, ttl);
    }

    getGitHubToken(): { token: string; username: string } | null {
        return this.objective.getGitHubToken();
    }

    clearGitHubToken(): void {
        this.objective.clearGitHubToken();
    }
}
