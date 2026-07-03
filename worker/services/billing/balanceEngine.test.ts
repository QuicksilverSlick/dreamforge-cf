/**
 * Unit tests for the pure Spark balance engine — the money path of the
 * Sparks credit system. Covers the invariants the billing spec's adversarial
 * review demanded: fail-closed debits (§8.2), exactly-once ops, FIFO-by-expiry
 * lot drawing (§8.5), debt semantics for clawbacks (§8.1), and expiry sweeps.
 */

import { describe, it, expect } from 'vitest';
import {
	createEmptyState,
	deposit,
	tryDebit,
	forceDebit,
	sweep,
	balanceOf,
	type BalanceState,
} from './balanceEngine';

const T0 = 1_700_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

function seeded(): BalanceState {
	return createEmptyState();
}

describe('balanceEngine.deposit', () => {
	it('creates a lot and reports the new balance', () => {
		const state = seeded();
		const result = deposit(state, {
			opKey: 'welcome:org1',
			lotId: 'lot-1',
			lotKind: 'welcome',
			amount: 300,
			expiresAt: null,
			now: T0,
		});
		expect(result.ok).toBe(true);
		expect(result.replayed).toBe(false);
		expect(result.balanceAfter).toBe(300);
		expect(balanceOf(state, T0)).toBe(300);
	});

	it('is exactly-once: a replayed opKey returns the original result without re-applying', () => {
		const state = seeded();
		const args = {
			opKey: 'welcome:org1',
			lotId: 'lot-1',
			lotKind: 'welcome' as const,
			amount: 300,
			expiresAt: null,
			now: T0,
		};
		deposit(state, args);
		const replay = deposit(state, { ...args, lotId: 'lot-2', now: T0 + 1000 });
		expect(replay.replayed).toBe(true);
		expect(replay.balanceAfter).toBe(300);
		expect(balanceOf(state, T0 + 1000)).toBe(300);
		expect(state.lots).toHaveLength(1);
	});

	it('rejects non-positive and non-integer amounts', () => {
		const state = seeded();
		expect(() =>
			deposit(state, { opKey: 'x', lotId: 'l', lotKind: 'promo', amount: 0, expiresAt: null, now: T0 }),
		).toThrow();
		expect(() =>
			deposit(state, { opKey: 'y', lotId: 'l', lotKind: 'promo', amount: 10.5, expiresAt: null, now: T0 }),
		).toThrow();
	});
});

describe('balanceEngine.tryDebit', () => {
	it('debits and reports the drawn lot', () => {
		const state = seeded();
		deposit(state, { opKey: 'g1', lotId: 'lot-1', lotKind: 'free', amount: 150, expiresAt: null, now: T0 });
		const result = tryDebit(state, { opKey: 'org1:agent:call1', cost: 30, now: T0 });
		expect(result.ok).toBe(true);
		expect(result.balanceAfter).toBe(120);
		expect(result.drawnFromLotId).toBe('lot-1');
	});

	it('FAILS CLOSED with zero mutation when the balance cannot cover the cost', () => {
		const state = seeded();
		deposit(state, { opKey: 'g1', lotId: 'lot-1', lotKind: 'free', amount: 150, expiresAt: null, now: T0 });
		const result = tryDebit(state, { opKey: 'org1:agent:call1', cost: 200, now: T0 });
		expect(result.ok).toBe(false);
		expect(result.shortBy).toBe(50);
		expect(balanceOf(state, T0)).toBe(150);
	});

	it('is exactly-once: retrying the SAME callId never double-charges', () => {
		const state = seeded();
		deposit(state, { opKey: 'g1', lotId: 'lot-1', lotKind: 'topup', amount: 500, expiresAt: null, now: T0 });
		const first = tryDebit(state, { opKey: 'org1:agent:call1', cost: 200, now: T0 });
		const retry = tryDebit(state, { opKey: 'org1:agent:call1', cost: 200, now: T0 + 500 });
		expect(first.replayed).toBe(false);
		expect(retry.replayed).toBe(true);
		expect(retry.balanceAfter).toBe(first.balanceAfter);
		expect(balanceOf(state, T0 + 500)).toBe(300);
	});

	it('drains exactly to zero across distinct calls, then rejects the next', () => {
		const state = seeded();
		deposit(state, { opKey: 'g1', lotId: 'lot-1', lotKind: 'topup', amount: 400, expiresAt: null, now: T0 });
		expect(tryDebit(state, { opKey: 'c1', cost: 200, now: T0 }).ok).toBe(true);
		expect(tryDebit(state, { opKey: 'c2', cost: 200, now: T0 }).ok).toBe(true);
		const third = tryDebit(state, { opKey: 'c3', cost: 200, now: T0 });
		expect(third.ok).toBe(false);
		expect(third.balanceAfter).toBe(0);
	});

	it('draws lots FIFO by soonest expiry (never-expiring lots last)', () => {
		const state = seeded();
		// Welcome lot (never expires) granted first…
		deposit(state, { opKey: 'w', lotId: 'lot-welcome', lotKind: 'welcome', amount: 300, expiresAt: null, now: T0 });
		// …then the monthly free lot, which expires — it must be drawn FIRST.
		deposit(state, { opKey: 'f', lotId: 'lot-free', lotKind: 'free', amount: 150, expiresAt: T0 + 30 * DAY, now: T0 + 1 });
		const result = tryDebit(state, { opKey: 'c1', cost: 100, now: T0 + 2 });
		expect(result.drawnFromLotId).toBe('lot-free');
		// A debit spanning lots drains the expiring lot before touching welcome.
		const spanning = tryDebit(state, { opKey: 'c2', cost: 100, now: T0 + 3 });
		expect(spanning.ok).toBe(true);
		const welcomeLot = state.lots.find((l) => l.id === 'lot-welcome');
		const freeLot = state.lots.find((l) => l.id === 'lot-free');
		expect(freeLot?.remaining).toBe(0);
		expect(welcomeLot?.remaining).toBe(250);
	});

	it('never draws expired lots', () => {
		const state = seeded();
		deposit(state, { opKey: 'f', lotId: 'lot-free', lotKind: 'free', amount: 150, expiresAt: T0 + DAY, now: T0 });
		const afterExpiry = T0 + 2 * DAY;
		expect(balanceOf(state, afterExpiry)).toBe(0);
		const result = tryDebit(state, { opKey: 'c1', cost: 30, now: afterExpiry });
		expect(result.ok).toBe(false);
	});
});

describe('balanceEngine.forceDebit (clawbacks)', () => {
	it('books the shortfall as debt and reports a negative balance', () => {
		const state = seeded();
		deposit(state, { opKey: 'g1', lotId: 'lot-1', lotKind: 'topup', amount: 100, expiresAt: null, now: T0 });
		const result = forceDebit(state, { opKey: 'refund:ch_1', amount: 250, now: T0 });
		expect(result.ok).toBe(true);
		expect(result.balanceAfter).toBe(-150);
		expect(state.debt).toBe(150);
	});

	it('debt hard-blocks spending until cured', () => {
		const state = seeded();
		deposit(state, { opKey: 'g1', lotId: 'lot-1', lotKind: 'topup', amount: 100, expiresAt: null, now: T0 });
		forceDebit(state, { opKey: 'refund:ch_1', amount: 250, now: T0 });
		const blocked = tryDebit(state, { opKey: 'c1', cost: 10, now: T0 });
		expect(blocked.ok).toBe(false);
	});

	it('the next deposit pays debt down FIRST; only the remainder is spendable', () => {
		const state = seeded();
		forceDebit(state, { opKey: 'claw', amount: 100, now: T0 });
		expect(balanceOf(state, T0)).toBe(-100);
		const result = deposit(state, { opKey: 'topup', lotId: 'lot-2', lotKind: 'topup', amount: 250, expiresAt: null, now: T0 });
		expect(result.balanceAfter).toBe(150);
		expect(state.debt).toBe(0);
		const lot = state.lots.find((l) => l.id === 'lot-2');
		expect(lot?.remaining).toBe(150);
	});
});

describe('balanceEngine.sweep', () => {
	it('lapses expired remainders, reports them, and prunes empty lots', () => {
		const state = seeded();
		deposit(state, { opKey: 'f', lotId: 'lot-free', lotKind: 'free', amount: 150, expiresAt: T0 + DAY, now: T0 });
		deposit(state, { opKey: 'w', lotId: 'lot-welcome', lotKind: 'welcome', amount: 300, expiresAt: null, now: T0 });
		tryDebit(state, { opKey: 'c1', cost: 50, now: T0 }); // draws 50 from the free lot
		const expired = sweep(state, T0 + 2 * DAY);
		expect(expired).toHaveLength(1);
		expect(expired[0]).toMatchObject({ lotId: 'lot-free', lotKind: 'free', expired: 100 });
		expect(state.lots.map((l) => l.id)).toEqual(['lot-welcome']);
		expect(balanceOf(state, T0 + 2 * DAY)).toBe(300);
	});

	it('is a no-op when nothing expired, and prunes aged idempotency records', () => {
		const state = seeded();
		deposit(state, { opKey: 'old-op', lotId: 'lot-1', lotKind: 'promo', amount: 100, expiresAt: null, now: T0 });
		expect(sweep(state, T0 + DAY)).toHaveLength(0);
		expect(state.ops['old-op']).toBeDefined();
		sweep(state, T0 + 40 * DAY);
		expect(state.ops['old-op']).toBeUndefined();
		// After pruning, the same opKey WOULD re-apply — retention (30d) is far
		// beyond any legitimate retry horizon, so this is by design.
		expect(balanceOf(state, T0 + 40 * DAY)).toBe(100);
	});
});
