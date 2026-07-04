/**
 * Billing controller — the HTTP surface of the Sparks credit system
 * (billing spec §5.2 with the §9.1 hardening).
 *
 * Route → auth mapping (see billingRoutes.ts):
 * - POST /api/orgs/:id/billing/checkout-session — org-admin (F1): only an
 *   owner/admin of the ACTIVE org can put a subscription on it.
 * - POST /api/orgs/:id/billing/portal-session — org-admin (F1): the portal
 *   exposes invoices + the payment method and allows cancellation.
 * - GET  /api/billing/summary — any authenticated member (read-only).
 * - POST /api/billing/webhook — public; the Stripe signature IS the auth.
 *
 * Plans resolve by server-catalog key only — client-supplied amounts or
 * price ids are never accepted (spec §9).
 */

import { BaseController } from '../baseController';
import { successResponse, errorResponse } from '../../responses';
import { RouteContext } from '../../types/route-context';
import { createDatabaseService } from '../../../database/database';
import * as schema from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '../../../utils/idGenerator';
import { BillingService } from '../../../services/billing/BillingService';
import {
	createStripeClient,
	isStripeConfigured,
	resolvePriceIdByLookupKey,
} from '../../../services/billing/stripeClient';
import { processStripeWebhook } from '../../../services/billing/stripeWebhooks';
import { isCloudflareGatewayLimitsEnabled } from '../../../services/rate-limit/usageChecker';
import { EXPLORE_PLANS, SPARK_ACTION_COSTS, getExplorePlan } from 'shared/constants/sparks';

interface CheckoutRequestBody {
	planKey?: string;
}

export class BillingController extends BaseController {
	/**
	 * Create a Stripe Checkout session for an EXPLORE subscription plan.
	 * Org-admin only; org id comes from the authz-verified path param.
	 */
	static async createCheckoutSession(
		request: Request,
		env: Env,
		_ctx: ExecutionContext,
		context: RouteContext,
	): Promise<Response> {
		const stripe = createStripeClient(env);
		if (!stripe || !isStripeConfigured(env)) {
			return errorResponse('Billing is not configured', 503);
		}
		// routeAuth has already proven :id === the caller's ACTIVE org and
		// that the caller is its owner/admin (spec §9.1-F1).
		const orgId = context.pathParams.id;
		const user = context.user;
		if (!orgId || !user) return errorResponse('Organization required', 400);

		const body = await this.parseJsonBody<CheckoutRequestBody>(request);
		if (!body.success || !body.data) return body.response ?? errorResponse('Invalid request body', 400);
		const plan = body.data.planKey ? getExplorePlan(body.data.planKey) : undefined;
		if (!plan || plan.priceUsd <= 0) {
			return errorResponse('Unknown plan', 400);
		}

		const db = createDatabaseService(env).db;
		const customerRows = await db
			.select()
			.from(schema.billingCustomers)
			.where(eq(schema.billingCustomers.orgId, orgId))
			.limit(1);
		let customer = customerRows[0];

		// A frozen org must not self-cure a disputed balance with new money (§9.1-F8).
		if (customer?.disputeFrozen) {
			return errorResponse('Billing is locked while a payment dispute is open. Contact support.', 403);
		}

		// One subscription per org: changes go through the Customer Portal.
		const active = await db
			.select({ id: schema.subscriptions.id })
			.from(schema.subscriptions)
			.where(eq(schema.subscriptions.orgId, orgId))
			.limit(10);
		if (active.length > 0) {
			const hasLive = await new BillingService(env).getBalanceSummary(orgId);
			if (hasLive.subscription) {
				return errorResponse('This organization already has a plan — manage it from the billing portal.', 409);
			}
		}

		if (!customer) {
			const stripeCustomer = await stripe.customers.create(
				{
					email: user.email,
					metadata: { orgId },
				},
				{ idempotencyKey: `cust:${orgId}` },
			);
			const id = generateId();
			await db.insert(schema.billingCustomers).values({
				id,
				orgId,
				userId: user.id,
				stripeCustomerId: stripeCustomer.id,
				email: user.email,
			});
			const inserted = await db
				.select()
				.from(schema.billingCustomers)
				.where(eq(schema.billingCustomers.id, id))
				.limit(1);
			customer = inserted[0];
		}

		const priceId = await resolvePriceIdByLookupKey(stripe, plan.key);
		const origin = new URL(request.url).origin;
		const session = await stripe.checkout.sessions.create(
			{
				mode: 'subscription',
				customer: customer.stripeCustomerId,
				line_items: [{ price: priceId, quantity: 1 }],
				success_url: `${origin}/settings?billing=success`,
				cancel_url: `${origin}/settings?billing=cancelled`,
				client_reference_id: orgId,
				metadata: { orgId, planKey: plan.key },
				subscription_data: { metadata: { orgId, planKey: plan.key } },
			},
			{ idempotencyKey: `checkout:${orgId}:${plan.key}:${generateId()}` },
		);
		return successResponse({ url: session.url });
	}

	/** Stripe Customer Portal (plan change / cancel / payment method / invoices). */
	static async createPortalSession(
		request: Request,
		env: Env,
		_ctx: ExecutionContext,
		context: RouteContext,
	): Promise<Response> {
		const stripe = createStripeClient(env);
		if (!stripe) return errorResponse('Billing is not configured', 503);
		const orgId = context.pathParams.id;
		if (!orgId) return errorResponse('Organization required', 400);

		const db = createDatabaseService(env).db;
		const customerRows = await db
			.select({ stripeCustomerId: schema.billingCustomers.stripeCustomerId })
			.from(schema.billingCustomers)
			.where(eq(schema.billingCustomers.orgId, orgId))
			.limit(1);
		if (!customerRows[0]) return errorResponse('No billing account for this organization yet', 404);

		const origin = new URL(request.url).origin;
		const session = await stripe.billingPortal.sessions.create({
			customer: customerRows[0].stripeCustomerId,
			return_url: `${origin}/settings`,
		});
		return successResponse({ url: session.url });
	}

	/**
	 * Balance + plan summary for the caller's ACTIVE org. Also the lazy
	 * materialization point for the baseline grants (300 welcome + monthly
	 * 150 free) — idempotent on every call (spec §0.4).
	 */
	static async getSummary(
		_request: Request,
		env: Env,
		_ctx: ExecutionContext,
		context: RouteContext,
	): Promise<Response> {
		const user = context.user;
		if (!user?.orgId) return errorResponse('No active organization', 400);
		const billing = new BillingService(env);
		await billing.ensureBaselineGrants(user.orgId, user.id);
		const summary = await billing.getBalanceSummary(user.orgId);
		return successResponse({
			orgId: user.orgId,
			balance: summary.balance,
			debt: summary.debt,
			subscription: summary.subscription,
			sparkCosts: SPARK_ACTION_COSTS,
			plans: EXPLORE_PLANS,
			stripeConfigured: isStripeConfigured(env),
			// Sparks metering live on this deployment (self-hosted => false, UI stays dark).
			meteringEnabled: isCloudflareGatewayLimitsEnabled(env),
			// Only an org owner/admin can start checkout / open the portal (§9.1-F1);
			// the UI uses this to route members to their admin instead of a 403.
			canManageBilling: user.orgRole === 'owner' || user.orgRole === 'admin',
		});
	}

	/** Public webhook — signature-verified inside (spec §5.3). */
	static async handleWebhook(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
		_context: RouteContext,
	): Promise<Response> {
		return processStripeWebhook(request, env, ctx);
	}
}
