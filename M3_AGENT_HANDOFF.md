# M3 Handoff

**Anchor date:** 2026-05-22
**Branch:** `chore/phase-e-m3-single-agent-collapse` (draft PR [#49](https://github.com/QuicksilverSlick/dreamforge-cf/pull/49))
**Status:** commit 2b **COMPLETE** at HEAD `9be5cc0` (see §0 "commit 2b COMPLETE" update); test gate at **191 passed / 1 skipped / 2 pre-existing BYOP file-level failures** throughout. Next: commit 3 (flip `CodeGenObject` binding). Rebase onto `main` before the commit-3 work.

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

### Update — 2026-05-29

Slices 2b.13 → 2b.16 all landed. Gates verified green at HEAD `dc33191`:
- typecheck 0 / lint 0 / test 191 passed / 1 skipped / 2 pre-existing BYOP file-level failures (baseline).

**Topology landed (items 13, 14, 15 fully done; items 10, 11, 12 structurally done).** Slice 2b.13 added `ICodingBehavior<TState>` to `AgentCore.ts` and ported `codingAgent.ts`. Slices 2b.14 + 2b.15 landed `BaseCodingBehavior` sub-slices A and B (scaffolding/lifecycle/accessors + 5 concrete action methods). Slice 2b.16 landed `PhasicCodingBehavior` (411 LoC) + `AgenticCodingBehavior` (342 LoC) and wired the factory in `CodeGeneratorAgent.onStart`. `simpleGeneratorAgent.ts` remains the live runtime path (commit 4 will flip it).

**Deferred runtime work still inside commit 2b** (per 2b.15 + 2b.16 commit messages):
- `BaseCodingBehavior` execution helpers — `executeCommands`, `saveExecutedCommands`, `syncPackageJsonFromSandbox`, `runStaticAnalysisCode`, `applyDeterministicCodeFixes`, screenshot capture, deep-debug machinery, file regeneration internals, the `onAfterSetupCommands` hook.
- `PhasicCodingBehavior.build()` — phase state machine — currently throws `"not yet ported"`.
- `AgenticCodingBehavior.build()` — agentic loop — currently throws `"not yet ported"`. Depends on a real `AgenticProjectBuilderOperation` (today only a stub from 2b.12); the real operation is likely M4 territory, so `build()` here probably stays as a documented stub for commit 2b.
- `initializeAsync` (upstream's parallel deploy + setup commands + README gen) — depends on `executeCommands` + `generateReadme`.

**Two slices remain in commit 2b:**
- **Slice 2b.17 — build() port + execution helpers** (see rewritten §3 below). The big runtime slice that takes `PhasicCodingBehavior.build()` from stub to real and lands the deferred base-class helpers it depends on.
- **Slice 2b.18 — `preDeploySafetyGate.ts` (item 5, ~448 LoC)** + four explicit Babel deps (see rewritten §8 below). Standalone utility; consumed by `build()`.

**OQ-P resolved (2026-05-29) — add as explicit production deps.** Evidence: our fork's `worker/services/code-fixer/utils/ast.ts:6-9` already imports `@babel/parser`, `@babel/traverse`, `@babel/generator`, `@babel/types`; they ship in the worker bundle today as **transitive** deps (not declared in `package.json`). preDeploySafetyGate uses the same four packages → zero new bundle weight. Making them explicit also fixes a latent fragility (a transitive change could currently break the worker bundle silently). Applies to slice 2b.18.

**Sequencing note:** the next session can either (a) land 2b.18 first so 2b.17's `build()` can call the real safety gate, or (b) land 2b.17 first with an inline safety-gate stub and wire to the real impl in 2b.18. (a) keeps each slice atomic-green with clean call surfaces; (b) front-loads the bigger slice. The implementing session should choose based on the build() port's actual call shape — read the upstream `behaviors/phasic.ts:build()` first.

### Update — 2026-05-29 (continued) — **commit 2b COMPLETE**

Slices 2b.18 + 2b.17 (a/b/c) all landed via sequencing option (a). Gates verified green at HEAD `9be5cc0`: typecheck 0 / lint 0 / test 191 passed / 1 skipped / 2 pre-existing BYOP file-level failures (baseline held after every commit).

Commits since `0093fa1`:
- `c49c4cc` **2b.18** — `worker/agents/utils/preDeploySafetyGate.ts` (448 LoC, verbatim port — all five fork import targets matched upstream shapes, no adapter needed) + the four Babel packages declared as explicit prod deps, **pinned to exact resolved versions** (`@babel/parser` 7.28.4, `@babel/traverse` 7.28.4, `@babel/generator` 7.28.3, `@babel/types` 7.28.4). Note: `^`-ranges drift to 7.29.x and change the worker bundle — exact pins are required to honor OQ-P's "zero bundle weight" intent.
- `5c657ba` chore — untrack the `.upstream-*.ts` port-reference scratch files (accidentally staged into 2b.17a via `git add -A`) + gitignore the pattern.
- `98cf804` **2b.17a** — the five `BaseCodingBehavior` execution helpers on the `build()` critical path: `runStaticAnalysisCode`, `applyDeterministicCodeFixes`, `fetchAllIssues`, `executeCommands` (protected), `deleteFiles`. **Lifted from `simpleGeneratorAgent.ts`, not upstream `behaviors/base.ts`** — the upstream versions depend on a `deploymentManager` member, a `staticAnalysisCache` field, the **missing `InMemoryAnalyzer`**, and a 2-arg synchronous `fixProjectIssues`. The fork's are sandbox-service-backed with 3-arg async `fixProjectIssues(files, issues, fileFetcher)`.
- `73fa23c` **2b.17b** — `PhasicCodingBehavior.build()` flipped from stub to the real upstream phase state machine (`launchStateMachine` + 4 `execute*` + `generateNextPhase` + `implementPhase` + `applyFastSmartCodeFixes` + `createNewIncompletePhase`/`markPhaseComplete`). Runs `runPreDeploySafetyGate` over each phase's files before deploy.
- `9be5cc0` **2b.17c** — `AgenticCodingBehavior.build()` formalized as a documented stub for all of commit 2b (real `AgenticProjectBuilderOperation` is M4; factory only ever routes to phasic until then).

**Read-build()-first paid off (key learning for the next session).** Reading upstream `phasic.ts:build()` before porting revealed the *minimal* base-helper closure is only FIVE methods. The other ~25 deferred `base.ts` helpers (screenshots, deep-debug, `generateFiles`, regeneration internals, `saveExecutedCommands`, `syncPackageJsonFromSandbox`, `getModelConfigsInfo`, `generateReadme`, `deployPreview`, `initializeAsync`, …) serve **WS handlers that still route through the live `simpleGeneratorAgent` until commit 3/4** — they are NOT on the phasic `build()` path, so deferring them kept 2b.17 tight. Port them as commit-3 reveals what the live `CodeGeneratorAgent` actually needs.

**Adaptation decisions captured in commit messages** (read them — they document the fork-vs-upstream divergences for each method): fork `PhaseGenerationInputs` has no `isFinal`; `getInferenceContext().enableRealtimeCodeFix`/`enableFastSmartCodeFix`; single-arg `saveGeneratedFiles`; 4-arg `deployToSandbox`; `getAllFiles()` not `getAllRelevantFiles()`; `executeFinalizing` ported verbatim preserving upstream's (quirky-but-identical) `setMVPGenerated()` guard.

**Next: commit 3** — flip `CodeGenObject` DO class from `SimpleCodeGeneratorAgent` → `CodeGeneratorAgent` (see §9). This is where the deferred base helpers + WS-routing widening get revealed. Rebase onto `main` first (PR [#50](https://github.com/QuicksilverSlick/dreamforge-cf/pull/50) `acdfc43` is in `main`; the branch hasn't been rebased yet).

---

## 1. What's landed in M3 commit 2b

16 atomic-green slices plus a design doc, in order:

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
| docs | `fe45091` | item 15 prep | +267 | **`docs/m3/ICodingBehavior-design.md`** — design spec for 2b.13 |
| 2b.13 | `f17c64e` | item 15 | +1,060 | `codingAgent.ts` (~874 LoC) + `ICodingBehavior<TState>` interface in `AgentCore.ts` |
| 2b.14 | `4eb82fa` | item 10 (A) | — | BaseCodingBehavior sub-slice A — scaffolding/lifecycle/accessors + abstract method declarations |
| 2b.15 | `5ee7365` | item 10 (B) | +518 | BaseCodingBehavior sub-slice B — concrete impls for 5 ICodingBehavior action methods |
| 2b.16 | `dc33191` | items 11+12 | +753 | `behaviors/phasic.ts` (411 LoC) + `behaviors/agentic.ts` (342 LoC) + factory wire-up in `CodeGeneratorAgent.onStart` |

Plus various supporting commits (atomic-green fixes, production-reality diagnostic, scoping docs).

---

## 2. Dep-map §8 status

| Item | File | Status |
|---|---|---|
| 1 | `sandbox/utils.ts` `getTemplateImportantFiles` | ✅ done (2b.8) |
| 2 | `utils/templates.ts` `createScratchTemplateDetails` | ✅ done (2b.8) |
| 3 | `utils/packageSyncer.ts` | ✅ done (2b.1) |
| 4 | `utils/templateCustomizer.ts` | ✅ done (2b.4) |
| 5 | `utils/preDeploySafetyGate.ts` | ✅ done (2b.18 `c49c4cc`) |
| 6 | `operations/SimpleCodeGeneration.ts` | ✅ done (2b.5) |
| 7 | `operations/DeepDebugger.ts` stub | ✅ done (2b.9) |
| 8 | `operations/AgenticProjectBuilder.ts` stub | ✅ done (2b.12) — real impl is M4 |
| 9 | `services/implementations/DeploymentManager.ts` | ✅ done (2b.10) |
| 10 | `behaviors/base.ts` (~1936 LoC) | ✅ build()-critical done (2b.14 A + 2b.15 B + 2b.17a `98cf804`); ~25 non-build()-path helpers (screenshots, deep-debug, generateFiles, regeneration, etc.) deferred to **commit 3** as the live `CodeGeneratorAgent` reveals what it needs |
| 11 | `behaviors/phasic.ts` (~728 LoC) | ✅ done — `build()` phase state machine landed (2b.16 shell + 2b.17b `73fa23c`) |
| 12 | `behaviors/agentic.ts` (~393 LoC) | ✅ done — `build()` is a documented stub for commit 2b (2b.16 shell + 2b.17c `9be5cc0`); real agentic loop is M4 |
| 13 | `objectives/base.ts` + GitHub adapter | ✅ done (2b.11) |
| 14 | `objectives/strategies/*` | ✅ done (2b.6) |
| 15 | `core/codingAgent.ts` (~838 LoC) + `ICodingBehavior` interface | ✅ done (2b.13) |

**Commit 2b is COMPLETE** (as of HEAD `9be5cc0`, 2026-05-29). All §8 dep-map items are landed: 2b.17 (a/b/c) and 2b.18 closed out items 5, 10 (build()-critical), 11, 12. M3 now advances to **commit 3** (wire-up: `CodeGenObject` switches from `SimpleCodeGeneratorAgent` → `CodeGeneratorAgent`) per `M3_PORT_PLAN_v2.md` and §9 below. See the "commit 2b COMPLETE" update under §0 for the full commit list, adaptation decisions, and the deferred non-build()-path base helpers.

---

## 3. Next slice: 2b.17 — `build()` port + `BaseCodingBehavior` execution helpers

This is the big runtime slice. It takes `PhasicCodingBehavior.build()` from "not yet ported" stub to real phase state machine, lands the deferred `BaseCodingBehavior` execution helpers that `build()` depends on, and decides how to handle `AgenticCodingBehavior.build()` for commit 2b.

### Upstream sources

| Slice target | Upstream file | Approximate scope |
|---|---|---|
| `BaseCodingBehavior` deferred helpers | `cloudflare/vibesdk` `worker/agents/core/behaviors/base.ts` — the portions of the file not landed in 2b.14/2b.15 | execution helpers + static analysis + screenshot + deep-debug + regeneration internals |
| `PhasicCodingBehavior.build()` | `cloudflare/vibesdk` `worker/agents/core/behaviors/phasic.ts` `build()` method + adjacent helpers | phase state machine |
| `AgenticCodingBehavior.build()` | `cloudflare/vibesdk` `worker/agents/core/behaviors/agentic.ts` `build()` + agentic loop | agentic loop (likely deferred — see below) |

Fetch each via `gh api repos/cloudflare/vibesdk/contents/<path>` and base64-decode the `content`.

### Suggested scope

This may need to **sub-slice further** depending on actual LoC and dependency closure. The implementing session should evaluate after reading the upstream files. Tentative breakdown:

1. **2b.17 (sub-slice A) — BaseCodingBehavior execution helpers.** Port the deferred helpers from upstream `behaviors/base.ts`: `executeCommands`, `saveExecutedCommands`, `syncPackageJsonFromSandbox`, `runStaticAnalysisCode`, `applyDeterministicCodeFixes`, screenshot capture, deep-debug machinery, file regeneration internals, the `onAfterSetupCommands` hook. No call-site wiring yet beyond what already exists.
2. **2b.17 (sub-slice B) — `PhasicCodingBehavior.build()` phase state machine.** Port the upstream `build()` method using the helpers from sub-slice A. The deep-debug + regeneration helpers from sub-slice A are now consumed.
3. **2b.17 (sub-slice C) — `AgenticCodingBehavior.build()` decision.**
   - The upstream agentic loop calls `AgenticProjectBuilderOperation.execute()`. Our fork has only the **stub** from 2b.12 (`{transcript: '[stub] AgenticProjectBuilderOperation not yet ported'}`). A real port is M4 territory.
   - **Recommendation:** keep `AgenticCodingBehavior.build()` as a documented stub for commit 2b (`throw new Error('Agentic mode requires real AgenticProjectBuilderOperation — see M3_PORT_PLAN_v2.md commit ?')`). Wire-up will only ever route to `PhasicCodingBehavior` until M4 ports the real operation.
   - If the implementing session disagrees, justify in the commit message — `PhasicCodingBehavior` is the live agentic path post-commit 4 either way.

If sub-slice A alone exceeds ~600 LoC, land it as its own commit (`2b.17a`) and recurse the same A/B/C boundaries for B and C.

### Sequencing vs slice 2b.18 (preDeploySafetyGate)

`PhasicCodingBehavior.build()` calls `runPreDeploySafetyGate`. Two options:

- **(a) Land 2b.18 first** (small, standalone). Then 2b.17 sub-slice B calls the real `runPreDeploySafetyGate`. Simpler call surface, each slice atomic-green.
- **(b) Land 2b.17 first** with an inline safety-gate stub at the call site, then 2b.18 replaces the stub. Bigger 2b.17 risk; cleaner if the build() port turns out NOT to call the safety gate after all.

**Recommendation: (a).** 2b.18 is standalone, ~448 LoC, single-session. Land it first to give 2b.17 a real safety-gate call surface from the start. The implementing session should read upstream `phasic.ts:build()` first to confirm `runPreDeploySafetyGate` is actually called — if not, (b) is fine.

### Discipline (applies to every sub-slice)

- Test gate must stay green at baseline (191 / 1 / 2 BYOP) after each sub-slice commit.
- `simpleGeneratorAgent.ts` MUST NOT regress — still the live runtime path until commit 4.
- Commit message format matches prior slices: `feat(m3): slice 2b.17 — <sub-slice scope> (item 10/11 runtime)`.

### Lite-port traps to watch

- Upstream `executeCommands` / `runStaticAnalysisCode` / `applyDeterministicCodeFixes` may depend on sandbox-tool types (`AgentOperationWithTools`, `ToolSession`, `ToolCallbacks`) the fork doesn't have. Per §4.5: if so, adapt with fork's `AgentOperation<I, O>` or downgrade to thin pass-through.
- Static-analysis cache lifecycle (per 2b.15 deferred notes: `staticAnalysisCache`) — check whether the cache is per-behavior-instance or per-state. Upstream likely has the answer in `base.ts`.
- Per §4.5: always fetch the upstream file and inspect imports + state-coupling BEFORE deciding port-vs-adapt.

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
   1. This doc (`M3_AGENT_HANDOFF.md`) — focus on §0 update, §3 (slice 2b.17), §8 (slice 2b.18)
   2. `docs/m3/ICodingBehavior-design.md` — landed in slice 2b.13; still useful context for the behavior interface surface
   3. `M3_PRODUCTION_REALITY.md` — why production is broken; smoke-test discipline
   4. `M3_COMMIT2_DEPMAP.md` §8 — dep-map shopping list
   5. (Optional) `M3_PORT_PLAN_v2.md` — the overall 9-commit M3 sequence beyond commit 2b

5. **Execute slice 2b.17** (`build()` port + execution helpers) per §3, or **slice 2b.18** (preDeploySafetyGate) per §8 if you're going (a) per §3's sequencing note. Atomic-green discipline. Each sub-slice of 2b.17 commits separately.

6. **After commit lands and pushes, verify CI on PR #49.**

---

## 7. Open architectural questions

| OQ | Question | Status |
|---|---|---|
| OQ-M | M4 PR 6 sandbox local-proxy refactor folded into M3 scope | Settled — yes |
| OQ-N | `ai@^5.0.0` peer dep installed | Settled — 2b.1 |
| OQ-O | Smoke-test on `wrangler dev` only until baseline re-established | Settled — production is broken at sandbox layer |
| OQ-P | Add `@babel/parser`+`@babel/traverse`+`@babel/generator`+`@babel/types` as explicit production deps for item 5 | **Resolved 2026-05-29 — yes, add explicit.** Evidence: `worker/services/code-fixer/utils/ast.ts:6-9` already imports the same four packages; they ship in the worker bundle today via transitive resolution. Zero new bundle weight, fixes latent transitive-bump fragility. |
| OQ-Q | When to delete `simpleGeneratorAgent.ts` | Per `CLAUDE.md` — stays alive until commit 4. **Don't touch during commit 2b.** |
| OQ-1/2/3 | ICodingBehavior interface specifics | Settled (see §3) |

---

## 8. Slice 2b.18 — `preDeploySafetyGate.ts` (item 5, closes commit 2b)

**Upstream source:** `cloudflare/vibesdk` `main` `worker/agents/utils/preDeploySafetyGate.ts` (14,527 bytes / ~448 LoC). Fetch via `gh api repos/cloudflare/vibesdk/contents/worker/agents/utils/preDeploySafetyGate.ts` and base64-decode `.content`.

### OQ-P decision recap (resolved 2026-05-29)

The four Babel packages (`@babel/parser`, `@babel/traverse`, `@babel/generator`, `@babel/types`) are **already in the worker bundle today** via transitive resolution (`worker/services/code-fixer/utils/ast.ts:6-9` imports them and they resolve at build time). Slice 2b.18 makes the transitive deps explicit — same packages, same bundle, more durable. See §7 OQ-P for the full evidence.

### Suggested scope (single commit)

1. **Declare deps explicitly** in `package.json` `dependencies`:
   - `@babel/parser`, `@babel/traverse`, `@babel/generator`, `@babel/types` — pin to the versions transitively resolved today. Run `"C:/Users/PC owner/.bun/bin/bun.exe" pm ls @babel/traverse @babel/types @babel/parser @babel/generator` first to capture the exact versions to pin.
2. **Port `worker/agents/utils/preDeploySafetyGate.ts`** from upstream verbatim where possible. Reuses fork's existing `worker/services/code-fixer/utils/ast.ts` (parseCode/generateCode) — same import that upstream uses, so no adapter layer.
3. **Verify call sites.** Grep first: `Grep "runPreDeploySafetyGate|preDeploySafetyGate" worker/agents/`. If 2b.17 already landed and wired through to a stub, replace the stub with the real `runPreDeploySafetyGate` call. If 2b.17 hasn't landed, the port adds the utility for 2b.17 to consume.
4. **Test gate must stay green** at baseline (191 / 1 / 2 BYOP).
5. **`simpleGeneratorAgent.ts` MUST NOT regress** — still the live runtime path until commit 4.
6. One commit. Message format: `feat(m3): slice 2b.18 — preDeploySafetyGate + explicit Babel deps (item 5, closes commit 2b)`.

### Lite-port traps to watch

- Upstream imports `RealtimeCodeFixer` from `'../assistants/realtimeCodeFixer'`. Confirm fork has this file. If absent or shape-divergent → adapt-not-port.
- Upstream imports `InferenceContext` from `'../inferutils/config.types'`. Confirm this is the same shape in the fork.
- Per §4.5: always fetch the upstream file and inspect imports BEFORE deciding port-vs-adapt.

---

## 9. Post-commit-2b plan (commits 3 → 9)

After slices 2b.17 + 2b.18 land, **commit 2b is complete** and M3 advances:

- **Commit 3** — flip `CodeGenObject` Durable Object class from `SimpleCodeGeneratorAgent` → `CodeGeneratorAgent`. WS-message routing widening, GitVersionControl + Vault adaptations that 2b.13 marked as transitional, and any remaining wire-up surface revealed once the new agent goes live behind the binding.
- **Commit 4** — delete `simpleGeneratorAgent.ts`. The deprecated-required-field pattern (§4.2) gets cleaned up alongside the file deletion. This is the moment the new architecture goes live in production.
- **Commits 5–9** — per `M3_PORT_PLAN_v2.md`. Includes BYOP test unblock (task #11), the CF May-2026 substrate improvements (Sentry RPC trace propagation, compat-date bump, streamGenAiSpans), and final consolidation.

---

## 10. Commit 3 — detailed plan + recon (IN PROGRESS, started 2026-05-29)

**Decision recorded:** commit 3 proceeds as **DO-surface groundwork with the live binding flip HELD for explicit user sign-off** (the flip is an outward-facing production cutover). `simpleGeneratorAgent.ts` stays the live path throughout commit-3 groundwork.

### Recon findings (upstream model — fetched & inspected 2026-05-29)

Cache the upstream reference files locally (gitignored `.upstream-*.ts`): `gh api repos/cloudflare/vibesdk/contents/worker/agents/core/{codingAgent,websocket}.ts` and `worker/agents/core/behaviors/base.ts`.

- **Current binding**: `worker/index.ts:2,17` exports `CodeGeneratorAgent = Sentry.instrumentDurableObjectWithSentry(..., SmartCodeGeneratorAgent)`. `SmartCodeGeneratorAgent extends SimpleCodeGeneratorAgent` (thin subclass, empty `builderLoop`). So the live DO is effectively SimpleCodeGeneratorAgent. The flip retargets this export to the **new** `CodeGeneratorAgent` class in `worker/agents/core/codingAgent.ts`.
- **New `CodeGeneratorAgent`** (`codingAgent.ts:123`, `extends Agent<Env, AgentState> implements AgentInfrastructure`): already has `onStart`, `onConnect` (captures CF token cookie + sends `AGENT_CONNECTED`), `saveToDatabase`, `clearConversation`, `deployProject`, `getBehavior`, `getConversationState`, `getWebSockets`, `handleUserInput`, `broadcast`. `setState` is inherited from `Agent`. **Gaps:** `onMessage` is a no-op STUB; `onClose` is a no-op; **no `fetch`/`handleWebhook`**; missing `executeTerminalCommand`, `handleVaultLocked`, `handleVaultUnlocked`.
- **WS routing model** (the lynchpin): upstream `websocket.ts` (340 LoC) is typed against the new `CodeGeneratorAgent` directly and calls a SLIM surface: `agent.{setState,state,getBehavior,deployProject,handleUserInput,clearConversation,handleVaultUnlocked,handleVaultLocked,getConversationState}` + `agent.getBehavior().{isCodeGenerating,generateAllFiles,deployToSandbox,captureScreenshot,cancelCurrentInference,getModelConfigsInfo,getDeepDebugSessionState}`. The fork's LIVE `websocket.ts` is typed against `SimpleCodeGeneratorAgent` and calls a different/older surface — **so the two handlers must COEXIST**; port upstream's as a separate module (e.g. don't overwrite the live one), wire only the new agent's `onMessage`/`onClose` to it, and delete the old one in commit 4.
- **Webhooks**: upstream `codingAgent.ts` has no explicit `fetch`/`handleWebhook` (the `agents` SDK routes). The fork's `simpleGeneratorAgent.ts` DOES (`fetch` 2075, `handleWebhook` 2102). Determine during the slice whether the new agent needs explicit `fetch`/webhook or whether the SDK + worker routing covers it.

### Gated dependency order (port deferred BaseCodingBehavior helpers FIRST, then WS)

The WS handler port is gated on these still-deferred behavior helpers (from the 2b.17 deferral list). Port them as atomic-green slices in roughly this order, then wire the handler:

1. ✅ **Slice 1 (`a3d466c`) — deep-debug subsystem**: `executeDeepDebug` + `isDeepDebugging` + `getDeepDebugSessionState` + `waitForDeepDebug` + 2 fields. Verbatim port.
2. ✅ **Slice 2 (`aa721e8`) — getModelConfigsInfo**: adapt-not-port — `ModelConfigService` has no `getModelConfigsInfo`; lifted simpleGen's inline logic, typed against `ModelConfigsInfo` (websocketTypes:363) to avoid the banned `Record<string, any>`; coerced `ReasoningEffort` null→undefined.
3. ✅ **Slice 3 (`7ac2fcc`) — screenshot subsystem**: `captureScreenshot` + `executeScreenshotCapture` + `processAndStoreScreenshot` + `SCREENSHOT_CONFIG`. Ported the robust upstream version (retry + blank-detect + `ScreenshotSecurity` signed URL), not simpleGen's older single-shot.
4. ✅ **Slice 4 (`c929457`) — WS-routing widening (the lynchpin)**: new module `worker/agents/core/codingAgentWebsocket.ts` (ported upstream `websocket.ts`, typed against the new agent, **coexists** with the live `./websocket.ts`); widened `ICodingBehavior` with `cancelCurrentInference`/`captureScreenshot`/`getModelConfigsInfo`/`getDeepDebugSessionState`; wired new agent `onMessage`/`onClose`. **Vault methods were SKIPPED** — the fork has no `VAULT_LOCKED`/`VAULT_UNLOCKED`/`SESSION_INIT` constants and no `CredentialsPayload` (vault tombstoned with `UserSecretsStore`, secrets in D1), so those cases were dropped from the handler entirely. `executeTerminalCommand` not needed (terminal disabled as upstream). The new agent's WS path is now functional in isolation (NOT live).
5. ✅ **SKIPPED — `fetch`/`handleWebhook` is NOT needed.** Investigated 2026-05-29: the runtime-error webhook is **dead in the fork**. simpleGen's `createNewPreview` (1727) passes `generateWebhookUrl()` → `/api/webhook/sandbox/<agentId>/runtime_error` to `createInstance`, but **no such route exists anywhere** in `worker/app.ts`/`index.ts`/`api/routes/*` (zero `webhook` references; `app.notFound` falls through to `ASSETS.fetch`/SPA). So the runner's POST never reaches the DO — simpleGen's `fetch`/`handleWebhook`/`processWebhookEvent`/`handleRuntimeErrorWebhook` are dead code. Runtime errors are caught by **polling** (`fetchRuntimeErrors` → `getInstanceErrors`, broadcasts `RUNTIME_ERROR_FOUND`), which the behavior already does. WS reaches the new agent via the controller's `agentInstance.fetch(request)` → inherited SDK `Agent.fetch` → `onConnect`/`onMessage` (no custom `fetch` override needed). **Action for commit 4:** delete simpleGen's dead webhook methods.
6. 🔲 **`pushToGitHub` bridge on the new agent** — the ONE remaining controller-surface gap. The `githubExporter` controller calls `agentStub.pushToGitHub(pushRequest: GitHubPushRequest): GitHubExportResult`; the new `CodeGeneratorAgent` has no `pushToGitHub` (it has `getObjective()` + `setGitHubToken`/`getGitHubToken`/`clearGitHubToken`). The export LOGIC lives on the objective: `ProjectObjective.export(options: ExportOptions): Promise<ExportResult>` → `exportToGitHub` (2b.11). So add a thin `pushToGitHub` to the new agent that **bridges** the controller's `GitHubPushRequest`→`ExportOptions` and `ExportResult`→`GitHubExportResult`, delegating to `this.objective.export(...)`. Verify the type mapping carefully (signatures differ). Confirmed-complete controller surface otherwise: `initialize`/`isInitialized`/`deployToSandbox`/`deployToCloudflare`/`getFullState`/`getSummary`/`getPreviewUrlCache`/`deployProject` all present on the new agent.
7. ✅ **Conversation-tool surface verified complete (no port needed).** `CodingAgentInterface` (`services/implementations/CodingAgent.ts`, the wrapper passed to operations/tools via `getOperationOptions().agent`) exposes only `getLogs`/`deployPreview`/`deployToCloudflare`/`queueRequest`, all delegating to **real** `ICodingAgent`/behavior methods (`getLogs`, `deployToSandbox`, `deployToCloudflare`, `queueUserRequest`). The other deferred base helpers (`saveExecutedCommands`, `syncPackageJsonFromSandbox`, `regenerateFile`/`regenerateFileByPath`/`generateFiles`/`updateSlideManifest`, `listFiles`/`readFiles`, `updateProjectName`/`updateBlueprint`, `generateReadme`, `updateBootstrapScript`, base `getLogs`) have **no reachable caller** on the controller / WS / conversation-tool surfaces — they were simpleGen internals the behavior architecture routes through operations instead. Port only if a future concrete call appears.
8. ⚠️ **`initializeAsync` parity — the one behavioral gap to weigh before the flip.** Upstream `PhasicCodingBehavior.initialize` ends with `this.initializeAsync()` (parallel sandbox deploy + `executeCommands(setupCommands)` + `generateReadme`). The fork's phasic `initialize` OMITS it (documented in phasic.ts header). Not a hard blocker — `build()`'s first `implementPhase` deploys to the sandbox and `fetchRuntimeErrors` redeploys lazily — but without it the **template bootstrap/setup commands may not run before the first phase**, and no README is generated at init. `executeCommands` now exists (2b.17a); `generateReadme` does not (deferred). Decide: port `initializeAsync` + `generateReadme` for parity, OR accept lazy deploy and document the behavior change. Recommend porting before the flip for safety.
9. 🔲 GitVersionControl + Vault adaptations 2b.13 marked transitional.
10. 🛑 **HELD — flip `worker/index.ts` binding** `SmartCodeGeneratorAgent` → new `CodeGeneratorAgent`. Outward-facing production cutover; **requires explicit user sign-off** before pushing. Rebase onto `main` (`6756f7b`, 1 clean non-conflicting commit — touches `imagesRoutes.ts`/`screenshots/controller.ts`, NOT agent code) before/around this.

**Live-surface coverage summary (as of `fd53c32`):** controller surface ✅ (slice 6), WebSocket surface ✅ (slice 3.4), conversation-tool surface ✅ (verified, item 7). The new `CodeGeneratorAgent` is functionally ready behind the binding; the only pre-flip items are `initializeAsync` parity (item 8, recommended) and the transitional Git/Vault adaptations (item 9), then the rebase + the sign-off-gated flip.

**Discipline reminder:** every helper is lift-vs-port-vs-adapt per §4.5 — the fork diverges from upstream (sandbox-service static analysis, no `InMemoryAnalyzer`, 3-arg async `fixProjectIssues`, single-arg `saveGeneratedFiles`, missing `ModelConfigService.getModelConfigsInfo`, `any` ban). Always read both the upstream `base.ts`/`codingAgent.ts` version AND the simpleGen fork-proven version before each slice.

The big milestone is commit 4. After that, the M4 work begins: sandbox local-proxy refactor (PR 6), real `AgenticProjectBuilderOperation`, etc.
