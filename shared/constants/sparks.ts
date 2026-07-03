/**
 * Sparks — the platform credit currency.
 *
 * Single source of truth for the owner-approved commercial parameters
 * (docs/handoff/PLATFORM-BILLING-SPEC.md §0, locked 2026-07-02). Server-side
 * catalog: prices and allowances are NEVER accepted from the client — billing
 * endpoints resolve plans by key from these tables only.
 */

/**
 * Metered action types. `build`/`edit`/`image`/`deploy` are the user-facing
 * price card; `llm_call` is reserved for fine-grained internal metering.
 * Also drives the `credit_ledger.action_type` schema enum.
 */
export const SPARK_ACTION_TYPES = ['build', 'edit', 'image', 'deploy', 'llm_call'] as const;
export type SparkActionType = (typeof SPARK_ACTION_TYPES)[number];

/** Spark price per metered action (cost basis ≈ $0.01 of delivered COGS per Spark). */
export const SPARK_ACTION_COSTS: Record<Exclude<SparkActionType, 'llm_call'>, number> = {
	/** Full app generation + sandbox deploy — the expensive action. */
	build: 200,
	/** Iteration / small change on an existing app. */
	edit: 30,
	/** One generated image. */
	image: 65,
	/** Deploy to production. */
	deploy: 10,
};

/**
 * Premium-model (native-Anthropic Opus) build rate. Applies only once the
 * native `/ai/v1/messages` route ships; unused until then.
 */
export const SPARK_PREMIUM_BUILD_COST = 450;

/** One-time signup grant so a brand-new user can complete a first full build. */
export const WELCOME_GRANT_SPARKS = 300;

/** EXPLORE lane — self-serve subscription plans with a monthly Spark allowance. */
export interface ExplorePlan {
	key: 'explore_free' | 'explore_starter' | 'explore_plus';
	name: string;
	/** Monthly price in whole USD; 0 = free tier. */
	priceUsd: number;
	/** Non-rolling monthly Spark grant; the allowance IS the hard cap. */
	monthlySparks: number;
}

export const EXPLORE_PLANS: readonly ExplorePlan[] = [
	{ key: 'explore_free', name: 'Free', priceUsd: 0, monthlySparks: 150 },
	{ key: 'explore_starter', name: 'Starter', priceUsd: 25, monthlySparks: 2500 },
	{ key: 'explore_plus', name: 'Plus', priceUsd: 50, monthlySparks: 6000 },
] as const;

/**
 * PRODUCE lane — outcome tiers sold via apply → scoping call → hosted payment
 * (never self-serve checkout). One-time onboarding fee + monthly retainer.
 */
export interface ProducePlan {
	key: 'produce_solo' | 'produce_studio' | 'produce_pro' | 'produce_enterprise';
	name: string;
	onboardingUsd: number;
	monthlyUsd: number;
	/** Pooled seat ceiling; null = custom/negotiated. */
	maxSeats: number | null;
}

export const PRODUCE_PLANS: readonly ProducePlan[] = [
	{ key: 'produce_solo', name: 'Solo', onboardingUsd: 1000, monthlyUsd: 99, maxSeats: 1 },
	{ key: 'produce_studio', name: 'Team Studio', onboardingUsd: 3500, monthlyUsd: 695, maxSeats: 5 },
	{ key: 'produce_pro', name: 'Team Pro', onboardingUsd: 7500, monthlyUsd: 1800, maxSeats: 10 },
	{ key: 'produce_enterprise', name: 'Enterprise', onboardingUsd: 15000, monthlyUsd: 4000, maxSeats: null },
] as const;

/** Standalone validation SKU; also step 1 of every PRODUCE engagement. */
export const TRACTION_SPRINT_USD = 750;

export type ExplorePlanKey = ExplorePlan['key'];
export type ProducePlanKey = ProducePlan['key'];
export type PlanKey = ExplorePlanKey | ProducePlanKey;

export function getExplorePlan(key: string): ExplorePlan | undefined {
	return EXPLORE_PLANS.find((p) => p.key === key);
}

export function getProducePlan(key: string): ProducePlan | undefined {
	return PRODUCE_PLANS.find((p) => p.key === key);
}
