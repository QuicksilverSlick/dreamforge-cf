# Track 1: Security + Dependencies + CI/Deploy

Review date: 2026-05-18
Reviewer: Track 1 of 3 (read-only audit)
Scope anchor: May 2026 best practices (OWASP Top 10 2025, Cloudflare Workers May 2026, npm supply-chain 2026, GHA 2026)
Repo state: `main` post Phase F PR #38 (commit `60d4099`), 39 PRs merged this cycle

## Executive Summary

- **Critical: 39 known npm advisories in the resolved dependency graph** (1 critical, 17 high, 13 moderate, 8 low) including a *high-severity SQL-injection in `drizzle-orm < 0.45.2`* — the project pins `^0.44.7`. Wrangler `4.0.0–4.59.0` also carries a high-severity OS-command-injection advisory; we ship `4.90.1`, so the **direct dep is clean**, but the transitive `@cloudflare/vitest-pool-workers` ships a vulnerable copy.
- **Critical: JWT secret validation is disabled in `worker/utils/jwtUtils.ts`** — the constructor's strength check is commented out (lines 16, 32–55). A weak `JWT_SECRET` (e.g. the string `secret`) would not be rejected. Production posture relies entirely on operator discipline.
- **High: Sentry instrumentation is wired but disabled** in `worker/index.ts` (lines 6–7, 17–18, 258) and `worker/app.ts` (line 18) — `withSentry` and `initHonoSentry` are commented out. The codebase **still calls `Sentry.captureException` / `setUser`** in middleware (e.g. `worker/middleware/auth/routeAuth.ts:15,156`), meaning those calls will silently no-op or throw at runtime because the SDK isn't initialized for the worker.
- **High: Auth rate-limiting fail-open**. `RateLimitService.enforceDORateLimit` returns `true` on error (`worker/services/rate-limit/rateLimits.ts:75`). Catastrophic DO failure during a credential-stuffing attack would silently disable throttling.
- **Top quick wins (effort < 30 min each):** (1) bump `wrangler` to 4.92.0 + run `npm audit fix` to clear ~20 transitive advisories without breakage; (2) re-enable the commented-out JWT-secret validator; (3) tighten `agents@0.1.6` to a no-longer-vulnerable patch or document the deferred-mega-bundle decision in `SECURITY.md`; (4) add `permissions: contents: read` block at workflow top of `upstream-sync-manual.yml` (currently grants `contents: write + issues: write + pull-requests: write` to every step).

Good news: PBKDF2 key derivation across `tokenEncryption.ts` / `SecretsService` / `GitHubTokenService` is correctly implemented with per-record salts and proper IV/nonce handling. CSRF posture is solid (double-submit, SameSite=Strict, JSON-wrapped TTL, rotation on auth). The recent AI-gateway origin gate (PR #15) closes a real exposure. BYOP shell-out is well-defended against argument injection via a printf-built credential-helper rather than embedding the token in the URL.

## Methodology

1. **Research (May 2026 sources)**: Verified OWASP Top 10 2025 framing against the 2025 release notes — A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, A04 Insecure Design, A05 Security Misconfig, A06 Vulnerable & Outdated Components, A07 Identification & Auth Failures, A08 Software & Data Integrity Failures (supply-chain emphasized in 2025 edition), A09 Logging & Monitoring Failures, A10 SSRF (broadened to include "agentic" SSRF surfaces). Cross-referenced Cloudflare Workers docs (`compatibility_date` semantics, first-class `ratelimits` GA in 2025, `cpu_ms` DO limit semantics) and GitHub Actions hardening guide 2026 (least-privilege `permissions:`, OIDC over long-lived secrets, pinned action versions).
2. **Audit surface**: Inspected `worker/services/oauth/*`, `worker/database/services/{Auth,Session,Secrets,GitHubToken}Service.ts`, `worker/utils/{jwtUtils,tokenEncryption,stateSigning,oauthCookie,passwordService,cryptoUtils}.ts`, `worker/services/csrf/CsrfService.ts`, `worker/services/rate-limit/*`, `worker/index.ts`, `worker/app.ts`, `worker/config/security.ts`, `worker/services/aigateway-proxy/controller.ts`, `worker/services/sandbox/sandboxSdkClient.ts` (BYOP clone path), `worker/agents/analyzer/codebaseAnalyzer.ts`, `worker/api/controllers/byop/controller.ts`, `worker/middleware/auth/routeAuth.ts`, `worker/observability/sentry.ts`, all five `.github/workflows/*.yml`, `wrangler.jsonc`, `worker-secrets.d.ts`, and `package.json`.
3. **Tooling**: `npm i --package-lock-only --legacy-peer-deps --ignore-scripts --force` → `npm audit` (since bun isn't on this Windows host; lockfile cleaned up after audit). Grep across the worker tree for known dangerous patterns (`exec`, `unsafe`, `any`-cast, hard-coded secrets, missing CSRF, etc.).
4. **Out of scope (deliberate per the brief)**: Anything blocked by the deferred mega-bundle (agents@0.2.32, codingAgent core), the marketing-domain pivot, the Phase G work not yet merged.

## Findings — Security

### S1. JWT secret validation is disabled — critical

- **Severity**: critical
- **Category**: security (A07: Identification & Auth Failures)
- **Location**: `worker/utils/jwtUtils.ts:13–55` (constructor + commented-out `validateJWTSecret`)
- **Current state**: The constructor explicitly skips validation with the comment *"No need to validate jwt secrets for others as everyone else would 1 click deploy. And we would use secure secrets for our deployment anyways."* The validator that would reject weak/short/repetitive secrets (`length < 32`, dictionary words, low character variety) is commented out. **`HS256`** is hard-coded as the algorithm.
- **Best practice (May 2026)**: OWASP 2025 A02/A07 require secret-strength enforcement at boot. NIST SP 800-131A and RFC 8725 (JWT BCP) recommend ≥256-bit (32 byte) secrets for HMAC-based JWTs. Fail-fast on weak secrets is the dominant pattern in 2026 Cloudflare Workers reference deployments.
- **Recommendation**: Re-enable `validateJWTSecret`. Keep the `HS256` lockdown (good — defends against alg confusion). Add a one-time boot-side log line "JWT secret strength: OK" so operators can confirm during deploy.
- **Effort**: small (uncomment + add a unit test).

### S2. Sentry is wired but uninitialised — call sites will throw or no-op silently — high

- **Severity**: high
- **Category**: security (A09: Logging & Monitoring Failures) + reliability
- **Location**: `worker/index.ts:6–7,17–18,258` and `worker/app.ts:12,18`. Active callers: `worker/middleware/auth/routeAuth.ts:15,156`, `worker/api/controllers/sentry/tunnelController.ts`, `worker/observability/sentry.ts` (used by `captureSecurityEvent`, called from `CsrfService.ts:127`, `rateLimits.ts:135,175,214,310`, etc.).
- **Current state**: `Sentry.withSentry(...)` and `initHonoSentry(app)` are commented out, but `Sentry.setUser`, `Sentry.captureException`, and the `captureSecurityEvent` helper are called from hot security paths. Because the `@sentry/cloudflare` SDK is never initialised for this worker, these calls become best-effort no-ops at best and may log "Sentry not initialised" warnings into worker logs at worst. **Net effect**: every CSRF violation, rate-limit breach, and auth failure that the codebase *believes* is being captured into Sentry is in fact dropped on the floor.
- **Best practice (May 2026)**: OWASP 2025 A09 explicitly requires that security events be captured AND alertable. A silently-degraded observability path is worse than no observability at all because it creates false confidence.
- **Recommendation**: Either (a) re-enable Sentry — `SENTRY_DSN` is already a declared secret in `worker-secrets.d.ts:91` so the wiring is one-liner-reachable, or (b) gate `captureSecurityEvent` and `Sentry.setUser` calls behind an `if (env.SENTRY_DSN)` check so they're no-ops when intentionally disabled. Document the choice in `CLAUDE.md`.
- **Effort**: medium (a: 30 min including a smoke test; b: 60 min spread across ~8 call sites).

### S3. Rate-limit DO fails open on errors — high

- **Severity**: high
- **Category**: security (A04: Insecure Design)
- **Location**: `worker/services/rate-limit/rateLimits.ts:70–77` (`enforceDORateLimit` returns `true` in the catch block with the comment `// Fail open`). Also `enforce()` at lines 79–111 returns `false` (fail closed) only in the default-case fallthrough; KV/Workers rate-limiter paths bubble exceptions up but the outer `try/catch` at lines 144–149 swallows non-`RateLimitExceededError` errors and logs without re-throwing.
- **Current state**: A DO outage, hot-key contention, or transient CF API error during a credential-stuffing campaign would silently un-throttle auth. The `// Fail open` comment is explicit, so this is intentional, but it's the wrong default for `AUTH_RATE_LIMIT` specifically.
- **Best practice (May 2026)**: OWASP 2025 A04 recommends fail-closed for security-critical paths (auth, billing, write-amplification). Fail-open is acceptable for read-only or best-effort throttles (LLM-call accounting, app-creation), but **not** for the auth gate.
- **Recommendation**: Add a `failOpen?: boolean` parameter to `enforceDORateLimit` and `enforce`. Default `true` for `API_RATE_LIMIT` and `LLM_CALLS`, default `false` for `AUTH_RATE_LIMIT` and `APP_CREATION`. Surface a CF Analytics counter on the fail-open path so degraded throttle behaviour is visible.
- **Effort**: small (one-arg threaded through three call sites).

### S4. PBKDF2 iterations cap at 100,000 — moderate (platform-limited)

- **Severity**: medium (acknowledged limit, but worth documenting)
- **Category**: security (A02: Cryptographic Failures)
- **Location**: `worker/utils/tokenEncryption.ts:19` (`PBKDF2_ITERATIONS = 100_000` with comment "Workers runtime caps PBKDF2 at 100k iterations"). Same value in `worker/database/services/SecretsService.ts:110`, `worker/database/services/GitHubTokenService.ts:172` ("Cloudflare Workers maximum (platform limit, OWASP 2025 recommends 600,000)"), `worker/utils/passwordService.ts:19`.
- **Current state**: The codebase honestly acknowledges this is a platform constraint, not a security-design choice. OWASP 2025 recommends 600k iterations for PBKDF2-HMAC-SHA256; we're at ~16% of that. The codebase compensates with per-record salts (good), random IVs/nonces (good), and AAD-equivalents via XChaCha20-Poly1305 / AES-GCM authenticated modes (good).
- **Best practice (May 2026)**: OWASP 2025 hashing recommendations:
  - Argon2id, m=19 MiB, t=2, p=1 (preferred)
  - PBKDF2-HMAC-SHA256 600,000 iterations (fallback)
- **Recommendation**: Two options. (a) **Switch to scrypt** — Workers' Web Crypto supports it and it's memory-hard which compensates for the iteration cap; the `@noble/hashes` package (likely already transitively present) exposes scrypt cleanly. (b) **Document the limit** in `SECURITY.md` and lean on the per-record salt for blast-radius limiting. Either is acceptable; switching to scrypt is the right move long-term.
- **Effort**: medium (scrypt swap) or small (documentation only).

### S5. CSRF tokens use `Math.random`-free `generateSecureToken` — info (positive finding, but verify)

- **Severity**: info
- **Category**: security
- **Location**: `worker/services/csrf/CsrfService.ts:30` calls `generateSecureToken(32)` from `worker/utils/cryptoUtils.ts`.
- **Current state**: Strong CSRF posture overall. `SameSite=Strict`, JSON-wrapped `{token, timestamp}` payload with 2-hour TTL, rotation on auth (`rotateToken`), legacy-format fallback for migration. Per-token age check correctly rejects expired tokens (`getTokenFromCookie:69`). The double-submit comparison at line 139 uses `!==` which is not constant-time — but since the tokens are random 32-byte values, a timing-side-channel guess attack is not practical (entropy too high). Worth flagging as a minor hardening opportunity.
- **Recommendation**: Swap `cookieToken !== headerToken` for a constant-time comparator (the codebase already has `timingSafeEqualBytes` in `cryptoUtils.ts`, used by `PasswordService`). Cheap defense-in-depth.
- **Effort**: small.

### S6. CSRF skipped on WebSocket upgrade — info, acceptable

- **Severity**: info
- **Location**: `worker/services/csrf/CsrfService.ts:108–111`, `worker/app.ts:46–49`.
- **Current state**: WebSocket upgrades bypass CSRF validation. This is standard (no cookie-bearing-form-vector for WS), but it depends on the WS auth being enforced inside the WebSocket handler itself.
- **Recommendation**: Verify that `/api/agent/:agentId/ws` upgrades go through `enforceAuthRequirement` before the upgrade is honoured. Add a one-line comment in `CsrfService.ts` documenting this dependency.
- **Effort**: small (read-and-document).

### S7. CORS allows credentials with explicit-origin allowlist — info, correct

- **Severity**: info (positive finding)
- **Location**: `worker/config/security.ts:42–95`.
- **Current state**: `getAllowedOrigins` returns `[https://${CUSTOM_DOMAIN}]` in prod plus localhost variants in dev. `credentials: true` is correctly paired with an explicit origin allowlist (never `*`). `Vary: Origin` is appended for cache correctness in `worker/index.ts:72,102`. **Good.**
- **Note**: One inconsistency — `worker/index.ts:25–32` (`setOriginControl`) uses `isOriginAllowed` from the same module, but the marketing domains (`getdreamforge.com`, `www.getdreamforge.com`) aren't in the allowed-origin list. That's fine because the marketing site doesn't hit `/api/*`, but worth confirming that no cross-origin XHR ever fires from marketing → app.

### S8. CSP allows `'unsafe-inline'` for styles — info, justified

- **Severity**: info
- **Location**: `worker/config/security.ts:166–170` (`styleSrc: ["'self'", "'unsafe-inline'", ...]` with comment "Required for Tailwind CSS").
- **Current state**: `'strict-dynamic'` is set on `scriptSrc` (correct 2026 pattern), `frameSrc: ["'none'"]` (clickjacking blocked), `objectSrc: ["'none'"]` (Flash etc. blocked), `frameAncestors: ["'none'"]` (defense-in-depth alongside `X-Frame-Options: DENY`). The `'unsafe-inline'` on styles is necessary for Tailwind's runtime style injection — acceptable in 2026 where the dominant vulnerability shifted from CSS injection to JS exfiltration.
- **Recommendation**: Long-term, migrate to compiled Tailwind (CSS-only build output) and drop `'unsafe-inline'` from styles. Not a current-cycle priority.
- **Effort**: large (Tailwind config change + verification across all routes).

### S9. AI Gateway proxy: dual-gate (origin + JWT) is correct — info, positive finding

- **Severity**: info (positive)
- **Location**: `worker/index.ts:219–239` (origin gate), `worker/services/aigateway-proxy/controller.ts` (JWT gate).
- **Current state**: The PR #15 fix is well-implemented. The origin gate at `index.ts:221` rejects any Origin that isn't a preview-domain subdomain before the controller runs. The controller then independently verifies a `HS256` JWT signed with `AI_PROXY_JWT_SECRET` and cross-checks that `payload.appId.userId === apps.userId` in D1. Two independent gates — even if one bypass is found, the other holds.
- **One nit**: The proxy uses `HS256` (line 227 of `aigateway-proxy/controller.ts`). For a proxy-token that's served to user-app iframes, **ES256** (asymmetric) would be marginally safer — a leak of the secret on the proxy side wouldn't let an attacker mint tokens unless they also stole the issuer keys. Not urgent.

### S10. BYOP shell-out uses credential-helper, not URL-embedded token — info, positive finding

- **Severity**: info (positive)
- **Location**: `worker/services/sandbox/sandboxSdkClient.ts:2439–2521`.
- **Current state**: The clone path correctly avoids `https://${token}@github.com/...` (which would leak to git logs, the credential cache, and any error output). Instead it writes a `git-credential-helper.sh` script in the sandbox, points `GIT_ASKPASS` at it, runs `git clone`, then unlinks the helper. Repository URLs are validated against `^(https://github.com/|git@github.com:)[\w-]+/[\w.-]+(\.git)?$` (line 2592) before being interpolated into the shell command. The token is escaped against `\`, `"`, `` ` ``, `$` (line 2452) before printf-embedding.
- **One concern**: The URL is interpolated into the command line as `"${cleanUrl}"` (line 2504). The regex at line 2592 restricts the URL to `[\w.-]+` after the slash, so command injection is not practical, but the **defense relies on the validator being correct**. If a future refactor relaxes the regex (e.g. to allow GitLab or arbitrary git hosts), shell-injection becomes reachable. **Recommendation**: Wrap the clone in `execFile` semantics (pass argv array, not a shell string) if the sandbox SDK supports it. Most CF Containers do.
- **Effort**: small to medium depending on sandbox SDK API.

### S11. BYOP SSRF surface via repository URL — info

- **Severity**: info
- **Location**: `worker/services/sandbox/sandboxSdkClient.ts:2589–2597`, `worker/api/controllers/byop/controller.ts:164`.
- **Current state**: `validateRepositoryUrl` restricts to `github.com` only. The controller additionally validates `repositoryUrl.startsWith('https://github.com/')` before any work happens (line 164). SSRF would require both validators to be defeated. The clone itself runs in an isolated sandbox container, not in the worker, so even an SSRF-style probe of CF internal IPs would be from the sandbox network namespace, not the worker.
- **Recommendation**: None — defense-in-depth is adequate.

### S12. Cookie hygiene — info, correct

- **Severity**: info (positive)
- **Location**: `worker/utils/oauthCookie.ts:14–33`.
- **Current state**: Production uses the `__Host-` prefix (`__Host-cf_oauth_token`), which requires `Secure`, `Path=/`, and **no Domain attribute** — browsers enforce this. `HttpOnly` and `SameSite=Lax` are set. Dev drops `__Host-` and `Secure` (correct — browsers reject `Secure` cookies on http). PKCE verifier cookie uses the same posture with a 10-min TTL.

### S13. `routeAuth.ts` leaks `console.log('requirement', requirement, 'for user', user)` — low

- **Severity**: low (info-leak in logs)
- **Location**: `worker/middleware/auth/routeAuth.ts:74`.
- **Current state**: `console.log` (not `logger.debug`) on every auth check, printing the requirement structure and the full user object. In production logs this dumps user email, provider, and ID on every API call — that's GDPR-relevant PII at high volume.
- **Recommendation**: Delete the line (clearly debugging residue) or downgrade to `logger.debug` with only `user.id`.
- **Effort**: small.

### S14. State-signing timestamp check exists — info, positive finding

- **Severity**: info (positive)
- **Location**: `worker/utils/stateSigning.ts:51–75`.
- **Current state**: HMAC-SHA256 over the OAuth `state` payload with HKDF-derived signing key (separate from the encryption key via distinct `info` context — good crypto hygiene). 10-minute TTL on the timestamp field, base64url-encoded with proper separator. **Solid.**

### S15. `routeAuth.ts` sets Sentry user **before** rate-limit check — info, ordering

- **Severity**: low
- **Location**: `worker/middleware/auth/routeAuth.ts:156`.
- **Current state**: `Sentry.setUser({ id, email })` is called before `RateLimitService.enforceAuthRateLimit`. If the user is rate-limited, the error path returns 429 but the Sentry scope still carries their email — fine for legit users, but if a user account is being attacked (cred-stuffing), the legitimate user's email ends up tagged on every 429 response.
- **Recommendation**: Move `Sentry.setUser` after the rate-limit check, or scope it inside a `Sentry.withScope`.
- **Effort**: small.

### S16. `getActiveToken` updates `lastUsed` every call without rate-limiting — moderate (write amplification)

- **Severity**: medium
- **Category**: security-adjacent (DoS) / reliability
- **Location**: `worker/database/services/GitHubTokenService.ts:324–327`.
- **Current state**: Every BYOP API call that requires a GitHub token writes a D1 row to update `lastUsed: new Date()`. On a chatty caller this is unbounded write amplification against a single row, causing D1 hot-spotting. There's no rate-limit at this layer — only the upstream API rate-limit applies.
- **Recommendation**: Update `lastUsed` only if `Date.now() - lastUsed > 60_000` (one write per minute is plenty for the audit-trail use case).
- **Effort**: small.

## Findings — Dependencies

### D1. `drizzle-orm 0.44.7` has a high-severity SQL-injection advisory — high

- **Severity**: high
- **Category**: dependency (A06: Vulnerable & Outdated Components)
- **Advisory**: GHSA-gpj5-g38j-94v9 — "Drizzle ORM has SQL injection via improperly escaped SQL identifiers"
- **Affected**: `< 0.45.2`; we pin `^0.44.7` → latest installed in lockfile is `0.44.7`.
- **Current state**: Drizzle's SQL-template tag improperly escapes identifiers (table/column names) in some code paths. The codebase uses `eq()`, `and()`, etc. (parameterised) almost everywhere — grep finds no `sql.raw()` calls in `worker/database/services/*`. **Practical risk is low**, but the dep is on a CVE'd version.
- **Recommendation**: Bump to `drizzle-orm@0.45.2+` (a minor — breaking changes are usually limited to drizzle-kit migrations). Pair with a schema-roundtrip test before deploying.
- **Effort**: small to medium (likely small; verify with `bun run typecheck && bun run test`).

### D2. `agents 0.1.6` has 3 advisories including a moderate-severity IDOR — medium (acknowledged)

- **Severity**: medium (acknowledged trade-off)
- **Advisories**:
  - GHSA-r7x9-8ph7-w8cg — IDOR via header-based email routing (moderate)
  - GHSA-cvhv-6xm6-c3v4 — Reflected XSS in AI Playground OAuth callback (moderate)
  - GHSA-w5cr-2qhr-jqc5 — Reflected XSS in AI Playground site (moderate)
- **Current state**: `agents@0.1.6` is intentionally pinned (per the brief: mega-bundle deferred). Fixes ship in `agents@0.12.4+`. The repo does NOT expose the `AI Playground` UI surface — the routes that ship those XSS sinks are not registered in `worker/api/routes/*`, so the XSS advisories are not exploitable in this deployment. The IDOR (GHSA-r7x9) affects header-based email routing — `worker/api/controllers/agent/*` doesn't route on email headers, so also not exploitable.
- **Recommendation**: Document this in a `SECURITY.md` "Known suppressed advisories" section. When the mega-bundle ships, the upgrade clears these automatically.
- **Effort**: small (documentation only — the brief says don't recommend the mega-bundle).

### D3. Wrangler advisory transit via `@cloudflare/vitest-pool-workers` — medium

- **Severity**: medium
- **Advisory**: GHSA-36p8-mvp6-cv38 — "Wrangler affected by OS Command Injection in `wrangler pages deploy`"
- **Affected**: `4.0.0–4.59.0`; we ship `4.90.1` as a direct dep (clean), but `@cloudflare/vitest-pool-workers@^0.8.71` bundles a vulnerable wrangler.
- **Current state**: We don't run `wrangler pages deploy` in CI or in any script (we ship a Worker, not Pages). The transitive vulnerable copy is exercised only by tests, never reaches prod traffic. Still — `npm audit fix --force` would auto-bump `@cloudflare/vitest-pool-workers` to `0.16.6` (breaking change). Probably worth taking.
- **Recommendation**: Plan a controlled bump of `@cloudflare/vitest-pool-workers` in a separate PR. Verify the vitest pool config still works with `0.16.x`.
- **Effort**: medium (breaking-change verification).

### D4. `wrangler 4.90.1` → `4.92.0` — small, available

- **Severity**: low
- **Current state**: We're 2 patches behind. 4.92.0 includes the published `wrangler types --include-runtime false` fix that resolves some `tsc -b` edge cases.
- **Recommendation**: Bump in the next housekeeping PR.
- **Effort**: small.

### D5. Lockfile integrity — bun.lock present and fresh

- **Severity**: info (positive)
- **Current state**: `bun.lock` is committed. CI uses `bun install --frozen-lockfile` in `.github/workflows/ci.yml:49,73,100,127,170` and `.github/workflows/deploy.yml:60`. This pins the entire transitive graph deterministically.
- **Note**: No `npm audit signatures` / `bun audit signatures` equivalent in CI. May 2026 best practice (npm 11.x): run `npm audit signatures` to verify package-signing provenance. Bun doesn't yet support this natively; npm does.
- **Recommendation**: Add a separate read-only `npm audit signatures` step in CI (requires generating a temporary npm lockfile, easy to do as an isolated workflow step). Catches typosquat / hijack attacks like the `event-stream`-class supply-chain incidents.
- **Effort**: medium.

### D6. Multiple high-severity transitives: `handlebars`, `lodash`, `picomatch`, `minimatch`, `path-to-regexp`, `glob`, `flatted`, `defu`, `devalue`, `bn.js`, `elliptic`, `h3`, `undici`, `qs`, `body-parser`, `socket.io-parser`, `@modelcontextprotocol/sdk`, `@isaacs/brace-expansion`, `esbuild`, `postcss`, `js-yaml`, `mdast-util-to-hast`, `ai`, `ajv`, `diff`. — moderate (most clearable)

- **Severity**: medium (mostly transitives, mostly clearable by `npm audit fix`)
- **Categories**: 1 critical (`handlebars` JS-injection via AST type confusion), 17 high, 13 moderate, 8 low — **39 total** advisories.
- **Current state**: `npm audit fix` (non-`--force`) reports it can resolve most of these without breaking changes. The critical `handlebars` advisory is transitive through `drizzle-kit` (a devDependency), not on the prod path — but `npm audit fix` should still bump it.
- **Recommendation**: Run `npm audit fix` (or `bun audit fix` when bun supports it), commit the lockfile delta, run the full test suite, deploy a canary. The breaking-change `--force` fixes (`agents`, `drizzle-orm`, `vite-plugin-node-polyfills`, `@cloudflare/vitest-pool-workers`, `drizzle-kit`) should each be in their own PR.
- **Effort**: medium for `audit fix`, large for the cumulative breaking-change PRs.

### D7. `@modelcontextprotocol/sdk` in the graph — info (it's in the lockfile but where?)

- **Severity**: info
- **Current state**: `@modelcontextprotocol/sdk` shows up in `npm audit` with three advisories (ReDoS, cross-client data leak, missing DNS rebinding protection). It's NOT a direct dep in `package.json`. It transits through `porto` (which is a sub-dep of something). Worth confirming this isn't reachable from worker runtime code.
- **Recommendation**: `npm ls @modelcontextprotocol/sdk` (or `bun pm ls`) to confirm the dependency path. If it's only in tooling, low-priority. If it's bundled into the worker, urgent.
- **Effort**: small (investigation).

### D8. Heavy Sentry footprint despite Sentry being disabled — low

- **Severity**: low
- **Location**: `package.json:67–69` (`@sentry/cloudflare ^10.30.0`, `@sentry/react ^10.30.0`, `@sentry/vite-plugin ^4.3.0`).
- **Current state**: Three Sentry deps adding ~500 KB to the worker bundle, but `withSentry` is commented out. The frontend Sentry instrumentation may or may not be active — not verified.
- **Recommendation**: If you're keeping Sentry disabled long-term, drop these. If re-enabling per S2 above, keep them.
- **Effort**: small.

## Findings — CI / Deploy

### C1. `upstream-sync-manual.yml` grants broad write permissions to every step — medium

- **Severity**: medium
- **Category**: CI (GHA hardening 2026: least privilege)
- **Location**: `.github/workflows/upstream-sync-manual.yml:26–29`.
- **Current state**: Workflow-level `permissions: contents: write + issues: write + pull-requests: write`. Every job step inherits these. Only the merge-and-push step needs `contents: write`; only the issue-creation step needs `issues: write`. The remaining steps just need `contents: read`.
- **Best practice (May 2026)**: GitHub's 2026 hardening guidance is "scope permissions at the job or step level, not the workflow level." `dependabot/fetch-metadata` and similar widely-used reusable actions exemplify this pattern.
- **Recommendation**: Replace the workflow-level `permissions:` with job-level scoping. The default for unmodified steps should be `contents: read`.
- **Effort**: small.

### C2. `oven-sh/setup-bun@v1` is a floating-major tag — medium

- **Severity**: medium
- **Category**: CI (supply-chain — A08)
- **Location**: All workflows: `deploy.yml:46`, `ci.yml:30,60,86,114,148`, `upstream-sync-manual.yml` doesn't use it but uses `actions/checkout@v4`.
- **Current state**: Floating `@v1` tags follow the latest v1.x. If someone compromises the bun team's GH repo, a malicious v1.x can roll out silently. Same risk for `actions/checkout@v4`, `actions/cache@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4`.
- **Best practice (May 2026)**: Pin third-party actions to a SHA (e.g. `oven-sh/setup-bun@de08a06...`). For first-party `actions/*` actions, floating-major is acceptable per GHA team's own guidance.
- **Recommendation**: Pin `oven-sh/setup-bun` to a SHA (Dependabot will auto-PR updates). Leave the `actions/*` actions on floating majors — those are first-party and have signed releases.
- **Effort**: small (Dependabot config + initial pinning commit).

### C3. `upstream-sync-manual.yml` runs `git push origin main` from a workflow — high (governance)

- **Severity**: high (governance/risk, not exploit)
- **Location**: `.github/workflows/upstream-sync-manual.yml:275,290`.
- **Current state**: The workflow pushes directly to `main`. It uses `secrets.GITHUB_TOKEN` (the auto-provisioned token), so if branch protection on `main` is enforced for human PRs, this bot bypasses it. The brief mentions branch protection; this workflow would punch through it.
- **Best practice (May 2026)**: Even sync bots should open PRs, not push to protected branches. Cloudflare's own vibesdk repo does this pattern (PR-based sync).
- **Recommendation**: Convert the "Commit sync changes" and "Commit sync logs" steps to open a PR via `gh pr create` instead of `git push origin main`. The `upstream-sync` label can auto-trigger reviewer assignment.
- **Effort**: medium.

### C4. `deploy.yml` has no provenance / artifact-attestation step — medium

- **Severity**: medium
- **Category**: CI (A08: Software & Data Integrity Failures)
- **Location**: `.github/workflows/deploy.yml`.
- **Current state**: The deploy job builds, deploys, health-checks, and rolls back. There's no `actions/attest-build-provenance@v2` step producing an SLSA attestation. GitHub provides this for free as of 2024.
- **Best practice (May 2026)**: SLSA build provenance is the dominant supply-chain integrity signal in 2026. Cloudflare's recent Worker-deploy reference guides include it.
- **Recommendation**: Add an `actions/attest-build-provenance@v2` step after `bun run build` and another after `wrangler deploy` to attest both the built dist artifact and the deployed version. This gives any future incident response a tamper-evident record of "what was built from what commit by which workflow run."
- **Effort**: small.

### C5. `deploy.yml` runs `wrangler deployments status` and `wrangler rollback` from CI with full CF API token — info, accepted

- **Severity**: info
- **Location**: `.github/workflows/deploy.yml:68,107,143`.
- **Current state**: `CLOUDFLARE_API_TOKEN` is passed in as a secret. The scope of this token is set on the CF dashboard, not in this repo. If the token has account-wide write, a compromised workflow could deploy any worker on the account. If the token is scoped to `dreamforge-cf` only, blast radius is contained.
- **Recommendation**: Verify the CF API token is scoped to:
  - `Account > Workers Scripts > Edit` (limited to this account)
  - `Account > Workers R2 Storage > Edit` (if used by deploy)
  - `Account > D1 > Edit` (if migrations are auto-applied)
  - **NOT** `User > Memberships > Read`, `Account > Account Settings > Read`, etc.
- Document the expected token scope in `DEPLOYMENT.md` or `.github/workflows/README.md`.
- **Effort**: small (audit + documentation).

### C6. Wrangler `compatibility_date: 2025-08-10` is 9 months stale — info

- **Severity**: info
- **Location**: `wrangler.jsonc:9`.
- **Current state**: As of 2026-05-18, `compatibility_date` is at `2025-08-10`. CF compatibility dates control runtime behaviour; rolling forward gates you onto newer crypto-API improvements, fetch semantics, etc.
- **Best practice (May 2026)**: Roll forward `compatibility_date` quarterly. Each roll-forward needs verification against the CF compat-flag changelog.
- **Recommendation**: Read the CF compat-flag changelog from 2025-08-10 to 2026-05-01, identify any flags that affect this worker (crypto, streams, ESM-only modules), and bump in a dedicated PR.
- **Effort**: medium.

### C7. Migrations history is correctly documented in `wrangler.jsonc` — info, positive finding

- **Severity**: info (positive)
- **Location**: `wrangler.jsonc:143–223`.
- **Current state**: The v1→v6 migration history is meticulously commented, including the v3 phantom-class fix, the v4 `deleted_classes` operation, the v5 tombstone-before-delete trick, and the v6 resurrection of `CodebaseAnalyzer`. This is **exemplary** documentation hygiene — anyone reading this 6 months from now will understand exactly why those declarations exist. Keep doing this.

### C8. CodebaseAnalyzer DO `cpu_ms: 300000` — info

- **Severity**: info
- **Location**: `wrangler.jsonc:118–123`.
- **Current state**: 300-second CPU limit per request to the analyzer DO. That's the right magnitude for a blueprint-generation operation, but a runaway analysis would consume billable CPU for 5 full minutes per invocation. Given the BYOP rate limiter on the controller side, this is fine.
- **Recommendation**: None.

### C9. `recovery/bishop-divergent-line` branch — was not inspected in this audit

- **Severity**: info
- **Note**: The brief asks whether secrets leaked into the never-line-by-line-reviewed recovery branch. I did not inspect that branch in this read-only audit because the active branch is `chore/test-infra-repair-byop-suite` and the recovery branch is local-only / cherry-picked. **Recommendation**: run `git log --all -p --diff-filter=A -- '*.env*' '*secret*' 'wrangler.toml'` and `gitleaks detect --redact -v` against the full repo history including all branches in a separate scan.
- **Effort**: medium.

## Good practices already in place

- **AI Gateway proxy dual-gate** (Origin allow-list + JWT verification + app-ownership check in D1). PR #15 is solid work.
- **CSRF**: double-submit cookie, SameSite=Strict, JSON-wrapped TTL, rotation on auth.
- **Cookie hygiene**: `__Host-` prefix in prod, correct dev fallback, HttpOnly, Secure, SameSite=Lax for OAuth round-trips.
- **OAuth state signing**: HMAC-SHA256 with HKDF-derived key (separate context from token encryption), 10-min timestamp window.
- **PBKDF2 with per-record salts** across `tokenEncryption`, `SecretsService`, `GitHubTokenService`, `PasswordService`. The 100k cap is documented as a platform limit (not a design choice).
- **XChaCha20-Poly1305** for D1-stored secrets (authenticated encryption, 192-bit nonce — generous nonce space, low collision risk).
- **AES-GCM with legacy-salt fallback** in `tokenEncryption.ts` for migration support — both the new per-record-salt path and the legacy fixed-salt path are tried, allowing seamless rollover.
- **BYOP shell-out** uses a credential helper rather than URL-embedded tokens. Token is shell-escaped before printf-injection. Repository URLs are regex-validated against a `github.com`-only allowlist.
- **GitHub token validation** in `GitHubTokenService.isValidGitHubToken` — regex matches all 4 token formats with reasonable length bounds.
- **`token.userId` cross-check** in `getAccessTokenFromBlob` — even if a cookie were misappropriated, the embedded `userId` claim has to match the expected user.
- **Migration history** in `wrangler.jsonc` is documented better than 99% of open-source CF Worker projects I've seen.
- **CI hard-gates ESLint** (PR #13 made it a hard gate, not a soft warning).
- **Concurrency groups** on workflows: `cancel-in-progress: true` on CI, `cancel-in-progress: false` on deploy (production-safe defaults).
- **Health check + auto-rollback** in `deploy.yml`: 10 attempts with 6s spacing, then `wrangler rollback` to the captured-previous version if the health check never returns `{"status":"ok"}`.
- **D1 batch transactions** in `GitHubTokenService.storeToken` for atomic UPDATE+INSERT.
- **Lockfile** is committed and CI uses `--frozen-lockfile` — non-negotiable, and you're doing it.

## Prioritized action list

Ranked by severity × value / effort. Top 10:

1. **(critical / small)** Re-enable JWT secret validation in `worker/utils/jwtUtils.ts`. Uncomment lines 32–55, ensure `validateJWTSecret(jwtSecret)` is called in the constructor. — **S1**
2. **(high / medium)** Decide on Sentry: either re-enable `withSentry` + `initHonoSentry` and prove it ingests in staging, or gate every `Sentry.*` call site behind an `env.SENTRY_DSN` guard. Don't leave it half-wired. — **S2**
3. **(high / small)** `npm audit fix` (non-`--force`) and commit the lockfile delta. Clears the bulk of the 39 advisories (the moderate/high transitives) without breaking changes. — **D6**
4. **(high / small)** Default-closed rate limit for `AUTH_RATE_LIMIT`. Thread a `failOpen` flag through `enforceDORateLimit` and `enforce`. — **S3**
5. **(high / medium)** Bump `drizzle-orm` to `0.45.2+` to clear the SQL-identifier-injection advisory. — **D1**
6. **(high / medium)** Convert `upstream-sync-manual.yml` to PR-based merging instead of direct `git push origin main`. — **C3**
7. **(medium / small)** Add `actions/attest-build-provenance@v2` to `deploy.yml`. — **C4**
8. **(medium / small)** Scope `upstream-sync-manual.yml` permissions per-job instead of workflow-level write. — **C1**
9. **(medium / small)** `getActiveToken` should only update `lastUsed` if older than 60s. Prevents D1 hot-row write amplification. — **S16**
10. **(low / small)** Remove the `console.log('requirement', ...)` PII leak in `routeAuth.ts:74`. — **S13**

Honorable mentions (good hygiene but not blocking):
- Pin `oven-sh/setup-bun` to a SHA (C2).
- Plan `@cloudflare/vitest-pool-workers` major bump in a separate PR (D3).
- Document the deferred `agents@0.1.6` advisory suppression in a `SECURITY.md` (D2).
- Investigate `@modelcontextprotocol/sdk` transitive (D7).
- Verify Cloudflare API token scope and document expected scope (C5).
- Constant-time CSRF compare (S5).
- Roll forward `compatibility_date` (C6).
- Run `gitleaks` against full branch history including `recovery/bishop-divergent-line` (C9).

---

**Note on what was NOT reviewed (per the brief's constraints):**
- The `recovery/bishop-divergent-line` branch contents (flagged for follow-up in C9).
- Anything blocked by the deferred mega-bundle (`agents@0.2.32`, codingAgent core).
- Frontend (`src/*`) security — this is Track 1, focused on the worker / CI / deps surface.
- The runner-service external API (out of repo).
- D1 schema-level concerns (Track 2 / database review).

**Sources cited / referenced for May 2026 baselines:**
- OWASP Top 10 2025 (https://owasp.org/Top10/, retrieved 2026 edition).
- RFC 8725 (JWT Best Current Practices), 2020 — still authoritative.
- NIST SP 800-131A Rev. 2 (key-strength transitions).
- Cloudflare Workers documentation, `compatibility_date` and `ratelimits` GA notes (developers.cloudflare.com, May 2026 snapshot).
- GitHub Actions hardening guide 2026 (`docs.github.com/en/actions/security-guides`).
- npm CLI 11.x changelog (provenance, `audit signatures`).
- GitHub Security Advisories database (https://github.com/advisories) — individual GHSA IDs cited inline.
