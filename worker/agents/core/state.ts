/**
 * Agent state — discriminated union over phasic vs agentic behavior.
 *
 * Mirrors upstream `cloudflare/vibesdk` `worker/agents/core/state.ts` shape
 * (the single-agent topology that M3 ports) while preserving fork-only
 * fields the Dreamforge generator stack reads through:
 *   - `clientReportedErrors` (the typed runtime-error feed from preview
 *     iframes; the local FastCodeFixer operation consumes this)
 *   - `conversationMessages` (flat persisted array; the conversation
 *     processor wraps `ConversationState` over it on the read path)
 *
 * Legacy field-name renames (`inferenceContext → metadata`, `templateDetails →
 * templateName`, `agentMode → behaviorType`) are handled at hydration time
 * by `stateMigration.ts`; we do NOT carry the old field names on the
 * canonical shape.
 *
 * A `CodeGenState = PhasicState` type alias is exported at the bottom for
 * call sites (`src/api-types.ts:151`, `worker/api/websocketTypes.ts`) that
 * still reference the pre-M3 name. The alias will be removed in a follow-
 * up cleanup pass once those imports have been renamed.
 */

import type {
    AgenticBlueprint,
    Blueprint,
    ClientReportedErrorType,
    FileOutputType,
    PhaseConceptType,
    PhasicBlueprint,
} from '../schemas';
import type { ConversationMessage } from '../inferutils/common';
import type { InferenceMetadata } from '../inferutils/config.types';
import type { TemplateDetails } from '../../services/sandbox/sandboxTypes';
import type { BehaviorType, Plan, ProjectType } from './types';

export interface FileState extends FileOutputType {
    /**
     * Cached hash of `fileContents` at the time the file was last written
     * to state. Used by the phase implementation operation to detect no-op
     * regenerations without re-running the diff.
     */
    lasthash: string;
    /** Epoch ms of the most recent write. */
    lastmodified: number;
    /**
     * Three-way-merge marker lines that survived the most recent diff
     * application. A non-empty array indicates an unresolved conflict the
     * UI surfaces to the user.
     */
    unmerged: string[];
    /** Last unified diff applied to this file, kept for review surfacing. */
    lastDiff: string;
}

export interface FileServingToken {
    token: string;
    createdAt: number;
}

export interface PhaseState extends PhaseConceptType {
    completed: boolean;
}

export enum CurrentDevState {
    IDLE,
    PHASE_GENERATING,
    PHASE_IMPLEMENTING,
    REVIEWING,
    FILE_REGENERATING,
    FINALIZING,
}

/**
 * Maximum number of phases the phasic behavior will plan + execute before
 * cutting off. Kept at the fork-local value (12) rather than upstream's
 * default (10) until the smoke test demonstrates the smaller cap doesn't
 * truncate non-trivial app generations.
 */
export const MAX_PHASES = 12;

/** Common state fields for all agent behaviors. */
export interface BaseProjectState {
    /** Discriminator for the union below. */
    behaviorType: BehaviorType;
    /** Drives feature-gating via the platform-capabilities registry. */
    projectType: ProjectType;

    // Identity
    projectName: string;
    query: string;
    sessionId: string;
    hostname: string;

    /** Generated project blueprint. Variant narrowed by behavior subtype. */
    blueprint: Blueprint;

    /** Template the project was bootstrapped from (`'custom'` for BYOP). */
    templateName: string | 'custom';

    /**
     * Findings from the latest preview-screenshot analysis, queued for the
     * next phase generation and cleared once consumed. Optional: absent on
     * pre-feature states and when the last screenshot reviewed clean.
     */
    screenshotFeedback?: {
        issues: string[];
        capturedAt: number;
    } | null;

    /** Inference / observability metadata stamped at agent boot. */
    readonly metadata: InferenceMetadata;

    /** Persistent flag indicating generation should be active. */
    shouldBeGenerating: boolean;

    /** File state keyed by relative path. */
    generatedFilesMap: Record<string, FileState>;

    // Sandbox / runtime context
    sandboxInstanceId?: string;
    fileServingToken?: FileServingToken;
    commandsHistory?: string[];
    lastPackageJson?: string;
    pendingUserInputs: string[];
    projectUpdatesAccumulator: string[];

    /** Deep-debug transcript persisted between recovery sessions. M4-shaped. */
    lastDeepDebugTranscript: string | null;

    mvpGenerated: boolean;
    reviewingInitiated: boolean;

    /**
     * Encrypted Cloudflare OAuth token blob. M4/PR9 vault territory; M3
     * leaves this optional and never reads it (gated behind feature flag).
     */
    cloudflareToken?: string;
    /** Origin captured at WS upgrade time; same gating as `cloudflareToken`. */
    wsOrigin?: string;
    /**
     * Org collaboration: the userId currently holding the single "driver" seat
     * (the one member allowed to drive build/deploy commands). null/undefined =
     * seat open (next driving command auto-claims it). Persists in DO state so it
     * survives hibernation and is consistent across all connected members.
     */
    currentDriverUserId?: string | null;

    // ---- Fork-local additions preserved from pre-M3 CodeGenState ----

    /**
     * Runtime errors reported by preview iframes via the `/api/agent/:id`
     * client-report endpoint. Consumed by FastCodeFixer to seed targeted
     * regenerations. Not part of upstream's state surface; preserved here
     * because the FastCodeFixer operation depends on it.
     */
    clientReportedErrors: ClientReportedErrorType[];

    /**
     * Flat conversation history persisted as state. Upstream stores this
     * via `ConversationState` accessor methods on the agent infrastructure;
     * we persist the underlying array directly because the fork's chat
     * controller serializes it for /api/agent/:id/conversation reads.
     */
    conversationMessages: ConversationMessage[];

    /**
     * **Transitional, removed in commit 5.** Upstream replaces this whole-
     * object field with `templateName: string` and fetches `TemplateDetails`
     * on-demand from the sandbox. The fork's `FileManager` and
     * `GenerationContext` currently read the embedded object directly; once
     * commit 5 rebases those operations against upstream's pattern, this
     * field disappears. Until then it's optional so legacy persisted state
     * still satisfies the type, and the migration in `stateMigration.ts`
     * strips it from canonical state on hydration.
     */
    templateDetails?: TemplateDetails;

    // -------------------------------------------------------------------
    // Deprecated fields — kept optional only while the legacy
    // `simpleGeneratorAgent.ts` + `smartGeneratorAgent.ts` files still
    // exist. Commit 4 of the M3 sequence deletes those files; this block
    // is removed in the same commit. They exist here so every commit in
    // the M3 sequence is typecheck-clean (atomic-green-commits is best
    // practice for multi-commit PRs — bisectability, meaningful CI
    // signal, partial-revert safety). The runtime canonical field for
    // each is in the parent block above; the migration in
    // `stateMigration.ts` translates legacy persisted payloads to the
    // canonical names.
    // -------------------------------------------------------------------

    /**
     * @deprecated Use `metadata` (canonical) — removed in M3 commit 4.
     * Required (not optional) during the transition so legacy callsites
     * in `simpleGeneratorAgent.ts` can read `.agentId` / `.userId`
     * without null-guards. New code (commits 2+) mirrors this from
     * `metadata` on every state write.
     */
    inferenceContext: import('../inferutils/config.types').InferenceContext;

    /**
     * @deprecated Use `behaviorType` (canonical) — removed in M3 commit 4.
     * Required during the transition; mirrored from `behaviorType` on
     * every state write by new code.
     */
    agentMode: 'deterministic' | 'smart';

    /**
     * @deprecated Transient generation handle, never persisted. The new
     * agent topology tracks in-flight generation via behavior-internal
     * state. Removed in M3 commit 4.
     */
    generationPromise?: Promise<void>;
}

/** Phasic-behavior state. */
export interface PhasicState extends BaseProjectState {
    behaviorType: 'phasic';
    blueprint: PhasicBlueprint;
    generatedPhases: PhaseState[];
    phasesCounter: number;
    currentDevState: CurrentDevState;
    reviewCycles?: number;
    currentPhase?: PhaseConceptType;
}

/**
 * Workflow-project metadata describing function signature + bindings.
 * Carried for the `'workflow'` project type; consumed by the workflow
 * export operation. Preserved verbatim from upstream — fork has no
 * additions here.
 */
export interface WorkflowMetadata {
    name: string;
    description: string;
    params: Record<
        string,
        {
            type: 'string' | 'number' | 'boolean' | 'object';
            description: string;
            example?: unknown;
            required: boolean;
        }
    >;
    bindings?: {
        envVars?: Record<
            string,
            {
                type: 'string';
                description: string;
                default?: string;
                required?: boolean;
            }
        >;
        secrets?: Record<
            string,
            {
                type: 'secret';
                description: string;
                required?: boolean;
            }
        >;
        resources?: Record<
            string,
            {
                type: 'kv' | 'r2' | 'd1' | 'queue' | 'ai';
                description: string;
                required?: boolean;
            }
        >;
    };
}

/** Agentic-behavior state. */
export interface AgenticState extends BaseProjectState {
    behaviorType: 'agentic';
    blueprint: AgenticBlueprint;
    currentPlan: Plan;
}

export type AgentState = PhasicState | AgenticState;

// ---------------------------------------------------------------------------
// Backwards-compatible alias
// ---------------------------------------------------------------------------

/**
 * Pre-M3 type name. Kept as an alias for one release so the frontend
 * (`src/api-types.ts:151`) and `worker/api/websocketTypes.ts` typings keep
 * compiling without coordinated updates. Resolves to `PhasicState` because
 * every pre-M3 generator state was phasic — the agentic path was a TODO
 * stub until M3.
 *
 * Follow-up: rename call sites to `PhasicState` or `AgentState` (depending
 * on whether the call site needs phasic-only fields) and delete this alias.
 */
export type CodeGenState = PhasicState;
