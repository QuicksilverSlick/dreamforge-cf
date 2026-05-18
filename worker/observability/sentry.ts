import * as Sentry from '@sentry/cloudflare';
import type { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { AppEnv } from '../types/appenv';
import { errorResponse } from '../api/responses';
import { createLogger } from '../logger';

const logger = createLogger('HonoOnError');

export function sentryOptions(env: Env) : Sentry.CloudflareOptions {
    const transportOptions : Sentry.CloudflareOptions['transportOptions'] = {};
    if (env.CF_ACCESS_ID && env.CF_ACCESS_SECRET) {
        transportOptions.headers = {
            'CF-Access-Client-Id': env.CF_ACCESS_ID,
            'CF-Access-Client-Secret': env.CF_ACCESS_SECRET,
        };
    }
	return {
		dsn: env.SENTRY_DSN,
		release: env.CF_VERSION_METADATA.id,
		environment: env.ENVIRONMENT,
		enableLogs: true,
		sendDefaultPii: true,
		tracesSampleRate: 1.0,
        transportOptions,
        allowUrls: [
            // Only capture errors from our API endpoints
            new RegExp(`^https://${env.CUSTOM_DOMAIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/api/.*$`)
        ]
	};
}

export function initHonoSentry(app: Hono<AppEnv>): void {
	// Top-level error handler — last line of defence for anything thrown by
	// routes or middleware that wasn't caught locally. HTTPException carries
	// its own status + body; everything else becomes a structured 500 in the
	// project's standard `errorResponse` shape so clients can parse it
	// consistently with intentional error returns elsewhere.
	app.onError((err, c) => {
		const url = new URL(c.req.url);
		const cfRay = c.req.header('cf-ray');

		Sentry.withScope((scope) => {
			scope.setTag('http.method', c.req.method);
			scope.setTag('http.path', url.pathname);
			if (cfRay) scope.setTag('cf_ray', cfRay);
			Sentry.captureException(err);
		});

		if (err instanceof HTTPException) {
			return err.getResponse();
		}

		// Log the underlying error locally; the response body intentionally
		// does NOT include the message (could leak internals). cf-ray plus
		// the Sentry capture is what support correlates against.
		logger.error('Unhandled error in Hono pipeline', {
			method: c.req.method,
			path: url.pathname,
			cfRay,
			error: err instanceof Error ? { message: err.message, name: err.name, stack: err.stack } : err,
		});

		return errorResponse(new Error('Internal server error'), 500);
	});

	// Light context binding for better traces
	app.use('*', async (c, next) => {
		try {
			const url = new URL(c.req.url);
			Sentry.setTag('http.method', c.req.method);
			Sentry.setTag('http.path', url.pathname);
			const cfRay = c.req.header('cf-ray');
			if (cfRay) Sentry.setTag('cf_ray', cfRay);
		} catch {
            console.error('Failed to set Sentry context');
		}
		return next();
	});
}

export type SecurityEventType =
	| 'csrf_violation'
	| 'rate_limit_exceeded'
	| 'auth_violation'
	| 'oauth_state_mismatch'
	| 'jwt_invalid'
	| string;

export type SecuritySeverity = 'debug' | 'info' | 'warning' | 'error' | 'fatal';

export interface SecurityEventOptions {
    level?: SecuritySeverity;
    error?: unknown;
}

export function captureSecurityEvent(
    type: SecurityEventType,
    data: Record<string, unknown> = {},
    options: SecurityEventOptions = {},
): void {
    try {
        const level: SecuritySeverity = options.level ?? 'warning';
        Sentry.withScope((scope) => {
            scope.setTag('security_event', type);
            scope.setContext('security', data);
            scope.setLevel(level);
            Sentry.addBreadcrumb({
                category: 'security',
                level,
                data: { type, ...data },
            });
            if (options.error !== undefined) {
                Sentry.captureException(options.error, { level, extra: data });
            } else {
                Sentry.captureMessage(`[security] ${type}`, level);
            }
        });
    } catch {
        // no-op: telemetry must not break the app
        console.error('Failed to capture security event');
    }
}

export function captureException(error: Error): void {
    Sentry.captureException(error);
}