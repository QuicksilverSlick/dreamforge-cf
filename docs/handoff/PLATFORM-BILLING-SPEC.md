# Dreamforge Platform Billing — Implementation Spec

**Status:** Draft for lead review (no code yet)
**Owner:** M3 dev lead
**Date:** 2026-06-30
**Scope:** Stripe-funded platform billing (subscription tiers + prepaid credit packs) as the primary paywall for Dreamforge, replacing "Bring Your Own Cloudflare" (CF-OAuth) as the primary path while keeping that shipped code as an optional advanced setting.

> This document folds together the research, design, and verification passes into one source of truth. Verification fixes are incorporated inline in the relevant sections (not appended). Where a fix changed a design decision, the **corrected** decision is stated as the spec and the original (rejected) approach is noted only where it clarifies intent.

---

## 0. FINAL LOCKED PARAMETERS (owner-approved 2026-07-02 — supersede all illustrative numbers below)

The §2 tier names/prices below were the *illustrative* pass. The **locked** commercial model is the two-lane EXPLORE/PRODUCE structure (see [`TRAINING-VS-CREDIT-MODEL.md`](./TRAINING-VS-CREDIT-MODEL.md) §5c/§5d + the master financial model). The §3–§9 architecture (per-org Billing DO, append-only ledger, Stripe integration, gate/inference wiring, security hardening) is unchanged — only the catalog numbers change.

### 0.1 EXPLORE lane (self-serve Sparks — competes with Lovable/Bolt)
| Tier | Price | Sparks/mo | Notes |
|---|---|---|---|
| **Free** | $0 | **150/mo** (non-rolling) **+ one-time 300-Spark welcome grant** at signup | welcome grant guarantees the first full build (~200 Sparks) is possible |
| **Starter** | $25/mo | **2,500** | |
| **Plus** | $50/mo | **6,000** | |

Margins are deliberately thin (Starter 11.3% / Plus 3.9% at 70% utilization); **the allowance IS the hard cap** (a 100%-burn user is slightly negative — accepted; breakage funds the lane). No validation friction anywhere in EXPLORE.

### 0.2 Spark action rates (the literal metering parameters; cost basis $0.01/Spark)
| Action | Sparks |
|---|---|
| Full build (generation + sandbox deploy) | **200** |
| Edit / iteration | **30** |
| Image generation | **65** |
| Deploy to production | **10** |
| Hosting | **included** (not Spark-metered in v1) |
| Premium/Opus build (once the native `/ai/v1/messages` route ships) | **450** |

### 0.3 PRODUCE lane (apply → hosted payment; NOT self-serve checkout)
| Tier | One-time onboarding | Monthly | Seats |
|---|---|---|---|
| **Solo** | $1,000 | $99/mo | 1 |
| **Team Studio** | $3,500 | $695/mo | ≤5 (pooled) |
| **Team Pro** | $7,500 | $1,800/mo | ≤10 (pooled) |
| **Enterprise** | $15,000 | $4,000/mo | custom |
| **Traction Sprint** (standalone SKU + step 1 of every PRODUCE build) | $750 one-time | — | — |

**Purchase flow (owner-specified):** apply → Zoom scoping call (Fathom-recorded) → an agent analyzes the transcript, recommends the plan, and auto-sends a **custom payment page + Stripe link** (Claude Agent SDK — built as a **separate later phase**). v1 code scope: **we host the payment flow/UI ourselves**, connected to the owner's **GrayMatter Stripe account** (payment-link/hosted-page based; no self-serve PRODUCE checkout).

### 0.4 Free-tier + ledger design refinement
The free tier is **also denominated in Sparks** (one unified balance per org): monthly `free_grant` (150, non-rolling, expires at period end) + one-time `welcome_grant` (300). This supersedes §6's "free tier stays on the DO rate-limit counters" for *metering* — the existing hourly/daily rate limits remain only as **abuse rails**, not the user-facing budget. Ledger entry kinds gain `free_grant` and `welcome_grant`.

### 0.5 Admin credit controls (new workstream, same build)
Superadmin-only (existing role system + audit log): grant / deduct / set Sparks for any **user, org, or team**, each mutation writing an `adjustment` ledger row (audited: actor, reason, delta) and updating the Billing DO. Surfaced in the existing `/admin` UI.

---

## 1. Executive Summary & Strategic Decision

### 1.1 What we are building

Dreamforge bills users for two real cost centers under **one friendly credit currency** ("Sparks"):

1. **Build inference** — the AI that turns a prompt into a webapp (our largest, most variable spend), and
2. **Hosting/deploy** — running the generated app on our Cloudflare account (Workers, Durable Objects, R2, Container build minutes).

Users buy access via **Stripe**: a small set of named monthly subscription tiers, each bundling a generous Spark allowance, with **prepaid Spark packs** as one-click overage top-ups. Money flows `user → Stripe → us`; usage (build + deploy) runs on **our** Cloudflare account and providers; the user sees **one balance** that pays for everything.

### 1.2 The strategic decision: platform billing, NOT Bring-Your-Own-Cloudflare

We already shipped a "Connect your own Cloudflare and pay Cloudflare directly" flow (CF-OAuth + Unified Billing, PRs #182–#194). We are **demoting** it to an optional advanced setting, not making it the paywall. Two documented, hard walls make BYO-Cloudflare unviable as the *primary* monetization path for a non-technical audience:

1. **The `Run`-permission / token wall for Unified Billing.** To spend a user's Cloudflare credits programmatically through AI Gateway, the gateway auth token must carry the **`Run`** permission ([authentication](https://developers.cloudflare.com/ai-gateway/configuration/authentication/)), and third-party inference is billed through **Unified Billing** on the account's prepaid credits ([unified-billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/)). Routing a non-technical user's build onto their own credits requires them to have correctly scoped a token and connected the right account — a developer task.

2. **The un-automatable prepaid-funding wall.** Unified Billing runs on **prepaid credits the user loads in the Cloudflare dashboard** ("Credits Available → Manage → Top-up credits → Confirm and pay", requires a payment method on file) ([unified-billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/)). There is **no programmatic top-up API** we can drive on the user's behalf — the user must leave Dreamforge, go to dash.cloudflare.com, and load credits manually. For a "dream builder" who wants to type a prompt and see a live app, this is a conversion-killing dead end. (Compounded by our own memory note that [dash.cloudflare.com never loads while its tab is hidden](#) — the funding step is fragile even for us.)

Platform billing removes both walls: the user pays us with a card via Stripe Checkout (fully automatable, in-product), and we fund the underlying Cloudflare/provider spend ourselves on infrastructure we already operate and have hardened.

A secondary cost argument reinforces this: build inference is our biggest line item, and Unified Billing applies a permanent **5% fee on every credit load** while passing provider rates through with no markup ([unified-billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/)) — so we'd forfeit our own negotiated provider volume discounts. We therefore keep build inference on our **own provider keys (BYOK in `vibesdk-gateway`)** and reserve Unified Billing only for narrow paths (the native-Anthropic Opus route and low-volume experimental providers).

### 1.3 Division of labor (the load-bearing architectural decision)

- **Stripe is the source of truth for MONEY** — invoices, payments, refunds, disputes, and the funding events that *credit* the balance ([Stripe credits blog](https://stripe.com/blog/introducing-credits-for-usage-based-billing)).
- **A Cloudflare-native real-time balance is the source of truth for ENTITLEMENT** — "can this org run this build right now?" answered in-Worker in milliseconds, never by a synchronous Stripe call. Stripe's meter/credit summaries are explicitly "for billing," not real-time gating ([buildmvpfast 2026](https://www.buildmvpfast.com/blog/stripe-metered-billing-implementation-guide-saas-2026)).
- The two are reconciled nightly, not trusted blindly against each other.

> **VERIFICATION FIX (CRITICAL — concurrency).** The original design made D1 `SUM(delta)` the real-time spend gate. D1/SQLite gives single-statement atomicity but **not** a read-balance-then-insert transaction, so concurrent builds (Pro "parallel builds", tool-call recursion, org-pooled balances) can each read a positive balance and each insert a consume row, driving the balance negative. **The authoritative real-time spend gate is therefore a per-org Durable Object** (mirroring the proven single-threaded `DORateLimitStore` check-and-decrement), with D1 as the async-mirrored append-only audit ledger and the money-reconciliation surface. See §4.2 and §6.3.

---

## 2. Pricing & Packaging

### 2.1 The model

A **hybrid**: named monthly tiers, each bundling a generous allowance of a single legible unit (**Spark**), plus **prepaid Spark packs** for overage. This is the shape the whole category has converged on (Lovable, Bolt, v0, Replit, Base44 are all "named tier + bundled credits + top-up/overage").

**Why this and not the alternatives:**
- **Not pure pay-as-you-go.** The category despises it; Replit's effort-based "you can't predict a task's cost before it runs" is the single most-cited negative ("the effort-based pricing casino" — [banani](https://www.banani.co/blog/replit-pricing)). For non-technical dream builders, **predictability beats accuracy**.
- **Not flat-unlimited.** Our largest cost is real, variable inference; flat-unlimited at $20 is impossible against Opus/Gemini-Pro-class spend.
- **One currency, two cost centers folded in.** Base44 productizes "message credits" vs "integration credits" as two meters ([base44 pricing](https://www.banani.co/blog/base44-pricing-and-credits)) — but a second meter is a legibility tax that scares beginners. We take Lovable's gentler posture: **a single Spark balance covers BOTH building and hosting** — "hosting feels free under your monthly grant; you only draw down when an app gets real traffic." The user sees *one* number, never a raw infra bill (the Firebase failure mode).

**Conversion framing:** the conversion event for a non-technical user is *seeing their own working app live on a real URL* ([Zapier](https://zapier.com/blog/best-ai-app-builder/)). Every tier leads with "it's already live at `your-app.app.getdreamforge.com`," and hosting is bundled so the magic never breaks on a billing wall.

### 2.2 What a Spark is, and the margin math

**1 Spark ≈ $0.0033 sell price inside a subscription bundle, against a true platform cost basis of roughly $0.01/Spark of delivered work**, sold at a blended ~2.4–2.8× markup. The user never sees dollars per action — they see "this build cost about 12 Sparks, you have 880 left." The ledger stores **integer Sparks**, never dollars and never tokens.

> **VERIFICATION FIX (LOW — "auditable cents" framing).** The flat per-model Spark charge (derived from `DEFAULT_RATE_INCREMENTS_FOR_MODELS`) diverges systematically from true per-call provider cost (a long-context Pro call and a trivial Pro call both cost the same Sparks). We therefore **drop the claim that 1 Spark is an auditable $0.01 of cost**. A Spark is a **margin-buffer UX number**; the *true* cost basis is monitored by the nightly reconciler against real Stripe/provider spend (§5.7). Pricing is **flat per-model**, not token-reconciled per call — we deliberately drop the per-call token reconcile (see §6.6) to avoid the durability and under-charge problems it introduced.

**Cost-to-Spark mapping** (per-model Spark cost = the existing `DEFAULT_RATE_INCREMENTS_FOR_MODELS` increment × a Spark factor, so the weighting the agent already computes becomes the Spark cost — no new estimation engine, no effort-based opacity):

| Real action | Cost driver | Sparks charged | Reuses |
|---|---|---|---|
| Light edit / chat (Gemini Flash-Lite) | `GEMINI_2_5_FLASH_LITE` = 0 increment | **1 Spark (floor)** | `DEFAULT_RATE_INCREMENTS_FOR_MODELS` |
| Standard build message (Gemini Flash) | 1 increment | **2 Sparks** | same table |
| Heavy build step (Gemini Pro / design role) | 4 increments | **8 Sparks** | same table |
| Premium reasoning (Opus via `/ai/v1/messages`) | passthrough +5% (Unified Billing route) | **20–40 Sparks** | Unified Billing route only |
| Deploy to production (Container build + first DO/R2 provision) | hosting compute | **5 Sparks** | new deploy hook |
| Live hosting draw-down (per 10k served requests beyond grant) | Workers/DO/R2 runtime | **2 Sparks / 10k req** | metered nightly |

> **VERIFICATION FIX (LOW — Flash-Lite floor).** The original table claimed "1 Spark" for Flash-Lite while citing the 0-increment source — internally inconsistent under `increment × sparkFactor` (which yields 0). **Resolution: Flash-Lite has a paid-consumption floor of 1 Spark.** Free-tier copy still says "light edits stay effectively free" because on the free tier Flash-Lite remains 0-increment against the DO counter; the 1-Spark floor applies **only to paid-balance consumption** so a tight Flash-Lite loop on a paid account can't burn uncharged provider cost. This special-case is documented in `BillingService` cost resolution (§6.3), overriding pure multiplication for Flash-Lite.

**Blended margin:** included-allowance Sparks sell at ~2.5× cost; **top-up packs sell at a richer ~3× margin** (the overage premium funds whales). Because hosting is folded into the same sink, a successful high-traffic app organically draws down Sparks and converts the user to a top-up — Lovable's "feels free until it's genuinely successful."

### 2.3 Free tier — "Try a Dream"

A tasting menu, not a meal — enough to feel the magic and get one small app live, then a wall at peak excitement, with a **daily-reset drip** (the Lovable/Base44/v0 habit loop).

- **120 Sparks / month**, dripped as **15 Sparks / day**.
- Hard safety rails unchanged: `llmCalls` (`limit: 100/hr`, `dailyLimit: 400`) and `appCreation` (`limit: 10/hr`, `dailyLimit: 50`) in `worker/services/rate-limit/config.ts` remain; the Spark drip is the user-facing budget in front of them via the `withinLimits` path.
- **1 live app** on a `*.app.getdreamforge.com` subdomain.
- Light edits (Flash-Lite, 0-increment on free) stay effectively free.
- **No credit card.** Frictionless first build is the conversion event.
- When the drip exhausts: "You're out of Sparks for today — they refill tomorrow, or upgrade to keep going." (BYO-Cloudflare appears only as the demoted advanced fallback, never the primary CTA.)

### 2.4 Paid tiers

Anchored to the category ladder ($16–25 entry / $40–60 mid / $80–200 power), **20% off annual**. Each tier is a Stripe Subscription bundling a monthly Spark grant; grant Sparks roll over **one extra month** (Bolt/Lovable pattern).

| Tier | Monthly (annual) | Monthly Sparks | Live apps | Highlights |
|---|---|---|---|---|
| **Builder** | $20 ($16/mo annual) | 6,000 | up to 5 | Full standard build path (Flash + Pro design roles); hosting draw-down covered by grant for small-app traffic; rollover 1mo; top-ups. |
| **Studio** *(conversion sweet spot)* | $50 ($40/mo annual) | 18,000 | unlimited | **Premium reasoning unlocked** (Opus via native `/ai/v1/messages`, charged at 20–40 Spark premium so +5% passthrough is recovered); higher hosting grant; BYOP GitHub import; priority queue; rollover 1mo. |
| **Pro** | $120 ($96/mo annual) | 50,000 | unlimited | Highest hosting grant; parallel builds; **org/team seat-sharing of the Spark pool** (org-level balance, §3.4); first custom domain free 1yr. |

### 2.5 Overage behavior — no surprise bills

When a tier's monthly Sparks run low: **prepaid top-up, not metered arrears** (we reject Cursor/Replit bill-in-arrears for this audience).

1. **At ~10% remaining** (reuse existing `CREDITS_BANNER_THRESHOLD = 10`), `CreditsBanner` warns "Running low on Sparks."
2. **At zero**, building pauses with a one-click **Spark Pack** purchase (Stripe one-time Checkout, `mode: payment`):
   - **2,000 Sparks — $10**
   - **5,000 Sparks — $22** (best value)
   - **15,000 Sparks — $60**
   - Top-up Sparks: richer ~3× margin, **last 12 months**, never expire monthly the way grant Sparks do.
3. **Optional auto-refill** (off by default, opt-in): "when I drop below 200 Sparks, auto-buy a 5,000 pack." The only place we touch the card without a click — and only after explicit opt-in.
4. **Hard stop, not silent overage.** No top-up + no auto-refill ⇒ builds pause cleanly. We **never** let balance go negative *to authorize spend*. (The sole legitimate negative-balance case is a refund/dispute clawback that exceeds remaining balance — see §8.1 — which hard-blocks building until cured.)

### 2.6 Deploy + hosting fold into one balance

- **One Spark balance covers build, deploy, hosting.** No separate "Cloud credit."
- On **Deploy**, ~5 Sparks are debited (new hook alongside the existing `DEPLOY` driving command).
- **Runtime hosting is metered nightly, not per-request** — a Cron Trigger tallies each app's Workers/DO/R2 usage and converts to Sparks (2 Sparks / 10k served requests beyond the tier grant). The grant is sized so a hobby/small app **never** draws down.
- The user only ever sees: "Your app served 14,000 visitors this month — that used 4 Sparks of hosting." Never a metered infra invoice.

---

## 3. Architecture Overview

### 3.1 Money flow

```
User ──card──▶ Stripe Checkout (mode: subscription | payment)
                    │
                    ├─ checkout.session.completed / invoice.paid (webhook, signed)
                    ▼
              Dreamforge worker (verify → dedup → 200 → ctx.waitUntil)
                    │
        ┌───────────┴───────────────┐
        ▼                           ▼
  D1 credit_ledger             per-org Billing DO
  (append-only audit)          (real-time balance + grant)
        │                           │
        └──────── reconciled nightly (Cron) ─────────┐
                                                      ▼
                                            Stripe = money truth
```

We pay Cloudflare and the AI providers ourselves, monthly, on our own account. Stripe collects from the user up front (subscriptions and prepaid packs); our COGS is paid in arrears to CF/providers. The Spark margin is the spread.

### 3.2 Usage flow (build + deploy on OUR account)

```
Build request ─▶ gate (checkUsageAndBalance, per request start)
                   │  precedence: flag-off ▸ exempt ▸ excludeCFconnected
                   │             ▸ free tier ▸ PAID balance ▸ BYO-CF ▸ block
                   ▼
            inference (core.ts) on PLATFORM keys + vibesdk-gateway
                   │  per-LLM-call: Billing DO atomic check-and-decrement
                   │  cf-aig-metadata{ user_id } → per-user spend backstop
                   ▼
            provider (our BYOK keys) ─▶ response
```

Paid users run on **our** platform gateway (`vibesdk-gateway`) and **our** provider keys (`shouldUseByok = false`), exactly like free-tier users — we are NOT routing them through their own Cloudflare. Only legacy opted-in BYO-Cloudflare users take the `cf-gateway` path (§7).

### 3.3 One balance

The org's Spark balance is the single sink for build inference, deploy, and nightly hosting metering. Real-time authority = per-org Billing Durable Object; audit/money authority = D1 ledger + Stripe. Build inference debits per LLM call; deploy debits at the deploy hook; hosting debits via nightly Cron.

### 3.4 Billing owner = the org (not the user)

> **VERIFICATION FIX (HIGH — billing-owner identity).** The three sub-designs disagreed on org-vs-user scope; the consume path keyed on `userId` while the ledger summed on `orgId`. **Resolution: the billing owner is the ORG.** Resolve `orgId` (the active org, validated membership — already in `InferenceMetadata.orgId`, Phase 2.2.1) at request start; make it **REQUIRED (non-optional) for any platform-funded inference**; key **all** balance reads, decrements, and idempotency on `orgId`. `userId` is carried on ledger rows as **provenance only**, never as the scope. If a platform-funded inference reaches the debit with no resolved `orgId`, **assert and hard-block** (do not let the `NOT NULL` constraint surface as a crash or a silently-skipped debit = free inference). The pricing wording "billed to `app.userId`" is corrected to **"billed to the app's owning org."** Personal-org-per-user (Phase 2) guarantees every user has exactly one org, so single-user accounts are unaffected; Pro team pools share one org balance.

---

## 4. Data Model

Add to `worker/database/schema.ts`. Conventions matched to the existing file: `text('id').primaryKey()` (UUID via `generateId()`), `integer({mode:'timestamp'}).default(sql\`CURRENT_TIMESTAMP\`)`, `integer({mode:'boolean'})`, `real` for USD, nullable `org_id` FK to `organizations` (schema.ts:208), per-table index object, snake_case columns. **Next migration is `0014`** (highest is `0013`).

### 4.1 Tables

```ts
const LEDGER_ENTRY_KINDS = [
    'subscription_grant',   // monthly tier allotment (recurring period grant)
    'subscription_upgrade', // mid-period upgrade delta (always-applied, distinct key)
    'topup_grant',          // one-time prepaid pack
    'promo_grant',          // manual / marketing credit
    'consume',              // build/deploy spend (delta < 0)
    'refund_clawback',      // charge.refunded -> remove credits (delta < 0, may go negative)
    'dispute_clawback',     // charge.dispute.created -> freeze/remove (delta < 0, may go negative)
    'dispute_reversal',     // dispute won -> restore (delta > 0)
    'expiry',               // monthly grant lapses (delta < 0)
    'adjustment',           // operator/reconciliation correction
] as const;

const SUBSCRIPTION_STATUSES = [
    'trialing', 'active', 'past_due', 'canceled',
    'unpaid', 'incomplete', 'incomplete_expired', 'paused',
] as const;

const LEDGER_LOT_KINDS = ['subscription', 'topup', 'promo'] as const; // for lot accounting (§8.5)

const CONSUME_STATUSES = ['settled'] as const; // see §6.6 — flat charge, no pending lifecycle
```

**`billing_customers`** — 1:1 with the billing-owner org. Maps tenant → Stripe Customer. Tokens/PANs never stored.

```ts
export const billingCustomers = sqliteTable('billing_customers', {
    id: text('id').primaryKey(),
    orgId: text('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }), // provenance/operator lookup only
    stripeCustomerId: text('stripe_customer_id').notNull(),
    email: text('email'),
    currency: text('currency').notNull().default('usd'),       // PINNED to usd for v1 (§8.7)
    delinquent: integer('delinquent', { mode: 'boolean' }).notNull().default(false),
    disputeFrozen: integer('dispute_frozen', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
    orgUnique: uniqueIndex('billing_customers_org_unique').on(t.orgId),
    stripeCustomerUnique: uniqueIndex('billing_customers_stripe_customer_unique').on(t.stripeCustomerId),
    userIdx: index('billing_customers_user_idx').on(t.userId),
}));
```

**`subscriptions`** — denormalized read cache mirror of the active Stripe Subscription. Status + period drive entitlement and the grant scheduler.

```ts
export const subscriptions = sqliteTable('subscriptions', {
    id: text('id').primaryKey(),
    orgId: text('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    billingCustomerId: text('billing_customer_id').notNull().references(() => billingCustomers.id, { onDelete: 'cascade' }),
    stripeSubscriptionId: text('stripe_subscription_id').notNull(),
    stripePriceId: text('stripe_price_id').notNull(),
    planKey: text('plan_key').notNull(),                       // server catalog key, decoupled from Stripe ids
    status: text('status', { enum: SUBSCRIPTION_STATUSES }).notNull(),
    monthlyCreditAllotment: integer('monthly_credit_allotment').notNull().default(0),
    cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: 'boolean' }).notNull().default(false),
    currentPeriodStart: integer('current_period_start', { mode: 'timestamp' }),
    currentPeriodEnd: integer('current_period_end', { mode: 'timestamp' }),
    canceledAt: integer('canceled_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
    stripeSubUnique: uniqueIndex('subscriptions_stripe_sub_unique').on(t.stripeSubscriptionId),
    orgIdx: index('subscriptions_org_idx').on(t.orgId),
    customerIdx: index('subscriptions_customer_idx').on(t.billingCustomerId),
    statusIdx: index('subscriptions_status_idx').on(t.status),
    periodEndIdx: index('subscriptions_period_end_idx').on(t.currentPeriodEnd),
}));
```

**`credit_ledger`** — APPEND-ONLY signed log. **Audit / money-reconciliation surface, NOT the concurrent real-time gate** (that is the Billing DO, §4.2). Balance for reconciliation = `SUM(delta) WHERE org_id = ?`. Rows only ever INSERTed (no UPDATE/DELETE). Lot fields added for expiry correctness (§8.5).

```ts
export const creditLedger = sqliteTable('credit_ledger', {
    id: text('id').primaryKey(),
    orgId: text('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }), // SCOPE
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),        // provenance only
    kind: text('kind', { enum: LEDGER_ENTRY_KINDS }).notNull(),
    delta: integer('delta').notNull(),                         // signed; grants > 0, consume/clawback/expiry < 0
    balanceAfter: integer('balance_after').notNull(),          // audit/debug snapshot; authoritative balance is the DO / live SUM

    // Exactly-once key. Funding: stripe event id (or canonical period key). Consume: `${orgId}:${agentId}:${callId}` (§6.5).
    idempotencyKey: text('idempotency_key').notNull(),

    // Lot accounting (§8.5): grant rows seed a lot; consume rows attribute to lot(s) drawn.
    lotKind: text('lot_kind', { enum: LEDGER_LOT_KINDS }),     // on grant rows
    drawsFromLotId: text('draws_from_lot_id'),                 // on consume rows (id of the grant lot)
    expiresAt: integer('expires_at', { mode: 'timestamp' }),   // on grant rows: lot expiry

    // Provenance links (nullable by kind).
    stripeEventId: text('stripe_event_id'),
    stripeInvoiceId: text('stripe_invoice_id'),
    stripeChargeId: text('stripe_charge_id'),
    stripeCreditGrantId: text('stripe_credit_grant_id'),
    subscriptionId: text('subscription_id').references(() => subscriptions.id, { onDelete: 'set null' }),
    agentId: text('agent_id'),                                 // build session for consume entries
    modelName: text('model_name'),                             // model that drove a consume
    reason: text('reason'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
    idempotencyUnique: uniqueIndex('credit_ledger_idempotency_unique').on(t.idempotencyKey),
    orgBalanceIdx: index('credit_ledger_org_balance_idx').on(t.orgId, t.delta),
    orgCreatedIdx: index('credit_ledger_org_created_idx').on(t.orgId, t.createdAt),
    kindIdx: index('credit_ledger_kind_idx').on(t.kind),
    stripeEventIdx: index('credit_ledger_stripe_event_idx').on(t.stripeEventId),
    lotIdx: index('credit_ledger_lot_idx').on(t.drawsFromLotId),
    expiresAtIdx: index('credit_ledger_expires_at_idx').on(t.expiresAt),
}));
```

**`stripe_webhook_events`** — dedup table for at-least-once Stripe delivery. Stripe `event.id` is the PK (UNIQUE single-processing).

```ts
export const stripeWebhookEvents = sqliteTable('stripe_webhook_events', {
    id: text('id').primaryKey(),                               // evt_… natural PK
    type: text('type').notNull(),
    apiVersion: text('api_version'),
    status: text('status', { enum: ['processed', 'ignored', 'failed'] }).notNull().default('processed'),
    payload: text('payload', { mode: 'json' }),
    error: text('error'),
    receivedAt: integer('received_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
    processedAt: integer('processed_at', { mode: 'timestamp' }),
}, (t) => ({
    typeIdx: index('stripe_webhook_events_type_idx').on(t.type),
    statusIdx: index('stripe_webhook_events_status_idx').on(t.status),
}));
```

**`users.use_own_cloudflare_credits`** — per-user BYO opt-in boolean (§7.3). Added as a column on `users` (or `users.preferences` JSON), **read via a direct D1 read**, NOT via `getUserConfigurableSettings`.

> **VERIFICATION FIX (HIGH — opt-in store).** The original demotion design read the opt-in from `getUserConfigurableSettings`, which is **KV-backed platform/security config**, not a per-user preference store — "add the column" is meaningless for a KV JSON blob. **Resolution:** add `use_own_cloudflare_credits` to the `users` table (migration 0014) and read it with a direct D1 read in `checkUsageAndBalance`.

### 4.2 Per-org Billing Durable Object (the real-time balance authority)

> **VERIFICATION FIX (CRITICAL).** Introduce a **`BillingBalanceDO`**, one instance per `orgId` (id = `billing:${orgId}`), mirroring `DORateLimitStore`'s single-threaded check-and-increment. It holds the authoritative live Spark balance and performs **atomic `tryDebit(cost) → { ok, balanceAfter }`** in one isolate: read balance, if `balance >= cost` decrement and return `ok:true`, else return `ok:false` **without** decrementing. This is the only thing that authorizes paid spend, and it fails closed. Grants (subscription/top-up/clawback) update the DO balance and append the audit row to D1.

- **DO is authoritative for the live number; D1 is the append-only audit trail and money-reconciliation surface.** Every DO mutation also appends a `credit_ledger` row (via `ctx.waitUntil` from the DO, or a transactional outbox the reconciler drains) so the audit log and lot accounting stay complete.
- **Alternative (documented, not chosen):** if we ever want D1 to be authoritative, the debit must be a single guarded statement — `INSERT INTO credit_ledger (...) SELECT ... WHERE (SELECT COALESCE(SUM(delta),0) FROM credit_ledger WHERE org_id=?) >= :cost` then check `changes()===1`, rejecting on 0. We prefer the DO because it reuses the proven free-tier mechanism and avoids a full-table SUM on every call.

---

## 5. Stripe Integration

### 5.1 Entity mapping

| Stripe object | Dreamforge meaning |
|---|---|
| **Product / Price** | One Product per tier + one per Spark pack; Prices (`price_builder_monthly`, `price_pack_5000`, …) pinned by **catalog key**, never client-supplied. Created once in dashboard/IaC. |
| **Customer** | One per billing-owner **org**; created idempotency-keyed on `orgId`. |
| **Checkout Session** | `mode: subscription` → tier; `mode: payment` → one-time Spark pack. Server-side price selection; `client_reference_id = orgId`. |
| **Subscription** | Active recurring tier; status drives entitlement. |
| **Credit Grant** (Stripe Billing Credits) | Optional Stripe-side mirror of prepaid balance for Stripe's own metered invoicing/reporting; **not** the real-time balance. Applies only to subscription line items on a metered price ([implementation guide](https://docs.stripe.com/billing/subscriptions/usage-based/billing-credits/implementation-guide)). |
| **Customer Portal Session** | Self-service payment method / plan change / cancel / invoices. |

### 5.2 Endpoints (Hono, app domain; 404'd on marketing)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/billing/checkout-session` | **org-admin** (`AuthConfig.orgAdminOnly`) | Body `{ intent: 'subscribe'\|'topup', planKey\|packKey }`. Server maps key → Stripe price from a server-side catalog; client amount/price **never** accepted. Sets `client_reference_id = orgId`, `customer`, `idempotencyKey`. **Rejects (403) if `billing_customers.disputeFrozen`** (§9.1-F8). Returns `{ url }`. |
| `POST` | `/api/billing/portal-session` | **org-admin** (`AuthConfig.orgAdminOnly`) | `billingPortal.sessions.create({ customer, return_url })`. 404 if org has no `billing_customers` row. The portal exposes invoices + the masked payment method and lets the user **cancel** — admin-only (§9.1-F1). |
| `GET` | `/api/billing/summary` | session JWT (member) | Read-only: `planKey`, subscription `status`, `currentPeriodEnd`, live Spark balance (from Billing DO). Drives `CreditsBanner` / `UsageLimitsBadge` / the gate. |
| `POST` | `/api/billing/webhook` | **Stripe signature only** | `constructEventAsync` + `createSubtleCryptoProvider`, raw body, per-endpoint signing secret. Verify → dedup → `200` fast → process via `ctx.waitUntil`. Mounted **before** any JSON body middleware; **must be explicitly skipped in the `app.ts` CSRF middleware AND excluded from the global API rate limiter** — neither has a path-exclusion hook today (§9.1-F2/F3). |

The two **mutating** endpoints (checkout, portal) require **org-admin** (`owner|admin` via the existing `AuthConfig.orgAdminOnly`, `routeAuth.ts:180`) — a `member` must not be able to charge the shared pool, cancel the plan, or view billing details (§9.1-F1). `summary` stays membership-level (read-only). All reject if the resolved org mismatches the caller's membership; customer/org resolution reuses the active-org logic in the org subsystem.

### 5.3 Webhook envelope (every event)

1. `constructEventAsync(rawBody, sig, SIGNING_SECRET, undefined, webCrypto)` — reject `400` on failure.
2. `INSERT INTO stripe_webhook_events(id, type, …) ON CONFLICT(id) DO NOTHING`; if `changes === 0` → already processed → return `200` immediately (dedup short-circuit) ([hooklistener idempotency](https://www.hooklistener.com/learn/webhook-idempotency-and-deduplication)).
3. Return `200`; do the work in `ctx.waitUntil(handle(event))`.
4. **Money-critical handlers re-fetch the authoritative object** from Stripe (thin-event discipline) rather than trusting the snapshot payload ([event destinations](https://docs.stripe.com/event-destinations)).
5. Every ledger/DO mutation uses a **deterministic idempotency key** → exactly-once even if dedup is bypassed.

### 5.4 Webhook handlers

| Event | Idempotent handler logic |
|---|---|
| **`checkout.session.completed`** | Branch on `mode`. **Resolve `orgId` from D1** (`billing_customers WHERE stripe_customer_id = session.customer`), **NOT** from the payload's `client_reference_id` (§9.1-F4) — reject + alert if they diverge; `client_reference_id` is trusted only to create the *first* `billing_customers` row, after asserting the creating user's active org. **`subscription`**: upsert `subscriptions` from re-fetched Subscription; **defer the credit grant** (don't grant on `incomplete`). **`payment`** (top-up): resolve `packKey` → Sparks from catalog; grant a **topup lot** (DO balance += credits; append `topup_grant` ledger row, `lotKind:'topup'`, `expiresAt = now+12mo`, key `event.id`). Create/extend the Stripe Credit Grant idempotency-keyed `event.id`. |
| **`customer.subscription.created`** | Re-fetch sub. Upsert `subscriptions` row. **Grant only when `status ∈ {active, trialing}`**. Trial allotment granted here with kind `subscription_grant`, key `trial_grant:${subId}:${currentPeriodStart}`. |
| **`customer.subscription.updated`** | Re-fetch sub; overwrite mirror. **Period rollover** → `subscription_grant` keyed `sub_grant:${subId}:${currentPeriodStart}` (the canonical key, §8.6). **Mid-period upgrade** → a DISTINCT `subscription_upgrade` row keyed `sub_change:${subId}:${event.id}`, always applied (never suppressed by the period key — §8.4). **Downgrade** → next-period-only policy (§8.4); no immediate clawback. |
| **`customer.subscription.deleted`** | Mirror `status='canceled'`, `canceledAt`. Revoke entitlement. Expire remaining monthly grant lot via `expiry` key `sub_expire:${subId}:${event.id}` (top-ups survive). |
| **`invoice.paid`** | Authoritative "money landed" for renewals. Re-fetch invoice + subscription. **Sole granter of paid-period grants** (§8.6): if `subscription.status='active'`, grant `subscription_grant` keyed `sub_grant:${subId}:${subscription.current_period_start}` (derived from the **subscription** object, never the invoice line period). Clear `delinquent`/`past_due`. **Guard:** never grant if re-fetched status is terminal (§8.8). |
| **`invoice.payment_failed`** | Set `subscriptions.status` (`past_due`/`unpaid`) from re-fetch; `billing_customers.delinquent=true`. No ledger mutation. Soft-suspend new builds at the gate; existing top-up balance still usable. Stripe Smart Retries handle dunning. |
| **`charge.refunded`** | Re-fetch charge; map charge → funding entry. Claw back the **full refunded Sparks** (clawback **may drive balance negative** — §8.1), `kind:'refund_clawback'`, key `refund:${chargeId}:${refundId}`. Void/expire the Stripe Credit Grant. Partial refund → proportional clawback. Freeze the org if `consumed > refundable-balance`. |
| **`charge.dispute.created`** | Set `billing_customers.disputeFrozen=true`; insert `dispute_clawback` of the full disputed amount (may go negative) keyed `dispute:${chargeId}:${disputeId}`. Gate hard-blocks builds while frozen. |
| **`charge.dispute.closed`** | **Won** → `dispute_reversal` (+) keyed `dispute_won:${disputeId}`, unfreeze. **Lost** → clawback stands; leave frozen until settled. |

**Consume path (not a webhook):** at inference time the Billing DO performs the atomic debit (§6); the audit `consume` row is appended to D1, keyed `${orgId}:${agentId}:${callId}` (§6.5). BYOK/cf-gateway calls never touch billing (user-funded).

### 5.5 Workers runtime specifics

`stripe-node` works natively on Workers (April 2026, [Cloudflare blog](https://blog.cloudflare.com/announcing-stripe-support-in-workers/)). Two mandatory configs:

```ts
const stripe = new Stripe(env.STRIPE_API_KEY, { httpClient: Stripe.createFetchHttpClient() });
// webhook verification — sync constructEvent does NOT work on workerd:
const webCrypto = Stripe.createSubtleCryptoProvider();
const body = await c.req.text();                 // RAW body, read exactly once
const event = await stripe.webhooks.constructEventAsync(body, sig, env.STRIPE_WEBHOOK_SECRET, undefined, webCrypto);
```

Keep the default 5-minute tolerance (replay protection). Mount the webhook route before JSON middleware (read body once — re-parsing breaks verification / "Body has already been used").

> **VERIFICATION FIX (HIGH — CSRF will 403 the webhook).** `app.ts`'s CSRF middleware runs on `'*'` and only skips WebSocket upgrades + GET/HEAD/OPTIONS — it has **no path-exclusion hook today**. So a raw `POST /api/billing/webhook` throws `CSRF_VIOLATION` *before* the Stripe signature is ever verified — the webhook is broken, not merely insecure. **Add an explicit `/api/billing/webhook` skip** mirroring the existing WebSocket escape hatch (or register the webhook handler before the CSRF `use('*')` in the chain), **and exclude the path from the global API rate limiter** so a legitimate Stripe burst is never 503'd into a retry storm (§9.1-F2/F3).

### 5.6 Idempotency & reconciliation discipline

- **Idempotency keys on every write to Stripe** (distinct from webhook dedup): `event.id` for webhook-driven writes (credit grants, voids); `${orgId}:${planKey}` / `${orgId}:${packKey}:${nonce}` for checkout creation ([idempotent requests](https://docs.stripe.com/api/idempotent_requests)).
- **Async processing:** verify → dedup-insert → `200` → `ctx.waitUntil(handle)`. A Queue or the Billing DO is available for heavier fan-out; `ctx.waitUntil` suffices at launch (build/deploy is coarse-grained).

### 5.7 Reconciliation (nightly Cron)

> **VERIFICATION FIX (MEDIUM — Cron does not exist yet).** `wrangler.jsonc` has **no `triggers.crons` block** and `worker/index.ts` exports only a `fetch` handler. **Wiring this Cron is a prerequisite, not a detail** — grant-expiry, funding-drift reconciliation, and hosting metering all hang off it. Add a `triggers.crons` entry to `wrangler.jsonc` and a `scheduled(controller, env, ctx)` method on the `worker` object **before** the `Sentry.withSentry` wrap (so Sentry instruments it).

`reconcileBilling()` (nightly):
1. **Subscription drift** — re-fetch each `subscriptions` row; overwrite mirror on diff; insert any missing period grant (keyed by period → safe). **Skip granting for terminal-status subscriptions** (§8.8).
2. **Funding drift** — sum D1 funding entries per org vs Stripe Credit Balance Transactions / paid-invoice totals; on drift beyond tolerance, Sentry alert + an `adjustment` row keyed `recon:${orgId}:${periodKey}`, **only ever toward the Stripe figure** (Stripe owns money) ([reporting & reconciliation](https://docs.stripe.com/plan-integration/get-started/reporting-reconciliation)).
3. **Grant expiry** — lapse expired **lots** (§8.5): insert `expiry` entries for the **unspent remainder** of each expired lot, keyed `expire:${lotLedgerId}`.
4. **Hosting metering** — tally each app's Workers/DO/R2 usage → Spark debit per org (§2.6).
5. **Orphan detection** — Stripe Customers/Subscriptions with no D1 mirror (and vice-versa) logged for operator review.
6. **Negative-balance audit** — flag orgs with negative balance (legit clawback case) for dunning; assert no org has >1 `subscription_grant` per `(subId, periodStart)` (§8.6 invariant check).

Reconciliation **never** edits/deletes ledger rows — every correction is an append.

---

## 6. Gate + Inference-Routing Integration

All line anchors verified against the live codebase.

### 6.1 Precedence (the design invariant)

```
1. ENABLE_CLOUDFLARE_LIMITS off            → allow, unlimited        (unchanged short-circuit, usageChecker.ts:86-96)
2. exempt user (isExemptUser)              → allow, no decrement     (unchanged, rateLimits.ts:213-217,321)
3. excludeCloudflareConnected + BYO opt-in → allow, unlimited        (gated on opt-in now, usageChecker.ts:140-155)
4. within free caps (remaining > 0)        → allow on PLATFORM, no paid decrement
5. BYO-CF opted-in + token + ≥$2 balance   → allow on USER gateway (shouldUseByok=true)   [demoted, §7]
6. PAID balance active (sub or Sparks > 0) → allow on PLATFORM (shouldUseByok=false), DO debits   ← NEW
7. else                                    → block / Stripe upsell
```

> Note the ordering choice (§7.3): **BYO (rule 5) is checked before platform billing (rule 6)** only when the user has **explicitly opted in** to BYO; otherwise platform billing is the default for any over-free-tier request. Connecting Cloudflare no longer auto-routes builds.

### 6.2 Routing table — `shared/constants/limits.ts:47-79`

`canProceedWithRequest()` today takes `{ withinLimits, hasUserToken, balance }`. Extend the input:

```ts
canProceedWithRequest({
  withinLimits,
  hasUserToken,
  balance,
  useOwnCloudflareCredits,   // NEW — per-user BYO opt-in (rule 5)
  hasPaidBalance,            // NEW — active Stripe sub OR Sparks > 0 (rule 6)
}): CanProceedResult
```

Decision order after `withinLimits === false` (insert between the current line 57 and line 60):
- **`useOwnCloudflareCredits && hasUserToken && hasMinimumBalance(balance)`** → `{ allowed:true, shouldUseByok:true }` (BYO opted-in & funded).
- **Else if `hasPaidBalance`** → `{ allowed:true, shouldUseByok:false }` (**platform billing — new default**; `shouldUseByok:false` is load-bearing, keeps inference on the platform path).
- **Else if `useOwnCloudflareCredits && hasUserToken && !hasMinimumBalance(balance)`** → `{ allowed:false, reason: INSUFFICIENT_BALANCE, shouldUseByok:true }`.
- **Else** → `{ allowed:false, reason: PAID_BALANCE_EXHAUSTED, shouldUseByok:false }` (show Stripe upgrade, not Connect-Cloudflare).

Add `PAID_BALANCE_EXHAUSTED` to `LIMIT_ERROR_MESSAGES` (limits.ts:21-26). `CanProceedResult` (limits.ts:41-45) needs no new field.

### 6.3 Resolve entitlement at the one chokepoint — `worker/services/rate-limit/usageChecker.ts:157-168`

`checkUsageAndBalance` is the single chokepoint all gates funnel through (agent controller `:89`, WS pre-send `codingAgentWebsocket.ts:617`, usage endpoint `limits/controller.ts:36`). Resolve paid status here once:

- Preserve the disabled short-circuit (`:86-96`) and the `excludeCloudflareConnected` bypass (`:140-155`, now additionally gated on the BYO opt-in).
- **After** `getRemainingCredits` (`:158-161`) and **before** `canProceedWithRequest` (`:164`), add — **guarded behind `!withinLimits`** so free-tier requests never hit billing:
  ```ts
  const paid = withinLimits ? { hasPaidBalance: false }
             : await BillingService.getEntitlement(env, orgId);   // orgId, not userId (§3.4)
  ```
  `getEntitlement(env, orgId)` returns `{ hasPaidBalance, subscriptionActive, creditsRemaining }` from the Billing DO + `subscriptions` mirror. **Early-return `{ hasPaidBalance:false }` when `isExemptUser`** (exemption preserved — exempt users are inside the free tier, so the lookup is never reached anyway, but assert it).
- Thread `hasPaidBalance` + `useOwnCloudflareCredits` (direct D1 read of `users.use_own_cloudflare_credits`) into the `canProceedWithRequest` call.
- Extend `UsageCheckResult` (`:24-44`, `:170-183`) with `hasPaidBalance: boolean` and `paidCreditsRemaining?: number` so the usage endpoint and banner render without a second round-trip.

> **VERIFICATION FIX (LOW — WS gate has no `ctx`).** Entitlement resolution here is a **pure read** (the actual debit is at inference time, §6.4), so the WS pre-send gate calling `checkUsageAndBalance` without `ctx` (`codingAgentWebsocket.ts:617`) is benign. **Invariant:** keep the gate read-only; if any write is ever added at the gate, thread `ctx` into the WS handler and wrap in `ctx.waitUntil`.

### 6.4 Debit at consumption — `worker/agents/inferutils/core.ts:589-596`

Decrement where credits are actually consumed (per inference call), not at the gate. Today `:593-595` enforces the free-tier DO counter only when `keySource !== 'byok' && keySource !== 'cf-gateway'`. Restructure to branch on free-vs-paid via the **Billing DO atomic debit**:

```ts
if (keySource !== 'byok' && keySource !== 'cf-gateway') {
    const cost = sparkCostForModel(modelName);                 // reuses DEFAULT_RATE_INCREMENTS_FOR_MODELS; Flash-Lite floor=1 (§2.2)
    const charged = await BillingService.tryDebitPaid(env, orgId, cost, { agentId: metadata.agentId, callId, modelName });
    if (!charged.fromPaidBalance) {
        await RateLimitService.enforceLLMCallsRateLimit(env, userConfig.security.rateLimit, metadata.userId, modelName);
    } else if (!charged.ok) {
        throw new RateLimitExceededError(RateLimitType.LLM_CALLS);  // paid balance hit zero mid-build → graceful stop
    }
}
```

`tryDebitPaid` semantics: (a) exempt → no-op `{fromPaidBalance:false}`, free path runs (itself a no-op via `:321`); (b) within free caps → `{fromPaidBalance:false}`, free DO counter increments as today; (c) over free caps AND org has paid balance → **Billing DO atomic check-and-decrement** (§4.2), `{fromPaidBalance:true, ok}`. This preserves today's behavior exactly for free/BYOK/cf-gateway and diverts only paid calls. **Re-validate `orgId` at the debit site (§9.1-F5):** assert `orgId === ` the JWT-verified authenticated active org (not merely non-null) — the gate (`usageChecker.ts`) and the debit (`core.ts`) run in different code paths, so the debit must not trust a possibly-mutated `metadata.orgId`; a mismatch hard-blocks. **Tool-call recursion** (`:868-874`, `:889-894`) re-enters this block, so each follow-up LLM round-trip re-debits — the paid analogue of the existing gateway-continuity guarantee.

**Apps proxy unchanged:** `aigateway-proxy/controller.ts:152-154` stays free-only (runtime app inference is not a paid build).

> **VERIFICATION FIX (MEDIUM — image-generation cost leak).** `worker/agents/inferutils/imageGeneration.ts` is a wholly separate path: it `fetch()`es the gateway directly with the platform `cf-aig-authorization` token, never calls `getConfigurationForModel`/`enforceLLMCallsRateLimit`, and stamps **no** `cf-aig-metadata` user_id — so image generations (real, non-trivial cost: OpenAI images, Nano Banana Pro) are invisible to both the Spark ledger AND the per-user spend backstop. **Resolution: wire it in** — stamp `cf-aig-metadata { user_id }` on the image `fetch()` calls (so the §6.7 backstop applies) and add a per-image Spark debit through the Billing DO at the image call site. (If the lead prefers, the alternative is to explicitly scope image cost out of Sparks and cap it separately — but it must not be left silently uncovered.)

### 6.5 Per-call idempotency key

> **VERIFICATION FIX (HIGH — non-existent `requestId`).** The original `${agentId}:${requestId}` key references a `requestId` that **does not exist** anywhere in the inference path; `actionKey`/`schemaName` are not unique per call (`executeInference` retries up to 5× and tool-call recursion re-enters `infer()` repeatedly with the same `actionKey`). **Resolution:** generate a real `callId = generateId()` at the top of `infer()`, **outside the retry loop body** (so true network retries of the *same* attempt do NOT double-charge, but distinct tool-depth calls do), thread it into the debit, and key the audit `consume` row `${orgId}:${agentId}:${callId}`. The DO debit is the authority; the D1 audit row's idempotency key prevents duplicate audit entries on retry.
>
> **Cross-tenant collision guard (§9.1-F6):** the `credit_ledger.idempotency_key` UNIQUE index is global, and the key embeds the user-controlled `agentId`. Confirm `generateId()` yields ≥128 bits (UUID-v4-class) entropy, and on an INSERT conflict **verify the existing row's `org_id` matches the current org before treating it as "already processed"** — a cross-org collision must NOT silently skip a debit (that's free inference); treat it as a fraud signal and alert.

### 6.6 No per-call token reconcile (flat charge is final)

> **VERIFICATION FIX (HIGH — pre-charge/reconcile durability).** The original design pre-charged a flat estimate, then reconciled against actual `response.usage` post-call — but on Workers an isolate eviction / socket drop between debit and reconcile leaves the compensating entry un-run (silent loss or under-charge), and the schema had no `pending`/`settled` status to find unreconciled charges for a sweep. **Resolution: drop the per-call token reconcile entirely.** The flat per-model Spark charge (§2.2) is **final** — simpler, avoids the under-charge-on-abandon case, and matches how the free DO counter already works. The Billing DO debit is atomic and durable; there is no pending lifecycle. (The flat-vs-true cost gap is absorbed into margin and monitored by the nightly reconciler against real Stripe/provider spend, §5.7.) The `consume` row carries `modelName` for analytics but is `settled` on insert.
>
> **Failed-call refund:** if the provider call throws *after* the debit, anchor a refund to the existing catch at `core.ts:710-716` — the Billing DO credits the cost back atomically (keyed off `callId` so it's idempotent). Because this is a single DO operation (not a cross-isolate reconcile), it survives the request as a `ctx.waitUntil`-wrapped DO call; the nightly Cron additionally sweeps any orphaned debit (consume row with no matching response marker older than N minutes) as defense-in-depth.

### 6.7 Per-user spend-limit backstop (`vibesdk-gateway`)

Paid users keep `shouldUseByok=false` → existing coupling routes them to `env.CLOUDFLARE_AI_GATEWAY` (`vibesdk-gateway`) on platform keys (`getConfigurationForModel:382`). Two surgical additions in `core.ts:699-708`:

- The `cf-aig-metadata` header already carries `userId` (`:703`). **Add `user_id: metadata.userId`** (documented spend-limit convention; [custom-metadata](https://developers.cloudflare.com/ai-gateway/observability/custom-metadata/)) — but **mind the 5-entry cap**: current entries are `chatId, userId, schemaName, actionKey` = 4; adding `user_id` makes 5. If a `paid` boolean is also wanted for analytics, **drop `actionKey`** (it duplicates `schemaName` here) to stay ≤5.
- **Gateway config (not code), on `vibesdk-gateway`** (`wrangler.jsonc` ~line 56): one spend-limit rule, dimension `metadata.user_id` = **split by value** → every user gets an independent `$X/day` rolling bucket from one rule (well under the 20-rule ceiling). Enforcement "Block requests" → **429**, which the existing handler at `core.ts:710-716` already maps to `RateLimitExceededError(LLM_CALLS)` — graceful, no new code. Spend limits are **eventually consistent** ("a burst of concurrent requests can briefly exceed the limit"), which is exactly why the **Billing DO is the primary real-time cap** and this is defense-in-depth ([spend-limits](https://developers.cloudflare.com/ai-gateway/features/spend-limits/)). Works on our BYOK keys (known-pricing models) — no Unified Billing required.

### 6.8 Native-Anthropic Opus route (deferred, separate initiative)

The REST `/ai/v1/messages` path (fixing the `/compat` `response_format`-drop bug for Opus) is a **separate** workstream. Paid build inference flows through the existing OpenAI-compat client (`core.ts:602`) on `vibesdk-gateway`. When the native path lands, it inherits the same `cf-aig-metadata` user_id stamping. The Studio-tier Opus premium (20–40 Sparks) is recovered via the flat per-model charge regardless of which backend serves it.

---

## 7. CF-OAuth Demotion Plan (keep the shipped code)

### 7.1 Objective & invariants

Stripe becomes the primary paywall; the shipped CF-OAuth "use your own Cloudflare credits" path is **retained, repositioned** as an opt-in *Advanced* setting for technical users.

**Hard invariants:**
- **No shipped code is deleted** — all four UI components, `worker/services/oauth/cloudflare-connect.ts`, the `cloudflare_accounts` / `ai_gateways` tables, and the `keySource === 'cf-gateway'` routing (`core.ts:291-301`) stay intact.
- The self-deploy short-circuit (`isCloudflareGatewayLimitsEnabled`, `usageChecker.ts:70-72`, `:86-96`) is untouched.
- The `cf-gateway` coupling safety reviews (B1/B2/B3) are not disturbed — only the *gating decision* changes, not the routing mechanics.

### 7.2 Flag split — decouple "limits exist" from "CF-OAuth is the paywall"

Today one flag (`ENABLE_CLOUDFLARE_LIMITS`) does two jobs. Split:

| Flag | New meaning |
|---|---|
| `ENABLE_CLOUDFLARE_LIMITS` | Platform usage limits enforced (Stripe primary paywall wired here) |
| `ENABLE_CLOUDFLARE_BYO_CREDITS` *(new)* | CF-OAuth "use your own credits" advanced path is offered |

- Add `isCloudflareByoCreditsEnabled(env)` (`= env.ENABLE_CLOUDFLARE_BYO_CREDITS === 'true'`) alongside `isCloudflareGatewayLimitsEnabled` (`usageChecker.ts:70-72`).
- In `limits/controller.ts:48-92`: **redefine** `cloudflareConnectEnabled` to `isCloudflareByoCreditsEnabled(env)` (its consumers already mean "show the CF-OAuth surface" = the BYO advanced setting), and add `platformBillingEnabled: isCloudflareGatewayLimitsEnabled(env)`. Type both through the frontend `UsageSummary` shape.
- A new flag (not reusing the old) is required because the gating/routing decisions must keep working for self-hosted instances where `ENABLE_CLOUDFLARE_LIMITS` is off; folding "is BYO offered" into the limits flag would force BYO on for every limited deployment — the exact coupling we're removing.

### 7.3 Per-user opt-in

Connecting Cloudflare must **not** auto-route builds. Add `users.use_own_cloudflare_credits` (boolean, migration 0014; **direct D1 read** in `checkUsageAndBalance`, NOT `getUserConfigurableSettings` — see §4.1 fix). BYO routing (rule 5) requires **all** of: opt-in true, `hasUserToken`, `hasCloudflareConfigured` (`usageChecker.ts:139`), `hasMinimumBalance(balance)` (`limits.ts:69`). Additionally gate the `excludeCloudflareConnected` bypass (`usageChecker.ts:140`) on the opt-in so a connected-but-platform-billed user still consumes free then platform Sparks. **This gating MUST land in PR 4 (the gate PR), not deferred to PR 5 (§9.1-F7)** — otherwise, in the window between PR 4 and PR 5, any CF-connected user with `excludeCloudflareConnected` bypasses both the free counter and platform billing entirely (unlimited free inference).

### 7.4 Where the four UI components move

1. **`UsageLimitsBadge`** (`src/components/usage-limits-badge.tsx`, header `:101`) — remove the "Connect" CTA (`:144`) from the header; replace with the **platform plan/upgrade** entry. Show gateway balance only when `useOwnCloudflareCredits` is true.
2. **`CreditsBanner`** (`src/components/credits-banner.tsx`, chat `:840-846`) — repoint the inline "Connect" CTA (`:227-235`) to the **platform upgrade flow**. Change the chat mount condition (`chat.tsx:840`) from `cloudflareConnectEnabled` to the platform-billing surface flag. Keep connected-balance content only when opted in.
3. **`CloudflareAccountSelector`** (`src/components/cloudflare-account-selector.tsx`, settings `:550-553`) — **the new home of the entire BYO feature.** Wrap in a collapsible **"Advanced"** section *below* the new platform Billing/Plan section; keep gated on `cloudflareConnectEnabled` (= `ENABLE_CLOUDFLARE_BYO_CREDITS`). Add the **"Use my own Cloudflare credits" opt-in toggle** at the top (flips rule 5).
4. **Chat Connect CTA dialog** (`src/utils/usage-limit-checker.tsx:243-290`, `chat.tsx:260-271,838`) — replace the default exhausted-tier dialog with an **upgrade-to-platform** dialog. Retain `createInsufficientBalanceDialog` etc. but only for users already on the BYO path. Update `getBackendLimitDialog` branch order (`:256-289`) to mirror precedence: `useOwnCloudflareCredits` → existing CF dialogs; else → platform upgrade dialog.

### 7.5 Copy — signal "for technical users"

- Settings header: *"Advanced — Use your own Cloudflare credits. Already run your own Cloudflare AI Gateway? Route builds through your own account and pay Cloudflare directly. Most builders don't need this — your Dreamforge plan already covers it."*
- Opt-in toggle: *"Bill builds to my Cloudflare account — when on and funded, builds use your Cloudflare credits instead of your Dreamforge plan."*
- Everywhere the old "Connect Cloudflare" CTA lived → plan-first language: *"Upgrade your plan"* / *"You're out of build credits — upgrade to keep building."*
- Never surface a raw metered Cloudflare bill/balance to non-opted users (Firebase failure mode).

### 7.6 Backward-compat (must not miss)

**Any user currently connected + routing through their gateway must be backfilled to `use_own_cloudflare_credits = true`** in migration 0014, so the demotion doesn't silently move their builds onto (unpaid) platform billing. This is the one data-correctness gate that cannot be skipped.

---

## 8. Edge Cases & How They're Handled

These are the verification-pass findings, folded in as the spec's correctness contract.

### 8.1 Refunds / chargebacks of already-spent credits (HIGH)

The naive clamp `delta = -min(refundedCredits, currentBalance)` lets refund-after-spend be free inference (buy a $60 / 15,000-Spark pack, spend 14,000, refund → only 1,000 clawed). **Resolution:** the clawback **drives balance negative by the full refunded/disputed amount** (the append-only signed ledger permits a negative SUM; the "never negative" rule applies to *spend authorization*, not clawbacks). A negative balance then **hard-blocks all building until cured** (the legitimate negative-balance case). Couple with: **freeze the org** on dispute (and on a refund where `consumed > refundable-balance`); require settlement before new builds; add a **spend-velocity check** that delays large new top-ups' spendability or flags accounts that refund after heavy consumption. Disputes additionally cost a ~$15 Stripe fee — freezing limits further loss. **The freeze also blocks new top-up Checkout** (`/api/billing/checkout-session` returns 403 while `disputeFrozen`, §9.1-F8) so a frozen org cannot self-cure a negative balance by buying more Sparks before the dispute closes; only `charge.dispute.closed` (won) lifts the freeze.

### 8.2 Concurrent-build double-spend (CRITICAL)

Covered in §1.3 / §4.2 / §6.4: the **per-org Billing DO** does atomic check-and-decrement in one isolate and **fails closed** before the provider call. D1 `SUM(delta)` is the audit/reconciliation surface, never the concurrent gate. This protects exactly the high-value Pro/parallel/org-pooled accounts that the naive D1-SUM design lost money on.

### 8.3 Pre-charge / reconcile durability (HIGH)

Covered in §6.6: the per-call token reconcile is **dropped**; the flat per-model charge is final and atomic via the DO. Failed-call refund is a single idempotent DO operation anchored to the existing catch (`core.ts:710-716`), with a nightly-Cron sweep as defense-in-depth — no fragile cross-isolate compensation.

### 8.4 Upgrades / downgrades & proration (MEDIUM)

- **Upgrade mid-period:** the upgrade allotment delta is a **DISTINCT `subscription_upgrade` ledger row** keyed `sub_change:${subId}:${event.id}`, **always applied** — never suppressed by the period-grant key (which would otherwise block the larger allotment until next period if Stripe doesn't reset `currentPeriodStart`).
- **Downgrade:** **next-period-only** (no immediate clawback) — cleaner, matches most SaaS, and avoids clawing already-spent Sparks. The user keeps the current period's allotment; the smaller allotment applies at the next period grant.
- Verify against Stripe whether the chosen `proration_behavior` resets `currentPeriodStart`, and pin the period key accordingly (§8.6).

### 8.5 Credit expiry ordering / lot accounting (MEDIUM)

A flat fungible `SUM(delta)` cannot honor "grant Sparks roll over 1 month, top-ups last 12 months" — spend can't be attributed to the right lot. **Resolution: track credit lots.** Each grant seeds a lot (`lotKind`, `expiresAt`); consume rows record `drawsFromLotId`; consumption draws **FIFO by expiry (soonest-first)** — maximizing user value and making expiry deterministic. Expiry lapses only the **unspent remainder** of an expired lot. The Billing DO holds per-lot remaining for the live path; the D1 ledger's `drawsFromLotId` makes it auditable and lets the reconciler recompute.

### 8.6 Free→paid first-period double-grant (MEDIUM)

Three handlers could fund the first period; convergence relied on `currentPeriodStart` being byte-identical across the subscription object and the invoice line period (they can differ by trials/anchor → double-grant). **Resolution:** derive the period-grant key from a **single canonical source — the subscription's `current_period_start` re-fetched fresh in every handler** (never the invoice line period). **Role split:** `invoice.paid` is the **sole granter of paid periods**; `customer.subscription.created`/trialing is the **sole granter of the trial allotment** (distinct kind `trial_grant:` so it can't collide). Reconciler asserts ≤1 `subscription_grant` per `(subId, periodStart)`.

### 8.7 Spark↔cost rounding & currency (LOW)

Flat per-model Sparks diverge from true per-call cost — accepted as a **margin-buffer UX number** monitored by the nightly reconciler (§2.2 fix). **Currency is PINNED to USD for v1** — assert/reject non-USD prices at checkout creation (`billing_customers.currency` defaults `'usd'`; no FX handling until designed). Flash-Lite has a **1-Spark paid floor** (§2.2) so a Flash-Lite loop can't burn uncharged provider cost.

### 8.8 Webhook out-of-order: grant-after-cancel (MEDIUM)

Stripe is at-least-once and **unordered**; a late `invoice.paid`/`subscription.updated` could re-grant after a `subscription.deleted`. **Resolution:** every grant handler **and the reconciler** check the **freshly re-fetched subscription status** before granting — **never emit a `subscription_grant` when status is `canceled`/`incomplete_expired`**. Tie the grant decision to the authoritative re-fetched object (thin-event discipline applied to grants too), not just the period key.

### 8.9 Webhook replay & dedup

`stripe_webhook_events.id` PK + `ON CONFLICT DO NOTHING` short-circuit (§5.3) ⇒ each event processes exactly once; combined with deterministic ledger idempotency keys, a replayed captured webhook is a no-op. Default 5-minute signature tolerance is the automatic replay window.

### 8.10 Dunning

`invoice.payment_failed` → `past_due`/`unpaid` + `delinquent=true`, soft-suspend new builds (existing top-up balance still usable per policy). Stripe Smart Retries drive retries; `invoice.paid` clears delinquency.

---

## 9. Security

- **Verify the Stripe signature before anything** (`constructEventAsync`, async Web Crypto) — a forged `invoice.paid`/`checkout.session.completed` could grant unpaid access; a forged `subscription.deleted` could nuke a paying customer ([hooklistener security](https://www.hooklistener.com/learn/stripe-webhook-security-guide)).
- **Never trust client-supplied amounts/price IDs.** Browser sends *intent* (`planKey`/`packKey`); the **server** maps to a price ID from a server-side catalog. The single most common payment exploit ([Build subscriptions w/ Checkout](https://docs.stripe.com/payments/checkout/build-subscriptions)).
- **Signing-secret hygiene:** `STRIPE_WEBHOOK_SECRET` as a Worker secret, **separate per endpoint** (test vs live, app vs marketing); rotate on suspected compromise. Fits the existing `__Host-` cookie / secret-management posture.
- **Webhook is exempt from CSRF and JSON middleware** (signature *is* the auth) and reads the raw body exactly once.
- **Authenticated billing endpoints** reject on org-membership mismatch (reuse `userAppAccessCondition`-style checks); `client_reference_id`/customer binding to `orgId` prevents cross-tenant funding.
- **Ledger is never client-mutable** — no HTTP path writes `credit_ledger` or the Billing DO; only webhook handlers, the inference enforcer, the grant/expiry/hosting Cron, and the reconciler do.
- **Org-scoped balance (§3.4)** prevents a member reading/spending the wrong balance; `userId` is provenance only.
- **Fraud controls:** dispute/refund freeze + spend-velocity check (§8.1); negative-balance hard-block.
- **Idempotency keys on every Stripe write** (§5.6) prevent a retried webhook double-granting.
- **Reconciliation correction only ever moves toward the Stripe figure** (Stripe owns money) — a compromised D1 cannot inflate balances past what Stripe recorded.
- **No provider keys exposed:** paid build inference uses platform BYOK keys server-side; the `cf-aig-authorization` wholesaling header is only sent on the platform gateway, never on a user's own gateway (existing coupling preserved).

### 9.1 Verification-pass hardening (net-new findings, folded in)

A dedicated adversarial security pass (grounded in the live `app.ts` CSRF middleware and the `owner|admin|member` org-role system) surfaced eight net-new issues beyond the bullets above. Each is now handled in the section noted; this table is the single audit surface.

| # | Finding | Severity | Handled in |
|---|---|---|---|
| **F1** | Billing endpoints checked only org *membership* — any member could buy, cancel, or open the Customer Portal (invoices + masked card). | HIGH | §5.2 → `checkout`/`portal` now require **org-admin** (`AuthConfig.orgAdminOnly`, `routeAuth.ts:180`); `summary` stays member read-only. |
| **F2** | "Excluded from CSRF" was declared, but `app.ts` CSRF runs on `'*'` with **no path-exclusion hook** → the webhook 403s before signature verification (broken, not just insecure). | HIGH | §5.2/§5.5 → explicit `/api/billing/webhook` skip mirroring the WebSocket escape hatch (or mount before the CSRF `use('*')`). |
| **F3** | Unauthenticated webhook does crypto + a D1 dedup INSERT per call; a valid-event replay flood writes D1 unboundedly, and the global API limiter would 503 Stripe → retry storm. | MEDIUM | §5.2/§5.5/§10 → WAF/`ratelimits` rule scoped to `POST /api/billing/webhook`; exclude the path from the global API limiter. Signature-verify-first stays the primary gate. |
| **F4** | `checkout.session.completed` trusted the payload's `client_reference_id` for which org to credit → cross-tenant grant misdirection. | HIGH | §5.4 → resolve `orgId` from D1 (`billing_customers WHERE stripe_customer_id = session.customer`); trust `client_reference_id` only to create the first row. |
| **F5** | The debit used caller-assembled `metadata.orgId` without re-validating against the authenticated session at debit time (gate and debit are different code paths). | HIGH | §6.4 → assert `orgId ===` authenticated active-org at the `tryDebitPaid` site, not merely non-null. |
| **F6** | Consume idempotency-key collision across tenants → silent "already processed" = free inference; key embeds the user-controlled `agentId`. | MEDIUM | §6.5 → require ≥128-bit `generateId()` entropy; on conflict verify the existing row's `org_id` matches before deduping (cross-org = fraud signal). |
| **F7** | Flag-rollout gap: the `excludeCloudflareConnected` bypass stays live between PR 4 and PR 5 → CF-connected users get unlimited platform inference. | MEDIUM | §7.3/§10 → gate that bypass on the BYO opt-in **in PR 4** (with the gate changes), not PR 5. |
| **F8** | A `disputeFrozen` org could self-cure a negative balance by buying a top-up before the dispute closed, defeating fraud containment. | MEDIUM | §8.1/§5.2 → `checkout-session` rejects 403 while `disputeFrozen`; only `charge.dispute.closed` (won) lifts the freeze. |

---

## 10. Rollout Plan

Phased, flag-gated PRs. Each PR is independently shippable and inert until its flag flips. Sequencing is chosen so money never flows before the concurrency-safe gate and reconciler exist.

**Flag interplay:** ship with `ENABLE_CLOUDFLARE_LIMITS=true` (platform limits on) + `ENABLE_CLOUDFLARE_BYO_CREDITS=true` (BYO available in Advanced). Once Stripe is the sole paywall and BYO demand is confirmed low, set `ENABLE_CLOUDFLARE_BYO_CREDITS=false` to hide all four BYO surfaces with zero code change (components already early-return `null` on the flag).

**Step 0 — dependencies & wiring (no behavior change):**
- `npm i stripe`; confirm the installed version supports `createSubtleCryptoProvider`/`constructEventAsync` on the pinned `compatibility_date`.
- Add `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PORTAL_CONFIG_ID`, `ENABLE_CLOUDFLARE_BYO_CREDITS` to `worker-secrets.d.ts` `Env`; re-run `npm run cf-typegen`.
- Add `triggers.crons` to `wrangler.jsonc` + a `scheduled()` handler on `worker` before the Sentry wrap (§5.7) — **prerequisite** for grant-expiry, reconciliation, and hosting metering.

**PR 1 — schema (migration 0014):** add `billing_customers`, `subscriptions`, `credit_ledger`, `stripe_webhook_events`, `users.use_own_cloudflare_credits`; backfill connected BYO users → `true` (§7.6). `db:generate` → `db:migrate:local` → `db:migrate:remote`. No runtime behavior yet.

**PR 2 — Billing DO + `BillingService`:** `BillingBalanceDO` (per-org atomic check-and-decrement, §4.2), `BillingService.getEntitlement/tryDebitPaid`, `sparkCostForModel` (reuses `DEFAULT_RATE_INCREMENTS_FOR_MODELS`, Flash-Lite floor). DO-migration tag bump in `wrangler.jsonc`. Unit-tested in isolation; not yet called from the gate.

**PR 3 — Stripe endpoints + webhook + reconciler (flag-gated, no UI):** `/api/billing/*` routes, all webhook handlers (§5.4) with dedup + idempotency + thin-event re-fetch + the edge-case fixes (§8), and the nightly `reconcileBilling`. Ships the §9.1 webhook hardening with the route: the CSRF skip + global-API-limiter exclusion (F2/F3), the WAF rate-limit rule (F3), `orgAdminOnly` on the two mutating routes (F1), the D1-resolved `orgId` in `checkout.session.completed` (F4), and the `disputeFrozen` 403 on checkout (F8). Test against Stripe test mode; gated so production sees nothing until the catalog/UI land.

**PR 4 — gate + inference integration:** extend `canProceedWithRequest` (rule 6), `checkUsageAndBalance` entitlement read (org-scoped, behind `!withinLimits`), Billing DO debit at `core.ts:589-596`, `callId` idempotency, image-generation wiring (§6.4 fix), `cf-aig-metadata user_id` (§6.7). Configure the per-user spend-limit rule on `vibesdk-gateway` (dashboard). Behavior identical to today until an org has a paid balance.

**PR 5 — CF-OAuth demotion (UI + flag split):** the §7 flag split + the four-component repositioning + copy. Backfill already done in PR 1.

**PR 6 — pricing UI + catalog go-live:** Stripe Products/Prices for tiers + packs, `CreditsBanner`/`UsageLimitsBadge` platform mode, Customer Portal config. Flip `ENABLE_CLOUDFLARE_LIMITS=true` in prod (it auto-deploys via the merge-to-main workflow). Soft-launch to a small cohort; watch the reconciler drift alerts before general availability.

**Safe sequencing notes:**
- Money cannot flow until PR 3 + PR 4 are both live (endpoints + gate). PR 3 alone (webhooks) only mutates billing tables; no entitlement is granted to the gate until PR 4 reads it.
- The Billing DO (PR 2) must exist before PR 4 — the concurrency fix is a hard precondition for any paid debit.
- The Cron (Step 0) must exist before PR 3's reconciler and PR 6's hosting metering.
- Self-deploy instances (flag off) are unaffected at every step (the `usageChecker.ts:86-96` short-circuit is never touched).
- **Webhook hardening ships *with* PR 3** (§9.1-F2/F3): the CSRF skip, global-API-limiter exclusion, and WAF rate-limit rule for `/api/billing/webhook` must land in the same PR as the route, or the endpoint is broken/abusable on arrival.
- **The `excludeCloudflareConnected` opt-in gating ships in PR 4, not PR 5** (§9.1-F7) — deferring it opens a window of unlimited free inference for CF-connected users.
- **`orgAdminOnly` on the mutating billing routes is present from first deploy** (PR 3, §9.1-F1) — never shipped membership-only.

---

## 11. Open Questions for the Lead

1. **Spark factor & exact tier Spark counts.** §2.2 fixes the *cost basis* as a margin-buffer number, not auditable cents. Confirm the Spark factor (cost→Spark multiplier) and the final per-tier allotments (6k/18k/50k) against a real provider-cost model before catalog creation.
2. **Image-generation billing (§6.4 fix).** Wire image cost into Sparks (stamp metadata + per-image debit), or explicitly scope it out and cap separately? Recommendation: wire it in — it's the exact "whales out of business" cost center the pricing closes.
3. **Downgrade policy (§8.4).** Confirm **next-period-only** (recommended) vs immediate prorated clawback. Next-period-only avoids clawing spent Sparks but lets a user briefly hold a higher allotment.
4. **Hosting-metering rate & grant sizing (§2.6).** The "2 Sparks / 10k requests beyond grant" rate and per-tier hosting grants need a real Workers/DO/R2 cost model so small apps genuinely never draw down.
5. **Auto-refill default & cap.** Off-by-default opt-in is specified; confirm the max auto-refill frequency / monthly ceiling to bound runaway-loop blast radius even with auto-refill on.
6. **Org-pool fairness on Pro (§3.4).** One member can drain the shared org pool. Do we want per-member sub-budgets (a second spend-limit dimension `metadata.user_id` split *within* the org), or is the pool intentionally first-come-first-served?
7. **Spend-limit backstop budget ($X/day per user).** §6.7 needs a concrete dollar/day figure — above any legitimate single build's provider cost, below a runaway-loop blast radius. Block-vs-cheaper-model fallback for paid users?
8. **Native-Anthropic Opus route timing (§6.8).** Studio-tier premium reasoning is sold now but the native `/ai/v1/messages` path is deferred. Is the `/compat` path acceptable for Opus at launch (with the documented `response_format`-drop risk), or does Studio's Opus promise gate on the native route shipping first?
9. **Trial policy.** Do paid tiers offer a Stripe free trial (`trialing` status, trial-grant handling in §5.4/§8.6 already specced), or paid-from-day-one? Affects `customer.subscription.trial_will_end` handling and the free→trial→paid grant role split.
10. **Refund window / fraud thresholds (§8.1).** Concrete spend-velocity thresholds and the "delay large top-up spendability" window need product sign-off (too aggressive harms legitimate buyers; too loose invites refund-after-spend abuse).

---

## 12. Custom Domains (resale + attach)

> **Correction to a prior conclusion.** Earlier notes said "reselling domains isn't viable." That was **Cloudflare-Registrar-specific** and is true only of Cloudflare's own registrar (sells at registry cost, zero margin, [no renewal API](https://developers.cloudflare.com/registrar/account-options/renew-domains/)). **Resale IS viable** through a **wholesale registrar API** (Name.com) while we keep hosting on **Cloudflare for SaaS**. Registrar (who owns the name) and Cloudflare for SaaS (where traffic lands) are independent layers. This is the exact pattern Vercel / Netlify / Replit / Bolt / Lovable run, all on Name.com ([SiliconANGLE](https://siliconangle.com/2025/12/09/name-com-expands-api-integrations-across-netlify-replit-vercel-bolt/)).

### 12.1 Registrar partner — Name.com Reseller API
- Free REST v4 API; sandbox `api.dev.name.com`; ~20 req/s. Chosen over alternatives because it uniquely combines a clean REST surface, a **programmatic `EnableAutorenew`** (the call that makes Stripe-billed renewal possible), `SetNameservers` + DNS CRUD (point the name at our Cloudflare for SaaS edge), and full retail-pricing freedom.
- Load-bearing calls: `CheckAvailability`, `Search`, `CreateDomain`, `SetNameservers`, `EnableWhoisPrivacy`, `EnableAutorenew`, `RenewDomain`, `GetDomain` (expiry).
- Name.com stays registrar of record; we are a **reseller, NOT an accredited registrar** (mirror [Lovable's domain terms](https://lovable.dev/domain-registration-terms)).
- Onboarding: email `accountservices@name.com` for the .com wholesale tier sheet; keep a card-on-file / account buffer so renewal calls never fail for funds.
- Fallback registrar: **OpenSRS (Tucows)**. Disqualified: Cloudflare Registrar (no margin / no renewal API), Porkbun ([no renewal/transfer API](https://porkbun.com/api/json/v3/documentation)), Namecheap (no real reseller program).

### 12.2 Pricing
| Item | Figure |
|---|---|
| .com cost floor | ~$11.20 (Verisign $10.97 from 2026-11-01 + ICANN $0.20) |
| Name.com wholesale .com | ~$11 (quote-gated, bulk tiers) |
| Retail (register & renew) | **$24.99/yr**, WHOIS privacy bundled free |
| Gross margin / domain / yr | **~$13.79**, recurring on renewals |

### 12.3 Markup ladder (phased — ship value first, take liability last)
- **Phase 1 — Attach-your-own (LOW effort, NO liability).** Gate custom-hostname attach behind paid tiers. Cost **$0.10/hostname/mo** (Cloudflare for SaaS). First hostname bundled into Studio+; **Pro's "first custom domain free 1yr" promise is realized here** at near-zero marginal cost. Extra hostnames $2/mo (~$22.80/yr margin each). Delivers the category's strongest churn-reducer immediately.
- **Phase 2 — Affiliate interim (VERY LOW effort, NO liability).** Outbound Name.com affiliate link → return to the Phase 1 attach flow. Thin per-referral cut; **validates demand at zero build cost** before Phase 3 spend.
- **Phase 3 — Full in-product resale (MED-HIGH effort, BOUNDED liability, DIRECT margin).** Search → buy → auto-attach → auto-renew without leaving Dreamforge. ~$13.79/domain/yr, compounding on ~75% renewals.

### 12.4 Phase 3 build
- **Registrar:** register / renew / whois-privacy / auto-renew via Name.com (12.1).
- **Cloudflare for SaaS:** create custom hostname → **automatic DCV** (we own the NS, so no manual record entry by the user) → auto-provisioned + auto-renewed edge SSL. **Bought-through-us domains require ZERO DNS from the user**; attach-your-own users set one CNAME (+ a one-time DCV TXT).
- **Stripe:** one annual ($24.99/yr) subscription line per domain; `invoice.paid` → `RenewDomain`; idempotency keyed on the Stripe event id (per §5.3–5.6).
- **D1:** new `custom_domains` table (migration `0015`, after billing's `0014`) — org-scoped owner, app id, registrar + CF-hostname ids, `status` (`pending_registration`/`active`/`grace`/`detached`/`expired`/`transferred_out`), `renewalState`, `expiresAt`, `graceEndsAt`, `transferLockUntil`, `whoisPrivacy`. The nightly Cron (§5.7) reconciles `expiresAt` from `GetDomain` and drives grace→detach.

### 12.5 Non-payment policy (never a hard 404)
1. **Renewal fails** (`invoice.payment_failed`) → status `grace`; **hostname keeps serving**; Smart Retries dun ~7d; in-app banner.
2. **Grace expires** → **detach** the custom hostname; the app **auto-falls back to its `*.app.getdreamforge.com` subdomain** (always present); `DisableAutorenew` at the registrar.
3. **Registrar expiry** → `expired`; surface the ICANN Redemption (~$11.50 marked-up restore fee) honestly before any restore.
4. **Re-cure in grace** → card updated → `RenewDomain` + recreate hostname → `active`.
- **Invoice the renewal ~14 days AHEAD of registrar expiry** so a failed charge never drops us into redemption pricing.

### 12.6 ICANN gotchas (surface in UX)
- **60-day transfer lock** post-registration → store `transferLockUntil`, gray out "transfer away" until then.
- **Renewals are non-refundable** → state at purchase.
- **Tier discounts apply to new regs, not renewals** → model renewal margin separately.

### 12.7 Why it's worth it
Per-domain margin (~$13.79/yr) is thin; the value is **retention**. A custom domain is the strongest lock-in lever in the category (switching = a transfer users avoid), and because we host on **our** Cloudflare it deepens lock-in to *us*. Cutting churn 5%→3% lifts LTV ~67%; on a $600/yr Studio user, shaving even 1 point of monthly churn on the domain-holding cohort dwarfs the domain margin ~40×. Position between dev-tools (at-cost lock-in) and site-builders (marked-up profit): modest markup **and** retention.

### 12.8 Open questions
1. $24.99 retail vs $29.99 (Wix-band) — price objection vs margin.
2. Sequencing: ship Phase 1 with billing PR 6 (near-free given we already run Cloudflare for SaaS), or fast-follow?
3. Non-.com TLD pricing (.ai, .app, .io) — separate cost/retail per TLD.
4. Phase 3 refund/dispute exposure — mirror Lovable terms; legal sign-off on reseller (not registrar) status.

---

*End of spec. File: `docs/handoff/PLATFORM-BILLING-SPEC.md`. Next migrations: billing `0014`, custom domains `0015`. Awaiting lead review before any code.*
