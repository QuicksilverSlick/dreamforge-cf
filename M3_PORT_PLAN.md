# Phase E M3 — port plan

**Anchor date:** 2026-05-19
**Status:** planning artifact, no code yet
**Predecessor:** `PHASE_E_MEGABUNDLE_SCOPING.md` (scoping locked to scope (a) = M1+M2+M3, no M4)

This is the tactical, file-by-file port plan for **M3 — single-agent collapse** (a.k.a. Phase-E PR 5). M3 replaces the `simpleGeneratorAgent.ts` + `smartGeneratorAgent.ts` two-class topology with upstream's single `CodeGeneratorAgent` from `worker/agents/core/codingAgent.ts` plus its `behaviors/`, `objectives/`, and (already partially present) `features/` package. The DO binding `CodeGenObject` and exported class name `CodeGeneratorAgent` are preserved; no new `wrangler.jsonc` migration tag.

---

## 1. Upstream surface reality check

Enumerated via `gh api repos/cloudflare/vibesdk/contents/<path>` against `main` (2026-05-19).

### `worker/agents/core/` (upstream)
| Path | Size | Role |
|---|---|---|
| `codingAgent.ts` | 33,219 B | The unified DO class. `extends Agent<Env, AgentState> implements AgentInfrastructure<AgentState>`. Holds `behavior`, `objective`, `fileManager`, `deploymentManager`, `git`. Owns init/WS/lifecycle, delegates phase loop to behavior. |
| `AgentCore.ts` | 1,720 B | `AgentInfrastructure<TState>` interface only — the contract the DO exposes to behaviors/objectives. |
| `AgentComponent.ts` | 3,046 B | Abstract base class for behaviors + objectives. Wraps `infrastructure` and exposes protected accessors. |
| `state.ts` | 3,077 B | `BaseProjectState`, `PhasicState`, `AgenticState`, `AgentState`, `CurrentDevState`, `MAX_PHASES`. Discriminated union on `behaviorType`. |
| `stateMigration.ts` | 9,678 B | `StateMigration` helper — migrates persisted DO state across schema revisions. |
| `types.ts` | 4,018 B | `BehaviorType`, `ProjectType`, `RuntimeType`, init-arg type family, `DeployOptions`, `DeployResult`, `ExportOptions`, `ExportResult`, `Plan`, `AllIssues`, `DeepDebugResult`. |
| `websocket.ts` | 16,977 B | Handler set. ~10x our handler size (auth/ticket flows, deep-debug events, agentic events). |

### `worker/agents/core/behaviors/` (upstream)
| Path | Size | Role |
|---|---|---|
| `base.ts` | 79,035 B | `BaseCodingBehavior<TState>` — the bulk of orchestration logic. **This file is huge.** |
| `phasic.ts` | 30,814 B | `PhasicCodingBehavior` — blueprint → phase generation → phase impl → review loop. Replaces our `SimpleCodeGeneratorAgent.generateAllFiles` pipeline. |
| `agentic.ts` | 16,130 B | `AgenticCodingBehavior` — single-loop LLM orchestrator. Replaces the empty `SmartCodeGeneratorAgent.builderLoop` stub. |

### `worker/agents/core/objectives/` (upstream)
| Path | Size | Role |
|---|---|---|
| `base.ts` | 8,038 B | `ProjectObjective<TState>` — abstracts project-type-specific goals (what "done" means). |
| `strategies/index.ts` | 240 B | Strategy registry. |
| `strategies/presentation.ts` | 620 B | Presentation-type objective. |
| `strategies/types.ts` | 648 B | Strategy types. |

### `worker/agents/core/features/` (upstream)
| Path | Size | Role |
|---|---|---|
| `index.ts` | 240 B | Re-export barrel. |
| `types.ts` | 4,906 B | `FeatureCapabilities`, `FeatureDefinition`, `PlatformCapabilities`, `DEFAULT_FEATURE_DEFINITIONS`, `getBehaviorTypeForProject`. |

We already have most of this locally (see §2). Upstream's `types.ts` is ~190 B larger than ours; likely includes the `workflow` project-type variant we already carry plus a small surface delta.

### `worker/agents/operations/` (upstream)
| Path | Size | Role |
|---|---|---|
| `AgenticProjectBuilder.ts` | 11,966 B | Tool-driven build loop (consumed by `agentic.ts`). NOT in M3 scope — that's M4/PR8. |
| `DeepDebugger.ts` | 7,626 B | Runtime-error recovery sessions. NOT in M3 scope — M4/PR8. |
| `FileRegeneration.ts` | 4,853 B | Upstream rebase of ours (4,783 B locally). |
| `PhaseGeneration.ts` | 22,020 B | Upstream rebase (13,496 B locally) — substantial diff. |
| `PhaseImplementation.ts` | 7,643 B | Upstream is *smaller* than our 36,282 B local version — fork has accumulated heavy local logic. **High-risk rebase.** |
| `PostPhaseCodeFixer.ts` | 4,084 B | New upstream operation (not in our `operations/`). Phasic post-phase fixer. |
| `SimpleCodeGeneration.ts` | 11,347 B | Upstream's simplified phasic-driver helper. |
| `UserConversationProcessor.ts` | 32,833 B | Upstream rebase (38,037 B locally) — comparable size, likely substantial diff in internals. |
| `Guardrail.md` | 2,059 B | Identical to our copy (2,111 B). |
| `common.ts` | 10,205 B | Upstream is 5× ours (1,971 B). |
| `prompts/agenticBuilderPrompts.ts` | 22,398 B | NOT M3. |
| `prompts/deepDebuggerPrompts.ts` | 23,199 B | NOT M3. |
| `prompts/phaseImplementationPrompts.ts` | 3,063 B | M3 candidate (used by phasic behavior). |

### `worker/agents/` top-level (upstream)
| Path | Size | Notes |
|---|---|---|
| `prompts.ts` | 66,485 B | Upstream's is ~80% the size of ours (82,734 B). Comparable surface, divergent contents. Counter to the scoping doc's "+805 LoC upstream" claim. |
| `schemas.ts` | 12,145 B | Larger than ours (11,369 B); adds `PhasicBlueprint` / `AgenticBlueprint` discriminated union. |
| `constants.ts` | 4,860 B | Slightly larger than ours (3,883 B). |
| `inferutils/`, `tools/`, `services/`, `domain/`, etc. | various | Out of M3 scope unless touched by codingAgent's import graph. |

### Upstream files I could not enumerate
None — all relevant directories returned successfully.

---

## 2. Local surface inventory

| Path | LoC | Role | M3 disposition |
|---|---|---|---|
| `worker/agents/core/simpleGeneratorAgent.ts` | 2,680 | Live DO impl, 7-operation pipeline, WS handling, deploy retries. | **DELETE** |
| `worker/agents/core/smartGeneratorAgent.ts` | 39 | Stub wrapping `SimpleCodeGeneratorAgent`; the current public DO class. | **DELETE** |
| `worker/agents/core/state.ts` | 62 | `CodeGenState` (flat shape, no discriminated union) + `FileState`/`PhaseState`/`CurrentDevState`/`MAX_PHASES=12`. | **REPLACE** (with discriminated union; preserve persisted-field superset) |
| `worker/agents/core/types.ts` | 84 | `ProjectType` (incl. `workflow`), `BehaviorType`, `ExportOptions`, `AgentInitArgs`, `ScreenshotData`, `AgentSummary`, `UserContext`, `PhaseExecutionResult`. | **REBASE** (subsume upstream `DeployResult`, `DeepDebugResult`, etc., keep our `workflow` type) |
| `worker/agents/core/websocket.ts` | 289 | Our 12-case message router. Frontend hard-depends on this protocol. | **LEAVE ALONE** (re-point `SimpleCodeGeneratorAgent` import to the new `CodeGeneratorAgent` symbol) |
| `worker/agents/core/features/index.ts` | 14 | Re-export barrel. | **LEAVE ALONE** |
| `worker/agents/core/features/types.ts` | ~190 | Already present locally — `PlatformCapabilities`, `DEFAULT_FEATURE_DEFINITIONS`, `getBehaviorTypeForProject`. | **LEAVE ALONE** (possibly small reconciliation pass with upstream) |
| `worker/agents/index.ts` | 121 | `getAgentStub`, `getAgentState`, `cloneAgent`, `getTemplateForQuery`. References `SmartCodeGeneratorAgent` and `CodeGenState` directly. | **REBASE** (change typings; do NOT adopt upstream `AgentStubProps` until M4/PR6) |
| `worker/agents/prompts.ts` | 1,475 | Fork prompt set (Dreamforge string substitutions applied). | **REBASE** (take-upstream, re-apply Dreamforge substitutions; risk: generator quality regression) |
| `worker/agents/schemas.ts` | 169 | Includes `Blueprint`, `PhaseConceptType`, etc. | **REBASE** (add `PhasicBlueprint`/`AgenticBlueprint` discriminated types from upstream) |
| `worker/agents/constants.ts` | 105 | `WebSocketMessageRequests`/`WebSocketMessageResponses` enums. | **LEAVE ALONE** unless behaviors require new message types. (Verify upstream `constants.ts` parity post-port.) |
| `worker/agents/operations/CodeReview.ts` | 248 | Local-only operation, not in upstream `operations/`. | **LEAVE ALONE** (still used by the phasic loop in our pipeline; rewire callers if behaviors invoke it differently) |
| `worker/agents/operations/FastCodeFixer.ts` | 103 | Local-only (`enableFastSmartCodeFix`). | **LEAVE ALONE** |
| `worker/agents/operations/FileRegeneration.ts` | 137 | Upstream rebase candidate. | **REBASE** |
| `worker/agents/operations/PhaseGeneration.ts` | 230 | Substantial upstream diff (22 KB upstream vs 13 KB local). | **REBASE** |
| `worker/agents/operations/PhaseImplementation.ts` | 603 | Locally bloated (we are ~5× upstream). | **REBASE** — but cautiously; carry forward any of our local logic that has no upstream equivalent |
| `worker/agents/operations/ScreenshotAnalysis.ts` | 133 | Local-only. | **LEAVE ALONE** |
| `worker/agents/operations/UserConversationProcessor.ts` | 718 | Both sides are heavy; will need careful merge. | **REBASE** |
| `worker/agents/operations/common.ts` | 51 | Local stub-ish; upstream is 5× larger. | **REBASE** (take upstream as the base) |
| `worker/agents/operations/Guardrail.md` | n/a | Identical to upstream within rounding. | **LEAVE ALONE** |
| `worker/agents/inferutils/*` | 4,987 total | Mostly framework-version-coupled; not in M3 unless behaviors require new helpers. | **LEAVE ALONE** |
| `worker/agents/tools/{customTools,types}.ts` + `toolkit/` | small | Agentic-mode building blocks. | **LEAVE ALONE** in M3 (agentic behavior will stub-fail until M4/PR8 lands a real toolkit) |
| `worker/agents/services/{interfaces,implementations}/{ICodingAgent,IFileManager,IStateManager,CodingAgent,FileManager,StateManager}.ts` | n/a | Fork-local service abstraction. Used by `simpleGeneratorAgent.ts`. | **REBASE** — the new `codingAgent.ts` ports `FileManager`, `DeploymentManager`. Reconcile names + interfaces |
| `worker/agents/domain/pure/FileProcessing.ts`, `domain/values/GenerationContext.ts` | n/a | Local-only domain utilities. | **LEAVE ALONE** unless they reference deleted types |

### Files M3 must NOT touch
- `worker/agents/analyzer/codebaseAnalyzer.ts` (BYOP DO, separate concern)
- `worker/agents/assistants/`, `domain/`, `output-formats/`, `planning/` directories (no symbol overlap with the core swap)
- All `worker/api/controllers/*` controllers — they import via the `worker/agents/index.ts` facade, which we rebase
- `worker/index.ts` — line 2 + 17 will change minimally (import path swap + same exported symbol name)

---

## 3. State + DO interface compat

### Fields our `CodeGenState` has that upstream `AgentState` does not
- `templateDetails: TemplateDetails` (whole object embedded) — upstream replaces with `templateName: string | 'custom'`
- `clientReportedErrors: ClientReportedErrorType[]`
- `generationPromise?: Promise<void>` (only ever an in-memory transient; should never be persisted)
- `agentMode: 'deterministic' | 'smart'` — upstream collapses to `behaviorType: 'phasic' | 'agentic'`
- `phasesCounter: number` (phasic-only upstream)
- `conversationMessages: ConversationMessage[]` (upstream stores via `ConversationState` / `addConversationMessage` accessors instead of a flat array field)
- `inferenceContext: InferenceContext` — upstream uses `metadata: InferenceMetadata` (a stripped-down sister type)
- `reviewCycles?` (phasic-only upstream)
- `currentPhase?` (phasic-only upstream)

### Fields upstream `BaseProjectState` has that we lack
- `behaviorType: BehaviorType` — REQUIRED discriminator
- `projectType: ProjectType` — REQUIRED discriminator
- `projectName: string`
- `templateName: string | 'custom'`
- `metadata: InferenceMetadata` (replaces our `inferenceContext`)
- `fileServingToken?: FileServingToken`
- `lastDeepDebugTranscript: string | null` (M4 territory but the field must exist or `JSON.parse(state)` from upstream-shaped persisted data will fail — provide a default)
- `cloudflareToken?` and `wsOrigin?` (vault/auth territory — leave undefined, gate any code that reads them)

### Method signatures touched in `worker/agents/index.ts`
- `getAgentStub` — current local signature: `(env, agentId, searchInOtherJurisdictions, logger)` returning `DurableObjectStub<SmartCodeGeneratorAgent>`. Upstream: `(env, agentId, props?)` returning `DurableObjectStub<CodeGeneratorAgent>`. **Our callers pass `searchInOtherJurisdictions` + `logger`** (`worker/api/controllers/githubExporter/controller.ts`, `worker/api/controllers/agent/controller.ts`, `worker/api/controllers/appView/controller.ts`). Keep our signature; only change the generic type parameter from `SmartCodeGeneratorAgent` → `CodeGeneratorAgent`.
- `cloneAgent` — preserve our jurisdiction-aware behavior; change generic + adjust state-reset block to handle the discriminated union (phasic vs agentic reset shapes per upstream).
- `getAgentState` — same; change return type from `CodeGenState` → `AgentState` (or keep a `CodeGenState` alias for one release).

### WebSocket wire protocol
- Frontend handler (`src/routes/chat/utils/handle-websocket-message.ts`) — does NOT receive `behaviorType` / `projectType` today and does NOT need to. Hard invariant: M3 changes no wire-protocol field names or `type` enum values.
- The 12-case server router in `worker/agents/core/websocket.ts` calls methods on `SimpleCodeGeneratorAgent`: `generateAllFiles`, `reviewCode`, `regenerateFile`, `deployToCloudflare`, `deployToSandbox`, `captureScreenshot`, `handleUserInput`, `getModelConfigsInfo`, `clearConversation`, `getConversationState`, `isGenerating`. **The new `CodeGeneratorAgent` must expose all of these as public methods or thin delegates to its behavior.** Upstream's `codingAgent.ts` exposes some of these directly; others (`reviewCode`, `regenerateFile`, `captureScreenshot`, `getModelConfigsInfo`) are fork-specific and must be carried forward as DO methods that delegate to the phasic behavior or to fork-local operations.
- `src/api-types.ts:151` re-exports `CodeGenState` for the frontend. We must keep this alias working — add a `export type CodeGenState = AgentState` shim in `state.ts` (or pick a clean rename and update the frontend in the same commit; depends on OQ-FE below).

### `worker/api/websocketTypes.ts:2`
Imports `CodeGenState` for typed broadcast payloads. Same shim approach.

### `worker/api/controllers/appView/{types,controller}.ts`
Imports `AgentSummary` from `worker/agents/core/types`. Upstream `AgentSummary` made `conversation` optional. Trivial — call sites already handle absence.

---

## 4. Divergence touchpoints

| Divergence | Touches M3? | Accommodation |
|---|---|---|
| **D1-backed secrets** (`worker/database/services/SecretsService.ts` instead of upstream's `UserSecretsStore` DO + `SecretsClient`) | YES, transitively. Upstream `codingAgent.ts` imports `SecretsClient` and instantiates `this.secretsClient: SecretsClient \| null` for OAuth/cloudflareToken flows. | **Stub the import.** Either (a) carry a no-op `SecretsClient` shim in `worker/services/secrets/SecretsClient.ts` that returns `null`/empty for every method until M4-PR9, or (b) delete the secrets-client touch points from the ported `codingAgent.ts` (cleaner, more invasive). **Decision: option (a)** — minimizes M3 diff size. |
| **BYOP** (`worker/agents/analyzer/codebaseAnalyzer.ts` is a separate DO; `worker/api/controllers/byop/controller.ts`) | YES, indirectly. BYOP controller currently calls into `getAgentStub` after the analyzer phase. | Preserve the `(env, agentId, searchInOtherJurisdictions, logger)` `getAgentStub` signature. BYOP test gating is unchanged (still excluded from CI run). |
| **AI Gateway 3-gate proxy** (`worker/services/aigateway-proxy/controller.ts`) | NO direct dep. | Leave alone. |
| **Sentry wrapping** (`worker/index.ts:17`) | YES — line 17 is the public DO export. | Update line 2 import path to `./agents/core/codingAgent`; update line 17 to wrap `CodeGeneratorAgent` (the new class, same exported name). The Sentry wrapper is unaffected. |
| **`PLATFORM_CAPABILITIES` env-var pattern** (`wrangler.jsonc:230`, `worker/api/controllers/capabilities/controller.ts`) | YES, gating. Our pattern enables only `app: true`. Upstream `codingAgent.ts` switches behavior on `projectType` which is set during initialization based on the feature registry. | Already wired — `getBehaviorTypeForProject('app')` returns `'phasic'`. M3 must ensure init defaults `projectType: 'app'` when not explicitly passed (preserves today's behavior). |
| **`agentMode` request field** (`worker/api/controllers/agent/controller.ts:23, :148`) | YES. Frontend currently passes `agentMode: 'deterministic' \| 'smart'` to `agentInstance.initialize()`. Upstream has no such argument — behavior is implicit via `behaviorType` in the DO `props`. | Keep the public init signature `initialize(initArgs, agentMode)`. Map `agentMode === 'deterministic'` → `behaviorType: 'phasic'`, `agentMode === 'smart'` → `behaviorType: 'agentic'`. Frontend unchanged. |
| **`AgentModeToggle` UI** | NO direct code change in M3; see OQ-FE. | Leave alone. |
| **`worker/agents/services/*` (fork-local CodingAgent/StateManager/FileManager)** | YES. Upstream ports a different `FileManager`/`DeploymentManager` shape. | Reconcile: keep our class names where they cover identical roles, swap impl bodies for upstream-aligned ones. |
| **WS auth (cookies/tickets)** | YES, transitively. Upstream `codingAgent.ts` imports `WsTicketManager`, `oauthCookie`, ticket types. | **Stub.** Our WS auth lives in `worker/middleware/security/websocket.ts` and validates at the route level (`worker/api/controllers/agent/controller.ts:197`). Drop the ticket plumbing from the ported `codingAgent.ts`; leave existing route-level validation in place. |
| **`agents@0.2.35` API shape** | NO — already on the post-M2 pin. | The `Connection` / `ConnectionContext` / `getAgentByName` imports work as-is. |

### Files in `worker/` that import from `worker/agents/core/`
1. `worker/index.ts` (line 2): direct DO class import. CHANGE.
2. `worker/api/websocketTypes.ts`: `CodeGenState` for payload typing. Add alias shim.
3. `worker/api/controllers/capabilities/{controller,types}.ts`: `features/` only. LEAVE ALONE.
4. `worker/api/controllers/appView/{controller,types}.ts`: `AgentSummary`. Trivial.
5. `worker/api/controllers/agent/controller.ts`: `CodeGenState`. Add alias shim or rename.
6. `worker/agents/domain/pure/FileProcessing.ts`: needs verification — likely imports `FileState`. Should survive as-is (we keep `FileState` in the new state file).

---

## 5. Sequenced port plan

Seven commits. Order is load-bearing — each commit either unblocks the next or proves the new substrate boots.

### Commit 1 — `feat(agents): introduce AgentCore + AgentComponent + new state shape`
**Files added:**
- `worker/agents/core/AgentCore.ts` (upstream port)
- `worker/agents/core/AgentComponent.ts` (upstream port)
- `worker/agents/core/stateMigration.ts` (upstream port, **light-edit pass** to drop git/secrets touch points)
- `worker/agents/core/state.ts` — **rewrite** to discriminated union (`BaseProjectState` + `PhasicState` + `AgenticState` + `type AgentState = PhasicState | AgenticState`), preserving any field that's persisted today
- `worker/agents/core/types.ts` — **rewrite** to upstream surface (add `DeployOptions`, `DeployResult`, `DeepDebugResult`, `ExportResult`, `RuntimeType`; keep `workflow` in `ProjectType`)

**Files modified:**
- `worker/agents/core/state.ts`: at bottom, `export type CodeGenState = PhasicState;` shim so frontend + websocketTypes keep compiling

**What it does:** Stands up the upstream type substrate. No runtime call sites change yet — `simpleGeneratorAgent.ts` and `smartGeneratorAgent.ts` will fail to typecheck against the new state.

**Expected breakage:** `simpleGeneratorAgent.ts` (`generatedPhases` is now phasic-only; reads of `inferenceContext` must move to `metadata`; etc.). Smart-agent stub also breaks. **This commit will not typecheck-clean for that reason** — explicitly noted. We accept the broken intermediate because the very next commit replaces both classes.

**Verification:** `npm run typecheck` — expect targeted errors in `simpleGeneratorAgent.ts` and `smartGeneratorAgent.ts` only; nothing else should fail.

---

### Commit 2 — `feat(agents): port codingAgent + behaviors (phasic-only wiring)`
**Files added:**
- `worker/agents/core/codingAgent.ts` (upstream port, **light-edit pass**: drop `GitVersionControl` imports, drop `SecretsClient` import or replace with a no-op shim at `worker/services/secrets/SecretsClient.ts`, drop ticket-manager imports)
- `worker/agents/core/behaviors/base.ts` (upstream port)
- `worker/agents/core/behaviors/phasic.ts` (upstream port — main M3 phasic loop)
- `worker/agents/core/behaviors/agentic.ts` (upstream port — **may compile broken; deferred to M4/PR8**; either keep as a stub that throws `'AgenticBehavior requires PR8'` or comment out the file body, marking unimplemented)
- `worker/agents/core/objectives/base.ts`, `objectives/strategies/{index,presentation,types}.ts`
- `worker/services/secrets/SecretsClient.ts` (no-op shim if needed)

**Files modified:**
- `worker/agents/core/websocket.ts` — change `SimpleCodeGeneratorAgent` import → `CodeGeneratorAgent` from `./codingAgent`. All 12 method calls (`generateAllFiles`, `reviewCode`, `regenerateFile`, `deployToCloudflare`, `deployToSandbox`, `captureScreenshot`, `handleUserInput`, `getModelConfigsInfo`, `clearConversation`, `getConversationState`, `isGenerating`, `agent.state`) must still resolve.

**What it does:** Lands the new DO class alongside the old one. The new class delegates phasic generation to `PhasicCodingBehavior` and exposes the methods our WS handler calls. `simpleGeneratorAgent.ts` and `smartGeneratorAgent.ts` still exist (untouched) but are no longer wired anywhere — they become dead code.

**Expected breakage:** Any agentic-only methods on `CodeGeneratorAgent` will throw at runtime; that's expected and gated on `agentMode === 'smart'`. The empty agentic behavior is loud-failure rather than silent — log + throw.

**Verification:** `npm run typecheck` — should be clean (or near-clean; one round of small fixups expected).

---

### Commit 3 — `refactor(agents): repoint DO export and index facade`
**Files modified:**
- `worker/index.ts` line 2: `import { CodeGeneratorAgent as BaseCodeGeneratorAgent } from './agents/core/codingAgent';` (rename to avoid the export-name collision). Line 17: wrap `BaseCodeGeneratorAgent` instead of `SmartCodeGeneratorAgent`. Public exported name `CodeGeneratorAgent` is unchanged.
- `worker/agents/index.ts`: change generic type from `SmartCodeGeneratorAgent` → `CodeGeneratorAgent` in `getAgentStub`, `cloneAgent`, `getAgentState`. **Keep the `(env, agentId, searchInOtherJurisdictions, logger)` signature** — our jurisdiction logic is a real divergence we preserve.
- `cloneAgent`: update state-reset block to handle the discriminated union (reset `generatedPhases` / `currentDevState` only when `behaviorType === 'phasic'`).

**What it does:** Makes the new agent the live DO class for `CodeGenObject`. **This is the cut-over commit.** No wrangler migration tag — class name `CodeGeneratorAgent` is preserved; only the implementation module changes.

**Verification:** `npm run typecheck` clean. `npm run test` (191 non-BYOP tests): expect green. `wrangler dev` smoke (manual, by user) — `POST /api/agent` should return a stream, WS upgrade should succeed.

---

### Commit 4 — `chore(agents): delete simpleGeneratorAgent + smartGeneratorAgent`
**Files deleted:**
- `worker/agents/core/simpleGeneratorAgent.ts` (2,680 LoC)
- `worker/agents/core/smartGeneratorAgent.ts` (39 LoC)

**Files modified (cleanup):**
- Any lingering imports of `SimpleCodeGeneratorAgent`/`SmartCodeGeneratorAgent` (final grep pass; should be zero).

**What it does:** Removes the dead two-class topology. No behavioral change.

**Verification:** `npm run typecheck`, `npm run lint`, `npm run test`. **All clean.**

---

### Commit 5 — `refactor(agents): rebase operations against upstream (phasic-relevant)`
**Files modified:**
- `worker/agents/operations/PhaseGeneration.ts` (rebase to upstream 22 KB version, re-applying any fork-only signatures the new behaviors call into)
- `worker/agents/operations/FileRegeneration.ts` (rebase)
- `worker/agents/operations/PhaseImplementation.ts` (**careful rebase** — our local 36 KB is far larger than upstream 7.6 KB; this is mostly fork-local logic accreted around the upstream skeleton. Diff cell-by-cell; do NOT take-upstream wholesale. Likely outcome: take upstream as the base, then re-apply our fork-only blocks identifiable by `git blame`.)
- `worker/agents/operations/UserConversationProcessor.ts` (cautious rebase, same approach as `PhaseImplementation.ts`)
- `worker/agents/operations/common.ts` (take-upstream — ours is a near-empty stub)
- `worker/agents/operations/PostPhaseCodeFixer.ts` (NEW from upstream — copy in)
- `worker/agents/operations/SimpleCodeGeneration.ts` (NEW from upstream — copy in if `phasic.ts` imports it)
- `worker/agents/operations/prompts/phaseImplementationPrompts.ts` (NEW dir + file)

**What it does:** Brings the operations the new phasic behavior depends on up to upstream's API. Leave `CodeReview.ts`, `FastCodeFixer.ts`, `ScreenshotAnalysis.ts` (fork-only) alone.

**Verification:** `npm run typecheck`, `npm run test`. **All clean.** No behavioral asserts — operation-level regressions can only be caught via the manual smoke test.

---

### Commit 6 — `refactor(agents): rebase prompts.ts and schemas.ts`
**Files modified:**
- `worker/agents/prompts.ts` (take-upstream as base; re-apply Dreamforge string substitutions: "VibeSDK" → "Dreamforge", branding URLs, app-domain references)
- `worker/agents/schemas.ts` (add `PhasicBlueprint`/`AgenticBlueprint` discriminated union; preserve our local schema additions)
- `worker/agents/constants.ts` (small reconciliation pass; preserve our `WebSocketMessageRequests`/`WebSocketMessageResponses` enum values — frontend wire-protocol invariant)

**What it does:** Aligns prompt + schema substrate. The highest generator-quality risk lives in this commit — prompt rebases can change blueprint shape, phase planning quality, conversation handling tone.

**Verification:** `npm run typecheck`, `npm run test`, `npm run lint`. **Manual smoke test mandatory before merge.**

---

### Commit 7 — `chore(agents): reconcile features/types with upstream + final cleanup`
**Files modified:**
- `worker/agents/core/features/types.ts` (small diff vs upstream; verify `workflow` and `general` definitions match what behaviors expect)
- `worker/agents/core/types.ts` (final pass — drop any locally-defined types that upstream now provides; consolidate)
- Any final dead-code removal flagged by `knip`

**What it does:** Final polish. Closes M3.

**Verification:** `npm run typecheck`, `npm run lint`, `npm run test` (191 non-BYOP green), `npm run knip` (no new dead-code regressions). BYOP tests' status: documented as unchanged (still excluded; may unblock organically since `agentMode`/`SmartCodeGeneratorAgent` import is gone, but no test changes in M3). Sentry wrapping intact (verify line 17 of `worker/index.ts`). BYOP routes intact (verify `getAgentStub` jurisdiction signature preserved).

---

## 6. Specific risk callouts (for the manual smoke test)

The user will run a manual app-gen smoke test on a `wrangler dev` session before M3 PR is ready-for-merge. The test must exercise:

1. **End-to-end deterministic app generation.**
   - `POST /api/agent` with a non-trivial query (e.g., "build a todo app with auth"). Expect: agentId + websocketUrl + NDJSON template stream.
   - Open WS connection at `/api/agent/:agentId/ws`. Expect: blueprint chunks streaming, then phase concept → phase implementation → review messages.
   - Verify final preview URL deploys to `*.app.getdreamforge.com` (or `*.localhost` in dev) and is reachable via the sandbox proxy.
   - **Risk specifically caught:** prompt-rebase regressions in blueprint quality (commit 6), behavior-loop wiring breaks (commit 2/3), state-shape mismatches between fork and upstream (commit 1).

2. **WebSocket round-trip + conversation handling.**
   - After initial generation completes, send a `USER_SUGGESTION` message ("add a dark mode toggle"). Expect: conversation processor responds with a phase concept update or direct file edit.
   - Verify `CLEAR_CONVERSATION` and `GET_CONVERSATION_STATE` still work.
   - **Risk specifically caught:** `UserConversationProcessor.ts` rebase regressions (commit 5), conversation message persistence shape changes (commit 1), broken method delegation in the new `CodeGeneratorAgent` (commit 2).

3. **DO state hydration on reconnect.**
   - Disconnect WS mid-phase. Reconnect (same agentId). Expect: state resumes from the persisted snapshot, the in-progress phase resumes or restarts cleanly.
   - **Risk specifically caught:** `stateMigration.ts` not handling the locally-shaped persisted state from before M3 deploy. If you can reproduce against a previously-initialized agent (e.g., one created on the `chore/bumps-wrangler-vitest-pool` branch), that's the gold-standard test. Otherwise, doing it inside one `wrangler dev` session is sufficient.

4. **BYOP smoke.**
   - `POST /api/byop/import` with a small public GitHub repo. Expect: `CodebaseAnalyzer` DO ingests it (this is unchanged by M3). Then the import flows into `getAgentStub` → `initialize()` — verify the BYOP-shaped `initArgs` (no `templateInfo`?) is accepted by the new `CodeGeneratorAgent.initialize()`. If `templateInfo` is required by upstream's signature, **this is a blocker for M3** and needs a discriminated init type (BYOP doesn't have a template, it has analyzed code).
   - **Risk specifically caught:** BYOP-incompatible init args. This is the highest-risk single check.

5. **Error / unhappy paths.**
   - Send an invalid query (empty string) — expect 400.
   - Trigger a phase that fails (e.g., a deeply ambiguous query that produces a non-compilable blueprint). Expect: the agent surfaces an error via WS and the `shouldBeGenerating` flag clears. Should NOT hang the WS or leak the DO into a permanently-busy state.
   - Stop generation mid-phase (`STOP_GENERATION`). Verify state cleanup.
   - **Risk specifically caught:** phasic loop swallowing errors silently, error propagation through behaviors → DO → WS not being wired the same way as our old direct-call path.

6. **Sandbox + dispatcher fallback.**
   - Open a preview URL while sandbox is alive — expect `X-Preview-Type: sandbox` header.
   - Force-stop the sandbox; expect fallback to dispatcher (or graceful 404 if app not yet deployed). This isn't M3-introduced behavior, but the sandbox session ID flows through new code paths now.
   - **Risk specifically caught:** sandboxSessionId being lost during state-shape migration.

7. **AI Gateway proxy unaffected.**
   - From a preview iframe, issue an `/api/proxy/openai` call. Expect: passes the 3-gate check (origin, JWT, D1 ownership). Should be entirely untouched by M3, but worth a sanity check.

---

## 7. Open questions

The scoping doc already resolved OQ1 (scope=a), OQ3 (DO migration risk accepted; binding+class name preserved), OQ5 (collapse, not in-place stub fill). Genuinely-open decisions remaining:

**OQ-A. `agentMode` toggle wire format.**
The frontend (`AgentModeToggle`) sends `agentMode: 'deterministic' | 'smart'` in the `POST /api/agent` body. The new DO state uses `behaviorType: 'phasic' | 'agentic'`. **Proposed:** map at the controller level (`worker/api/controllers/agent/controller.ts` translates `agentMode` → `behaviorType` before calling `initialize`). Frontend unchanged. Confirm.

**OQ-B. `CodeGenState` alias retention.**
`src/api-types.ts:151` re-exports `CodeGenState`, and `worker/api/websocketTypes.ts:2` imports it. **Proposed:** add `export type CodeGenState = PhasicState;` shim in the new `state.ts` so neither frontend nor websocket-types files need to change in M3. (Rename to `AgentState` everywhere in a follow-up M3.5 cleanup.) Confirm.

**OQ-C. `🧠 Initializing SmartCodeGeneratorAgent…` log line.**
This log line is in the current `smartGeneratorAgent.ts:20`. **Proposed:** drop it. Upstream's logger phrasing wins (it'll log `Initializing CodeGeneratorAgent` from `codingAgent.ts`). The brain emoji + "Smart" branding ride with the deleted file. Confirm.

**OQ-D. Agentic behavior in M3.**
Upstream's `agentic.ts` pulls in `AgenticProjectBuilder.ts`, `DeepDebugger.ts`, and the toolkit — all M4/PR8 territory. **Proposed:** copy `agentic.ts` into the tree at commit 2 but stub its public methods to throw `'AgenticBehavior requires PR8; set agentMode to deterministic'`. This keeps the discriminated-union types coherent and lets the codebase compile, while loud-failing at runtime if anyone toggles `agentMode: 'smart'` before M4 lands. Confirm.

**OQ-E. `PhaseImplementation.ts` local-bloat reconciliation.**
Our local file is 36 KB; upstream's is 7.6 KB. That's ~28 KB of fork-only logic accumulated over time. **Question:** do you want me to (a) take-upstream wholesale (likely loses fork-only behavior), (b) diff cell-by-cell and re-apply fork blocks (slow, safest), or (c) leave the operation alone for M3 and ship a follow-up rebase PR? **Recommendation:** (b) — but with a hard time budget. If the rebase doesn't reduce to a clean shape in a day, fall back to (c) and ship M3 with the fork's `PhaseImplementation.ts` still in place (it implements `IPhaseImplementationOperation` which the new phasic behavior should be able to call directly, assuming we preserve the interface). Confirm.

**OQ-F. BYOP init signature.**
BYOP today does not pass `templateInfo` (or passes a synthetic one). Upstream's phasic init requires `templateInfo`; agentic init makes it optional. **Question:** is BYOP an "agentic" project under upstream's taxonomy, or is it a phasic project with a synthetic template? Either answer dictates the type discriminator BYOP uses at `getAgentStub` time. Needs answer before commit 3.

**OQ-G. `lastDeepDebugTranscript` and other M4 fields.**
Upstream `BaseProjectState` carries `lastDeepDebugTranscript: string | null` and `cloudflareToken?` / `wsOrigin?`. **Proposed:** include these in the new `state.ts` with default values; gate any code reading them behind no-op stubs (no DeepDebugger in M3). Confirm.

---

## Key file paths referenced

(forward-slash form, all relative to repo root)

- `worker/agents/core/simpleGeneratorAgent.ts` (delete in commit 4)
- `worker/agents/core/smartGeneratorAgent.ts` (delete in commit 4)
- `worker/agents/core/state.ts:62` (replace in commit 1)
- `worker/agents/core/types.ts:84` (replace in commit 1)
- `worker/agents/core/websocket.ts:1,4` (repoint import in commit 2)
- `worker/agents/core/features/{index,types}.ts` (leave alone; minor reconcile in commit 7)
- `worker/agents/index.ts:2,15-71` (rebase typings in commit 3)
- `worker/agents/prompts.ts:1475` (rebase in commit 6)
- `worker/agents/schemas.ts:169` (rebase in commit 6)
- `worker/agents/constants.ts:105` (small reconcile in commit 6)
- `worker/agents/operations/{PhaseGeneration,FileRegeneration,PhaseImplementation,UserConversationProcessor,common}.ts` (rebase in commit 5)
- `worker/agents/operations/{PostPhaseCodeFixer,SimpleCodeGeneration}.ts` (new in commit 5)
- `worker/agents/operations/prompts/phaseImplementationPrompts.ts` (new in commit 5)
- `worker/index.ts:2,17` (cut over in commit 3)
- `worker/api/websocketTypes.ts:2` (alias shim in commit 1)
- `worker/api/controllers/agent/controller.ts:23,148` (no change if OQ-A approved)
- `worker/api/controllers/appView/{controller,types}.ts` (no change expected)
- `src/api-types.ts:151` (no change if OQ-B approved)
- `wrangler.jsonc:106-107, :143-222` (no change — binding + class name preserved; no new migration tag)
