/**
 * Org collaboration: live presence + single-driver coordination for an app's
 * shared agent session.
 *
 * Multiple org members can connect to the same CodeGeneratorAgent and already
 * see the same live build (the DO broadcasts to every socket). This module adds
 * (1) a PRESENCE roster — who is currently in the session, built from the LIVE
 * connections each time so it is never stale — and (2) a SINGLE-DRIVER seat: at
 * most one member drives build/deploy commands at a time, stored on DO state
 * (currentDriverUserId) so it is consistent across members and survives DO
 * hibernation. The model is SOFT (per product decision): a non-driver's driving
 * command is not run concurrently — instead they get a DRIVING_BLOCKED notice
 * and may explicitly take over (CLAIM_DRIVER), which is the "join".
 *
 * Per-connection identity is stamped onto the WS upgrade request by the route
 * (setIdentityHeaders) and persisted on the socket via connection.setState
 * (hibernation-safe), since WS frames carry no auth.
 */

import type { Connection } from 'agents';
import { WebSocketMessageResponses } from '../constants';
import { sendToConnection } from './websocket';
import type { CodeGeneratorAgent } from './codingAgent';
import type { PresenceMember } from '../../api/websocketTypes';

/** Identity persisted on each WebSocket connection (the per-socket attachment). */
export interface ConnectionIdentity {
    userId: string;
    displayName: string;
    avatar: string | null;
}

const USER_ID_HEADER = 'x-df-user-id';
const USER_NAME_HEADER = 'x-df-user-name';
const USER_AVATAR_HEADER = 'x-df-user-avatar';

/**
 * Stamp the resolved user's identity onto the WS upgrade request (server side)
 * so the DO's onConnect can read it — WS frames don't carry the session.
 */
export function setIdentityHeaders(
    headers: Headers,
    user: { id: string; displayName?: string | null; email?: string | null; avatarUrl?: string | null },
): void {
    headers.set(USER_ID_HEADER, user.id);
    headers.set(USER_NAME_HEADER, user.displayName || user.email || 'Member');
    // Overwrite the avatar with the resolved value, or DELETE it when the user has
    // none — otherwise a client-forged x-df-user-avatar header would survive the
    // handshake and show a spoofed avatar for this viewer in everyone's roster.
    if (user.avatarUrl) {
        headers.set(USER_AVATAR_HEADER, user.avatarUrl);
    } else {
        headers.delete(USER_AVATAR_HEADER);
    }
}

/** Read the connecting user's identity from the upgrade request headers. */
export function readConnectionIdentity(request: Request): ConnectionIdentity | null {
    const userId = request.headers.get(USER_ID_HEADER);
    if (!userId) {
        return null;
    }
    return {
        userId,
        displayName: request.headers.get(USER_NAME_HEADER) || 'Member',
        avatar: request.headers.get(USER_AVATAR_HEADER) || null,
    };
}

/**
 * Structural guard for the SDK's overloaded error hook: `onError(connection,
 * error)` for a socket-level failure vs `onError(error)` for a server-level one.
 * Lets the agent tell whether it was handed a connection (whose seat to free).
 */
export function isConnection(value: unknown): value is Connection {
    return (
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'send' in value &&
        typeof value.send === 'function'
    );
}

/**
 * Discriminate an SDK error-hook invocation (see `CodeGeneratorAgent.onError`).
 * Returns the Connection for a socket-level error (whose driver seat the caller
 * should free WITHOUT throwing — an abnormal drop can skip onClose, and a dead
 * socket must not crash the DO), or RE-THROWS a server-level error unchanged.
 *
 * The re-throw is load-bearing and MUST stay synchronous: the `agents` SDK
 * (v0.2.x, `Agent.sql()` and `Agent._tryCatch`, the latter wrapping onStart/
 * onConnect/onMessage/onRequest/RPC) does `throw this.onError(e)`, relying on the
 * hook to throw the real error synchronously. An async hook would make that
 * surface a Promise instead of the error and starve observability of the stack.
 */
export function connectionForErrorOrRethrow(connectionOrError: unknown): Connection {
    if (isConnection(connectionOrError)) {
        return connectionOrError;
    }
    throw connectionOrError instanceof Error
        ? connectionOrError
        : new Error(String(connectionOrError));
}

function isIdentity(value: unknown): value is ConnectionIdentity {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as Record<string, unknown>).userId === 'string'
    );
}

/** The identity attached to a connection (null for a pre-feature / unidentified socket). */
function identityOf(connection: Connection): ConnectionIdentity | null {
    return isIdentity(connection.state) ? connection.state : null;
}

/** Live roster — one entry per distinct user (collapsing multiple tabs). */
export function buildPresenceRoster(agent: CodeGeneratorAgent): PresenceMember[] {
    const currentDriver = agent.state.currentDriverUserId ?? null;
    const byUser = new Map<string, PresenceMember>();
    for (const connection of agent.getConnections()) {
        const id = identityOf(connection);
        if (!id?.userId || byUser.has(id.userId)) {
            continue;
        }
        byUser.set(id.userId, {
            userId: id.userId,
            displayName: id.displayName,
            avatar: id.avatar,
            isDriver: id.userId === currentDriver,
        });
    }
    return [...byUser.values()];
}

export function broadcastPresence(agent: CodeGeneratorAgent): void {
    agent.broadcast(WebSocketMessageResponses.PRESENCE_UPDATE, {
        members: buildPresenceRoster(agent),
        currentDriverUserId: agent.state.currentDriverUserId ?? null,
    });
}

function setDriver(agent: CodeGeneratorAgent, userId: string | null): void {
    agent.setState({ ...agent.state, currentDriverUserId: userId });
    broadcastPresence(agent);
}

/**
 * Gate a driving command (single-driver, SOFT). Auto-claims the open seat, lets
 * the current driver through, and soft-blocks a non-driver with a
 * DRIVING_BLOCKED notice (the client offers "take over"). Returns true if the
 * command may run. Fails OPEN for a connection with no identity (legacy /
 * pre-feature sockets) so existing behaviour is never broken.
 */
export function ensureCanDrive(
    agent: CodeGeneratorAgent,
    connection: Connection,
): boolean {
    const me = identityOf(connection)?.userId;
    if (!me) {
        return true;
    }
    const current = agent.state.currentDriverUserId ?? null;
    if (current === null) {
        setDriver(agent, me); // auto-claim the open seat
        return true;
    }
    if (current === me) {
        return true;
    }
    const driver = buildPresenceRoster(agent).find((m) => m.userId === current);
    sendToConnection(connection, WebSocketMessageResponses.DRIVING_BLOCKED, {
        currentDriverUserId: current,
        currentDriverName: driver?.displayName ?? 'Another member',
    });
    return false;
}

/** Explicit claim / take-over of the driver seat. */
export function claimDriver(
    agent: CodeGeneratorAgent,
    connection: Connection,
): void {
    const me = identityOf(connection)?.userId;
    if (me && agent.state.currentDriverUserId !== me) {
        setDriver(agent, me);
    }
}

/** Release the driver seat (only its holder can release it). */
export function releaseDriver(
    agent: CodeGeneratorAgent,
    connection: Connection,
): void {
    const me = identityOf(connection)?.userId;
    if (me && agent.state.currentDriverUserId === me) {
        setDriver(agent, null);
    }
}

/**
 * On disconnect: free the seat when the driver's LAST connection closes, then
 * refresh presence for everyone still connected.
 */
export function handlePresenceOnClose(
    agent: CodeGeneratorAgent,
    connection: Connection,
): void {
    const me = identityOf(connection)?.userId;
    if (me && agent.state.currentDriverUserId === me) {
        const hasOtherConnection = [...agent.getConnections()].some(
            (c) => c.id !== connection.id && identityOf(c)?.userId === me,
        );
        if (!hasOtherConnection) {
            agent.setState({ ...agent.state, currentDriverUserId: null });
        }
    }
    broadcastPresence(agent);
}
