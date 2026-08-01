/**
 * WebSocket message routing for the live `CodeGeneratorAgent`
 * (codingAgent.ts), the exported `CodeGenObject` Durable Object. Ported
 * from upstream `cloudflare/vibesdk` `worker/agents/core/websocket.ts`.
 *
 * The send helpers (`sendToConnection`, `sendError`) come from
 * `./websocketHelpers.ts` rather than being duplicated here.
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
import type { AttachmentRef } from '../../types/attachment';
import { resolveAttachedDocuments } from '../../services/attachments/resolve';
import { checkUsageAndBalance } from '../../services/rate-limit';
import { meterSparkAction, refundSparkAction } from '../../services/billing/metering';
import { captureMessage } from '@sentry/cloudflare';
import { hasJustStalled, stalledAlertMessage, stalledUserMessage } from './stalledBuild';
import { generateId } from '../../utils/idGenerator';
import type { CodeGeneratorAgent } from './codingAgent';
import { sendToConnection, sendError } from './websocketHelpers';
import {
    ensureCanDrive,
    claimDriver,
    releaseDriver,
    handlePresenceOnClose,
    connectionImpersonation,
    takeoverGateDecision,
    realUserConnections,
    identityOf,
    broadcastPresence,
} from './presence';
import { AuditLogService, AdminAuditAction } from '../../database/services/AuditLogService';
import type { PendingTakeover } from './state';
import type { UserRole } from '../../types/auth-types';

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
    // A manual code edit mutates the app + redeploys, so it is a driving command:
    // gated by the single-driver seat, blocked for read-only impersonation, and
    // consent-gated for a writable impersonation — exactly like the others.
    WebSocketMessageRequests.USER_EDIT_FILE,
]);

/** Hard cap on a single manual file edit (a generated source file never approaches it). */
const MAX_USER_EDIT_BYTES = 1024 * 1024; // 1 MB

interface IncomingWebSocketMessage {
    type: string;
    message?: string;
    images?: ImageAttachment[];
    /** Refs to already-uploaded build attachments (USER_SUGGESTION, mid-build). */
    attachments?: AttachmentRef[];
    data?: {
        url?: string;
        viewport?: unknown;
        [key: string]: unknown;
    };
    // Consent-gated takeover decision (TAKEOVER_DECISION), real user → server.
    requestId?: string;
    allow?: boolean;
    // Manual file edit (USER_EDIT_FILE), editor → server.
    filePath?: string;
    fileContents?: string;
}

/** Consent-gated takeover tunables (privileged impersonation only). */
const TAKEOVER_CONSENT_TIMEOUT_SECONDS = 30; // auto-DENY on no response (fail-closed)
const TAKEOVER_THROTTLE_MAX = 3; // re-requests allowed per operator per window
const TAKEOVER_THROTTLE_WINDOW_MS = 5 * 60 * 1000;

const logger = createLogger('CodeGeneratorWebSocket');

/**
 * Best-effort audit of an operator driving an app while impersonating, attributed
 * to the real actor (not the customer the frame is running AS). Fire-and-forget:
 * the agent stays alive processing the command, so the floating insert resolves;
 * a failure must never block the user's command.
 */
function auditImpersonatedDrive(
    agent: CodeGeneratorAgent,
    impersonation: { actorId: string; targetId: string; readOnly: boolean },
    command: string,
): void {
    void new AuditLogService(agent.env)
        .record({
            actorId: impersonation.actorId,
            entityType: 'app',
            entityId: agent.getAgentId(),
            action: AdminAuditAction.IMPERSONATION_ACTION,
            newValues: { command, channel: 'websocket', targetUserId: impersonation.targetId },
        })
        .catch((error) => {
            logger.error('Failed to audit impersonated WS drive', error);
        });
}

/**
 * Consent-gated takeover (privileged impersonation only). Returns true if the
 * operator may drive now; false when the command must be WITHHELD (consent is
 * pending, blocked by another operator's in-flight request, or throttled). On a
 * fresh 'request' it prompts the real user's connection(s), schedules the
 * fail-closed auto-deny, and audits the request — then withholds. MUST be called
 * BEFORE ensureCanDrive (C1): under impersonation the operator's userId equals the
 * target's, so the seat's `current === me` shortcut would otherwise let the
 * operator drive with no consent.
 */
async function requireTakeoverConsent(
    agent: CodeGeneratorAgent,
    connection: Connection,
    impersonation: { actorId: string; targetId: string; actorRole: UserRole | null },
): Promise<boolean> {
    switch (takeoverGateDecision(agent, connection)) {
        case 'allow':
            return true;
        case 'pending':
            return false; // already awaiting this operator's consent — keep waiting
        case 'blocked':
            sendError(connection, 'Another takeover request for this user is already in progress.');
            return false;
        case 'request':
            await startTakeoverRequest(agent, connection, impersonation);
            return false;
    }
}

async function startTakeoverRequest(
    agent: CodeGeneratorAgent,
    connection: Connection,
    impersonation: { actorId: string; targetId: string; actorRole: UserRole | null },
): Promise<void> {
    // Throttle keyed on the operator's REAL actorId (C7: survives a reconnect,
    // unlike connection.id) so the user can't be prompt-bombed into consenting.
    if (isTakeoverThrottled(agent, impersonation.actorId)) {
        sendError(connection, 'Too many takeover requests. Please wait a few minutes before trying again.');
        return;
    }
    const requestId = crypto.randomUUID(); // crypto-random + single-use (C5)
    const now = Date.now();
    const expiresAt = now + TAKEOVER_CONSENT_TIMEOUT_SECONDS * 1000;
    const isAgent = impersonation.actorRole === 'ai_support' || impersonation.actorRole === 'ai_admin';

    recordTakeoverRequest(agent, {
        requestId,
        operatorConnectionId: connection.id,
        targetUserId: impersonation.targetId,
        actorId: impersonation.actorId,
        actorRole: impersonation.actorRole,
        requestedAt: now,
        expiresAt,
    });

    const reasonUser = `${operatorRoleLabel(impersonation.actorRole, isAgent)} is requesting to take over and make changes to this app on your behalf.`;
    for (const real of realUserConnections(agent, impersonation.targetId, connection.id)) {
        sendToConnection(real, WebSocketMessageResponses.TAKEOVER_REQUEST, {
            requestId,
            operatorRole: impersonation.actorRole,
            isAgent,
            appId: agent.getAgentId(),
            expiresAt,
            reasonUser,
        });
    }

    // Tell the operator their drive is awaiting consent (so the UI shows a waiting
    // state with the same countdown), rather than silently withholding it.
    sendToConnection(connection, WebSocketMessageResponses.TAKEOVER_RESOLVED, {
        requestId,
        outcome: 'pending',
        expiresAt,
    });

    // Fail-closed auto-deny on no response. The callback is idempotent (it
    // re-checks the requestId), so we don't track/cancel the schedule id.
    await agent.schedule(TAKEOVER_CONSENT_TIMEOUT_SECONDS, 'onTakeoverConsentTimeout', { requestId });

    auditTakeover(agent, impersonation.actorId, 'takeover_requested', {
        requestId,
        targetUserId: impersonation.targetId,
        operatorRole: impersonation.actorRole ?? null,
    });
}

function isTakeoverThrottled(agent: CodeGeneratorAgent, actorId: string): boolean {
    const entry = agent.state.takeoverRequestThrottle?.[actorId];
    if (!entry) {
        return false;
    }
    const withinWindow = Date.now() - entry.windowStartedAt < TAKEOVER_THROTTLE_WINDOW_MS;
    return withinWindow && entry.count >= TAKEOVER_THROTTLE_MAX;
}

/** Persist the pending request + bump the per-operator (actorId) re-request counter. */
function recordTakeoverRequest(agent: CodeGeneratorAgent, pending: PendingTakeover): void {
    const throttle = { ...(agent.state.takeoverRequestThrottle ?? {}) };
    const prior = throttle[pending.actorId];
    throttle[pending.actorId] =
        prior && pending.requestedAt - prior.windowStartedAt < TAKEOVER_THROTTLE_WINDOW_MS
            ? { count: prior.count + 1, windowStartedAt: prior.windowStartedAt }
            : { count: 1, windowStartedAt: pending.requestedAt };
    agent.setState({ ...agent.state, pendingTakeover: pending, takeoverRequestThrottle: throttle });
}

/** Role-only label for the consent prompt — never the operator's name (no identity leak). */
function operatorRoleLabel(role: UserRole | null, isAgent: boolean): string {
    if (isAgent) {
        return 'An AI support agent';
    }
    switch (role) {
        case 'superadmin':
            return 'A platform admin';
        case 'support':
            return 'A support agent';
        case 'admin':
            return 'An org admin';
        default:
            return 'An authorized operator';
    }
}

/**
 * Handle the real user's allow/deny to a takeover request. C4: ONLY the genuine
 * target (userId === pending.targetUserId AND NOT impersonating) may decide — an
 * operator shares the target's userId but is impersonating, so it can never
 * self-consent. C5/C8: the pending request is cleared SYNCHRONOUSLY (single-use)
 * before any side effects, and the matching requestId is required, so a replayed
 * or stale decision is ignored.
 */
function handleTakeoverDecision(
    agent: CodeGeneratorAgent,
    connection: Connection,
    parsed: IncomingWebSocketMessage,
): void {
    const pending = agent.state.pendingTakeover;
    if (!pending || parsed.requestId !== pending.requestId) {
        return; // no pending request, or a stale/forged requestId
    }
    const decider = identityOf(connection);
    if (!decider || decider.userId !== pending.targetUserId || decider.impersonatedBy) {
        return; // only the real target may consent — never the operator
    }
    if (parsed.allow === true) {
        agent.setState({
            ...agent.state,
            pendingTakeover: null,
            grantedTakeover: {
                operatorConnectionId: pending.operatorConnectionId,
                consentingUserId: pending.targetUserId,
            },
            currentDriverUserId: pending.targetUserId, // the operator (as target) now drives
        });
        broadcastPresence(agent);
        notifyOperator(agent, pending, 'granted');
        auditTakeover(agent, pending.actorId, 'takeover_granted', {
            requestId: pending.requestId,
            targetUserId: pending.targetUserId,
            decidedByConnectionId: connection.id,
        });
    } else {
        agent.setState({ ...agent.state, pendingTakeover: null });
        notifyOperator(agent, pending, 'denied');
        auditTakeoverDenied(agent, pending, 'user_denied');
    }
}

/**
 * Scheduler callback (invoked from CodeGeneratorAgent.onTakeoverConsentTimeout):
 * fail-closed auto-deny when the user never answered. Idempotent — no-ops unless
 * the still-pending request matches requestId, so a late fire after a resolved
 * decision does nothing.
 */
export function expireTakeoverRequest(agent: CodeGeneratorAgent, requestId: string): void {
    const pending = agent.state.pendingTakeover;
    if (!pending || pending.requestId !== requestId) {
        return;
    }
    agent.setState({ ...agent.state, pendingTakeover: null });
    notifyOperator(agent, pending, 'timed_out');
    auditTakeoverDenied(agent, pending, 'timed_out');
}

/** Tell the operator's connection (if still live) the outcome of its request. */
function notifyOperator(
    agent: CodeGeneratorAgent,
    pending: PendingTakeover,
    outcome: 'granted' | 'denied' | 'timed_out',
): void {
    const operator = [...agent.getConnections()].find((c) => c.id === pending.operatorConnectionId);
    if (operator) {
        sendToConnection(operator, WebSocketMessageResponses.TAKEOVER_RESOLVED, {
            requestId: pending.requestId,
            outcome,
        });
    }
}

/** Best-effort audit of a takeover lifecycle event, attributed to the real operator. */
function auditTakeover(
    agent: CodeGeneratorAgent,
    actorId: string,
    phase: string,
    extra: Record<string, unknown>,
): void {
    void new AuditLogService(agent.env)
        .record({
            actorId,
            entityType: 'app',
            entityId: agent.getAgentId(),
            action: AdminAuditAction.IMPERSONATION_ACTION,
            newValues: { phase, channel: 'websocket', ...extra },
        })
        .catch((error) => logger.error('Failed to audit takeover event', error));
}

function auditTakeoverDenied(agent: CodeGeneratorAgent, pending: PendingTakeover, reason: string): void {
    void new AuditLogService(agent.env)
        .record({
            actorId: pending.actorId,
            entityType: 'app',
            entityId: agent.getAgentId(),
            action: AdminAuditAction.IMPERSONATION_DENIED,
            newValues: {
                phase: reason === 'timed_out' ? 'takeover_timeout' : 'takeover_denied',
                channel: 'websocket',
                requestId: pending.requestId,
                targetUserId: pending.targetUserId,
                reason,
            },
        })
        .catch((error) => logger.error('Failed to audit takeover denial', error));
}

/**
 * Apply a manual edit of a generated file from the in-app code editor. Persists it
 * as a git reversion point (FileManager.saveGeneratedFile commits to the per-app
 * repo), pushes it to the live sandbox preview (HMR), and broadcasts so every other
 * connected member's file view syncs. Only ALREADY-GENERATED files are editable
 * (not template/bootstrap), and never mid-generation. Reaches here only after the
 * DRIVING_COMMANDS gate (single-driver seat + read-only/consent impersonation).
 */
async function handleUserFileEdit(
    agent: CodeGeneratorAgent,
    connection: Connection,
    parsed: IncomingWebSocketMessage,
): Promise<void> {
    const filePath = typeof parsed.filePath === 'string' ? parsed.filePath : '';
    const fileContents = parsed.fileContents;
    if (!filePath || typeof fileContents !== 'string') {
        sendError(connection, 'Invalid file edit.');
        return;
    }
    if (fileContents.length > MAX_USER_EDIT_BYTES) {
        sendError(connection, 'This file is too large to save.');
        return;
    }
    if (agent.getBehavior().isCodeGenerating()) {
        sendError(connection, 'Cannot save edits while the app is still generating — try again once it finishes.');
        return;
    }
    const existing = agent.fileManager.getGeneratedFile(filePath);
    if (!existing) {
        sendError(connection, `"${filePath}" is not an editable file.`);
        return;
    }
    const file = { ...existing, fileContents };
    try {
        // Reversion point: record to state + commit to the per-app git repo.
        await agent.fileManager.saveGeneratedFile(file, `Manual edit: ${filePath}`);
    } catch (error) {
        logger.error('Failed to persist a manual file edit', error);
        sendError(connection, `Failed to save ${filePath}.`);
        return;
    }
    // The save is durable + a reversion point now — sync every member's file view.
    agent.broadcast(WebSocketMessageResponses.FILE_REGENERATED, { message: `Saved ${filePath}`, file });
    // Refresh the live preview off the response path (HMR); a redeploy failure
    // does NOT undo the saved checkpoint.
    void agent.deployToSandbox([file], true, `Manual edit: ${filePath}`).catch((error) => {
        logger.error('Sandbox redeploy after a manual edit failed', error);
    });
}

export async function handleWebSocketMessage(
    agent: CodeGeneratorAgent,
    connection: Connection,
    message: string,
): Promise<void> {
    try {
        logger.info(`Received WebSocket message from ${connection.id}: ${message}`);
        const parsedMessage = JSON.parse(message) as IncomingWebSocketMessage;

        if (DRIVING_COMMANDS.has(parsedMessage.type)) {
            const impersonation = connectionImpersonation(connection);
            // Read-only impersonation may observe but never drive (C11: this stays
            // ABOVE the consent gate + the seat, so a read-only session never even
            // reaches takeover). The REST policy gates HTTP, but a WS upgrade is a
            // GET that bypasses it, so the rule is enforced here.
            if (impersonation?.readOnly) {
                logger.warn('Blocked a driving command from a read-only impersonation session', {
                    command: parsedMessage.type,
                    actorId: impersonation.actorId,
                    targetUserId: impersonation.targetId,
                });
                sendError(connection, 'This is a read-only session. You cannot drive the agent while impersonating.');
                return;
            }
            // Consent-gated takeover (C1: BEFORE ensureCanDrive — under impersonation
            // the operator's userId equals the target's, so the seat's `current ===
            // me` shortcut would otherwise let the operator drive with no consent).
            // When the real user is live, this withholds the command and prompts
            // them until they consent.
            if (impersonation && !(await requireTakeoverConsent(agent, connection, impersonation))) {
                return;
            }
            // Single-driver gate (soft): a non-driver's driving command is not run
            // concurrently — they're notified who's driving and may take over.
            if (!ensureCanDrive(agent, connection)) {
                return;
            }
            // Non-repudiation: attribute the now-executing impersonated drive to the
            // real operator (best-effort, off the response path). AFTER the gates, so
            // only commands that actually run are attributed.
            if (impersonation) {
                auditImpersonatedDrive(agent, impersonation, parsedMessage.type);
            }
        }

        switch (parsedMessage.type) {
            case WebSocketMessageRequests.GENERATE_ALL:
                // Duplicate-check BEFORE touching state: setState broadcasts a
                // fresh cf_agent_state to every client, and clients re-send
                // generate_all when they see shouldBeGenerating — setting state
                // first turned every duplicate request into another broadcast
                // (a self-sustaining ping-pong for the whole build).
                if (agent.getBehavior().isCodeGenerating()) {
                    logger.info('Generation already in progress, skipping duplicate request');
                    return;
                }

                agent.setState({
                    ...agent.state,
                    shouldBeGenerating: true,
                });

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
            case WebSocketMessageRequests.DEPLOY: {
                // Sparks metering: deploy-to-production = 10 Sparks
                // (spec §0.2), keyed per attempt. Fails closed BEFORE the
                // deploy runs; BYO/exempt/flag-off ride free inside
                // meterSparkAction.
                const deployMeter = await meterSparkAction(agent.env, {
                    orgId: agent.state.metadata.orgId,
                    userId: agent.state.metadata.userId,
                    actionType: 'deploy',
                    agentId: agent.state.metadata.agentId,
                    callId: `deploy:${generateId()}`,
                    shouldUseUserKey: agent.state.metadata.shouldUseUserKey,
                });
                if (!deployMeter.ok) {
                    sendToConnection(connection, WebSocketMessageResponses.ERROR, {
                        error: deployMeter.reason,
                        code: 'USAGE_LIMIT_EXCEEDED',
                        showAsPopup: true,
                    });
                    break;
                }
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
            }
            case WebSocketMessageRequests.APPROVE_BLUEPRINT_IMAGES:
                // Consent granted — image generation meters per asset (the
                // user just agreed to exactly that spend).
                agent.approveBlueprintImages().catch((error: unknown) => {
                    logger.error('Error generating approved blueprint images:', error);
                    sendError(
                        connection,
                        `Error generating images: ${error instanceof Error ? error.message : String(error)}`,
                    );
                });
                break;
            case WebSocketMessageRequests.DECLINE_BLUEPRINT_IMAGES:
                agent.declineBlueprintImages();
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
            case WebSocketMessageRequests.USER_SUGGESTION: {
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

                let editCallId: string | null = null;
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

                    // Sparks metering: a follow-up revision = one EDIT
                    // (30 Sparks, spec §0.2), keyed per message so every
                    // revision charges exactly once. Fails closed;
                    // BYO/exempt/flag-off cases ride free inside
                    // meterSparkAction.
                    // Hoisted so a failed turn can refund the SAME callId it
                    // was charged under (the refund key is derived from it).
                    editCallId = `edit:${generateId()}`;
                    const editMeter = await meterSparkAction(env, {
                        orgId: agent.state.metadata.orgId,
                        userId,
                        actionType: 'edit',
                        agentId: agent.state.metadata.agentId,
                        callId: editCallId,
                        shouldUseUserKey: agent.state.metadata.shouldUseUserKey,
                    });
                    if (!editMeter.ok) {
                        sendToConnection(connection, WebSocketMessageResponses.ERROR, {
                            error: editMeter.reason,
                            code: 'USAGE_LIMIT_EXCEEDED',
                            showAsPopup: true,
                        });
                        return;
                    }

                    // Count paid edits since the last completed phase. A run of
                    // these means the user is paying while the build stands
                    // still — the one failure shape no error channel sees,
                    // because every individual turn "succeeds".
                    const editsSinceProgress = (agent.state.editsSinceProgress ?? 0) + 1;
                    agent.setState({ ...agent.state, editsSinceProgress });

                    if (hasJustStalled(editsSinceProgress)) {
                        // Only the phasic behavior tracks phases; the agentic
                        // one has no equivalent, so report it as unknown there.
                        const lastCompletedPhase =
                            'generatedPhases' in agent.state
                                ? ([...agent.state.generatedPhases]
                                      .reverse()
                                      .find((phase) => phase.completed)?.name ?? null)
                                : null;
                        const alert = {
                            agentId: agent.state.metadata.agentId,
                            orgId: agent.state.metadata.orgId ?? null,
                            userId,
                            editsSinceProgress,
                            lastCompletedPhase,
                        };
                        logger.error('Build stalled — paid edits with no completed phase', alert);
                        captureMessage(stalledAlertMessage(alert), 'warning');
                        // Tell the user too. They are the one paying, and they
                        // find out first anyway.
                        sendToConnection(connection, WebSocketMessageResponses.CONVERSATION_RESPONSE, {
                            message: stalledUserMessage(editsSinceProgress),
                            conversationId: `stalled-${agent.state.metadata.agentId}`,
                            isStreaming: false,
                        });
                    }
                } catch (error) {
                    logger.error('Failed to check usage:', error);
                    sendToConnection(connection, WebSocketMessageResponses.ERROR, {
                        error: `Error processing request: ${error instanceof Error ? error.message : String(error)}`,
                        showAsPopup: true,
                    });
                    return;
                }

                // Resolve mid-build document attachments (budget-capped R2 reads)
                // before handing off. Scoped to the SENDER's identity, not the app
                // owner: uploads live under the uploader's own R2 prefix, so an org
                // collaborator driving the build must resolve against their own
                // keys (owner fallback covers pre-identity sockets). Best-effort:
                // a failed resolve must not block the suggestion itself.
                {
                    let attachedDocuments;
                    if (parsedMessage.attachments && parsedMessage.attachments.length > 0) {
                        try {
                            const senderId =
                                identityOf(connection)?.userId ?? agent.state.metadata.userId;
                            attachedDocuments = await resolveAttachedDocuments(
                                agent.env,
                                senderId,
                                parsedMessage.attachments,
                            );
                        } catch (error) {
                            logger.error('Failed to resolve mid-build attachments:', error);
                        }
                    }
                    const refundFailedEdit = (reason: string): void => {
                        if (!editCallId) return;
                        void refundSparkAction(agent.env, {
                            orgId: agent.state.metadata.orgId,
                            userId: agent.state.metadata.userId,
                            actionType: 'edit',
                            agentId: agent.state.metadata.agentId,
                            callId: editCallId,
                            reason,
                            shouldUseUserKey: agent.state.metadata.shouldUseUserKey,
                        });
                    };

                    agent
                        .handleUserInput(parsedMessage.message, parsedMessage.images, attachedDocuments)
                        .then((outcome) => {
                            // Sparks were debited before the work as the gate,
                            // so a failed turn means the user paid for nothing.
                            if (outcome === 'failed') {
                                refundFailedEdit('edit failed before any work was done');
                                sendToConnection(connection, WebSocketMessageResponses.ERROR, {
                                    error: "That didn't go through, so I've refunded the Sparks for it. Please try again.",
                                    showAsPopup: false,
                                });
                            }
                        })
                        .catch((error: unknown) => {
                            logger.error('Error handling user suggestion:', error);
                            refundFailedEdit('edit threw before any work was done');
                            sendError(
                                connection,
                                `Error processing user suggestion: ${error instanceof Error ? error.message : String(error)}. The Sparks for it have been refunded.`,
                            );
                        });
                }
                break;
            }
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
            case WebSocketMessageRequests.CLAIM_DRIVER: {
                // An impersonating operator's explicit take-over also needs the real
                // user's consent when they're live (mirrors the driving gate). A real
                // user's claim ("take back control") has no impersonation context, so
                // it goes straight through claimDriver and revokes any grant.
                const claimImpersonation = connectionImpersonation(connection);
                if (claimImpersonation?.readOnly) {
                    sendError(connection, 'This is a read-only session. You cannot take over the agent while impersonating.');
                    break;
                }
                if (claimImpersonation && !(await requireTakeoverConsent(agent, connection, claimImpersonation))) {
                    break;
                }
                claimDriver(agent, connection);
                break;
            }
            case WebSocketMessageRequests.RELEASE_DRIVER:
                releaseDriver(agent, connection);
                break;
            case WebSocketMessageRequests.TAKEOVER_DECISION:
                handleTakeoverDecision(agent, connection, parsedMessage);
                break;
            case WebSocketMessageRequests.USER_EDIT_FILE:
                await handleUserFileEdit(agent, connection, parsedMessage);
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
