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

### Update — 2026-05-29

Slices 2b.13 → 2b.16 all landed. Gates verified green at HEAD `dc33191`:
- typecheck 0 / lint 0 / test 191 passed / 1 skipped / 2 pre-existing BYOP file-level failures (baseline).

**Items 10, 11, 12, 15 are now ✅ done** (codingAgent + ICodingBehavior + BaseCodingBehavior sub-slices A/B/C + Phasic/Agentic behavior factory wired). The behavior factory in `CodeGeneratorAgent.onStart` is end-to-end constructible; `simpleGeneratorAgent.ts` remains the live runtime path (commit 4 will flip it).

**OQ-P resolved (2026-05-29) — add as explicit production deps.** Evidence: our fork's `worker/services/code-fixer/utils/ast.ts:6-9` already imports `@babel/parser`, `@babel/traverse`, `@babel/generator`, `@babel/types`; they ship in the worker bundle today as **transitive** deps (not declared in `package.json`). preDeploySafetyGate uses the same four packages → zero new bundle weight. Making them explicit also fixes a latent fragility (a transitive change could currently break the worker bundle silently).

**Only commit-2b item remaining is item 5** (`preDeploySafetyGate.ts`, ~448 LoC). Slice it as **2b.17** — see §3 below (rewritten).

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
| 5 | `utils/preDeploySafetyGate.ts` | 🔲 **next — slice 2b.17** (OQ-P resolved 2026-05-29) |
| 6 | `operations/SimpleCodeGeneration.ts` | ✅ done (2b.5) |
| 7 | `operations/DeepDebugger.ts` stub | ✅ done (2b.9) |
| 8 | `operations/AgenticProjectBuilder.ts` stub | ✅ done (2b.12) |
| 9 | `services/implementations/DeploymentManager.ts` | ✅ done (2b.10) |
| 10 | `behaviors/base.ts` (~1936 LoC) | ✅ done (2b.14 A + 2b.15 B + 2b.16 C) |
| 11 | `behaviors/phasic.ts` (~728 LoC) | ✅ done (2b.16) |
| 12 | `behaviors/agentic.ts` (~393 LoC) | ✅ done (2b.16) |
| 13 | `objectives/base.ts` + GitHub adapter | ✅ done (2b.11) |
| 14 | `objectives/strategies/*` | ✅ done (2b.6) |
| 15 | `core/codingAgent.ts` (~838 LoC) + `ICodingBehavior` interface | ✅ done (2b.13) |

**Remaining for commit 2b:** item 5 only (~448 LoC). After 2b.17 lands, commit 2b is complete — M3 advances to commit 3 (wire-up: `CodeGenObject` switches from `SimpleCodeGeneratorAgent` → `CodeGeneratorAgent`) per `M3_PORT_PLAN_v2.md`.

---

## 3. Next slice: 2b.17 — preDeploySafetyGate.ts (item 5, last of commit 2b)

**Upstream source:** `cloudflare/vibesdk` `main` `worker/agents/utils/preDeploySafetyGate.ts` (14,527 bytes / ~448 LoC). Fetch via `gh api repos/cloudflare/vibesdk/contents/worker/agents/utils/preDeploySafetyGate.ts` and base64-decode `.content`.

### OQ-P decision recap

The four Babel packages (`@babel/parser`, `@babel/traverse`, `@babel/generator`, `@babel/types`) are **already in the worker bundle today** via transitive resolution (`worker/services/code-fixer/utils/ast.ts:6-9` imports them and they resolve at build time). Slice 2b.17 makes the transitive deps explicit — same packages, same bundle, more durable.

### Suggested scope (single commit)

1. **Declare deps explicitly** in `package.json` `dependencies`:
   - `@babel/parser`, `@babel/traverse`, `@babel/generator`, `@babel/types` — pin to the versions transitively resolved today. Run `"C:/Users/PC owner/.bun/bin/bun.exe" pm ls @babel/traverse @babel/types @babel/parser @babel/generator` first to capture the exact versions to pin.
2. **Port `worker/agents/utils/preDeploySafetyGate.ts`** from upstream verbatim where possible. Reuses fork's existing `worker/services/code-fixer/utils/ast.ts` (parseCode/generateCode) — same import that upstream uses, so no adapter layer.
3. **Verify call sites** in landed M3 code. Likely consumers: `behaviors/phasic.ts` (`PhasicCodingBehavior.build()` is currently a stub — does it need `runPreDeploySafetyGate` before deploy?). Grep first: `Grep "runPreDeploySafetyGate|preDeploySafetyGate" worker/agents/`. If no call sites yet, the port adds the utility without wiring it; sub-slice wiring lands later when `build()` is implemented.
4. **Test gate must stay green** at baseline (191 / 1 / 2 BYOP).
5. **`simpleGeneratorAgent.ts` MUST NOT regress** — still the live runtime path until commit 4.
6. One commit. Message format matches prior slices: `feat(m3): slice 2b.17 — preDeploySafetyGate + explicit Babel deps (item 5)`.

### Lite-port traps to watch

- Upstream imports `RealtimeCodeFixer` from `'../assistants/realtimeCodeFixer'`. Confirm fork has this file. If absent or shape-divergent → adapt-not-port.
- Upstream imports `InferenceContext` from `'../inferutils/config.types'`. Confirm this is the same shape in the fork.
- Per §4.5: always fetch the upstream file and inspect imports BEFORE deciding port-vs-adapt.

This is one focused session. After it lands, commit 2b is **complete** and M3 advances to commit 3 (the DO wire-up).

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

5. **Execute slice 2b.17.** Atomic-green discipline. The §3 scope + OQ-P resolution are your spec.

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

## 8. Post-2b.17 plan

Slices 2b.13 → 2b.16 have landed (items 15, 10, 11, 12 done — see §1). The behavior factory in `CodeGeneratorAgent.onStart` is constructible; `PhasicCodingBehavior.build()` and `AgenticCodingBehavior.build()` remain stubs by design (phase state machine + agentic loop are commit 3+ work).

**Commit 2b closes when 2b.17 lands** (item 5 — preDeploySafetyGate). After that, M3 advances to commit 3 (the DO wire-up):

- **Commit 3** — flip `CodeGenObject` Durable Object class from `SimpleCodeGeneratorAgent` → `CodeGeneratorAgent`. Implement `PhasicCodingBehavior.build()` (phase state machine), `AgenticCodingBehavior.build()` (agentic loop), the WS-message routing widening, and the GitVersionControl + Vault adaptations that 2b.13 marked as transitional.
- **Commit 4** — delete `simpleGeneratorAgent.ts`. The deprecated-required-field pattern (§4.2) gets cleaned up alongside the file deletion.
- **Commits 5–9** — per `M3_PORT_PLAN_v2.md`. Includes BYOP test unblock (task #11), the CF May-2026 substrate improvements (Sentry RPC trace propagation, compat-date bump, streamGenAiSpans), and final consolidation.

The big milestone is commit 4 — the moment the new agent architecture goes live in production.
