/**
 * Cloudflare-API authorizing proxy (continuity arc, CONT-3A).
 *
 * The D1 flagship template binds its per-app D1 with `remote: true`, so the
 * vite-plugin/wrangler running INSIDE the sandbox container makes control-plane
 * calls to Cloudflare (create an edge-preview session, upload the preview
 * script). We do NOT want the real, powerful Cloudflare API token inside a
 * container that also runs AI-generated code — and a Cloudflare token cannot be
 * scoped to a single D1 database anyway.
 *
 * So the container carries a DUMMY token that is actually a short-lived JWT
 * (minted in codingAgent.buildContainerEnv, signed with CF_PROXY_JWT_SECRET),
 * and points `CLOUDFLARE_API_BASE_URL` at this proxy. wrangler forwards the JWT
 * verbatim as the `Authorization: Bearer` on every call (it does not validate
 * token shape). This proxy:
 *   1. verifies the JWT and pins the account,
 *   2. allowlists EXACTLY the three edge-preview control-plane endpoints
 *      (deny-by-default — /memberships and everything else is 403'd),
 *   3. on the script-upload call, parses the multipart `metadata` and enforces
 *      a deny-by-default binding allowlist: a `d1` binding must target the
 *      app's own recorded database; every other binding is rejected unless it
 *      is a safe inline value type — so a hostile container can never bind
 *      another tenant's / the platform's D1, KV, R2, DO, or service,
 *   4. swaps the JWT for the real token and forwards to api.cloudflare.com.
 *
 * The data plane (the container's actual SQL over the edge-preview session) does
 * not pass through here — that is recovery-not-prevention (Time Travel, CONT-4).
 */

import { jwtVerify, SignJWT } from 'jose';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { apps } from '../../database/schema';

const CF_API = 'https://api.cloudflare.com';

/** Claims minted by codingAgent.buildContainerEnv into the container's token. */
interface CfProxyClaims {
	appId: string;
	userId: string;
	/** The app's recorded D1 database id(s) — the only ids this session may bind. */
	d1: string[];
	/** The preview script name this session is allowed to upload. */
	scriptName: string;
}

/**
 * Whether the proxy is configured. When true, the D1 template's container
 * routes its control-plane calls through the proxy instead of straight to
 * Cloudflare (so the real token never enters the container).
 */
export function isCfProxyEnabled(env: Env): boolean {
	return Boolean(env.CF_PROXY_JWT_SECRET && env.CLOUDFLARE_API_PROXY_URL);
}

/**
 * Mint the short-lived session token the container carries as its dummy
 * CLOUDFLARE_API_TOKEN. wrangler forwards it verbatim as the Bearer; the proxy
 * verifies it and enforces the claims. Default 3h — a build session's lifetime.
 */
export async function mintCfProxyToken(env: Env, claims: CfProxyClaims, expiresInSeconds = 3 * 60 * 60): Promise<string> {
	if (!env.CF_PROXY_JWT_SECRET) {
		throw new Error('CF_PROXY_JWT_SECRET is not set');
	}
	const now = Math.floor(Date.now() / 1000);
	return new SignJWT({ ...claims })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt(now)
		.setExpirationTime(now + expiresInSeconds)
		.sign(new TextEncoder().encode(env.CF_PROXY_JWT_SECRET));
}

function deny(status: number, message: string): Response {
	return new Response(JSON.stringify({ success: false, errors: [{ message }] }), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

/**
 * Worker binding types that are safe for a hostile container to declare on its
 * OWN preview: inline values / the app's own modules and assets. They carry no
 * reference to another tenant's or the platform's resources. `d1` is handled
 * separately (validated by database id). EVERY other type — service,
 * durable_object_namespace, kv_namespace, r2_bucket, dispatch_namespace,
 * hyperdrive, queue, send_email, mtls_certificate, analytics_engine, vectorize,
 * ai, browser, workflow, etc. — is denied by default: it could bind a resource
 * the container must never reach, forwarded with the real account token.
 */
const SAFE_BINDING_TYPES = new Set<string>([
	'plain_text',
	'json',
	'secret_text',
	'secret_key',
	'text_blob',
	'data_blob',
	'wasm_module',
	'assets',
	'version_metadata',
]);

/**
 * Deny-by-default at the metadata OBJECT level, not just the bindings array.
 * These are the ONLY top-level `metadata` keys wrangler's remote-binding
 * edge-preview upload emits (createRemoteWorkerInit → createWorkerUploadForm,
 * wrangler 4.92.0): it hard-sets migrations/containers/placement/tail_consumers/
 * streaming_tail_consumers/limits/observability/cache to undefined, so they
 * never appear on the legitimate path. Every key NOT in this set is rejected —
 * that is what stops a hand-crafted upload from smuggling `migrations`
 * (`transferred_classes` pulls another script's Durable Object class AND its
 * stored data into this preview), `tail_consumers` (attaches an arbitrary
 * worker by name), or `unsafe` (injects raw top-level metadata) past the
 * bindings allowlist with the real account token. Fail-closed: a missing entry
 * blocks a build, it never opens a hole — so this must be re-confirmed against
 * a live preview boot at enablement and widened only for keys proven to carry
 * no cross-tenant reference.
 */
const ALLOWED_METADATA_KEYS = new Set<string>([
	'main_module',
	'body_part',
	'bindings',
	'compatibility_date',
	'compatibility_flags',
	'keep_bindings',
	'logpush',
]);

/**
 * The only binding-type names `keep_bindings` may inherit from the prior
 * version of this (per-app, name-pinned) script. wrangler's remote-dev flow
 * hard-sets keepVars+keepSecrets, which serialize to exactly these four inline
 * value types — so the legitimate preview always carries them and would 403 on
 * a blanket reject. A hostile `keep_bindings: ['d1']` / ['kv_namespace'] / etc.
 * is refused so inheritance can never re-attach a resource binding the array
 * allowlist would have blocked.
 */
const KEEP_BINDINGS_ALLOWED_TYPES = new Set<string>([
	'plain_text',
	'json',
	'secret_text',
	'secret_key',
]);

/**
 * The three control-plane paths wrangler's remote-binding flow calls, matched
 * under the `/client/v4` base wrangler prepends. `{account}` is pinned to the
 * platform account; `{name}` on the upload path is checked against the JWT.
 */
function classifyPath(pathname: string, accountId: string): { kind: 'subdomain' | 'edge-preview-session' | 'script-upload'; scriptName?: string } | null {
	const base = `/client/v4/accounts/${accountId}/workers`;
	if (pathname === `${base}/subdomain`) return { kind: 'subdomain' };
	if (pathname === `${base}/subdomain/edge-preview`) return { kind: 'edge-preview-session' };
	const uploadMatch = pathname.match(
		new RegExp(`^/client/v4/accounts/${accountId}/workers/scripts/([^/]+)/edge-preview$`),
	);
	if (uploadMatch) return { kind: 'script-upload', scriptName: decodeURIComponent(uploadMatch[1]) };
	return null;
}

/**
 * Deny-by-default validation of the preview upload's multipart `metadata`,
 * applied at two levels:
 *   - the metadata OBJECT: only the top-level keys the legitimate remote-binding
 *     flow emits are allowed (ALLOWED_METADATA_KEYS) — so migrations,
 *     tail_consumers, unsafe, etc. are rejected outright;
 *   - the bindings ARRAY: a `d1` binding must target a database in `allowedD1`,
 *     `keep_bindings` may inherit only inline value types, and every other
 *     binding must be a safe inline type (SAFE_BINDING_TYPES).
 * Any deviation — or unparseable metadata — fails closed before the real token
 * is ever attached.
 */
async function validateUploadBindings(request: Request, allowedD1: Set<string>): Promise<{ ok: true; forward: Request } | { ok: false; reason: string }> {
	// Buffer the body so we can inspect metadata AND replay the SAME bytes.
	const bodyBytes = await request.arrayBuffer();
	const contentType = request.headers.get('Content-Type') ?? '';
	if (!contentType.includes('multipart/form-data')) {
		return { ok: false, reason: 'expected multipart upload' };
	}
	const form = await new Response(bodyBytes, { headers: { 'Content-Type': contentType } }).formData();

	// Exactly one metadata part. Two parts is a parser-differential attack:
	// we'd validate the first while Cloudflare might honor another.
	const metadataParts = form.getAll('metadata');
	if (metadataParts.length !== 1) {
		return { ok: false, reason: 'expected exactly one metadata part' };
	}
	// Metadata must be the string JSON part (how wrangler sends it). A Blob/File
	// metadata part is rejected rather than parsed — fail-closed, no bypass.
	const rawMeta = metadataParts[0];
	if (typeof rawMeta !== 'string') {
		return { ok: false, reason: 'metadata part must be a JSON string' };
	}
	const metadataText = rawMeta;
	let metadata: Record<string, unknown>;
	try {
		metadata = JSON.parse(metadataText);
	} catch {
		return { ok: false, reason: 'unparseable metadata' };
	}
	if (metadata === null || typeof metadata !== 'object' || Array.isArray(metadata)) {
		return { ok: false, reason: 'metadata must be a JSON object' };
	}

	// Deny-by-default on the metadata OBJECT: reject any top-level key the
	// legitimate remote-binding preview flow does not emit. This is what keeps
	// `migrations` (cross-tenant Durable Object transfer), `tail_consumers` /
	// `streaming_tail_consumers` (attach an arbitrary worker), `unsafe` (raw
	// metadata injection) and every other resource-attaching key from reaching
	// Cloudflare under the real token — the same deny-by-default posture the
	// bindings loop applies, one level up.
	for (const key of Object.keys(metadata)) {
		if (!ALLOWED_METADATA_KEYS.has(key)) {
			return { ok: false, reason: `metadata key '${key}' not permitted in preview upload` };
		}
	}

	// keep_bindings inherits binding VALUES from the prior version of this
	// (name-pinned) script. Permit ONLY the inline value types the real flow
	// requests; a keep_bindings naming d1/kv/r2/service is rejected so it can
	// never re-attach a resource binding past the array allowlist.
	if (metadata.keep_bindings !== undefined) {
		const keep = metadata.keep_bindings;
		if (!Array.isArray(keep) || !keep.every((t) => typeof t === 'string' && KEEP_BINDINGS_ALLOWED_TYPES.has(t))) {
			return { ok: false, reason: 'keep_bindings may only inherit inline value types' };
		}
	}

	const bindings = metadata.bindings ?? [];
	if (!Array.isArray(bindings)) {
		return { ok: false, reason: 'metadata.bindings not an array' };
	}

	// Deny-by-default on binding TYPE. d1 must target the app's own database
	// (checking every id form present); every other type must be a safe inline
	// value — anything else could reach another tenant's / the platform's
	// resources with the real account token.
	for (const b of bindings) {
		const binding = b as Record<string, unknown>;
		if (!binding || typeof binding.type !== 'string') {
			return { ok: false, reason: 'malformed binding' };
		}
		if (binding.type === 'd1') {
			const ids = [binding.id, binding.database_id].filter((x): x is string => typeof x === 'string');
			if (ids.length === 0 || !ids.every((id) => allowedD1.has(id))) {
				return { ok: false, reason: 'd1 binding targets a database this app may not bind' };
			}
		} else if (!SAFE_BINDING_TYPES.has(binding.type)) {
			return { ok: false, reason: `binding type '${binding.type}' not permitted in preview upload` };
		}
	}

	// Forward the exact validated bytes.
	const forward = new Request(request.url, {
		method: request.method,
		headers: request.headers,
		body: bodyBytes,
	});
	return { ok: true, forward };
}

export async function proxyToCloudflareApi(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
	if (!env.CF_PROXY_JWT_SECRET) {
		return deny(403, 'Cloudflare API proxy is not enabled');
	}

	// 1) Verify the session token (carried as the Bearer).
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.replace(/^Bearer\s+/i, '').trim();
	if (!token) {
		return deny(401, 'Missing authorization');
	}
	let claims: CfProxyClaims;
	try {
		const { payload } = await jwtVerify(token, new TextEncoder().encode(env.CF_PROXY_JWT_SECRET), { algorithms: ['HS256'] });
		if (
			typeof payload.appId !== 'string' ||
			typeof payload.userId !== 'string' ||
			typeof payload.scriptName !== 'string' ||
			!Array.isArray(payload.d1) ||
			!payload.d1.every((x) => typeof x === 'string')
		) {
			return deny(401, 'Malformed proxy token');
		}
		claims = { appId: payload.appId, userId: payload.userId, scriptName: payload.scriptName, d1: payload.d1 as string[] };
	} catch {
		return deny(401, 'Invalid or expired proxy token');
	}

	// 2) Pin the account and allowlist the endpoint. Deny-by-default.
	const url = new URL(request.url);
	const route = classifyPath(url.pathname, env.CLOUDFLARE_ACCOUNT_ID);
	if (!route) {
		console.warn(`[CF Proxy] denied path app=${claims.appId} ${request.method} ${url.pathname}`);
		return deny(403, 'Endpoint not permitted');
	}

	// 3) Confirm the signed token belongs to the app's real owner (defense in
	// depth — the token itself is unforgeable). The set of databases this
	// session may bind is the signed `d1` claim UNION the app row's recorded id
	// (the claim is authoritative because we sign it; the row covers a token
	// minted before the id was recorded).
	const app = await drizzle(env.DB)
		.select({ userId: apps.userId, d1DatabaseId: apps.d1DatabaseId })
		.from(apps)
		.where(eq(apps.id, claims.appId))
		.get();
	if (!app) return deny(404, 'App not found');
	if (app.userId !== claims.userId) return deny(403, 'Token does not match app owner');
	const allowedD1 = new Set<string>(claims.d1);
	if (app.d1DatabaseId) allowedD1.add(app.d1DatabaseId);
	if (allowedD1.size === 0) return deny(403, 'App has no provisioned database to bind');

	// 4) Endpoint-specific checks.
	let forwardRequest: Request = request;
	if (route.kind === 'script-upload') {
		if (route.scriptName !== claims.scriptName) {
			console.warn(`[CF Proxy] script-name mismatch app=${claims.appId} path=${route.scriptName} claim=${claims.scriptName}`);
			return deny(403, 'Script name not permitted');
		}
		const validated = await validateUploadBindings(request, allowedD1);
		if (!validated.ok) {
			console.warn(`[CF Proxy] upload bindings rejected app=${claims.appId}: ${validated.reason}`);
			return deny(403, `Upload not permitted: ${validated.reason}`);
		}
		forwardRequest = validated.forward;
	}

	// 5) Swap the session JWT for the real token and forward.
	const outHeaders = new Headers(forwardRequest.headers);
	outHeaders.set('Authorization', `Bearer ${env.CLOUDFLARE_API_TOKEN}`);
	outHeaders.delete('Host');
	const target = `${CF_API}${url.pathname}${url.search}`;
	console.log(`[CF Proxy] forwarding app=${claims.appId} ${request.method} ${url.pathname}`);
	return fetch(target, {
		method: forwardRequest.method,
		headers: outHeaders,
		body: route.kind === 'script-upload' ? forwardRequest.body : undefined,
		redirect: 'manual',
	});
}
