# Phase E M3 — port plan **v2** (agentic-first)

**Anchor date:** 2026-05-19
**Status:** planning artifact, no code yet
**Predecessor:** `M3_PORT_PLAN.md` (v1, agentic-deferred) — kept for diff readability
**Companion:** `CF_MAY_2026_PRACTICES.md` (Cloudflare improvements to fold into M3)

This is the revision of M3 driven by the directive **"agentic is first-class, not deferred."** v1 scoped agentic mode as a throwing stub at commit 2; v2 lands a working agentic path inside M3 by absorbing the pieces of what was previously M4/PR8 that the agentic behavior strictly requires. We do not expand to the full M4 set — the Git DO subsystem, the sandbox local-proxy refactor, and Phase-E PR 7's auth/rate-limit work remain deferred.

The DO binding `CodeGenObject` and exported class name `CodeGeneratorAgent` are preserved. No new `wrangler.jsonc` migration tag.

---

## What changed vs v1 (orientation)

| Area | v1 (agentic deferred) | v2 (agentic-included) |
|---|---|---|
| `behaviors/agentic.ts` | Throwing stub at commit 2; deferred to M4/PR8 | **Real implementation at commit 7**, gated by `agentMode: 'smart'` |
| `operations/AgenticProjectBuilder.ts` | Out of scope (M4) | **In scope** — required by `agentic.ts.build()` |
| `operations/DeepDebugger.ts` | Out of scope (M4) | **Optional** — not strictly required for basic agentic build; deferred unless `agentic.ts` references it on a hot path |
| `tools/toolkit/*` | Out of scope; "stub-fail until M4" | **In scope** — port the 15 toolkit files `AgenticProjectBuilder` actually wires |
| `tools/customTools.ts` | "Leave alone" | **Rebase** — upstream's version wires `executeToolWithDefinition`, `buildDebugTools`, `wrapToolsWithLoopDetection`; ours is 35 lines and incomplete |
| `utils/conversationCompactifier.ts`, `utils/templateCustomizer.ts`, `utils/idGenerator.ts` | Not mentioned | **Port** — `agentic.ts` imports them; we don't have local equivalents |
| `OperationOptions<TContext>` typing | Not mentioned | Operations now generic in `TContext`; `AgenticGenerationContext` adds discriminator |
| `BYOP` taxonomy decision | OQ-F (open) | **Resolved**: BYOP is agentic — pre-imported codebase becomes the starting filesystem; builder iterates with tools. No synthetic template hack. |
| `lastDeepDebugTranscript` state field | Provide default, gate readers | Same — DeepDebugger itself stays out of M3 unless promoted (see commit 8 optional) |
| Commit count | 7 | **9 (with 1 optional 10th)** |
| Manual smoke test surface | Phasic-only | Phasic **+** agentic + agentic-BYOP |
| May-2026 CF adoption | None | **5 items folded in** — see `CF_MAY_2026_PRACTICES.md` recommended list |

---

## 1. Upstream surface reality check

Enumerated via `gh api repos/cloudflare/vibesdk/contents/<path>?ref=main` (2026-05-19). Sizes that didn't change from v1 are abbreviated.

### `worker/agents/core/` (upstream)
Unchanged from v1. `codingAgent.ts` (33,219 B), `AgentCore.ts` (1,720 B), `AgentComponent.ts` (3,046 B), `state.ts` (3,077 B), `stateMigration.ts` (9,678 B), `types.ts` (4,018 B), `websocket.ts` (16,977 B).

### `worker/agents/core/behaviors/` (upstream)
- `base.ts` (79,035 B) — `BaseCodingBehavior<TState>`. Required.
- `phasic.ts` (30,814 B) — `PhasicCodingBehavior`. Required.
- `agentic.ts` (16,130 B) — **MOVED INTO M3 SCOPE.** Imports: `UserConversationProcessor`, `PhaseImplementationOperation`, `FileRegenerationOperation`, `AgenticProjectBuilderOperation`, `PhaseGenerationOperation`, `FastCodeFixerOperation` (from `PostPhaseCodeFixer`), `SimpleCodeGenerationOperation`, plus `templateCustomizer`, `conversationCompactifier`, `idGenerator`.

### `worker/agents/core/objectives/` (upstream)
Unchanged from v1. `base.ts`, `strategies/{index,presentation,types}.ts`. Small, copy-in as-is.

### `worker/agents/core/features/` (upstream)
Unchanged from v1.

### `worker/agents/operations/` (upstream)
| Path | Size | M3 v2 disposition |
|---|---|---|
| `AgenticProjectBuilder.ts` | 11,966 B | **IN SCOPE** — agentic's build engine. Imports 15 toolkit files. |
| `DeepDebugger.ts` | 7,626 B | **OPTIONAL** (commit 8, conditional). Not directly imported by `agentic.ts` — `agentic.ts` only references the tool factory `createDeepDebuggerTool` via `customTools.ts`. If we stub the tool, DeepDebugger.ts can stay out of M3. |
| `FileRegeneration.ts` | 4,853 B | Rebase (was M3 v1). |
| `PhaseGeneration.ts` | 22,020 B | Rebase (was M3 v1). |
| `PhaseImplementation.ts` | 7,643 B | Rebase carefully (was M3 v1; our local 36 KB). |
| `PostPhaseCodeFixer.ts` | 4,084 B | **NEW** — exports `FastCodeFixerOperation` that `agentic.ts` imports as its `fastCodeFixer`. |
| `SimpleCodeGeneration.ts` | 11,347 B | **NEW** — agentic uses `SimpleCodeGenerationOperation` for non-template flows. |
| `UserConversationProcessor.ts` | 32,833 B | Rebase. Exports `buildToolCallRenderer` which `agentic.ts` imports. |
| `common.ts` | 10,205 B | Rebase (take-upstream; ours is a stub). **Exports `AgentOperationWithTools`, `ToolSession`, `ToolCallbacks`, `OperationOptions<TContext>`** — `agentic.ts` needs all of these. |
| `prompts/agenticBuilderPrompts.ts` | 22,398 B | **NEW** — `AgenticProjectBuilder.ts` imports `getSystemPrompt` from here. |
| `prompts/deepDebuggerPrompts.ts` | 23,199 B | **OPTIONAL** (commit 8). |
| `prompts/phaseImplementationPrompts.ts` | 3,063 B | NEW. |
| `Guardrail.md` | 2,059 B | Leave alone. |

### `worker/agents/tools/` (upstream) — **NEW SURFACE IN M3 v2**
| Path | Size | M3 v2 disposition |
|---|---|---|
| `customTools.ts` | 5,416 B | **REBASE** (ours is 35 LoC, upstream is the real wiring). |
| `types.ts` | 5,366 B | **REBASE** (ours is 34 LoC, missing `ToolDefinition`'s onStart/onComplete hooks). |
| `mcpManager.ts` | 4,239 B | Out of scope — MCP server support. The transitive `@modelcontextprotocol/sdk` cost is paid once via `agents@0.12.4` framework bump; we don't need to expose MCP-server features in M3. |
| `resources.ts` | 2,598 B | Out of scope. |
| `resource-types.ts` | 3,102 B | Out of scope. |

### `worker/agents/tools/toolkit/` (upstream) — **NEW SURFACE IN M3 v2**
Upstream has 24 toolkit files. `AgenticProjectBuilder.ts` imports exactly **15** of them (the ones the agentic builder loop wires):

| File | Size | Required by agentic? |
|---|---|---|
| `generate-blueprint.ts` | 1,856 B | YES |
| `alter-blueprint.ts` | 2,336 B | YES |
| `init-suitable-template.ts` | 3,825 B | YES |
| `virtual-filesystem.ts` | 2,409 B | YES |
| `generate-files.ts` | 2,647 B | YES |
| `regenerate-file.ts` | 1,335 B | YES |
| `run-analysis.ts` | 802 B | YES |
| `deploy-preview.ts` | 1,394 B | YES (we have it locally; small reconcile) |
| `get-runtime-errors.ts` | 1,797 B | YES |
| `get-logs.ts` | 2,916 B | YES (we have it locally; reconcile) |
| `exec-commands.ts` | 2,240 B | YES |
| `wait.ts` | 1,060 B | YES |
| `git.ts` | 4,035 B | YES — but **Git DO subsystem is out of scope**. Strategy: port a thinned `git.ts` that only exposes commit/status/log operations the agentic loop calls; defer the full Git DO that's behind PR6. |
| `generate-images.ts` | 801 B | YES |
| `completion-signals.ts` | 2,601 B | YES (exports `createMarkGenerationCompleteTool`, also `createMarkDebuggingCompleteTool` used only by DeepDebugger — soft-import) |
| `deep-debugger.ts` | 2,372 B | OPTIONAL (only via `customTools.buildDebugTools`) |
| `wait-for-debug.ts` | 1,148 B | OPTIONAL (DeepDebugger path) |
| `wait-for-generation.ts` | 1,143 B | NO (not in `AgenticProjectBuilder` imports) |
| `feedback.ts` | 2,271 B | NO — but `customTools.ts` registers it |
| `queue-request.ts` | 856 B | NO — `customTools.ts` only |
| `read-files.ts` | 1,382 B | NO — `customTools.ts` (post-generation tools) |
| `rename-project.ts` | 802 B | NO — `customTools.ts` |
| `initialize-slides.ts` | 1,259 B | NO (presentation-mode only; skip) |
| `web-search.ts` | 7,688 B | NO (we have it locally) |

**Net new toolkit files for M3 v2**: ~14 small files (~28 KB total) plus reconciling 2 we already have. Manageable.

### `worker/agents/utils/` (upstream) — **NEW SURFACE IN M3 v2**
`agentic.ts` imports `compactifyContext` from `utils/conversationCompactifier` (11,111 B) and `customizeTemplateFiles`/`generateProjectName` from `utils/templateCustomizer` (6,480 B), plus `IdGenerator` from `utils/idGenerator` (537 B). All three move into M3 scope. The other utils (`codebaseContext`, `packageSyncer`, `preDeploySafetyGate`, `templates`) are not strictly required by agentic — defer to a follow-up.

### `worker/agents/` top-level (upstream)
Same as v1. `prompts.ts` (66,485 B), `schemas.ts` (12,145 B — now must include `AgenticBlueprint` discriminator since both behaviors use it), `constants.ts` (4,860 B).

---

## 2. Local surface inventory

Same dispositions as v1 except:

| Path | v1 disposition | v2 disposition |
|---|---|---|
| `worker/agents/core/behaviors/agentic.ts` | (not in v1; would be added as throwing stub at commit 2) | **Port real implementation at commit 7** |
| `worker/agents/tools/customTools.ts` | LEAVE ALONE | **REBASE** at commit 6 (35 LoC → ~150 LoC) |
| `worker/agents/tools/types.ts` | LEAVE ALONE | **REBASE** at commit 6 |
| `worker/agents/tools/toolkit/{deploy-preview,feedback,get-logs,queue-request,web-search}.ts` | leave alone | **RECONCILE** — small upstream diff on the two we share; rest are leave-alone or skipped |
| `worker/agents/utils/idGenerator.ts` | n/a | **NEW** (exports `IdGenerator` class agentic needs) |
| `worker/agents/utils/conversationCompactifier.ts` | n/a | **NEW** (commit 7) |
| `worker/agents/utils/templateCustomizer.ts` | n/a | **NEW** (commit 7) |
| `worker/agents/operations/common.ts` | take-upstream | take-upstream **and** ensure `AgentOperationWithTools` is exported — agentic depends on it |
| `worker/agents/operations/PostPhaseCodeFixer.ts` | NEW | NEW (unchanged) |
| `worker/agents/operations/SimpleCodeGeneration.ts` | NEW | NEW (unchanged) |
| `worker/agents/operations/AgenticProjectBuilder.ts` | not in scope | **NEW** at commit 7 |
| `worker/agents/operations/prompts/agenticBuilderPrompts.ts` | not in scope | **NEW** at commit 7 |

### Files M3 v2 must NOT touch
Same as v1, plus:
- `worker/agents/tools/mcpManager.ts`, `resources.ts`, `resource-types.ts` (MCP-server features deferred)
- `worker/agents/tools/toolkit/{initialize-slides,rename-project,feedback,queue-request,read-files,wait-for-generation,web-search}.ts` (not on the agentic hot path; some we already have locally)
- `worker/agents/git/` (Git DO subsystem — still M4)
- `worker/services/sandbox/{fileTreeBuilder,request-handler,utils,zipExtractor}.ts` (sandbox local-proxy refactor — M4)

---

## 3. State + DO interface compat

Same superset analysis as v1, with these additions for agentic:

### Fields agentic.ts reads from state (must be in `AgenticState`)
- `query`, `projectName`, `blueprint`, `templateName`, `sandboxInstanceId`, `commandsHistory`, `lastPackageJson`, `sessionId`, `hostname`, `metadata`, `projectType`, `behaviorType: 'agentic'`
- `pendingUserInputs: PendingUserInput[]` — queue for messages received during a tool call
- `pendingUserImages?: ProcessedImageAttachment[]` — image queue
- The conversation state is read via `infrastructure.getConversationState()` (DO accessor) — not a direct field

### `AgenticBlueprint` schema
Upstream's `schemas.ts` defines `AgenticBlueprint extends Blueprint` with a typed `plan: Array<{ milestone, description, ... }>`. The phasic blueprint is the existing one. The discriminated union becomes a runtime check (`'plan' in bp && Array.isArray(bp.plan)` as in `AgenticProjectBuilder.ts:97`). We must port this.

### WebSocket protocol
Unchanged. The frontend sends `agentMode: 'deterministic' | 'smart'` and the controller translates it to `behaviorType`. v1 OQ-A is now resolved (controller-level translation).

### `lastDeepDebugTranscript` and `cloudflareToken`/`wsOrigin`
Still gated — DeepDebugger is optional in v2. Provide defaults in `BaseProjectState`.

---

## 4. Divergence touchpoints

| Divergence | v2 status |
|---|---|
| **D1-backed secrets vs upstream `SecretsClient`** | v1 said "no-op shim is fine." v2 reconsiders: agentic mode does NOT call into `SecretsClient` on its hot path (verified by reading `agentic.ts` imports — no `SecretsClient` reference). The only `SecretsClient` callers are in the deploy-to-Cloudflare flow inside `codingAgent.ts` itself (OAuth token storage for user-owned account deploys). Our app deploys to OUR account via dispatch namespaces, not user accounts. **Decision: shim with a no-op returning `null` for every method.** No vault stub needed for M3. Flag if agentic-mode requirement surfaces during commit 7 work. |
| **BYOP taxonomy** | v1 OQ-F was open. **v2 resolves it: BYOP is an agentic project.** The CodebaseAnalyzer DO produces a `filesIndex` + summary; agentic builder iterates on top using tools. No synthetic template. This means `getAgentStub` for a BYOP agent must pass `behaviorType: 'agentic'` at init. Frontend's `agentMode` toggle becomes meaningful for BYOP — but BYOP defaults to smart. |
| **`agentMode` mapping** | v1 OQ-A was open. **v2 resolves**: controller maps `'deterministic' → 'phasic'`, `'smart' → 'agentic'`. Frontend unchanged. |
| **`PLATFORM_CAPABILITIES = { app: true }`** | v2 keeps the gate at `app=true`. `getBehaviorTypeForProject('app')` returns `'phasic'` by default, but the controller can override per-request based on `agentMode`. So a single project-type can run either behavior. Verify upstream's `features/types.ts` allows this — if it doesn't, we add a runtime override in `initialize()`. |
| **Tooling — Git DO subsystem** | Upstream's `git.ts` toolkit file talks to `worker/agents/git/` (a Durable Object). We don't have that DO and aren't porting it in M3. **Decision: port a thinned `git.ts`** that no-ops or routes to existing sandbox-side git operations. Risks: agentic builder may produce flow assuming git introspection. Acceptable for M3 — agentic mode without rich git is still useful; phasic mode is unaffected. |
| **Sentry-Cloudflare 10.30 → 10.49+** | NEW for v2. We're on 10.30.0; the 10.49+ line adds `enableRpcTracePropagation` and DO-alarm separate traces. **Folded into commit 9** — see `CF_MAY_2026_PRACTICES.md`. |
| **WS auth (cookies/tickets)** | Same as v1 — drop ticket plumbing from ported `codingAgent.ts`, keep route-level auth. |
| **`agents@0.2.32 → 0.12.4`** | NEW concern for v2. Cloudflare's `agents` package has shipped 10+ minor versions since our M2 anchor (0.2.32). Most are patch fixes; the genuine API additions are sub-agents (0.11.5+), agent-as-tool orchestration (0.12.0), chat recovery improvements. None are required by upstream `vibesdk` `codingAgent.ts` as written. **Decision: stay on 0.2.32 for M3, bump separately in an M3.5.** Avoids stacking risk. |

### Files in `worker/` that import from `worker/agents/`
Same as v1. Plus: any new `worker/api/controllers/agent/controller.ts` mapping for `agentMode` → `behaviorType`.

---

## 5. Sequenced port plan (v2)

**9 commits + 1 optional.** Order is load-bearing. Each commit is atomic; commit 1 is the only documented broken-intermediate (typecheck-fails) as in v1.

### Commit 1 — `feat(agents): introduce AgentCore + AgentComponent + new state shape`
Identical to v1 commit 1. Files added:
- `worker/agents/core/AgentCore.ts`
- `worker/agents/core/AgentComponent.ts`
- `worker/agents/core/stateMigration.ts`
- `worker/agents/core/state.ts` — **rewrite** to discriminated union (`BaseProjectState` + `PhasicState` + `AgenticState` + `type AgentState = PhasicState | AgenticState`). Add `pendingUserInputs`, `pendingUserImages`, `lastDeepDebugTranscript` defaults so the union covers agentic without follow-up.
- `worker/agents/core/types.ts` — rewrite to upstream surface.

Files modified:
- `state.ts` exports `CodeGenState = PhasicState` shim.

**What it does:** type substrate. `simpleGeneratorAgent.ts` and `smartGeneratorAgent.ts` fail to typecheck (expected, documented intermediate).

**Verification:** `npm run typecheck` — targeted errors only in the two files about to be deleted.

**Risk:** Discriminated union shape mistakes cascade through commits 2 and 7. Get this right.

---

### Commit 2 — `feat(agents): port codingAgent + behaviors/base + behaviors/phasic`
Files added:
- `worker/agents/core/codingAgent.ts` (light-edit: drop `GitVersionControl`, `SecretsClient` (→ no-op shim), ticket manager imports)
- `worker/agents/core/behaviors/base.ts`
- `worker/agents/core/behaviors/phasic.ts`
- `worker/agents/core/objectives/base.ts`, `objectives/strategies/{index,presentation,types}.ts`
- `worker/services/secrets/SecretsClient.ts` (no-op shim — methods return `null`/empty)
- `worker/agents/core/behaviors/agentic.ts` — **stub (throws `'Not implemented; landed in commit 7'`)**. The file exists so the discriminated union and behavior-factory typecheck cleanly. Real body lands in commit 7.

Files modified:
- `worker/agents/core/websocket.ts` — repoint import from `SimpleCodeGeneratorAgent` to `CodeGeneratorAgent`.

**What it does:** lands the new DO class with phasic behavior wired. Agentic stub guarantees compile-clean. `simpleGeneratorAgent.ts` and `smartGeneratorAgent.ts` still exist, no longer wired.

**Verification:** `npm run typecheck` clean. `npm run test` — phasic-only smoke; agentic-touching tests (none today) would skip.

**Risk:** behavior-factory dispatch on `behaviorType` must default to phasic if state is malformed.

---

### Commit 3 — `refactor(agents): repoint DO export and index facade`
Identical to v1 commit 3. Files modified:
- `worker/index.ts` lines 2 + 17.
- `worker/agents/index.ts` — generic type swap, preserve `(env, agentId, searchInOtherJurisdictions, logger)` signature.

**What it does:** cut-over. New DO class is live for `CodeGenObject`.

**Verification:** `npm run typecheck`, `npm run test`, manual phasic smoke.

**Risk:** Sentry wrapping at `worker/index.ts:17` must wrap the new class.

---

### Commit 4 — `chore(agents): delete simpleGeneratorAgent + smartGeneratorAgent`
Identical to v1 commit 4. Files deleted:
- `worker/agents/core/simpleGeneratorAgent.ts`
- `worker/agents/core/smartGeneratorAgent.ts`

**Verification:** clean grep for `SimpleCodeGeneratorAgent`/`SmartCodeGeneratorAgent`; `npm run typecheck`, `npm run lint`, `npm run test`.

---

### Commit 5 — `refactor(agents): rebase phasic-relevant operations against upstream`
Identical to v1 commit 5 in scope. Files modified:
- `worker/agents/operations/PhaseGeneration.ts` (rebase)
- `worker/agents/operations/FileRegeneration.ts` (rebase)
- `worker/agents/operations/PhaseImplementation.ts` (cautious rebase — see OQ-E (now OQ-E-v2))
- `worker/agents/operations/UserConversationProcessor.ts` (cautious rebase)
- `worker/agents/operations/common.ts` (take-upstream — exports `AgentOperationWithTools`, `OperationOptions<TContext>`, `ToolSession`, `ToolCallbacks`)
- `worker/agents/operations/PostPhaseCodeFixer.ts` (NEW from upstream)
- `worker/agents/operations/SimpleCodeGeneration.ts` (NEW from upstream)
- `worker/agents/operations/prompts/phaseImplementationPrompts.ts` (NEW)

**Verification:** `npm run typecheck`, `npm run test`. Manual phasic smoke still green.

**Risk:** `common.ts` exports a generic `OperationOptions<TContext extends GenerationContext>` — any local operation that referenced the old non-generic shape needs a generic-default. `CodeReview.ts`, `FastCodeFixer.ts`, `ScreenshotAnalysis.ts` (fork-only operations) need a one-line type update each.

---

### Commit 6 — `feat(agents): port tools/customTools + types + minimal toolkit`
Files added (under `worker/agents/tools/toolkit/`):
- `alter-blueprint.ts`, `completion-signals.ts`, `exec-commands.ts`, `generate-blueprint.ts`, `generate-files.ts`, `generate-images.ts`, `get-runtime-errors.ts`, `git.ts` (thinned — no Git DO; routes to existing sandbox-side git operations), `init-suitable-template.ts`, `regenerate-file.ts`, `run-analysis.ts`, `virtual-filesystem.ts`, `wait.ts`

Files modified:
- `worker/agents/tools/customTools.ts` — rebase to upstream (35 LoC → ~150 LoC). Adds `executeToolWithDefinition`, `buildAgenticTools`, `buildDebugTools` (the last one references `createDeepDebuggerTool` and `createWaitForDebugTool` — soft-import or guard since DeepDebugger is deferred).
- `worker/agents/tools/types.ts` — rebase. Adds onStart/onComplete hooks.
- `worker/agents/tools/toolkit/deploy-preview.ts` — reconcile small diff with upstream
- `worker/agents/tools/toolkit/get-logs.ts` — reconcile small diff with upstream

**What it does:** stands up the tool substrate `AgenticProjectBuilder` and `agentic.ts` will consume in commit 7. Nothing on the live path changes — `customTools.ts`'s consumers are only the agentic behavior (still stubbed) and phasic conversation processing (which uses `RenderToolCall` only).

**Verification:** `npm run typecheck`. Tools are pure factories — no runtime invocation in this commit.

**Risk:** Thinned `git.ts` may produce a runtime no-op that confuses the agentic loop. Mitigation: make the no-op tool **explicitly tell the LLM "git operations not available"** so it can plan around the gap rather than retry. Same playbook as the upstream MCP-server thinning.

---

### Commit 7 — `feat(agents): port AgenticProjectBuilder + agentic prompts + utils + wire agentic behavior`
**THE HEAVY COMMIT.** ~30 KB net code added.

Files added:
- `worker/agents/operations/AgenticProjectBuilder.ts` (11,966 B from upstream)
- `worker/agents/operations/prompts/agenticBuilderPrompts.ts` (22,398 B from upstream)
- `worker/agents/utils/idGenerator.ts` (537 B — exports `IdGenerator` class)
- `worker/agents/utils/conversationCompactifier.ts` (11,111 B)
- `worker/agents/utils/templateCustomizer.ts` (6,480 B)
- `worker/agents/domain/values/GenerationContext.ts` — extend to discriminated `AgenticGenerationContext` (add `GenerationContext.isAgentic` type-guard and `GenerationContext.from(state, templateDetails, logger)` factory that branches on `behaviorType`)

Files modified:
- `worker/agents/core/behaviors/agentic.ts` — **replace stub with real upstream port.**
- `worker/agents/schemas.ts` — add `AgenticBlueprint` discriminator
- `worker/api/controllers/agent/controller.ts` — map `agentMode: 'smart'` → `behaviorType: 'agentic'` (resolves v1 OQ-A)

**What it does:** agentic mode is now live behind `agentMode: 'smart'`. Both BYOP and conventional `/api/agent` POSTs can opt in.

**Verification:**
- `npm run typecheck`, `npm run test` — same numbers as commit 5.
- **Mandatory manual agentic smoke** (see §6). If smoke fails, this is the rollback point — commit 7 is the first commit with user-visible new functionality.

**Risk callouts:**
- **High**: `AgenticProjectBuilder` references `customizeTemplateFiles`, `generateProjectName`. If our template path differs, behavior degrades silently. Cross-check with `worker/services/templates/` (existing local template-fetch code).
- **High**: `compactifyContext` in `conversationCompactifier.ts` calls inference. Costs LLM tokens on every 9th tool call. Verify rate-limit budget.
- **Medium**: `agentic.ts` calls `this.fileManager.saveGeneratedFiles(filesToSave, 'Initialize…', true)` — the `true` flag triggers a git commit. With thinned `git.ts` this should no-op cleanly.
- **Medium**: agentic builder may emit `tool` events on the WS that the frontend's `handle-websocket-message.ts` doesn't recognize. The render path is via the existing `CONVERSATION_RESPONSE` message type (see `agentic.ts:160-170`), so the frontend should treat them as conversation chunks. Verify.

---

### Commit 8 — `refactor(agents): rebase prompts.ts and schemas.ts (Dreamforge re-substitution)`
Identical to v1 commit 6 in shape. Files modified:
- `worker/agents/prompts.ts` (take-upstream, re-apply Dreamforge substitutions)
- `worker/agents/schemas.ts` (already touched in commit 7 — small reconcile only)
- `worker/agents/constants.ts` (small reconcile)

**Verification:** `npm run typecheck`, `npm run test`, manual phasic + agentic smoke.

**Risk:** prompt-rebase regressions — highest generator-quality risk in M3.

---

### Commit 9 — `chore(agents+infra): final cleanup + CF May-2026 adoptions`
Files modified:
- `worker/agents/core/features/types.ts` — small upstream reconcile
- `worker/agents/core/types.ts` — drop locally-shadowed types
- `wrangler.jsonc` — bump `compatibility_date` to `2026-04-07` or later (unblocks WS auto-close, agents-package-required runtime features)
- `package.json` — bump `@sentry/cloudflare` to `^10.49.0` (gives DO-alarm separate traces and `enableRpcTracePropagation`)
- `worker/observability/sentry.ts` — enable `enableRpcTracePropagation: true` for DO→DO RPC tracing visibility (key for agentic-mode debugging)
- `worker/observability/sentry.ts` — add `streamGenAiSpans: true` (10.53+ feature) only if we land the sentry bump at 10.53+; otherwise leave for follow-up

Files possibly removed (`knip`):
- Anything dead-code flagged by `npm run knip` after the deletion in commit 4 + new code in commit 7

**Verification:** `npm run typecheck`, `npm run lint`, `npm run test`, `npm run knip`. Manual smoke through Sentry — confirm a DO alarm produces a fresh trace and an RPC call (DO→DO) shows up linked in the trace tree.

**Risk:** Sentry bump is a major-minor jump (10.30 → 10.49+). Read the migration guide for any peer-dep changes. Worst case: revert this commit and ship M3 without observability changes.

---

### Commit 10 (OPTIONAL) — `feat(agents): port DeepDebugger + agentic auto-recovery`
**Gate:** only land if smoke test in commit 7 reveals that agentic mode without DeepDebugger produces too many unrecoverable runtime errors.

Files added:
- `worker/agents/operations/DeepDebugger.ts` (7,626 B)
- `worker/agents/operations/prompts/deepDebuggerPrompts.ts` (23,199 B)
- `worker/agents/tools/toolkit/deep-debugger.ts` (2,372 B)
- `worker/agents/tools/toolkit/wait-for-debug.ts` (1,148 B)

Files modified:
- `worker/agents/tools/customTools.ts` — un-soft-import `createDeepDebuggerTool` and `createWaitForDebugTool`
- `worker/agents/core/codingAgent.ts` — wire `deepDebug()` method if upstream exposes it on the DO

**Verification:** Manual smoke with intentionally-broken phase to trigger debugger path.

**Risk:** DeepDebugger consumes runtime errors from sandbox; our sandbox runtime-errors API surface may differ from upstream's. Verify before landing.

---

## 6. Specific risk callouts (for the manual smoke test) — v2

The user will run a manual smoke test on `wrangler dev` before the M3 PR is ready-for-merge. The test must exercise everything in v1 §6, **plus**:

### NEW: 8. End-to-end agentic generation
- `POST /api/agent` with `{ query: "build a kanban app with drag-drop", agentMode: "smart" }`. Expect:
  - HTTP response: agentId + websocketUrl (same as phasic).
  - WS connection at `/api/agent/:agentId/ws` opens.
  - First WS frames: `GENERATION_STARTED`, then a stream of `CONVERSATION_RESPONSE` frames with `tool` fields (e.g. `name: 'Generate Blueprint'`, `status: 'streaming' | 'success'`).
  - Eventually `tool: { name: 'Generate Files', status: 'success' }` and a deployable preview URL.
- **Distinct from phasic**: there is no fixed `PHASE_CONCEPT`/`PHASE_IMPLEMENTATION` sequence. The LLM orchestrates tool calls.
- **Risk caught**: agentic builder loop wiring, tool-event WS marshalling, conversation compactification under load.

### NEW: 9. Agentic tool visibility in Sentry / Workers Logs
- Trigger an agentic generation, then open Sentry traces:
  - Confirm `enableRpcTracePropagation: true` is showing DO→DO RPC calls (CodeGeneratorAgent → sandbox / dispatcher) linked into the parent trace.
  - Confirm tool-call spans appear (each `executeToolWithDefinition` should produce a span if instrumented — if not, file a follow-up to add `Sentry.startSpan` wrappers).
- Open Workers Logs (`wrangler tail` or dashboard):
  - Confirm structured logs from `agentic.ts` show up with `toolCallCount`, `projectName`, conversation IDs.
  - Confirm `head_sampling_rate: 1` is keeping every invocation visible. (Cost note: at production scale this should be lowered.)
- **Risk caught**: missing instrumentation on the agentic hot path, hibernation losing log context.

### NEW: 10. Agentic conversation handling under load
- Mid-generation, send a `USER_SUGGESTION` (`agentic.ts:handleUserInput()` queues it). Verify:
  - The user message is broadcast as a `Message Queued` tool render.
  - After the current tool call completes, the queued message lands in `pendingUserInputs` and gets compiled into the next generation iteration.
  - Sending 3+ messages in rapid succession (faster than tool-call cadence) doesn't lose any.
- **Risk caught**: queue draining, race conditions in `fetchPendingUserRequests()`.

### NEW: 11. BYOP via agentic taxonomy
- `POST /api/byop/import` with a small public repo. Then `POST /api/agent` for the resulting agentId — verify it goes through agentic path with the imported `filesIndex` as starting state.
- Verify `behaviorType` in the DO is `'agentic'` (not `'phasic'`).
- Issue a build request; verify the agentic builder uses `generate-files` / `regenerate-file` tools against the existing tree (not `generate_blueprint` from scratch).
- **Risk caught**: BYOP init path coupling to the agentic discriminator. This is the v1 OQ-F decision validated.

### NEW: 12. Mode switch within a session (negative test)
- Initialize a session as `agentMode: 'deterministic'`. Attempt to set `agentMode: 'smart'` mid-session.
- Expected: rejected. Behavior type is locked at init.
- **Risk caught**: state-shape corruption from mid-flight discriminator switches.

### NEW: 13. WS hibernation across phases (CF May-2026 adoption test)
- After `compatibility_date` bump to `2026-04-07+`:
  - Disconnect WS mid-phase. Wait > 30 seconds. Reconnect.
  - Verify DO state is intact, generation continues.
  - Verify Sentry shows the alarm-driven resume as a separate trace (10.49+ behavior).
- **Risk caught**: compat-date bump regressing existing flows.

Items 1–7 from v1 §6 (phasic e2e, WS round-trip, DO state hydration, BYOP phasic-style smoke, error/unhappy paths, sandbox/dispatcher fallback, AI Gateway proxy) remain mandatory.

---

## 7. Open questions (v2)

v1 OQ-A (`agentMode` translation), OQ-B (`CodeGenState` alias), OQ-C (log line phrasing), OQ-D (agentic-in-M3) are all **resolved by the v2 directive itself**:
- OQ-A → resolved. Controller-level translation, frontend unchanged.
- OQ-B → resolved. Keep `CodeGenState = PhasicState` alias for one release; rename in a follow-up.
- OQ-C → resolved. Drop the brain emoji + Smart phrasing.
- OQ-D → resolved. Agentic is real in M3.

v1 OQ-E (PhaseImplementation rebase strategy), OQ-F (BYOP taxonomy), OQ-G (M4-shaped state fields) carry forward:
- **OQ-E-v2**: Same recommendation as v1. Diff cell-by-cell with a hard time budget; fall back to leaving our 36 KB local file in place if rebase blows up. Still open.
- **OQ-F**: **RESOLVED.** BYOP is agentic. Documented above.
- **OQ-G**: Same recommendation as v1. Include `lastDeepDebugTranscript`, `cloudflareToken?`, `wsOrigin?` in the new state with safe defaults. **Still open** — confirm or override.

### NEW open questions

**OQ-H. Thinned `git.ts` tool — informative no-op or full skip?**
The agentic builder's `generate-blueprint` and `init-suitable-template` paths don't strictly need git. Other agentic flows might benefit from `git status`/`git log` introspection for "what's already done" awareness. We're skipping the Git DO subsystem in M3. **Proposed:** ship a `git.ts` tool whose implementation calls our existing sandbox-side git commands (since the sandbox already wraps a real git CLI for BYOP clones). Returns real output. If sandbox git is unavailable, returns `{ ok: false, reason: 'Git tooling unavailable; plan without git introspection.' }`. Confirm.

**OQ-I. DeepDebugger inclusion (commit 10).**
Three positions:
- (a) Land DeepDebugger in M3 as commit 10. Costs ~36 KB more port surface, but agentic mode is materially better with it.
- (b) Ship M3 without DeepDebugger; iterate based on smoke test. Likely outcome: a follow-up PR a week later.
- (c) Ship M3 without DeepDebugger and wire only the **completion-signals.ts** half (so the agentic builder can correctly signal "MVP complete"); promote the rest to a separate "agentic polish" PR.

**Recommendation:** (c). Confirm.

**OQ-J. `agents@0.2.32 → 0.12.4` bump timing.**
The framework has shipped 0.3 → 0.12 since our anchor (sub-agents, agent-as-tool orchestration, chat recovery improvements). None are *required* by the upstream `codingAgent.ts` port. **Proposed:** stay at 0.2.32 for M3; bump in a separate M3.5 immediately after smoke. Splits "framework upgrade broke something" from "agentic port broke something." Confirm.

**OQ-K. `enableRpcTracePropagation` adoption (May-2026 adoption).**
Sentry-Cloudflare 10.49+ adds opt-in RPC trace propagation. This is genuinely valuable for agentic-mode debugging (DO→DO calls become a connected trace tree). **Proposed:** bump Sentry in commit 9 and turn it on. Confirm.

**OQ-L. Compatibility-date bump (`2025-08-10` → `2026-04-07`).**
Required for WS auto-close on Close frames and several agents-package safety nets. **Risk:** other compat-date-gated behaviors could shift silently. Mitigation: read the compat-flag diff list before bumping. **Proposed:** bump in commit 9. Confirm or override.

**OQ-M. Workers Logs sampling rate at production scale.**
Currently `head_sampling_rate: 1` (every request). At agentic scale this gets expensive — each generation issues many DO calls. **Proposed:** keep `1` for development/staging; introduce a per-environment override (`head_sampling_rate: 0.1` in production) as a follow-up after we measure actual log volume. Not blocking M3. Note.

---

## Key file paths referenced (additions vs v1)

(forward-slash form, all relative to repo root)

NEW in v2:
- `worker/agents/core/behaviors/agentic.ts` (real port at commit 7)
- `worker/agents/operations/AgenticProjectBuilder.ts` (commit 7)
- `worker/agents/operations/prompts/agenticBuilderPrompts.ts` (commit 7)
- `worker/agents/tools/customTools.ts` (rebase at commit 6)
- `worker/agents/tools/types.ts` (rebase at commit 6)
- `worker/agents/tools/toolkit/{alter-blueprint,completion-signals,exec-commands,generate-blueprint,generate-files,generate-images,get-runtime-errors,git,init-suitable-template,regenerate-file,run-analysis,virtual-filesystem,wait}.ts` (commit 6)
- `worker/agents/utils/{idGenerator,conversationCompactifier,templateCustomizer}.ts` (commit 7)
- `worker/agents/domain/values/GenerationContext.ts` (extend in commit 7)
- `worker/observability/sentry.ts` (modify in commit 9)
- `package.json` (Sentry bump in commit 9)
- `wrangler.jsonc:9` (compat-date bump in commit 9)
- Optional commit 10: `worker/agents/operations/DeepDebugger.ts`, `worker/agents/operations/prompts/deepDebuggerPrompts.ts`, `worker/agents/tools/toolkit/{deep-debugger,wait-for-debug}.ts`

Everything from v1 §"Key file paths referenced" remains.
