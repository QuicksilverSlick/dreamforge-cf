# M3 Commit 2 — Dependency Map

Tactical, line-level enumeration of every adaptation needed before commit 2b
(`codingAgent.ts` + `behaviors/*` + `objectives/base.ts` port) can land.
All upstream citations reference files in `/tmp/upstream-m3/`. All local
citations are repo-relative.

Scope is (a): agentic-included. Behaviors `phasic.ts`, `agentic.ts`, and
`base.ts` all land in commit 2b. Smart-vs-simple agent collapse stays.

---

## Section 1 — Per-file import audit

Disposition codes: **OK** = OK as-is; **PR** = path-rewrite; **SM** = shape
mismatch; **SA** = absent but commit-2a stub covers it; **NS** = absent, new
stub needed; **P** = absent, port required.

### 1.1 `/tmp/upstream-m3/codingAgent.ts`

| L# | Import | Fork equivalent | Disp |
|----|--------|-----------------|------|
| 1  | `Agent, AgentContext, ConnectionContext` from `agents` | npm pkg | OK |
| 2  | `./types` (AgentInitArgs, AgentSummary, DeployOptions, DeployResult, ExportOptions, ExportResult, DeploymentTarget, BehaviorType) | `worker/agents/core/types.ts` | OK (all symbols present, L9–L200) |
| 3  | `./state` (AgenticState, AgentState, BaseProjectState, CurrentDevState, MAX_PHASES, PhasicState) | `worker/agents/core/state.ts` | OK (all present, L64–L227) |
| 4  | `../schemas` Blueprint | `worker/agents/schemas.ts` L147 | OK |
| 5  | `./behaviors/base` BaseCodingBehavior | does not exist yet | P (this commit ports it) |
| 6  | `../../logger` createObjectLogger, StructuredLogger | `worker/logger.ts` | OK |
| 7  | `../inferutils/config.types` InferenceMetadata | `worker/agents/inferutils/config.types.ts` L77 | OK |
| 8  | `hono/utils/mime` | npm pkg | OK |
| 9  | `../../utils/pathUtils` normalizePath, isPathSafe | `worker/utils/pathUtils.ts` | OK (verify both symbols) |
| 10 | `../services/implementations/FileManager` FileManager | `worker/agents/services/implementations/FileManager.ts` | OK |
| 11 | `../services/implementations/DeploymentManager` | **DOES NOT EXIST** in fork | **NS** — need new `worker/agents/services/implementations/DeploymentManager.ts` adapter over fork's `sandboxSdkClient` |
| 12 | `../git` GitVersionControl | upstream Git-DO module | **SA** — `worker/services/git/GitVersionControlStub.ts` covers (but interface lives at `worker/agents/core/AgentCore.ts`, not `../git`) — needs **PR** (import path rewrite to `../../services/git/GitVersionControlStub` or AgentCore type) + **SM** (see Section 3) |
| 12 | `./behaviors/phasic` PhasicCodingBehavior | does not exist | P |
| 13 | `./behaviors/agentic` AgenticCodingBehavior | does not exist | P |
| 14 | `../git` SqlExecutor | upstream Git DO type | **NS** — declare a `SqlExecutor` type alias in `AgentCore.ts` (it's just the Cloudflare DO `SqlStorage` shape) |
| 15 | `./AgentCore` AgentInfrastructure | `worker/agents/core/AgentCore.ts` L98 | OK |
| 16 | `./types` ProjectType | OK |
| 17 | `agents` Connection | OK |
| 18 | `./websocket` handleWebSocketMessage, handleWebSocketClose, broadcastToConnections, sendToConnection | `worker/agents/core/websocket.ts` | verify all 4 — currently exports `handleWebSocketMessage`, `handleWebSocketClose`; **SM** if `broadcastToConnections`/`sendToConnection` missing |
| 19 | `worker/api/websocketTypes` WebSocketMessageData, WebSocketMessageType | `worker/api/websocketTypes.ts` | OK |
| 20 | `worker/services/sandbox/sandboxTypes` PreviewType, TemplateDetails | OK |
| 21 | `../constants` WebSocketMessageResponses | `worker/agents/constants.ts` | OK with caveats (see §5) |
| 22 | `worker/database` AppService, ModelConfigService | OK |
| 23 | `../inferutils/common` ConversationMessage, ConversationState | OK |
| 24 | `worker/types/image-attachment` ImageAttachment | OK |
| 25 | `shared/types/errors` RateLimitExceededError | exists in shared/ types | OK (verify) |
| 26 | `./objectives/base` ProjectObjective | does not exist | P |
| 27 | `../schemas` FileOutputType | OK |
| 28 | `../../services/secrets/SecretsClient` SecretsClient, UserSecretsStoreStub | `worker/services/secrets/SecretsClient.ts` | **SM** — shim shape differs from upstream (see §4) |
| 29 | `./stateMigration` StateMigration | `worker/agents/core/stateMigration.ts` | exists as fn / namespace — verify export shape |
| 30 | `../../types/auth-types` PendingWsTicket, TicketConsumptionResult | `worker/types/auth-types.ts` | check presence |
| 31 | `../../utils/wsTicketManager` WsTicketManager | `worker/utils/wsTicketManager.ts` | check presence |
| 32 | `../../utils/oauthCookie` readTokenCookie | `worker/utils/oauthCookie.ts` | OK |

### 1.2 `/tmp/upstream-m3/behaviors/base.ts` (top 45 imports)

| L# | Import | Fork | Disp |
|----|--------|------|------|
| 1  | `agents` Connection | OK |
| 2–8 | `../../schemas` FileConceptType, FileOutputType, Blueprint, AgenticBlueprint, PhasicBlueprint | `worker/agents/schemas.ts` L160–167 | OK |
| 9  | `../../../services/sandbox/sandboxTypes` ExecuteCommandsResponse, PreviewType, RuntimeError, StaticAnalysisResponse, TemplateDetails, TemplateFile | OK (all present) |
| 10 | `../state` BaseProjectState, AgenticState, FileState | OK |
| 11 | `../types` AllIssues, AgentSummary, AgentInitArgs, BehaviorType, DeploymentTarget, ProjectType | OK |
| 12 | `../../constants` WebSocketMessageResponses | OK with **gaps** (§5) |
| 13 | `../../assistants/projectsetup` ProjectSetupAssistant | `worker/agents/assistants/projectsetup.ts` | OK (verify default export) |
| 14 | `../../operations/UserConversationProcessor` UserConversationProcessor, RenderToolCall | fork: only `UserConversationProcessor` exported (L37 declares but does not export `RenderToolCall`) | **SM** — need to add `export` to `RenderToolCall` and `buildToolCallRenderer` in `worker/agents/operations/UserConversationProcessor.ts:37,46` |
| 15 | `../../operations/FileRegeneration` FileRegenerationOperation | `worker/agents/operations/FileRegeneration.ts` | OK |
| 16 | `../../../services/sandbox/BaseSandboxService` BaseSandboxService | OK |
| 17 | `../../../services/sandbox/utils` getTemplateImportantFiles | **does not exist** | **NS** — add `worker/services/sandbox/utils.ts` exporting `getTemplateImportantFiles` (small; copy from upstream) |
| 18 | `../../utils/templates` createScratchTemplateDetails | **does not exist** | **NS** — add `worker/agents/utils/templates.ts` |
| 19 | `../../../api/websocketTypes` WebSocketMessageData, WebSocketMessageType | OK |
| 20 | `../../inferutils/config.types` AgentActionKey, InferenceContext, InferenceRuntimeOverrides, ModelConfig | `worker/agents/inferutils/config.types.ts` exports AgentActionKey L75, InferenceContext L83, ModelConfig L48 — **`InferenceRuntimeOverrides` missing** | **NS** — add type alias to `config.types.ts` |
| 21 | `../../../database/services/ModelConfigService` | OK |
| 22 | `../../../services/code-fixer` fixProjectIssues | `worker/services/code-fixer/index.ts:41` | OK |
| 23 | `../../operations/PostPhaseCodeFixer` FastCodeFixerOperation | fork has it at `worker/agents/operations/FastCodeFixer.ts:74` | **PR** — path rewrite to `'../../operations/FastCodeFixer'` |
| 24 | `../../utils/common` looksLikeCommand, validateAndCleanBootstrapCommands | fork has `looksLikeCommand` at `worker/agents/utils/common.ts:99`; **`validateAndCleanBootstrapCommands` missing** | **NS** — port the function from upstream into `worker/agents/utils/common.ts` |
| 25 | `../../utils/templateCustomizer` customizeTemplateFiles, generateBootstrapScript | **module does not exist** | **NS** — port small `worker/agents/utils/templateCustomizer.ts` from upstream |
| 26 | `../../../database` AppService | OK |
| 27 | `shared/types/errors` RateLimitExceededError | OK (verify) |
| 28 | `../../../types/image-attachment` ImageAttachment, ProcessedImageAttachment | OK |
| 29 | `../../operations/common` OperationOptions | `worker/agents/operations/common.ts` | OK (verify symbol) |
| 30 | `worker/utils/images` ImageType, uploadImage, detectBlankScreenshot | `worker/utils/images.ts` L93,L148,L47 | OK |
| 31 | `worker/utils/screenshot-security` ScreenshotSecurity | `worker/utils/screenshot-security.ts` | OK (verify class export) |
| 32 | `../types` DeepDebugResult | `worker/agents/core/types.ts` L162 | OK |
| 33 | `../../utils/packageSyncer` updatePackageJson | **does not exist** | **NS** — port `worker/agents/utils/packageSyncer.ts` (tiny) |
| 34 | `../../services/interfaces/ICodingAgent` ICodingAgent | `worker/agents/services/interfaces/ICodingAgent.ts` | OK |
| 35 | `../../operations/SimpleCodeGeneration` SimpleCodeGenerationOperation | **does not exist** | **NS or P** — port `SimpleCodeGenerationOperation` (small operation file) |
| 36 | `../AgentComponent` AgentComponent | `worker/agents/core/AgentComponent.ts` | OK |
| 37 | `../AgentCore` AgentInfrastructure | OK |
| 38 | `../../git` GitVersionControl | as in §1.1 | **PR + SM** |
| 39 | `../../operations/DeepDebugger` DeepDebuggerOperation + `DeepDebuggerInputs` | **does not exist** | **NS** — port `worker/agents/operations/DeepDebugger.ts` (M4-flavored but used by base.ts) |
| 40 | `worker/utils/cryptoUtils` generatePortToken | `worker/utils/cryptoUtils.ts:39` | OK |
| 41 | `worker/utils/urls` getPreviewDomain, getProtocolForHost | `worker/utils/urls.ts` L1,L8 | OK |
| 42 | `worker/utils/envs` isDev | `worker/utils/envs.ts:5` | OK |
| 43 | `../../../services/static-analysis` InMemoryAnalyzer | **module does not exist** (fork has `worker/services/analysis/CodeAnalysisService.ts`) | **NS or P** — either port InMemoryAnalyzer or rewrite the `if (templateDetails?.renderMode === 'browser')` branch to use the fork's analyzer; **leans P** because base.ts L632 is one of three callsites |

### 1.3 `/tmp/upstream-m3/behaviors/phasic.ts`

| L# | Import | Fork | Disp |
|----|--------|------|------|
| 1–5 | `../../schemas` PhaseConceptGenerationSchemaType, PhaseConceptType, FileOutputType, PhaseImplementationSchemaType | OK (L164,L167,L168) |
| 6  | sandbox StaticAnalysisResponse | OK |
| 7  | `../state` CurrentDevState, MAX_PHASES, PhasicState | OK |
| 8  | `../types` AllIssues, AgentInitArgs, PhaseExecutionResult, UserContext | `worker/agents/core/types.ts` L119,L145,L150 — OK |
| 9  | `../../constants` | gap (§5) |
| 10 | UserConversationProcessor | OK |
| 11 | `../../domain/values/GenerationContext` GenerationContext, PhasicGenerationContext | `worker/agents/domain/values/GenerationContext.ts` — verify both classes exported |
| 12 | `../../domain/values/IssueReport` | `worker/agents/domain/values/IssueReport.ts` | OK |
| 13 | `../../operations/PhaseImplementation` PhaseImplementationOperation | `worker/agents/operations/PhaseImplementation.ts` | OK (verify export name) |
| 14 | FileRegeneration | OK |
| 15 | `../../operations/PhaseGeneration` PhaseGenerationOperation | `worker/agents/operations/PhaseGeneration.ts` | OK (verify name) |
| 16 | PostPhaseCodeFixer → FastCodeFixer | **PR** |
| 17 | `../../utils/templateCustomizer` customizePackageJson, customizeTemplateFiles, generateProjectName | **module missing** — same NS as 1.2.25 (plus `customizePackageJson`, `generateProjectName`) |
| 18 | `../../planning/blueprint` generateBlueprint | `worker/agents/planning/blueprint.ts` | OK (verify symbol) |
| 19 | RateLimitExceededError | OK |
| 20 | ProcessedImageAttachment / ImageAttachment | OK |
| 21 | `OperationOptions` | OK |
| 22 | ConversationMessage | OK |
| 23 | `worker/utils/idGenerator` generateNanoId | `worker/utils/idGenerator.ts` | verify export |
| 24 | `../../utils/idGenerator` IdGenerator | `worker/agents/utils/idGenerator.ts` | verify symbol |
| 25 | `./base` BaseCodingBehavior, BaseCodingOperations | porting in 2b — OK |
| 26 | ICodingAgent | OK |
| 27 | SimpleCodeGeneration | **NS** (same as base) |
| 28 | `../stateMigration` StateMigration | check it's exported as a namespace/class (fork has `stateMigration.ts` exporting a function) |
| 29 | `../../utils/preDeploySafetyGate` runPreDeploySafetyGate | **does not exist** | **NS** — port |

### 1.4 `/tmp/upstream-m3/behaviors/agentic.ts`

| L# | Import | Fork | Disp |
|----|--------|------|------|
| 2  | `../types` AgentInitArgs | OK |
| 3  | `../state` AgenticState | OK |
| 4  | constants | gap §5 |
| 5  | UserConversationProcessor | OK |
| 6  | `../../domain/values/GenerationContext` GenerationContext, AgenticGenerationContext | **verify** both exported; AgenticGenerationContext likely missing |
| 7  | PhaseImplementation | OK |
| 8  | FileRegeneration | OK |
| 9  | `../../operations/AgenticProjectBuilder` AgenticProjectBuilderOperation, AgenticProjectBuilderInputs | **does not exist** | **P** — port (M4-flavored; the agentic loop's core operation) |
| 10 | `buildToolCallRenderer` from UserConversationProcessor | **SM** — currently not exported (fork L46) |
| 11 | PhaseGeneration | OK |
| 12 | PostPhaseCodeFixer | **PR** |
| 13 | `templateCustomizer` customizeTemplateFiles, generateProjectName | **NS** |
| 14 | idGenerator IdGenerator | verify |
| 15 | `../../../utils/idGenerator` generateNanoId | OK |
| 16 | `./base` BaseCodingBehavior | porting | OK |
| 17 | ICodingAgent | OK |
| 18 | SimpleCodeGeneration | **NS** |
| 19 | `worker/agents/operations/common` OperationOptions | OK |
| 20 | `../../utils/conversationCompactifier` compactifyContext | **does not exist as standalone module** — currently a method on `UserConversationProcessor` (L584) | **NS** — extract a standalone `compactifyContext` (or rewrite the agentic.ts call to use the processor method) |
| 21 | inferutils/common — ConversationMessage, createMultiModalUserMessage, createUserMessage, Message | `worker/agents/inferutils/common.ts` L23,L30,L46,L76 | OK |
| 22 | `worker/agents/inferutils/core` AbortError | **verify** — grep returned no hits; likely **NS** |
| 23 | ImageAttachment / ProcessedImageAttachment | OK |
| 24 | `worker/utils/images` ImageType, uploadImage | OK |

### 1.5 `/tmp/upstream-m3/objectives/base.ts`

| L# | Import | Fork | Disp |
|----|--------|------|------|
| 1  | `../state` BaseProjectState | OK |
| 2–7 | `../types` ProjectType, ExportResult, ExportOptions, DeployResult, DeployOptions | OK |
| 8  | `../AgentComponent` | OK |
| 9  | `../AgentCore` AgentInfrastructure | OK |
| 10 | constants | gap §5 |
| 11 | `../../../database/services/AppService` | OK |
| 12 | `../../../services/github` GitHubService | fork has `worker/services/github/index.ts` re-exporting `GitHubService` | **SM** — fork's `GitHubService.exportToGitHub` does **not exist** (see §7). Static methods differ: fork has `createUserRepository`, `pushFilesToRepository`; upstream has `exportToGitHub`, `getRepository`, `repositoryExists`, `checkRemoteStatus`. |
| 13–17 | `./strategies` getAdditionalExportStrategy, AdditionalExportStrategy, ExportContext | does not exist | **P** (trivial — three small files already in scope: `/tmp/upstream-m3/objectives/strategies/{index,presentation,types}.ts`) |

---

## Section 2 — DeploymentManager call surface audit

Fork interface (`worker/agents/core/AgentCore.ts:47–62`):

```ts
deployToSandbox(options?: {files?, redeploy?, commitMessage?, clearLogs?}): Promise<{deploymentId?, previewURL?, tunnelURL?}>
deployToCloudflare(options?: {target?, token?, metadata?}): Promise<{deployedUrl?, error?}>
```

Upstream callsites:

| File | Line | Call | Arg shape | Return-prop access |
|------|------|------|-----------|--------------------|
| behaviors/base.ts | 273 | `getSessionId()` | () | scalar string |
| behaviors/base.ts | 277 | `getClient()` | () | `BaseSandboxService` instance |
| behaviors/base.ts | 593 | `waitForPreview()` | () | void |
| behaviors/base.ts | 597 | `fetchRuntimeErrors(clear)` | (boolean) | `RuntimeError[]` |
| behaviors/base.ts | 635 | `runStaticAnalysis(files?)` | (`string[]` or undefined) | `StaticAnalysisResponse` |
| behaviors/base.ts | 1027 | `deployToSandbox([regenerated])` | **positional file array** | (return ignored) |
| behaviors/base.ts | 1189 | `deployToSandbox(files, redeploy, commitMessage, clearLogs, {onStarted, onCompleted, onError, onAfterSetupCommands})` | **5 positional args**, last is callback bag | `PreviewType`-ish |
| behaviors/base.ts | 1236 | `deployToCloudflare({target, callbacks: {onStarted, onCompleted, onError}})` | options bag with callbacks | `{deploymentUrl?, workersUrl?}` |
| objectives/base.ts | 62 | `deployToSandbox()` | () | (presence-check via state.sandboxInstanceId) |
| objectives/base.ts | 77 | `deployToCloudflare({target, callbacks})` | options bag with callbacks | `{deploymentUrl, workersUrl, deploymentId?}` |

**Gaps vs fork interface:**

1. **Missing methods**: `getSessionId`, `getClient`, `waitForPreview`, `fetchRuntimeErrors`, `runStaticAnalysis` — none exist on the fork interface.
2. **`deployToSandbox` signature**: upstream is positional `(files, redeploy, commitMessage, clearLogs, callbacks)`. Fork is options-bag without callbacks.
3. **`deployToCloudflare` signature**: upstream is `{target, callbacks}`. Fork is `{target, token, metadata}` without callbacks. Return shape upstream uses `{deploymentUrl, workersUrl}`, fork has `{deployedUrl, error}`.

**Recommendation: widen the interface to match upstream.** Reasoning:
- The callback-pattern is structural to how `base.ts` orchestrates broadcasts (10+ callsites pass them). Rewriting them as we port would change the orchestration shape rather than just the import — that's the wrong layer for a port-time edit.
- The fork has nothing on the implementation side yet; we're building the adapter from scratch. The adapter can wrap `sandboxSdkClient.deployToCloudflareWorkers(instanceId)` and `runStaticAnalysisCode(instanceId)` and add a `waitForPreview` / `fetchRuntimeErrors` shim (the fork already implements both as methods on `simpleGeneratorAgent.ts:1397,1643`; lift them).

**Required commit-2b shape:**

```ts
export interface DeploymentManager {
    getSessionId(): string;
    getClient(): BaseSandboxService | null;
    waitForPreview(): Promise<void>;
    fetchRuntimeErrors(clear: boolean): Promise<RuntimeError[]>;
    runStaticAnalysis(files?: string[]): Promise<StaticAnalysisResponse>;
    deployToSandbox(
        files?: FileOutputType[],
        redeploy?: boolean,
        commitMessage?: string,
        clearLogs?: boolean,
        callbacks?: {
            onStarted?: (data: unknown) => void;
            onCompleted?: (data: unknown) => void;
            onError?: (data: unknown) => void;
            onAfterSetupCommands?: () => Promise<void>;
        },
    ): Promise<PreviewType | null>;
    deployToCloudflare(options: {
        target?: DeploymentTarget;
        callbacks?: { onStarted; onCompleted; onError };
    }): Promise<{ deploymentUrl?: string; workersUrl?: string; deploymentId?: string } | null>;
}
```

---

## Section 3 — GitVersionControl call surface audit

Fork interface (`AgentCore.ts:71–83`) + stub (`worker/services/git/GitVersionControlStub.ts`):

```ts
available, init(), commit(message), push(), status()
```

Upstream callsites:

| File | Line | Call | Arg shape | Return |
|------|------|------|-----------|--------|
| codingAgent.ts | 605 | `this.git.init()` | () | (assumed `{ok}`) |
| codingAgent.ts | 608 | `this.git.getHead()` | () | **truthy when commits exist** — likely `string | null` |
| codingAgent.ts | 618 | `this.git.commit(generatedFiles, "Initial commit")` | **(files, message)** | (return ignored) |
| codingAgent.ts | 638 | `this.git.fs.exportGitObjects()` | () | `Array<{path, data: Uint8Array}>` |

**Gaps vs current stub:**

1. `getHead()` — missing entirely. Stub returns `null`/`undefined` to satisfy.
2. `commit` signature — upstream takes `(files, message)`; current stub takes `(message)`. Calling it with two args silently works at runtime (extra arg ignored) but **fails TypeScript compile**.
3. `git.fs.exportGitObjects()` — the stub has no `.fs` property at all. This is the **runtime-fail path**. Upstream `objectives/base.ts:156` also calls `this.infrastructure.exportGitObjects()` (delegated through `AgentCore`), so the delegation already exists at infrastructure level — but `codingAgent.ts:638` directly calls `this.git.fs.exportGitObjects()`, bypassing it.

**The `{ ok: false, reason }` shape doesn't model `getHead()` (truthy/falsy contract) or `fs.exportGitObjects()` (array contract).** Both will runtime-fail.

**Required stub additions:**
- `getHead(): Promise<string | null>` → returns `null` on stub.
- `commit(filesOrMessage: FileOutputType[] | string, message?: string)` → overload, no-op on stub.
- `readonly fs: { exportGitObjects(): Array<{path, data: Uint8Array}> }` → fs stub returning `[]`.

Alternative: rewrite `codingAgent.ts:638` to call `this.exportGitObjects()` (which goes through `AgentInfrastructure` — already returns `{gitObjects, query, hasCommits, templateDetails}` shape) and drop the direct `.git.fs` access. This is the **cleaner port-time fix** because the infrastructure-level method already exists and is the documented surface.

---

## Section 4 — SecretsClient call surface audit

Fork shim (`worker/services/secrets/SecretsClient.ts`):

```ts
new SecretsClient(_env: Env, _userId?: string)
available, get(key: string), set(key, value), delete(key), list()
```

Upstream callsites in `codingAgent.ts`:

| Line | Call |
|------|------|
| 285 | `this.secretsClient?.notifyUnlocked()` |
| 290 | `this.secretsClient?.notifyUnlockFailed('Vault locked')` |
| 295–310 | construct via `new SecretsClient(stub: UserSecretsStoreStub, callback: (type, data) => void)` |
| 315 | `this.getSecretsClient().get(query: { provider?, envVarName?, secretId? })` |

**Gaps vs current shim:**

1. **Constructor signature is wrong.** Upstream takes `(stub: UserSecretsStoreStub, callback)`. Fork shim takes `(env, userId?)`. Total mismatch.
2. **Missing methods**: `notifyUnlocked()`, `notifyUnlockFailed(reason)`.
3. **`get` signature is wrong.** Upstream's `get` takes a structured query object `{provider?, envVarName?, secretId?}`, returns secret or `null`. Fork shim's `get` takes a string key.

Since the fork tombstoned `UserSecretsStore` and there's no real vault, the right answer is to **either (a) widen the shim to match the upstream surface and have all methods no-op / return null, or (b) gut the secrets call sites in the ported `codingAgent.ts` and route through the fork's D1 `SecretsService`**. (a) is the smaller commit-2b delta; (b) is the conceptually-correct M4-shaped fix.

**Recommendation: (a) for commit 2b.** Rewrite the shim to:

```ts
type SecretQuery = { provider?: string; envVarName?: string; secretId?: string };
type VaultEventCallback = (type: 'vault_required', data: { reason: string; provider?: string; envVarName?: string; secretId?: string }) => void;

class SecretsClient {
    available = false;
    constructor(_stub?: unknown, _callback?: VaultEventCallback) {}
    notifyUnlocked(): void {}
    notifyUnlockFailed(_reason: string): void {}
    async get(_query: SecretQuery): Promise<string | null> { return null; }
}
```

The codingAgent code path that broadcasts `vault_required` (L302) will silently no-op, which is the correct behavior since there is no vault.

The `UserSecretsStore` DO binding reference at codingAgent.ts:298–299 (`this.env.UserSecretsStore.get(...)`) will fail TypeScript because that binding does not exist in `worker-configuration.d.ts`. **Port-time edit**: replace that block with `new SecretsClient(undefined, callback)`.

---

## Section 5 — Constants audit

Fork constants (`worker/agents/constants.ts`):

Present: GENERATION_STARTED/COMPLETE, PHASE_GENERATING/GENERATED/IMPLEMENTING/IMPLEMENTED/VALIDATING/VALIDATED, FILE_CHUNK_GENERATED, FILE_GENERATING/GENERATED/REGENERATING/REGENERATED, RUNTIME_ERROR_FOUND, STATIC_ANALYSIS_RESULTS, DEPLOYMENT_STARTED/COMPLETED/FAILED, CLOUDFLARE_DEPLOYMENT_STARTED/COMPLETED/ERROR, SCREENSHOT_CAPTURE_STARTED/SUCCESS/ERROR/ANALYSIS_RESULT, ERROR, RATE_LIMIT_ERROR, CODE_REVIEWING/REVIEWED, COMMAND_EXECUTING, GENERATION_STOPPED/RESUMED, DETERMINISTIC_CODE_FIX_STARTED/COMPLETED, GITHUB_EXPORT_STARTED/PROGRESS/COMPLETED/ERROR, USER_SUGGESTIONS_PROCESSING, CONVERSATION_RESPONSE/CLEARED/STATE, MODEL_CONFIGS_INFO, TERMINAL_OUTPUT, SERVER_LOG.

**Missing from fork** (referenced by ported files):

| Constant | Referenced at | Wire-protocol risk |
|----------|---------------|---------------------|
| `PREVIEW_FORCE_REFRESH` | base.ts:1161 | **frontend coordination** — clients listen for this to refresh iframe |
| `BLUEPRINT_UPDATED` | base.ts:390, 858 | **frontend coordination** — clients render blueprint diffs |
| `PROJECT_NAME_UPDATED` | base.ts:797 | **frontend coordination** — clients update title chip |
| `TEMPLATE_UPDATED` | base.ts:1308 | **frontend coordination** — clients react to template swap |
| `AGENT_CONNECTED` | codingAgent.ts:243 | **frontend coordination** — connection-handshake message |
| `USAGE_UPDATED` | base.ts:359 | **frontend coordination** — clients update token/cost meters |

**All six are wire-protocol gaps.** Adding them to `constants.ts` is half the story; the `WebSocketMessage` discriminated union in `worker/api/websocketTypes.ts:386` must also gain the corresponding `type: 'preview_force_refresh' | …` arms, and the client message handler at `src/routes/chat/utils/handle-websocket-message.ts` needs cases for each.

**For commit 2b**: safest path is to add the six constants and the `websocketTypes.ts` union entries (data payloads can be `Record<string, unknown>` initially) but **leave the client handler as a no-op default branch**. The agent will broadcast them, the frontend will quietly ignore — no regressions, and the wire is in place for a follow-up frontend commit.

No `WebSocketMessageRequests.*` references appear in the five upstream files (grep returns empty).

---

## Section 6 — Type surface audit

| Type | Upstream | Fork | Status |
|------|----------|------|--------|
| `PhasicState` | `./state` | `worker/agents/core/state.ts:163` | trivially-aliased — `CodeGenState = PhasicState` alias already exists |
| `AgenticState` | `./state` | L221 | OK |
| `BaseProjectState` | `./state` | L82 | OK |
| `FileState` | `./state` | L36 | OK — fork has `lasthash`, `lastmodified`, `unmerged`, `lastDiff`; upstream may differ in field set — needs port-time verification |
| `AllIssues` | `./types` | `core/types.ts:119` | **Fork extends with `clientErrors`** — port code that touches `AllIssues` must either include the field or use a partial accessor. Fork-favorable; do not strip. |
| `AgentInitArgs` | `./types` | L92 — discriminated union | OK (verify behaviors call with correct variant) |
| `DeepDebugResult` | upstream `../types` | fork `core/types.ts:162` | OK |
| `DeploymentTarget` | `./types` | L166 | OK |
| `DeployResult` / `DeployOptions` | `./types` | L168,L177 | OK |
| `ExportResult` / `ExportOptions` | `./types` | L183,L194 | OK |
| `PhaseExecutionResult` | `./types` | L150 | OK |
| `UserContext` | `./types` | L145 | OK |
| `ProjectType` | `./types` | L37 | OK |
| `BehaviorType` | `./types` | L31 | OK |
| `Plan` | `./types` | L110 | OK |
| `RuntimeType` | `./types` | L45 | OK |
| `GenerationContext`, `PhasicGenerationContext`, `AgenticGenerationContext` | `../../domain/values/GenerationContext` | `worker/agents/domain/values/GenerationContext.ts` | **needs verify** — agentic variant likely needs adding |
| `IssueReport` | `../../domain/values/IssueReport` | exists | OK |
| `InferenceRuntimeOverrides` | `inferutils/config.types` | **absent** in fork | needs-stub |
| `Blueprint`, `PhasicBlueprint`, `AgenticBlueprint` | `../../schemas` | `worker/agents/schemas.ts` L147,L160,L161 (aliased to `Blueprint`) | OK |
| `PhaseConceptType`, `PhaseConceptGenerationSchemaType`, `PhaseImplementationSchemaType`, `FileConceptType`, `FileOutputType`, `TemplateSelection`, `ClientReportedErrorType` | `../../schemas` | all present L163–173 | OK |
| `ExecuteCommandsResponse`, `PreviewType`, `RuntimeError`, `StaticAnalysisResponse`, `TemplateDetails`, `TemplateFile`, `GitHubPushRequest` | sandboxTypes | all present | OK |
| `SqlExecutor` | upstream `../git` | absent | needs-stub (one-line `type SqlExecutor = SqlStorage`) |
| `UserSecretsStoreStub` | upstream secrets | fork shim has `type = unknown` | **trivially-aliased** (or unused once shim widens) |
| `MessageRole`, `Message`, `ConversationMessage`, `ConversationState`, `createUserMessage`, `createMultiModalUserMessage` | `inferutils/common` | all present | OK |
| `AbortError` | `worker/agents/inferutils/core` | **needs grep verify** | likely needs-port |
| `RenderToolCall`, `buildToolCallRenderer` | UserConversationProcessor | exist but **not exported** | needs export-widening (trivial) |
| `RateLimitExceededError` | `shared/types/errors` | verify present in fork | likely OK |
| `PendingWsTicket`, `TicketConsumptionResult` | `worker/types/auth-types` | verify | likely OK |

`ProjectName` types: I see no `ProjectName` interface referenced in the five files; the original concern likely applies to deeper M4 files not in scope.

**Blocking types**: 0 — none of these are show-stoppers. Five `needs-stub`-grade additions; the rest is OK or aliasable.

---

## Section 7 — GitHubService audit

**Upstream `worker/services/github/`** (from `gh api repos/cloudflare/vibesdk/contents/worker/services/github`):

| File | Size |
|------|------|
| `GitHubService.ts` | 20077 bytes (~500 LoC) |
| `index.ts` | 115 bytes |
| `types.ts` | 2410 bytes |

Upstream `GitHubService` static surface (from b64-decoded grep):
- `createOctokit(token)`
- `createUserRepository(...)` — also in fork
- `getRepository({...})` — **fork lacks**
- `repositoryExists({...})` — **fork lacks**
- `extractRepoInfo(url)` — fork has it as `private static`
- `exportToGitHub({gitObjects, templateDetails, appQuery, appCreatedAt, token, repositoryUrl, username, email})` — **fork lacks** — **this is what `objectives/base.ts:185` calls**
- `modifyReadmeForGitHub`, `normalizeCommitMessage`, `isSystemGeneratedCommit`, `findLastCommonCommit`, `pushViaGitProtocol`, `checkRemoteStatus` — **fork lacks**

**Fork `worker/services/github/`**:
- `GitHubService.ts` (466 LoC) — REST/Octokit-based with `createUserRepository`, `pushFilesToRepository`, internal commit-strategy helpers
- `index.ts`, `types.ts`

The fork's REST-based push (`pushFilesToRepository`) and the upstream's git-protocol push (`exportToGitHub` via `MemFS` + `pushViaGitProtocol`) are **structurally different**. Upstream consumes a `gitObjects: Array<{path, data: Uint8Array}>` bundle produced by the Git DO; the fork uploads via the GitHub REST contents API.

**The fork's stub `git: GitVersionControlStub` returns `gitObjects: []`** from `exportGitObjects()` (well — fork's `AgentInfrastructure.exportGitObjects()` would, since stub has no commits) — so even if we ported upstream's `exportToGitHub` verbatim, it would have nothing to push.

**Recommendation**: **adapt-not-port.** In the ported `objectives/base.ts:185`, rewrite the `GitHubService.exportToGitHub({…})` call to use the fork's existing `GitHubService.createUserRepository(...)` + `GitHubService.pushFilesToRepository(...)` two-step. The input shapes differ (`pushFilesToRepository` wants `FileOutputType[]`, not git objects), but the fork's `FileManager.getGeneratedFiles()` already returns that shape — bypass `infrastructure.exportGitObjects()` for this code path.

LoC delta: the GitHub export block (`exportToGitHub` method body) is ~110 lines in upstream. Rewriting to use fork APIs is ~80 lines of net delta. **Invasiveness: medium**, contained to one method.

Alternative: port upstream's `GitHubService.ts` verbatim and accept that two parallel GitHub services live in the fork. **Not recommended** — DRY violation flagged in CLAUDE.md, and the fork's REST path is already wired into multiple controllers.

---

## Section 8 — Final commit-2b shopping list (ordered)

**A. New files (stubs / small ports), smallest first:**

1. `worker/services/sandbox/utils.ts` — export `getTemplateImportantFiles(templateDetails)`. ~30 LoC. Port from upstream verbatim.
2. `worker/agents/utils/templates.ts` — export `createScratchTemplateDetails()`. ~40 LoC. Port verbatim.
3. `worker/agents/utils/packageSyncer.ts` — export `updatePackageJson(...)`. ~60 LoC. Port verbatim.
4. `worker/agents/utils/templateCustomizer.ts` — export `customizeTemplateFiles`, `customizePackageJson`, `generateBootstrapScript`, `generateProjectName`. ~150 LoC. Port verbatim (it's mostly string templating).
5. `worker/agents/utils/preDeploySafetyGate.ts` — export `runPreDeploySafetyGate`. ~80 LoC. Port verbatim.
6. `worker/agents/operations/SimpleCodeGeneration.ts` — export `SimpleCodeGenerationOperation`. ~200 LoC. Port; depends on `AgentOperation` (already in fork).
7. `worker/agents/operations/DeepDebugger.ts` — export `DeepDebuggerOperation`, `DeepDebuggerInputs`. ~300 LoC. M4-flavored but `base.ts:1010` instantiates it; can land as a thin wrapper that returns `{error: 'deep debug not available'}` if we want a smaller commit-2b — **stub option, ~30 LoC**.
8. `worker/agents/operations/AgenticProjectBuilder.ts` — export `AgenticProjectBuilderOperation`, `AgenticProjectBuilderInputs`. ~400 LoC. Required if scope (a) means real agentic.
9. `worker/agents/services/implementations/DeploymentManager.ts` — concrete `DeploymentManager` class wrapping `sandboxSdkClient`. ~250 LoC. Lift the methods already implemented in `worker/agents/core/simpleGeneratorAgent.ts:1397–1700` (`fetchRuntimeErrors`, `waitForPreview`, `deployToSandbox`, `deployToCloudflareWorkers`).
10. `worker/agents/behaviors/base.ts` — port from upstream (1936 LoC, mostly verbatim with path rewrites).
11. `worker/agents/behaviors/phasic.ts` — port (728 LoC).
12. `worker/agents/behaviors/agentic.ts` — port (393 LoC).
13. `worker/agents/objectives/base.ts` — port (284 LoC) with the GitHub adaptation from §7.
14. `worker/agents/objectives/strategies/{index,types,presentation}.ts` — port verbatim (51 LoC total).
15. `worker/agents/core/codingAgent.ts` — port (838 LoC) with secrets adaptation from §4 and git adaptation from §3. **This file replaces `smartGeneratorAgent.ts`'s export role**; `simpleGeneratorAgent.ts` survives commit 2b unmodified (decommissioned in commit 4).

**B. Interface widening (commit-2b first):**

- `worker/agents/core/AgentCore.ts`: widen `DeploymentManager` per §2. Add `SqlExecutor` type alias. Widen `GitVersionControl` to add `getHead()` and `readonly fs: {exportGitObjects()}` (or rewrite codingAgent.ts:638 — pick one).

**C. Existing files needing additions:**

- `worker/agents/constants.ts`: add 6 missing constants (§5). Lines 71–72 region.
- `worker/api/websocketTypes.ts`: add 6 new arms to `WebSocketMessage` union (line ~386 region). Each arm has `type: 'preview_force_refresh' | …` and a permissive data payload.
- `worker/agents/operations/UserConversationProcessor.ts`: `export` keywords on `RenderToolCall` (L37) and `buildToolCallRenderer` (L46). Also export `compactifyContext` as a standalone function (L584), or extract it into `worker/agents/utils/conversationCompactifier.ts`.
- `worker/agents/inferutils/config.types.ts`: add `InferenceRuntimeOverrides` type alias.
- `worker/agents/inferutils/core.ts` (or wherever): add `AbortError` class if missing — verify first.
- `worker/services/secrets/SecretsClient.ts`: rewrite shim per §4 (constructor + `notifyUnlocked` + `notifyUnlockFailed` + structured-query `get`).
- `worker/services/git/GitVersionControlStub.ts`: extend per §3 (`getHead`, `fs.exportGitObjects`, dual-arg `commit`).
- `worker/agents/domain/values/GenerationContext.ts`: verify `AgenticGenerationContext` and `PhasicGenerationContext` exports. If missing, add — small additions.

**D. Type adaptations:**

- `AllIssues.clientErrors`: keep. Ported `base.ts` code that constructs `AllIssues` will need to populate it from state (one extra line at each construction site).
- `FileState`: verify upstream's `FileState` shape vs fork's at the port boundary.

**E. Cross-cutting port-time edits to upstream files:**

- `codingAgent.ts:298–299`: replace `this.env.UserSecretsStore.get(...)` block with `new SecretsClient()`.
- `codingAgent.ts:638`: replace `this.git.fs.exportGitObjects()` with `(await this.exportGitObjects()).gitObjects`.
- `behaviors/base.ts:635` (`InMemoryAnalyzer` branch): either route through fork's `worker/services/analysis/CodeAnalysisService` or skip the `renderMode === 'browser'` branch on the fork (it's only triggered for browser-rendered templates; the rest goes through `deploymentManager.runStaticAnalysis`).
- `objectives/base.ts:~185` (`GitHubService.exportToGitHub` call): rewrite per §7.

---

## Section 9 — Estimated commit 2b shape

**LoC counts:**

| Bucket | Files | LoC |
|--------|-------|-----|
| Ported verbatim or near-verbatim | base.ts, phasic.ts, agentic.ts, objectives/base.ts, strategies×3, codingAgent.ts | ~4,230 |
| New stub/util files (A.1–A.5) | 5 | ~360 |
| New operations (A.6–A.8) | 3 | ~900 (or ~230 if DeepDebugger is stubbed) |
| New DeploymentManager (A.9) | 1 | ~250 |
| Interface/constants/types widening (B + C) | ~7 existing files | ~120 net additions |

**Best case** (DeepDebugger stubbed, agentic deferred-but-stubbed-real-shape, GitHubService adapted): **~5,200 net new LoC across ~17 files**.

**Worst case** (full AgenticProjectBuilder + full DeepDebugger ported, plus the in-memory analyzer): **~5,900 net new LoC across ~19 files**.

**Realistic feasibility for one commit**: this is a single large mechanical commit, not a multi-day refactor — most of the LoC is verbatim copy with import-path rewrites and the three port-time edits above. Risk concentration is:

1. **DeploymentManager adapter** (§2) — the only real *new design* surface. Everything else is port + path-rewrite + small stubs.
2. **The 6 missing WebSocket constants** (§5) — wire-protocol gap, but no frontend regression risk because adding union arms is purely additive on the receive side.
3. **GitHubService adaptation** (§7) — contained to one method body in `objectives/base.ts`; well-understood.

The plan's "light-edit pass" framing was optimistic: commit 2b is closer to a *medium* port, not a *light* port. But every adaptation enumerated above is **bounded and well-scoped** — there is no architectural unknown left after this dep-map.
