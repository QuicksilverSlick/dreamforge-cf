import { ToolDefinition } from '../types';
import { StructuredLogger } from '../../../logger';
import { CodingAgentInterface } from 'worker/agents/services/implementations/CodingAgent';
import type { ProcessedImageAttachment } from 'worker/types/image-attachment';
import type { ImageGenerationRequest } from '../../services/interfaces/ICodingAgent';

type UseAttachedImageArgs = {
	path: string;
	purpose: ImageGenerationRequest['purpose'];
	imageIndex?: number;
};

type UseAttachedImageResult = { message: string } | { error: string };

/**
 * Binds an image the USER attached to their message into the app as a real
 * asset — the counterpart to generate_image for user-supplied images. The
 * upload path already hosted the file at a public URL, so this only merges it
 * into the asset manifest and queues the wiring request; nothing is generated.
 */
export function createUseAttachedImageTool(
	agent: CodingAgentInterface,
	logger: StructuredLogger,
	images: ProcessedImageAttachment[],
): ToolDefinition<UseAttachedImageArgs, UseAttachedImageResult> {
	return {
		type: 'function' as const,
		function: {
			name: 'use_attached_image',
			description:
				'Place an image the user ATTACHED to their current message into the app as a real asset ' +
				'(logo, icon, hero, background, illustration, avatar, or photo). The image is already uploaded ' +
				'and hosted — this binds it into the app and wires it in on the next development phase. ' +
				'ALWAYS use this instead of generate_image when the user supplied the image themselves.',
			parameters: {
				type: 'object',
				additionalProperties: false,
				properties: {
					path: {
						type: 'string',
						description:
							'Identifier/location for the asset, e.g. "public/logo.png" or "hero". Reuse an existing ' +
							"asset's path to replace it.",
					},
					purpose: {
						type: 'string',
						enum: ['logo', 'icon', 'hero', 'background', 'illustration', 'avatar', 'photo'],
						description: 'Role of the asset in the app.',
					},
					imageIndex: {
						type: 'number',
						description:
							'Zero-based index of the attached image to use when the user attached more than one (default 0).',
					},
				},
				required: ['path', 'purpose'],
			},
		},
		implementation: async (args) => {
			if (images.length === 0) {
				return {
					error:
						'No image is attached to the CURRENT message. Images from earlier messages are not ' +
						'reachable — ask the user to attach the image again to this conversation, then retry.',
				};
			}
			const image = images[args.imageIndex ?? 0];
			if (!image) {
				return { error: `No attached image at index ${args.imageIndex ?? 0}; the current message has ${images.length}.` };
			}
			try {
				logger.info('Binding attached image as app asset', {
					path: args.path,
					purpose: args.purpose,
				});
				const url = await agent.registerUploadedAsset(
					{ path: args.path, purpose: args.purpose },
					image,
				);
				if (!url) {
					return { error: `Could not add the attached image as an app asset for "${args.path}".` };
				}
				return {
					message:
						`Added the attached image as "${args.path}" (hosted at ${url}). ` +
						`It will be wired into the app on the next development phase.`,
				};
			} catch (error) {
				return {
					error:
						error instanceof Error
							? `Failed to use attached image: ${error.message}`
							: 'Unknown error occurred while using the attached image',
				};
			}
		},
	};
}
