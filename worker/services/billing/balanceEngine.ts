/**
 * Pure Spark balance engine — the lot-accounting core of the per-org
 * BillingBalanceDO (billing spec §4.2). No I/O, no clock reads: every function
 * takes `now` explicitly and mutates the passed state deterministically, so
 * the whole money path is unit-testable without the DO runtime. The DO is a
 * thin persistence wrapper around these functions.
 *
 * Model:
 * - Grants create LOTS (kind + remaining + optional expiry). Consumption draws
 *   lots FIFO by soonest expiry (never-expiring lots last), maximizing user
 *   value and making expiry deterministic (spec §8.5).
 * - Clawbacks may exceed available balance; the excess becomes DEBT (>= 0).
 *   Balance = sum(usable lot remainders) − debt. Debt hard-blocks spending
 *   (spec §8.1) and is paid down first by the next deposit.
 * - Every mutating op carries an opKey and is exactly-once: replays return the
 *   original result without re-applying (the DO analogue of the D1 ledger's
 *   unique idempotency key).
 */

import type { LedgerLotKind } from '../../database/schema';

export interface BalanceLot {
	id: string;
	lotKind: LedgerLotKind;
	remaining: number;
	/** ms epoch; null = never expires. */
	expiresAt: number | null;
	createdAt: number;
}

export interface BalanceOpResult {
	ok: boolean;
	/** Balance (usable − debt) after the op. */
	balanceAfter: number;
	/** First lot drawn from (consume audit: credit_ledger.draws_from_lot_id). */
	drawnFromLotId: string | null;
	/** On a failed tryDebit: how many Sparks short the org was. */
	shortBy?: number;
}

/** Result returned to callers; `replayed` marks an idempotent re-delivery. */
export interface AppliedOpResult extends BalanceOpResult {
	replayed: boolean;
}

interface OpRecord {
	result: BalanceOpResult;
	createdAt: number;
}

export interface BalanceState {
	lots: BalanceLot[];
	/** Sparks owed after clawbacks exceeded available balance; always >= 0. */
	debt: number;
	/** Idempotency journal: opKey → outcome of the first application. */
	ops: Record<string, OpRecord>;
}

export interface ExpiredLotRemainder {
	lotId: string;
	lotKind: LedgerLotKind;
	expired: number;
	/** Balance after this specific lot lapsed (for the ledger's balance_after). */
	balanceAfter: number;
}

/** Keep idempotency records for 30 days — far beyond any retry horizon. */
const OP_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

export function createEmptyState(): BalanceState {
	return { lots: [], debt: 0, ops: {} };
}

function isUsable(lot: BalanceLot, now: number): boolean {
	return lot.remaining > 0 && (lot.expiresAt === null || lot.expiresAt > now);
}

function usableSparks(state: BalanceState, now: number): number {
	return state.lots.reduce((sum, lot) => sum + (isUsable(lot, now) ? lot.remaining : 0), 0);
}

/** Current spendable balance: usable lot remainders minus outstanding debt. */
export function balanceOf(state: BalanceState, now: number): number {
	return usableSparks(state, now) - state.debt;
}

/** Lots ordered for drawing: soonest expiry first, never-expiring last, then oldest. */
function drawOrder(state: BalanceState, now: number): BalanceLot[] {
	return state.lots
		.filter((lot) => isUsable(lot, now))
		.sort((a, b) => {
			if (a.expiresAt === null && b.expiresAt === null) return a.createdAt - b.createdAt;
			if (a.expiresAt === null) return 1;
			if (b.expiresAt === null) return -1;
			return a.expiresAt - b.expiresAt || a.createdAt - b.createdAt;
		});
}

function replayOrRecord(
	state: BalanceState,
	opKey: string,
	now: number,
	apply: () => BalanceOpResult,
): AppliedOpResult {
	const existing = state.ops[opKey];
	if (existing) {
		return { ...existing.result, replayed: true };
	}
	const result = apply();
	state.ops[opKey] = { result, createdAt: now };
	return { ...result, replayed: false };
}

export interface DepositArgs {
	opKey: string;
	/** Pre-generated lot id (crypto.randomUUID-class entropy, §9.1-F6). */
	lotId: string;
	lotKind: LedgerLotKind;
	amount: number;
	/** ms epoch; null = never expires. */
	expiresAt: number | null;
	now: number;
}

/**
 * Grant Sparks. Pays outstanding debt first; only the remainder becomes a
 * spendable lot (so a clawed-back org can't spend around its debt).
 */
export function deposit(state: BalanceState, args: DepositArgs): AppliedOpResult {
	const { opKey, lotId, lotKind, amount, expiresAt, now } = args;
	if (!Number.isInteger(amount) || amount <= 0) {
		throw new Error(`deposit amount must be a positive integer, got ${amount}`);
	}
	return replayOrRecord(state, opKey, now, () => {
		const debtPaydown = Math.min(state.debt, amount);
		state.debt -= debtPaydown;
		const lotAmount = amount - debtPaydown;
		if (lotAmount > 0) {
			state.lots.push({ id: lotId, lotKind, remaining: lotAmount, expiresAt, createdAt: now });
		}
		return { ok: true, balanceAfter: balanceOf(state, now), drawnFromLotId: null };
	});
}

export interface TryDebitArgs {
	opKey: string;
	cost: number;
	now: number;
}

/**
 * Atomic check-and-decrement — the only thing that authorizes paid spend.
 * Fails closed: insufficient balance (or any outstanding debt) rejects with
 * ZERO state mutation. Draws lots FIFO by soonest expiry.
 */
export function tryDebit(state: BalanceState, args: TryDebitArgs): AppliedOpResult {
	const { opKey, cost, now } = args;
	if (!Number.isInteger(cost) || cost <= 0) {
		throw new Error(`tryDebit cost must be a positive integer, got ${cost}`);
	}
	return replayOrRecord(state, opKey, now, () => {
		const available = balanceOf(state, now);
		if (available < cost) {
			return {
				ok: false,
				balanceAfter: available,
				drawnFromLotId: null,
				shortBy: cost - available,
			};
		}
		let toDraw = cost;
		let firstLotId: string | null = null;
		for (const lot of drawOrder(state, now)) {
			if (toDraw === 0) break;
			const draw = Math.min(lot.remaining, toDraw);
			lot.remaining -= draw;
			toDraw -= draw;
			if (firstLotId === null && draw > 0) firstLotId = lot.id;
		}
		return { ok: true, balanceAfter: balanceOf(state, now), drawnFromLotId: firstLotId };
	});
}

export interface ForceDebitArgs {
	opKey: string;
	amount: number;
	now: number;
}

/**
 * Unconditional debit for refund/dispute clawbacks and admin deductions
 * (spec §8.1): draws whatever is available and books the shortfall as debt,
 * driving the reported balance negative. Never used for consumption.
 */
export function forceDebit(state: BalanceState, args: ForceDebitArgs): AppliedOpResult {
	const { opKey, amount, now } = args;
	if (!Number.isInteger(amount) || amount <= 0) {
		throw new Error(`forceDebit amount must be a positive integer, got ${amount}`);
	}
	return replayOrRecord(state, opKey, now, () => {
		let toDraw = amount;
		let firstLotId: string | null = null;
		for (const lot of drawOrder(state, now)) {
			if (toDraw === 0) break;
			const draw = Math.min(lot.remaining, toDraw);
			lot.remaining -= draw;
			toDraw -= draw;
			if (firstLotId === null && draw > 0) firstLotId = lot.id;
		}
		state.debt += toDraw;
		return { ok: true, balanceAfter: balanceOf(state, now), drawnFromLotId: firstLotId };
	});
}

/**
 * Lapse expired lots (nightly cron): zeroes each expired remainder and reports
 * it so the caller can append `expiry` ledger rows (keyed `expire:${lotId}` —
 * naturally idempotent at the D1 layer). Also prunes empty lots and aged
 * idempotency records.
 */
export function sweep(state: BalanceState, now: number): ExpiredLotRemainder[] {
	const expired: ExpiredLotRemainder[] = [];
	for (const lot of state.lots) {
		if (lot.remaining > 0 && lot.expiresAt !== null && lot.expiresAt <= now) {
			const remainder = lot.remaining;
			lot.remaining = 0;
			expired.push({
				lotId: lot.id,
				lotKind: lot.lotKind,
				expired: remainder,
				balanceAfter: balanceOf(state, now),
			});
		}
	}
	state.lots = state.lots.filter((lot) => lot.remaining > 0);
	for (const [key, record] of Object.entries(state.ops)) {
		if (now - record.createdAt > OP_RETENTION_MS) {
			delete state.ops[key];
		}
	}
	return expired;
}
