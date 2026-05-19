# M3 production-reality addendum

**Anchor date:** 2026-05-19
**Status:** findings from live production diagnostic during the post-M2 sanity-gen attempt
**Companion to:** `PHASE_E_MEGABUNDLE_SCOPING.md`, `M3_PORT_PLAN_v2.md`, `M3_COMMIT2_DEPMAP.md`, `CF_MAY_2026_PRACTICES.md`

This document captures what we learned about production state during a live `wrangler tail` of `dreamforge-cf` while the user attempted a generation. **It reframes the M3 plan's assumptions** about what we are porting against.

---

## 1. Production reality (as of 2026-05-19 17:30 UTC)

Production has been functionally broken at the sandbox layer for ~7 months. Development was paused during that period waiting for upstream `cloudflare/vibesdk` to stabilize the agent + sandbox stack so we could rebuild against a working target. This pre-existing state was not visible in the M3 planning docs (`PHASE_E_MEGABUNDLE_SCOPING.md` §6 acknowledges sandbox compat as a risk surface but does not flag it as already-broken).

A fresh generation against `app.getdreamforge.com` (deterministic mode, "Create a todo list app with dark mode toggle") produces three concurrent failure modes visible in `wrangler tail`:

### Failure mode 1 — `agents@0.2.x` optional peer dep `ai` not installed

```
[ERROR] Error: Could not resolve "ai" imported by "agents". Is it installed?
        at __vite-optional-peer-dep:ai:agents:2:7
```

The `agents@0.2.35` package declares the Vercel `ai` SDK as an optional peer dependency. Some code path within `agents` tries to import it at runtime. The fork's `package.json` does not list `ai`. **The release-notes review done pre-M2 (PHASE_E_MEGABUNDLE_SCOPING.md §2) caught API-surface compatibility but missed this optional-peer requirement** because it does not show in `package.json` diffs.

**Reproduction:** runtime, on any agent-initiated codepath that exercises the `ai`-importing branch in `agents`. Surfaces twice per gen in `wrangler tail`.

**Impact:** unknown severity (the failing import is in an optional code path so most of `agents` still works, but the failures are real errors logged to Sentry).

### Failure mode 2 — Sandbox shell session dies after ~75 seconds

```
17:31:18  Session created: sandbox-96e99c93-8cce-4789-b3b4-a2a7c2befda9
17:31:19  Exec 1 succeeds:  `test -f c-code-react-runner/package.json` → "exists"
17:32:36  Exec 2 fails:     "Session 'sandbox-96e99c93-...' is not ready or shell has died"
```

The sandbox's shell process appears to die between the first exec and the second exec. Subsequent exec calls against the same session ID return `CommandError`. The agent sees this as a deploy failure, retries (against the same session ID), gets the same error, loops.

**Time-to-death:** ~75 seconds from session creation. Survives one exec.

**Where in the stack:** `@cloudflare/sandbox@0.5.6` package — `Sandbox.execWithSession` → `CommandClient.execute` returns 500 with "shell has died".

**Almost certainly fixed by M4 PR 6** (sandbox local-proxy refactor) — upstream rebuilt the sandbox session-lifecycle layer specifically. The fact that we are pinned at `@cloudflare/sandbox 0.5.6` (matching upstream's pinned version) suggests the package version is correct; the issue is in how our agent code interacts with it. Upstream's M4 PR 6 reshapes that interaction.

### Failure mode 3 — Sandbox DO alarm-reset cycle

```
[ERROR] Error: Durable Object reset because its code was updated.
        at Sandbox.alarm (node_modules/@cloudflare/containers/dist/lib/container.js:896:32)
[ERROR] Sandbox error: Network connection lost.
```

Sandbox Durable Objects' periodic alarms (`@cloudflare/containers/dist/lib/container.js:896` — the container keepalive logic) keep hitting "DO reset because code updated". The DO reset destroys any in-flight shell sessions, which feeds back into failure mode 2.

**wallTime on the failing alarm:** 58 seconds. The alarm slept its full keepalive window before being killed.

**The deploy version in the failing events matches the live deploy:** version `bd41b831` (2026-05-19T02:11 UTC). Sandbox DOs from before that deploy keep alarming, keep getting reset, keep losing their shell sessions. This is not a deploy-time event — it's an ongoing degradation.

---

## 2. What this means for the M3 plan

### 2.1 OQ1 (scope decision) should be revisited

The original OQ1 (`PHASE_E_MEGABUNDLE_SCOPING.md` §8) offered scope (a) = M1+M2+M3 vs scope (b) = M1+M2+M3+M4. User chose (a) with the assumption that M4 was optional polish.

**With production-reality context, scope (a) is insufficient.** M3 collapses the agent topology but the resulting collapsed agent still talks to the broken sandbox layer via the broken pre-M4 interaction patterns. Failure mode 2 above survives M3.

**Recommended scope adjustment:** scope (a) + M4 PR 6 only. The Git Durable Object subsystem (M4 PR 6 sub-piece) and the sandbox local-proxy refactor (the other M4 PR 6 sub-piece) are intertwined upstream, but the fork already has BYOP-shaped Git handling via `CodebaseAnalyzer`, so the relevant M4 PR 6 work is specifically the sandbox refactor. PR 7 (rate-limits/CSRF/GH rebase — we already have these production-hardened) and PR 8 (agentic builder + DeepDebugger — orthogonal to sandbox) can stay deferred.

**Concrete recommendation for the user before commit 2b starts:**
> *"Scope reopened: M4 PR 6 sandbox refactor folded in. M3 sequence grows from 9 commits to ~11 commits. Manual smoke now happens against `wrangler dev` (production is broken at the sandbox layer regardless of what M3 lands)."*

### 2.2 `ai` peer dep handling

`package.json` change as part of M3 commit 2b's deps work:

```diff
"dependencies": {
+  "ai": "<version-matching-agents@0.2.35-peer-range>",
   "agents": "^0.2.32",
   ...
}
```

Look up the exact peer range when commit 2b lands. Likely a fast-moving SDK so pinning a major is appropriate.

Alternative: if the `ai`-importing code path in `agents` is genuinely optional and we don't want it, we could try patching the import to a no-op shim. **Not recommended** — upstream's intent is that consumers either install `ai` or accept the runtime errors. M3 should install it.

### 2.3 Sandbox DO alarm reset

If M4 PR 6 sandbox refactor is folded in (per §2.1), this should be resolved by upstream's rebuilt session-lifecycle. If not folded in, the agent will keep hitting this in production after M3 ships, and we will be in roughly the same broken state we are now.

### 2.4 Smoke-testing discipline

The original M3 plan (`M3_PORT_PLAN_v2.md` §6) called for "manual app-gen smoke test on a wrangler dev session" before M3 PR is marked ready-for-merge. **This is now even more critical, and the wording should harden:**

> *"Production-level smoke validation is unreliable because production has been broken at the sandbox layer for ~7 months. All validation happens on `wrangler dev` exclusively until M3 (+ M4 PR 6) ships and a baseline is re-established. The first post-merge production gen IS the validation that the broken-for-7-months state is resolved."*

### 2.5 What is NOT changed by these findings

- The 9-commit M3 sequence stays the same shape
- The dep-map in `M3_COMMIT2_DEPMAP.md` stays accurate
- The atomic-green-commits discipline applies regardless of scope
- The Cloudflare May 2026 substrate improvements (Sentry RPC trace, compat-date bump, streamGenAiSpans flag) still slot into commit 9

---

## 3. Diagnostic provenance

The findings above were captured via `wrangler tail dreamforge-cf --format=pretty` during a user-initiated production gen on 2026-05-19. Full tail output is preserved at the conversation tool-result path; key excerpts:

- **Failing exec call:** `worker/services/sandbox/` → `@cloudflare/sandbox` → "shell has died" — confirmed in tail event "UserAppSandboxService.exec - Ok @ 5/19/2026, 12:32:20 PM" with `httpStatus: 500`.
- **Failing peer dep:** confirmed in tail event "Could not resolve 'ai' imported by 'agents'. Is it installed?" — appears twice during one gen attempt.
- **Sandbox DO reset:** confirmed in tail event "Durable Object reset because its code was updated. at Sandbox.alarm (node_modules/@cloudflare/containers/dist/lib/container.js:896:32)" with `wallTime: 58592ms`.
- **Live deploy version:** `bd41b831-d616-4b7a-9a9e-b15ea07be217` (deployed 2026-05-19T02:11:16.521Z, corresponds to PR #48 merge).

---

## 4. Open questions for the user

- **OQ-M (scope adjustment):** Approve folding M4 PR 6 (sandbox local-proxy refactor only — not the rest of M4) into the M3 effort?
- **OQ-N (`ai` peer dep policy):** Install `ai` as a regular dep, or evaluate whether the import path that uses it is genuinely needed for our use case? Recommendation: install — fork shouldn't carry a custom patch on `agents`.
- **OQ-O (production smoke recipe):** Confirm that all future smoke-testing happens on `wrangler dev` until M3 + M4 PR 6 ship?

Resolve these before commit 2b starts.
