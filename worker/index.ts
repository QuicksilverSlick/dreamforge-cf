import { createLogger } from './logger';
import { CodeGeneratorAgent as CodeGeneratorAgentDO } from './agents/core/codingAgent';
import { getAgentStub } from './agents';
import { proxyToSandbox } from '@cloudflare/sandbox';
import { isDispatcherAvailable } from './utils/dispatcherUtils';
import { createApp } from './app';
import * as Sentry from '@sentry/cloudflare';
import { sentryOptions } from './observability/sentry';
import { DORateLimitStore as BaseDORateLimitStore } from './services/rate-limit/DORateLimitStore';
import { BillingBalanceDO as BaseBillingBalanceDO } from './services/billing/BillingBalanceDO';
import { CodebaseAnalyzer as BaseCodebaseAnalyzer } from './agents/analyzer/codebaseAnalyzer';
import { getPreviewDomain, isPreviewOrigin } from './utils/urls';
import { proxyToAiGateway } from './services/aigateway-proxy/controller';
import { proxyToCloudflareApi } from './services/cf-proxy/controller';
import { isOriginAllowed } from './config/security';
import { reconcileBilling } from './services/billing/reconciler';

// Durable Object and Service exports
export { UserAppSandboxService, DeployerService } from './services/sandbox/sandboxSdkClient';

export const CodeGeneratorAgent = Sentry.instrumentDurableObjectWithSentry(sentryOptions, CodeGeneratorAgentDO);
export const DORateLimitStore = Sentry.instrumentDurableObjectWithSentry(sentryOptions, BaseDORateLimitStore);
export const BillingBalanceDO = Sentry.instrumentDurableObjectWithSentry(sentryOptions, BaseBillingBalanceDO);
export const CodebaseAnalyzer = Sentry.instrumentDurableObjectWithSentry(sentryOptions, BaseCodebaseAnalyzer);

// Logger for the main application and handlers
const logger = createLogger('App');

function setOriginControl(env: Env, request: Request, currentHeaders: Headers): Headers {
    const origin = request.headers.get('Origin');
    
    if (origin && isOriginAllowed(env, origin)) {
        currentHeaders.set('Access-Control-Allow-Origin', origin);
    }
    return currentHeaders;
}

/**
 * Handles requests for user-deployed applications on subdomains.
 * It first attempts to proxy to a live development sandbox. If that fails,
 * it dispatches the request to a permanently deployed worker via namespaces.
 * This function will NOT fall back to the main worker.
 *
 * @param request The incoming Request object.
 * @param env The environment bindings.
 * @returns A Response object from the sandbox, the dispatched worker, or an error.
 */
async function handleUserAppRequest(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const { hostname } = url;
	logger.info(`Handling user app request for: ${hostname}`);

	// 1. Attempt to proxy to a live development sandbox.
	// proxyToSandbox doesn't consume the request body on a miss, so no clone is needed here.
	const sandboxResponse = await proxyToSandbox(request, env);
	if (sandboxResponse) {
		logger.info(`Serving response from sandbox for: ${hostname}`);

		// If it was a websocket upgrade, return the response as-is so the
		// client/server WebSocket pair stays intact. Wrapping it below would
		// drop the `webSocket` field on the Response object.
		if (sandboxResponse.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
			logger.info(`Serving websocket response from sandbox for: ${hostname}`);
			return sandboxResponse;
		}

		// Add headers to identify this as a sandbox response
		let headers = new Headers(sandboxResponse.headers);
		
        if (sandboxResponse.status === 500) {
            headers.set('X-Preview-Type', 'sandbox-error');
        } else {
            headers.set('X-Preview-Type', 'sandbox');
        }
        headers = setOriginControl(env, request, headers);
        headers.append('Vary', 'Origin');
		headers.set('Access-Control-Expose-Headers', 'X-Preview-Type');
		
		return new Response(sandboxResponse.body, {
			status: sandboxResponse.status,
			statusText: sandboxResponse.statusText,
			headers,
		});
	}

	// 2. If sandbox misses, attempt to dispatch to a deployed worker.
	logger.info(`Sandbox miss for ${hostname}, attempting dispatch to permanent worker.`);
	if (!isDispatcherAvailable(env)) {
		logger.warn(`Dispatcher not available, cannot serve: ${hostname}`);
		return new Response('This application is not currently available.', { status: 404 });
	}

	// Extract the app name (e.g., "xyz" from "xyz.build.cloudflare.dev").
	const appName = hostname.split('.')[0];
	const dispatcher = env['DISPATCHER'];

	try {
		const worker = dispatcher.get(appName);
		const dispatcherResponse = await worker.fetch(request);
		
		// Add headers to identify this as a dispatcher response
		let headers = new Headers(dispatcherResponse.headers);
		
		headers.set('X-Preview-Type', 'dispatcher');
        headers = setOriginControl(env, request, headers);
        headers.append('Vary', 'Origin');
		headers.set('Access-Control-Expose-Headers', 'X-Preview-Type');
		
		return new Response(dispatcherResponse.body, {
			status: dispatcherResponse.status,
			statusText: dispatcherResponse.statusText,
			headers,
		});
	} catch (error: any) {
		// This block catches errors if the binding doesn't exist or if worker.fetch() fails.
		logger.warn(`Error dispatching to worker '${appName}': ${error.message}`);
		return new Response('An error occurred while loading this application.', { status: 500 });
	}
}

/**
 * Main Worker fetch handler with robust, secure routing.
 */
const worker = {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        logger.info(`Received request: ${request.method} ${request.url}`);
		// --- Pre-flight Checks ---

		// 1. Critical configuration check: Ensure custom domain is set.
        const previewDomain = getPreviewDomain(env);
		if (!previewDomain || previewDomain.trim() === '') {
			logger.error('FATAL: env.CUSTOM_DOMAIN is not configured in wrangler.toml or the Cloudflare dashboard.');
			return new Response('Server configuration error: Application domain is not set.', { status: 500 });
		}

		const url = new URL(request.url);
		const { hostname, pathname } = url;

		// 2. Security: Immediately reject any requests made via an IP address.
		const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
		if (ipRegex.test(hostname)) {
			return new Response('Access denied. Please use the assigned domain name.', { status: 403 });
		}

		// --- Domain-based Routing ---

		// Route 0: Cloudflare-API authorizing proxy (continuity arc). The D1
		// template's sandbox container routes its remote-binding control-plane
		// calls to this hostname carrying a short-lived JWT; the proxy verifies
		// it, enforces per-app D1 scoping, and forwards with the real token.
		// Matched first (before app/marketing) so its `/client/v4/...` paths
		// never reach the SPA/API router.
		if (env.CLOUDFLARE_API_PROXY_URL) {
			try {
				if (hostname === new URL(env.CLOUDFLARE_API_PROXY_URL).hostname) {
					return proxyToCloudflareApi(request, env, ctx);
				}
			} catch {
				logger.error('CLOUDFLARE_API_PROXY_URL is not a valid URL; skipping proxy route');
			}
		}

		// Marketing hostnames: serve the StoryBrand landing pages from
		// dist/client/marketing/ (copied there from worker/static/landing-pages/
		// by scripts/copy-landing-pages.ts during the build).
		//
		// `localhost` is included with a path prefix so local dev can preview
		// the marketing pages at http://localhost:5173/marketing/...
		const isMarketingDomain =
			hostname === 'getdreamforge.com' ||
			hostname === 'www.getdreamforge.com' ||
			(hostname === 'localhost' && pathname.startsWith('/marketing'));

		// App hostnames: serve the React SPA + API.
		const isMainDomainRequest =
			hostname === env.CUSTOM_DOMAIN ||
			(hostname === 'localhost' && !pathname.startsWith('/marketing'));

		const isSubdomainRequest =
			hostname.endsWith(`.${previewDomain}`) ||
			(hostname.endsWith('.localhost') && hostname !== 'localhost');

		// Route 1: Marketing Website (e.g., getdreamforge.com)
		if (isMarketingDomain) {
			// Marketing domain shouldn't serve APIs.
			if (pathname.startsWith('/api/')) {
				return new Response('Not Found', { status: 404 });
			}

			// Defensive: if the path is already under /marketing/ (e.g. from a
			// CF Assets normalization redirect), serve directly without
			// re-prefixing — otherwise we'd produce /marketing/marketing/...
			if (pathname.startsWith('/marketing/') || pathname === '/marketing') {
				return env.ASSETS.fetch(request);
			}

			// Rewrite user-facing URLs to the internal /marketing/... paths.
			let marketingPath: string;
			if (pathname === '/' || pathname === '') {
				// Apex: request the directory itself, not /marketing/index.html.
				// CF Assets serves the directory's index without issuing a
				// 307 redirect to the canonical URL — which would otherwise
				// leak the internal /marketing/ path back to the user and
				// trigger an infinite loop through the defensive guard above.
				marketingPath = '/marketing/';
			} else {
				// Other paths under apex (e.g. /pricing, /styles.css). Let the
				// asset layer's auto-html resolution serve /marketing/pricing ->
				// pricing.html. Do NOT rewrite to an explicit .html path: CF
				// Assets 307-redirects .html URLs to their clean form, which
				// both leaks the internal /marketing/ prefix and broke /pricing.
				marketingPath = `/marketing${pathname}`;
			}

			const marketingUrl = new URL(marketingPath, url.origin);
			const marketingRequest = new Request(marketingUrl, request);

			logger.info(`Serving marketing page: ${marketingPath}`);
			return env.ASSETS.fetch(marketingRequest);
		}

		// Route 2: Main Application (e.g., app.getdreamforge.com or localhost)
		if (isMainDomainRequest) {
			// Cloudflare "Connect" OAuth lives on the app domain at /oauth/* and
			// /auth/callback — NOT under /api/ — so it must reach Hono BEFORE the
			// assets fallback below, which would otherwise swallow these paths into
			// env.ASSETS and leave the connect flow dead on arrival. The controllers
			// stay gated on ENABLE_CLOUDFLARE_LIMITS (and the connect UI is unmounted),
			// so this routing is inert until that feature is turned on.
			if (pathname.startsWith('/oauth/') || pathname === '/auth/callback') {
				const app = createApp(env);
				return app.fetch(request, env, ctx);
			}
			// Serve static assets for all non-API routes from the ASSETS binding.
			if (!pathname.startsWith('/api/')) {
				const assetResponse = await env.ASSETS.fetch(request);
				// The zone's cache-everything rule (added for the marketing
				// pages) pins SPA HTML at the edge across deploys, serving
				// stale fingerprinted bundle references. no-store keeps the
				// edge from caching app HTML; hashed assets stay cacheable.
				const contentType = assetResponse.headers.get('Content-Type') ?? '';
				if (contentType.includes('text/html')) {
					const headers = new Headers(assetResponse.headers);
					headers.set('Cache-Control', 'no-store');
					return new Response(assetResponse.body, {
						status: assetResponse.status,
						statusText: assetResponse.statusText,
						headers,
					});
				}
				return assetResponse;
			}
			// AI Gateway proxy for generated apps.
			//
			// This route is reachable only from browser iframes whose Origin is
			// a preview subdomain of CUSTOM_PREVIEW_DOMAIN (e.g.
			// `<deploymentId>.app.getdreamforge.com`). Any other Origin — a
			// third-party site, a server-to-server request without an Origin
			// header, or the bare main-app domain — is rejected here before
			// the controller runs. The JWT check inside the controller is the
			// second gate; this is the first.
			if (pathname.startsWith('/api/proxy/openai')) {
				const origin = request.headers.get('Origin');
				if (!isPreviewOrigin(env, origin)) {
					logger.warn(
						`AI proxy denied. origin=${origin ?? '(none)'} previewDomain=${getPreviewDomain(env)}`,
					);
					return new Response(
						JSON.stringify({
							error: {
								message: 'Origin not allowed',
								type: 'invalid_request_error',
							},
						}),
						{
							status: 403,
							headers: { 'Content-Type': 'application/json' },
						},
					);
				}
				return proxyToAiGateway(request, env, ctx);
			}
			// Handle all API requests with the main Hono application.
			logger.info(`Handling API request for: ${url}`);
			const app = createApp(env);
			return app.fetch(request, env, ctx);
		}

		// Route 3: User App Request (e.g., xyz.build.cloudflare.dev or test.localhost)
		if (isSubdomainRequest) {
			// Browser-render template previews (renderMode === 'browser') are
			// served as static files straight from the agent — they never run in
			// a container sandbox and are not deployed as dispatched workers. The
			// preview host is `b-{agentId}-{token}.{previewDomain}`; route those
			// to the agent's file server rather than the sandbox/dispatcher path.
			const subdomain = hostname.split('.')[0];
			if (subdomain.startsWith('b-')) {
				const withoutPrefix = subdomain.slice(2);
				const lastHyphen = withoutPrefix.lastIndexOf('-');
				if (lastHyphen > 0) {
					const agentId = withoutPrefix.slice(0, lastHyphen);
					const agent = await getAgentStub(env, agentId, true, logger);
					return agent.handleBrowserFileServing(request);
				}
			}
			return handleUserAppRequest(request, env);
		}

		return new Response('Not Found', { status: 404 });
	},

	// Nightly billing reconciliation: grant-lot expiry + Stripe subscription
	// drift/backfill (billing spec §5.7). Schedule lives in wrangler.jsonc
	// `triggers.crons`; Sentry.withSentry instruments this handler too.
	async scheduled(_controller, env, ctx) {
		ctx.waitUntil(reconcileBilling(env));
	},
} satisfies ExportedHandler<Env>;

// Wrap the entire worker with Sentry for comprehensive error monitoring.
export default Sentry.withSentry(sentryOptions, worker);
