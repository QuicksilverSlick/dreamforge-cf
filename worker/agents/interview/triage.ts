/**
 * Interview triage: one structured-output call that extracts everything the
 * user's first prompt already answered, so the interview never asks for it
 * again. Failure is non-fatal — the interview simply asks everything.
 */

import { z } from 'zod';
import { createSystemMessage, createUserMessage } from '../inferutils/common';
import { executeInference } from '../inferutils/infer';
import type { InferenceContext } from '../inferutils/config.types';
import { createLogger } from '../../logger';
import type { TriageResult } from './types';

const logger = createLogger('InterviewTriage');

const TriageSchema = z.object({
    problem: z.string().nullable().describe('The problem the user explicitly described, in their own words. null if not stated.'),
    audience: z.enum(['just-me', 'team', 'customers', 'anyone']).nullable()
        .describe('Who will use the app, ONLY if explicitly stated.'),
    outcome: z.string().nullable().describe('The success outcome the user explicitly described. null if not stated.'),
    mainFlow: z.string().nullable().describe('The main user flow, ONLY if the user actually described steps.'),
    archetypeGuess: z.enum(['booking', 'store', 'portal', 'internal-tool', 'community', 'content', 'dashboard', 'other']).nullable()
        .describe('Best-guess app archetype from the description.'),
    archetypeConfidence: z.enum(['high', 'low'])
        .describe('high ONLY when the prompt unambiguously describes this archetype.'),
    capabilities: z.array(z.enum(['accounts', 'payments', 'booking', 'selling', 'uploads', 'notifications', 'roles']))
        .describe('Capabilities the user EXPLICITLY asked for. Never infer.'),
    paymentsModel: z.enum(['one-time', 'subscriptions', 'invoices']).nullable()
        .describe('How people pay, ONLY if explicitly stated.'),
    appNameSuggestion: z.string().nullable()
        .describe('The app name if the user gave one, else a short friendly suggestion.'),
    lookAndFeel: z.string().nullable().describe('Visual style or reference sites, ONLY if stated.'),
});

const SYSTEM_PROMPT = `You extract facts from a user's app idea so an intake interview can skip questions they already answered.

RULES:
- Extract ONLY what the user explicitly stated. Never infer, never embellish, never fill gaps.
- A field is null unless the prompt clearly answers it. An empty capabilities array is normal.
- archetypeGuess is your one allowed inference; mark archetypeConfidence "high" only when unambiguous.
- Keep extracted text in the user's own words, lightly cleaned.`;

export async function runTriage(
    env: Env,
    inferenceContext: InferenceContext,
    initialPrompt: string,
): Promise<TriageResult | null> {
    const trimmed = initialPrompt.trim();
    if (trimmed === '') {
        return null;
    }
    try {
        const { object: triage } = await executeInference({
            env,
            agentActionName: 'interviewTriage',
            schema: TriageSchema,
            context: inferenceContext,
            maxTokens: 4000,
            messages: [
                createSystemMessage(SYSTEM_PROMPT),
                createUserMessage(`The user's app idea:\n\n"""${trimmed}"""`),
            ],
        });
        return triage;
    } catch (error) {
        logger.error('Interview triage failed; continuing without pre-answers', error);
        return null;
    }
}
