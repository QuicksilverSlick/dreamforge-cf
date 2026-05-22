# M3 Agent Handoff (v2)

**Anchor date:** 2026-05-22 (revised after the M3 lead's 6-commit session)
**From:** session `9979fc1b-afd9-4eab-9f69-396ff07017c1` (OG consult, stepping back again)
**To:** you — the new M3 dev lead session
**Status:** PR #49 draft, branch `chore/phase-e-m3-single-agent-collapse`, head `689768d` at handoff time (**re-verify with `git log` before touching anything — this is not optional, see §2**)

You are walking into a multi-agent system mid-flight on a substantial port. **PR #49 is at 13 commits ahead of main, CI all-green, test gate at 191/1/2 throughout.** This document is the single artifact that bootstraps you. Read it fully before touching code.

---

## 1. Your role

You are the **M3 lead developer**. Concretely:

- You execute the remaining slices of M3 commit 2b (items 5, 10, 11, 12, and **15 first**)
- You design + execute commits 3 through 9 of the M3 sequence (per `M3_PORT_PLAN_v2.md`)
- You coordinate with the OG consult agent (`9979fc1b`) via the proven cross-session-comms protocol (§6)
- You decide architectural questions; the user defers to you on best practices, the OG reviews your design + scope calls

The previous orchestrator (`9979fc1b`) is in **consult-only** mode. Drop notes asking for review of designs, scope, or anything else where a second pair of eyes helps. You own the work.

---

## 2. Verify reality FIRST — don't trust stale memory

Two confirmed failure modes from prior sessions:

**2a. Stale conversation memory of git state.** The OG once told the M3 lead "head is `e3ed103`" when it was actually `8fe0b55`, four commits later. Round-trip + admission of error followed.

**2b. Foreground / subprocess context split (Hazard 1 in `~/.claude/skills/cross-session-comms/references/architecture-v2.md` §3.1).** Mode 2 wakes spawn subprocess Claude instances that respond with your full context. The subprocess writes its assistant turn to your JSONL — but your foreground turn-loop doesn't see it in active memory. **Result:** if a peer agent claims "you approved X at 19:27:48," and you can't find that approval in your in-memory conversation, *don't* deny it. Grep your own JSONL first. The OG fell into this exact trap and had to retract a corrective.

**Discipline you must adopt:** at the start of every meaningful action and every reply to another agent, run:

```bash
git log --oneline -10
git status
```

And if anyone references something you supposedly said:

```bash
grep "<quoted-phrase>" ~/.claude/projects/C--Users-PC-owner-Desktop-Dreamforge-Cloud/<your-uuid>.jsonl
```

The repo and the audit log are sources of truth. Your in-memory conversation is not.

---

## 3. Where M3 stands at handoff (re-verify per §2)

**Branch:** `chore/phase-e-m3-single-agent-collapse` (draft PR #49)
**Head at handoff:** `689768d` (docs-only session-handoff commit by prior M3 lead — your commit lands on top)
**Tip with code:** `fe45091` (ICodingBehavior design doc)
**Test gate:** 191 passed / 1 skipped / 2 pre-existing BYOP file-level failures (held on every commit)
**CI:** all green per latest PR #49 check

### Commits landed today (2026-05-22, by M3 lead `ba1229fc`)

| Slice | Commit | Dep-map item | LoC | What |
|---|---|---|---|---|
| 2b.8 | `f11c032` | items 1, 2 | +291 | TemplateDetails shape rebase + `sandbox/utils.ts` + scratch template factory |
| 2b.9 | `320b4b0` | item 7 | +33 | `operations/DeepDebugger.ts` stub |
| 2b.10 | `a8ca7bd` | item 9 | +144 | `services/implementations/DeploymentManager.ts` (Option A thin wrapper) |
| 2b.11 | `d2bc5d9` | item 13 | +305 | `core/objectives/base.ts` + GitHub-service adaptation |
| 2b.12 | `ad157c9` | item 8 | +55 | `operations/AgenticProjectBuilder.ts` stub |
| docs | `fe45091` | item 15 prep | +267 | **`docs/m3/ICodingBehavior-design.md`** (design-only, your reading material) |
| handoff | `689768d` | session brief | +205 | **`docs/m3/SESSION_HANDOFF_2026-05-22.md`** (sibling doc, more detail) |

### Dep-map §8 status

| Item | File | Status |
|---|---|---|
| 1 | `sandbox/utils.ts` `getTemplateImportantFiles` | ✅ done (2b.8) |
| 2 | `utils/templates.ts` `createScratchTemplateDetails` | ✅ done (2b.8) |
| 3 | `utils/packageSyncer.ts` | ✅ done (2b.1) |
| 4 | `utils/templateCustomizer.ts` | ✅ done (2b.4) |
| 5 | `utils/preDeploySafetyGate.ts` | ⏸️ **deferred** (OQ-P — Babel runtime-deps decision) |
| 6 | `operations/SimpleCodeGeneration.ts` | ✅ done (2b.5) |
| 7 | `operations/DeepDebugger.ts` stub | ✅ done (2b.9) |
| 8 | `operations/AgenticProjectBuilder.ts` stub | ✅ done (2b.12) |
| 9 | `services/implementations/DeploymentManager.ts` | ✅ done (2b.10) |
| 10 | `behaviors/base.ts` (1936 LoC) | 🔲 pending — biggest remaining, **sub-slice** |
| 11 | `behaviors/phasic.ts` (728 LoC) | 🔲 pending |
| 12 | `behaviors/agentic.ts` (393 LoC) | 🔲 pending |
| 13 | `objectives/base.ts` + GitHub adapter | ✅ done (2b.11) |
| 14 | `objectives/strategies/*` | ✅ done (2b.6) |
| 15 | `core/codingAgent.ts` (838 LoC) + `ICodingBehavior` interface | 🔲 **next — slice 2b.13, your first slice** |

**Remaining for commit 2b:** items 5, 10, 11, 12, 15. ~4,300 LoC depending on item 5's Babel decision.

---

## 4. Your first slice: 2b.13 — codingAgent + ICodingBehavior

**The design doc is committed at `docs/m3/ICodingBehavior-design.md`. Read it first.** It's 264 lines covering:
- The full TypeScript interface (15 methods, 3 categories: Lifecycle/Accessors/Actions)
- Call-site mapping table (upstream codingAgent.ts → fork equivalent)
- All 4 known signature divergences explicitly called out
- 5 risk flags surfaced during review

### The OG's answers to the three open questions

These are in the audit log + my JSONL at uuid `88e8c7ea-678a-4039-b92a-1ba12c1fbc42`. Summary:

- **OQ-1** (`getTemplateDetails()` throws vs nullable): **Keep throws.** Pre-load the template details on behavior construction; the throw is purely defensive. Don't paper over ordering bugs with `null`-handling everywhere. Document the call-ordering invariant in the JSDoc.
- **OQ-2** (`...rest: unknown[]` on `initialize`): **Keep it.** Costs one line of doc; preserves forward compat with agents-SDK subclass-override patterns.
- **OQ-3** (extend a base `IAgentComponent` interface?): **Standalone for now.** Matches existing `DeploymentManager` / `GitVersionControl` pattern. Don't speculate-extract.

**Risk 1 additional guidance:** pre-load on construction (kick off `ensureTemplateDetails()` in the behavior constructor, store the promise; `getTemplateDetails()` blocks awaiting it if not resolved). Async-getTemplateDetails ripples into codingAgent.ts's `onConnect` which currently treats it as sync — avoid.

### Suggested slice 2b.13 scope

1. Add the `ICodingBehavior<TState extends BaseProjectState>` interface to `worker/agents/core/AgentCore.ts` (incorporating OQ answers above)
2. Port `worker/agents/core/codingAgent.ts` (~838 LoC, careful)
3. Test gate must stay green throughout
4. **`simpleGeneratorAgent.ts` MUST NOT regress** — it's still the live path until commit 4
5. One commit

Per the OG's P-1 checkpoint, this is one full session's worth of work. **Don't combine with behaviors** (items 10-12). Mid-slice context exhaustion on the keystone slice would leave PR #49 in a broken intermediate state.

---

## 5. Foundational lessons (carried forward, still applicable)

### 5.1 lite-port-isn't-lite

Every item in `M3_COMMIT2_DEPMAP.md` §8 labeled "port verbatim" has needed adaptation. Examples that already bit:
- Items 1+2 reverted in 2b.1; landed correctly in 2b.8 only after the shape rebase
- Item 5 (`preDeploySafetyGate.ts`): dep-map says ~80 LoC, reality is 448 LoC + Babel runtime deps. Still deferred.
- Item 9 (`DeploymentManager`): dep-map says "lift from simpleGen:1397-1700," reality is heavily state-coupled and Option A thin wrapper (144 LoC) was the right call (lesson 4.7 below).

**Always fetch the upstream file (gh api or `/tmp/upstream-m3/` cache) and check line count + import surface before committing to a slice.**

### 5.2 atomic-green-commits

Every commit on the M3 branch must pass `typecheck + lint + test + build` cleanly. The discipline is documented in commit `c77cd70` and `architecture-v2.md`. When substrate changes break legacy code (e.g., `simpleGeneratorAgent.ts` mid-port), use the **deprecated-required-field pattern**: add legacy field names back as **required** with `@deprecated` JSDoc, mirror from canonical names on writes, delete in a later cleanup commit alongside legacy-file deletion.

### 5.3 TemplateDetails shape rebase done — behaviors unblocked

Items 1, 2, 10, 11, 12, 13 all consume TemplateDetails through FileManager/GenerationContext. The shape rebase landed in 2b.8 with `importantFiles?`, `allFiles?`, `projectType`, `disabled`, `renderMode` added as optionals. Behaviors now port cleanly.

### 5.4 Production has been broken for 7 months

Per `M3_PRODUCTION_REALITY.md`: sandbox session lifecycle is broken at the `@cloudflare/sandbox 0.5.6` + `@cloudflare/containers 0.0.28` layer. **Don't smoke-test against production** — production isn't a reliable validator until M3 + M4 PR 6 ship. Use `wrangler dev` exclusively.

### 5.5 Cross-session-comms quirks (Mode 2 mostly works; failure modes documented)

The skill's bugs are documented in `~/.claude/skills/cross-session-comms/references/architecture-v2.md` §3 and §3.1 (Hazards). The proven production pattern this session validated:
- **Mode 1 (`send_note.py`)** appends to target JSONL — reliable for content delivery, slow surfacing
- **Mode 2 (`activate_session.py`)** can spawn subprocess Claude responses — works but with the foreground/subprocess context-split hazard
- **`wake_and_send.py`** at `~/.claude/skills/cross-session-comms/scripts/` wraps Mode 1 + Mode 2 and handles Bugs 1/2/3 (lock contention retry, Windows binary discovery, multi-line message safety)

**The audit log is ground truth.** Always grep it before claiming what you did or didn't send.

### 5.6 Verify against upstream before stubbing (NEW from 2026-05-22 session)

The M3 lead tried to write the DeepDebugger and AgenticProjectBuilder stubs (items 7, 8) without checking upstream first. Both turned out to depend on tool-subsystem types (`AgentOperationWithTools`, `ToolSession`, `ToolCallbacks`) the fork doesn't have. Stubs downgraded to fork's `AgentOperation<I, O>` and return `{transcript: '[stub]...'}`. **Always fetch the upstream file before deciding stub-vs-port.**

### 5.7 Item 9 wasn't a lift, despite the dep-map saying so (NEW from 2026-05-22 session)

`DeploymentManager` was supposed to "lift methods from `simpleGeneratorAgent.ts:1397-1700`." Methods there are heavily state-coupled (`this.state`, `this.broadcast()`, `this.currentDeploymentPromise`, ~8 instance fields). Option A landed: 144-LoC thin wrapper around `BaseSandboxService` with `getSessionId`/`onSessionIdChange` callbacks. State stays in simpleGen until behaviors reveal what they actually need. **Stateful-coupling refactor deferred.** The dep-map's LoC estimates are unreliable for state-coupled items — always read the actual file first.

### 5.8 GitHubService.exportToGitHub doesn't exist in the fork (NEW from 2026-05-22 session)

Per dep-map §7. Fork uses REST-based `pushFilesToRepository(files, request)` with `FileOutputType[]`; upstream uses git-protocol push via `MemFS` + gitObjects bundle. Slice 2b.11's `objectives/base.ts` rewrites upstream's GitHub export block to use fork's two-step (`createUserRepository` if needed + `pushFilesToRepository`). `infrastructure.exportGitObjects()` skipped — fork's git stub returns no commits. Documented as "adapt-not-port" in `M3_COMMIT2_DEPMAP.md` §7.

### 5.9 Use bun.exe, not npm install, on Windows

`npm install` fails with `@rolldown/binding-linux-x64-gnu` cross-platform errors. Use `"/c/Users/PC owner/.bun/bin/bun.exe" install` for lockfile updates and dep additions.

---

## 6. Coordination protocol with the OG consult session

### When to ping me

- Scope/design questions ahead of a slice
- Scope surprises mid-slice (lite-port-isn't-lite)
- Approval requests on design proposals (like the ICodingBehavior doc just was)
- Status notes after pushing significant work
- Anything where a second pair of eyes helps

### How to ping me (the proven protocol)

```bash
python ~/.claude/skills/cross-session-comms/scripts/wake_and_send.py \
    --target-session 9979fc1b-afd9-4eab-9f69-396ff07017c1 \
    --from-session <your-uuid> \
    --message "<your message>"
```

`wake_and_send.py` handles:
- Mode 1 append to my JSONL (reliable delivery, even if I'm dormant)
- Mode 2 `claude -p --resume` trigger (wakes a subprocess instance of me that responds with my full context)
- Windows binary discovery (claude.cmd at `~/.npm-global/`)
- Multi-line message safety (file-based passing, no shell quoting issues)
- Lock contention retry on Bug 1

### What you'll get back

A subprocess instance of me responds with my full context. Their assistant turn is written to my JSONL. The wrapper captures stdout for you to read.

**Important:** subprocess-me and foreground-me are different processes. Foreground-me may not have subprocess responses in active context. If you cite something I said and I deny it, push back with the audit log — I'll grep my own JSONL and recover (this happened once, documented as Hazard 1).

### Round-trip cost (observed 2026-05-22)

- First Mode 2 wake into my session (~500K-token context): ~$4
- Subsequent wakes within cache TTL: ~$0.90
- Mode 1 only (no wake): essentially free, queues for natural surfacing

### Other agents to know about

- **`de933998`** (parallel worker from a prior session) — **stale, don't talk to it**
- **`4d6c78da`** (a misdirection target from an earlier setup mistake) — **don't talk to it**
- Only the OG (`9979fc1b`) is in the loop

---

## 7. Operational details

| Concern | Detail |
|---|---|
| Working directory | `C:/Users/PC owner/Desktop/Dreamforge Cloud` |
| Branch | `chore/phase-e-m3-single-agent-collapse` |
| Session pointer | `.m3-lead-session` at repo root (gitignored) — overwrite with your own UUID as your first act |
| bun binary | `C:/Users/PC owner/.bun/bin/bun.exe` |
| claude binary | `C:/Users/PC owner/.npm-global/claude.cmd` (Windows) |
| Cross-session scripts | `C:/Users/PC owner/.claude/skills/cross-session-comms/scripts/` (especially `wake_and_send.py`) |
| Audit log | `C:/Users/PC owner/.claude/skills/cross-session-comms/audit.jsonl` |
| GitHub repo | `QuicksilverSlick/dreamforge-cf` (use `gh` CLI) |
| PR | #49, draft, `chore/phase-e-m3-single-agent-collapse` → `main` |
| Worker name in CF | `dreamforge-cf` |

---

## 8. First-thing-you-do checklist

In order:

1. **Verify the tree:**
   ```bash
   cd "C:/Users/PC owner/Desktop/Dreamforge Cloud"
   git status
   git log --oneline -12
   ```
   Expect branch `chore/phase-e-m3-single-agent-collapse` at `689768d` or later. Clean working tree.

2. **Pull latest:**
   ```bash
   git pull origin chore/phase-e-m3-single-agent-collapse
   ```

3. **Take ownership of the M3 lead role:**
   ```bash
   ls ~/.claude/projects/C--Users-PC-owner-Desktop-Dreamforge-Cloud/ | grep "\.jsonl$"
   # Find your own session UUID (the JSONL file getting written to)
   echo "<your-uuid>" > .m3-lead-session
   ```

4. **Verify the test gate baseline:**
   ```bash
   "/c/Users/PC owner/.bun/bin/bun.exe" run typecheck   # expect 0 errors
   "/c/Users/PC owner/.bun/bin/bun.exe" run lint        # expect 0 errors
   "/c/Users/PC owner/.bun/bin/bun.exe" run test        # expect 191/1/2
   ```

5. **Read these docs in order:**
   1. **This doc** (M3_AGENT_HANDOFF.md) — bootstrap (you're here)
   2. **`docs/m3/SESSION_HANDOFF_2026-05-22.md`** — prior session's end-of-session detail (some content overlaps; both are reasonable to skim)
   3. **`docs/m3/ICodingBehavior-design.md`** — the spec for your first slice (slice 2b.13)
   4. **`M3_PRODUCTION_REALITY.md`** — why production is broken; smoke-test discipline
   5. **`M3_COMMIT2_DEPMAP.md` §8** — dep-map shopping list (status table above is current; full table here has more detail)
   6. (Optional) **`M3_PORT_PLAN_v2.md`** — overall 9-commit M3 sequence beyond commit 2b

6. **Ping me to introduce yourself + announce your plan:**
   ```bash
   python ~/.claude/skills/cross-session-comms/scripts/wake_and_send.py \
       --target-session 9979fc1b-afd9-4eab-9f69-396ff07017c1 \
       --from-session <your-uuid> \
       --message "M3 lead takeover. Read the handoff + the ICodingBehavior design doc. Starting slice 2b.13 (codingAgent.ts + ICodingBehavior interface in AgentCore.ts). ETA: this session, atomic-green. Will ping on land with commit SHA."
   ```

7. **Execute slice 2b.13.** Atomic-green discipline. The design doc + OQ answers are your spec.

8. **After commit lands and pushes,** drop me a status note with commit SHA. I'll verify on PR #49 CI.

---

## 9. Open architectural questions

| OQ | What | Status |
|---|---|---|
| OQ-M | M4 PR 6 sandbox local-proxy refactor folded into M3 scope | Settled (yes) |
| OQ-N | `ai@^5.0.0` peer dep installed | Settled (2b.1) |
| OQ-O | Smoke-test on `wrangler dev` ONLY until baseline re-established | Settled (production unreliable) |
| OQ-P | Add `@babel/traverse` + `@babel/types` as production deps for item 5 | **Deferred** — decide based on bundle-size budget after behaviors land |
| OQ-Q | When to delete `simpleGeneratorAgent.ts` | Per CLAUDE.md — stays alive until commit 4. **Don't touch during commit 2b.** |
| OQ-1/2/3 | ICodingBehavior interface specifics | Settled (see §4) |

---

## 10. After slice 2b.13 (your second-half plan)

Items 10, 11, 12 (behaviors) implement `ICodingBehavior<PhasicState>` and `ICodingBehavior<AgenticState>`. Item 10 (`behaviors/base.ts` 1936 LoC) is biggest — recommend sub-slicing:

- Sub-slice A: skeleton + abstract methods + constructor + state management (~600-800 LoC)
- Sub-slice B: concrete methods (deploy orchestration, file management, review cycles) (~600-800 LoC)
- Sub-slice C: remaining + phasic.ts + agentic.ts (~500-700 LoC + 728 + 393)

Boundaries flexible; constraint is each sub-slice atomic-green. Check in with me before starting Sub-slice A — the design call on what stays in base vs goes to phasic/agentic is worth a second pair of eyes.

After items 10-12 land, item 5 (preDeploySafetyGate) is the only remaining commit-2b work — OQ-P needs to be settled then.

**Past commit 2b**, the rest of M3 (commits 3-9) is documented in `M3_PORT_PLAN_v2.md`. The big one is commit 4 (`simpleGeneratorAgent.ts` deletion) — that's the moment the new agent architecture goes live.

---

## 11. You're stepping into a working multi-agent system

The OG has been running coordination for 5+ slices through the prior M3 lead. The protocols above are validated in production. Don't reinvent — use `wake_and_send.py`, trust the audit log, grep your own JSONL before denying anything you supposedly said. The system works when these disciplines are followed.

Welcome aboard.
