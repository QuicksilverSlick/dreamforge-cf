/**
 * Presence + single-driver coordination logic (Phase 3c). Pure logic over a
 * mock agent/connections — the browser test covers the live WS integration.
 */

import { describe, it, expect } from 'vitest';
import {
    readConnectionIdentity,
    setIdentityHeaders,
    isConnection,
    connectionForErrorOrRethrow,
    buildPresenceRoster,
    ensureCanDrive,
    claimDriver,
    releaseDriver,
    handlePresenceOnClose,
    connectionImpersonation,
    type ConnectionIdentity,
} from './presence';
import type { CodeGeneratorAgent } from './codingAgent';
import type { Connection } from 'agents';

interface MockConnection {
    id: string;
    state: ConnectionIdentity | null;
    sent: string[];
    send: (msg: string) => void;
}

function conn(id: string, identity: ConnectionIdentity | null): MockConnection {
    const sent: string[] = [];
    return { id, state: identity, sent, send: (m: string) => sent.push(m) };
}

const ident = (userId: string): ConnectionIdentity => ({ userId, displayName: userId, avatar: null });
const asConn = (c: MockConnection) => c as unknown as Connection;

function makeAgent(connections: MockConnection[], driver: string | null = null) {
    const broadcasts: Array<{ type: string; data: unknown }> = [];
    const state = { currentDriverUserId: driver as string | null, metadata: { userId: 'creator' } };
    const agent = {
        get state() {
            return state;
        },
        setState(next: { currentDriverUserId?: string | null }) {
            state.currentDriverUserId = next.currentDriverUserId ?? null;
        },
        broadcast(type: string, data: unknown) {
            broadcasts.push({ type, data });
        },
        getConnections() {
            return connections;
        },
    };
    return { agent: agent as unknown as CodeGeneratorAgent, broadcasts, state };
}

describe('presence + single-driver coordination', () => {
    it('reads identity from upgrade headers (null when absent)', () => {
        const headers = new Headers({ 'x-df-user-id': 'u1', 'x-df-user-name': 'Alice', 'x-df-user-avatar': 'a.png' });
        expect(readConnectionIdentity(new Request('https://x', { headers }))).toEqual({
            userId: 'u1',
            displayName: 'Alice',
            avatar: 'a.png',
            impersonatedBy: null,
            impersonationReadOnly: false,
        });
        expect(readConnectionIdentity(new Request('https://x'))).toBeNull();
    });

    it('auto-claims the open driver seat on the first driving command', () => {
        const c = conn('c1', ident('u1'));
        const { agent, broadcasts } = makeAgent([c]);
        expect(ensureCanDrive(agent, asConn(c))).toBe(true);
        expect(agent.state.currentDriverUserId).toBe('u1');
        expect(broadcasts.some((b) => b.type === 'presence_update')).toBe(true);
    });

    it('lets the current driver through and soft-blocks a non-driver with a notice', () => {
        const driver = conn('c1', ident('u1'));
        const other = conn('c2', ident('u2'));
        const { agent } = makeAgent([driver, other], 'u1');

        expect(ensureCanDrive(agent, asConn(driver))).toBe(true);
        expect(ensureCanDrive(agent, asConn(other))).toBe(false);
        expect(agent.state.currentDriverUserId).toBe('u1'); // not stolen

        const msg = JSON.parse(other.sent[0]) as { type: string; currentDriverUserId: string };
        expect(msg.type).toBe('driving_blocked');
        expect(msg.currentDriverUserId).toBe('u1');
    });

    it('fails OPEN for a connection with no identity (never breaks existing behaviour)', () => {
        const anon = conn('c1', null);
        const { agent } = makeAgent([anon], 'u1');
        expect(ensureCanDrive(agent, asConn(anon))).toBe(true);
    });

    it('take-over reassigns the seat; only the holder can release it', () => {
        const a = conn('c1', ident('u1'));
        const b = conn('c2', ident('u2'));
        const { agent } = makeAgent([a, b], 'u1');

        claimDriver(agent, asConn(b)); // u2 takes over
        expect(agent.state.currentDriverUserId).toBe('u2');

        releaseDriver(agent, asConn(a)); // u1 is NOT the driver → no-op
        expect(agent.state.currentDriverUserId).toBe('u2');

        releaseDriver(agent, asConn(b)); // the holder releases
        expect(agent.state.currentDriverUserId).toBeNull();
    });

    it('rosters dedupe by user (multi-tab) and flag the driver', () => {
        const { agent } = makeAgent([conn('c1', ident('u1')), conn('c2', ident('u1')), conn('c3', ident('u2'))], 'u2');
        const roster = buildPresenceRoster(agent);
        expect(roster.map((m) => m.userId).sort()).toEqual(['u1', 'u2']);
        expect(roster.find((m) => m.userId === 'u2')?.isDriver).toBe(true);
        expect(roster.find((m) => m.userId === 'u1')?.isDriver).toBe(false);
    });

    it('frees the seat only when the driver’s LAST connection closes', () => {
        const c1 = conn('c1', ident('u1'));
        const c2 = conn('c2', ident('u1'));

        const two = makeAgent([c1, c2], 'u1');
        handlePresenceOnClose(two.agent, asConn(c1)); // u1 still has c2
        expect(two.agent.state.currentDriverUserId).toBe('u1');

        const one = makeAgent([c1], 'u1');
        handlePresenceOnClose(one.agent, asConn(c1)); // last connection
        expect(one.agent.state.currentDriverUserId).toBeNull();
    });
});

describe('identity header stamping', () => {
    it('overwrites any client-supplied identity headers with the resolved user', () => {
        const headers = new Headers({
            'x-df-user-id': 'attacker',
            'x-df-user-name': 'Attacker',
            'x-df-user-avatar': 'evil.png',
        });
        setIdentityHeaders(headers, {
            id: 'u1',
            displayName: 'Alice',
            email: 'a@x.com',
            avatarUrl: 'alice.png',
        });
        expect(headers.get('x-df-user-id')).toBe('u1');
        expect(headers.get('x-df-user-name')).toBe('Alice');
        expect(headers.get('x-df-user-avatar')).toBe('alice.png');
    });

    it('strips a client-forged avatar header when the user has none', () => {
        const headers = new Headers({ 'x-df-user-avatar': 'forged.png' });
        setIdentityHeaders(headers, { id: 'u1', displayName: 'Alice', avatarUrl: null });
        expect(headers.get('x-df-user-avatar')).toBeNull();
    });

    it('round-trips stamped identity back through readConnectionIdentity (email fallback)', () => {
        const headers = new Headers();
        setIdentityHeaders(headers, { id: 'u1', email: 'a@x.com', avatarUrl: null });
        expect(readConnectionIdentity(new Request('https://x', { headers }))).toEqual({
            userId: 'u1',
            displayName: 'a@x.com',
            avatar: null,
            impersonatedBy: null,
            impersonationReadOnly: false,
        });
    });

    it('round-trips impersonation context (actor + read-only flag) through the headers', () => {
        const headers = new Headers();
        setIdentityHeaders(headers, {
            id: 'target',
            displayName: 'Target',
            avatarUrl: null,
            impersonatedBy: 'operator',
            impersonationReadOnly: true,
        });
        expect(headers.get('x-df-impersonated-by')).toBe('operator');
        expect(headers.get('x-df-impersonation-readonly')).toBe('1');
        expect(readConnectionIdentity(new Request('https://x', { headers }))).toEqual({
            userId: 'target',
            displayName: 'Target',
            avatar: null,
            impersonatedBy: 'operator',
            impersonationReadOnly: true,
        });
    });

    it('strips client-forged impersonation headers for a non-impersonated user', () => {
        const headers = new Headers({
            'x-df-impersonated-by': 'attacker',
            'x-df-impersonation-readonly': '0',
        });
        setIdentityHeaders(headers, { id: 'u1', displayName: 'Alice', avatarUrl: null });
        expect(headers.get('x-df-impersonated-by')).toBeNull();
        expect(headers.get('x-df-impersonation-readonly')).toBeNull();
    });
});

describe('connectionImpersonation', () => {
    it('returns null for a plain (non-impersonated) connection', () => {
        const c = conn('c1', ident('u1'));
        expect(connectionImpersonation(asConn(c))).toBeNull();
    });

    it('surfaces the actor, target, and read-only flag for an impersonated connection', () => {
        const c = conn('c1', {
            userId: 'target',
            displayName: 'Target',
            avatar: null,
            impersonatedBy: 'operator',
            impersonationReadOnly: true,
        });
        expect(connectionImpersonation(asConn(c))).toEqual({
            actorId: 'operator',
            targetId: 'target',
            readOnly: true,
        });
    });
});

describe('isConnection guard (onError discrimination)', () => {
    it('accepts a connection-shaped value and rejects bare errors', () => {
        expect(isConnection(conn('c1', null))).toBe(true);
        expect(isConnection(new Error('boom'))).toBe(false);
        expect(isConnection(null)).toBe(false);
        expect(isConnection('socket error')).toBe(false);
        expect(isConnection({ id: 'x' })).toBe(false); // no send()
    });
});

describe('connectionForErrorOrRethrow (onError SDK contract)', () => {
    it('returns the connection for a socket-level error (caller frees the seat, no throw)', () => {
        const c = conn('c1', ident('u1'));
        expect(connectionForErrorOrRethrow(asConn(c))).toBe(c);
    });

    it('re-throws the SAME server-level Error synchronously (SDK does `throw this.onError(e)`)', () => {
        const boom = new Error('boom');
        let caught: unknown;
        try {
            connectionForErrorOrRethrow(boom);
        } catch (e) {
            caught = e;
        }
        // Must be the real Error — not a Promise — or the SDK's rethrow loses it.
        expect(caught).toBe(boom);
        expect(caught).toBeInstanceOf(Error);
    });

    it('wraps and throws a non-Error server-level value', () => {
        expect(() => connectionForErrorOrRethrow('socket gone')).toThrow('socket gone');
    });
});
