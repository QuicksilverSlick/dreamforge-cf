/**
 * `CodeGeneratorAgent` — the single-agent DO topology landed by M3 and the
 * live `CodeGenObject` Durable Object, exported (Sentry-wrapped) from
 * `worker/index.ts`.
 *
 * Ported from upstream `cloudflare/vibesdk` `worker/agents/core/codingAgent.ts`.
 * It consumes the `ICodingBehavior` interface (`AgentCore.ts` — see
 * `docs/m3/ICodingBehavior-design.md`) and delegates all generation
 * orchestration to the concrete behavior the `onStart` factory selects
 * (`PhasicCodingBehavior` / `AgenticCodingBehavior`), keeping the DO class
 * thin: lifecycle wiring, persistence, and websocket routing only.
 *
 * **Adaptations vs upstream** (each documented inline where it bites):
 *   - `git`: fork ships `GitVersionControlStub` (informative no-op) —
 *     upstream's `getHead()` / `.fs.exportGitObjects()` accessors don't
 *     exist on the stub interface, so `gitInit` and `exportGitObjects`
 *     are adapted to the stub's narrower surface.
 *   - `DeploymentManager`: fork's options shape needs `templateName` +
 *     `projectName` (strings, not lambdas) — constructed lazily via
 *     getter after state has been initialized.
 *   - `FileManager`: fork takes a single `IStateManager` arg; the state
 *     manager is built from `() => this.state as PhasicState` — narrowing
 *     through the discriminated union, valid because phasic is the default
 *     state shape.
 *   - `WsTicketManager` / `SecretsClient.notifyUnlocked` patterns are
 *     out of scope: the fork tombstoned `UserSecretsStore` (DO migration
 *     v5) and doesn't ship a ticket-manager class. The vault, ticket-
 *     storage, and `getDecryptedSecret` methods are omitted; the
 *     controller layer handles secret access via D1.
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
import { GitVersionControl, type SqlExecutor, type SqlValue } from '../git';
import { getSandboxService } from '../../services/sandbox/factory';
import {
    AgentInfrastructure,
    type DeploymentManager as IDeploymentManager,
    type ICodingBehavior,
} from './AgentCore';
import {
    broadcastToConnections,
    sendToConnection,
} from './websocketHelpers';
import {
    handleWebSocketMessage,
    handleWebSocketClose,
} from './codingAgentWebsocket';
import { readConnectionIdentity, broadcastPresence, handlePresenceOnClose, connectionForErrorOrRethrow } from './presence';
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

/**
 * Build a SqliteFS-compatible SQL executor from the DO's SqlStorage. SqliteFS
 * binds binary git objects (ArrayBuffer); the pinned agents SDK's `this.sql`
 * omits ArrayBuffer from its value types, but the underlying SqlStorage accepts
 * blobs — so we go straight to it. The single generic cast bridges the cursor's
 * row type to the caller's requested `T` (mirrors the SDK's own `sql<T>()`).
 */
function createDoSqlExecutor(storage: AgentContext['storage']): SqlExecutor {
    return <T = unknown>(strings: TemplateStringsArray, ...values: SqlValue[]): T[] => {
        const query = strings.reduce(
            (acc, str, i) => acc + str + (i < values.length ? '?' : ''),
            '',
        );
        return storage.sql.exec(query, ...values).toArray() as T[];
    };
}

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
            // The sandbox CLIENT must be built from the stable, always-present
            // session id (never `sandboxInstanceId`, which is undefined until a
            // deploy creates an instance — an empty id makes getSandbox throw
            // "Sandbox ID must be 1-63 characters long"). `getSessionId` below
            // still tracks the deploy-time instance id separately.
            const sandboxSessionId = this.state.sessionId || this.getAgentId();
            this._deploymentManager = new DeploymentManager({
                sandboxClient: getSandboxService(sandboxSessionId, this.getAgentId()),
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
    } as AgentState;

    constructor(ctx: AgentContext, env: Env) {
        super(ctx, env);

        this.sql`CREATE TABLE IF NOT EXISTS full_conversations (id TEXT PRIMARY KEY, messages TEXT)`;
        this.sql`CREATE TABLE IF NOT EXISTS compact_conversations (id TEXT PRIMARY KEY, messages TEXT)`;

        // Real git version control backed by this DO's SQLite (isomorphic-git
        // over SqliteFS). Every file write is auto-committed (see FileManager),
        // so each change is a revertible checkpoint. The executor is built from
        // the DO's SqlStorage directly (not the agents-SDK `this.sql`), because
        // this pinned SDK (0.2.35) under-types `sql`'s value params — it omits
        // ArrayBuffer, which SqliteFS binds for binary git objects.
        this.git = new GitVersionControl(createDoSqlExecutor(ctx.storage));

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
        this.fileManager = new FileManager(stateManager, this.git);
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

        // Behavior factory. PhasicCodingBehavior and AgenticCodingBehavior
        // structurally satisfy `ICodingBehavior<TState>`. The phasic
        // behavior drives the live phase state machine; the agentic
        // behavior's `build()` is a documented stub that routes through
        // phasic until the agentic loop is ported (see agentic.ts).
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

        // Ensure the per-app git repo exists on every wake-up — idempotent and
        // CHEAP (just writes the initial refs; NO baseline commit), so it never
        // delays the WS connect. The complete baseline is established lazily on
        // the first commit (FileManager.commitToGit commits the full file set
        // when HEAD is absent), so that one-time cost lands inside generation
        // rather than on the connect path. git.init() swallows its own errors.
        await this.git.init();
    }

    async onConnect(connection: Connection, ctx: ConnectionContext) {
        this.logger().info(`Agent connected for agent ${this.getAgentId()}`, {
            connection,
            ctx,
        });

        // Attach this connection's identity (stamped on the upgrade request by the
        // route) so presence + the single-driver seat can identify each viewer.
        const identity = readConnectionIdentity(ctx.request);
        if (identity) {
            connection.setState(identity);
        }

        // Capture the encrypted Cloudflare OAuth blob from the WS upgrade request's
        // HttpOnly cookie — but ONLY for the app's CREATOR (the billing/deploy
        // identity). A collaborating member's token must never overwrite it. Per-
        // frame WS messages don't carry cookies, so the handshake is the one chance.
        try {
            const origin = new URL(ctx.request.url).origin;
            const isCreator = identity?.userId === this.state.metadata.userId;
            const blob = isCreator ? readTokenCookie(ctx.request, this.env) : null;
            const nextToken = blob || this.state.cloudflareToken;
            // wsOrigin is replayed alongside the creator's CF token on usage/billing
            // checks, so only the creator's connection may set it — a member's origin
            // must never overwrite the creator's.
            const nextOrigin = isCreator ? (origin || this.state.wsOrigin) : this.state.wsOrigin;
            if (nextToken !== this.state.cloudflareToken || nextOrigin !== this.state.wsOrigin) {
                this.setState({ ...this.state, cloudflareToken: nextToken, wsOrigin: nextOrigin });
            }
        } catch (error) {
            this.logger().warn('Failed to capture CF token cookie on WS connect', { error });
        }

        // Warm the per-instance template-details cache before reading it.
        // On a cold DO wake-up the cache is empty and `getTemplateDetails()`
        // throws ("Template details not loaded. Call ensureTemplateDetails()
        // first."); without this the AGENT_CONNECTED payload below threw
        // uncaught and crashed the WS upgrade, so the client could never
        // connect. Best-effort: a failure here must not break the handshake.
        try {
            await this.behavior.ensureTemplateDetails();
        } catch (error) {
            this.logger().warn('Failed to load template details on WS connect', { error });
        }

        // Compute the template details + preview URL defensively — even if
        // the cache is still cold, `onConnect` must not throw (else the
        // connection is lost and the client retries forever).
        let templateDetails: TemplateDetails | undefined;
        let previewUrl = '';
        try {
            templateDetails = this.behavior.getTemplateDetails();
            if (templateDetails.renderMode === 'browser') {
                previewUrl = this.behavior.getBrowserPreviewURL();
            }
        } catch (error) {
            this.logger().error('Error getting template details / preview URL:', error);
        }
        sendToConnection(connection, WebSocketMessageResponses.AGENT_CONNECTED, {
            state: this.state,
            templateDetails,
            previewUrl,
        });

        // Announce the updated presence roster (incl. the current driver) to all
        // connected members. Best-effort — a presence failure must never break the
        // just-established connection.
        try {
            broadcastPresence(this);
        } catch (error) {
            this.logger().warn('Failed to broadcast presence on connect', { error });
        }
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
     * `exportProject`) so the `agentStub.pushToGitHub(...)` RPC surface the
     * controller depends on stays stable.
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
            // File under the active org so org members share the app (Phase 2.2.1);
            // createApp falls back to the personal org when this is null.
            orgId: this.state.metadata.orgId ?? null,
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
     */
    async onMessage(connection: Connection, message: string): Promise<void> {
        await handleWebSocketMessage(this, connection, message);
    }

    async onClose(connection: Connection): Promise<void> {
        handleWebSocketClose(this, connection);
    }

    /**
     * SDK error hook (overloaded: `onError(connection, error)` for a socket
     * failure, `onError(error)` for a server-level one).
     *
     * MUST stay SYNCHRONOUS and re-throw server-level errors: the `agents` SDK
     * calls `throw this.onError(e)` in `sql()` and `_tryCatch` (which wraps
     * onStart/onConnect/onMessage/onRequest/RPC), so an async hook — or one that
     * swallows — would surface a *Promise* instead of the real error and starve
     * Sentry of the stack. For a socket failure we instead free the driver seat
     * (an abnormal drop can skip `onClose`; `handlePresenceOnClose` is
     * idempotent, so an error-then-close sequence is harmless) and DON'T throw,
     * so a dead connection can't crash the DO.
     */
    onError(connectionOrError: unknown, error?: unknown): void {
        let connection: Connection;
        try {
            connection = connectionForErrorOrRethrow(connectionOrError);
        } catch (serverError) {
            this.logger().error('Agent server error', { error: serverError });
            throw serverError;
        }
        this.logger().warn('WebSocket connection error', { error });
        try {
            handlePresenceOnClose(this, connection);
        } catch (presenceError) {
            this.logger().warn('Failed to free driver seat on WS error', { presenceError });
        }
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
            await this.git.init();
            // Seed the repo with an initial commit so HEAD exists and there is a
            // baseline to revert to. Idempotent: skipped once any commit exists.
            const head = await this.git.getHead();
            if (!head) {
                const files = this.fileManager.getGeneratedFiles();
                const oid = await this.git.commit(files, 'Initial commit');
                this.logger().info('Git initialized', { initialCommit: oid });
            }
        } catch (error) {
            this.logger().error('Error during git init:', error);
        }
    }

    /**
     * Snapshot the current project as a git-object bundle for export (e.g.
     * /api/github-exporter/push), read straight from the DO-SQLite-backed repo.
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
            const gitObjects = this.git.fs.exportGitObjects();
            const head = await this.git.getHead();
            return {
                gitObjects,
                query: this.state.query || 'N/A',
                hasCommits: head !== null,
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
