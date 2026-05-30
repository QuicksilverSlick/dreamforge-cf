/**
 * `PhasicCodingBehavior` — deterministic phase-by-phase generation
 * behavior, implementing the phasic specialization of
 * `BaseCodingBehavior` (dep-map item 11).
 *
 * Ported from upstream `cloudflare/vibesdk` `worker/agents/core/
 * behaviors/phasic.ts` (728 LoC). M3 slice 2b.16 landed the structural
 * shell; slice 2b.17b lands the real phase state machine
 * (`launchStateMachine` / `executePhaseGeneration` /
 * `executePhaseImplementation` / `executeReviewCycle` /
 * `executeFinalizing` / `generateNextPhase` / `implementPhase` /
 * `applyFastSmartCodeFixes`), consuming the `BaseCodingBehavior`
 * execution helpers from slice 2b.17a (`fetchAllIssues`,
 * `executeCommands`, `deleteFiles`, `runStaticAnalysisCode`,
 * `applyDeterministicCodeFixes`) and the pre-deploy safety gate from
 * slice 2b.18. `simpleGeneratorAgent.ts` remains the live runtime path
 * until M3 commit 4.
 *
 * **What this slice delivers:**
 *   - `initialize()` — generate blueprint via `generateBlueprint`,
 *     synthesize `projectName`, populate state, save customized
 *     template files to git (single-arg `saveGeneratedFiles` —
 *     fork's signature).
 *   - `migrateStateIfNeeded()` — invoke `StateMigration.migratePhasic`
 *     and re-customize `package.json` if it was overwritten.
 *   - `getOperationOptions()` — return the fork's non-generic
 *     `OperationOptions` shape with `agent: CodingAgentInterface`
 *     wrapping this behavior.
 *   - `getLogs(reset?)` — `ICodingAgent` satisfaction; routes through
 *     `getSandboxServiceClient().getLogs(...)`.
 *   - `getPhasesCounter` / `rechargePhasesCounter` /
 *     `decrementPhasesCounter` — phase-budget accounting driving the
 *     state machine.
 *   - `queueUserRequest` override — calls `rechargePhasesCounter(3)`
 *     so user follow-ups get fresh phase budget.
 *   - `getTotalFiles` override — accounts for in-flight `currentPhase`
 *     files when reporting progress.
 *   - `build()` — drives `launchStateMachine`: the PHASE_GENERATING →
 *     PHASE_IMPLEMENTING → REVIEWING → FINALIZING loop that generates
 *     phases, implements them (with the pre-deploy safety gate +
 *     deterministic/fast-smart fixes), and surfaces a deep-debug prompt
 *     if issues remain.
 *
 * **Wiring state.** Slice 2b.16 wires the behavior factory in
 * `codingAgent.onStart` to construct this class for `behaviorType ===
 * 'phasic'`. `build()` is now functional, but the live runtime path
 * remains `SimpleCodeGeneratorAgent` until M3 commit 4 flips the
 * `CodeGenObject` binding.
 *
 * **Adaptations vs upstream:**
 *   - `generateBlueprint` does NOT accept `projectType` (fork's
 *     args shape doesn't have it); the field is dropped from the
 *     call.
 *   - `fileManager.saveGeneratedFiles(files, commitMessage, hashOnly)`
 *     in upstream becomes `fileManager.saveGeneratedFiles(files)` —
 *     fork's signature is single-arg. The commit message + hash-only
 *     flag are lost (git is stubbed on the fork anyway; cleanup lands
 *     when the wider `IFileManager` is rebased).
 *   - `runPreDeploySafetyGate` (item 5, slice 2b.18) is called over the
 *     phase's generated files inside `implementPhase` before deploy.
 *   - `generateNextPhase` does NOT forward `isFinal` to the operation —
 *     the fork's `PhaseGenerationInputs` has no such field; `isFinal`
 *     only shapes the broadcast message.
 *   - `applyFastSmartCodeFixes` uses the fork's `getAllFiles()` (no
 *     `getAllRelevantFiles`).
 *   - `initialize()` fires `initializeAsync()` (sandbox deploy +
 *     setup-command prediction/execution + README generation) in the
 *     background, matching upstream — landed once `executeCommands`
 *     (2b.17a) and `generateReadme` (commit 3) were available.
 */

import type { ImageAttachment, ProcessedImageAttachment } from '../../../types/image-attachment';
import type { StaticAnalysisResponse } from '../../../services/sandbox/sandboxTypes';
import { generateNanoId } from '../../../utils/idGenerator';
import type {
    FileOutputType,
    PhaseConceptType,
    PhaseConceptGenerationSchemaType,
    PhaseImplementationSchemaType,
} from '../../schemas';
import { WebSocketMessageResponses } from '../../constants';
import { GenerationContext } from '../../domain/values/GenerationContext';
import { IssueReport } from '../../domain/values/IssueReport';
import { generateBlueprint } from '../../planning/blueprint';
import { FileRegenerationOperation } from '../../operations/FileRegeneration';
import { FastCodeFixerOperation } from '../../operations/FastCodeFixer';
import { PhaseGenerationOperation } from '../../operations/PhaseGeneration';
import { PhaseImplementationOperation } from '../../operations/PhaseImplementation';
import { SimpleCodeGenerationOperation } from '../../operations/SimpleCodeGeneration';
import { UserConversationProcessor } from '../../operations/UserConversationProcessor';
import type { OperationOptions } from '../../operations/common';
import type { ConversationMessage } from '../../inferutils/common';
import { CodingAgentInterface } from '../../services/implementations/CodingAgent';
import { ICodingAgent } from '../../services/interfaces/ICodingAgent';
import {
    customizePackageJson,
    customizeTemplateFiles,
    generateProjectName,
} from '../../utils/templateCustomizer';
import { IdGenerator } from '../../utils/idGenerator';
import { runPreDeploySafetyGate } from '../../utils/preDeploySafetyGate';
import { CurrentDevState, MAX_PHASES, type PhasicState } from '../state';
import type {
    AgentInitArgs,
    AllIssues,
    PhaseExecutionResult,
    UserContext,
} from '../types';
import { StateMigration } from '../stateMigration';
import { RateLimitExceededError } from 'shared/types/errors';
import { BaseCodingBehavior, type BaseCodingOperations } from './base';

/**
 * Operations the phasic behavior pre-instantiates. Extends the base
 * bag with phase-generation + phase-implementation operations.
 */
interface PhasicOperations extends BaseCodingOperations {
    generateNextPhase: PhaseGenerationOperation;
    implementPhase: PhaseImplementationOperation;
}

/**
 * Deterministically-orchestrated phasic behavior. Subclasses are not
 * expected — phasic generation is a single concrete strategy.
 */
export class PhasicCodingBehavior
    extends BaseCodingBehavior<PhasicState>
    implements ICodingAgent
{
    protected static readonly PROJECT_NAME_PREFIX_MAX_LENGTH = 20;

    protected operations: PhasicOperations = {
        regenerateFile: new FileRegenerationOperation(),
        fastCodeFixer: new FastCodeFixerOperation(),
        processUserMessage: new UserConversationProcessor(),
        simpleGenerateFiles: new SimpleCodeGenerationOperation(),
        generateNextPhase: new PhaseGenerationOperation(),
        implementPhase: new PhaseImplementationOperation(),
    };

    /**
     * Behavior-typed init: requires `templateInfo.templateDetails`
     * (phasic generation seeds its blueprint from the resolved
     * template).
     */
    async initialize(
        initArgs: AgentInitArgs<PhasicState>,
        ..._args: unknown[]
    ): Promise<PhasicState> {
        await super.initialize(initArgs);

        const { templateInfo } = initArgs;
        if (!templateInfo || !templateInfo.templateDetails) {
            throw new Error('Phasic initialization requires templateInfo.templateDetails');
        }

        const {
            query,
            language,
            frameworks,
            hostname,
            inferenceContext,
            sandboxSessionId,
        } = initArgs;

        this.logger.info('Generating blueprint', {
            query,
            queryLength: query.length,
            imagesCount: initArgs.images?.length ?? 0,
        });
        this.logger.info(
            `Using language: ${language ?? '<unset>'}, frameworks: ${
                frameworks ? frameworks.join(', ') : 'none'
            }`,
        );

        // Fork's `generateBlueprint` requires `language` + `frameworks`
        // (no defaults). Upstream allows them via the optional fields
        // on `BaseAgentInitArgs`; we coerce here to avoid a runtime
        // explosion if the controller forgot to pass them.
        const blueprint = await generateBlueprint({
            env: this.env,
            inferenceContext,
            query,
            language: language ?? '',
            frameworks: frameworks ?? [],
            templateDetails: templateInfo.templateDetails,
            templateMetaInfo: templateInfo.selection,
            images: initArgs.images,
            stream: {
                chunk_size: 256,
                onChunk: (chunk) => {
                    initArgs.onBlueprintChunk(chunk);
                },
            },
        });

        const packageJson = templateInfo.templateDetails.allFiles?.['package.json'] ?? '';

        const projectName = generateProjectName(
            blueprint?.projectName || templateInfo.templateDetails.name || '',
            generateNanoId(),
            PhasicCodingBehavior.PROJECT_NAME_PREFIX_MAX_LENGTH,
        );

        this.logger.info('Generated project name', { projectName });

        const nextState: PhasicState = {
            ...this.state,
            projectName,
            query,
            blueprint,
            templateName: templateInfo.templateDetails.name,
            sandboxInstanceId: undefined,
            generatedPhases: [],
            commandsHistory: [],
            lastPackageJson: packageJson,
            sessionId: sandboxSessionId,
            hostname,
            metadata: inferenceContext,
            projectType: this.projectType,
            behaviorType: 'phasic',
        };
        this.setState(nextState);

        // Customize the bootstrap config files (`package.json`,
        // `wrangler.jsonc`, `.bootstrap.js`, `.gitignore`) for this
        // project. `allFiles` is optional on the fork's TemplateDetails
        // schema; defend.
        if (templateInfo.templateDetails.allFiles) {
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

            // Fork's `saveGeneratedFiles` is single-arg; the upstream
            // commit message and `hashOnly` flag are dropped (git is
            // stubbed on the fork).
            this.fileManager.saveGeneratedFiles(filesToSave);

            this.logger.info('Saved customized template files');
        }

        // Kick off async initialization (sandbox deploy + setup
        // commands + README) in the background — fire-and-forget so the
        // controller's initialize() resolves promptly. Errors are
        // surfaced via broadcastError.
        this.initializeAsync().catch((error: unknown) => {
            this.broadcastError('Initialization failed', error);
        });

        this.logger.info(
            `Agent ${this.getAgentId()} session: ${this.state.sessionId} initialized successfully`,
        );
        return this.state;
    }

    /**
     * Phasic-specific state migrations. Runs `StateMigration.migratePhasic`
     * and re-customizes `package.json` if a previous build overwrote it.
     */
    migrateStateIfNeeded(): void {
        const migratedState = StateMigration.migratePhasic(this.state, this.logger);
        if (migratedState) {
            this.setState(migratedState as PhasicState);
        }

        const oldPackageJson =
            this.fileManager.getFile('package.json')?.fileContents ??
            this.state.lastPackageJson;
        if (oldPackageJson) {
            const packageJson = customizePackageJson(oldPackageJson, this.state.projectName);
            this.fileManager.saveGeneratedFiles([
                {
                    filePath: 'package.json',
                    fileContents: packageJson,
                    filePurpose: 'Project configuration file',
                },
            ]);
        }
    }

    /**
     * Returns the fork-shape `OperationOptions` (non-generic; `agent`
     * is a `CodingAgentInterface` wrapping this behavior via the
     * `ICodingAgent` surface).
     */
    getOperationOptions(): OperationOptions {
        const context = GenerationContext.from(this.state, this.logger);
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
     * Sandbox logs for the LLM `get_logs` tool. The fork's
     * `BaseSandboxService.getLogs(instanceId)` doesn't take the
     * `reset` / `durationSeconds` parameters upstream uses — they're
     * silently ignored here. Output shape matches upstream's
     * `STDOUT: ... \nSTDERR: ...` template.
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
    // Phase-budget accounting
    // ==========================================

    rechargePhasesCounter(max_phases: number = MAX_PHASES): void {
        if (this.getPhasesCounter() <= max_phases) {
            this.setState({
                ...this.state,
                phasesCounter: max_phases,
            });
        }
    }

    decrementPhasesCounter(): number {
        const counter = this.getPhasesCounter() - 1;
        this.setState({
            ...this.state,
            phasesCounter: counter,
        });
        return counter;
    }

    getPhasesCounter(): number {
        return this.state.phasesCounter;
    }

    // ==========================================
    // Overrides
    // ==========================================

    /**
     * Override of base `queueUserRequest` that tops up the phase
     * counter — fresh user input deserves fresh phase budget so the
     * agent doesn't refuse to act because it already ran through its
     * MAX_PHASES allotment on the initial build.
     */
    async queueUserRequest(
        request: string,
        images?: ProcessedImageAttachment[],
    ): Promise<void> {
        this.rechargePhasesCounter(3);
        await super.queueUserRequest(request, images);
    }

    /**
     * Override `getTotalFiles` to account for in-flight `currentPhase`
     * files: progress UI sums concrete generated files plus the
     * declared file list for whichever phase is currently being
     * worked on (falling back to the blueprint's initial phase if no
     * phase has started yet).
     */
    getTotalFiles(): number {
        return (
            this.fileManager.getGeneratedFilePaths().length +
            ((this.state.currentPhase ?? this.state.blueprint.initialPhase)?.files
                ?.length ?? 0)
        );
    }

    /**
     * Override of base `handleUserInput` — phasic delegates to the
     * base implementation (which drives `UserConversationProcessor`).
     * The override exists to mirror upstream's structure; behaviors
     * may grow phasic-specific input handling in later commits.
     */
    async handleUserInput(userMessage: string, images?: ImageAttachment[]): Promise<void> {
        await super.handleUserInput(userMessage, images);
    }

    // ==========================================
    // Phase bookkeeping helpers
    // ==========================================

    private createNewIncompletePhase(phaseConcept: PhaseConceptType): void {
        this.setState({
            ...this.state,
            generatedPhases: [
                ...this.state.generatedPhases,
                {
                    ...phaseConcept,
                    completed: false,
                },
            ],
        });

        this.logger.info(
            'Created new incomplete phase:',
            JSON.stringify(this.state.generatedPhases, null, 2),
        );
    }

    private markPhaseComplete(phaseName: string): void {
        const phases = this.state.generatedPhases;
        if (!phases.some((p) => p.name === phaseName)) {
            this.logger.warn(`Phase ${phaseName} not found in generatedPhases array, skipping save`);
            return;
        }

        this.setState({
            ...this.state,
            generatedPhases: phases.map((p) =>
                p.name === phaseName ? { ...p, completed: true } : p,
            ),
        });

        this.logger.info('Completed phases:', JSON.stringify(phases, null, 2));
    }

    // ==========================================
    // Generation entry — phase state machine
    // ==========================================

    /**
     * The phase state-machine driver. Ported from upstream
     * `behaviors/phasic.ts` (slice 2b.17b). Consumes the
     * `BaseCodingBehavior` execution helpers landed in slice 2b.17a
     * (`fetchAllIssues`, `executeCommands`, `deleteFiles`,
     * `runStaticAnalysisCode`, `applyDeterministicCodeFixes`) and the
     * pre-deploy safety gate from slice 2b.18. `simpleGeneratorAgent.ts`
     * remains the live runtime path until M3 commit 4.
     */
    async build(): Promise<void> {
        await this.launchStateMachine();
    }

    private async launchStateMachine(): Promise<void> {
        this.logger.info('Launching state machine');

        let currentDevState = CurrentDevState.PHASE_IMPLEMENTING;
        const generatedPhases = this.state.generatedPhases;
        const incompletedPhases = generatedPhases.filter((phase) => !phase.completed);
        let phaseConcept: PhaseConceptType | undefined;
        if (incompletedPhases.length > 0) {
            phaseConcept = incompletedPhases[incompletedPhases.length - 1];
            this.logger.info('Resuming code generation from incompleted phase', {
                phase: phaseConcept,
            });
        } else if (generatedPhases.length > 0) {
            currentDevState = CurrentDevState.PHASE_GENERATING;
            this.logger.info('Resuming code generation after generating all phases', {
                phase: generatedPhases[generatedPhases.length - 1],
            });
        } else {
            phaseConcept = this.state.blueprint.initialPhase;
            this.logger.info('Starting code generation from initial phase', {
                phase: phaseConcept,
            });
            this.createNewIncompletePhase(phaseConcept);
        }

        let userContext: UserContext | undefined;

        try {
            let executionResults: PhaseExecutionResult;
            while (currentDevState !== CurrentDevState.IDLE) {
                this.logger.info(`[launchStateMachine] Executing state: ${currentDevState}`);
                switch (currentDevState) {
                    case CurrentDevState.PHASE_GENERATING:
                        executionResults = await this.executePhaseGeneration();
                        currentDevState = executionResults.currentDevState;
                        phaseConcept = executionResults.result;
                        userContext = executionResults.userContext;
                        break;
                    case CurrentDevState.PHASE_IMPLEMENTING:
                        executionResults = await this.executePhaseImplementation(phaseConcept, userContext);
                        currentDevState = executionResults.currentDevState;
                        userContext = undefined;
                        break;
                    case CurrentDevState.REVIEWING:
                        currentDevState = await this.executeReviewCycle();
                        break;
                    case CurrentDevState.FINALIZING:
                        currentDevState = await this.executeFinalizing();
                        break;
                    default:
                        break;
                }
            }

            this.logger.info('State machine completed successfully');
        } catch (error) {
            this.logger.error('Error in state machine:', error);
        }
    }

    /**
     * Execute phase generation state — generate next phase with user suggestions.
     */
    async executePhaseGeneration(isFinal?: boolean): Promise<PhaseExecutionResult> {
        this.logger.info('Executing PHASE_GENERATING state');
        try {
            const currentIssues = await this.fetchAllIssues();

            const pendingUserInputs = this.fetchPendingUserRequests();
            const userContext: UserContext | undefined =
                pendingUserInputs.length > 0
                    ? {
                          suggestions: pendingUserInputs,
                          images: this.pendingUserImages,
                      }
                    : undefined;

            if (userContext?.suggestions && userContext.suggestions.length > 0) {
                this.logger.info('Resetting pending user inputs', {
                    userSuggestions: userContext.suggestions,
                    hasImages: !!userContext.images,
                    imageCount: userContext.images?.length ?? 0,
                });

                if (userContext.images && userContext.images.length > 0) {
                    this.logger.info('Clearing stored user images after passing to phase generation');
                    this.pendingUserImages = [];
                }
            }

            const nextPhase = await this.generateNextPhase(currentIssues, userContext, isFinal);

            if (!nextPhase) {
                this.logger.info('No more phases to implement, transitioning to FINALIZING');
                return {
                    currentDevState: CurrentDevState.FINALIZING,
                };
            }

            this.setState({
                ...this.state,
                currentPhase: nextPhase,
            });

            return {
                currentDevState: CurrentDevState.PHASE_IMPLEMENTING,
                result: nextPhase,
                userContext,
            };
        } catch (error) {
            if (error instanceof RateLimitExceededError) {
                throw error;
            }
            this.broadcastError('Error generating phase', error);
            return {
                currentDevState: CurrentDevState.IDLE,
            };
        }
    }

    /**
     * Execute phase implementation state — implement the current phase.
     */
    async executePhaseImplementation(
        phaseConcept?: PhaseConceptType,
        userContext?: UserContext,
    ): Promise<{ currentDevState: CurrentDevState; staticAnalysis?: StaticAnalysisResponse }> {
        try {
            this.logger.info('Executing PHASE_IMPLEMENTING state');

            if (phaseConcept === undefined) {
                phaseConcept = this.state.currentPhase;
                if (phaseConcept === undefined) {
                    this.logger.error('No phase concept provided to implement, will call phase generation');
                    const results = await this.executePhaseGeneration();
                    phaseConcept = results.result;
                    if (phaseConcept === undefined) {
                        this.logger.error('No phase concept provided to implement, will return');
                        return { currentDevState: CurrentDevState.FINALIZING };
                    }
                }
            }

            this.setState({
                ...this.state,
                currentPhase: undefined,
            });

            const currentIssues = await this.fetchAllIssues(true);

            await this.implementPhase(phaseConcept, currentIssues, userContext);

            this.logger.info(`Phase ${phaseConcept.name} completed, generating next phase`);

            const phasesCounter = this.decrementPhasesCounter();

            if (
                (phaseConcept.lastPhase || phasesCounter <= 0) &&
                this.state.pendingUserInputs.length === 0
            ) {
                return { currentDevState: CurrentDevState.FINALIZING };
            }
            return { currentDevState: CurrentDevState.PHASE_GENERATING };
        } catch (error) {
            this.logger.error('Error implementing phase', error);
            if (error instanceof RateLimitExceededError) {
                throw error;
            }
            return { currentDevState: CurrentDevState.IDLE };
        }
    }

    /**
     * Execute review cycle state — prompt the user to launch deep-debug
     * if issues remain. Mirrors upstream: the conversational deep-debug
     * tool drives any fixes, so this stage only surfaces the prompt.
     */
    async executeReviewCycle(): Promise<CurrentDevState> {
        this.logger.info('Executing REVIEWING state - review and cleanup');
        if (this.state.reviewingInitiated) {
            this.logger.info('Reviewing already initiated, skipping');
            return CurrentDevState.IDLE;
        }
        this.setState({
            ...this.state,
            reviewingInitiated: true,
        });

        const issues = await this.fetchAllIssues(false);
        if (issues.runtimeErrors.length > 0 || issues.staticAnalysis.typecheck.issues.length > 0) {
            this.logger.info('Reviewing stage - issues found, prompting user to review and cleanup');
            const message: ConversationMessage = {
                role: 'assistant',
                content:
                    `<system_context>If the user responds with yes, launch the 'deep_debug' tool with the prompt to fix all the issues in the app</system_context>\n` +
                    `There might be some bugs in the app. Do you want me to try to fix them?`,
                conversationId: IdGenerator.generateConversationId(),
            };
            this.infrastructure.addConversationMessage(message);

            this.broadcast(WebSocketMessageResponses.CONVERSATION_RESPONSE, {
                message: message.content,
                conversationId: message.conversationId,
                isStreaming: false,
            });
        }

        return CurrentDevState.IDLE;
    }

    /**
     * Execute finalizing state — final review and cleanup (runs once).
     * Ported verbatim from upstream, including its `setMVPGenerated()`
     * guard semantics.
     */
    async executeFinalizing(): Promise<CurrentDevState> {
        this.logger.info('Executing FINALIZING state - final review and cleanup');

        if (this.setMVPGenerated()) {
            this.logger.info('Finalizing stage already done');
            return CurrentDevState.REVIEWING;
        }

        const { result: phaseConcept, userContext } = await this.executePhaseGeneration(true);
        if (!phaseConcept) {
            this.logger.warn('Phase concept not generated, skipping final review');
            return CurrentDevState.REVIEWING;
        }

        await this.executePhaseImplementation(phaseConcept, userContext);

        const numFilesGenerated = this.fileManager.getGeneratedFilePaths().length;
        this.logger.info(
            `Finalization complete. Generated ${numFilesGenerated}/${this.getTotalFiles()} files.`,
        );

        return CurrentDevState.REVIEWING;
    }

    /**
     * Generate the next phase with user context (suggestions and images).
     * `isFinal` only shapes the broadcast message — the fork's
     * `PhaseGenerationInputs` has no `isFinal` field, so it is not
     * forwarded to the operation.
     */
    async generateNextPhase(
        currentIssues: AllIssues,
        userContext?: UserContext,
        isFinal?: boolean,
    ): Promise<PhaseConceptGenerationSchemaType | undefined> {
        const issues = IssueReport.from(currentIssues);

        let notificationMsg = 'Generating next phase';
        if (isFinal) {
            notificationMsg = 'Generating final phase';
        }
        if (userContext?.suggestions && userContext.suggestions.length > 0) {
            notificationMsg = `Generating next phase incorporating ${userContext.suggestions.length} user suggestion(s)`;
        }
        if (userContext?.images && userContext.images.length > 0) {
            notificationMsg += ` with ${userContext.images.length} image(s)`;
        }

        this.broadcast(WebSocketMessageResponses.PHASE_GENERATING, {
            message: notificationMsg,
            issues,
            userSuggestions: userContext?.suggestions,
        });

        const result = await this.operations.generateNextPhase.execute(
            {
                issues,
                userContext,
                isUserSuggestedPhase:
                    userContext?.suggestions &&
                    userContext.suggestions.length > 0 &&
                    this.state.mvpGenerated,
            },
            this.getOperationOptions(),
        );

        if (result.installCommands && result.installCommands.length > 0) {
            this.executeCommands(result.installCommands);
        }

        const filesToDelete = result.files.filter(
            (f) => f.changes?.toLowerCase().trim() === 'delete',
        );
        if (filesToDelete.length > 0) {
            this.logger.info(
                `Deleting ${filesToDelete.length} files: ${filesToDelete.map((f) => f.path).join(', ')}`,
            );
            this.deleteFiles(filesToDelete.map((f) => f.path));
        }

        if (result.files.length === 0) {
            this.logger.info('No files generated for next phase');
            this.broadcast(WebSocketMessageResponses.PHASE_GENERATED, {
                message: 'No files generated for next phase',
                phase: undefined,
            });
            return undefined;
        }

        this.createNewIncompletePhase(result);
        this.broadcast(WebSocketMessageResponses.PHASE_GENERATED, {
            message: `Generated next phase: ${result.name}`,
            phase: result,
        });

        return result;
    }

    /**
     * Implement a single phase of code generation. Streams file
     * generation with real-time updates, runs the pre-deploy safety
     * gate (slice 2b.18) over the produced files, deploys to the
     * sandbox, then applies deterministic + optional fast-smart fixes.
     */
    async implementPhase(
        phase: PhaseConceptType,
        currentIssues: AllIssues,
        userContext?: UserContext,
        streamChunks: boolean = true,
        postPhaseFixing: boolean = true,
    ): Promise<PhaseImplementationSchemaType> {
        const issues = IssueReport.from(currentIssues);

        const implementationMsg =
            userContext?.suggestions && userContext.suggestions.length > 0
                ? `Implementing phase: ${phase.name} with ${userContext.suggestions.length} user suggestion(s)`
                : `Implementing phase: ${phase.name}`;
        const msgWithImages =
            userContext?.images && userContext.images.length > 0
                ? `${implementationMsg} and ${userContext.images.length} image(s)`
                : implementationMsg;

        this.broadcast(WebSocketMessageResponses.PHASE_IMPLEMENTING, {
            message: msgWithImages,
            phase,
            issues,
        });

        const result = await this.operations.implementPhase.execute(
            {
                phase,
                issues,
                isFirstPhase: this.state.generatedPhases.filter((p) => p.completed).length === 0,
                fileGeneratingCallback: (filePath: string, filePurpose: string) => {
                    this.broadcast(WebSocketMessageResponses.FILE_GENERATING, {
                        message: `Generating file: ${filePath}`,
                        filePath,
                        filePurpose,
                    });
                },
                userContext,
                shouldAutoFix: this.getInferenceContext().enableRealtimeCodeFix,
                fileChunkGeneratedCallback: streamChunks
                    ? (filePath: string, chunk: string, format: 'full_content' | 'unified_diff') => {
                          this.broadcast(WebSocketMessageResponses.FILE_CHUNK_GENERATED, {
                              message: `Generating file: ${filePath}`,
                              filePath,
                              chunk,
                              format,
                          });
                      }
                    : (_filePath: string, _chunk: string, _format: 'full_content' | 'unified_diff') => {},
                fileClosedCallback: (file: FileOutputType, message: string) => {
                    this.broadcast(WebSocketMessageResponses.FILE_GENERATED, {
                        message,
                        file,
                    });
                },
            },
            this.getOperationOptions(),
        );

        this.broadcast(WebSocketMessageResponses.PHASE_VALIDATING, {
            message: `Validating files for phase: ${phase.name}`,
            phase,
        });

        const finalFiles = await Promise.allSettled(result.fixedFilePromises).then(
            (results: PromiseSettledResult<FileOutputType>[]) =>
                results
                    .map((r) => (r.status === 'fulfilled' ? r.value : null))
                    .filter((f): f is FileOutputType => f !== null),
        );

        const safeFiles = await runPreDeploySafetyGate({
            files: finalFiles,
            env: this.env,
            inferenceContext: this.getInferenceContext(),
            query: this.state.query,
            template: this.getTemplateDetails(),
            phase,
        });

        this.fileManager.saveGeneratedFiles(safeFiles);

        this.logger.info(
            'Files generated for phase:',
            phase.name,
            safeFiles.map((f) => f.filePath),
        );

        if (result.commands && result.commands.length > 0) {
            this.logger.info('Phase implementation suggested install commands:', result.commands);
            await this.executeCommands(result.commands, false);
        }

        if (safeFiles.length > 0) {
            await this.deployToSandbox(safeFiles, false, phase.name, true);
            if (postPhaseFixing) {
                await this.applyDeterministicCodeFixes();
                if (this.getInferenceContext().enableFastSmartCodeFix) {
                    await this.applyFastSmartCodeFixes();
                }
            }
        }

        this.broadcast(WebSocketMessageResponses.PHASE_VALIDATED, {
            message: `Files validated for phase: ${phase.name}`,
            phase,
        });

        this.logger.info(`Validation complete for phase: ${phase.name}`);

        this.broadcast(WebSocketMessageResponses.PHASE_IMPLEMENTED, {
            phase: {
                name: phase.name,
                files: safeFiles.map((f) => ({
                    path: f.filePath,
                    purpose: f.filePurpose,
                    contents: f.fileContents,
                })),
                description: phase.description,
            },
            message: 'Files generated successfully for phase',
        });

        this.markPhaseComplete(phase.name);

        return {
            files: safeFiles,
            deploymentNeeded: result.deploymentNeeded,
            commands: result.commands,
        };
    }

    /**
     * Apply fast, AI-driven "smart" code fixes after a phase deploys —
     * lints via static analysis, then runs the `fastCodeFixer`
     * operation over the surfaced issues. Uses the fork's
     * `getAllFiles()` (no `getAllRelevantFiles`).
     */
    private async applyFastSmartCodeFixes(): Promise<void> {
        try {
            this.logger.info('Applying fast smart code fixes');
            const staticAnalysis = await this.runStaticAnalysisCode();
            if (staticAnalysis.typecheck.issues.length + staticAnalysis.lint.issues.length === 0) {
                this.logger.info('No issues found, skipping fast smart code fixes');
                return;
            }
            const issues = staticAnalysis.typecheck.issues.concat(staticAnalysis.lint.issues);
            const allFiles = this.fileManager.getAllFiles();

            const fastCodeFixer = await this.operations.fastCodeFixer.execute(
                {
                    query: this.state.query,
                    issues,
                    allFiles,
                },
                this.getOperationOptions(),
            );

            if (fastCodeFixer.length > 0) {
                this.fileManager.saveGeneratedFiles(fastCodeFixer);
                await this.deployToSandbox(fastCodeFixer);
                this.logger.info('Fast smart code fixes applied successfully');
            }
        } catch (error) {
            this.broadcastError('Failed to apply fast smart code fixes', error);
        }
    }
}
