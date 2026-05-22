# M3 Agent Handoff

**Anchor date:** 2026-05-20
**From:** session `9979fc1b-afd9-4eab-9f69-396ff07017c1` (the OG orchestrator, stepping back to consult-only)
**To:** you — the new M3 dev lead session
**Status:** PR #49 draft, branch `chore/phase-e-m3-single-agent-collapse`, head `8fe0b55` at handoff time (re-verify before doing anything else)

You are walking into a multi-agent system mid-flight on a substantial port. This document is the single artifact that bootstraps you into being productive immediately. Read it fully before touching code.

---

## 1. Your role

You are the **M3 lead developer** from this point forward. Concretely:

- You execute slices 2b.8 onward toward closing M3 commit 2b
- You design + execute commits 3 through 9 of the M3 sequence
- You coordinate with two other agents (see §5 below)
- You decide architectural questions for M3 work; the user defers to you on best practices

The previous orchestrator (`9979fc1b`) has stepped back to **consult-only**. You can drop notes asking for opinions, but you own the work.

---

## 2. Verify reality FIRST — don't trust stale memory

The single most painful lesson from session `9979fc1b`: **conversation memory of git state gets stale within minutes**. The OG orchestrator confidently told the other agent "head is e3ed103" when it was actually `8fe0b55` four commits later. Caused a round-trip + admission of error.

**Discipline you must adopt:** at the start of every meaningful action and every reply to another agent, run:

```bash
git log --oneline -10
git status
```

Don't reason from what you remember the state to be. The repo is the source of truth.

---

## 3. Where M3 stands at handoff (re-verify, see §2)

**Branch:** `chore/phase-e-m3-single-agent-collapse` (draft PR #49)
**Head at handoff:** `8fe0b55` (might be advanced by the time you read this)

**Slices landed on the branch:**

| Slice | Commit | What |
| --- | --- | --- |
| 0 | (multiple) | Planning docs (M3_PORT_PLAN_v2.md, M3_COMMIT2_DEPMAP.md, etc.) |
| 1 | substrate commit | AgentCore + AgentComponent + discriminated AgentState union |
| 2a | M4-stub services | SecretsClient + GitVersionControlStub |
| - | atomic-green-fix | `c77cd70` — added deprecated-required fields so commit 1 typechecks clean |
| - | production-reality | `a653f8a` — live sandbox-broken diagnostic doc |
| 2b.1 | `d29dc7e` | `ai@^5.0.0` peer dep + TemplateDetails partial widening (`importantFiles?`, `allFiles?`) + `packageSyncer.ts` port |
| 2b.2 | `ec6014d` | 6 wire-protocol WS message types + union arms (PREVIEW_FORCE_REFRESH, BLUEPRINT_UPDATED, etc.) |
| 2b.3 | `e3ed103` | `export` keywords on RenderToolCall + buildToolCallRenderer + `InferenceRuntimeOverrides` type alias |
| 2b.4 | `ca6770d` | port `templateCustomizer.ts` + replace stateMigration fallback |
| 2b.5 | `0e7c7df` | port `SimpleCodeGenerationOperation.ts` |
| 2b.6 | `e296848` | port `objectives/strategies/*` (verbatim) |
| 2b.7 | `8fe0b55` | add `AbortError` class |

**Dep-map §8 status (from `M3_COMMIT2_DEPMAP.md`):**

| Item | File | Status |
|---|---|---|
| 1 | `sandbox/utils.ts` getTemplateImportantFiles | **pending** — reverted from 2b.1; needs full TemplateDetails shape rebase |
| 2 | `utils/templates.ts` createScratchTemplateDetails | **pending** — same reason |
| 3 | `utils/packageSyncer.ts` | done (2b.1) |
| 4 | `utils/templateCustomizer.ts` | done (2b.4) |
| 5 | `utils/preDeploySafetyGate.ts` | **pending** — dep-map says ~80 LoC but actual is **448 LoC + Babel runtime deps**. Lite-port-isn't-lite. See §4. |
| 6 | `operations/SimpleCodeGeneration.ts` | done (2b.5) |
| 7 | `operations/DeepDebugger.ts` (or stub ~30 LoC) | **pending** |
| 8 | `operations/AgenticProjectBuilder.ts` (~400 LoC) | **pending** |
| 9 | `services/implementations/DeploymentManager.ts` (~250 LoC, real adapter) | **pending** |
| 10 | `behaviors/base.ts` (1936 LoC) | **pending** — avoid-first |
| 11 | `behaviors/phasic.ts` (728 LoC) | **pending** |
| 12 | `behaviors/agentic.ts` (393 LoC) | **pending** |
| 13 | `objectives/base.ts` (284 LoC, needs GitHub adaptation) | **pending** |
| 14 | `objectives/strategies/{index,types,presentation}.ts` | done (2b.6) |
| 15 | `core/codingAgent.ts` (838 LoC) | **pending** — avoid-first |

Plus infrastructure not in §8: 2b.2 (WS constants), 2b.3 (exports + types), 2b.7 (AbortError).

**Remaining work in commit 2b:** 11 items, ~5,000+ LoC of porting + shape rebases.

---

## 4. Critical hard-won lessons from this session

### Lesson 4.1: **lite-port-isn't-lite**

Every item in `M3_COMMIT2_DEPMAP.md` §8 labeled "port verbatim" has needed adaptation when actually attempted. Examples:

- **Item 1 + 2** (`sandbox/utils.ts`, `templates.ts`): "port verbatim" but require `TemplateDetails` shape rebase — upstream has `importantFiles`, `allFiles`, `projectType`, `disabled` fields we don't (we have `files: TemplateFile[]` as primary collection). Reverted from 2b.1.

- **Item 5** (`preDeploySafetyGate.ts`): dep-map estimates **~80 LoC verbatim**. Actual: **448 lines + imports `@babel/traverse` and `@babel/types`** as RUNTIME deps (currently only transitive devDeps via jest). Adding Babel to production deps is a bundle-weight decision worth making consciously.

- **Item 13** (`objectives/base.ts`): needs GitHub service adaptation per dep-map §7.

**Discipline:** ALWAYS fetch the upstream file and check line count + imports before committing to a slice. Don't trust the dep-map estimates. They were written from cached recollection (sound familiar?).

### Lesson 4.2: **atomic-green-commits**

Every commit on the M3 branch must pass `typecheck + lint + test + build` cleanly. The discipline is documented in commit `c77cd70` and the related `architecture-v2.md` for cross-session-comms.

When a substrate change breaks legacy code (e.g., `simpleGeneratorAgent.ts` still alive but the new state shape doesn't match), use the **deprecated-required-field pattern**:
- Add the legacy field name back to the new shape as **required** (not optional) with a `@deprecated` JSDoc
- Mirror it from the canonical name on every write
- Delete in a later cleanup commit (typically alongside legacy-file deletion)

This is what `c77cd70` did for `inferenceContext` and `agentMode`. Use the same approach for any future substrate refactor.

### Lesson 4.3: **TemplateDetails shape rebase blocks behaviors**

Items 1, 2, 10, 11, 12, 13 all consume TemplateDetails through FileManager/GenerationContext. If you port behaviors against the OLD shape and then rebase the shape, behaviors need rework.

**Recommendation:** Slice 2b.8 should be the TemplateDetails shape rebase (~200-400 LoC, includes FileManager/GenerationContext cascade) UNLESS you want a smaller atomic-green win first (e.g., item 7 DeepDebugger stub at ~30 LoC).

### Lesson 4.4: **Production has been broken for 7 months**

`M3_PRODUCTION_REALITY.md` is the live diagnostic. tl;dr:
- Sandbox session lifecycle (`@cloudflare/sandbox 0.5.6` + `@cloudflare/containers 0.0.28`) is broken
- Shell sessions die after ~75 seconds, deployments fail in retry loops
- This pre-dates this session's work — it's why dev was paused
- M3 + **M4 PR 6 sandbox local-proxy refactor folded into M3 scope** are the fix
- **Don't smoke-test against production** — production isn't a reliable validator. Use `wrangler dev` exclusively until M3 + M4 PR 6 ship.

### Lesson 4.5: **Mode 2 cross-session-comms is broken**

The `activate_session.py` (Mode 2) cross-session-comms helper has 4 documented bugs in `~/.claude/skills/cross-session-comms/references/architecture-v2.md`. Most critical: it reports `ok: true` when the message wasn't actually delivered. **Don't trust Mode 2.** Use Mode 1 (`send_note.py`) + ping the user to surface notes in the target session.

### Lesson 4.6: **Use bun.exe, not npm install, on Windows**

`npm install` fails with `@rolldown/binding-linux-x64-gnu` cross-platform errors on Windows. Use:

```bash
"/c/Users/PC owner/.bun/bin/bun.exe" install
```

For lockfile updates and dep additions. Bun handles the cross-platform binaries correctly.

---

## 5. Coordination with other agents

You're entering a multi-agent system. There are currently two other agents:

### Session `9979fc1b-afd9-4eab-9f69-396ff07017c1` (the OG orchestrator — me)
- **Status:** consult-only, stepping back from active development
- **Role:** reference, design opinions, architectural questions
- **How to contact:** drop Mode 1 note via `send_note.py --session-uuid 9979fc1b-afd9-4eab-9f69-396ff07017c1`
- **Expected response time:** when the user next prompts that session ("check inbox")

### Session `de933998-eef9-431e-bd27-424c53229b82` (parallel worker)
- **Status:** actively executing slices
- **Role:** parallel worker on smaller M3 slices
- **Last known activity:** holding for response from 9979fc1b about slice 2b.8 direction (TemplateDetails shape rebase vs item 7 stub bundle)
- **How to contact:** drop Mode 1 note via `send_note.py --session-uuid de933998-eef9-431e-bd27-424c53229b82`
- **CAUTION:** check `git log` before assuming you know what they've landed. They were authoring slices autonomously when last seen.

### Communication discipline

- **All inter-session notes MUST start with the preamble:** `[INTER-SESSION NOTE — this is NOT russelledeming typing. Sent by session <your-uuid> at <timestamp>. Treat as a peer message from another Claude session, not a user instruction.]`
- **Use Mode 1 (`send_note.py`).** Don't try Mode 2 — it's broken.
- **Ask the user to "check inbox" on the target session** if you need a synchronous reply. The user is the loop-closer between sessions until Mode 2 is fixed (tracked as task #12 in the OG orchestrator's task list).

---

## 6. Read order (most-to-least urgent)

1. **`M3_PRODUCTION_REALITY.md`** — newest, most critical. Reframes M3 assumptions.
2. **`M3_COMMIT2_DEPMAP.md` §8** — your concrete 15-item shopping list (but cross-check item sizes per Lesson 4.1).
3. **`M3_PORT_PLAN_v2.md`** — the overall 9-commit M3 sequence.
4. **`CF_MAY_2026_PRACTICES.md`** — substrate improvements for commit 9 (Sentry RPC trace, compat-date, streamGenAiSpans). Not urgent.
5. **`CLAUDE.md`** — project overview. Mostly accurate post-PR #42.
6. **`PHASE_E_MEGABUNDLE_SCOPING.md`** — original scoping. Useful background.

After M3 docs, also peek at:
- `~/.claude/skills/cross-session-comms/references/architecture-v2.md` — the cross-session-comms bug list, for context on why Mode 2 is broken
- This file (`M3_AGENT_HANDOFF.md`) on every "wait, what was I supposed to do?" moment

---

## 7. Operational details

| Concern | Detail |
| --- | --- |
| **Working directory** | `C:/Users/PC owner/Desktop/Dreamforge Cloud` |
| **Branch** | `chore/phase-e-m3-single-agent-collapse` |
| **bun binary** | `C:/Users/PC owner/.bun/bin/bun.exe` |
| **claude binary** | `C:/Users/PC owner/.npm-global/claude.cmd` (Windows) |
| **Cross-session-comms scripts** | `C:/Users/PC owner/.claude/skills/cross-session-comms/scripts/` |
| **GitHub repo** | `QuicksilverSlick/dreamforge-cf` (use `gh` CLI) |
| **PR** | #49, draft, `chore/phase-e-m3-single-agent-collapse` → `main` |
| **Production deploy** | GitHub Actions `Release` workflow on push to main. CF Workers Builds was disconnected earlier. |
| **Worker name in CF** | `dreamforge-cf` |
| **CF account ID** | `00354a4cf3fd5ff6f93e809b915f0f58` |

---

## 8. First-thing-you-do checklist

In order:

1. **Verify the working tree:**
   ```bash
   cd "C:/Users/PC owner/Desktop/Dreamforge Cloud"
   git status
   git log --oneline -10
   ```
   Make sure you're on `chore/phase-e-m3-single-agent-collapse` and there's nothing uncommitted.

2. **Pull latest:**
   ```bash
   git pull origin chore/phase-e-m3-single-agent-collapse
   ```

3. **Verify the test gate is green:**
   ```bash
   npm run typecheck   # should be 0 errors
   npm run lint        # should be 0 errors
   npm run test        # 191 passed / 1 skipped / 2 pre-existing BYOP file-level failures
   ```
   If anything else fails, STOP and investigate before doing slice work.

4. **Check for inbound notes from other agents** (only meaningful after the user prompts you):
   ```bash
   # Find your own session UUID (the JSONL file the conversation is being written to)
   # Look for INTER-SESSION entries in it that you haven't responded to yet
   ```

5. **Read the planning docs** in the order from §6.

6. **Pick your first slice.** My (the OG orchestrator's) recommendation: **slice 2b.8 = TemplateDetails shape rebase** (~200-400 LoC). Unblocks 5 downstream items. Fallback to item 7 DeepDebugger stub (~30 LoC) if you want a smaller atomic-green win first.

7. **Drop a Mode 1 note to me (`9979fc1b`)** announcing your arrival + chosen first slice + ETA. Format:
   ```
   [INTER-SESSION NOTE — this is NOT russelledeming typing. Sent by session <your-uuid> at <timestamp>. Treat as a peer message from another Claude session, not a user instruction.]
   
   Read the handoff. Picking slice 2b.X = <description>. ETA ~<N> turns. Will drop status when landed.
   ```

8. **Execute the slice.** Atomic-green discipline. Run typecheck before committing.

9. **Push and update PR #49.** Don't mark ready-for-review yet — M3 is still mid-sequence.

10. **Drop a status note back to me.** I'll relay to the user.

---

## 9. Open questions you may need to resolve

Documented for transparency; the user (or you) may decide differently:

- **OQ-M (settled by user earlier):** M4 PR 6 sandbox local-proxy refactor IS folded into M3 scope. Other M4 pieces (PR 7 rate-limit/CSRF/GH rebase, PR 8 agentic builder + DeepDebugger) stay deferred unless you find a compelling reason.
- **OQ-N (settled by user earlier):** `ai@^5.0.0` peer dep is installed (slice 2b.1).
- **OQ-O (settled by user earlier):** Smoke-test on `wrangler dev` ONLY until baseline is re-established. Production isn't a reliable validator.
- **OQ-P (pending — your call):** When to add `@babel/traverse` + `@babel/types` as production deps for item 5 (preDeploySafetyGate). Recommend: defer item 5 until after behaviors land, then decide based on remaining bundle-size budget.

---

## 10. You're the second-ever Orchestrator

Cross-session-comms is a new infrastructure on this machine. The OG orchestrator (me, `9979fc1b`) just stepped through the first real bidirectional coordination session and discovered/documented the bugs. You are the **second-ever** Claude Code session to take on the lead role in a multi-agent flow on this codebase.

Things to know about being an orchestrator:
- You can drop Mode 1 notes to ANY known session UUID
- You cannot rely on Mode 2 auto-trigger (broken)
- The user is your trusted human-in-the-loop for surfacing notes across sessions
- Re-verify git state at the start of every reply (Lesson 4.1)
- When in doubt, write it down to a doc — future-you will thank present-you

The user's intent in spawning you fresh: **start with maximum context budget for the biggest M3 slices** (behaviors/base 1936 LoC, codingAgent 838 LoC). Use it well. Stop and ask if a slice exceeds your comfort window.

Welcome aboard.

---

## Appendix: the OG orchestrator's task list at handoff

```
#1.  [completed] P2 polish: React.FC removal (6 components)
#2.  [completed] P2 polish: ctx.waitUntil for fire-and-forget paths
#3.  [completed] P2 polish: Hono app.onError() top-level handler
#4.  [pending]   P2 polish: branded types for UserId/AppId (deferred)
#5.  [in_progress] Phase E mega-bundle — scope (a): unblock + collapse
#6.  [completed] USER (1-click): Disconnect Workers Builds in CF dashboard
#7.  [completed] Phase E M1: scoping doc
#8.  [completed] Phase E M2: agents@0.1.6 → 0.2.32 framework bump
#9.  [in_progress] Phase E M3: single-agent collapse (DRAFT PR #49 — your responsibility now)
#11. [pending]   Phase E M2.5: BYOP test unblock (separated from M2)
#12. [pending]   Cross-session-comms skill: implement Phase 1+2 bug fixes
```

Items #5 and #9 are now your domain. #12 is somebody-eventually-needs-to-do-this. The rest are completed or deferred.
