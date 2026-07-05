/**
 * Operator PRODUCE-application pipeline (/api/admin/produce/applications) —
 * the sales console behind getdreamforge.com/apply. Superadmin-only (gated
 * in adminRoutes.ts), kill-switchable, and audited: listing applications
 * writes a read audit; moving one through the pipeline writes a fail-closed
 * mutation audit batched with the status flip (AdminService).
 */

import { z } from 'zod';
import { BaseController } from '../baseController';
import { errorResponse, successResponse } from '../../responses';
import { RouteContext } from '../../types/route-context';
import {
	AdminService,
	AdminActionError,
} from '../../../database/services/AdminService';
import { AuditLogService, AdminAuditAction } from '../../../database/services/AuditLogService';
import { extractRequestMetadata } from '../../../utils/authUtils';
import {
	PRODUCE_APPLICATION_STATUSES,
	type ProduceApplicationStatus,
} from 'shared/constants/produce';
import { parseBoundedInt } from './schemas';

const statusBodySchema = z.object({
	status: z.enum(PRODUCE_APPLICATION_STATUSES),
});

function parseApplicationStatus(value: string | null): ProduceApplicationStatus | undefined {
	if (value && (PRODUCE_APPLICATION_STATUSES as readonly string[]).includes(value)) {
		return value as ProduceApplicationStatus;
	}
	return undefined;
}

export class AdminProduceApplicationsController extends BaseController {
	/**
	 * GET /api/admin/produce/applications?q=&status=&limit=&offset= —
	 * paginated pipeline list, newest first, with whole-table stage counts.
	 */
	static async listApplications(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
		context: RouteContext,
	): Promise<Response> {
		const actor = context.user!;
		const q = context.queryParams.get('q')?.trim() || undefined;
		const status = parseApplicationStatus(context.queryParams.get('status'));
		const limit = parseBoundedInt(context.queryParams.get('limit'), 25, 1, 100);
		const offset = parseBoundedInt(context.queryParams.get('offset'), 0, 0, Number.MAX_SAFE_INTEGER);

		const result = await new AdminService(env).listProduceApplications({
			search: q,
			status,
			limit,
			offset,
		});

		// Read audit — best-effort, off the response path (matches admin reads).
		const audit = new AuditLogService(env)
			.record({
				actorId: actor.id,
				actorRole: actor.role,
				entityType: 'produce_application',
				entityId: '*',
				action: AdminAuditAction.PRODUCE_APPLICATIONS_VIEW,
				context: {
					query: q ?? null,
					status: status ?? null,
					total: result.pagination.total,
				},
				metadata: extractRequestMetadata(request),
			})
			.catch(() => {});
		ctx.waitUntil(audit);

		return successResponse(result);
	}

	/**
	 * PATCH /api/admin/produce/applications/:id — move an application to a
	 * pipeline stage (new → contacted → scoping → won/lost; any direction,
	 * so a mis-click is reversible). Fail-closed audit via AdminService.
	 */
	static async updateApplicationStatus(
		request: Request,
		env: Env,
		_ctx: ExecutionContext,
		context: RouteContext,
	): Promise<Response> {
		const actor = context.user!;
		const applicationId = context.pathParams.id;
		if (!applicationId) return errorResponse('Application id is required', 400);

		const parsed = await BaseController.parseJsonBody<unknown>(request);
		if (!parsed.success) return parsed.response ?? errorResponse('Invalid request body', 400);
		const validation = statusBodySchema.safeParse(parsed.data ?? {});
		if (!validation.success) {
			return errorResponse(validation.error.issues[0]?.message ?? 'Invalid request body', 400);
		}

		try {
			const application = await new AdminService(env).updateProduceApplicationStatus({
				actorId: actor.id,
				actorRole: actor.role,
				applicationId,
				status: validation.data.status,
				metadata: extractRequestMetadata(request),
			});
			return successResponse({ application });
		} catch (error) {
			if (error instanceof AdminActionError) {
				return errorResponse(error.message, error.statusCode);
			}
			throw error;
		}
	}
}
