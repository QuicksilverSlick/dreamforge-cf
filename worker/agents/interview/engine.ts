/**
 * Deterministic interview engine: pure functions over a serializable session.
 * State is always re-derived from the answer set (never accumulated), so
 * answers can be changed at any time and everything downstream — flags,
 * assumptions, summary, branching — stays consistent.
 * Spec: docs/specs/21-QUESTIONS-INTAKE-INTERVIEW.md §2, §3, §7.2
 */

import {
    ADMIN_AUTO_INCLUDE_ASSUMPTION,
    adminBackroomDecision,
    ARCHETYPE_LABELS,
    deriveCredentialsNeeded,
} from './capabilityMap';
import { getQuestion, PHASE_CAPS, QUESTIONS, TOTAL_QUESTION_CAP, type QuestionDef } from './questionTree';
import type {
    DerivedState,
    InterviewAnswer,
    InterviewProgress,
    InterviewSession,
    InterviewSummary,
    QuestionPayload,
    TriageResult,
} from './types';

export class InterviewInputError extends Error {}

const CAPABILITY_LABELS: Record<string, string> = {
    accounts: 'sign-in accounts',
    payments: 'payments',
    booking: 'booking appointments',
    selling: 'selling products',
    uploads: 'photo and file uploads',
    notifications: 'automatic emails',
    roles: 'different access for different people',
};

export function createSession(id: string, userId: string, initialPrompt: string, now: number): InterviewSession {
    return {
        id,
        userId,
        initialPrompt,
        createdAt: now,
        state: {
            answers: {},
            preAnsweredIds: [],
            askedQuestionIds: [],
            currentQuestionId: null,
            finished: false,
        },
        triage: null,
        spec: null,
    };
}

/**
 * Maps triage extractions onto pre-answered questions so the interview never
 * asks what the first prompt already said.
 */
export function applyTriage(session: InterviewSession, triage: TriageResult): void {
    session.triage = triage;
    const preAnswer = (questionId: string, answer: InterviewAnswer) => {
        if (session.state.answers[questionId]) return;
        session.state.answers[questionId] = answer;
        session.state.preAnsweredIds.push(questionId);
    };

    if (triage.problem) preAnswer('p1-problem', { kind: 'text', text: triage.problem });
    if (triage.audience) preAnswer('p1-audience', { kind: 'chips', chipIds: [triage.audience] });
    if (triage.outcome) preAnswer('p1-outcome', { kind: 'text', text: triage.outcome });
    if (triage.mainFlow) preAnswer('p2-main-flow', { kind: 'text', text: triage.mainFlow });
    if (triage.capabilities.length > 0) {
        preAnswer('p3-capabilities', { kind: 'chips', chipIds: triage.capabilities });
    }
    if (triage.paymentsModel) {
        preAnswer('p3-payments-model', { kind: 'chips', chipIds: [triage.paymentsModel] });
    }
    if (triage.lookAndFeel) preAnswer('p4-look', { kind: 'text', text: triage.lookAndFeel });
}

/** Re-derives the full interview state from triage seeds + the answer fold. */
export function deriveState(session: InterviewSession): DerivedState {
    const draft: DerivedState = {
        fields: {},
        capabilityChips: [],
        flags: {},
        assumptions: [],
        credentialsNeeded: [],
    };

    const triage = session.triage;
    if (triage) {
        if (triage.archetypeGuess) {
            draft.fields.archetypeGuess = triage.archetypeGuess;
            if (triage.archetypeConfidence === 'high') {
                draft.fields.archetype = triage.archetypeGuess;
            }
        }
        if (triage.appNameSuggestion) draft.fields.appNameSuggestion = triage.appNameSuggestion;
    }

    for (const question of QUESTIONS) {
        const answer = session.state.answers[question.id];
        if (!answer) continue;
        if (answer.kind === 'delegate') {
            if (question.delegate) {
                question.apply(draft, { kind: 'chips', chipIds: question.delegate.chipIds });
                draft.assumptions.push(question.delegate.assumption);
            }
            continue;
        }
        question.apply(draft, answer);
    }

    finalizeFlags(draft, session);
    return draft;
}

/** Maps checklist chips + follow-up fields to capability flags (spec §4). */
function finalizeFlags(draft: DerivedState, session: InterviewSession): void {
    const { fields, capabilityChips: chips, flags } = draft;

    if (chips.includes('payments')) {
        if (fields.paymentsModel === 'subscriptions') flags['payments.subscriptions'] = true;
        else if (fields.paymentsModel === 'invoices') flags['payments.invoicing'] = true;
        else {
            flags['payments.checkout'] = true;
            if (!fields.paymentsModel) {
                draft.assumptions.push('We set up simple one-time payments — switching to subscriptions later is easy.');
            }
        }
    }
    if (chips.includes('booking')) {
        flags['scheduling.calendar'] = true;
        if (fields.bookingReminders !== 'no') {
            flags['scheduling.reminders'] = true;
            flags['notifications.email'] = true;
            if (fields.bookingReminders === undefined) {
                draft.assumptions.push('We turned on appointment reminders — most people want them.');
            }
        }
    }
    if (chips.includes('selling')) {
        flags['catalog'] = true;
        flags['cart'] = true;
        flags['storage'] = true;
    }
    if (chips.includes('uploads')) {
        flags['uploads'] = true;
        flags['storage'] = true;
    }
    if (chips.includes('notifications')) {
        flags['notifications.email'] = true;
    }
    if (chips.includes('roles')) {
        flags['roles.multi'] = true;
    }
    if (chips.includes('accounts')) {
        flags['auth.full'] = true;
        if (fields.signupPolicy === 'invite-only') flags['auth.invite-only'] = true;
    }

    // Admin back room: an explicit answer wins; otherwise the auto-include
    // rule fires only when it never needed to be asked.
    if (fields.backroom === 'yes' || fields.backroom === 'not-sure') {
        flags['admin.dashboard'] = true;
        if (fields.backroom === 'not-sure') {
            draft.assumptions.push(ADMIN_AUTO_INCLUDE_ASSUMPTION);
        }
    } else if (fields.backroom === 'yes-roles') {
        flags['admin.dashboard'] = true;
        flags['roles.multi'] = true;
    } else if (fields.backroom === undefined && !session.state.answers['p3-backroom']) {
        if (adminBackroomDecision(draft) === 'auto-include') {
            flags['admin.dashboard'] = true;
            draft.assumptions.push(ADMIN_AUTO_INCLUDE_ASSUMPTION);
        }
    }

    // Auth resolution: an admin area needs at least an owner login; a
    // single-user app without accounts needs none.
    if (flags['admin.dashboard'] && !flags['auth.full'] && !flags['auth.single-admin']) {
        flags['auth.single-admin'] = true;
    }
    if (!flags['auth.full'] && !flags['auth.single-admin']) {
        flags['auth.none'] = true;
    }

    draft.credentialsNeeded = deriveCredentialsNeeded(flags);
}

function phaseAskedCount(session: InterviewSession, phase: QuestionDef['phase']): number {
    return session.state.askedQuestionIds.filter((id) => getQuestion(id)?.phase === phase).length;
}

/**
 * Picks the next question: declared order, branch predicates over derived
 * state, per-phase + total budget caps. Re-asking an already-asked question
 * (after "change something") never double-counts the budget.
 */
export function nextQuestion(session: InterviewSession): QuestionDef | null {
    const derived = deriveState(session);
    const totalAsked = session.state.askedQuestionIds.length;

    for (const question of QUESTIONS) {
        if (session.state.answers[question.id]) continue;
        if (question.askWhen && !question.askWhen(derived)) continue;

        const alreadyCounted = session.state.askedQuestionIds.includes(question.id);
        if (!alreadyCounted) {
            if (totalAsked >= TOTAL_QUESTION_CAP) continue;
            if (phaseAskedCount(session, question.phase) >= PHASE_CAPS[question.phase]) continue;
        }
        return question;
    }
    return null;
}

/** Advances the session to its next question (or marks it out of questions). */
export function advance(session: InterviewSession): QuestionPayload | null {
    const question = nextQuestion(session);
    if (!question) {
        session.state.currentQuestionId = null;
        return null;
    }
    session.state.currentQuestionId = question.id;
    if (!session.state.askedQuestionIds.includes(question.id)) {
        session.state.askedQuestionIds.push(question.id);
    }
    return toPayload(question, deriveState(session));
}

export function toPayload(question: QuestionDef, derived: DerivedState): QuestionPayload {
    return {
        id: question.id,
        phase: question.phase,
        text: typeof question.text === 'function' ? question.text(derived) : question.text,
        kind: question.kind,
        chips: question.chips ?? [],
        skippable: question.skippable,
        prefill: question.prefill?.(derived),
    };
}

export function submitAnswer(session: InterviewSession, questionId: string, answer: InterviewAnswer): void {
    const question = getQuestion(questionId);
    if (!question) {
        throw new InterviewInputError(`Unknown question: ${questionId}`);
    }
    const isCurrent = session.state.currentQuestionId === questionId;
    const isRevision = Boolean(session.state.answers[questionId]);
    if (!isCurrent && !isRevision) {
        throw new InterviewInputError('That question is not open for an answer yet');
    }
    validateAnswer(question, answer);

    session.state.answers[questionId] = answer;

    if (questionId === 'p5-confirm' && answer.kind === 'chips') {
        if (answer.chipIds[0] === 'build-it') {
            session.state.finished = true;
            session.state.currentQuestionId = null;
            return;
        }
        // "Change something": reopen — revised answers re-derive everything,
        // and the confirm question will be re-asked at the end.
        delete session.state.answers['p5-confirm'];
        return;
    }

    if (isRevision && session.state.answers['p5-confirm']) {
        delete session.state.answers['p5-confirm'];
    }
}

function validateAnswer(question: QuestionDef, answer: InterviewAnswer): void {
    switch (answer.kind) {
        case 'skip':
            if (!question.skippable) {
                throw new InterviewInputError('This question can\'t be skipped');
            }
            return;
        case 'delegate':
            if (!question.delegate) {
                throw new InterviewInputError('This question has no default to delegate to');
            }
            return;
        case 'text':
            if (question.kind !== 'free') {
                throw new InterviewInputError('This question expects a choice, not text');
            }
            if (answer.text.trim() === '') {
                throw new InterviewInputError('The answer is empty');
            }
            if (answer.text.length > 4000) {
                throw new InterviewInputError('That answer is too long');
            }
            return;
        case 'chips': {
            if (question.kind === 'free') {
                throw new InterviewInputError('This question expects text, not a choice');
            }
            const validIds = new Set((question.chips ?? []).map((chip) => chip.id));
            if (answer.chipIds.length === 0 || !answer.chipIds.every((id) => validIds.has(id))) {
                throw new InterviewInputError('Invalid choice for this question');
            }
            if (question.kind === 'single' && answer.chipIds.length !== 1) {
                throw new InterviewInputError('Pick exactly one option');
            }
            return;
        }
    }
}

export function getProgress(session: InterviewSession): InterviewProgress {
    return { asked: session.state.askedQuestionIds.length, cap: TOTAL_QUESTION_CAP };
}

/** The live "Your app so far" panel, rebuilt after every answer. */
export function buildSummary(session: InterviewSession): InterviewSummary {
    const derived = deriveState(session);
    const { fields, capabilityChips, flags } = derived;

    const archetypeLabel = fields.archetype ? ARCHETYPE_LABELS[fields.archetype] : null;
    const headline = archetypeLabel
        ? `${fields.appName ?? fields.appNameSuggestion ?? 'Your app'} — ${archetypeLabel}`
        : fields.appName ?? null;

    const points: string[] = [];
    if (fields.problem) points.push(`Fixes: ${fields.problem}`);
    if (fields.audience) {
        const audienceLabels: Record<string, string> = {
            'just-me': 'just for you',
            'team': 'for you and your team',
            'customers': 'for your customers',
            'anyone': 'for anyone who finds it',
        };
        points.push(`Built ${audienceLabels[fields.audience]}`);
    }
    if (fields.outcome) points.push(`Success looks like: ${fields.outcome}`);
    const capabilityLabels = capabilityChips
        .map((chip) => CAPABILITY_LABELS[chip])
        .filter((label): label is string => Boolean(label));
    if (capabilityLabels.length > 0) points.push(`Includes: ${capabilityLabels.join(', ')}`);
    if (flags['admin.dashboard']) points.push('Has a private back room for you');
    if (fields.lookAndFeel) points.push(`Look and feel: ${fields.lookAndFeel}`);

    return { headline, points, assumptions: derived.assumptions };
}
