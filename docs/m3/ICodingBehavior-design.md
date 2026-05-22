# `ICodingBehavior` interface — design proposal for M3 slice item 15

**Status:** design-only, awaiting OG review per Q-2 approval (2026-05-22)
**Audience:** the M3 lead session that ports `worker/agents/core/codingAgent.ts` (item 15)
**Authors:** session `ba1229fc` (M3 lead, this session) — reviewer: session `9979fc1b` (consult)

## Why this interface exists

Upstream's `worker/agents/core/codingAgent.ts` directly constructs concrete behavior classes (`PhasicCodingBehavior`, `AgenticCodingBehavior`) and calls 15 methods on `this.behavior`. The fork's behaviors (items 10–12) are not yet ported. To unblock the codingAgent port (item 15) without forward-referencing unported behaviors, we add an `ICodingBehavior` interface to `worker/agents/core/AgentCore.ts` — same pattern as the existing `DeploymentManager`, `GitVersionControl`, and `AgentInfrastructure` service interfaces in that file. `codingAgent.ts` types its `behavior` field as `ICodingBehavior<TState>`; when behaviors land, they implement the interface.

This is the standard dependency-inversion pattern. The fork already uses it for the other services.

## Proposed interface (TypeScript)

To be added to `worker/agents/core/AgentCore.ts`, after the existing `DeploymentManager` / `GitVersionControl` interfaces (around line 84, before the `AgentInfrastructure` declaration).

```typescript
import type { AgentInitArgs, AgentSummary } from './types';
import type { ImageAttachment } from '../../types/image-attachment';
import type { AgentActionKey, ModelConfig } from '../inferutils/config.types';
import type { PreviewType, TemplateDetails, TemplateFile } from '../../services/sandbox/sandboxTypes';
import type { FileOutputType } from '../schemas';
import type { DeploymentTarget } from './types';

/**
 * Behavior surface that `CodeGeneratorAgent` (codingAgent.ts) calls into.
 *
 * Concrete implementations: `PhasicCodingBehavior` and `AgenticCodingBehavior`
 * (items 10-12 in M3_COMMIT2_DEPMAP.md §8). Behaviors extend
 * `AgentComponent<TState>` and own all generation-orchestration logic so the
 * DO class stays thin (lifecycle wiring + websocket / persistence only).
 *
 * The 15 methods below are everything codingAgent.ts touches on
 * `this.behavior`. Signatures match upstream `behaviors/base.ts` verbatim;
 * a few methods document tightening notes inline where the fork's
 * narrower types make the upstream-generic shape unnecessary.
 */
export interface ICodingBehavior<TState extends BaseProjectState = BaseProjectState> {
    // ===== Lifecycle =====

    /**
     * Called from `CodeGeneratorAgent.initialize()`. Behavior owns blueprint
     * synthesis, project-name slug, all initial state population.
     * `initArgs` carries `inferenceContext`, `templateInfo`, `query`, and
     * the `sandboxSessionId` the agent generated.
     */
    initialize(initArgs: AgentInitArgs, ...rest: unknown[]): Promise<TState>;

    /**
     * Called from `CodeGeneratorAgent.onStart()` after each (re)attach.
     * Behavior re-reads any per-process caches that don't survive DO restarts
     * (e.g. the template-details cache). `props` is the same opaque bag
     * passed through from the agents-sdk `onStart`.
     */
    onStart(props?: Record<string, unknown> | undefined): Promise<void>;

    /**
     * Called from `CodeGeneratorAgent.onStart()` before any state access.
     * Phasic behavior performs phasic-specific state shape migrations;
     * default implementation in base is a no-op. Synchronous — must run
     * before `ensureTemplateDetails()` or any other state-dependent call.
     */
    migrateStateIfNeeded(): void;

    /**
     * Called from `CodeGeneratorAgent.onStart()` and again in the conversation
     * processor path. Lazily fetches template details from the sandbox
     * service if not cached. Idempotent.
     */
    ensureTemplateDetails(): Promise<void>;

    /**
     * Called from `CodeGeneratorAgent.onStart()` after user-config loading.
     * Stashes per-user model config overrides on the behavior so subsequent
     * generation calls pick them up. `undefined` clears the override.
     */
    setUserModelConfigs(configs: Record<AgentActionKey, ModelConfig> | undefined): void;

    // ===== Accessors =====

    /**
     * Called from `CodeGeneratorAgent.onConnect()` to send the initial
     * `AGENT_CONNECTED` payload. Throws if details aren't loaded —
     * callers MUST call `ensureTemplateDetails()` first (codingAgent does
     * this implicitly through onStart). Synthesizes a scratch template
     * on demand when `state.templateName === 'scratch'`.
     */
    getTemplateDetails(): TemplateDetails;

    /**
     * Called from `CodeGeneratorAgent.onConnect()` when the template's
     * `renderMode === 'browser'`. Returns the URL the frontend should
     * iframe instead of the sandbox preview. Empty string if not a
     * browser-render template.
     */
    getBrowserPreviewURL(): string;

    /**
     * Called from `CodeGeneratorAgent.getFullState()`. Hot path —
     * `behavior.state` is the source of truth, this just returns it.
     */
    getFullState(): Promise<TState>;

    /**
     * Called from `CodeGeneratorAgent.getSummary()`. Returns the
     * `{query, generatedCode}` summary used by app-list endpoints.
     */
    getSummary(): Promise<AgentSummary>;

    /**
     * Called from `CodeGeneratorAgent.handleUserInput()`. True when a
     * `generateAllFiles()` promise is in-flight; gates redundant kickoffs.
     */
    isCodeGenerating(): boolean;

    // ===== Action methods (delegated from CodeGeneratorAgent public API) =====

    /**
     * Called from `CodeGeneratorAgent.deployToSandbox(...)` (public API
     * relayed verbatim). 4 positional args match upstream's signature.
     * Default-empty `files` means "redeploy current state."
     */
    deployToSandbox(
        files?: FileOutputType[],
        redeploy?: boolean,
        commitMessage?: string,
        clearLogs?: boolean,
    ): Promise<PreviewType | null>;

    /**
     * Called from `CodeGeneratorAgent.deployToCloudflare(target?)`.
     * Returns the legacy `{deploymentUrl, workersUrl}` shape — note this
     * is the BEHAVIOR's wider shape, distinct from `DeploymentManager`'s
     * narrower `{deployedUrl, error}` shape. The behavior is the bridge
     * that maps `DeploymentManager` results into broadcast payloads + the
     * pre-2b shape simpleGen returns today.
     */
    deployToCloudflare(target?: DeploymentTarget): Promise<{
        deploymentUrl?: string;
        workersUrl?: string;
    } | null>;

    /**
     * Called from `CodeGeneratorAgent.importTemplate(name)`. Loads the
     * template's files into the behavior's state + returns the file
     * manifest. Upstream returns `{templateName, filesImported, files}`;
     * the fork should mirror exactly so the frontend handler doesn't
     * change.
     */
    importTemplate(templateName: string): Promise<{
        templateName: string;
        filesImported: number;
        files: TemplateFile[];
    }>;

    /**
     * Called from `CodeGeneratorAgent.handleUserInput(message, images?)`.
     * Behavior owns the input handling + decides whether to kick off
     * generation. The agent calls `isCodeGenerating()` afterward to
     * decide whether to fire `generateAllFiles()`.
     */
    handleUserInput(userMessage: string, images?: ImageAttachment[]): Promise<void>;

    /**
     * Called from `CodeGeneratorAgent.handleUserInput()` when idle. Long-
     * running; returns when generation completes or errors. Callers
     * shouldn't `await` from a request-response handler — they fire-and-
     * forget with `.catch(...)`.
     */
    generateAllFiles(): Promise<void>;
}
```

## The 15 call sites — upstream → fork mapping

| # | Upstream call (codingAgent.ts) | Fork equivalent in simpleGeneratorAgent.ts | Notes |
|---|---|---|---|
| 1 | L140 `this.behavior.initialize({...initArgs, sandboxSessionId})` | L276 `async initialize(...)` | Fork has it; signature compatible. Behavior absorbs the wrapping. |
| 2 | L181 `this.behavior.onStart(props)` | No named method; fork's `setState`-after-construction equivalent | New method on behavior contract. Default impl can be no-op (matches upstream base). |
| 3 | L190 `this.behavior.migrateStateIfNeeded()` | L1214 `private migrateStateIfNeeded()` | Fork has it (private); behavior version is public per interface. Default no-op. |
| 4 | L203, L643 `this.behavior.ensureTemplateDetails()` | Inline in fork's `initialize()` (no separate method) | New method on contract; behavior owns the template-details cache. |
| 5 | L209 `this.behavior.setUserModelConfigs(record)` | Not in fork | New on contract; behaviors track user model-config overrides. |
| 6 | L237, L245, L645 `this.behavior.getTemplateDetails()` | Inline `this.state.templateDetails` reads | New method on contract; centralizes the scratch-synthesis fallback. |
| 7 | L238 `this.behavior.getBrowserPreviewURL()` | Not in fork | New on contract; needed for browser-render templates' onConnect path. |
| 8 | L337 `this.behavior.getFullState()` | L1204 `getFullState()` | Fork has it. |
| 9 | L341 `this.behavior.getSummary()` | L1193 `getSummary()` | Fork has it. |
| 10 | L354 `this.behavior.deployToSandbox(files, redeploy, commitMessage, clearLogs)` | L1670 `deployToSandbox(files, redeploy, commitMessage)` | **3 args in fork vs 4 in upstream.** The behavior signature MUST be 4-arg to satisfy upstream's call. The 4th arg (`clearLogs`) was added in the smart-agent rewrite; behaviors implement it; simpleGen ignores it. |
| 11 | L358 `this.behavior.deployToCloudflare(target)` | L1918 `deployToCloudflare()` | **0 args in fork vs 1 in upstream.** Behavior signature MUST accept the `target?` parameter to satisfy upstream's call. simpleGen's parameterless impl is a degenerate case (target always 'platform'). |
| 12 | L370 `this.behavior.importTemplate(name)` | Not as a behavior method; fork loads templates inline during initialize | New on contract; behaviors own template-import lifecycle for the post-init reimport flow. |
| 13 | L542 `this.behavior.handleUserInput(msg, images?)` | L2446 `handleUserInput(msg, images?)` | Fork has it; signature compatible. |
| 14 | L543 `this.behavior.isCodeGenerating()` | L417 `isCodeGenerating()` | Fork has it. |
| 15 | L546 `this.behavior.generateAllFiles()` | L508 `generateAllFiles(reviewCycles = 5)` | **Fork takes optional param; upstream calls with none.** Interface omits `reviewCycles` to match upstream's call site; behaviors use default-5 when unspecified. |

## Design rationale

### Why these methods and not fewer

I considered collapsing related accessors (e.g., merging `getTemplateDetails()` + `getBrowserPreviewURL()` into a single `getRenderTarget()`), but that would diverge from upstream's behavior surface for no real win — codingAgent.ts calls them at different sites with different control flow. **Goal:** interface mirrors the call-sites that exist; behavior classes implement them; nothing more, nothing less. Future refactors can collapse if redundancy emerges in practice.

Three categories within the 15:
- **Lifecycle (5 methods)**: `initialize`, `onStart`, `migrateStateIfNeeded`, `ensureTemplateDetails`, `setUserModelConfigs` — called during agent init / connect, in a deterministic order.
- **Accessors (5 methods)**: `getTemplateDetails`, `getBrowserPreviewURL`, `getFullState`, `getSummary`, `isCodeGenerating` — read-only, called from public API surface.
- **Actions (5 methods)**: `deployToSandbox`, `deployToCloudflare`, `importTemplate`, `handleUserInput`, `generateAllFiles` — state-mutating, called from public API or in user-input flow.

### How this composes with existing infrastructure interfaces in AgentCore.ts

```
AgentInfrastructure<TState>             (already in AgentCore.ts)
  ├── fileManager: FileManager          (already)
  ├── deploymentManager: DeploymentManager  (interface in AgentCore, impl ported 2b.10)
  ├── git: GitVersionControl            (interface in AgentCore, stub ported in 2a)
  └── ...

ICodingBehavior<TState>                 (NEW — this proposal)
  ├── reads from / writes to: AgentInfrastructure's services
  ├── concretely: PhasicCodingBehavior (item 11) + AgenticCodingBehavior (item 12)
  ├── extends: AgentComponent<TState>   (already in AgentCore.ts)
  └── called by: CodeGeneratorAgent (item 15)
```

`CodeGeneratorAgent` implements `AgentInfrastructure<AgentState>` AND constructs an `ICodingBehavior<TState>` instance, passing itself as the infrastructure. Behaviors call into infrastructure to do real work; codingAgent calls into behaviors to orchestrate.

This is the same shape upstream uses; the only delta is that the fork's `behavior` field has an interface type rather than the abstract-class type.

### Why `TState extends BaseProjectState` generic

`getFullState()` returns `TState` and `initialize()` returns `TState`. Phasic and agentic behaviors have different state shapes (`PhasicState` vs `AgenticState`, both extending `BaseProjectState`). The generic preserves the concrete state type through the interface so callers don't have to cast.

The cascade: `CodeGeneratorAgent.getFullState()` returns `AgentState` (the discriminated union) — that means the field is `ICodingBehavior<AgentState>` at the agent level, but behaviors specialize to `ICodingBehavior<PhasicState>` / `ICodingBehavior<AgenticState>` internally. This matches upstream's pattern (their `behavior: BaseCodingBehavior<AgentState>` field with concrete subclasses specialized to narrower TStates).

## Risk flags spotted while reading upstream

### Risk 1: `getTemplateDetails()` throws if not loaded

Upstream `getTemplateDetails()` throws "Template details not loaded. Call ensureTemplateDetails() first." if the cache is empty AND the template is not 'scratch'. CodeGeneratorAgent.onConnect calls it inside a try/catch that catches and logs, then sends the AGENT_CONNECTED message anyway with `templateDetails: <whatever-the-throw-left>`. **This is fragile.** If onConnect fires before onStart completed `ensureTemplateDetails`, the frontend gets a partial AGENT_CONNECTED. Behaviors should either pre-load on construction or have `getTemplateDetails()` return `null` and consumers handle absence. Worth a design call before behaviors land.

### Risk 2: `deployToCloudflare` return-shape divergence

Behavior returns `{deploymentUrl, workersUrl} | null`. DeploymentManager (item 9, slice 2b.10) returns `{deployedUrl, error}`. They're different on purpose — the behavior wraps DeploymentManager's narrower call and adds broadcast plumbing — but **the broadcast payload `cloudflare_deployment_completed` requires `deploymentUrl: string` (mandatory) and optional `workersUrl`**. Behavior must map DeploymentManager's `deployedUrl` → broadcast's `deploymentUrl`. The names are confusingly similar. Document the mapping clearly in the behavior implementation.

### Risk 3: `generateAllFiles()` fire-and-forget pattern

Upstream codingAgent calls `this.behavior.generateAllFiles().catch(error => {...})` — fire-and-forget with error logging. **This means an unhandled rejection inside `generateAllFiles` only surfaces via the logger.** Behaviors must NEVER throw synchronously from this method (returns must be a real Promise) and must catch their own internal errors aggressively. Fork's L508 already follows this discipline; document it as part of the interface contract.

### Risk 4: `migrateStateIfNeeded()` ordering constraint

Upstream calls `migrateStateIfNeeded()` synchronously before any awaits in onStart. If behaviors make it async, the ordering with `ensureTemplateDetails()` breaks — `ensureTemplateDetails` reads from a state that may not yet be migrated. **Keep it sync.** Interface signature is `void` (not `Promise<void>`) to enforce this.

### Risk 5: 4 method signatures DIVERGE from fork's simpleGen — see table

Three "fork takes fewer args than upstream" cases (`deployToSandbox` 3v4, `deployToCloudflare` 0v1) and one "fork takes more args than upstream" (`generateAllFiles` 1v0). The interface MUST match upstream's call-site arity in codingAgent.ts. Fork's `simpleGen` is the OLD implementation; the new behaviors will need wider/narrower signatures than what's there. No-regression check: `simpleGen` doesn't implement ICodingBehavior; it stays as-is until commit 4 removes it.

## What the next session does with this doc

1. Read OG's review on this doc.
2. If approved as-is: add the interface to `AgentCore.ts`, port `codingAgent.ts` against it, single commit (`feat(m3): slice 2b.13 — codingAgent + ICodingBehavior interface (item 15)`).
3. If OG flags revisions: incorporate, re-submit, await re-approval.
4. After interface + codingAgent land, behaviors (items 10-12) implement `ICodingBehavior<PhasicState>` and `ICodingBehavior<AgenticState>` in subsequent slices.

## Open questions for OG

1. **Risk 1 (getTemplateDetails throws)**: keep upstream behavior or relax to nullable return?
2. **`...rest: unknown[]` on `initialize`**: upstream uses it for ...args from agents-sdk subclass override. Keep for compat, or simplify since the fork's call site never passes extra?
3. **Should `ICodingBehavior` extend a base interface** (e.g., `IAgentComponent`) to share the implicit-infrastructure constructor contract? Or keep it standalone since AgentComponent is a concrete abstract class?
