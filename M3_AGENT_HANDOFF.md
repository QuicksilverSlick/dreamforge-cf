# M3 Handoff

**Anchor date:** 2026-05-22
**Branch:** `chore/phase-e-m3-single-agent-collapse` (draft PR [#49](https://github.com/QuicksilverSlick/dreamforge-cf/pull/49))
**Status:** 14 commits ahead of `main`, CI all-green, test gate at **191 passed / 1 skipped / 2 pre-existing BYOP file-level failures** throughout

This document is the bootstrap for anyone (human contributor or Claude session) picking up M3 commit 2b work. It covers what's landed, what remains, and the foundational discipline that's been learned. **Always run `git log --oneline -10` first** — the doc may be stale by the time you read it; the repo is the source of truth.

---

## 0. Update — 2026-05-26 (read first)

Since the 2026-05-22 anchor:

- **`main` advanced**: PR [#50](https://github.com/QuicksilverSlick/dreamforge-cf/pull/50) merged as `acdfc43` — `fix(routes): restore /api/generated/* handler for AI-generated images`. Pure hotfix; does not touch agent code. M3 branch is **untouched** by it; no rebase needed for slice 2b.13. Plan a rebase before the eventual PR #49 merge.
- **Strategic probe completed**: cloned `cloudflare/vibesdk` HEAD into a sibling dir, ran `bun install` clean (1223 packages). Confirmed:
  - Upstream HEAD pins **identical** sandbox/containers/agents versions to ours (`@cloudflare/sandbox 0.5.6`, `@cloudflare/containers 0.0.28`, `agents ^0.2.32`).
  - Upstream `worker/agents/core/` already has the target shape: `codingAgent.ts`, `behaviors/`, `objectives/`, `features/`, `AgentCore.ts`, `AgentComponent.ts`.
  - The production sandbox-lifecycle bug is **decoupled** from M3 — same dep pin upstream. Sandbox fix is its own work item (M4 PR 6: bump past 0.5.6 + lifecycle refactor) and happens AFTER M3 closes.
- **Decision: Option A — finish M3.** Fresh-start (Option B) would not fix sandbox and would force re-applying our auth/BYOP/Sentry/AI-Gateway/routing hardening. Probe dir deleted.

**Next slice is 2b.13** per design doc `fe45091` (`docs/m3/ICodingBehavior-design.md`).

---

## 1. What's landed in M3 commit 2b

12 atomic-green slices plus a design doc, in order:

| Slice | Commit | Dep-map item | LoC | What |
|---|---|---|---|---|
| 2b.1 | `d29dc7e` | item 3 | +119 | `ai@^5.0.0` peer dep + TemplateDetails widening + `utils/packageSyncer.ts` |
| 2b.2 | `ec6014d` | — | +60 | 6 wire-protocol WS message types (additive) |
| 2b.3 | `e3ed103` | — | +20 | `export` keywords + `InferenceRuntimeOverrides` type |
| 2b.4 | `ca6770d` | item 4 | — | `utils/templateCustomizer.ts` + replace stateMigration fallback |
| 2b.5 | `0e7c7df` | item 6 | — | `operations/SimpleCodeGeneration.ts` |
| 2b.6 | `e296848` | item 14 | — | `objectives/strategies/*` (verbatim port) |
| 2b.7 | `8fe0b55` | — | — | `AbortError` class |
| 2b.8 | `f11c032` | items 1, 2 | +291 | TemplateDetails shape rebase + `sandbox/utils.ts` + scratch template factory |
| 2b.9 | `320b4b0` | item 7 | +33 | `operations/DeepDebugger.ts` stub |
| 2b.10 | `a8ca7bd` | item 9 | +144 | `services/implementations/DeploymentManager.ts` (Option A thin wrapper) |
| 2b.11 | `d2bc5d9` | item 13 | +305 | `core/objectives/base.ts` + GitHub-service adaptation |
| 2b.12 | `ad157c9` | item 8 | +55 | `operations/AgenticProjectBuilder.ts` stub |
| docs | `fe45091` | item 15 prep | +267 | **`docs/m3/ICodingBehavior-design.md`** — design spec for next slice |

Plus various supporting commits (atomic-green fixes, production-reality diagnostic, scoping docs).

---

## 2. Dep-map §8 status

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
| 10 | `behaviors/base.ts` (~1936 LoC) | 🔲 pending — biggest, sub-slice |
| 11 | `behaviors/phasic.ts` (~728 LoC) | 🔲 pending |
| 12 | `behaviors/agentic.ts` (~393 LoC) | 🔲 pending |
| 13 | `objectives/base.ts` + GitHub adapter | ✅ done (2b.11) |
| 14 | `objectives/strategies/*` | ✅ done (2b.6) |
| 15 | `core/codingAgent.ts` (~838 LoC) + `ICodingBehavior` interface | 🔲 **next — slice 2b.13, keystone** |

**Remaining for commit 2b:** items 5, 10, 11, 12, 15. ~4,300 LoC depending on how OQ-P (item 5's Babel decision) lands.

---

## 3. Next slice: 2b.13 — codingAgent.ts + ICodingBehavior interface

**Design spec is committed at `docs/m3/ICodingBehavior-design.md`** (264 lines). Read it first — it has:
- The full TypeScript interface (15 methods, 3 categories: Lifecycle/Accessors/Actions)
- Call-site mapping table (upstream `codingAgent.ts` → fork equivalent)
- All 4 known signature divergences between upstream and fork-`simpleGen` called out
- 5 risk flags

### Settled design questions from review

- **`getTemplateDetails()` throws vs nullable** → **keep throws.** Pre-load on behavior construction; the throw is purely defensive. Document the call-ordering invariant in JSDoc. Don't paper over ordering bugs with `null`-handling.
- **`...rest: unknown[]` on `initialize`** → **keep it.** Forward-compat with agents-SDK subclass-override patterns. One line of doc.
- **Extend a base `IAgentComponent` interface?** → **standalone for now.** Matches existing `DeploymentManager` / `GitVersionControl` pattern. Don't speculate-extract.

**Risk 1 implementation note:** pre-load on construction. Kick off `ensureTemplateDetails()` in the behavior constructor and store the promise; `getTemplateDetails()` blocks awaiting it if not resolved. Async-`getTemplateDetails` would ripple into `onConnect` which currently treats it as sync — avoid.

### Suggested scope

1. Add `ICodingBehavior<TState extends BaseProjectState>` interface to `worker/agents/core/AgentCore.ts`
2. Port `worker/agents/core/codingAgent.ts` (~838 LoC, careful)
3. Test gate must stay green throughout
4. **`simpleGeneratorAgent.ts` MUST NOT regress** — it's still the live runtime path until commit 4
5. One commit

This is one full session's worth of work. **Don't combine with behaviors (items 10–12).** Mid-slice context exhaustion on the keystone slice would leave PR #49 in a broken intermediate state.

---

## 4. Foundational lessons

### 4.1 Lite-port-isn't-lite

Every item in `M3_COMMIT2_DEPMAP.md` §8 labeled "port verbatim" has needed adaptation. Examples that bit:
- Items 1+2 (templates / sandbox utils): reverted from 2b.1 because they required the TemplateDetails shape rebase; landed correctly in 2b.8.
- Item 5 (`preDeploySafetyGate.ts`): dep-map says ~80 LoC, reality is 448 LoC + Babel runtime deps. Still deferred.
- Item 9 (`DeploymentManager`): dep-map says "lift from simpleGen:1397-1700," reality is heavily state-coupled. Option A thin wrapper (144 LoC) was the right call.

**Discipline:** always fetch the upstream file (gh api or check `/tmp/upstream-m3/` cache) and inspect line count + import surface before committing to a slice. Dep-map estimates are unreliable for state-coupled items.

### 4.2 Atomic-green-commits

Every commit on the M3 branch must pass `typecheck + lint + test + build` cleanly. The discipline is enforced via CI checks on PR #49. When a substrate change breaks legacy code (e.g., `simpleGeneratorAgent.ts` mid-port), use the **deprecated-required-field pattern**:

- Add legacy field names back to the new shape as **required** (not optional) with `@deprecated` JSDoc
- Mirror them from canonical names on every state write
- Delete in a later cleanup commit alongside legacy-file deletion

Concrete reference: commit `c77cd70`.

### 4.3 TemplateDetails shape rebase is done — behaviors unblocked

Items 1, 2, 10, 11, 12, 13 all consume `TemplateDetails` through `FileManager` / `GenerationContext`. The shape rebase landed in 2b.8 with `importantFiles?`, `allFiles?`, `projectType`, `disabled`, `renderMode` added as optional fields on the schema. Behaviors port cleanly now.

### 4.4 Production has been broken for ~7 months

Per `M3_PRODUCTION_REALITY.md`: sandbox session lifecycle is broken at the `@cloudflare/sandbox 0.5.6` + `@cloudflare/containers 0.0.28` layer. **Don't smoke-test against production** — production isn't a reliable validator until M3 + M4 PR 6 (sandbox local-proxy refactor) ship. Use `wrangler dev` exclusively.

### 4.5 Verify against upstream before stubbing

Stub commits (items 7, 8) initially failed because the upstream files depend on tool-subsystem types (`AgentOperationWithTools`, `ToolSession`, `ToolCallbacks`) the fork doesn't have. The landed stubs downgrade to fork's `AgentOperation<I, O>` and return `{transcript: '[stub]...'}`. **Always fetch the upstream file before deciding stub-vs-port.**

### 4.6 Item 9 wasn't a lift

`DeploymentManager` was supposed to "lift methods from `simpleGeneratorAgent.ts:1397-1700`." Those methods are heavily state-coupled (`this.state`, `this.broadcast()`, `this.currentDeploymentPromise`, ~8 instance fields). Option A landed: 144-LoC thin wrapper around `BaseSandboxService` with `getSessionId` / `onSessionIdChange` callbacks. State stays in `simpleGen` until behaviors reveal what they actually need. Stateful-coupling refactor deferred. **Dep-map LoC estimates are unreliable for state-coupled items — always read the actual file first.**

### 4.7 GitHubService.exportToGitHub doesn't exist in the fork

Per dep-map §7. Fork uses REST-based `pushFilesToRepository(files, request)` with `FileOutputType[]`; upstream uses git-protocol push via `MemFS` + gitObjects bundle. Slice 2b.11's `objectives/base.ts` rewrites the upstream GitHub export block to use the fork's two-step (`createUserRepository` if needed + `pushFilesToRepository`). `infrastructure.exportGitObjects()` is skipped — fork's git stub returns no commits. Documented as "adapt-not-port" in `M3_COMMIT2_DEPMAP.md` §7.

### 4.8 Use bun, not npm, on Windows

`npm install` fails with `@rolldown/binding-linux-x64-gnu` cross-platform errors. Use:

```bash
"/c/Users/PC owner/.bun/bin/bun.exe" install
```

For lockfile updates and dep additions.

### 4.9 Don't trust in-memory git state

Re-run `git log --oneline -10` and `git status` at the start of every meaningful action. Don't reason from cached recollection of the tree state. The repo is the source of truth.

---

## 5. Operational details

| Concern | Detail |
|---|---|
| Working directory | `C:/Users/PC owner/Desktop/Dreamforge Cloud` |
| Branch | `chore/phase-e-m3-single-agent-collapse` |
| bun binary | `C:/Users/PC owner/.bun/bin/bun.exe` |
| GitHub repo | `QuicksilverSlick/dreamforge-cf` (use `gh` CLI) |
| PR | #49, draft |
| Worker name in CF | `dreamforge-cf` |
| Test gate baseline | 191 passed / 1 skipped / 2 pre-existing BYOP file-level failures |

---

## 6. First-thing-you-do checklist

1. **Verify the tree:**
   ```bash
   cd "C:/Users/PC owner/Desktop/Dreamforge Cloud"
   git status                       # expect clean working tree
   git log --oneline -12             # verify current head
   ```

2. **Pull latest:**
   ```bash
   git pull origin chore/phase-e-m3-single-agent-collapse
   ```

3. **Verify the test gate baseline:**
   ```bash
   "/c/Users/PC owner/.bun/bin/bun.exe" run typecheck   # expect 0 errors
   "/c/Users/PC owner/.bun/bin/bun.exe" run lint        # expect 0 errors
   "/c/Users/PC owner/.bun/bin/bun.exe" run test        # expect 191 / 1 / 2
   ```

4. **Read the planning docs in order:**
   1. This doc (`M3_AGENT_HANDOFF.md`)
   2. `docs/m3/ICodingBehavior-design.md` — the spec for slice 2b.13
   3. `M3_PRODUCTION_REALITY.md` — why production is broken; smoke-test discipline
   4. `M3_COMMIT2_DEPMAP.md` §8 — dep-map shopping list
   5. (Optional) `M3_PORT_PLAN_v2.md` — the overall 9-commit M3 sequence beyond commit 2b

5. **Execute slice 2b.13.** Atomic-green discipline. The design doc + settled OQs are your spec.

6. **After commit lands and pushes, verify CI on PR #49.**

---

## 7. Open architectural questions

| OQ | Question | Status |
|---|---|---|
| OQ-M | M4 PR 6 sandbox local-proxy refactor folded into M3 scope | Settled — yes |
| OQ-N | `ai@^5.0.0` peer dep installed | Settled — 2b.1 |
| OQ-O | Smoke-test on `wrangler dev` only until baseline re-established | Settled — production is broken at sandbox layer |
| OQ-P | Add `@babel/traverse` + `@babel/types` as production deps for item 5 | **Deferred** — decide based on bundle-size budget after behaviors land |
| OQ-Q | When to delete `simpleGeneratorAgent.ts` | Per `CLAUDE.md` — stays alive until commit 4. **Don't touch during commit 2b.** |
| OQ-1/2/3 | ICodingBehavior interface specifics | Settled (see §3) |

---

## 8. Post-2b.13 plan

After the keystone codingAgent slice lands, items 10, 11, 12 (behaviors) implement `ICodingBehavior<PhasicState>` and `ICodingBehavior<AgenticState>`. Item 10 (`behaviors/base.ts` 1936 LoC) is biggest — sub-slice:

- **Sub-slice A:** skeleton + abstract methods + constructor + state management (~600–800 LoC)
- **Sub-slice B:** concrete methods (deploy orchestration, file management, review cycles) (~600–800 LoC)
- **Sub-slice C:** remaining + `phasic.ts` + `agentic.ts` (~500–700 LoC + 728 + 393)

Boundaries flexible; each sub-slice must be atomic-green. The design call on what stays in `base` vs splits to `phasic` / `agentic` is worth careful thought before Sub-slice A.

After items 10–12 land, item 5 (`preDeploySafetyGate`) is the only remaining commit-2b work — OQ-P needs to be settled then.

Past commit 2b, the rest of M3 (commits 3 through 9) is documented in `M3_PORT_PLAN_v2.md`. The big milestone is commit 4 (`simpleGeneratorAgent.ts` deletion) — the moment the new agent architecture goes live.
