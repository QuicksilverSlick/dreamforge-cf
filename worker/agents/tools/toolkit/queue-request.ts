import { ToolDefinition } from '../types';
import { StructuredLogger } from '../../../logger';
import { CodingAgentInterface } from 'worker/agents/services/implementations/CodingAgent';
import type { ProcessedImageAttachment } from 'worker/types/image-attachment';

type QueueRequestArgs = {
	modificationRequest: string;
};

export function createQueueRequestTool(
	agent: CodingAgentInterface,
	logger: StructuredLogger,
	images?: ProcessedImageAttachment[],
): ToolDefinition<QueueRequestArgs, null> {
	return {
		type: 'function' as const,
		function: {
			name: 'queue_request',
			description:
				'Queue up modification requests or changes, to be implemented in the next development phase. ' +
				'Images the user attached to the current message ride along as visual context for the next ' +
				'build step — still describe in words what matters about them.',
			parameters: {
				type: 'object',
				additionalProperties: false,
				properties: {
					modificationRequest: {
						type: 'string',
						minLength: 8,
						description:
							'The changes needed to be made to the app. No code snippets — but DO include every concrete ' +
							'fact the builder needs: exact library/plugin/package names, versions, technique names, ' +
							'reference URLs, and (for changes based on web research) a short summary of what you found. ' +
							'The builder cannot see this conversation or your tool results; anything not written here is lost.',
					},
				},
				required: ['modificationRequest'],
			},
		},
		implementation: async (args) => {
			logger.info('Received app edit request', {
				modificationRequest: args.modificationRequest,
				imageCount: images?.length ?? 0,
			});
			agent.queueRequest(args.modificationRequest, images);
            return null;
		},
	};
}
