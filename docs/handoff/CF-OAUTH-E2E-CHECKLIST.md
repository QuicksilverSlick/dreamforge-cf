# Cloudflare OAuth Unified-Billing — E2E Validation Checklist

> **Status (2026-06-29): code-complete + deployed, fully INERT. This is the owner runbook for the
> one remaining step — validating the flow end-to-end and flipping `ENABLE_CLOUDFLARE_LIMITS`.**
> The whole feature is dark until the flag flips. Read Phase 0 before doing anything.

Companion to the port brief: [`CF-OAUTH-CREDITS-BYOK-PORT.md`](./CF-OAUTH-CREDITS-BYOK-PORT.md).

**Shipped PRs in this arc:** #182 (route carve-out), #184 (inference wiring + creation gate),
#185 (apiKey↔baseURL coupling, adversarially verified), #186 (UI mount + in-chat CTA),
#187 (positive-coupling test), #188 (creation-429 connect CTA).

---

## Ground truth (verified against the code)

- **Flag:** `env.ENABLE_CLOUDFLARE_LIMITS === 'true'` — `worker/services/rate-limit/usageChecker.ts:71`.
  Currently **unset** → `checkUsageAndBalance` short-circuits to *allowed / unlimited*, every UI
  surface is gated on `cloudflareConnectEnabled`, so the feature is invisible. Flipping it enables
  the connect flow **and** the free-tier caps **for every non-exempt user at once.**
- **Free-tier caps when on** (`worker/services/rate-limit/config.ts`):
  - LLM: **100 credits/hour**, **400/day**. Per-call cost: Gemini Pro = 4, Flash = 1, Flash-Lite = 0.
  - App creation: **10/hour**, **50/day**.
- **Routing decision** (`shared/constants/limits.ts` → `canProceedWithRequest`):
  | State | Result |
  |---|---|
  | within caps | platform key + platform gateway |
  | over caps, **no** connected token | **blocked → 429 → connect dialog** |
  | over caps, token, balance **≥ $2** | **routes to the user's gateway** (`cf-gateway`) |
  | over caps, token, balance **< $2** | blocked → "add credits" dialog |
  - `MINIMUM_CLOUDFLARE_BALANCE = $2`, credits banner shows below `$10`.
- **OAuth redirect** is `https://app.getdreamforge.com/auth/callback` → **the test must run on the
  prod domain.** Endpoints: `dash.cloudflare.com/oauth2/{auth,token,userinfo}`.
- **⚠️ Exempt accounts never exercise this.** `RATE_LIMIT_EXEMPT_USER_IDS` users bypass the LLM
  limiter (`worker/services/rate-limit/rateLimits.ts:321`) → always within limits → always platform,
  never their own gateway, never the connect prompt. The owner account
  (`russelledeming@gmail.com`) is exempt. **The routing test must use a non-exempt account.**

---

## Designated test account

**`remmons1976@gmail.com`** — the non-exempt account for the routing test.

- [ ] Confirm its user ID is **not** in `RATE_LIMIT_EXEMPT_USER_IDS` (if it is, it'll stay on the
  platform and the routing test is meaningless).
- [ ] It has its **own Cloudflare account** with an **AI Gateway** and **≥ $2 of AI Gateway credits**
  (unified-billing prepaid, beta). Below $2 it's blocked with "add credits," not routed.

---

## Phase 0 — Before you flip

- [ ] **Accept the caps as the public free tier.** Flipping applies `100 credits/hr` + `400/day` to
  every non-exempt user. To change them, edit `worker/services/rate-limit/config.ts`
  (`llmCalls` / `appCreation`) and deploy **before** flipping.
- [ ] **Stage the rollback** in a terminal so it's one keystroke away:
  ```powershell
  npx wrangler secret delete ENABLE_CLOUDFLARE_LIMITS   # instant disable
  ```
- [ ] **Open live logs** in a second terminal:
  ```powershell
  npx wrangler tail dreamforge-cf --format pretty
  ```
- [ ] Pick a **low-traffic window** (the flag caps everyone the moment it's on).

## Phase 1 — Flip the flag (reversible, no code change)

- [ ] ```powershell
  echo "true" | npx wrangler secret put ENABLE_CLOUDFLARE_LIMITS
  ```
  *(Or add `ENABLE_CLOUDFLARE_LIMITS="true"` to `.prod.vars` and `wrangler secret bulk .prod.vars`
  to keep it in the source of truth. `wrangler secret bulk` is additive, so it won't disturb the
  CF-OAuth secrets already set.)*
- [ ] `npx wrangler secret list` shows `ENABLE_CLOUDFLARE_LIMITS`. Hard-refresh the app.

## Phase 2 — Smoke (any account)

- [ ] `app.getdreamforge.com` loads (`200`), no console errors.
- [ ] The **Cloudflare badge** now renders in the header (it was `null` before).
- [ ] Settings shows the **Cloudflare AI Gateway** card.

## Phase 3 — Connect flow (test account, on prod domain)

- [ ] Log in as **`remmons1976@gmail.com`**. Click the header badge → `/oauth/login` → Cloudflare
  authorize screen → approve.
- [ ] Lands back on the app; badge flips to **Connected / shows balance** (the `__Host-` cookie was
  set by `/auth/callback`).
- [ ] Settings → Cloudflare card: select **account + gateway**, Save. Badge shows the gateway balance.

## Phase 4 — The routing test (the whole point)

- [ ] **Exhaust the platform free tier** as the test account: run builds until you cross
  `100 credits/hr` (a couple of full builds, or temporarily lower `llmCalls.limit` for speed).
- [ ] **Disconnected / before connecting:** the next **agent creation** shows the
  **"free limit exhausted → Connect Cloudflare"** dialog (PR #188); an in-chat follow-up shows the
  same (PR #186). ✅ connect CTA fires on both paths.
- [ ] **Connected + ≥ $2:** the next build proceeds, and `wrangler tail` shows
  **`Using user Cloudflare AI-Gateway OAuth token for provider:`** (`worker/agents/inferutils/core.ts:295`)
  → routing to the user's gateway. ✅
- [ ] 🚨 **Cost-leak guard:** you must **NOT** see
  `[CF-OAuth] shouldUseUserKey set but no usable user gateway+token` (`core.ts:307`). That warning
  means the cookie→DO transport is broken (the one prod-untested risk) → **roll back immediately**
  and capture the `wrangler tail` output.
- [ ] Open the test account's **Cloudflare AI Gateway dashboard**: request count rose + **credits
  decremented**. Cross-check the **platform** AI Gateway did **not** receive those over-tier requests.

## Phase 5 — UI surfaces

- [ ] Header badge shows live **$balance**; **CreditsBanner** appears above the chat composer when
  low/over tier.
- [ ] Settings card: View Gateway / Disconnect work; the `/settings?config_needed=true` deep-link
  scrolls to the card.
- [ ] **Token refresh:** tokens auto-refresh ~5 min before expiry (`usageChecker.ts:17`) — on a long
  session, confirm no mid-build re-auth.

## Phase 6 — Decision

- [ ] **All green** → leave the flag on. It's now the live free tier + connect flow. *(Optional: promote
  it from a secret to a committed `wrangler.jsonc` var for transparency.)*
- [ ] **Any red** (especially the leak warning) →
  `npx wrangler secret delete ENABLE_CLOUDFLARE_LIMITS`, confirm the badge disappears, and bring the
  `wrangler tail` output to triage.

---

## Known risks

- **Blast radius:** the flag caps *everyone* at once. Test short, in a low-traffic window, until the
  cap values are confirmed acceptable.
- **Balance API degrades gracefully:** if Cloudflare's credit-balance endpoint 403s, balance reads as
  "unknown" and falls back to last-known (won't masquerade as $0) — not a failure.
- **Cookie→DO transport** on the flipped `CodeGeneratorAgent` is the one path never exercised in prod;
  the leak-guard warning in Phase 4 is exactly how it surfaces.
- **Exempt accounts** (the owner) stay on the platform regardless — by design.
