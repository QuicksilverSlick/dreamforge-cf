/**
 * BillingService — the worker-side API of the Sparks credit system.
 *
 * Pairs every BillingBalanceDO mutation (the real-time entitlement authority)
 * with an append-only `credit_ledger` audit row (the money/reconciliation
 * surface). The DO result is authoritative; ledger appends are idempotent via
 * the globally-unique idempotency key, and the nightly reconciler (PR C)
 * detects any DO↔ledger drift. See docs/handoff/PLATFORM-BILLING-SPEC.md
 * §4/§6 + the locked parameters in §0.
 */

import { and, desc, eq, inArray } from 'drizzle-orm';
import { generateId } from '../../utils/idGenerator';
import * as schema from '../../database/schema';
import { BaseService } from '../../database/services/BaseService';
import {
	EXPLORE_PLANS,
	SPARK_ACTION_COSTS,
	WELCOME_GRANT_SPARKS,
	type SparkActionType,
} from 'shared/constants/sparks';
import type { BalanceSnapshot } from './BillingBalanceDO';
import type { LedgerEntryKind, LedgerLotKind, Subscription } from '../../database/schema';

/** Ledger kinds that add Sparks via a grant lot. */
type GrantKind = Extract<
	LedgerEntryKind,
	'welcome_grant' | 'free_grant' | 'subscription_grant' | 'subscription_upgrade' | 'topup_grant' | 'promo_grant'
>;

export interface GrantArgs {
	orgId: string;
	/** Provenance only — the org owns the balance. */
	userId?: string;
	kind: GrantKind;
	lotKind: LedgerLotKind;
	amount: number;
	/** null = never expires. */
	expiresAt: Date | null;
	/** Exactly-once key (stripe event id, canonical period key, …). */
	idempotencyKey: string;
	reason?: string;
	stripeEventId?: string;
	stripeInvoiceId?: string;
	stripeChargeId?: string;
	subscriptionId?: string;
}

export interface DebitActionArgs {
	orgId: string;
	/** Provenance only. */
	userId?: string;
	actionType: SparkActionType;
	/** Build session the consumption belongs to. */
	agentId: string;
	/** Unique per metered call, generated OUTSIDE any retry loop (spec §6.5). */
	callId: string;
	modelName?: string;
	/** Override the catalog rate (e.g. the premium-build rate). */
	costOverride?: number;
}

export interface DebitActionResult {
	ok: boolean;
	balanceAfter: number;
	/** How many Sparks short on a rejected debit. */
	shortBy?: number;
	/** True when this exact call was already charged (idempotent replay). */
	replayed: boolean;
	cost: number;
}

export interface AdminAdjustArgs {
	orgId: string;
	/** The admin performing the adjustment (audited). */
	actorUserId: string;
	/** Signed Sparks: positive grants, negative deducts (may drive debt). */
	delta: number;
	reason: string;
}

export interface BalanceSummary extends BalanceSnapshot {
	/** Active/trialing subscription mirror row, if any. */
	subscription: Pick<Subscription, 'planKey' | 'status' | 'currentPeriodEnd'> | null;
}

export class BillingService extends BaseService {
	private stub(orgId: string) {
		return this.env.BillingBalanceDO.getByName(`billing:${orgId}`);
	}

	/** Live balance + lot detail from the DO, plus the subscription mirror. */
	async getBalanceSummary(orgId: string): Promise<BalanceSummary> {
		const [snapshot, subscription] = await Promise.all([
			this.stub(orgId).getBalance(),
			this.getActiveSubscription(orgId),
		]);
		return {
			...snapshot,
			subscription: subscription
				? {
						planKey: subscription.planKey,
						status: subscription.status,
						currentPeriodEnd: subscription.currentPeriodEnd,
					}
				: null,
		};
	}

	/**
	 * Idempotently apply the baseline free-tier grants (spec §0.1/§0.4):
	 * the one-time welcome grant, and the current month's non-rolling free
	 * allowance — the latter only while the org has no active paid plan
	 * (paid allotments arrive as `subscription_grant`s from Stripe webhooks).
	 * Safe to call on every entitlement check; replays are no-ops.
	 */
	async ensureBaselineGrants(orgId: string, userId?: string): Promise<void> {
		await this.grant({
			orgId,
			userId,
			kind: 'welcome_grant',
			lotKind: 'welcome',
			amount: WELCOME_GRANT_SPARKS,
			expiresAt: null,
			idempotencyKey: `welcome:${orgId}`,
			reason: 'signup welcome grant',
		});

		const activeSubscription = await this.getActiveSubscription(orgId);
		if (activeSubscription) return;

		const freePlan = EXPLORE_PLANS.find((p) => p.key === 'explore_free');
		if (!freePlan) return;
		const now = new Date();
		const periodKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
		const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
		await this.grant({
			orgId,
			userId,
			kind: 'free_grant',
			lotKind: 'free',
			amount: freePlan.monthlySparks,
			expiresAt: nextMonthStart,
			idempotencyKey: `free:${orgId}:${periodKey}`,
			reason: `free-tier allowance ${periodKey}`,
		});
	}

	/** Grant Sparks: DO deposit (debt paid first) + audit ledger row. */
	async grant(args: GrantArgs): Promise<{ balanceAfter: number; replayed: boolean }> {
		const lotId = generateId();
		const result = await this.stub(args.orgId).deposit({
			opKey: args.idempotencyKey,
			lotId,
			lotKind: args.lotKind,
			amount: args.amount,
			expiresAt: args.expiresAt ? args.expiresAt.getTime() : null,
		});
		if (!result.replayed) {
			await this.appendLedger({
				orgId: args.orgId,
				userId: args.userId ?? null,
				kind: args.kind,
				delta: args.amount,
				balanceAfter: result.balanceAfter,
				idempotencyKey: args.idempotencyKey,
				lotKind: args.lotKind,
				expiresAt: args.expiresAt,
				reason: args.reason ?? null,
				stripeEventId: args.stripeEventId ?? null,
				stripeInvoiceId: args.stripeInvoiceId ?? null,
				stripeChargeId: args.stripeChargeId ?? null,
				subscriptionId: args.subscriptionId ?? null,
			});
		}
		return { balanceAfter: result.balanceAfter, replayed: result.replayed };
	}

	/**
	 * Meter one action against the org's balance — the atomic
	 * check-and-decrement that authorizes paid consumption (spec §6.4/§6.5).
	 * Fails closed with zero mutation when the balance can't cover the cost.
	 */
	async tryDebitAction(args: DebitActionArgs): Promise<DebitActionResult> {
		const cost =
			args.costOverride ??
			(args.actionType === 'llm_call' ? undefined : SPARK_ACTION_COSTS[args.actionType]);
		if (cost === undefined || !Number.isInteger(cost) || cost <= 0) {
			throw new Error(`No Spark cost resolvable for action '${args.actionType}'`);
		}
		const opKey = `${args.orgId}:${args.agentId}:${args.callId}`;
		const result = await this.stub(args.orgId).tryDebit({ opKey, cost });
		if (result.ok && !result.replayed) {
			await this.appendLedger({
				orgId: args.orgId,
				userId: args.userId ?? null,
				kind: 'consume',
				actionType: args.actionType,
				delta: -cost,
				balanceAfter: result.balanceAfter,
				idempotencyKey: opKey,
				drawsFromLotId: result.drawnFromLotId,
				agentId: args.agentId,
				modelName: args.modelName ?? null,
			});
		}
		return {
			ok: result.ok,
			balanceAfter: result.balanceAfter,
			shortBy: result.shortBy,
			replayed: result.replayed,
			cost,
		};
	}

	/**
	 * Refund a charged action whose provider call failed after the debit
	 * (spec §6.6): a single idempotent DO deposit keyed off the callId.
	 */
	async refundFailedAction(args: {
		orgId: string;
		userId?: string;
		agentId: string;
		callId: string;
		amount: number;
		reason: string;
	}): Promise<void> {
		const idempotencyKey = `refund:${args.orgId}:${args.agentId}:${args.callId}`;
		const lotId = generateId();
		const result = await this.stub(args.orgId).deposit({
			opKey: idempotencyKey,
			lotId,
			lotKind: 'promo',
			amount: args.amount,
			expiresAt: null,
		});
		if (!result.replayed) {
			await this.appendLedger({
				orgId: args.orgId,
				userId: args.userId ?? null,
				kind: 'adjustment',
				delta: args.amount,
				balanceAfter: result.balanceAfter,
				idempotencyKey,
				lotKind: 'promo',
				agentId: args.agentId,
				reason: args.reason,
			});
		}
	}

	/**
	 * Operator adjustment (admin credit controls, spec §0.5): signed delta,
	 * mandatory reason, actor recorded on the ledger row. Positive deltas
	 * grant a never-expiring promo lot; negative deltas force-debit and may
	 * drive the balance negative (hard-blocking spend until cured).
	 */
	async adminAdjust(args: AdminAdjustArgs): Promise<{ balanceAfter: number }> {
		if (!Number.isInteger(args.delta) || args.delta === 0) {
			throw new Error(`adminAdjust delta must be a non-zero integer, got ${args.delta}`);
		}
		if (!args.reason.trim()) {
			throw new Error('adminAdjust requires a reason');
		}
		const idempotencyKey = `adj:${generateId()}`;
		const stub = this.stub(args.orgId);
		const result =
			args.delta > 0
				? await stub.deposit({
						opKey: idempotencyKey,
						lotId: generateId(),
						lotKind: 'promo',
						amount: args.delta,
						expiresAt: null,
					})
				: await stub.forceDebit({ opKey: idempotencyKey, amount: -args.delta });
		await this.appendLedger({
			orgId: args.orgId,
			userId: args.actorUserId,
			kind: 'adjustment',
			delta: args.delta,
			balanceAfter: result.balanceAfter,
			idempotencyKey,
			lotKind: args.delta > 0 ? 'promo' : null,
			reason: args.reason,
		});
		return { balanceAfter: result.balanceAfter };
	}

	/**
	 * Lapse expired lots for one org (nightly cron, spec §5.7): the DO zeroes
	 * expired remainders; each becomes an `expiry` ledger row keyed by lot id
	 * (naturally idempotent on replay).
	 */
	async sweepOrgExpiry(orgId: string): Promise<number> {
		const expired = await this.stub(orgId).sweepExpired();
		for (const lot of expired) {
			await this.appendLedger({
				orgId,
				userId: null,
				kind: 'expiry',
				delta: -lot.expired,
				balanceAfter: lot.balanceAfter,
				idempotencyKey: `expire:${lot.lotId}`,
				lotKind: lot.lotKind,
				drawsFromLotId: lot.lotId,
				reason: 'grant lot expired',
			});
		}
		return expired.length;
	}

	private async getActiveSubscription(orgId: string): Promise<Subscription | null> {
		const rows = await this.database
			.select()
			.from(schema.subscriptions)
			.where(
				and(
					eq(schema.subscriptions.orgId, orgId),
					inArray(schema.subscriptions.status, ['active', 'trialing']),
				),
			)
			.orderBy(desc(schema.subscriptions.updatedAt))
			.limit(1);
		return rows[0] ?? null;
	}

	/**
	 * Append-only audit write. Exactly-once via the unique idempotency key;
	 * on conflict, verifies the existing row belongs to the SAME org before
	 * treating it as already-processed — a cross-org collision is a fraud
	 * signal, never a silent skip (spec §9.1-F6).
	 */
	private async appendLedger(entry: {
		orgId: string;
		userId: string | null;
		kind: LedgerEntryKind;
		delta: number;
		balanceAfter: number;
		idempotencyKey: string;
		actionType?: SparkActionType;
		lotKind?: LedgerLotKind | null;
		drawsFromLotId?: string | null;
		expiresAt?: Date | null;
		stripeEventId?: string | null;
		stripeInvoiceId?: string | null;
		stripeChargeId?: string | null;
		subscriptionId?: string | null;
		agentId?: string | null;
		modelName?: string | null;
		reason?: string | null;
	}): Promise<void> {
		const inserted = await this.database
			.insert(schema.creditLedger)
			.values({
				id: generateId(),
				orgId: entry.orgId,
				userId: entry.userId,
				kind: entry.kind,
				actionType: entry.actionType ?? null,
				delta: entry.delta,
				balanceAfter: entry.balanceAfter,
				idempotencyKey: entry.idempotencyKey,
				lotKind: entry.lotKind ?? null,
				drawsFromLotId: entry.drawsFromLotId ?? null,
				expiresAt: entry.expiresAt ?? null,
				stripeEventId: entry.stripeEventId ?? null,
				stripeInvoiceId: entry.stripeInvoiceId ?? null,
				stripeChargeId: entry.stripeChargeId ?? null,
				subscriptionId: entry.subscriptionId ?? null,
				agentId: entry.agentId ?? null,
				modelName: entry.modelName ?? null,
				reason: entry.reason ?? null,
			})
			.onConflictDoNothing({ target: schema.creditLedger.idempotencyKey })
			.returning({ id: schema.creditLedger.id });

		if (inserted.length === 0) {
			const existing = await this.database
				.select({ orgId: schema.creditLedger.orgId })
				.from(schema.creditLedger)
				.where(eq(schema.creditLedger.idempotencyKey, entry.idempotencyKey))
				.limit(1);
			if (existing[0] && existing[0].orgId !== entry.orgId) {
				this.logger.error('Cross-org credit-ledger idempotency collision — treating as fraud signal', {
					idempotencyKey: entry.idempotencyKey,
					attemptedOrgId: entry.orgId,
					existingOrgId: existing[0].orgId,
				});
			}
		}
	}
}
