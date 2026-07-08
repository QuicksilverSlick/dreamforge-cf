/**
 * D1 Time Travel — point-in-time recovery for a per-app database (continuity
 * arc, CONT-4).
 *
 * Each D1-flagship app owns a real per-app D1 (CONT-2). Time Travel is always
 * on for D1 with a 30-day retention window (Workers Paid), so we can restore an
 * app's database to any point in that window with two account-scoped REST calls:
 *   1. GET  .../time_travel/bookmark?timestamp=<ISO>  → resolve a bookmark,
 *   2. POST .../time_travel/restore?bookmark|timestamp → overwrite in place.
 *
 * The restore is destructive-forward but REVERSIBLE: the response returns
 * `previous_bookmark`, a handle to the pre-restore state, so a restore can be
 * undone by restoring to that bookmark. The caller (the owner-only API route)
 * surfaces it as an "undo".
 *
 * Uses the platform's own CLOUDFLARE_API_TOKEN (the same token that provisions
 * per-app D1 in resourceProvisioner — it already carries D1 Edit). This runs on
 * the MAIN worker, never inside the sandbox container, so the token is not
 * exposed to generated code.
 */

import { env } from 'cloudflare:workers';
import { StructuredLogger, createLogger } from '../../logger';

const CF_API_BASE = 'https://api.cloudflare.com/client/v4';

/** Workers Paid Time Travel retention window. */
export const D1_TIME_TRAVEL_RETENTION_DAYS = 30;

interface CfApiEnvelope<T> {
	success: boolean;
	errors: Array<{ code?: number; message: string }>;
	messages: unknown[];
	result: T;
}

interface RestoreResultBody {
	bookmark: string;
	previous_bookmark: string;
	message?: string;
}

export interface RestoreOutcome {
	/** The database's new current bookmark (the restored state). */
	restoredToBookmark: string;
	/** The pre-restore state — restore to this to undo. */
	previousBookmark: string;
	message: string;
}

/** A Time Travel API failure, carrying an HTTP-ish status for the route layer. */
export class D1TimeTravelError extends Error {
	constructor(message: string, readonly status: number) {
		super(message);
		this.name = 'D1TimeTravelError';
	}
}

export class D1TimeTravelService {
	private readonly accountId: string;
	private readonly apiToken: string;
	private readonly logger: StructuredLogger;

	constructor(logger?: StructuredLogger) {
		this.accountId = env.CLOUDFLARE_ACCOUNT_ID;
		this.apiToken = env.CLOUDFLARE_API_TOKEN;
		this.logger = logger ?? createLogger('D1TimeTravelService');
		if (!this.accountId || !this.apiToken) {
			throw new D1TimeTravelError('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set for Time Travel', 500);
		}
	}

	private headers(): HeadersInit {
		return {
			Authorization: `Bearer ${this.apiToken}`,
			'Content-Type': 'application/json',
		};
	}

	private databaseBase(databaseId: string): string {
		return `${CF_API_BASE}/accounts/${this.accountId}/d1/database/${encodeURIComponent(databaseId)}`;
	}

	/**
	 * Restore the database in place to a bookmark OR a timestamp (one required).
	 * Returns the pre-restore bookmark so the caller can offer an undo.
	 */
	async restore(databaseId: string, params: { bookmark?: string; timestamp?: string }): Promise<RestoreOutcome> {
		if (!params.bookmark && !params.timestamp) {
			throw new D1TimeTravelError('restore requires a bookmark or a timestamp', 400);
		}
		const url = new URL(`${this.databaseBase(databaseId)}/time_travel/restore`);
		if (params.bookmark) {
			url.searchParams.set('bookmark', params.bookmark);
		} else if (params.timestamp) {
			url.searchParams.set('timestamp', params.timestamp);
		}
		const response = await fetch(url, { method: 'POST', headers: this.headers() });
		const result = await this.parse<RestoreResultBody>(response, 'restore');
		this.logger.info('D1 Time Travel restore complete', {
			databaseId,
			restoredTo: result.bookmark,
			previousBookmark: result.previous_bookmark,
		});
		return {
			restoredToBookmark: result.bookmark,
			previousBookmark: result.previous_bookmark,
			message: result.message ?? 'Database restored',
		};
	}

	private async parse<T>(response: Response, operation: string): Promise<T> {
		if (!response.ok) {
			const text = await response.text();
			this.logger.error(`D1 Time Travel ${operation} failed: HTTP ${response.status}`, { text });
			throw new D1TimeTravelError(`HTTP ${response.status}: ${text}`, response.status);
		}
		const envelope = (await response.json()) as CfApiEnvelope<T>;
		if (!envelope.success) {
			const message = envelope.errors?.map((e) => e.message).join('; ') || 'Cloudflare API error';
			this.logger.error(`D1 Time Travel ${operation} API error`, { errors: envelope.errors });
			throw new D1TimeTravelError(message, 502);
		}
		return envelope.result;
	}
}
