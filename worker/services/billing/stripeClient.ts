/**
 * Stripe client factory for the Workers runtime (billing spec §5.5).
 *
 * - `createFetchHttpClient()` — stripe-node's fetch transport (workerd-safe).
 * - `createSubtleCryptoProvider()` — async Web Crypto for webhook signature
 *   verification; the sync verifier does NOT work on workerd.
 * - Prices are resolved server-side by Stripe `lookup_key === PlanKey`
 *   (e.g. `explore_starter`) so no price ids ever live in config and no
 *   client-supplied amount/price is ever trusted (spec §9).
 *
 * Both secrets are optional: with them unset the feature is dark and billing
 * endpoints return 503 (`isStripeConfigured` gates every caller).
 */

import Stripe from 'stripe';

/** Module-level singleton — Stripe's SubtleCryptoProvider is stateless. */
export const stripeCryptoProvider = Stripe.createSubtleCryptoProvider();

export function isStripeConfigured(env: Env): boolean {
	return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET);
}

export function createStripeClient(env: Env): Stripe | null {
	if (!env.STRIPE_SECRET_KEY) return null;
	return new Stripe(env.STRIPE_SECRET_KEY, {
		httpClient: Stripe.createFetchHttpClient(),
		// Never retry inside the worker — callers use idempotency keys and
		// Stripe/webhook retries provide the at-least-once semantics.
		maxNetworkRetries: 0,
	});
}

/** Per-isolate cache: lookup_key → price id (prices are effectively immutable). */
const priceIdCache = new Map<string, string>();

/**
 * Resolve the ACTIVE Stripe Price for a server-catalog plan key. Throws when
 * the price is missing — a deploy/config error that must fail loudly, never
 * fall back to a client-supplied value.
 */
export async function resolvePriceIdByLookupKey(stripe: Stripe, lookupKey: string): Promise<string> {
	const cached = priceIdCache.get(lookupKey);
	if (cached) return cached;
	const prices = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
	const price = prices.data[0];
	if (!price) {
		throw new Error(`No active Stripe price with lookup_key '${lookupKey}' — create it in the dashboard/API first`);
	}
	priceIdCache.set(lookupKey, price.id);
	return price.id;
}
