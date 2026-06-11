/**
 * Intake interview engine tests — pure logic, no bindings, no model calls.
 * Covers: traversal order, branching, budget caps, triage pre-answering,
 * delegation defaults, admin auto-include, contradiction clarifiers,
 * capability/credential derivation, revision flow, and serializability.
 */

import { describe, expect, it } from 'vitest';
import {
    advance,
    applyTriage,
    buildSummary,
    createSession,
    deriveState,
    InterviewInputError,
    nextQuestion,
    submitAnswer,
} from './engine';
import { expandAcceptanceCriteria, deriveCredentialsNeeded } from './capabilityMap';
import { PHASE_CAPS, QUESTIONS, TOTAL_QUESTION_CAP } from './questionTree';
import type { InterviewAnswer, InterviewSession, TriageResult } from './types';

const NOW = 1_700_000_000_000;

function newSession(prompt = ''): InterviewSession {
    return createSession('session-1', 'user-1', prompt, NOW);
}

function answerCurrent(session: InterviewSession, answer: InterviewAnswer): string {
    const question = advance(session);
    expect(question).not.toBeNull();
    submitAnswer(session, question!.id, answer);
    return question!.id;
}

const chips = (...chipIds: string[]): InterviewAnswer => ({ kind: 'chips', chipIds });
const text = (value: string): InterviewAnswer => ({ kind: 'text', text: value });

/** Drives a full interview with the given per-question answers. */
function runInterview(session: InterviewSession, answers: Record<string, InterviewAnswer>): string[] {
    const asked: string[] = [];
    for (let i = 0; i < 30 && !session.state.finished; i++) {
        const question = advance(session);
        if (!question) break;
        asked.push(question.id);
        const answer = answers[question.id];
        expect(answer, `no scripted answer for ${question.id}`).toBeDefined();
        submitAnswer(session, question.id, answer);
    }
    return asked;
}

const BOOKING_ANSWERS: Record<string, InterviewAnswer> = {
    'p1-problem': text('Clients text me at all hours to grab grooming slots and I lose track.'),
    'p1-audience': chips('customers'),
    'p1-outcome': text('My calendar fills itself and nobody double-books.'),
    'p2-main-flow': text('A client picks a service, sees open times, books one, and gets a confirmation.'),
    'p2-archetype-pick': chips('booking'),
    'p3-capabilities': chips('booking', 'payments'),
    'p3-payments-model': chips('one-time'),
    'p3-payments-pricing': text('About $60 per appointment'),
    'p3-booking-mode': chips('live-availability'),
    'p3-booking-reminders': chips('yes'),
    'p4-look': { kind: 'skip' },
    'p4-name': text('GroomTime'),
    'p5-confirm': chips('build-it'),
};

describe('interview engine', () => {
    it('walks a booking interview in phase order and finishes under budget', () => {
        const session = newSession();
        const asked = runInterview(session, BOOKING_ANSWERS);

        expect(asked[0]).toBe('p1-problem');
        expect(asked).toEqual([
            'p1-problem', 'p1-audience', 'p1-outcome',
            'p2-main-flow', 'p2-archetype-pick',
            'p3-capabilities', 'p3-payments-model', 'p3-payments-pricing',
            'p3-booking-mode', 'p3-booking-reminders',
            'p4-look', 'p4-name',
            'p5-confirm',
        ]);
        expect(asked.length).toBeLessThanOrEqual(TOTAL_QUESTION_CAP);
        expect(session.state.finished).toBe(true);

        const derived = deriveState(session);
        expect(derived.flags['scheduling.calendar']).toBe(true);
        expect(derived.flags['scheduling.reminders']).toBe(true);
        expect(derived.flags['payments.checkout']).toBe(true);
        // customers + booking/payments => admin back room auto-included, never asked
        expect(asked).not.toContain('p3-backroom');
        expect(derived.flags['admin.dashboard']).toBe(true);
        expect(derived.assumptions.join(' ')).toContain('back room');
        // an admin area requires at least an owner login
        expect(derived.flags['auth.single-admin']).toBe(true);
        expect(derived.credentialsNeeded).toContain('Stripe API keys');
        expect(derived.fields.appName).toBe('GroomTime');
    });

    it('never exceeds per-phase caps in the declared tree', () => {
        const byPhase = new Map<string, number>();
        for (const question of QUESTIONS) {
            byPhase.set(String(question.phase), (byPhase.get(String(question.phase)) ?? 0) + 1);
        }
        // Phase 3 declares more questions than its cap on purpose (branches);
        // every other phase must fit its cap outright.
        for (const [phase, count] of byPhase) {
            if (phase === '3') continue;
            expect(count).toBeLessThanOrEqual(PHASE_CAPS[phase as keyof typeof PHASE_CAPS]);
        }
    });

    it('stops asking once the total budget is exhausted', () => {
        const session = newSession();
        session.state.askedQuestionIds = Array.from({ length: TOTAL_QUESTION_CAP }, (_, i) => `spent-${i}`);
        expect(nextQuestion(session)).toBeNull();
    });

    it('uses triage pre-answers to skip already-answered questions', () => {
        const session = newSession('A booking app for my grooming clients');
        const triage: TriageResult = {
            problem: 'Clients text me at all hours for slots',
            audience: 'customers',
            outcome: null,
            mainFlow: null,
            archetypeGuess: 'booking',
            archetypeConfidence: 'low',
            capabilities: ['booking'],
            paymentsModel: null,
            appNameSuggestion: 'GroomTime',
            lookAndFeel: null,
        };
        applyTriage(session, triage);

        expect(session.state.preAnsweredIds).toContain('p1-problem');
        expect(session.state.preAnsweredIds).toContain('p1-audience');
        expect(session.state.preAnsweredIds).toContain('p3-capabilities');

        const first = advance(session);
        expect(first!.id).toBe('p1-outcome');

        submitAnswer(session, 'p1-outcome', text('A full calendar'));
        const second = advance(session);
        expect(second!.id).toBe('p2-main-flow');
        submitAnswer(session, 'p2-main-flow', text('Pick a time, book it'));

        // Low-confidence guess => the restate-and-confirm question fires,
        // phrased around the guess; "Exactly" locks the archetype in.
        const confirm = advance(session);
        expect(confirm!.id).toBe('p2-archetype-confirm');
        expect(confirm!.text).toContain('booking');
        submitAnswer(session, 'p2-archetype-confirm', chips('exactly'));
        expect(deriveState(session).fields.archetype).toBe('booking');

        // The name suggestion from triage surfaces as a prefill later.
        let question = advance(session);
        while (question && question.id !== 'p4-name') {
            submitAnswer(session, question.id, question.kind === 'free' ? { kind: 'skip' } as InterviewAnswer : chips(question.chips[0].id));
            question = advance(session);
        }
        expect(question?.prefill).toBe('GroomTime');
    });

    it('confident triage skips the archetype questions entirely', () => {
        const session = newSession('booking app');
        applyTriage(session, {
            problem: 'p', audience: 'customers', outcome: 'o', mainFlow: 'm',
            archetypeGuess: 'booking', archetypeConfidence: 'high',
            capabilities: ['booking'], paymentsModel: null,
            appNameSuggestion: null, lookAndFeel: null,
        });
        const derived = deriveState(session);
        expect(derived.fields.archetype).toBe('booking');
        const next = nextQuestion(session);
        // Straight into phase-3 branch follow-ups.
        expect(next!.id).toBe('p3-booking-mode');
    });

    it('a single-user app gets no accounts, no back room, and no auth', () => {
        const session = newSession();
        runInterview(session, {
            'p1-problem': text('I keep losing my reading notes'),
            'p1-audience': chips('just-me'),
            'p1-outcome': text('All my notes in one place'),
            'p2-main-flow': text('I write a note and tag it'),
            'p2-archetype-pick': chips('internal-tool'),
            'p3-capabilities': chips('uploads'),
            'p4-look': { kind: 'skip' },
            'p4-name': { kind: 'skip' },
            'p5-confirm': chips('build-it'),
        });
        const derived = deriveState(session);
        expect(derived.flags['admin.dashboard']).toBeUndefined();
        expect(derived.flags['auth.none']).toBe(true);
        expect(derived.flags['uploads']).toBe(true);
        expect(derived.flags['storage']).toBe(true);
    });

    it('asks the back-room question when the audience is ambiguous and maps its answers', () => {
        const session = newSession();
        const asked = runInterview(session, {
            'p1-problem': text('Our team loses track of equipment'),
            'p1-audience': chips('team'),
            'p1-outcome': text('We always know who has what'),
            'p2-main-flow': text('Someone checks out an item, returns it later'),
            'p2-archetype-pick': chips('internal-tool'),
            'p3-capabilities': chips('uploads'),
            'p3-backroom': chips('yes-roles'),
            'p4-look': { kind: 'skip' },
            'p4-name': { kind: 'skip' },
            'p5-confirm': chips('build-it'),
        });
        expect(asked).toContain('p3-backroom');
        const derived = deriveState(session);
        expect(derived.flags['admin.dashboard']).toBe(true);
        expect(derived.flags['roles.multi']).toBe(true);
    });

    it('"you decide" applies the default and records the assumption', () => {
        const session = newSession();
        runInterview(session, {
            ...BOOKING_ANSWERS,
            'p3-payments-model': { kind: 'delegate' },
        });
        const derived = deriveState(session);
        expect(derived.flags['payments.checkout']).toBe(true);
        expect(derived.assumptions).toContain('We set up simple one-time payments — switching to subscriptions later is easy.');
    });

    it('fires a clarify question on a just-me + roles contradiction', () => {
        const session = newSession();
        const asked: string[] = [];
        const answers: Record<string, InterviewAnswer> = {
            'p1-problem': text('x'),
            'p1-audience': chips('just-me'),
            'p1-outcome': text('y'),
            'p2-main-flow': text('z'),
            'p2-archetype-pick': chips('other'),
            'p3-capabilities': chips('roles'),
            'p3-roles-detail': text('Managers see everything, staff see their own items'),
            'clarify-roles-audience': chips('team'),
            // Resolving the contradiction to "team" makes the back-room
            // question askable (audience is no longer just-me).
            'p3-backroom': chips('no'),
            'p4-look': { kind: 'skip' },
            'p4-name': { kind: 'skip' },
        };
        for (let i = 0; i < 20; i++) {
            const question = advance(session);
            if (!question || question.id === 'p5-confirm') break;
            asked.push(question.id);
            submitAnswer(session, question.id, answers[question.id]);
        }
        expect(asked).toContain('clarify-roles-audience');
        const derived = deriveState(session);
        expect(derived.fields.audience).toBe('team');
        expect(derived.flags['roles.multi']).toBe(true);
    });

    it('"change something" reopens the interview and re-asks confirm without double budget', () => {
        const session = newSession();
        runInterview(session, { ...BOOKING_ANSWERS, 'p5-confirm': chips('change-something') });
        expect(session.state.finished).toBe(false);

        const budgetBefore = session.state.askedQuestionIds.length;
        submitAnswer(session, 'p1-audience', chips('anyone'));
        const reasked = advance(session);
        expect(reasked!.id).toBe('p5-confirm');
        expect(session.state.askedQuestionIds.length).toBe(budgetBefore);

        submitAnswer(session, 'p5-confirm', chips('build-it'));
        expect(session.state.finished).toBe(true);
        expect(deriveState(session).fields.audience).toBe('anyone');
    });

    it('validates answers strictly', () => {
        const session = newSession();
        const first = advance(session);
        expect(first!.id).toBe('p1-problem');
        expect(() => submitAnswer(session, 'p1-problem', { kind: 'skip' })).toThrow(InterviewInputError);
        expect(() => submitAnswer(session, 'p1-problem', chips('nope'))).toThrow(InterviewInputError);
        expect(() => submitAnswer(session, 'p1-audience', chips('just-me'))).toThrow(InterviewInputError);

        submitAnswer(session, 'p1-problem', text('a real problem'));
        const second = advance(session);
        expect(second!.id).toBe('p1-audience');
        expect(() => submitAnswer(session, 'p1-audience', chips('just-me', 'team'))).toThrow(InterviewInputError);
        expect(() => submitAnswer(session, 'p1-audience', text('hello'))).toThrow(InterviewInputError);
        expect(() => submitAnswer(session, 'p1-audience', { kind: 'delegate' })).toThrow(InterviewInputError);
    });

    it('derives EARS criteria and credentials from flags', () => {
        const criteria = expandAcceptanceCriteria({
            'scheduling.calendar': true,
            'payments.subscriptions': true,
            'admin.dashboard': true,
        });
        const texts = criteria.map((c) => c.criterion).join('\n');
        expect(texts).toContain('double-booking');
        expect(texts).toContain('subscribes');
        expect(texts).toContain('deny access');
        expect(criteria.map((c) => c.id)).toEqual(criteria.map((_, i) => `AC-${i + 1}`));

        expect(deriveCredentialsNeeded({ 'payments.subscriptions': true, 'notifications.email': true }))
            .toEqual(['Stripe API keys', 'Email provider API key (e.g. Resend)']);
    });

    it('survives a JSON round-trip mid-interview', () => {
        const session = newSession();
        answerCurrent(session, text('problem'));
        answerCurrent(session, chips('customers'));

        const revived = JSON.parse(JSON.stringify(session)) as InterviewSession;
        const question = advance(revived);
        expect(question!.id).toBe('p1-outcome');
        const summary = buildSummary(revived);
        expect(summary.points.join(' ')).toContain('for your customers');
    });
});
