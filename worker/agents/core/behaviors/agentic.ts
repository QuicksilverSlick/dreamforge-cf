/**
 * `AgenticCodingBehavior` — LLM-orchestrated open-ended generation
 * behavior, implementing the agentic specialization of
 * `BaseCodingBehavior` (dep-map item 12).
 *
 * Ported from upstream `cloudflare/vibesdk` `worker/agents/core/
 * behaviors/agentic.ts` (393 LoC). M3 slice 2b.16 landed the structural
 * shell; slice 2b.17c made the deliberate decision to keep `build()` a
 * documented stub for the entirety of commit 2b. The full agentic loop
 * (`executeGeneration` + `handleMessageCompletion` +
 * `compactifyIfNeeded`) depends on the fork's
 * `AgenticProjectBuilderOperation` being a real tool-driven
 * implementation; that operation is a no-op stub today (slice 2b.12)
 * and its real port is gated on `AgentOperationWithTools` + the toolkit
 * (M4 territory). Porting the loop against the stub would silently
 * generate nothing, so the explicit throw is preferred.
 *
 * **What this slice delivers:**
 *   - `initialize()` — synthesize project name from the user query,
 *     populate state with a structurally-complete (but minimal)
 *     blueprint, save customized template files when one is present
 *     (single-arg `saveGeneratedFiles`).
 *   - `handleUserInput()` override — queues without AI processing
 *     when a build is in flight; renders a "Message Queued" tool-call
 *     in the conversation UI so the user gets immediate feedback.
 *   - `getOperationOptions()` — fork-shape `OperationOptions` with
 *     `agent: CodingAgentInterface` wrapping this behavior.
 *   - `getLogs(reset?)` — `ICodingAgent` satisfaction; routes through
 *     `getSandboxServiceClient().getLogs(...)`.
 *   - `build()` — DOCUMENTED STUB (slice 2b.17c decision); throws a
 *     clear, actionable error. The factory in `codingAgent.onStart`
 *     can construct this class, but generation routes through
 *     `PhasicCodingBehavior` until M4.
 *
 * **Wiring state.** The behavior factory in `codingAgent.onStart`
 * constructs this class for `behaviorType === 'agentic'`. Until the real
 * `AgenticProjectBuilderOperation` is ported, generation routes through
 * `PhasicCodingBehavior`, so the `build()` throw is never hit in practice.
 *
 * **Adaptations vs upstream:**
 *   - Fork's `Blueprint` schema is strict and has many required
 *     fields; `initialize()` populates a minimal but
 *     structurally-complete blueprint (empty arrays / strings / nested
 *     placeholder objects) so the state type-checks. Real blueprint
 *     synthesis happens during `build()` once the agentic loop is
 *     ported.
 *   - `saveGeneratedFiles(files, commitMessage, hashOnly)` upstream
 *     becomes `saveGeneratedFiles(files)` — fork is single-arg.
 *   - `handleUserInput`'s "Message Queued" broadcast omits the
 *     conversation-id correlation that upstream's `deep_debug` flow
 *     uses — deferred until the deep-debug machinery is ported.
 */

import type { ImageAttachment, ProcessedImageAttachment } from '../../../types/image-attachment';
import { generateNanoId } from '../../../utils/idGenerator';
import { ImageType, uploadImage } from '../../../utils/images';
import { WebSocketMessageResponses } from '../../constants';
import { GenerationContext } from '../../domain/values/GenerationContext';
import { FileRegenerationOperation } from '../../operations/FileRegeneration';
import { FastCodeFixerOperation } from '../../operations/FastCodeFixer';
import { PhaseGenerationOperation } from '../../operations/PhaseGeneration';
import { PhaseImplementationOperation } from '../../operations/PhaseImplementation';
import { SimpleCodeGenerationOperation } from '../../operations/SimpleCodeGeneration';
import { UserConversationProcessor } from '../../operations/UserConversationProcessor';
import type { OperationOptions } from '../../operations/common';
import { CodingAgentInterface } from '../../services/implementations/CodingAgent';
import { ICodingAgent } from '../../services/interfaces/ICodingAgent';
import { customizeTemplateFiles, generateProjectName } from '../../utils/templateCustomizer';
import { IdGenerator } from '../../utils/idGenerator';
import type { AgenticState, PhasicState } from '../state';
import type { AgentInitArgs } from '../types';
import { BaseCodingBehavior, type BaseCodingOperations } from './base';

/**
 * Operations the agentic behavior pre-instantiates. Extends the base
 * bag with phase operations (some agentic builds delegate small
 * sub-tasks to the phase operations via the agentic tool layer).
 */
interface AgenticOperations extends BaseCodingOperations {
    generateNextPhase: PhaseGenerationOperation;
    implementPhase: PhaseImplementationOperation;
}

/**
 * LLM-orchestrated agentic behavior. The full
 * `executeGeneration` loop is deferred to a follow-on slice once
 * `AgenticProjectBuilderOperation` is real (M4).
 */
export class AgenticCodingBehavior
    extends BaseCodingBehavior<AgenticState>
    implements ICodingAgent
{
    protected static readonly PROJECT_NAME_PREFIX_MAX_LENGTH = 20;

    protected operations: AgenticOperations = {
        regenerateFile: new FileRegenerationOperation(),
        fastCodeFixer: new FastCodeFixerOperation(),
        processUserMessage: new UserConversationProcessor(),
        simpleGenerateFiles: new SimpleCodeGenerationOperation(),
        generateNextPhase: new PhaseGenerationOperation(),
        implementPhase: new PhaseImplementationOperation(),
    };

    /**
     * Behavior-typed init: `templateInfo` is optional for agentic
     * (BYOP imports don't have one; the agentic blueprint
     * synthesizer reads the project structure from the analyzed
     * repository instead).
     */
    async initialize(
        initArgs: AgentInitArgs<AgenticState>,
        ..._args: unknown[]
    ): Promise<AgenticState> {
        await super.initialize(initArgs);

        const { query, hostname, inferenceContext, templateInfo, sandboxSessionId } =
            initArgs;

        const packageJson = templateInfo?.templateDetails?.allFiles?.['package.json'] ?? '';

        const baseName = (query ?? 'project').toString();
        const projectName = generateProjectName(
            baseName,
            generateNanoId(),
            AgenticCodingBehavior.PROJECT_NAME_PREFIX_MAX_LENGTH,
        );

        this.logger.info('Generated project name', { projectName });

        // Construct a minimal-but-structurally-complete blueprint so
        // the AgenticState type-checks. Fork's `AgenticBlueprint =
        // Blueprint` is the strict schema (many required fields);
        // real synthesis happens during `build()` once the agentic
        // loop is ported.
        this.setState({
            ...this.state,
            projectName,
            query,
            blueprint: {
                title: baseName,
                projectName,
                detailedDescription: query,
                description: query,
                colorPalette: ['#1e1e1e'],
                views: [],
                userFlow: {
                    uiLayout: '',
                    uiDesign: '',
                    userJourney: '',
                },
                dataFlow: '',
                architecture: { dataFlow: '' },
                pitfalls: [],
                frameworks: [],
                implementationRoadmap: [],
                imageAssets: null,
                initialPhase: {
                    name: '',
                    description: '',
                    files: [],
                    lastPhase: true,
                },
            },
            templateName:
                templateInfo?.templateDetails?.name ??
                (this.projectType === 'general' ? 'scratch' : ''),
            sandboxInstanceId: undefined,
            commandsHistory: [],
            lastPackageJson: packageJson,
            sessionId: sandboxSessionId,
            hostname,
            metadata: inferenceContext,
            projectType: this.projectType,
            behaviorType: 'agentic',
            currentPlan: '',
        });

        if (
            templateInfo &&
            templateInfo.templateDetails.name !== 'scratch' &&
            templateInfo.templateDetails.allFiles
        ) {
            const customizedFiles = customizeTemplateFiles(
                templateInfo.templateDetails.allFiles,
                {
                    projectName,
                    commandsHistory: [],
                },
            );

            this.logger.info('Customized template files', {
                files: Object.keys(customizedFiles),
            });

            const filesToSave = Object.entries(customizedFiles).map(
                ([filePath, content]) => ({
                    filePath,
                    fileContents: content,
                    filePurpose: 'Project configuration file',
                }),
            );

            // Fork's `saveGeneratedFiles` is single-arg; commit
            // message + `hashOnly` flag from upstream are dropped.
            this.fileManager.saveGeneratedFiles(filesToSave);

            this.logger.info('Saved customized template files');

            // Fire-and-forget deploy to bring the sandbox up while
            // the agentic build is being prepared. Upstream pattern.
            void this.deployToSandbox().catch((error) => {
                this.logger.warn('Initial deployToSandbox failed', { error });
            });
        }

        this.logger.info(
            `Agent ${this.getAgentId()} session: ${this.state.sessionId} initialized successfully`,
        );
        return this.state;
    }

    /**
     * Override `handleUserInput` — agentic mode does NOT route
     * follow-up messages through the conversation processor. Instead,
     * messages are queued and consumed by the agentic build loop
     * between tool calls. While a build is running the user gets a
     * "Message Queued" tool-call rendered in the UI so they know the
     * message landed.
     */
    async handleUserInput(userMessage: string, images?: ImageAttachment[]): Promise<void> {
        let processedImages: ProcessedImageAttachment[] | undefined;

        if (images && images.length > 0) {
            processedImages = await Promise.all(
                images.map((image) => uploadImage(this.env, image, ImageType.UPLOADS)),
            );
            this.logger.info('Uploaded images for queued request', {
                imageCount: processedImages.length,
            });
        }

        await this.queueUserRequest(userMessage, processedImages);

        if (this.isCodeGenerating()) {
            this.broadcast(WebSocketMessageResponses.CONVERSATION_RESPONSE, {
                message: '',
                conversationId: IdGenerator.generateConversationId(),
                isStreaming: false,
                tool: {
                    name: 'Message Queued',
                    status: 'success',
                    args: {
                        userMessage,
                        images: processedImages,
                    },
                },
            });
        }

        this.logger.info('User message queued during agentic build', {
            messageLength: userMessage.length,
            queueSize: this.state.pendingUserInputs.length,
            hasImages: !!processedImages && processedImages.length > 0,
        });
    }

    /**
     * Returns the fork-shape `OperationOptions` (non-generic; `agent`
     * is a `CodingAgentInterface` wrapping this behavior via the
     * `ICodingAgent` surface).
     */
    getOperationOptions(): OperationOptions {
        // Fork's `GenerationContext.from` expects `CodeGenState` (a
        // `PhasicState` alias) with a populated `generatedPhases`
        // array. Agentic state doesn't carry phasic-specific fields;
        // narrow through `unknown` here as an M3-transition artifact.
        // GenerationContext only reads BaseProjectState fields +
        // `generatedPhases` (which is treated as an empty list for
        // agentic), so the runtime behavior is correct even though
        // the static type wants the phasic shape.
        const phasicShaped = this.state as unknown as PhasicState;
        const context = GenerationContext.from(phasicShaped, this.logger);
        return {
            env: this.env,
            agentId: this.getAgentId(),
            context,
            logger: this.logger,
            inferenceContext: this.getInferenceContext(),
            agent: new CodingAgentInterface(this),
        };
    }

    // ==========================================
    // ICodingAgent satisfaction
    // ==========================================

    /**
     * Sandbox logs for the LLM `get_logs` tool. Fork's
     * `BaseSandboxService.getLogs(instanceId)` doesn't take the
     * `reset` parameter; it's silently ignored.
     */
    async getLogs(_reset?: boolean): Promise<string> {
        if (!this.state.sandboxInstanceId) {
            throw new Error('Cannot get logs: No sandbox instance available');
        }
        const response = await this.getSandboxServiceClient().getLogs(
            this.state.sandboxInstanceId,
        );
        if (response.success) {
            return `STDOUT: ${response.logs.stdout}\nSTDERR: ${response.logs.stderr}`;
        }
        return `Failed to get logs: ${response.error ?? 'unknown error'}`;
    }

    // ==========================================
    // Generation entry — STUB
    // ==========================================

    /**
     * The agentic LLM-driven generation loop. DOCUMENTED STUB for the
     * entirety of M3 commit 2b — this is the slice 2b.17c decision.
     *
     * The real loop (`executeGeneration` + tool-call conversation sync
     * + `compactifyIfNeeded`) depends on `AgenticProjectBuilderOperation`
     * being a real tool-driven operation. The fork has only the no-op
     * stub from slice 2b.12, and a real port requires
     * `AgentOperationWithTools` + `tools/toolkit/*`, which is M4
     * territory. Porting an agentic `build()` against the stub operation
     * would produce a loop that silently generates nothing, which is
     * worse than an explicit throw.
     *
     * Until M4 lands the real operation, the behavior factory in
     * `codingAgent.onStart` only ever routes to `PhasicCodingBehavior`
     * (the live agentic path post-commit-4), so this throw is never hit
     * in practice. It exists so the abstract `build()` contract is
     * satisfied and any premature `behaviorType === 'agentic'` routing
     * surfaces a clear, actionable error rather than a silent no-op.
     */
    async build(): Promise<void> {
        throw new Error(
            'AgenticCodingBehavior.build: agentic loop intentionally deferred ' +
                'past M3 commit 2b (slice 2b.17c decision). The executeGeneration ' +
                'loop + handleMessageCompletion + compactifyIfNeeded require a real ' +
                'AgenticProjectBuilderOperation (AgentOperationWithTools + ' +
                'tools/toolkit/*), which is M4 territory; the fork has only the ' +
                'slice 2b.12 no-op stub. Generation routes through ' +
                'PhasicCodingBehavior until M4 ports the real operation.',
        );
    }
}
