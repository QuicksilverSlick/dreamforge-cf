/**
 * Intake interview ("21 Questions") domain types.
 * Spec: docs/specs/21-QUESTIONS-INTAKE-INTERVIEW.md
 */

import { z } from 'zod';

export type AudienceId = 'just-me' | 'team' | 'customers' | 'anyone';

export type ArchetypeId =
    | 'booking'
    | 'store'
    | 'portal'
    | 'internal-tool'
    | 'community'
    | 'content'
    | 'dashboard'
    | 'other';

export type PaymentsModelId = 'one-time' | 'subscriptions' | 'invoices';

/** Multi-select ids on the capability checklist question. */
export type CapabilityChipId =
    | 'accounts'
    | 'payments'
    | 'booking'
    | 'selling'
    | 'uploads'
    | 'notifications'
    | 'roles'
    | 'none';

/** Machine-readable capability flags carried into the build spec. */
export type CapabilityFlag =
    | 'auth.full'
    | 'auth.single-admin'
    | 'auth.none'
    | 'auth.invite-only'
    | 'payments.checkout'
    | 'payments.subscriptions'
    | 'payments.invoicing'
    | 'scheduling.calendar'
    | 'scheduling.reminders'
    | 'catalog'
    | 'cart'
    | 'uploads'
    | 'storage'
    | 'notifications.email'
    | 'admin.dashboard'
    | 'roles.multi';

export type CapabilityFlags = Partial<Record<CapabilityFlag, boolean>>;

export type InterviewAnswer =
    | { kind: 'text'; text: string }
    | { kind: 'chips'; chipIds: string[] }
    | { kind: 'skip' }
    /** "You decide" — the engine applies a default and records an assumption. */
    | { kind: 'delegate' };

export type InterviewPhase = 1 | 2 | 3 | 4 | 5 | 'clarify';

export type QuestionKind = 'free' | 'single' | 'multi';

export interface ChipOption {
    id: string;
    label: string;
}

/** Everything the interview has learned, re-derived from answers on every fold. */
export interface InterviewFields {
    problem?: string;
    audience?: AudienceId;
    outcome?: string;
    mainFlow?: string;
    archetype?: ArchetypeId;
    /** Triage's guess, used to phrase the restate-and-confirm question. */
    archetypeGuess?: ArchetypeId;
    paymentsModel?: PaymentsModelId;
    pricingNotes?: string;
    bookingMode?: 'fixed-slots' | 'live-availability';
    signupPolicy?: 'anyone' | 'invite-only';
    catalogScale?: 'handful' | 'hundreds';
    rolesDetail?: string;
    bookingReminders?: 'yes' | 'no';
    backroom?: 'yes' | 'yes-roles' | 'no' | 'not-sure';
    lookAndFeel?: string;
    appName?: string;
    appNameSuggestion?: string;
}

export interface DerivedState {
    fields: InterviewFields;
    /** Raw checklist selections; finalize() maps them to flags. */
    capabilityChips: CapabilityChipId[];
    flags: CapabilityFlags;
    /** Plain-English notes for every default the engine chose for the user. */
    assumptions: string[];
    credentialsNeeded: string[];
}

export interface InterviewState {
    /** questionId -> answer (pre-answers from triage included). */
    answers: Record<string, InterviewAnswer>;
    /** Question ids answered by triage rather than asked. */
    preAnsweredIds: string[];
    /** Question ids actually shown to the user, in order (budget basis). */
    askedQuestionIds: string[];
    currentQuestionId: string | null;
    finished: boolean;
}

export interface TriageResult {
    problem: string | null;
    audience: AudienceId | null;
    outcome: string | null;
    mainFlow: string | null;
    archetypeGuess: ArchetypeId | null;
    archetypeConfidence: 'high' | 'low';
    capabilities: CapabilityChipId[];
    paymentsModel: PaymentsModelId | null;
    appNameSuggestion: string | null;
    lookAndFeel: string | null;
}

export interface InterviewSession {
    id: string;
    userId: string;
    initialPrompt: string;
    createdAt: number;
    state: InterviewState;
    triage: TriageResult | null;
    spec: InterviewSpec | null;
}

/** The question payload sent to the client. */
export interface QuestionPayload {
    id: string;
    phase: InterviewPhase;
    text: string;
    kind: QuestionKind;
    chips: ChipOption[];
    skippable: boolean;
    /** True when the question has a "You decide" default to delegate to. */
    delegatable: boolean;
    /** Pre-filled suggestion for free-text questions (e.g. app name). */
    prefill?: string;
}

export interface InterviewProgress {
    asked: number;
    cap: number;
}

/** Live "Your app so far" panel content, rebuilt after every answer. */
export interface InterviewSummary {
    headline: string | null;
    points: string[];
    assumptions: string[];
}

export interface UserStory {
    id: string;
    story: string;
}

export interface AcceptanceCriterion {
    id: string;
    criterion: string;
}

/**
 * The final artifact: feeds the blueprint as structured requirements.
 * Defined as a zod schema so it can ride the blueprint's schema-driven
 * prompt serialization (every generation operation sees the requirements).
 */
export const InterviewSpecSchema = z.object({
    problem: z.string().describe('The problem the app solves, in the user\'s vocabulary'),
    outcome: z.string().describe('What success looks like for the owner'),
    usersAndRoles: z.string().describe('Who uses the app and what each kind of person can do'),
    userStories: z.array(z.object({
        id: z.string(),
        story: z.string(),
    })).describe('User stories covering the main flow and every selected capability'),
    acceptanceCriteria: z.array(z.object({
        id: z.string(),
        criterion: z.string(),
    })).describe('EARS-style acceptance criteria the finished app must meet'),
    capabilityFlags: z.record(z.string(), z.boolean()).describe('Machine-readable capability flags'),
    assumptions: z.array(z.string()).describe('Defaults chosen on the user\'s behalf'),
    credentialsNeeded: z.array(z.string()).describe('Third-party credentials the user must supply later; scaffold with mocks'),
    lookAndFeel: z.string().nullable(),
    appName: z.string().nullable(),
    enhancedQuery: z.string().describe('The enriched build brief'),
});

export type InterviewSpec = z.infer<typeof InterviewSpecSchema>;
