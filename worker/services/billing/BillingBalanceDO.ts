/**
 * BillingBalanceDO — the per-org real-time Spark balance authority
 * (billing spec §4.2). One instance per billing-owner org, addressed by name
 * `billing:${orgId}`. The Durable Object's single-threaded execution makes
 * every operation an atomic check-and-mutate — the concurrency property the
 * whole credit system rests on (spec §8.2: two parallel builds can never both
 * spend the same Sparks).
 *
 * All accounting logic lives in the pure `balanceEngine`; this class only
 * loads state, applies an engine function, persists, and returns the result.
 * Persistence mirrors the proven DORateLimitStore pattern (single storage key
 * on the SQLite-backed store).
 */

import { DurableObject } from 'cloudflare:workers';
import {
	createEmptyState,
	deposit,
	tryDebit,
	forceDebit,
	sweep,
	balanceOf,
	type AppliedOpResult,
	type BalanceLot,
	type BalanceState,
	type DepositArgs,
	type ExpiredLotRemainder,
	type ForceDebitArgs,
	type TryDebitArgs,
} from './balanceEngine';

export interface BalanceSnapshot {
	balance: number;
	debt: number;
	lots: BalanceLot[];
}

interface PersistedState {
	lots: BalanceLot[];
	debt: number;
	ops: [string, BalanceState['ops'][string]][];
}

export class BillingBalanceDO extends DurableObject<Env> {
	private state: BalanceState = createEmptyState();
	private initialized = false;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	/** Grant Sparks (welcome/free/subscription/topup/promo/adjustment+). */
	async deposit(args: Omit<DepositArgs, 'now'>): Promise<AppliedOpResult> {
		await this.ensureInitialized();
		const result = deposit(this.state, { ...args, now: Date.now() });
		if (!result.replayed) await this.persistState();
		return result;
	}

	/**
	 * Atomic check-and-decrement. Fails closed on insufficient balance with
	 * zero mutation — the only authorizer of paid consumption.
	 */
	async tryDebit(args: Omit<TryDebitArgs, 'now'>): Promise<AppliedOpResult> {
		await this.ensureInitialized();
		const result = tryDebit(this.state, { ...args, now: Date.now() });
		if (!result.replayed && result.ok) await this.persistState();
		return result;
	}

	/** Unconditional debit (clawbacks / admin deduction); may drive debt. */
	async forceDebit(args: Omit<ForceDebitArgs, 'now'>): Promise<AppliedOpResult> {
		await this.ensureInitialized();
		const result = forceDebit(this.state, { ...args, now: Date.now() });
		if (!result.replayed) await this.persistState();
		return result;
	}

	/** Lapse expired lots + prune; returns remainders for `expiry` ledger rows. */
	async sweepExpired(): Promise<ExpiredLotRemainder[]> {
		await this.ensureInitialized();
		const expired = sweep(this.state, Date.now());
		await this.persistState();
		return expired;
	}

	async getBalance(): Promise<BalanceSnapshot> {
		await this.ensureInitialized();
		const now = Date.now();
		return {
			balance: balanceOf(this.state, now),
			debt: this.state.debt,
			lots: this.state.lots.map((lot) => ({ ...lot })),
		};
	}

	private async ensureInitialized(): Promise<void> {
		if (this.initialized) return;
		const stored = await this.ctx.storage.get<PersistedState>('state');
		if (stored) {
			this.state = {
				lots: stored.lots,
				debt: stored.debt,
				ops: Object.fromEntries(stored.ops),
			};
		}
		this.initialized = true;
	}

	private async persistState(): Promise<void> {
		const persisted: PersistedState = {
			lots: this.state.lots,
			debt: this.state.debt,
			ops: Object.entries(this.state.ops),
		};
		await this.ctx.storage.put('state', persisted);
	}
}
