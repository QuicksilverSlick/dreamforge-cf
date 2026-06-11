# Cloudflare OAuth + AI Gateway Credits BYOK — Port Handoff

> **Status (2026-06-11): NOT SHIPPED. ~70% of the code is already in `main`, unused and unreachable.**
> This document is the complete brief for the agent that executes the port. Read it end-to-end
> before writing code. Facts below were verified on 2026-06-11 against upstream
> `cloudflare/vibesdk` @ `5fa1091525fc4062bd5efecc344a2b3424601f9c` and live Cloudflare docs.

## 1. What this feature is

The user clicks **"Connect Cloudflare"** in Dreamforge, OAuths into **their own Cloudflare
account**, and from then on their builds run through an AI Gateway **in their account**, drawing
down **their prepaid Cloudflare credits** (unified billing). Dreamforge stops paying for that
user's inference entirely.

- Billing model: provider list-price pass-through + **5% fee at credit purchase** ($100 of
  credits costs $105). No per-token markup, no gateway fees.
- This **coexists** with the already-shipped provider-key BYOK (PR #114). Key precedence when
  both exist: `runtime keys → user's stored D1 provider key (cheapest for user) → user's
  Cloudflare gateway OAuth token → platform env keys → platform gateway token`.
- Distinct from PR #114 in storage too: **no D1 row holds the OAuth token.** It lives only in an
  encrypted `__Host-` cookie and in Durable Object state.

## 2. Current state of the world (verify before relying on it)

### 2.1 Cloudflare-side facts (as of 2026-06-11 — re-verify, several are Beta)

| Fact | Status | Source |
|---|---|---|
| Unified billing (credits) | **Beta** since Sept 2025, not GA | developers.cloudflare.com/ai-gateway/features/unified-billing/ |
| Providers covered by credits | OpenAI, Anthropic, Google AI Studio, Vertex, xAI, Groq | same |
| Credit purchase fee | 5% at load time; inference at provider list price | same |
| Credits balance API | **Does not exist publicly** — design reactive ("out of credits" error handling + user auto-top-up), not pre-flight | unconfirmed absence, checked 2026-06-11 |
| Self-managed OAuth clients | **GA 2026-06-03** (8 days old at time of writing). Dash → Manage account → OAuth clients | developers.cloudflare.com/changelog/post/2026-06-03-public-oauth-clients/ |
| OAuth client visibility | Private by default (own-account testing works immediately); **public requires domain-verifying `getdreamforge.com`** — external lead time, start early | same |
| OAuth endpoints | `https://dash.cloudflare.com/oauth2/auth`, `/oauth2/token`, `/oauth2/userinfo`; OIDC discovery at `https://dash.cloudflare.com/.well-known/openid-configuration` | developers.cloudflare.com/fundamentals/oauth/ |
| Scope caveat | **AI Gateway Run permission is account-scoped** — a grant that can run one gateway can run every gateway in that account. Acceptable here because the account belongs to the end user | community feature request, open |
| Spend limits | Open beta 2026-06-05 — per-user dollar budgets via metadata; useful later | blog.cloudflare.com/ai-gateway-spend-limits/ |
| Native Anthropic endpoint | Unified REST API (2026-05-21) has `/ai/v1/messages` on `api.cloudflare.com` — **possible future fix for the Opus-can't-ride-/compat problem**, but NOT part of this port: user-gateway URLs in the ported code still end in `/compat`, so this port does not change provider compatibility | developers.cloudflare.com/ai-gateway/usage/rest-api/ |

### 2.2 Already in `main` (ported by PRs #35 "Phase E PR 10a" and #37 "PR 10c")

All verified byte-identical to upstream HEAD unless noted. **None of it is reachable at runtime.**

| Area | Files (fork) | Notes |
|---|---|---|
| OAuth flow | `worker/api/controllers/cloudflareConnect/controller.ts` (395 LoC: `initiateConnect`, `handleCallback`, account/gateway ingestion), `worker/services/oauth/cloudflare-connect.ts` (PKCE provider, `client_secret_basic`, gated on `ENABLE_CLOUDFLARE_LIMITS === 'true'`), `worker/services/oauth/base.ts` (S256 PKCE, `access_type=offline&prompt=consent`, refresh) | Endpoints: `GET /oauth/login` (authenticated, Sec-Fetch-Site CSRF check, open-redirect-safe `return_url`), `GET /auth/callback` (public; HMAC state + PKCE cookie are the auth) |
| Token transport | `worker/utils/oauthCookie.ts` (`__Host-cf_oauth_token` HttpOnly SameSite=Lax 30-day + 10-min `__cf_oauth_verifier`), `worker/utils/tokenEncryption.ts` (AES-GCM-256, PBKDF2 100k, per-record salt; blob = `{accessToken, refreshToken, expiresAt, userId}` — **userId-bound to block replay**), `worker/utils/stateSigning.ts` (HMAC-SHA256 state via HKDF from `CF_OAUTH_ENCRYPTION_KEY`, 10-min max age) | |
| Account/gateway storage | `worker/services/cloudflare/CloudflareAccountService.ts` (524 LoC: CF API v4 account list, gateway list/auto-create, `GET /accounts/{id}/ai-gateway-billing/credit_balance` cents→USD; D1 upserts; single-active-gateway selection) | D1 tables `cloudflare_accounts` + `ai_gateways` already exist in **prod** (migration `0005_cloudflare_accounts_gateways.sql`) |
| Usage/limits | `worker/services/rate-limit/usageChecker.ts` (**fork is ahead of upstream**: threads `ExecutionContext` for `ctx.waitUntil` on the credits-cache write — keep our version), `shared/constants/limits.ts` (`MINIMUM_CLOUDFLARE_BALANCE = $2.00`, `CREDITS_BANNER_THRESHOLD = $10`, `canProceedWithRequest`), `worker/api/controllers/limits/controller.ts` (also ahead — keep ours) | `checkUsageAndBalance`: feature-disabled → unlimited; decrypt/refresh token (refresh ≤5 min before expiry, emits `refreshedCookie`/`refreshedBlob`, clear-cookie on failure); 5-min TTL balance cache; then `canProceedWithRequest` |
| Routes | `worker/api/routes/cloudflareConnectRoutes.ts`, `cloudflareAccountRoutes.ts`, `limitsRoutes.ts` — **all registered** in `worker/api/routes/index.ts` (~L71–77) | `GET /api/cloudflare/accounts`, `PUT /api/cloudflare/selection`, `DELETE /api/cloudflare/connection`, `GET /api/limits/usage` |
| DO plumbing | `worker/agents/core/state.ts` (~L127–129: `cloudflareToken`, `wsOrigin`), `worker/agents/core/codingAgent.ts` (~L330–341: `onConnect` reads the cookie from `ctx.request` — the only moment cookies reach the DO), `worker/agents/core/codingAgentWebsocket.ts` (~L217–225: re-runs `checkUsageAndBalance` per `user_suggestion`; blocks with structured `USAGE_LIMIT_EXCEEDED` WS error) | `codingAgent` IS the live DO (binding flipped, commit `781c56f`) |
| Frontend (all orphans — built, never mounted) | `src/components/cloudflare-account-selector.tsx` (connect button → `/oauth/login?return_url=…`, account/gateway picker, disconnect), `credits-banner.tsx`, `usage-limits-badge.tsx`, `usage-limits-card.tsx`, `src/contexts/limits-context.tsx` (polls `/api/limits/usage`; **already mounted** in `src/App.tsx` ~L23), `src/hooks/use-limits.ts`, `src/utils/usage-limit-checker.tsx` (error→CTA mapping) | `src/lib/api-client.ts` (~L1143/1157/1169) already has the API calls |
| Types | `worker-secrets.d.ts` (~L75–82, L136–143): all 8 env vars typed optional — worker boots without them | |

### 2.3 Missing (the actual work, ~400–450 LoC)

1. **Routing carve-out — the flow is dead on arrival without it.** `worker/index.ts` (~L200–202)
   serves every non-`/api/*` path on the app domain from `env.ASSETS`, so `/oauth/login` and
   `/auth/callback` never reach Hono. Port upstream `worker/index.ts` ~L180–186:
   `if (pathname.startsWith('/oauth/') || pathname === '/auth/callback') → Hono app`, placed
   above the assets fallback in the main-domain branch. No SPA route collision (verified:
   nothing in `src/` uses `/auth/callback`).
2. **Inference wiring** (the real engineering). Fork `worker/agents/inferutils/config.types.ts`:
   `InferenceMetadata` (~L93) and `InferenceContext` (~L113) lack
   `shouldUseUserKey` / `userApiToken` / `userGateway`. `core.ts`: `buildGatewayUrl` (~L189) has
   no user-gateway branch (upstream ~L203–214: baseURL =
   `https://gateway.ai.cloudflare.com/v1/{accountId}/{gatewaySlug}` + `/compat` or
   `/{provider}`); `getConfigurationForModel` needs upstream's `useUserGateway` logic
   (~L315–380) **including suppressing the `cf-aig-authorization` wholesaling header in
   user-gateway mode**; `getApiKey` (post-#114 it returns `ResolvedApiKey { apiKey, keySource }`)
   needs the OAuth path inserted with precedence: runtime → **D1 BYOK provider key** → **CF
   OAuth token via `getAccessTokenFromBlob`** → platform env. Add a `keySource: 'cf-gateway'`
   variant; it is user-funded, so it joins `'byok'` in the rate-limit exemption in `infer()`.
   `worker/agents/behaviors/base.ts` `getInferenceContext` (~L2282 — the omission is documented
   in a comment there) must pass `state.cloudflareToken` as `userApiToken` (upstream pattern
   ~L342–364). **Hot spot:** the fork's `infer()` call-graph diverged during M3 — thread the new
   params through every `getConfigurationForModel` call site (includes
   `worker/services/aigateway-proxy/controller.ts`; decide deliberately whether deployed-app
   runtime traffic may spend the owner's Cloudflare credits — recommendation: NO for v1, build
   path only).
3. **Creation-path usage gate.** Fork `worker/api/controllers/agent/controller.ts` only calls
   `enforceAppCreationRateLimit` (~L67). Port upstream ~L129–200: `readTokenCookie` →
   `checkUsageAndBalance(env, user.id, request, userToken, undefined, ctx)` (fork's ctx-aware
   signature) → throw `UsageLimitExceededError` on block → `getUserGateway` →
   `effectiveUserToken = refreshedBlob ?? userToken` → persist
   `shouldUseUserKey`/`userGateway`/`userApiToken` into DO init args/state.
4. **UI mounting.** Mount `CloudflareAccountSelector` in `src/routes/settings/index.tsx`
   (fork page is 1834 lines, heavily diverged from upstream's — adapt placement; the component
   handles its own `?cloudflare=connected|error` callback params). `UsageLimitsBadge` into the
   fork's header. `CreditsBanner` needs a net-new host (fork has no `prompt-box.tsx`; home is
   custom). Map `USAGE_LIMIT_EXCEEDED` WS errors → connect CTA via the already-ported
   `usage-limit-checker.tsx` in `chat.tsx`.
5. **Configuration.** Nothing is set anywhere. Required env (all typed already):
   `CLOUDFLARE_OAUTH_CLIENT_ID`, `CLOUDFLARE_OAUTH_CLIENT_SECRET`, `CLOUDFLARE_OAUTH_AUTH_URL`,
   `CLOUDFLARE_OAUTH_TOKEN_URL`, `CLOUDFLARE_OAUTH_USERINFO_URL`, `CLOUDFLARE_OAUTH_SCOPES`,
   `CF_OAUTH_ENCRYPTION_KEY` (≥32 chars random — generate fresh, do NOT reuse
   `SECRETS_ENCRYPTION_KEY`), and the master switch `ENABLE_CLOUDFLARE_LIMITS`.
   Set worker secrets via `wrangler secret put` (the deploy workflow does NOT manage secrets).
   Register the OAuth client: Dash → Manage account → OAuth clients; redirect URI
   `https://app.getdreamforge.com/auth/callback`; scopes for account read + AI Gateway
   read/write/run + AI Gateway billing read (scopes mirror API-token permission groups).

## 3. PR slicing (one PR per slice, strict flow, atomic-green each)

| PR | Content | Size | Risk |
|---|---|---|---|
| A | Routing carve-out + env var plumbing + OAuth client registration (non-code). `ENABLE_CLOUDFLARE_LIMITS` stays unset → everything stays dark | ~25 LoC | low |
| B | Inference wiring (`InferenceContext`, `buildGatewayUrl`, `getConfigurationForModel`, `getApiKey` precedence, `behaviors/base.ts`) | ~150–200 LoC | **highest** — M3-diverged call-graph |
| C | Agent-creation usage gate + DO state persistence | ~80 LoC | medium |
| D | UI mounting + flip `ENABLE_CLOUDFLARE_LIMITS=true` in prod LAST, after E2E with a real connected account | ~100–150 LoC | medium (rollout) |

Estimated total: **5–7 dev-days.** Gate every PR: `npm run typecheck`, `npm run lint`,
`npm run test` (baseline after #114: **201 passed / 1 skipped**, 2 pre-existing BYOP file
failures acceptable), `node_modules/.bin/vite build` when frontend touched.

## 4. Risks and traps (each one cost someone real time — do not skip)

1. **`ENABLE_CLOUDFLARE_LIMITS` is a double-edged switch.** It enables the connect flow AND
   turns on free-tier limit enforcement for **every** user (`usageChecker.ts` short-circuits to
   unlimited when disabled). Before flipping: review `worker/services/rate-limit/config.ts`
   defaults (upstream ships `excludeCloudflareConnected: false`) and set deliberate free-tier
   numbers, or all existing users instantly inherit default caps.
2. **Cookie→DO transport is untested in prod.** `codingAgent.onConnect` cookie capture has never
   run live. If the WS upgrade ever moves cross-origin or the `__Host-` cookie doesn't ride,
   BYOK silently degrades to platform keys (`getApiKey` falls through with only a log line) —
   **a silent cost leak, not an outage.** Add explicit telemetry/metric on the OAuth-token
   fallthrough path in PR B.
3. **Token-refresh ping-pong.** On the WS path, a corrupted/stale blob can't clear the browser
   cookie (only DO state), so the next connect restores the stale blob. Upstream tolerates this;
   add a sanity test, consider a rejected-blob marker in DO state.
4. **Balance-check fail-closed.** Credits API outage with an empty cache → `balance = null` →
   `hasMinimumBalance = false` → users over free limits are **blocked even with credits**.
   Consistent with our auth-limiter fail-closed posture, but expect support noise during
   Cloudflare billing-API incidents; consider surfacing a distinct error message.
5. **No credits-balance public API** — the dashboard one the ported service calls
   (`/ai-gateway-billing/credit_balance`) worked at port time but is not a documented public
   contract; wrap failures as "unknown", never crash on shape changes.
6. **Domain verification lead time.** The OAuth client must be public to serve arbitrary users;
   that requires verifying `getdreamforge.com`. Private mode works for own-account dev/staging
   E2E. Start verification when PR A lands.
7. **Unified billing is Beta.** Re-verify the 5% fee, provider list, and Beta status before PR D
   flips anything user-visible. If Cloudflare GA'd it, also re-check whether a balance API
   appeared (would let us improve UX from reactive to pre-flight).
8. **Do not regress PR #114 semantics** (live since 2026-06-11): D1 provider-key BYOK rate-limit
   exemption keys on `keySource === 'byok'`; AAD is `userId:secretType`; blob format `v1:`.
   The OAuth token path must not bypass `SecretsService` invariants — it never touches D1.

## 5. Pricing context (for product copy / user comms)

- Via user's Cloudflare credits: provider list price + 5% load fee
  (e.g. Claude Sonnet 4.6 $3/$15 per M tokens direct → ~$3.15/$15.75 effective).
- Via user's own provider key (already live): exact list price, no fee.
- AI Gateway itself: free, no per-request fees (logs quotas: 100k total free / 10M per gateway
  on Workers Paid).
- Sell it as: one Cloudflare bill, prepaid hard spend cap, no juggling provider keys — worth 5%
  for many users. Do NOT build "platform resells credits" — strictly worse than current setup.

## 6. Definition of done

A user with a Cloudflare account can: connect it from settings (OAuth, consent, redirect back);
see their account + auto-created/selected gateway; their builds route through
`gateway.ai.cloudflare.com/v1/{their-account}/{their-gateway}` authenticated by their OAuth
token (wholesaling header suppressed); platform LLM rate limits don't apply to those calls;
free-tier users see accurate usage in the badge and a connect CTA when they hit limits; balance
below $2 blocks with a clear message; disconnect works and falls back to D1-key BYOK or platform
keys; no OAuth token is ever written to D1 or logs.
