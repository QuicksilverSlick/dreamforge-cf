/**
 * Interview synthesis: folds the finished interview into the build spec —
 * user stories + a rich enhanced build query. Acceptance criteria, capability
 * flags, assumptions, and credentials are deterministic (capabilityMap); the
 * LLM only writes the narrative parts. A synthesis failure falls back to a
 * fully deterministic spec so the interview can never dead-end.
 */

import { z } from 'zod';
import { createSystemMessage, createUserMessage } from '../inferutils/common';
import { executeInference } from '../inferutils/infer';
import type { InferenceContext } from '../inferutils/config.types';
import { createLogger } from '../../logger';
import { expandAcceptanceCriteria, ARCHETYPE_LABELS } from './capabilityMap';
import { deriveState } from './engine';
import type { CapabilityFlags, DerivedState, InterviewSession, InterviewSpec, UserStory } from './types';

function toFlagRecord(flags: CapabilityFlags): Record<string, boolean> {
    const record: Record<string, boolean> = {};
    for (const [flag, enabled] of Object.entries(flags)) {
        if (enabled !== undefined) {
            record[flag] = enabled;
        }
    }
    return record;
}

const logger = createLogger('InterviewSynthesis');

const SynthesisSchema = z.object({
    problem: z.string().describe('The problem statement, in the user\'s own vocabulary, 1-3 sentences.'),
    outcome: z.string().describe('What success looks like for the owner, 1-2 sentences.'),
    usersAndRoles: z.string().describe('Who uses the app and what each kind of person can do, plain language.'),
    userStories: z.array(z.object({
        id: z.string().describe('US-1, US-2, ...'),
        story: z.string().describe('As a ..., I want ..., so that ...'),
    })).describe('5-12 user stories covering the main flow and every selected capability.'),
    enhancedQuery: z.string().describe('A complete, well-structured build brief for the app generator: what to build, who it serves, the main flow, every capability, the admin area if any, and look-and-feel. Written as a directive, not a conversation.'),
});

const SYSTEM_PROMPT = `You turn a finished intake interview into a build specification for an AI app generator.

RULES:
- Use ONLY what the interview established. Do not invent features that were not selected.
- Keep the user's vocabulary for domain words; write clearly and concretely.
- The enhancedQuery is the single most important output: it must let the generator build the right app in one pass. Include the problem, audience, main flow step-by-step, every selected capability (and how it behaves), the private admin area when present, and visual direction.
- Every selected capability must appear in at least one user story.`;

function describeInterview(session: InterviewSession, derived: DerivedState): string {
    const { fields, flags } = derived;
    const lines: string[] = [];
    lines.push(`Original idea: ${session.initialPrompt || '(none given)'}`);
    if (fields.problem) lines.push(`Problem: ${fields.problem}`);
    if (fields.audience) lines.push(`Audience: ${fields.audience}`);
    if (fields.outcome) lines.push(`Success outcome: ${fields.outcome}`);
    if (fields.mainFlow) lines.push(`Main flow: ${fields.mainFlow}`);
    if (fields.archetype) lines.push(`App type: ${ARCHETYPE_LABELS[fields.archetype]}`);
    const activeFlags = Object.entries(flags).filter(([, on]) => on).map(([flag]) => flag);
    lines.push(`Capability flags: ${activeFlags.join(', ') || 'none'}`);
    if (fields.paymentsModel) lines.push(`Payments model: ${fields.paymentsModel}`);
    if (fields.pricingNotes) lines.push(`Pricing notes: ${fields.pricingNotes}`);
    if (fields.bookingMode) lines.push(`Booking mode: ${fields.bookingMode}`);
    if (fields.signupPolicy) lines.push(`Signup policy: ${fields.signupPolicy}`);
    if (fields.catalogScale) lines.push(`Catalog size: ${fields.catalogScale}`);
    if (fields.rolesDetail) lines.push(`Roles: ${fields.rolesDetail}`);
    if (fields.lookAndFeel) lines.push(`Look and feel: ${fields.lookAndFeel}`);
    if (fields.appName ?? fields.appNameSuggestion) {
        lines.push(`App name: ${fields.appName ?? fields.appNameSuggestion}`);
    }
    if (derived.assumptions.length > 0) {
        lines.push(`Defaults we chose for the user: ${derived.assumptions.join(' | ')}`);
    }
    return lines.join('\n');
}

function buildSpec(
    derived: DerivedState,
    narrative: { problem: string; outcome: string; usersAndRoles: string; userStories: UserStory[]; enhancedQuery: string },
): InterviewSpec {
    return {
        problem: narrative.problem,
        outcome: narrative.outcome,
        usersAndRoles: narrative.usersAndRoles,
        userStories: narrative.userStories,
        acceptanceCriteria: expandAcceptanceCriteria(derived.flags),
        capabilityFlags: toFlagRecord(derived.flags),
        assumptions: derived.assumptions,
        credentialsNeeded: derived.credentialsNeeded,
        lookAndFeel: derived.fields.lookAndFeel ?? null,
        appName: derived.fields.appName ?? derived.fields.appNameSuggestion ?? null,
        enhancedQuery: narrative.enhancedQuery,
    };
}

/** Deterministic fallback so a model outage never strands a finished interview. */
export function buildFallbackSpec(session: InterviewSession): InterviewSpec {
    const derived = deriveState(session);
    return buildSpec(derived, {
        problem: derived.fields.problem ?? session.initialPrompt,
        outcome: derived.fields.outcome ?? 'The app works end-to-end for its main flow.',
        usersAndRoles: derived.fields.audience ?? 'unspecified',
        userStories: [],
        enhancedQuery: describeInterview(session, derived),
    });
}

export async function runSynthesis(
    env: Env,
    inferenceContext: InferenceContext,
    session: InterviewSession,
): Promise<InterviewSpec> {
    const derived = deriveState(session);
    try {
        const { object: narrative } = await executeInference({
            env,
            agentActionName: 'interviewSynthesis',
            schema: SynthesisSchema,
            context: inferenceContext,
            maxTokens: 8000,
            messages: [
                createSystemMessage(SYSTEM_PROMPT),
                createUserMessage(`The finished interview:\n\n${describeInterview(session, derived)}`),
            ],
        });
        return buildSpec(derived, narrative);
    } catch (error) {
        logger.error('Interview synthesis failed; returning deterministic fallback spec', error);
        return buildFallbackSpec(session);
    }
}
