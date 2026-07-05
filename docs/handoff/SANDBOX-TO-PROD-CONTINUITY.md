# Sandbox → Production Continuity: Real Backend + Data Carry-Over

**Date:** 2026-07-05 · **Status:** RESEARCHED, owner-approved direction pending → execution phased below
**Research basis:** three parallel deep-dives (our codebase w/ file:line evidence · upstream cloudflare/vibesdk + vibesdk-templates @ heads · July-2026 platform docs + competitor teardowns). Full reports in the session workflow transcript (wf_d36a1a2f-77d).

## 1. Ground truth today (verified)

| Concern | Preview (sandbox container) | Deployed (dispatch namespace) |
|---|---|---|
| Compute | Real container (standard-3), vite dev server via `@cloudflare/vite-plugin` | Real user Worker (WfP) |
| Database | **Local miniflare emulation** — DO-SQLite/KV state in container `.wrangler/state`; **dies with the instance** | Fresh, **empty** DO namespace (+ the pre-provisioned KV/D1 ids if the template used `{{KV_ID}}`/`{{D1_ID}}` placeholders) |
| Auth | **None. No template ships any auth** (mock users only, `ensureSeed`) | None |
| Assets/images | Real (R2 via `/api/generated/*`) ✅ | Real ✅ |
| Data continuity | — | **NONE. Nothing is exported/imported at deploy.** |

Key nuances discovered:
- `resourceProvisioner.ts` already creates **real KV/D1 on our account at sandbox setup** for placeholder templates — but the preview dev server never touches them (local emulation), so they sit **empty** until deploy binds them. Redeploys reuse the same ids → post-deploy data survives *redeploys* (the only continuity that exists).
- Our flagship template (`vite-cf-DO-v2-runner`) uses **one storage-only Durable Object**; no D1/R2/auth. `wrangler.jsonc` is AI-untouchable by design.
- The deployer uploads **no vars/secrets** (upstream gap we inherited) — blocks shipping auth secrets to deployed apps until fixed.
- `localEnvVars` is never passed by the live agent (codingAgent constructs DeploymentManager without it) — `.dev.vars` seeding is dead code in the live path.
- Upstream has **no continuity mechanism and none on its roadmap** (issue sweep clean). Cloudflare's own enterprise vibe-coding reference architecture prescribes per-app D1/KV/R2 but is **silent on preview→prod data** → differentiation opportunity.

## 2. Market reality (July 2026)
**Nobody "promotes" preview data. The winning pattern is: preview IS prod.**
- **Lovable / Bolt:** every app gets a live Supabase backend from minute one; building happens against the live DB → test users simply persist. No staging.
- **Replit:** separate dev/prod Postgres (Neon); publish applies **schema-only** migrations — dev data explicitly NOT carried (safety-first outlier).
- **v0/Neon:** copy-on-write preview branches, data discarded.

## 3. Chosen architecture — **A: "Preview on real bindings"** (+ B as anonymous-tier fallback)
Cloudflare **remote bindings are GA** (Sept 2025; per-binding `remote: true`; supported in `@cloudflare/vite-plugin` ≥1.13 — our exact template stack). Supported: **D1, KV, R2, Queues, AI…**; **NOT Durable Objects** (always local in dev).

**Target flow:**
1. At first build, provision per-app **real D1** (+ optional KV/R2), named `app-<appId>-*`, recorded on the apps row. (Provisioner already exists.)
2. Template binds them with **`remote: true`** → the sandbox vite server proxies DB calls to the REAL database. **Preview data IS production data by construction** — test users, records, uploads all persist.
3. Deploy binds the dispatched worker to the **same ids** (deploy path already passes ids through from the KV-snapshotted config ✅). No promotion step exists to get wrong.
4. Post-deploy sandbox iteration reads/writes the same store — continuity both directions.

**Auth:** new flagship template ships **better-auth on the per-app D1** (better-auth 1.5 = first-class D1 support; `better-auth-cloudflare` packages it). Same DB in preview and prod ⇒ sessions/users survive deploy. Later: platform-level "Sign in with Dreamforge" (Replit-Auth analog on our JWT infra).

**Storage steering:** the new template uses **D1 as the app database** (not the storage-DO) — D1 brings Time Travel (30-day PITR), export/import, read replication; DO storage has no export tooling and can't remote-bind. DO remains for realtime/coordination use-cases only.

**Cost/limits:** 50k D1 DBs/account (raisable toward millions; Cloudflare positions D1 for per-tenant), 10 GB/DB, usage-based pricing ⇒ **idle apps ≈ $0**.

**Safety (the "AI DROP TABLE hits real data" concern):** D1 **Time Travel** surfaced as one-click "Restore my data" + optional pre-deploy snapshot (REST export → R2). This is the Replit-marketed safety story on our stack.

### THE hard problem to engineer: the remote-binding token
The proxy needs a `CLOUDFLARE_API_TOKEN` **inside the container where AI-generated code also runs**. D1 tokens **cannot be scoped to a single database**. Mitigations (decide during build): short-lived per-session tokens; running user-app resources in a **separate Cloudflare account** dedicated to user apps; and/or isolating the dev-server process from user code. Do NOT ship A without settling this.

### Architecture B (fallback + anonymous tier): local-until-first-deploy
Preview local (today's behavior, zero token risk) → at first deploy, dump miniflare SQLite (`.wrangler/state/v3/d1/` file → SQL) → REST-import into freshly provisioned D1 (5 GiB cap, documented path) → bind. One-shot promotion; optionally switch the app to remote bindings after first deploy (hybrid). Right answer for anonymous/build-first funnel sessions where per-throwaway-session provisioning is undesirable.

### Architecture C (watch, don't build): DO facets / Dynamic Workers (April 2026 beta)
Platform parent-DO loads generated code as a facet with its own SQLite; same object serves preview + published ⇒ inherent continuity + supervisor hooks for Sparks metering. Replaces our whole pipeline; beta; revisit at GA as a lightweight-app tier.

## 4. Execution plan (phased PRs)
- **CONT-1 (templates repo):** new flagship `vite-cf-d1-runner` — D1 (`{{D1_ID}}`, `remote: true`) + drizzle + **better-auth** scaffolding (login/signup, sessions on D1) + prompts teaching the model the D1 data layer. Keep DO variant for realtime apps.
- **CONT-2 (platform):** wire `localEnvVars` through the live agent → `.dev.vars` (token delivery); settle the token-scoping decision (short-lived mint vs separate account); record provisioned resource ids on the `apps` row; provision at first build for authed users.
- **CONT-3 (deployer):** upload `vars` (+ secrets via secrets API) with dispatched workers — required for auth secrets; fixes the inherited upstream gap.
- **CONT-4 (safety UX):** "Restore database" (Time Travel) button on deployed apps; pre-deploy snapshot to R2.
- **CONT-5 (anonymous tier):** B-mode promotion at first deploy for build-first funnel sessions.

Sequencing vs existing roadmap: after **PR H** (website) unless owner reprioritizes; CONT-1/2/3 ≈ the next major engineering arc after the Sparks ladder closes.
