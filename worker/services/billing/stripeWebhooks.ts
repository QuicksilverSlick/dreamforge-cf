/**
 * Stripe webhook processing (billing spec §5.3–§5.4 + §9.1 hardening).
 *
 * Envelope: verify signature (async Web Crypto) → dedup-insert the event id →
 * ack 200 fast → process via ctx.waitUntil, settling the event row's status.
 *
 * Money rules enforced here:
 * - `invoice.paid` is the SOLE granter of paid-period Sparks (§8.6), keyed on
 *   the subscription's canonical period start — replays/out-of-order deliveries
 *   collapse into one grant.
 * - Every handler re-fetches the authoritative object from Stripe (thin-event
 *   discipline); grants are never emitted for terminal-status subscriptions (§8.8).
 * - Org resolution comes from OUR `billing_customers` row by Stripe customer id
 *   (§9.1-F4) — the payload's client_reference_id is never trusted for money.
 * - Disputes freeze the org (blocks builds AND new checkout, §8.1/§9.1-F8).
 *   Refund/dispute Spark *clawbacks* are an operator action via the admin
 *   credit tools (PR E) — the freeze is the automatic fail-closed part; exact
 *   invoice→Spark mapping is deliberately not automated in v1.
 */

import type Stripe from 'stripe';
import { eq } from 'drizzle-orm';
import * as schema from '../../database/schema';
import { generateId } from '../../utils/idGenerator';
import { createLogger } from '../../logger';
import { createDatabaseService } from '../../database/database';
import { BillingService } from './BillingService';
import { createStripeClient, stripeCryptoProvider } from './stripeClient';
import { getExplorePlan, getProducePlan } from 'shared/constants/sparks';

const logger = createLogger('StripeWebhooks');

/** How long a period grant outlives its period: one extra month of rollover. */
const GRANT_ROLLOVER_MS = 32 * 24 * 60 * 60 * 1000;

/** Monthly Spark allotment for a catalog plan key (0 = not a Spark-granting plan). */
export function monthlySparksForPlan(planKey: string): number {
	const explore = getExplorePlan(planKey);
	if (explore) return explore.monthlySparks;
	// PRODUCE retainers exist in the catalog but their build allowances are
	// metered separately (PR D/G); no automatic Spark grant.
	return getProducePlan(planKey) ? 0 : 0;
}

/**
 * Billing period of a subscription. Basil-era API versions carry the period on
 * the subscription item, not the subscription root.
 */
export function subscriptionPeriod(sub: Stripe.Subscription): { start: number | null; end: number | null } {
	const item = sub.items.data[0];
	return {
		start: item?.current_period_start ?? null,
		end: item?.current_period_end ?? null,
	};
}

/** Canonical exactly-once key for a period grant (§8.6). */
export function periodGrantKey(subscriptionId: string, periodStartEpoch: number): string {
	return `sub_grant:${subscriptionId}:${periodStartEpoch}`;
}

/** Plan key for a subscription: our metadata first, price lookup_key fallback. */
export function planKeyOfSubscription(sub: Stripe.Subscription): string | null {
	if (sub.metadata?.planKey) return sub.metadata.planKey;
	return sub.items.data[0]?.price?.lookup_key ?? null;
}

function stripeCustomerId(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null): string | null {
	if (!customer) return null;
	return typeof customer === 'string' ? customer : customer.id;
}

/**
 * HTTP entrypoint for POST /api/billing/webhook (public route; the Stripe
 * signature IS the authentication).
 */
export async function processStripeWebhook(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const stripe = createStripeClient(env);
	if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
		return new Response('Billing not configured', { status: 503 });
	}

	const signature = request.headers.get('stripe-signature');
	if (!signature) return new Response('Missing signature', { status: 400 });

	// Raw body, read exactly once — re-parsing breaks verification (§5.5).
	const rawBody = await request.text();
	let event: Stripe.Event;
	try {
		event = await stripe.webhooks.constructEventAsync(
			rawBody,
			signature,
			env.STRIPE_WEBHOOK_SECRET,
			undefined,
			stripeCryptoProvider,
		);
	} catch (error) {
		logger.warn('Stripe webhook signature verification failed', { error });
		return new Response('Invalid signature', { status: 400 });
	}

	// Dedup: event.id is the natural PK; a conflict means already handled (§5.3).
	const db = createDatabaseService(env).db;
	const inserted = await db
		.insert(schema.stripeWebhookEvents)
		.values({ id: event.id, type: event.type, apiVersion: event.api_version ?? null })
		.onConflictDoNothing({ target: schema.stripeWebhookEvents.id })
		.returning({ id: schema.stripeWebhookEvents.id });
	if (inserted.length === 0) {
		return new Response(JSON.stringify({ received: true, duplicate: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Ack fast; do the money work off the response path.
	ctx.waitUntil(settleEvent(env, stripe, event));
	return new Response(JSON.stringify({ received: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

async function settleEvent(env: Env, stripe: Stripe, event: Stripe.Event): Promise<void> {
	const db = createDatabaseService(env).db;
	try {
		const handled = await handleEvent(env, stripe, event);
		await db
			.update(schema.stripeWebhookEvents)
			.set({ status: handled ? 'processed' : 'ignored', processedAt: new Date() })
			.where(eq(schema.stripeWebhookEvents.id, event.id));
	} catch (error) {
		logger.error('Stripe webhook handler failed', { eventId: event.id, type: event.type, error });
		await db
			.update(schema.stripeWebhookEvents)
			.set({ status: 'failed', error: error instanceof Error ? error.message : String(error), processedAt: new Date() })
			.where(eq(schema.stripeWebhookEvents.id, event.id));
	}
}

/** Returns true when the event type is one we act on. */
async function handleEvent(env: Env, stripe: Stripe, event: Stripe.Event): Promise<boolean> {
	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object;
			if (session.mode !== 'subscription' || !session.subscription) return true;
			const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
			const sub = await stripe.subscriptions.retrieve(subId);
			await upsertSubscriptionMirror(env, sub);
			// Grants are deferred to invoice.paid — the sole granter (§8.6).
			return true;
		}
		case 'customer.subscription.created':
		case 'customer.subscription.updated': {
			const sub = await stripe.subscriptions.retrieve(event.data.object.id);
			await upsertSubscriptionMirror(env, sub, event.id);
			return true;
		}
		case 'customer.subscription.deleted': {
			const sub = event.data.object;
			const db = createDatabaseService(env).db;
			await db
				.update(schema.subscriptions)
				.set({ status: 'canceled', canceledAt: new Date(), cancelAtPeriodEnd: false, updatedAt: new Date() })
				.where(eq(schema.subscriptions.stripeSubscriptionId, sub.id));
			// Remaining grant lots lapse via their own expiry (≤1 month later).
			return true;
		}
		case 'invoice.paid': {
			const invoiceId = event.data.object.id;
			if (!invoiceId) return true;
			const invoice = await stripe.invoices.retrieve(invoiceId);
			await handleInvoicePaid(env, stripe, invoice);
			return true;
		}
		case 'invoice.payment_failed': {
			const invoice = event.data.object;
			const orgId = await resolveOrgByCustomer(env, stripeCustomerId(invoice.customer));
			if (!orgId) return true;
			const db = createDatabaseService(env).db;
			await db
				.update(schema.billingCustomers)
				.set({ delinquent: true, updatedAt: new Date() })
				.where(eq(schema.billingCustomers.orgId, orgId));
			const subId = invoice.parent?.subscription_details?.subscription;
			if (subId) {
				const sub = await stripe.subscriptions.retrieve(typeof subId === 'string' ? subId : subId.id);
				await upsertSubscriptionMirror(env, sub);
			}
			logger.warn('Invoice payment failed — org soft-suspended via delinquency', { orgId });
			return true;
		}
		case 'charge.refunded': {
			// Refunds are operator-initiated in our runbook: the ledger clawback
			// is applied through the admin credit tools with this log as context.
			const charge = event.data.object;
			const orgId = await resolveOrgByCustomer(env, stripeCustomerId(charge.customer));
			logger.error('Stripe charge refunded — apply the Spark clawback via admin credit adjust', {
				orgId,
				chargeId: charge.id,
				amountRefunded: charge.amount_refunded,
				amount: charge.amount,
			});
			return true;
		}
		case 'charge.dispute.created': {
			const dispute = event.data.object;
			const charge = await stripe.charges.retrieve(
				typeof dispute.charge === 'string' ? dispute.charge : dispute.charge.id,
			);
			const orgId = await resolveOrgByCustomer(env, stripeCustomerId(charge.customer));
			if (orgId) {
				await setDisputeFrozen(env, orgId, true);
				logger.error('Stripe dispute opened — org frozen (builds + checkout blocked)', {
					orgId,
					disputeId: dispute.id,
					chargeId: charge.id,
					amount: dispute.amount,
				});
			}
			return true;
		}
		case 'charge.dispute.closed': {
			const dispute = event.data.object;
			if (dispute.status !== 'won') return true; // lost/other → stay frozen until settled by an operator
			const charge = await stripe.charges.retrieve(
				typeof dispute.charge === 'string' ? dispute.charge : dispute.charge.id,
			);
			const orgId = await resolveOrgByCustomer(env, stripeCustomerId(charge.customer));
			if (orgId) {
				await setDisputeFrozen(env, orgId, false);
				logger.info('Stripe dispute won — org unfrozen', { orgId, disputeId: dispute.id });
			}
			return true;
		}
		default:
			return false;
	}
}

/**
 * The sole paid-period granter (§8.6): grants the plan's monthly Sparks keyed
 * on the re-fetched subscription's canonical period start. Also clears
 * delinquency — money landed.
 */
async function handleInvoicePaid(env: Env, stripe: Stripe, invoice: Stripe.Invoice): Promise<void> {
	const orgId = await resolveOrgByCustomer(env, stripeCustomerId(invoice.customer));
	if (!orgId) {
		logger.error('invoice.paid for unknown customer — no billing_customers row', {
			invoiceId: invoice.id,
			customer: stripeCustomerId(invoice.customer),
		});
		return;
	}

	const db = createDatabaseService(env).db;
	await db
		.update(schema.billingCustomers)
		.set({ delinquent: false, updatedAt: new Date() })
		.where(eq(schema.billingCustomers.orgId, orgId));

	const subRef = invoice.parent?.subscription_details?.subscription;
	if (!subRef) return; // one-time invoice (PRODUCE payments arrive in PR G)
	const sub = await stripe.subscriptions.retrieve(typeof subRef === 'string' ? subRef : subRef.id);
	const localSub = await upsertSubscriptionMirror(env, sub);

	// Never grant against a terminal subscription (§8.8).
	if (sub.status !== 'active' && sub.status !== 'trialing') {
		logger.warn('invoice.paid but subscription not active — grant skipped', { subId: sub.id, status: sub.status });
		return;
	}
	const planKey = planKeyOfSubscription(sub);
	const allotment = planKey ? monthlySparksForPlan(planKey) : 0;
	const period = subscriptionPeriod(sub);
	if (!planKey || allotment <= 0 || !period.start || !period.end) {
		logger.warn('invoice.paid without a grantable plan/period', { subId: sub.id, planKey, period });
		return;
	}

	const billing = new BillingService(env);
	await billing.grant({
		orgId,
		kind: 'subscription_grant',
		lotKind: 'subscription',
		amount: allotment,
		// One month of rollover past the paid period (§8.5 / research B2).
		expiresAt: new Date(period.end * 1000 + GRANT_ROLLOVER_MS),
		idempotencyKey: periodGrantKey(sub.id, period.start),
		reason: `${planKey} period grant`,
		stripeInvoiceId: invoice.id ?? undefined,
		subscriptionId: localSub?.id,
	});
}

/**
 * Upsert the local mirror of a (re-fetched) Stripe subscription. On a
 * mid-period plan UPGRADE, grants the allotment delta as a distinct
 * `subscription_upgrade` row keyed on the triggering event (§8.4) — never
 * suppressed by the period key. Downgrades apply next period only.
 */
export async function upsertSubscriptionMirror(
	env: Env,
	sub: Stripe.Subscription,
	eventIdForUpgrade?: string,
): Promise<schema.Subscription | null> {
	const orgId = await resolveOrgByCustomer(env, stripeCustomerId(sub.customer));
	if (!orgId) {
		logger.error('Subscription for unknown customer — no billing_customers row', {
			subId: sub.id,
			customer: stripeCustomerId(sub.customer),
		});
		return null;
	}
	const db = createDatabaseService(env).db;
	const customerRow = await db
		.select({ id: schema.billingCustomers.id })
		.from(schema.billingCustomers)
		.where(eq(schema.billingCustomers.orgId, orgId))
		.limit(1);
	if (!customerRow[0]) return null;

	const planKey = planKeyOfSubscription(sub) ?? 'unknown';
	const allotment = monthlySparksForPlan(planKey);
	const period = subscriptionPeriod(sub);
	const priceId = sub.items.data[0]?.price?.id ?? '';

	const existing = await db
		.select()
		.from(schema.subscriptions)
		.where(eq(schema.subscriptions.stripeSubscriptionId, sub.id))
		.limit(1);

	const values = {
		orgId,
		billingCustomerId: customerRow[0].id,
		stripePriceId: priceId,
		planKey,
		status: sub.status,
		monthlyCreditAllotment: allotment,
		cancelAtPeriodEnd: sub.cancel_at_period_end,
		currentPeriodStart: period.start ? new Date(period.start * 1000) : null,
		currentPeriodEnd: period.end ? new Date(period.end * 1000) : null,
		canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
		updatedAt: new Date(),
	};

	if (existing[0]) {
		await db.update(schema.subscriptions).set(values).where(eq(schema.subscriptions.id, existing[0].id));
		// Mid-period upgrade: allotment grew while the sub stays active (§8.4).
		const previousAllotment = existing[0].monthlyCreditAllotment;
		if (
			eventIdForUpgrade &&
			(sub.status === 'active' || sub.status === 'trialing') &&
			allotment > previousAllotment &&
			previousAllotment > 0
		) {
			const billing = new BillingService(env);
			const upgradeDelta = allotment - previousAllotment;
			await billing.grant({
				orgId,
				kind: 'subscription_upgrade',
				lotKind: 'subscription',
				amount: upgradeDelta,
				expiresAt: period.end ? new Date(period.end * 1000 + GRANT_ROLLOVER_MS) : null,
				idempotencyKey: `sub_change:${sub.id}:${eventIdForUpgrade}`,
				reason: `upgrade to ${planKey}`,
				subscriptionId: existing[0].id,
			});
		}
		return { ...existing[0], ...values };
	}

	const id = generateId();
	await db.insert(schema.subscriptions).values({ id, stripeSubscriptionId: sub.id, ...values });
	const inserted = await db
		.select()
		.from(schema.subscriptions)
		.where(eq(schema.subscriptions.id, id))
		.limit(1);
	return inserted[0] ?? null;
}

/** Org lookup by Stripe customer id — OUR record, never payload fields (§9.1-F4). */
export async function resolveOrgByCustomer(env: Env, customerId: string | null): Promise<string | null> {
	if (!customerId) return null;
	const db = createDatabaseService(env).db;
	const rows = await db
		.select({ orgId: schema.billingCustomers.orgId })
		.from(schema.billingCustomers)
		.where(eq(schema.billingCustomers.stripeCustomerId, customerId))
		.limit(1);
	return rows[0]?.orgId ?? null;
}

async function setDisputeFrozen(env: Env, orgId: string, frozen: boolean): Promise<void> {
	const db = createDatabaseService(env).db;
	await db
		.update(schema.billingCustomers)
		.set({ disputeFrozen: frozen, updatedAt: new Date() })
		.where(eq(schema.billingCustomers.orgId, orgId));
}
