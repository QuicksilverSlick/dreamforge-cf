/**
 * Operator billing controls (/api/admin/billing/*) — Sparks credit
 * administration per billing spec §0.5. Superadmin-only (gated in
 * adminRoutes.ts), kill-switchable, and every surface is audited:
 * looking at a balance writes a read audit; moving one writes a
 * fail-closed mutation audit with the operator as actor.
 *
 * The balance mutation itself is BillingService.adminAdjust — the same
 * atomic Billing DO path production consumption uses, so operator grants
 * and deductions obey the identical ledger/idempotency rules.
 */

import { z } from 'zod';
import { desc, eq, or } from 'drizzle-orm';
import { BaseController } from '../baseController';
import { errorResponse, successResponse } from '../../responses';
import { RouteContext } from '../../types/route-context';
import { createDatabaseService } from '../../../database/database';
import * as schema from '../../../database/schema';
import { BillingService } from '../../../services/billing/BillingService';
import { AuditLogService, AdminAuditAction } from '../../../database/services/AuditLogService';
import { extractRequestMetadata } from '../../../utils/authUtils';

const adjustBodySchema = z
	.object({
		orgId: z.string().min(1, 'orgId is required'),
		/** Signed Sparks: positive grants, negative deducts. */
		delta: z.number().int().optional(),
		/** Absolute target balance; the server computes the delta. */
		setTo: z.number().int().min(0).optional(),
		reason: z.string().trim().min(3, 'A reason is required (min 3 chars)').max(500),
	})
	.refine((body) => (body.delta === undefined) !== (body.setTo === undefined), {
		message: 'Provide exactly one of delta or setTo',
	});

const LEDGER_PAGE_SIZE = 25;

export class AdminBillingController extends BaseController {
	/**
	 * GET /api/admin/billing/summary?q=<email | user id | org id | org slug>
	 * Resolves the query to a billing org (a user resolves to their personal
	 * org), returning the live balance, subscription, and recent ledger.
	 */
	static async getBillingSummary(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
		context: RouteContext,
	): Promise<Response> {
		const actor = context.user!;
		const q = context.queryParams.get('q')?.trim();
		if (!q) return errorResponse('Query parameter q is required', 400);

		const db = createDatabaseService(env).db;

		// 1) Direct org match (id or slug); 2) user match (email or id) →
		// their personal org. Explicit resolution — never a fuzzy guess.
		let org = (
			await db
				.select()
				.from(schema.organizations)
				.where(or(eq(schema.organizations.id, q), eq(schema.organizations.slug, q)))
				.limit(1)
		)[0];
		let matchedUser: { id: string; email: string } | undefined;

		if (!org) {
			const user = (
				await db
					.select({ id: schema.users.id, email: schema.users.email })
					.from(schema.users)
					.where(or(eq(schema.users.email, q), eq(schema.users.id, q)))
					.limit(1)
			)[0];
			if (user) {
				matchedUser = user;
				org = (
					await db
						.select()
						.from(schema.organizations)
						.where(eq(schema.organizations.ownerUserId, user.id))
						.orderBy(desc(schema.organizations.isPersonal))
						.limit(1)
				)[0];
			}
		}
		if (!org) {
			return errorResponse('No organization or user matched that query', 404);
		}

		const owner = (
			await db
				.select({ email: schema.users.email })
				.from(schema.users)
				.where(eq(schema.users.id, org.ownerUserId))
				.limit(1)
		)[0];

		const billing = new BillingService(env);
		const summary = await billing.getBalanceSummary(org.id);
		const ledger = await db
			.select({
				id: schema.creditLedger.id,
				kind: schema.creditLedger.kind,
				actionType: schema.creditLedger.actionType,
				delta: schema.creditLedger.delta,
				balanceAfter: schema.creditLedger.balanceAfter,
				reason: schema.creditLedger.reason,
				userId: schema.creditLedger.userId,
				createdAt: schema.creditLedger.createdAt,
			})
			.from(schema.creditLedger)
			.where(eq(schema.creditLedger.orgId, org.id))
			.orderBy(desc(schema.creditLedger.createdAt))
			.limit(LEDGER_PAGE_SIZE);

		// Read audit — best-effort, off the response path (matches admin reads).
		const audit = new AuditLogService(env)
			.record({
				actorId: actor.id,
				actorRole: actor.role,
				entityType: 'organization',
				entityId: org.id,
				action: AdminAuditAction.BILLING_VIEW,
				newValues: { query: q },
				metadata: extractRequestMetadata(request),
			})
			.catch(() => {});
		ctx.waitUntil(audit);

		return successResponse({
			org: {
				id: org.id,
				name: org.name,
				slug: org.slug,
				isPersonal: org.isPersonal,
				ownerEmail: owner?.email ?? null,
			},
			matchedUser: matchedUser ?? null,
			balance: summary.balance,
			debt: summary.debt,
			subscription: summary.subscription,
			ledger,
		});
	}

	/**
	 * POST /api/admin/billing/adjust — grant (+delta), deduct (−delta), or
	 * set (setTo) an org's Spark balance. Reason required; fail-closed audit
	 * (the audit row is written before the response, with the operator as
	 * actor and the org as entity).
	 */
	static async adjustCredits(
		request: Request,
		env: Env,
		_ctx: ExecutionContext,
		context: RouteContext,
	): Promise<Response> {
		const actor = context.user!;
		const parsed = await BaseController.parseJsonBody<unknown>(request);
		if (!parsed.success) return parsed.response ?? errorResponse('Invalid request body', 400);
		const validation = adjustBodySchema.safeParse(parsed.data ?? {});
		if (!validation.success) {
			return errorResponse(validation.error.issues[0]?.message ?? 'Invalid request body', 400);
		}
		const { orgId, reason, setTo } = validation.data;

		const billing = new BillingService(env);
		let delta = validation.data.delta ?? 0;
		let balanceBefore: number | undefined;
		if (setTo !== undefined) {
			const summary = await billing.getBalanceSummary(orgId);
			balanceBefore = summary.balance;
			delta = setTo - summary.balance;
		}
		if (delta === 0) {
			return errorResponse('The adjustment is zero — nothing to do', 400);
		}

		const result = await billing.adminAdjust({
			orgId,
			actorUserId: actor.id,
			delta,
			reason,
		});

		// Fail-closed audit: a money mutation must never be un-attributable.
		await new AuditLogService(env).record({
			actorId: actor.id,
			actorRole: actor.role,
			entityType: 'organization',
			entityId: orgId,
			action: AdminAuditAction.BILLING_ADJUST,
			newValues: {
				delta,
				setTo: setTo ?? null,
				balanceBefore: balanceBefore ?? null,
				balanceAfter: result.balanceAfter,
				reason,
			},
			metadata: extractRequestMetadata(request),
		});

		return successResponse({ orgId, delta, balanceAfter: result.balanceAfter });
	}
}
