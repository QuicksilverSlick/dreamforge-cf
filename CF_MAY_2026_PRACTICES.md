# Cloudflare May 2026 — practices survey for the Dreamforge agent stack

**Anchor date:** 2026-05-19
**Status:** survey + recommended adoptions for M3
**Companion:** `M3_PORT_PLAN_v2.md`

This document surveys Cloudflare improvements between January 2026 and May 2026 that are directly relevant to our agent stack (agents SDK, Durable Objects, Workers Logs, AI Gateway, Sentry, Workers AI, Sandbox/Containers). For each, we record what it is, why it matters here, how to adopt it, and whether it should land **in M3** or be deferred to a follow-up.

Sources are cited per item. Items without a grounded changelog/blog citation are omitted (per the directive: no speculation).

---

## 1. Durable Objects observability + RPC tracing

### 1.1 Sentry-Cloudflare 10.49.0 — `enableRpcTracePropagation` + DO-alarm separate traces (April 16/29, 2026)

**What it is.** Sentry's `@sentry/cloudflare` 10.49.0 adds opt-in trace propagation across RPC calls between Workers and Durable Objects. 10.49.0 also makes Durable Object alarms create separate traces per alarm invocation, properly linked to the originating trace. Source: `https://github.com/getsentry/sentry-javascript/releases` (10.49.0 notes, 2026-04-16; 10.51.0 stabilized the surface 2026-04-29).

**Why it matters for us.** Our agentic-mode flow is heavily DO-to-DO: `CodeGeneratorAgent` calls into `UserAppSandboxService` (sandbox DO), `CodebaseAnalyzer` (BYOP DO), and `DORateLimitStore`. Today our Sentry traces stop at the DO boundary — alarms appear as orphan traces, and DO→DO RPC calls are not stitched. Both gaps make it hard to diagnose where an agentic build spent its time. With agentic mode landing in M3, these gaps go from "annoying" to "we can't reason about prod failures."

**How to adopt.**
- Bump `@sentry/cloudflare` from `^10.30.0` to `^10.49.0` (or newer if peer-deps allow) in `package.json`.
- In `worker/observability/sentry.ts`, add `enableRpcTracePropagation: true` to the client options object.
- Confirm `Sentry.instrumentDurableObjectWithSentry` is still applied to every DO export in `worker/index.ts` (`CodeGeneratorAgent`, `DORateLimitStore`, `CodebaseAnalyzer`).
- No wrangler changes required.

**M3 fold-in.** YES — **commit 9 (`chore(agents+infra): final cleanup + CF May-2026 adoptions`)**. The adoption is small (~10 LoC) and the value scales with the agentic-mode landing.

### 1.2 Sentry-Cloudflare 10.53.0 — `streamGenAiSpans` (May 12, 2026)

**What it is.** New option to extract `gen_ai` spans from transactions and send them as separate envelope items. Avoids "transaction payload exceeds size limits" errors when many LLM calls happen inside one logical operation. Source: `https://github.com/getsentry/sentry-javascript/releases` (10.53.0 notes, 2026-05-12).

**Why it matters for us.** A single agentic-mode generation can issue 10–50+ LLM calls (one per tool invocation cycle). At our current `head_sampling_rate: 1` and transaction-based tracing, we will hit the payload-size cap and lose spans. `streamGenAiSpans: true` is the documented fix.

**How to adopt.**
- Same Sentry bump as 1.1, except 10.53.0 is the floor.
- Add `streamGenAiSpans: true` to the Sentry client options.

**M3 fold-in.** YES if the Sentry bump lands at 10.53+; otherwise defer to a follow-up. **Commit 9.** Marginally beta-ish (released 7 days before this doc); guard with an env-var feature flag if conservative.

### 1.3 Workers Logs Engine (`observability.logs.invocation_logs`)

**What it is.** Workers Logs has been GA since April 2025; the structured-JSON logging path supports `console.log({...})` indexing across unlimited cardinality, RPC + DO invocations are first-class log types, alarms produce their own log lines. Source: `https://developers.cloudflare.com/workers/observability/logs/workers-logs/` (current).

**Why it matters for us.** Already enabled in `wrangler.jsonc:21-27` (`observability.enabled: true`, `observability.logs.enabled: true`, `observability.logs.invocation_logs: true`, `head_sampling_rate: 1`). This is **already adopted**.

**What we can improve.**
- `head_sampling_rate: 1` in production at agentic scale is expensive (5B daily account cap; agentic builds can issue 100s of invocations each).
- Per-env sampling: a follow-up should split `wrangler.jsonc` to set `head_sampling_rate: 0.1` for production while keeping `1` in staging/preview.

**M3 fold-in.** NO — we're already on the modern observability config. Note as an M3.5 follow-up. Captured in `M3_PORT_PLAN_v2.md` OQ-M.

### 1.4 Durable Object hibernation — WS auto-close on Close frames (compat `2026-04-07+`)

**What it is.** As of `compatibility_date: 2026-04-07`, the workerd runtime auto-replies to WebSocket Close frames. Calling `ws.close()` in your handler is now safe but optional. Source: `https://developers.cloudflare.com/durable-objects/best-practices/websockets/`.

**Why it matters for us.** Trivial code-cleanup benefit. The bigger reason to bump compat-date is that several agents-package safety nets and `partyserver 0.5.x` regression fixes assume modern compat. Our `wrangler.jsonc:9` is at `2025-08-10`.

**How to adopt.**
- Bump `wrangler.jsonc:9` from `"2025-08-10"` to `"2026-04-07"` (or later, up to `2026-05-19`).
- Read the compat-flag diff list between the two dates first — there may be other behavior changes (e.g. fetch semantics).

**M3 fold-in.** YES, **commit 9**. Pair with the Sentry bump; both are infra-level adoptions with shared test surface.

---

## 2. Durable Object stability + state migration

### 2.1 Durable Object Facets (`ctx.facets.get()`)

**What it is.** Sub-agents / child DOs colocated under a parent DO with isolated SQLite storage. Each facet has its own `ctx.id.name`, its own SQLite database, its own state, and round-trips via typed RPC. Graduated out of the `experimental` compatibility flag as of `agents@0.11.3` (April 18, 2026). Source: `https://blog.cloudflare.com/durable-objects-in-dynamic-workers/` (April 13, 2026); `cloudflare/agents` 0.11.3 release notes.

**Why it matters for us.** Conceptually a big deal for "give each AI-generated app its own database" — but **not in M3 scope**. We don't expose user-app databases today; that's a strictly forward-looking capability. The Facets pattern is also what powers the new agents-SDK sub-agent feature, which we're not adopting either (see 2.2).

**M3 fold-in.** NO. Note as a future capability (likely tied to BYOP graduating to full agentic project lifecycle, or to a new feature for user apps).

### 2.2 `agents` package sub-agents + agent-as-tool (0.11.5 → 0.12.0)

**What it is.** `subAgent()`, `parentAgent()`, `hasSubAgent()`, `listSubAgents()`, `routeSubAgentRequest()`, `getSubAgentByName()`, plus 0.12.0's `runAgentTool()` / `agentTool()` for running sub-agents as retained streaming tools from a parent. Source: `cloudflare/agents` 0.11.5 (2026-04-23) + 0.12.0 (2026-04-30) release notes.

**Why it matters for us.** Not in M3 scope, but architecturally interesting for a future "per-conversation sub-agent" or "agentic builder spawns DeepDebugger sub-agent" pattern. We don't adopt this now because we're staying on `agents@0.2.32` for M3 (see OQ-J in v2 plan).

**M3 fold-in.** NO.

### 2.3 `partyserver 0.5.4` — name-on-alarm-wake fix

**What it is.** A defensive `__ps_name` write on first fetch, fixing a case where fresh 0.5.x DOs with pre-2026-03-15 compat dates could lose `this.name` on alarm wake. Source: `cloudflare/agents` 0.11.7 release notes (2026-04-28).

**Why it matters for us.** Affects projects with `compatibility_date < 2026-03-15` whose DOs schedule alarms. Our `2025-08-10` compat-date qualifies. If we use DO alarms anywhere — we should audit — this fix matters.

**Check.** Grep our code for `.alarm()` / `setAlarm()` / `state.storage.setAlarm()`.

**M3 fold-in.** Indirectly, via the compat-date bump in commit 9. Already covered.

---

## 3. Workers AI / AI Gateway

### 3.1 AI Gateway

**Status.** The official AI Gateway changelog (`developers.cloudflare.com/ai-gateway/changelog`) has no entries from January 2026 to May 2026 as of survey date. The most recent entry is 2025-11-21 (Unified Billing supports opt-in Zero Data Retention). The product has been stable through the survey window — no major new rate-limit, fallback, caching, or guardrail features documented for 2026.

**What we already use.** Our `worker/services/aigateway-proxy/controller.ts` is on the modern surface (3-gate: origin allowlist + JWT + D1 ownership). No M3 work needed.

**M3 fold-in.** NO. No 2026 changes to chase.

### 3.2 Workers AI

**Status.** April 2026 Stream-bindings announcement is unrelated to our path. No new Workers AI model surface changes relevant to our multi-provider generation (we use Anthropic / OpenAI / Google AI Studio directly via API keys, not Workers AI bindings).

**M3 fold-in.** NO.

---

## 4. `agents` package release notes since our 0.2.32 anchor

Survey of every `agents@` release from 0.2.32 (our M2 pin) through 0.12.4 (current), focused on items that affect our code today.

| Version | Date | Item | Affects us? |
|---|---|---|---|
| 0.3.x – 0.5.x | 2025-late → 2026-early | Various OAuth + MCP fixes | NO — we don't expose MCP OAuth |
| 0.11.3 | 2026-04-18 | Facets graduate out of `experimental` flag; cross-DO I/O bug fixes in `subAgent()` | Indirect — we don't use Facets |
| 0.11.5 | 2026-04-23 | Sub-agent routing + `getSubAgentByName` | NO |
| 0.11.6 | 2026-04-27 | Think persistence fix for duplicate orphan rows | NO — we don't use Think |
| 0.11.7 | 2026-04-28 | `partyserver 0.5.4` bump (name-on-alarm-wake safety net) | Yes if we use alarms; check |
| 0.11.8 | 2026-04-28 | `AbortRegistry.linkExternal` for external abort signals | Potentially — abort propagation for "stop generation" mid-tool-call. Nice-to-have |
| 0.11.9 | 2026-04-29 | `isReplayChunk` for stream broadcasters; idempotent tool-part chunks | NO |
| 0.12.0 | 2026-04-30 | Agent-as-tool orchestration; sub-agent alarm-backed APIs | NO |
| 0.12.1 | 2026-05-01 | Sub-agent WebSocket forwarding fixes | NO |
| 0.12.2 | 2026-05-01 | Peer dep version raises | NO |
| 0.12.3 | 2026-05-02 | Typed `call`/`stub` for streaming methods | NO |
| 0.12.4 | 2026-05-13 | Chat-stream resume race fixes; structured tool-output preservation; transient DO routing retries | NO — we don't use chat-stream resume; but the routing-retry feature has a `routingRetry` config exposed in `getAgentByName` that we could opt into for added resilience |

**Conclusion.** Nothing in the 0.3 → 0.12 release window is a blocker or material upgrade for our `codingAgent.ts` port. The most interesting item is `AbortRegistry.linkExternal` (0.11.8) which would let us cleanly propagate the `STOP_GENERATION` WS message into the running tool call from outside the DO — but it's not needed for M3.

**M3 fold-in.** NO. Stay at `agents@0.2.32` for M3. Bump to 0.11.x or 0.12.x in a separate M3.5 PR after agentic-mode lands. Captured in `M3_PORT_PLAN_v2.md` OQ-J.

---

## 5. Sandbox / Containers

### 5.1 `@cloudflare/sandbox 0.5.6` envelope — better usage patterns

**What we have.** Pinned at `0.5.6` per the previous review. The sandbox SDK has progressed upstream but we're not bumping in M3 (per the directive).

**Patterns to adopt better within 0.5.6.**
- `proxyToSandbox()` is already wired in `worker/index.ts`.
- The sandbox's runtime-error capture API is what `worker/agents/tools/toolkit/get-runtime-errors.ts` consumes (in commit 6). Confirm we're using the structured-error shape rather than parsing stderr.
- Sandbox's git CLI (used in BYOP clone path) is what the thinned `git.ts` tool can route to (OQ-H).

**M3 fold-in.** Indirect, via commit 6's thinned `git.ts` and commit 7's `get-runtime-errors` tool. Nothing version-specific to add.

### 5.2 Project Think — execution ladder + sandbox tiers (BETA)

**What it is.** Project Think introduces an execution-tier model (Tier 0 filesystem → Tier 1 sandboxed JS via Dynamic Workers → Tier 2 → Tier 3 headless browser → Tier 4 full OS). Marked **experimental** in the April 15 announcement. Source: `https://blog.cloudflare.com/project-think/`.

**Why it matters for us.** Long-term, Dynamic Workers (Tier 1) is the most interesting Cloudflare-native answer to "let users run arbitrary generated code without a container per app." But it's beta as of survey date.

**M3 fold-in.** NO. Track separately. Flagged as beta.

---

## 6. Hono / framework integrations

### 6.1 `@sentry/hono` beta (10.52.0, May 7 2026)

**What it is.** Official Sentry SDK for Hono with RPC trace propagation for `WorkerEntrypoint`, Hono middleware span improvements. Source: `https://github.com/getsentry/sentry-javascript/releases` 10.52.0.

**Why it matters for us.** We use Hono for the worker API. The current Sentry-Cloudflare base SDK already covers most of our needs; `@sentry/hono` adds middleware-level spans that improve API-route latency visibility.

**M3 fold-in.** OPTIONAL — note for a follow-up. Beta status is a flag but not blocker.

---

## Recommended adoption list for M3

In priority order. All of these slot into **commit 9** (`chore(agents+infra): final cleanup + CF May-2026 adoptions`) unless noted.

1. **Sentry-Cloudflare bump 10.30 → 10.49+** with `enableRpcTracePropagation: true`. *(item 1.1)* — High value for agentic-mode debugging; small adoption cost. Commit 9.

2. **`compatibility_date` bump `2025-08-10` → `2026-04-07`.** *(item 1.4)* — Unlocks WS auto-close, modern hibernation behavior, picks up `partyserver 0.5.4` safety nets indirectly. Commit 9.

3. **Sentry `streamGenAiSpans: true`** (only if Sentry lands at 10.53+). *(item 1.2)* — Prevents transaction-size overflow at agentic scale. Commit 9.

4. **Thinned `git.ts` tool wired to existing sandbox-side git CLI.** *(item 5.1)* — Not strictly a CF May-2026 adoption, but the strategy depends on knowing our sandbox already exposes git. Commit 6.

5. **Audit DO alarm usage; rely on `partyserver 0.5.4` safety net via compat-date bump.** *(item 2.3)* — One-time check during commit 9 work.

Items NOT folded into M3 (deferred to M3.5 or later):
- `agents@0.2.32 → 0.11.x or 0.12.x` bump (OQ-J)
- Per-environment `head_sampling_rate` tuning (OQ-M)
- DO Facets adoption for per-app SQLite (forward-looking capability)
- Project Think adoption (beta)
- `@sentry/hono` Hono-middleware spans (beta + nice-to-have)
- AI Gateway changes (none in window)
