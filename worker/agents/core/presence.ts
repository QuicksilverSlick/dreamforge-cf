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
import { sendToConnection } from './websocketHelpers';
import type { CodeGeneratorAgent } from './codingAgent';
import type { PresenceMember } from '../../api/websocketTypes';
import { isUserRole, type UserRole } from '../../types/auth-types';
import type { GrantedTakeover, PendingTakeover } from './state';

/** Identity persisted on each WebSocket connection (the per-socket attachment). */
export interface ConnectionIdentity {
    userId: string;
    displayName: string;
    avatar: string | null;
    /**
     * Impersonation context carried onto the socket (WS frames don't re-enter the
     * REST impersonation policy). When set, this connection is an operator acting
     * AS userId: impersonatedBy is the real actor (for attribution/audit), and
     * impersonationReadOnly gates mutating/driving frames.
     */
    impersonatedBy?: string | null;
    impersonationReadOnly?: boolean;
    /**
     * The operator's REAL role (superadmin / org-admin / ai_*), carried so the
     * consent-takeover gate, prompt, and audit can name the role and detect an AI
     * agent. Null when not impersonating. Sourced from AuthUser.impersonatorRole.
     */
    impersonatorRole?: UserRole | null;
}

const USER_ID_HEADER = 'x-df-user-id';
const USER_NAME_HEADER = 'x-df-user-name';
const USER_AVATAR_HEADER = 'x-df-user-avatar';
const IMPERSONATED_BY_HEADER = 'x-df-impersonated-by';
const IMPERSONATION_READONLY_HEADER = 'x-df-impersonation-readonly';
const IMPERSONATOR_ROLE_HEADER = 'x-df-impersonator-role';

/**
 * Stamp the resolved user's identity onto the WS upgrade request (server side)
 * so the DO's onConnect can read it — WS frames don't carry the session.
 */
export function setIdentityHeaders(
    headers: Headers,
    user: {
        id: string;
        displayName?: string | null;
        email?: string | null;
        avatarUrl?: string | null;
        impersonatedBy?: string;
        impersonationReadOnly?: boolean;
        impersonatorRole?: UserRole | null;
    },
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
    // Carry the impersonation context (or DELETE so a client can't forge it).
    if (user.impersonatedBy) {
        headers.set(IMPERSONATED_BY_HEADER, user.impersonatedBy);
        headers.set(IMPERSONATION_READONLY_HEADER, user.impersonationReadOnly ? '1' : '0');
        // The operator's real role, for the consent prompt + audit (role-only, no
        // operator-name leak). DELETE when absent so a client can't forge it.
        if (user.impersonatorRole) {
            headers.set(IMPERSONATOR_ROLE_HEADER, user.impersonatorRole);
        } else {
            headers.delete(IMPERSONATOR_ROLE_HEADER);
        }
    } else {
        headers.delete(IMPERSONATED_BY_HEADER);
        headers.delete(IMPERSONATION_READONLY_HEADER);
        headers.delete(IMPERSONATOR_ROLE_HEADER);
    }
}

/** Read the connecting user's identity from the upgrade request headers. */
export function readConnectionIdentity(request: Request): ConnectionIdentity | null {
    const userId = request.headers.get(USER_ID_HEADER);
    if (!userId) {
        return null;
    }
    const impersonatedBy = request.headers.get(IMPERSONATED_BY_HEADER);
    const impersonatorRole = request.headers.get(IMPERSONATOR_ROLE_HEADER);
    return {
        userId,
        displayName: request.headers.get(USER_NAME_HEADER) || 'Member',
        avatar: request.headers.get(USER_AVATAR_HEADER) || null,
        impersonatedBy: impersonatedBy || null,
        impersonationReadOnly: request.headers.get(IMPERSONATION_READONLY_HEADER) === '1',
        impersonatorRole: isUserRole(impersonatorRole) ? impersonatorRole : null,
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
export function identityOf(connection: Connection): ConnectionIdentity | null {
    return isIdentity(connection.state) ? connection.state : null;
}

/**
 * The impersonation context on a connection, or null when it isn't an
 * impersonation. Lets the WS-drive plane attribute to the real operator and
 * enforce read-only — the REST impersonation policy can't reach socket frames.
 */
export function connectionImpersonation(
    connection: Connection,
): { actorId: string; targetId: string; readOnly: boolean; actorRole: UserRole | null } | null {
    const id = identityOf(connection);
    if (!id?.impersonatedBy) {
        return null;
    }
    return {
        actorId: id.impersonatedBy,
        targetId: id.userId,
        readOnly: id.impersonationReadOnly === true,
        actorRole: id.impersonatorRole ?? null,
    };
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
    // The seat is held by a DIFFERENT user — but if that holder has no live
    // connection, the seat is STALE ("ghost"): a session that dropped without
    // releasing it. handlePresenceOnClose frees the seat on a clean close, but
    // an abnormal drop (e.g. a 1006 close) can skip it, leaving the seat locked
    // behind someone who isn't here. Reclaim it rather than soft-blocking
    // everyone behind a ghost driver.
    if (!hasLiveConnection(agent, current)) {
        setDriver(agent, me);
        return true;
    }
    const driver = buildPresenceRoster(agent).find((m) => m.userId === current);
    sendToConnection(connection, WebSocketMessageResponses.DRIVING_BLOCKED, {
        currentDriverUserId: current,
        currentDriverName: driver?.displayName ?? 'Another member',
    });
    return false;
}

/** True when at least one live connection is authenticated as `userId`. */
function hasLiveConnection(agent: CodeGeneratorAgent, userId: string): boolean {
    return [...agent.getConnections()].some((c) => identityOf(c)?.userId === userId);
}

/**
 * The REAL user's own live connections for `targetUserId` — genuine sessions
 * (impersonatedBy == null), excluding the operator's own socket. This is the
 * security-critical distinction from hasLiveConnection: under impersonation the
 * operator's socket ALSO carries targetUserId, so a plain userId match cannot
 * tell "the real user is here" apart from "only the operator is here".
 */
export function realUserConnections(
    agent: CodeGeneratorAgent,
    targetUserId: string,
    excludeConnectionId: string,
): Connection[] {
    return [...agent.getConnections()].filter((c) => {
        const id = identityOf(c);
        return id?.userId === targetUserId && !id.impersonatedBy && c.id !== excludeConnectionId;
    });
}

/** True when the real target user has a genuine live session separate from the operator. */
export function hasLiveRealUserConnection(
    agent: CodeGeneratorAgent,
    targetUserId: string,
    excludeConnectionId: string,
): boolean {
    return realUserConnections(agent, targetUserId, excludeConnectionId).length > 0;
}

export type TakeoverGate = 'allow' | 'pending' | 'blocked' | 'request';

/**
 * Consent gate for a driving attempt by a privileged impersonating operator.
 * MUST be consulted BEFORE ensureCanDrive (C1): under impersonation the operator's
 * userId equals the target's, so ensureCanDrive's `current === me` short-circuit
 * would otherwise let the operator drive with NO consent. PURE (no side effects):
 *  - 'allow'   not impersonating, or no genuine live user to protect, or this
 *              operator already holds the user's session-long consent;
 *  - 'pending' this operator already has a consent request in flight;
 *  - 'blocked' a DIFFERENT operator's request is mid-flight (one at a time);
 *  - 'request' a fresh consent request must be sent to the real user.
 * The caller performs the 'request' side effects (mint id / schedule / send / audit).
 *
 * NOTE on scope: the protected party is the impersonation TARGET specifically.
 * A non-target org member who happens to be present is NOT being taken over (the
 * operator drives AS the target), so their consent is not required — matching the
 * owner's "protect the user being impersonated" intent.
 */
export function takeoverGateDecision(
    agent: CodeGeneratorAgent,
    connection: Connection,
): TakeoverGate {
    const imp = connectionImpersonation(connection);
    if (!imp) {
        return 'allow'; // not impersonating — consent never applies
    }
    const granted = agent.state.grantedTakeover;
    if (granted && granted.operatorConnectionId === connection.id) {
        return 'allow'; // this operator already has the user's session-long consent
    }
    if (!hasLiveRealUserConnection(agent, imp.targetId, connection.id)) {
        return 'allow'; // no genuine live user to protect; the grant store governs
    }
    const pending = agent.state.pendingTakeover;
    if (pending && pending.operatorConnectionId === connection.id) {
        return 'pending'; // already awaiting this operator's consent
    }
    if (pending) {
        return 'blocked'; // another operator's request is mid-flight — one at a time
    }
    return 'request';
}

/**
 * Explicit claim / take-over of the driver seat. A REAL user (impersonatedBy ==
 * null) reclaiming control also instantly REVOKES any operator takeover grant or
 * pending request — asymmetric and consent-free, so the user is always able to
 * take the wheel back. (Under impersonation the operator's seat shows the target's
 * userId, so the seat id may be unchanged; the revoke is the load-bearing effect.)
 */
export function claimDriver(
    agent: CodeGeneratorAgent,
    connection: Connection,
): void {
    const id = identityOf(connection);
    const me = id?.userId;
    if (!me) {
        return;
    }
    const isRealUser = !id.impersonatedBy;
    const hadTakeover = !!(agent.state.grantedTakeover || agent.state.pendingTakeover);
    if (isRealUser && hadTakeover) {
        agent.setState({ ...agent.state, grantedTakeover: null, pendingTakeover: null });
    }
    if (agent.state.currentDriverUserId !== me) {
        setDriver(agent, me); // claim the seat + broadcast
    } else if (isRealUser && hadTakeover) {
        broadcastPresence(agent); // seat id unchanged (shared id) but the revoke must surface
    }
}

/**
 * Release the driver seat (only its holder can release it). A granted operator
 * releasing also relinquishes the takeover grant.
 */
export function releaseDriver(
    agent: CodeGeneratorAgent,
    connection: Connection,
): void {
    const me = identityOf(connection)?.userId;
    if (!me || agent.state.currentDriverUserId !== me) {
        return;
    }
    if (agent.state.grantedTakeover?.operatorConnectionId === connection.id) {
        agent.setState({ ...agent.state, grantedTakeover: null });
    }
    setDriver(agent, null);
}

/**
 * On disconnect: free the seat when the driver's LAST connection closes, tear down
 * any takeover grant / pending request tied to the closing socket, then refresh
 * presence. (A pending request the operator abandons by leaving is also covered by
 * the consent timeout, which is idempotent; this just clears it sooner.)
 */
export function handlePresenceOnClose(
    agent: CodeGeneratorAgent,
    connection: Connection,
): void {
    const me = identityOf(connection)?.userId;
    const takeoverPatch = takeoverCleanupOnClose(agent, connection);

    let nextDriver = agent.state.currentDriverUserId ?? null;
    if (me && nextDriver === me) {
        const hasOtherConnection = [...agent.getConnections()].some(
            (c) => c.id !== connection.id && identityOf(c)?.userId === me,
        );
        if (!hasOtherConnection) {
            nextDriver = null;
        }
    }

    if (takeoverPatch || nextDriver !== (agent.state.currentDriverUserId ?? null)) {
        agent.setState({ ...agent.state, ...(takeoverPatch ?? {}), currentDriverUserId: nextDriver });
    }
    broadcastPresence(agent);
}

/** Clear a takeover grant / pending request whose operator socket is the one closing. */
function takeoverCleanupOnClose(
    agent: CodeGeneratorAgent,
    connection: Connection,
): { grantedTakeover?: GrantedTakeover | null; pendingTakeover?: PendingTakeover | null } | null {
    const grantGone = agent.state.grantedTakeover?.operatorConnectionId === connection.id;
    const pendingGone = agent.state.pendingTakeover?.operatorConnectionId === connection.id;
    if (!grantGone && !pendingGone) {
        return null;
    }
    return {
        ...(grantGone ? { grantedTakeover: null } : {}),
        ...(pendingGone ? { pendingTakeover: null } : {}),
    };
}
