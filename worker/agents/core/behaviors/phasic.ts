/**
 * `PhasicCodingBehavior` — deterministic phase-by-phase generation
 * behavior, implementing the phasic specialization of
 * `BaseCodingBehavior` (dep-map item 11).
 *
 * Ported from upstream `cloudflare/vibesdk` `worker/agents/core/
 * behaviors/phasic.ts` (728 LoC). M3 slice 2b.16 (sub-slice C) lands
 * the STRUCTURAL port — the abstract `build()` is a thin
 * "not-yet-ported" stub. The full phase state machine
 * (`launchStateMachine` / `executePhaseGeneration` /
 * `executePhaseImplementation` / `executeReviewCycle` /
 * `executeFinalizing` / `generateNextPhase` / `implementPhase` /
 * `fetchAllIssues` / `applyFastSmartCodeFixes`) lands in a follow-on
 * slice once the wider helper surface (`executeCommands`,
 * `saveExecutedCommands`, `syncPackageJsonFromSandbox`,
 * `runStaticAnalysisCode`, `applyDeterministicCodeFixes`, file
 * regeneration, deep-debug, pre-deploy safety gate item 5) lands on
 * `BaseCodingBehavior`.
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
 *     `decrementPhasesCounter` — phase-budget accounting used by the
 *     state machine in the follow-on slice.
 *   - `queueUserRequest` override — calls `rechargePhasesCounter(3)`
 *     so user follow-ups get fresh phase budget.
 *   - `getTotalFiles` override — accounts for in-flight `currentPhase`
 *     files when reporting progress.
 *   - `build()` — STUB; throws with a clear "not yet ported" marker
 *     so the behavior factory can be wired in `codingAgent.onStart`
 *     without the runtime claiming functionality it doesn't yet
 *     supply. The throw moves from `codingAgent.onStart` (where it
 *     lived in slices 2b.13–2b.15) to here.
 *
 * **Wiring state.** Slice 2b.16 wires the behavior factory in
 * `codingAgent.onStart` to construct this class for `behaviorType ===
 * 'phasic'`. The throw in `build()` means the new
 * `CodeGeneratorAgent` cannot complete a generation yet; the live
 * runtime path remains `SimpleCodeGeneratorAgent` until M3 commit 4.
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
 *   - `runPreDeploySafetyGate` (item 5) landed in slice 2b.18 at
 *     `worker/agents/utils/preDeploySafetyGate.ts`; the
 *     `implementPhase` path that calls it is still in the deferred
 *     state-machine block (slice 2b.17).
 *   - `initializeAsync()` is omitted from this slice — depends on
 *     `executeCommands` + `generateReadme` (deferred).
 */

import type { ImageAttachment, ProcessedImageAttachment } from '../../../types/image-attachment';
import { generateNanoId } from '../../../utils/idGenerator';
import { GenerationContext } from '../../domain/values/GenerationContext';
import { generateBlueprint } from '../../planning/blueprint';
import { FileRegenerationOperation } from '../../operations/FileRegeneration';
import { FastCodeFixerOperation } from '../../operations/FastCodeFixer';
import { PhaseGenerationOperation } from '../../operations/PhaseGeneration';
import { PhaseImplementationOperation } from '../../operations/PhaseImplementation';
import { SimpleCodeGenerationOperation } from '../../operations/SimpleCodeGeneration';
import { UserConversationProcessor } from '../../operations/UserConversationProcessor';
import type { OperationOptions } from '../../operations/common';
import { CodingAgentInterface } from '../../services/implementations/CodingAgent';
import { ICodingAgent } from '../../services/interfaces/ICodingAgent';
import {
    customizePackageJson,
    customizeTemplateFiles,
    generateProjectName,
} from '../../utils/templateCustomizer';
import { MAX_PHASES, type PhasicState } from '../state';
import type { AgentInitArgs } from '../types';
import { StateMigration } from '../stateMigration';
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

        // `initializeAsync()` (upstream) — kicks off
        // `deployToSandbox` + `executeCommands(setupCommands)` +
        // `generateReadme` in parallel. Deferred to the follow-on
        // slice that lands `executeCommands` on `BaseCodingBehavior`.

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
    // Generation entry — STUB
    // ==========================================

    /**
     * The phase state-machine driver. STUB until the follow-on slice
     * lands `launchStateMachine` + the four `execute*` phase methods
     * plus the helpers they need (`fetchAllIssues`, `generateNextPhase`,
     * `implementPhase`, `applyFastSmartCodeFixes`, the deferred
     * pre-deploy safety gate from item 5).
     *
     * Throwing here is intentional: the abstract `build()` from
     * `BaseCodingBehavior` is satisfied, the behavior factory in
     * `codingAgent.onStart` can construct this class, but a runtime
     * attempt to generate code surfaces a clear "not yet wired"
     * message rather than silently no-op'ing.
     */
    async build(): Promise<void> {
        throw new Error(
            'PhasicCodingBehavior.build: phase state machine not yet ported ' +
                '(slice 2b.16 lands the structural shell; the launchStateMachine + ' +
                'executePhaseGeneration / executePhaseImplementation / ' +
                'executeReviewCycle / executeFinalizing implementations land in a ' +
                'follow-on slice once executeCommands + runStaticAnalysisCode + ' +
                'fetchAllIssues + the deferred pre-deploy safety gate are on ' +
                'BaseCodingBehavior). Live runtime path remains ' +
                'SimpleCodeGeneratorAgent until M3 commit 4.',
        );
    }
}
