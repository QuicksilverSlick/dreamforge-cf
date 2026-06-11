/**
 * The deterministic question tree for the intake interview. Declared order is
 * ask order; budget caps and branch predicates control what actually fires.
 * Question copy is the product surface — non-technical, warm, no jargon.
 * Spec: docs/specs/21-QUESTIONS-INTAKE-INTERVIEW.md §3
 */

import { adminBackroomDecision, ARCHETYPE_LABELS } from './capabilityMap';
import type {
    ArchetypeId,
    AudienceId,
    CapabilityChipId,
    ChipOption,
    DerivedState,
    InterviewAnswer,
    InterviewPhase,
    PaymentsModelId,
    QuestionKind,
} from './types';

export interface QuestionDef {
    id: string;
    phase: InterviewPhase;
    kind: QuestionKind;
    text: string | ((derived: DerivedState) => string);
    chips?: ChipOption[];
    skippable: boolean;
    /** Branch predicate over the state derived from all current answers. */
    askWhen?: (derived: DerivedState) => boolean;
    /** Folds the answer into the derived state. Free-text uses answer.text. */
    apply: (draft: DerivedState, answer: InterviewAnswer) => void;
    /** Default applied (with an assumption note) when the user says "You decide". */
    delegate?: { chipIds: string[]; assumption: string };
    /** Pre-filled suggestion for free-text inputs. */
    prefill?: (derived: DerivedState) => string | undefined;
}

export const TOTAL_QUESTION_CAP = 21;

export const PHASE_CAPS: Record<InterviewPhase, number> = {
    1: 3,
    2: 3,
    3: 9,
    4: 2,
    5: 1,
    clarify: 3,
};

function chipIds(answer: InterviewAnswer): string[] {
    return answer.kind === 'chips' ? answer.chipIds : [];
}

function freeText(answer: InterviewAnswer): string | undefined {
    return answer.kind === 'text' && answer.text.trim() !== '' ? answer.text.trim() : undefined;
}

const AUDIENCE_CHIPS: ChipOption[] = [
    { id: 'just-me', label: 'Just me' },
    { id: 'team', label: 'Me and my team' },
    { id: 'customers', label: 'My customers or clients' },
    { id: 'anyone', label: 'Anyone who finds it' },
];

const ARCHETYPE_CHIPS: ChipOption[] = [
    { id: 'booking', label: 'Booking appointments' },
    { id: 'store', label: 'Selling things online' },
    { id: 'portal', label: 'A members or client area' },
    { id: 'internal-tool', label: 'A tool for my team' },
    { id: 'community', label: 'A community or social space' },
    { id: 'content', label: 'Sharing articles or content' },
    { id: 'dashboard', label: 'Tracking numbers in one place' },
    { id: 'other', label: 'Something else' },
];

const CAPABILITY_CHIPS: ChipOption[] = [
    { id: 'accounts', label: 'People sign in with their own account' },
    { id: 'payments', label: 'Take payments' },
    { id: 'booking', label: 'Let people book times or appointments' },
    { id: 'selling', label: 'Sell products' },
    { id: 'uploads', label: 'Upload photos or files' },
    { id: 'notifications', label: 'Send emails or reminders automatically' },
    { id: 'roles', label: 'Different access for different people' },
    { id: 'none', label: 'None of these / not sure — you decide' },
];

export const QUESTIONS: QuestionDef[] = [
    // ---------- Phase 1 — the problem (never skipped) ----------
    {
        id: 'p1-problem',
        phase: 1,
        kind: 'free',
        text: "What's the annoying thing this app should fix? Tell me about the last time it happened.",
        skippable: false,
        apply: (draft, answer) => {
            draft.fields.problem = freeText(answer) ?? draft.fields.problem;
        },
    },
    {
        id: 'p1-audience',
        phase: 1,
        kind: 'single',
        text: 'Who will be using this once it\'s live?',
        chips: AUDIENCE_CHIPS,
        skippable: false,
        apply: (draft, answer) => {
            const [choice] = chipIds(answer);
            if (choice) draft.fields.audience = choice as AudienceId;
        },
    },
    {
        id: 'p1-outcome',
        phase: 1,
        kind: 'free',
        text: 'Six months from now, what would make you say this app worked?',
        skippable: false,
        apply: (draft, answer) => {
            draft.fields.outcome = freeText(answer) ?? draft.fields.outcome;
        },
    },

    // ---------- Phase 2 — the main flow ----------
    {
        id: 'p2-main-flow',
        phase: 2,
        kind: 'free',
        text: 'Walk me through the main thing someone does in the app, step by step — like you\'re explaining it to a friend.',
        skippable: false,
        apply: (draft, answer) => {
            draft.fields.mainFlow = freeText(answer) ?? draft.fields.mainFlow;
        },
    },
    {
        id: 'p2-archetype-confirm',
        phase: 2,
        kind: 'single',
        text: (derived) => {
            const guess = derived.fields.archetypeGuess;
            const label = guess ? ARCHETYPE_LABELS[guess] : 'an app';
            return `Sounds like ${label}. Close?`;
        },
        chips: [
            { id: 'exactly', label: 'Exactly' },
            { id: 'sort-of', label: 'Sort of' },
            { id: 'no', label: 'No, something else' },
        ],
        skippable: false,
        askWhen: (derived) =>
            derived.fields.archetypeGuess !== undefined && derived.fields.archetype === undefined,
        apply: (draft, answer) => {
            const [choice] = chipIds(answer);
            if ((choice === 'exactly' || choice === 'sort-of') && draft.fields.archetypeGuess) {
                draft.fields.archetype = draft.fields.archetypeGuess;
            }
        },
    },
    {
        id: 'p2-archetype-pick',
        phase: 2,
        kind: 'single',
        text: 'Which of these feels closest to what you\'re imagining?',
        chips: ARCHETYPE_CHIPS,
        skippable: false,
        askWhen: (derived) => derived.fields.archetype === undefined,
        apply: (draft, answer) => {
            const [choice] = chipIds(answer);
            if (choice) draft.fields.archetype = choice as ArchetypeId;
        },
    },

    // ---------- Phase 3 — capability sweep ----------
    {
        id: 'p3-capabilities',
        phase: 3,
        kind: 'multi',
        text: 'Which of these will your app need? Tap all that apply — you can change your mind later.',
        chips: CAPABILITY_CHIPS,
        skippable: false,
        apply: (draft, answer) => {
            const selected = chipIds(answer).filter((id): id is CapabilityChipId =>
                CAPABILITY_CHIPS.some((chip) => chip.id === id)
            );
            draft.capabilityChips = selected.filter((id) => id !== 'none');
            if (selected.includes('none') && draft.capabilityChips.length === 0) {
                draft.assumptions.push(
                    'You weren\'t sure which extras you need, so we kept it simple — we can add payments, bookings, or accounts later.'
                );
            }
        },
    },
    {
        id: 'p3-payments-model',
        phase: 3,
        kind: 'single',
        text: 'How will people pay — one-time payments, subscriptions, or invoices you send?',
        chips: [
            { id: 'one-time', label: 'One-time payments' },
            { id: 'subscriptions', label: 'Subscriptions' },
            { id: 'invoices', label: 'Invoices I send' },
        ],
        skippable: true,
        askWhen: (derived) => derived.capabilityChips.includes('payments'),
        apply: (draft, answer) => {
            const [choice] = chipIds(answer);
            if (choice) draft.fields.paymentsModel = choice as PaymentsModelId;
        },
        delegate: {
            chipIds: ['one-time'],
            assumption: 'We set up simple one-time payments — switching to subscriptions later is easy.',
        },
    },
    {
        id: 'p3-payments-pricing',
        phase: 3,
        kind: 'free',
        text: 'Roughly what will things cost? A ballpark is fine.',
        skippable: true,
        askWhen: (derived) => derived.capabilityChips.includes('payments'),
        apply: (draft, answer) => {
            draft.fields.pricingNotes = freeText(answer) ?? draft.fields.pricingNotes;
        },
    },
    {
        id: 'p3-booking-mode',
        phase: 3,
        kind: 'single',
        text: 'For bookings — fixed time slots, or your live availability?',
        chips: [
            { id: 'fixed-slots', label: 'Fixed time slots' },
            { id: 'live-availability', label: 'My live availability' },
        ],
        skippable: true,
        askWhen: (derived) => derived.capabilityChips.includes('booking'),
        apply: (draft, answer) => {
            const [choice] = chipIds(answer);
            if (choice === 'fixed-slots' || choice === 'live-availability') {
                draft.fields.bookingMode = choice;
            }
        },
        delegate: {
            chipIds: ['fixed-slots'],
            assumption: 'We went with fixed time slots for bookings — the simplest place to start.',
        },
    },
    {
        id: 'p3-booking-reminders',
        phase: 3,
        kind: 'single',
        text: 'Should people get a reminder before their appointment?',
        chips: [
            { id: 'yes', label: 'Yes, remind them' },
            { id: 'no', label: 'No reminders' },
        ],
        skippable: true,
        askWhen: (derived) => derived.capabilityChips.includes('booking'),
        apply: (draft, answer) => {
            const [choice] = chipIds(answer);
            if (choice === 'yes' || choice === 'no') draft.fields.bookingReminders = choice;
        },
        delegate: {
            chipIds: ['yes'],
            assumption: 'We turned on appointment reminders — most people want them.',
        },
    },
    {
        id: 'p3-accounts-signup',
        phase: 3,
        kind: 'single',
        text: 'Can anyone sign up, or only people you invite?',
        chips: [
            { id: 'anyone', label: 'Anyone can sign up' },
            { id: 'invite-only', label: 'Only people I invite' },
        ],
        skippable: true,
        askWhen: (derived) => derived.capabilityChips.includes('accounts'),
        apply: (draft, answer) => {
            const [choice] = chipIds(answer);
            if (choice === 'anyone' || choice === 'invite-only') draft.fields.signupPolicy = choice;
        },
        delegate: {
            chipIds: ['anyone'],
            assumption: 'We let anyone sign up — you can switch to invite-only later.',
        },
    },
    {
        id: 'p3-selling-scale',
        phase: 3,
        kind: 'single',
        text: 'How many different things will you sell — a handful, or hundreds?',
        chips: [
            { id: 'handful', label: 'A handful' },
            { id: 'hundreds', label: 'Hundreds' },
        ],
        skippable: true,
        askWhen: (derived) => derived.capabilityChips.includes('selling'),
        apply: (draft, answer) => {
            const [choice] = chipIds(answer);
            if (choice === 'handful' || choice === 'hundreds') draft.fields.catalogScale = choice;
        },
        delegate: {
            chipIds: ['handful'],
            assumption: 'We sized the store for a handful of products — it can grow.',
        },
    },
    {
        id: 'p3-roles-detail',
        phase: 3,
        kind: 'free',
        text: 'Who are the different kinds of people, and what should each one be able to see?',
        skippable: true,
        askWhen: (derived) => derived.capabilityChips.includes('roles'),
        apply: (draft, answer) => {
            draft.fields.rolesDetail = freeText(answer) ?? draft.fields.rolesDetail;
        },
    },
    {
        id: 'p3-backroom',
        phase: 3,
        kind: 'single',
        text: 'Want a private "back room" only you can get into — where you can see who\'s signed up, check new orders or bookings, and make changes without touching anything technical?',
        chips: [
            { id: 'yes', label: 'Yes — I want to see everything in one place' },
            { id: 'yes-roles', label: 'Yes — and some of my team need their own keys too' },
            { id: 'no', label: 'No thanks — keep it simple' },
            { id: 'not-sure', label: 'Not sure — add it if it\'d help' },
        ],
        skippable: false,
        askWhen: (derived) => adminBackroomDecision(derived) === 'ask',
        apply: (draft, answer) => {
            const [choice] = chipIds(answer);
            if (choice === 'yes' || choice === 'yes-roles' || choice === 'no' || choice === 'not-sure') {
                draft.fields.backroom = choice;
            }
        },
    },

    // ---------- Clarify reserve — deterministic contradiction checks ----------
    {
        id: 'clarify-roles-audience',
        phase: 'clarify',
        kind: 'single',
        text: 'Earlier you said it\'s just you, but also that different people need different access — who else will be using it?',
        chips: [
            { id: 'team', label: 'My team will too' },
            { id: 'customers', label: 'Customers will too' },
            { id: 'just-me', label: 'Actually, it\'s just me' },
        ],
        skippable: false,
        askWhen: (derived) =>
            derived.fields.audience === 'just-me' && derived.capabilityChips.includes('roles'),
        apply: (draft, answer) => {
            const [choice] = chipIds(answer);
            if (choice === 'team' || choice === 'customers') {
                draft.fields.audience = choice;
            } else if (choice === 'just-me') {
                draft.capabilityChips = draft.capabilityChips.filter((id) => id !== 'roles');
            }
        },
    },
    {
        id: 'clarify-accounts-audience',
        phase: 'clarify',
        kind: 'single',
        text: 'You picked sign-in accounts, but said it\'s just you — should other people be able to sign in too?',
        chips: [
            { id: 'others-too', label: 'Yes, other people too' },
            { id: 'just-me', label: 'No, just a login for me' },
        ],
        skippable: false,
        askWhen: (derived) =>
            derived.fields.audience === 'just-me' && derived.capabilityChips.includes('accounts'),
        apply: (draft, answer) => {
            const [choice] = chipIds(answer);
            if (choice === 'others-too') {
                draft.fields.audience = 'customers';
            } else if (choice === 'just-me') {
                draft.capabilityChips = draft.capabilityChips.filter((id) => id !== 'accounts');
                draft.flags['auth.single-admin'] = true;
            }
        },
    },

    // ---------- Phase 4 — shape & feel ----------
    {
        id: 'p4-look',
        phase: 4,
        kind: 'free',
        text: 'Any app or website whose look you love?',
        skippable: true,
        apply: (draft, answer) => {
            draft.fields.lookAndFeel = freeText(answer) ?? draft.fields.lookAndFeel;
        },
    },
    {
        id: 'p4-name',
        phase: 4,
        kind: 'free',
        text: 'What should we call it?',
        skippable: true,
        prefill: (derived) => derived.fields.appNameSuggestion,
        apply: (draft, answer) => {
            draft.fields.appName = freeText(answer) ?? draft.fields.appName;
        },
    },

    // ---------- Phase 5 — confirm ----------
    {
        id: 'p5-confirm',
        phase: 5,
        kind: 'single',
        text: 'Here\'s your app so far — ready to build, or want to change anything?',
        chips: [
            { id: 'build-it', label: 'Build it' },
            { id: 'change-something', label: 'Change something' },
        ],
        skippable: false,
        apply: () => {
            // Terminal control answer; the engine reads it directly.
        },
    },
];

export function getQuestion(id: string): QuestionDef | undefined {
    return QUESTIONS.find((question) => question.id === id);
}
