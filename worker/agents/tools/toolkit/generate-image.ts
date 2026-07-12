import { ErrorResult, ToolDefinition } from '../types';
import { StructuredLogger } from '../../../logger';
import { CodingAgentInterface } from 'worker/agents/services/implementations/CodingAgent';
import type { ImageGenerationRequest } from '../../services/interfaces/ICodingAgent';

type GenerateImageArgs = {
	path: string;
	prompt: string;
	purpose: ImageGenerationRequest['purpose'];
	width?: number;
	height?: number;
};

type GenerateImageResult = { message: string } | ErrorResult;

export function createGenerateImageTool(
	agent: CodingAgentInterface,
	logger: StructuredLogger,
): ToolDefinition<GenerateImageArgs, GenerateImageResult> {
	return {
		type: 'function' as const,
		function: {
			name: 'generate_image',
			description:
				'Generate a NEW image asset (logo, icon, hero image, background, illustration, avatar, or photo) ' +
				'from a text description with a dedicated image model and add it to the app. ONLY for images the ' +
				'user did NOT supply: if the user attached an image they want used in the app, call ' +
				'use_attached_image instead — NEVER generate a lookalike of a user-supplied image. The image is ' +
				'generated and hosted automatically, then wired into the app on the next development phase. To ' +
				'replace an existing asset, reuse its `path`. Do NOT use this for icons that an icon library ' +
				'(lucide-react etc.), CSS, SVG, or canvas can produce.',
			parameters: {
				type: 'object',
				additionalProperties: false,
				properties: {
					path: {
						type: 'string',
						description:
							'Identifier/location for the asset, e.g. "public/logo.png" or "hero". Reuse an existing ' +
							'asset\'s path to replace it.',
					},
					prompt: {
						type: 'string',
						minLength: 8,
						description:
							'Detailed, descriptive prompt for the image. Describe subject, style, mood, and any text ' +
							'to render. The system tunes this per image model automatically.',
					},
					purpose: {
						type: 'string',
						enum: ['logo', 'icon', 'hero', 'background', 'illustration', 'avatar', 'photo'],
						description: 'Role of the asset; drives model-specific prompt tuning.',
					},
					width: {
						type: 'number',
						description: 'Optional desired width in pixels (divisible by 16).',
					},
					height: {
						type: 'number',
						description: 'Optional desired height in pixels (divisible by 16).',
					},
				},
				required: ['path', 'prompt', 'purpose'],
			},
		},
		implementation: async (args) => {
			try {
				logger.info('Received image generation request', {
					path: args.path,
					purpose: args.purpose,
				});
				const url = await agent.queueImageGeneration({
					path: args.path,
					prompt: args.prompt,
					purpose: args.purpose,
					width: args.width ?? null,
					height: args.height ?? null,
				});
				if (!url) {
					return { error: `Failed to generate image asset for "${args.path}".` };
				}
				return {
					message:
						`Generated image asset for "${args.path}" (available at ${url}). ` +
						`It will be wired into the app on the next development phase.`,
				};
			} catch (error) {
				return {
					error:
						error instanceof Error
							? `Failed to generate image: ${error.message}`
							: 'Unknown error occurred while generating image',
				};
			}
		},
	};
}
