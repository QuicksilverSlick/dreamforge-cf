/**
 * Spark metering — the single entry point every metered surface calls
 * (billing spec §0.2 + §6.4). Encapsulates the skip rules so build/edit/
 * image/deploy charging can never drift apart:
 *
 * - Feature flag off (`ENABLE_CLOUDFLARE_LIMITS` unset) → self-hosted
 *   instances stay unmetered.
 * - BYO-Cloudflare builds (`shouldUseUserKey`) → the user's own credits fund
 *   inference; no Sparks charged.
 * - Exempt operator accounts (`RATE_LIMIT_EXEMPT_USER_IDS`) → never charged.
 * - Platform-funded with NO resolved orgId → **fail closed** (spec §9.1-F5:
 *   a missing billing owner must never become silent free inference).
 *
 * The actual debit is the BillingBalanceDO's atomic check-and-decrement via
 * BillingService (exactly-once per callId; fails closed on insufficient
 * balance with zero mutation).
 */

import { BillingService } from './BillingService';
import { RateLimitService } from '../rate-limit/rateLimits';
import { isCloudflareGatewayLimitsEnabled } from '../rate-limit/usageChecker';
import { createLogger } from '../../logger';
import type { SparkActionType } from 'shared/constants/sparks';

const logger = createLogger('SparkMetering');

export interface MeterActionArgs {
	/** Billing owner (the ACTIVE org). Required for platform-funded actions. */
	orgId?: string | null;
	/** Provenance (who triggered it). */
	userId: string;
	actionType: Exclude<SparkActionType, 'llm_call'>;
	/** Build session the action belongs to. */
	agentId: string;
	/**
	 * Unique per metered action (idempotency): retries of the SAME action must
	 * reuse the same callId; distinct actions must differ (spec §6.5).
	 */
	callId: string;
	/** True when the build rides the user's own Cloudflare credits (BYO). */
	shouldUseUserKey?: boolean;
}

export interface MeterActionResult {
	/** False only when the action must be blocked (insufficient balance / no org). */
	ok: boolean;
	/** True when Sparks were actually debited by THIS call. */
	charged: boolean;
	/** Sparks short on a rejected debit (drives the upsell copy). */
	shortBy?: number;
	balanceAfter?: number;
	/** Human-readable block reason when ok === false. */
	reason?: string;
}

export async function meterSparkAction(env: Env, args: MeterActionArgs): Promise<MeterActionResult> {
	// Self-hosted / feature-dark: unmetered.
	if (!isCloudflareGatewayLimitsEnabled(env)) {
		return { ok: true, charged: false };
	}
	// BYO-Cloudflare builds are funded by the user's own credits.
	if (args.shouldUseUserKey) {
		return { ok: true, charged: false };
	}
	// Operator accounts are exempt from usage limits AND Spark charges.
	if (RateLimitService.isExemptUser(env, args.userId)) {
		return { ok: true, charged: false };
	}
	// Platform-funded action with no billing owner: fail closed (§9.1-F5).
	if (!args.orgId) {
		logger.error('Platform-funded action without a resolved orgId — blocking (never silent free inference)', {
			userId: args.userId,
			actionType: args.actionType,
			agentId: args.agentId,
		});
		return {
			ok: false,
			charged: false,
			reason: 'No active organization resolved for billing. Please sign out and back in.',
		};
	}

	const billing = new BillingService(env);
	// Baseline grants are idempotent (welcome once, free monthly once) — this
	// is what materializes a brand-new org's 300-Spark welcome before its
	// first metered action.
	await billing.ensureBaselineGrants(args.orgId, args.userId);
	const result = await billing.tryDebitAction({
		orgId: args.orgId,
		userId: args.userId,
		actionType: args.actionType,
		agentId: args.agentId,
		callId: args.callId,
	});
	if (!result.ok) {
		return {
			ok: false,
			charged: false,
			shortBy: result.shortBy,
			balanceAfter: result.balanceAfter,
			reason: `You're out of Sparks for this ${args.actionType} (needs ${result.cost}, you have ${Math.max(0, result.balanceAfter)}). Upgrade your plan or wait for your monthly refill.`,
		};
	}
	return {
		ok: true,
		charged: !result.replayed,
		balanceAfter: result.balanceAfter,
	};
}
