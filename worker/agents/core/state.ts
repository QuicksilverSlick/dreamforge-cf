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
import type { UserRole } from '../../types/auth-types';

/**
 * Consent-gated takeover: an in-flight request for a privileged impersonating
 * operator to take the single-driver seat while the real user is live. Keyed on
 * the OPERATOR's stable connection.id (never userId, which collides under
 * impersonation). Fail-closed — cleared on decision, timeout, or disconnect.
 */
export interface PendingTakeover {
    requestId: string;
    operatorConnectionId: string;
    /** The real user whose consent is required (the impersonation target). */
    targetUserId: string;
    /** The real operator behind the impersonation (for audit attribution). */
    actorId: string;
    actorRole: UserRole | null;
    requestedAt: number;
    expiresAt: number;
}

/**
 * A session-long takeover grant: the real user consented to a specific operator
 * connection driving as them. Scoped to the CONSENTING userId so a different,
 * non-consenting real member who later joins re-arms the consent gate (C9).
 */
export interface GrantedTakeover {
    operatorConnectionId: string;
    consentingUserId: string;
}

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

    /**
     * Blueprint-image consent (spec: images debit Sparks, so they require an
     * explicit user choice). undefined = never asked (legacy agents keep
     * their old behavior); 'pending' = card shown, awaiting the user.
     */
    blueprintImageConsent?: 'pending' | 'approved' | 'declined';

    /**
     * Overrides the sandbox DO id after a rotation (the default id is the
     * immutable sessionId). Set when the original sandbox wedges permanently.
     */
    sandboxSessionOverride?: string;

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
    /**
     * Consent-gated takeover (privileged impersonation only). The in-flight
     * request awaiting the real user's allow/deny, or null. See PendingTakeover.
     */
    pendingTakeover?: PendingTakeover | null;
    /**
     * A session-long takeover grant the real user approved, or null. While set,
     * the granted operator connection drives without re-prompting; cleared on
     * release, the operator's disconnect, or the user taking control back.
     */
    grantedTakeover?: GrantedTakeover | null;
    /**
     * Takeover re-request throttle, keyed on the operator's REAL actorId (NOT
     * connection.id, so a reconnect can't reset it — C7). Caps prompt-bombing of
     * the user: attempts in the current window and when it opened.
     */
    takeoverRequestThrottle?: Record<string, { count: number; windowStartedAt: number }>;

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
     * **Transitional.** Upstream replaces this whole-object field with
     * `templateName: string` and fetches `TemplateDetails` on-demand from
     * the sandbox. The fork's `FileManager` and `GenerationContext` still
     * read the embedded object directly; a future rebase onto upstream's
     * pattern drops this field. Until then it's optional so legacy persisted
     * state still satisfies the type, and the migration in
     * `stateMigration.ts` strips it from canonical state on hydration.
     */
    templateDetails?: TemplateDetails;

    // The retired transitional fields `inferenceContext` (→ `metadata`),
    // `agentMode` (→ `behaviorType`), and `generationPromise` are
    // intentionally absent from the canonical shape. Legacy persisted
    // payloads may still carry the first two; `stateMigration.ts` reads them
    // from the raw record and translates them to their canonical names on
    // hydration.
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
