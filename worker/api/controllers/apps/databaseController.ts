import { BaseController } from '../baseController';
import { AppService } from '../../../database/services/AppService';
import {
	D1TimeTravelService,
	D1TimeTravelError,
	D1_TIME_TRAVEL_RETENTION_DAYS,
} from '../../../services/d1-timetravel/timeTravelService';
import { ApiResponse, ControllerResponse } from '../types';
import type { DatabaseRestoreInfo, DatabaseRestoreResult } from './types';
import type { RouteContext } from '../../types/route-context';
import { createLogger } from '../../../logger';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Owner-initiated Time Travel restore for a per-app D1 (CONT-4).
 *
 * These routes are the ONLY path that restores an app database — there is no
 * agent/phase code path, so the AI can never auto-restore (a data-safety
 * requirement). Routes are gated `ownerOnly` (routeAuth runs checkAppOwnership
 * on `:id` before the controller). Restores are never Spark-metered: this
 * controller never touches BillingService.
 */
export class AppDatabaseController extends BaseController {
	static logger = createLogger('AppDatabaseController');

	static async getRestoreInfo(
		_request: Request,
		env: Env,
		_ctx: ExecutionContext,
		context: RouteContext,
	): Promise<ControllerResponse<ApiResponse<DatabaseRestoreInfo>>> {
		try {
			const appId = context.pathParams.id;
			if (!appId) {
				return AppDatabaseController.createErrorResponse<DatabaseRestoreInfo>('App ID is required', 400);
			}
			const appService = new AppService(env);
			const resources = await appService.getAppResources(appId);
			const now = new Date();
			// The earliest restorable point is the later of the 30-day window and
			// the database's own creation — a per-app D1 is often only minutes old,
			// and restoring to before it existed just errors at Cloudflare.
			const windowFloor = now.getTime() - D1_TIME_TRAVEL_RETENTION_DAYS * DAY_MS;
			const provisionedAt = resources?.resourcesProvisionedAt?.getTime();
			const earliestMs = provisionedAt ? Math.max(windowFloor, provisionedAt) : windowFloor;
			return AppDatabaseController.createSuccessResponse<DatabaseRestoreInfo>({
				hasDatabase: Boolean(resources?.d1DatabaseId),
				databaseName: resources?.d1DatabaseName ?? null,
				retentionDays: D1_TIME_TRAVEL_RETENTION_DAYS,
				earliestRestoreAt: new Date(earliestMs).toISOString(),
				now: now.toISOString(),
			});
		} catch (error) {
			AppDatabaseController.logger.error('getRestoreInfo failed', error);
			return AppDatabaseController.createErrorResponse<DatabaseRestoreInfo>('Failed to load restore info', 500);
		}
	}

	static async restore(
		request: Request,
		env: Env,
		_ctx: ExecutionContext,
		context: RouteContext,
	): Promise<ControllerResponse<ApiResponse<DatabaseRestoreResult>>> {
		try {
			const appId = context.pathParams.id;
			if (!appId) {
				return AppDatabaseController.createErrorResponse<DatabaseRestoreResult>('App ID is required', 400);
			}

			const bodyResult = await AppDatabaseController.parseJsonBody(request);
			if (!bodyResult.success) {
				return bodyResult.response! as ControllerResponse<ApiResponse<DatabaseRestoreResult>>;
			}
			const body = (bodyResult.data ?? {}) as { timestamp?: unknown; bookmark?: unknown };
			const timestamp = typeof body.timestamp === 'string' ? body.timestamp : undefined;
			const bookmark = typeof body.bookmark === 'string' ? body.bookmark : undefined;
			if (!timestamp && !bookmark) {
				return AppDatabaseController.createErrorResponse<DatabaseRestoreResult>('Provide a timestamp or a bookmark to restore to', 400);
			}

			// Validate the timestamp is inside the retention window before we touch
			// the API (the undo path passes a bookmark instead and is not bounded).
			if (timestamp && !bookmark) {
				const parsed = Date.parse(timestamp);
				if (Number.isNaN(parsed)) {
					return AppDatabaseController.createErrorResponse<DatabaseRestoreResult>('Invalid timestamp', 400);
				}
				const now = Date.now();
				if (parsed > now) {
					return AppDatabaseController.createErrorResponse<DatabaseRestoreResult>('Cannot restore to a future time', 400);
				}
				if (parsed < now - D1_TIME_TRAVEL_RETENTION_DAYS * DAY_MS) {
					return AppDatabaseController.createErrorResponse<DatabaseRestoreResult>(
						`Time Travel only covers the last ${D1_TIME_TRAVEL_RETENTION_DAYS} days`,
						400,
					);
				}
			}

			const appService = new AppService(env);
			const resources = await appService.getAppResources(appId);
			if (!resources?.d1DatabaseId) {
				return AppDatabaseController.createErrorResponse<DatabaseRestoreResult>('This app has no restorable database', 400);
			}

			// Reject a timestamp before the database was created — Cloudflare would
			// error on it, and the confirm dialog would have named an unrestorable
			// point. The undo path (bookmark) is exempt.
			if (timestamp && !bookmark && resources.resourcesProvisionedAt) {
				const parsed = Date.parse(timestamp);
				if (parsed < resources.resourcesProvisionedAt.getTime()) {
					return AppDatabaseController.createErrorResponse<DatabaseRestoreResult>(
						'Cannot restore to before this database was created',
						400,
					);
				}
			}

			const service = new D1TimeTravelService(AppDatabaseController.logger);
			const outcome = await service.restore(resources.d1DatabaseId, { timestamp, bookmark });
			AppDatabaseController.logger.info('App database restored', {
				appId,
				userId: context.user?.id,
				databaseId: resources.d1DatabaseId,
				mode: bookmark ? 'undo' : 'timestamp',
			});
			return AppDatabaseController.createSuccessResponse<DatabaseRestoreResult>({
				restoredToBookmark: outcome.restoredToBookmark,
				previousBookmark: outcome.previousBookmark,
				message: outcome.message,
				restoredAt: new Date().toISOString(),
			});
		} catch (error) {
			if (error instanceof D1TimeTravelError) {
				AppDatabaseController.logger.error('D1 Time Travel restore failed', { status: error.status, message: error.message });
				const status = error.status >= 400 && error.status < 600 ? error.status : 502;
				return AppDatabaseController.createErrorResponse<DatabaseRestoreResult>(error.message, status);
			}
			AppDatabaseController.logger.error('restore failed', error);
			return AppDatabaseController.createErrorResponse<DatabaseRestoreResult>('Failed to restore database', 500);
		}
	}
}
