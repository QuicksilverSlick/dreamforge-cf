/**
 * Post-build improvement suggestions — the consent-priced replacement for
 * auto-invented enhancement phases. Runs ONCE when a generation burst
 * completes (free to the user: proposing costs them nothing) and returns 3-5
 * small, single-iteration enhancement ideas the user can accept as chips.
 * Accepting a chip sends a normal user_suggestion (standard edit price), so
 * the spend is always the user's explicit choice.
 */

import { z } from 'zod';
import { AgentOperation, OperationOptions } from './common';
import { executeInference } from '../inferutils/infer';
import { createUserMessage, createSystemMessage, type Message } from '../inferutils/common';

const SuggestionSchema = z.object({
	suggestions: z
		.array(
			z.object({
				label: z.string().describe('Short verb-phrase chip label, max ~6 words'),
				benefit: z.string().describe('One line: the outcome the user gets'),
				scope: z.string().describe("What it touches, e.g. 'UI only', 'new page', 'game logic'"),
				prompt: z
					.string()
					.describe('The exact request to send to the coding agent when accepted'),
			}),
		)
		.min(2)
		.max(5),
});

export type SuggestionGenerationResult = z.infer<typeof SuggestionSchema>;

export interface SuggestionGenerationInputs {
	/** The user's ORIGINAL ask — suggestions must orbit this, not wander. */
	query: string;
	blueprintTitle: string;
	blueprintDescription: string;
	completedPhaseNames: string[];
}

const SYSTEM_PROMPT = `You propose OPTIONAL next-step enhancements for a just-completed web app build.

Rules:
- Suggestions are OFFERS, not plans. The user decides; nothing runs unless they accept.
- Stay close to the user's original request and the app's existing scope. Small, delightful, single-iteration improvements — never new subsystems, accounts, databases, or feature sprawl.
- Each suggestion must be implementable in ONE follow-up iteration (one request).
- Vary the categories: one visual polish, one gameplay/UX improvement, one practical addition works well.
- Labels are short verb phrases; benefits are outcome-framed ("so you can…", "makes it feel…").
- The prompt field is what the coding agent will receive verbatim — make it specific and self-contained.`;

export class SuggestionGenerationOperation extends AgentOperation<
	SuggestionGenerationInputs,
	SuggestionGenerationResult
> {
	async execute(
		inputs: SuggestionGenerationInputs,
		options: OperationOptions,
	): Promise<SuggestionGenerationResult> {
		const { env, logger } = options;
		const messages: Message[] = [
			createSystemMessage(SYSTEM_PROMPT),
			createUserMessage(
				`Original user request: ${inputs.query}\n\n` +
					`App: ${inputs.blueprintTitle} — ${inputs.blueprintDescription}\n\n` +
					`Phases already implemented:\n${inputs.completedPhaseNames.map((n) => `- ${n}`).join('\n')}\n\n` +
					`Propose 3-5 enhancement chips.`,
			),
		];

		const { object: result } = await executeInference({
			env,
			messages,
			// Rides the cheap conversational model config — suggestions are a
			// low-stakes, low-cost call on the platform's dime.
			agentActionName: 'conversationalResponse',
			schema: SuggestionSchema,
			context: options.inferenceContext,
		});

		logger.info('Generated improvement suggestions', {
			count: result.suggestions.length,
		});
		return result;
	}
}
