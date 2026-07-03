/**
 * Nightly billing reconciliation (billing spec §5.7), run from the worker's
 * `scheduled()` handler. Corrections are only ever APPENDED (new ledger rows /
 * mirror updates) — never edits to existing ledger history.
 *
 * v1 scope:
 * 1. Grant-lot expiry — lapse expired lots per org (free-tier month ends,
 *    subscription rollover windows), appending `expiry` ledger rows.
 * 2. Subscription drift — re-fetch every non-terminal subscription mirror
 *    from Stripe (Stripe owns money), overwrite the mirror, and backfill any
 *    missing paid-period grant (idempotent by the canonical period key; never
 *    granted for terminal statuses, §8.8).
 */

import { and, gt, inArray, isNotNull, lte, ne } from 'drizzle-orm';
import * as schema from '../../database/schema';
import { createDatabaseService } from '../../database/database';
import { createLogger } from '../../logger';
import { BillingService } from './BillingService';
import { createStripeClient } from './stripeClient';
import {
	monthlySparksForPlan,
	periodGrantKey,
	planKeyOfSubscription,
	subscriptionPeriod,
	upsertSubscriptionMirror,
} from './stripeWebhooks';

const logger = createLogger('BillingReconciler');

/** Bound each run: at most this many orgs swept / subscriptions re-fetched. */
const MAX_ORGS_PER_SWEEP = 500;
const MAX_SUBSCRIPTIONS_PER_RUN = 200;

/** How far back to look for expired-but-unswept lots. */
const EXPIRY_LOOKBACK_MS = 45 * 24 * 60 * 60 * 1000;

export async function reconcileBilling(env: Env): Promise<void> {
	const started = Date.now();
	const expiredOrgs = await sweepExpiredLots(env);
	const driftChecked = await reconcileSubscriptions(env);
	logger.info('Billing reconciliation complete', {
		orgsSwept: expiredOrgs,
		subscriptionsChecked: driftChecked,
		durationMs: Date.now() - started,
	});
}

/** Orgs with grant lots that have passed expiry get a DO sweep + expiry rows. */
async function sweepExpiredLots(env: Env): Promise<number> {
	const db = createDatabaseService(env).db;
	const now = new Date();
	const lookback = new Date(now.getTime() - EXPIRY_LOOKBACK_MS);
	const rows = await db
		.selectDistinct({ orgId: schema.creditLedger.orgId })
		.from(schema.creditLedger)
		.where(
			and(
				isNotNull(schema.creditLedger.expiresAt),
				lte(schema.creditLedger.expiresAt, now),
				gt(schema.creditLedger.expiresAt, lookback),
				ne(schema.creditLedger.kind, 'expiry'),
			),
		)
		.limit(MAX_ORGS_PER_SWEEP);

	const billing = new BillingService(env);
	let swept = 0;
	for (const row of rows) {
		try {
			await billing.sweepOrgExpiry(row.orgId);
			swept++;
		} catch (error) {
			logger.error('Expiry sweep failed for org', { orgId: row.orgId, error });
		}
	}
	return swept;
}

/**
 * Re-fetch non-terminal subscriptions from Stripe, overwrite the mirror, and
 * ensure the current paid period's grant exists (webhook-miss backfill).
 */
async function reconcileSubscriptions(env: Env): Promise<number> {
	const stripe = createStripeClient(env);
	if (!stripe) return 0; // feature dark — nothing to reconcile

	const db = createDatabaseService(env).db;
	const rows = await db
		.select()
		.from(schema.subscriptions)
		.where(inArray(schema.subscriptions.status, ['active', 'trialing', 'past_due', 'unpaid', 'incomplete']))
		.limit(MAX_SUBSCRIPTIONS_PER_RUN);

	const billing = new BillingService(env);
	let checked = 0;
	for (const mirror of rows) {
		try {
			const sub = await stripe.subscriptions.retrieve(mirror.stripeSubscriptionId);
			const localSub = await upsertSubscriptionMirror(env, sub);
			checked++;

			// Backfill a missed period grant — same canonical key as the
			// webhook path, so double delivery is impossible (§8.6), and never
			// against a terminal status (§8.8).
			if (sub.status !== 'active' && sub.status !== 'trialing') continue;
			const planKey = planKeyOfSubscription(sub);
			const allotment = planKey ? monthlySparksForPlan(planKey) : 0;
			const period = subscriptionPeriod(sub);
			if (!planKey || allotment <= 0 || !period.start || !period.end) continue;
			await billing.grant({
				orgId: mirror.orgId,
				kind: 'subscription_grant',
				lotKind: 'subscription',
				amount: allotment,
				expiresAt: new Date(period.end * 1000 + 32 * 24 * 60 * 60 * 1000),
				idempotencyKey: periodGrantKey(sub.id, period.start),
				reason: `${planKey} period grant (reconciler backfill)`,
				subscriptionId: localSub?.id ?? mirror.id,
			});
		} catch (error) {
			logger.error('Subscription drift check failed', { subscriptionId: mirror.stripeSubscriptionId, error });
		}
	}
	return checked;
}
