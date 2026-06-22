/**
 * WebSocket message routing for the new `CodeGeneratorAgent`
 * (codingAgent.ts). Ported from upstream `cloudflare/vibesdk`
 * `worker/agents/core/websocket.ts` (M3 commit 3).
 *
 * Coexists with the legacy `./websocket.ts` handler (typed against the
 * live `SimpleCodeGeneratorAgent`); the two are kept separate so the
 * live runtime path is untouched until M3 commit 4 deletes simpleGen +
 * the legacy handler. The send helpers (`sendToConnection`, `sendError`)
 * are reused from `./websocket.ts` rather than duplicated.
 *
 * **Adaptations vs upstream:**
 *   - `SESSION_INIT`, `VAULT_LOCKED`, `VAULT_UNLOCKED` cases are dropped —
 *     the fork has no such WS message constants (`SESSION_INIT` was never
 *     defined; the vault was tombstoned with `UserSecretsStore` in DO
 *     migration v5, secrets are handled in D1 at the controller layer).
 *   - The `credentials` field (`CredentialsPayload`) is dropped from the
 *     incoming-message shape — it only fed the disabled `SESSION_INIT`
 *     path and the type does not exist in the fork.
 *   - `handleWebSocketClose` only logs — there is no vault session to
 *     clear.
 *   - The `TERMINAL_COMMAND` case stays disabled (as upstream).
 */
import { Connection } from 'agents';
import { createLogger } from '../../logger';
import { WebSocketMessageRequests, WebSocketMessageResponses } from '../constants';
import { MAX_IMAGES_PER_MESSAGE, MAX_IMAGE_SIZE_BYTES, type ImageAttachment } from '../../types/image-attachment';
import { checkUsageAndBalance } from '../../services/rate-limit';
import type { CodeGeneratorAgent } from './codingAgent';
import { sendToConnection, sendError } from './websocket';
import { ensureCanDrive, claimDriver, releaseDriver, handlePresenceOnClose } from './presence';

/**
 * Commands that DRIVE the shared build (mutate state / spend the creator's
 * credits). Gated by the single-driver seat: only the current driver runs them;
 * a non-driver is soft-blocked with a take-over affordance. Read-only commands
 * (model configs, conversation state) and the driver claim/release are NOT here.
 *
 * STOP_GENERATION is deliberately NOT gated: halting a runaway generation only
 * CANCELS inference (it stops spend, it doesn't drive new work), so any member
 * watching a shared session must be able to pull the brake even when another
 * member holds the seat.
 */
const DRIVING_COMMANDS = new Set<string>([
    WebSocketMessageRequests.GENERATE_ALL,
    WebSocketMessageRequests.DEPLOY,
    WebSocketMessageRequests.PREVIEW,
    WebSocketMessageRequests.CAPTURE_SCREENSHOT,
    WebSocketMessageRequests.RESUME_GENERATION,
    WebSocketMessageRequests.USER_SUGGESTION,
    WebSocketMessageRequests.CLEAR_CONVERSATION,
]);

interface IncomingWebSocketMessage {
    type: string;
    message?: string;
    images?: ImageAttachment[];
    data?: {
        url?: string;
        viewport?: unknown;
        [key: string]: unknown;
    };
}

const logger = createLogger('CodeGeneratorWebSocket');

export async function handleWebSocketMessage(
    agent: CodeGeneratorAgent,
    connection: Connection,
    message: string,
): Promise<void> {
    try {
        logger.info(`Received WebSocket message from ${connection.id}: ${message}`);
        const parsedMessage = JSON.parse(message) as IncomingWebSocketMessage;

        // Single-driver gate (soft): a non-driver's driving command is not run
        // concurrently — they're notified who's driving and may take over.
        if (DRIVING_COMMANDS.has(parsedMessage.type) && !ensureCanDrive(agent, connection)) {
            return;
        }

        switch (parsedMessage.type) {
            case WebSocketMessageRequests.GENERATE_ALL:
                agent.setState({
                    ...agent.state,
                    shouldBeGenerating: true,
                });

                if (agent.getBehavior().isCodeGenerating()) {
                    logger.info('Generation already in progress, skipping duplicate request');
                    return;
                }

                logger.info('Starting code generation process');
                agent
                    .getBehavior()
                    .generateAllFiles()
                    .catch((error) => {
                        logger.error('Error during code generation:', error);
                        sendError(
                            connection,
                            `Error generating files: ${error instanceof Error ? error.message : String(error)}`,
                        );
                    })
                    .finally(() => {
                        if (!agent.getBehavior().isCodeGenerating()) {
                            agent.setState({
                                ...agent.state,
                                shouldBeGenerating: false,
                            });
                        }
                    });
                break;
            case WebSocketMessageRequests.DEPLOY:
                agent
                    .deployProject()
                    .then((deploymentResult) => {
                        if (!deploymentResult.success) {
                            logger.error('Deployment failed', deploymentResult);
                            return;
                        }
                        logger.info('Deployment completed', deploymentResult);
                    })
                    .catch((error: unknown) => {
                        logger.error('Error during deployment:', error);
                    });
                break;
            case WebSocketMessageRequests.PREVIEW:
                logger.info('Deploying for preview');
                agent
                    .getBehavior()
                    .deployToSandbox()
                    .then((deploymentResult) => {
                        logger.info('Preview deployed successfully!, deploymentResult:', deploymentResult);
                    })
                    .catch((error: unknown) => {
                        logger.error('Error during preview deployment:', error);
                    });
                break;
            case WebSocketMessageRequests.CAPTURE_SCREENSHOT:
                if (!parsedMessage.data?.url) {
                    sendError(connection, 'Missing url for screenshot capture');
                    return;
                }
                agent
                    .getBehavior()
                    .captureScreenshot(
                        parsedMessage.data.url,
                        parsedMessage.data.viewport as { width: number; height: number } | undefined,
                    )
                    .then((screenshotResult) => {
                        if (!screenshotResult) {
                            logger.error('Failed to capture screenshot');
                            return;
                        }
                        logger.info('Screenshot captured successfully!', screenshotResult);
                    })
                    .catch((error: unknown) => {
                        logger.error('Error during screenshot capture:', error);
                    });
                break;
            case WebSocketMessageRequests.STOP_GENERATION: {
                logger.info('User requested to stop generation');

                const wasCancelled = agent.getBehavior().cancelCurrentInference();

                agent.setState({
                    ...agent.state,
                    shouldBeGenerating: false,
                });

                sendToConnection(connection, WebSocketMessageResponses.GENERATION_STOPPED, {
                    message: wasCancelled
                        ? 'Inference operation cancelled successfully'
                        : 'No active inference to cancel',
                });
                break;
            }
            case WebSocketMessageRequests.RESUME_GENERATION:
                logger.info('Resuming code generation');
                agent.setState({
                    ...agent.state,
                    shouldBeGenerating: true,
                });

                if (!agent.getBehavior().isCodeGenerating()) {
                    sendToConnection(connection, WebSocketMessageResponses.GENERATION_RESUMED, {
                        message: 'Code generation resumed',
                    });
                    agent
                        .getBehavior()
                        .generateAllFiles()
                        .catch((error) => {
                            logger.error('Error resuming code generation:', error);
                            sendError(
                                connection,
                                `Error resuming generation: ${error instanceof Error ? error.message : String(error)}`,
                            );
                        });
                }
                break;
            case WebSocketMessageRequests.GITHUB_EXPORT:
                // DEPRECATED: WebSocket-based GitHub export replaced with OAuth flow.
                sendToConnection(connection, WebSocketMessageResponses.GITHUB_EXPORT_ERROR, {
                    message: 'GitHub export via WebSocket is deprecated',
                    error: 'Please use the GitHub export button which will redirect you to authorize with GitHub OAuth',
                });
                break;
            case WebSocketMessageRequests.USER_SUGGESTION:
                logger.info('Received user suggestion', {
                    messageLength: parsedMessage.message?.length || 0,
                    hasImages: !!parsedMessage.images && parsedMessage.images.length > 0,
                    imageCount: parsedMessage.images?.length || 0,
                });

                if (!parsedMessage.message) {
                    sendError(connection, 'No message provided in user suggestion');
                    return;
                }

                if (parsedMessage.images && parsedMessage.images.length > 0) {
                    if (parsedMessage.images.length > MAX_IMAGES_PER_MESSAGE) {
                        sendError(
                            connection,
                            `Maximum ${MAX_IMAGES_PER_MESSAGE} images allowed per message. Received ${parsedMessage.images.length} images.`,
                        );
                        return;
                    }

                    for (const image of parsedMessage.images) {
                        if (image.size && image.size > MAX_IMAGE_SIZE_BYTES) {
                            sendError(
                                connection,
                                `Image "${image.filename}" exceeds maximum size of ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB`,
                            );
                            return;
                        }
                    }
                }

                try {
                    const env = agent.env;
                    const userId = agent.state.metadata.userId;

                    // The encrypted blob was captured from the HttpOnly cookie at WS
                    // upgrade time (see codingAgent.onConnect) and stored in DO state.
                    // WS frames do not carry cookies, so we rely on that snapshot.
                    const userToken = agent.state.cloudflareToken || null;
                    const wsOrigin = agent.state.wsOrigin || undefined;
                    const limitResult = await checkUsageAndBalance(env, userId, undefined, userToken, wsOrigin);

                    if (limitResult.refreshedBlob) {
                        agent.setState({ ...agent.state, cloudflareToken: limitResult.refreshedBlob });
                    }

                    if (!limitResult.allowed) {
                        logger.warn('User suggestion blocked by usage check', {
                            userId,
                            reason: limitResult.reason,
                            withinLimits: limitResult.withinLimits,
                            remaining: limitResult.remaining,
                            hasUserToken: limitResult.hasUserToken,
                            balance: limitResult.balance,
                        });

                        sendToConnection(connection, WebSocketMessageResponses.ERROR, {
                            error: limitResult.reason,
                            code: 'USAGE_LIMIT_EXCEEDED',
                            showAsPopup: true,
                        });
                        return;
                    }
                } catch (error) {
                    logger.error('Failed to check usage:', error);
                    sendToConnection(connection, WebSocketMessageResponses.ERROR, {
                        error: `Error processing request: ${error instanceof Error ? error.message : String(error)}`,
                        showAsPopup: true,
                    });
                    return;
                }

                agent.handleUserInput(parsedMessage.message, parsedMessage.images).catch((error: unknown) => {
                    logger.error('Error handling user suggestion:', error);
                    sendError(
                        connection,
                        `Error processing user suggestion: ${error instanceof Error ? error.message : String(error)}`,
                    );
                });
                break;
            case WebSocketMessageRequests.GET_MODEL_CONFIGS:
                logger.info('Fetching model configurations');
                agent
                    .getBehavior()
                    .getModelConfigsInfo()
                    .then((configsInfo) => {
                        sendToConnection(connection, WebSocketMessageResponses.MODEL_CONFIGS_INFO, {
                            message: 'Model configurations retrieved',
                            configs: configsInfo,
                        });
                    })
                    .catch((error: unknown) => {
                        logger.error('Error fetching model configs:', error);
                        sendError(
                            connection,
                            `Error fetching model configurations: ${error instanceof Error ? error.message : String(error)}`,
                        );
                    });
                break;
            case WebSocketMessageRequests.CLEAR_CONVERSATION:
                logger.info('Clearing conversation history');
                agent.clearConversation();
                break;
            case WebSocketMessageRequests.GET_CONVERSATION_STATE:
                try {
                    const state = agent.getConversationState();
                    const debugState = agent.getBehavior().getDeepDebugSessionState();
                    logger.info('Conversation state retrieved', state);
                    sendToConnection(connection, WebSocketMessageResponses.CONVERSATION_STATE, {
                        state,
                        deepDebugSession: debugState,
                    });
                } catch (error) {
                    logger.error('Error fetching conversation state:', error);
                    sendError(
                        connection,
                        `Error fetching conversation state: ${error instanceof Error ? error.message : String(error)}`,
                    );
                }
                break;
            case WebSocketMessageRequests.CLAIM_DRIVER:
                claimDriver(agent, connection);
                break;
            case WebSocketMessageRequests.RELEASE_DRIVER:
                releaseDriver(agent, connection);
                break;
            default:
                sendError(connection, `Unknown message type: ${parsedMessage.type}`);
        }
    } catch (error) {
        logger.error('Error processing WebSocket message:', error);
        sendError(connection, `Error processing message: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export function handleWebSocketClose(agent: CodeGeneratorAgent, connection: Connection): void {
    logger.info(`WebSocket connection closed: ${connection.id}`);
    handlePresenceOnClose(agent, connection);
}
