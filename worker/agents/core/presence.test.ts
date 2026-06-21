/**
 * Presence + single-driver coordination logic (Phase 3c). Pure logic over a
 * mock agent/connections — the browser test covers the live WS integration.
 */

import { describe, it, expect } from 'vitest';
import {
    readConnectionIdentity,
    buildPresenceRoster,
    ensureCanDrive,
    claimDriver,
    releaseDriver,
    handlePresenceOnClose,
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
