# Phase E — Upstream Sync Inventory

**Reference points**
- Ours: `origin/main` @ `17ebe7a` (post PR #19)
- Upstream: `upstream/main` @ `a632039` (cloudflare/vibesdk, fetch depth 200)
- Tree-level delta (no shared history): **480 files changed, +65,802 / −25,744 lines**

---

## 1. Executive Summary

The upstream divergence is large but cleanly bucketed. Of 480 changed paths:

| Bucket | Count | Description |
|---|---|---|
| **A — TAKE_WHOLESALE** | 143 | Upstream-modified files we have not meaningfully touched post-fork; safe-ish to take outright after compile review |
| **B — CONFLICT** | 43 | Files both sides edited; requires merging |
| **C — SKIP_OURS** | 49 | Files unique to our fork (marketing, sync infra, branding, Dreamforge-specific code) |
| **D — NEW_IN_UPSTREAM** | 243 | Files only upstream has — new subsystems & features |
| Renames | 2 | `PostPhaseCodeFixer.ts`, `IAnalysisManager.ts` |

The Bucket-A count is the surprising one: ~95% of our "modifications" since the bulk-import (`9ac968b`) are concentrated in 43 files. Everything else is effectively stale.

**Top 3 highest-value port targets**
1. **Single agent core (`worker/agents/core/codingAgent.ts` + `behaviors/` + `objectives/`)** — upstream collapsed our `simpleGeneratorAgent`/`smartGeneratorAgent` into one Durable Object with pluggable phasic/agentic behaviors. Cleaner architecture, broad downstream bug-fix coverage. (PRs 27a586cc, 6011223, 320fc84, 6da9166.)
2. **Git Durable-Object integration (`worker/agents/git/`)** — isomorphic-git in a DO, chunked-SQLite FS adapter. Powers a much faster `feat: GitHub import` UX than our shell-out path. Cohesive 8-file new subsystem.
3. **WS ticket auth + state-signing (`worker/utils/wsTicketManager.ts`, `worker/utils/stateSigning.ts`, `worker/utils/tokenEncryption.ts`, `worker/middleware/auth/ticketAuth.ts`)** — security hardening on the WebSocket handshake. Bolt-on, no UI impact.

**Top 3 highest-risk port areas**
1. **`worker/services/secrets/` (DO-backed vault) vs our `worker/database/services/SecretsService.ts` (D1-backed)** — upstream's migration **`0004_calm_omega_flight.sql` drops the `user_secrets` table** we depend on. Migration 0004 + the new `UserSecretsStore` DO directly collide with our PR #16b decision and our D1 secrets model. Must reconcile before either lands.
2. **`worker/index.ts` + `worker/app.ts` + `wrangler.jsonc`** — touches every guard for marketing/dual-domain routing, dreamforge-cf naming, AI proxy origin gate (PR #15), migration tags v3–v5, and KV/D1 IDs. The hottest must-preserve surface in the repo.
3. **`worker/agents/prompts.ts` and `worker/agents/operations/PhaseImplementation.ts`** — ~800 lines and ~500 lines of *generator output* prompt rewrites in upstream. Functionally critical for app-gen quality, and our edits here are mostly the "Orange→Dreamforge" rename + a single lint pass. High value to port; merge mechanics are tedious but safe.

---

## 2. Methodology

### Bucketing filters

```bash
# A+B base — modified-on-both
git diff origin/main upstream/main --diff-filter=M --name-only

# Discriminator: did we touch the file AFTER the bulk import commit 9ac968b?
git log 9ac968b..origin/main --name-only --pretty=format: | sort -u
```

A file ends up in **Bucket B (conflict)** iff it appears in both the modified-both list *and* our post-`9ac968b` touched-file set. Otherwise it's **Bucket A (take wholesale)**. (Note: `9ac968b "Update to latest upstream vibesdk code"` is the bulk-import commit — anything modified only in that commit was a single mass upstream copy and counts as untouched for our purposes.)

```bash
# C — only ours
git diff origin/main upstream/main --diff-filter=D --name-only

# D — only upstream
git diff origin/main upstream/main --diff-filter=A --name-only
```

### Take-vs-conflict-vs-skip decision criteria

- **TAKE_WHOLESALE**: file is in Bucket A. Default action is rebase upstream version on top of ours; spot-check whether it transitively depends on a new upstream subsystem (e.g. `worker/agents/core/codingAgent.ts` pulls in `git/`, `secrets/`, `behaviors/`).
- **CONFLICT — take-upstream-rebase-our-change**: our edit was a small, well-defined patch (lint fix, branding rename, single security gate) and upstream's edit is substantial. Re-apply our patch on top of upstream.
- **CONFLICT — take-ours-cherry-pick-upstream-fix**: file embeds load-bearing local logic (routing, migrations, env types) and upstream's changes are mostly refactor cosmetics or partially-incompatible features. Keep ours, port specific upstream lines.
- **CONFLICT — manual-merge-required**: both sides made overlapping semantic edits to the same regions (e.g., `worker/index.ts` routing block).
- **SKIP_OURS**: file is local-only and intentional (marketing, sync logs, Dreamforge assets, env split). Flag only if unexpected.
- **NEW_IN_UPSTREAM — port-as-cohesive-feature**: 3+ new files form a single feature/subsystem. Port together or skip together.
- **NEW_IN_UPSTREAM — port-individually**: orphaned utility or single file.
- **NEW_IN_UPSTREAM — skip-not-applicable**: feature targets a use-case we don't have (e.g. presentation/slides mode if not in scope).

---

## 3. Bucket A — TAKE_WHOLESALE (143 files)

Files upstream modified that we haven't meaningfully edited. Listed by subsystem.

### A.1 `worker/agents/` — 35 files
**Dominant theme**: prompt rewrites, phase-generation strategy refinement, model-config refactor, behavior split (phasic vs agentic), removal of provider lock-in (OpenAI dep dropped), context restructure.

Representative upstream commits touching this tree:
- `7a586cc` fix: unintended change leading to bad behaviour
- `bedddf8` refactor: remove OpenAI dependency from inference utilities and define provider-agnostic types
- `2ff0b0f` refactor: restructure inference context to separate metadata from runtime state
- `f7960d5` feat: update model configurations and enhance inference handling
- `69c8642` feat: refine agent model configurations and phase generation strategy
- `0557bf7` feat: optimize phase context and reduce max phases to 10
- `0184e5f` feat: add common pitfalls and dependency documentation to phase implementation prompt
- `37e5ef5` fix: detect module-level JSX anti-pattern in safety gate
- `e136129` feat: some prompt improvements
- `3eb0039` feat: reduce side of blueprint infer for minimal templates

Risk: **medium** — generator output regression is hard to QA, but our local diffs in this subtree are practically zero (the `9ac968b` bulk-copy delivered these from upstream originally). The merge mechanics are clean.
Priority: **soon** — generator quality improvements compound.

Key files include `worker/agents/constants.ts`, `worker/agents/core/state.ts`, `worker/agents/core/types.ts`, `worker/agents/core/websocket.ts`, `worker/agents/inferutils/*.ts`, `worker/agents/operations/PhaseGeneration.ts`, `worker/agents/operations/FileRegeneration.ts`, `worker/agents/planning/blueprint.ts`, `worker/agents/planning/templateSelector.ts`, `worker/agents/services/implementations/FileManager.ts`, `worker/agents/services/implementations/StateManager.ts`, plus the toolkit (`worker/agents/tools/customTools.ts`, `tools/types.ts`, `tools/toolkit/{deploy-preview,feedback,queue-request,web-search}.ts`).

### A.2 `worker/services/` — 23 files
**Dominant theme**: code-fixer expansion (new TS error codes), rate-limit hardening (KV+DO stores, per-model increments, daily caps), sandbox SDK churn, CSRF service rewrite, GitHub service refactor, OAuth base refactor.

Representative commits:
- `8299ba5` feat: reduce limits
- `721b9e8` feat: enhance rate limit result with exceeded limit details and limit values
- `db5c845` chore: adjust rate limits for agent and llm calls
- `d8f0ba0` feat: implement daily rate limit for API and LLM calls
- `cc1de09` feat: implement model-specific rate limit increments for LLM calls

Risk: **low-medium**. Subsystems are well-isolated.
Priority: **now** for rate-limit/CSRF; **soon** for code-fixer; **defer** for sandboxSdkClient (it's in Bucket B for us due to overlap).

Files: `worker/services/code-fixer/**` (12 files), `worker/services/csrf/CsrfService.ts`, `worker/services/github/{GitHubService.ts,types.ts}`, `worker/services/oauth/base.ts`, `worker/services/rate-limit/{DORateLimitStore,KVRateLimitStore,config,rateLimits}.ts`, `worker/services/sandbox/{BaseSandboxService,remoteSandboxService,sandboxTypes}.ts`.

### A.3 `worker/api/` — 21 files
**Dominant theme**: controller layer cleanup, BYOK helper, route consolidation, model-config controller rebuild.

Representative commits:
- `f7960d5` feat: update model configurations and enhance inference handling
- `30ba991` feat: replace CLI token authentication with SDK API key management
- `e0a1083` refactor: standardize app data access patterns

Risk: **low** (with one caveat: `worker/api/routes/index.ts` wires up *new* upstream routes from Bucket D — `capabilitiesRoutes`, `ticketRoutes`, `cloudflareConnectRoutes`, `limitsRoutes`, `userSecretsRoutes`. Take-wholesale only after those Bucket-D pieces land — otherwise broken imports).
Priority: **soon**, but ordered behind Bucket-D feature ports.

Files: `worker/api/responses.ts`, `worker/api/websocketTypes.ts`, plus `controllers/{agent,analytics,appView,apps,githubExporter,modelConfig,modelProviders,screenshots,secrets}/controller.ts` and `routes/{appRoutes,authRoutes,codegenRoutes,githubExporterRoutes,imagesRoutes,index,secretsRoutes}.ts`.

### A.4 `src/routes/` — 18 files
**Dominant theme**: chat UI plumbing (helpers, mocks, websocket dispatch, deployment controls). No file in this subset has any post-`9ac968b` commit from us.

Representative commits:
- `f8b14cd` feat: add phase timeline change subscription and event handling
- `61421ed` fix: stabilize legacy chats and preview rendering

Risk: **low** structurally; **medium** for visual regressions (rebrand fragments may exist in untracked strings — grep for "vibesdk"/"VibeSDK" after merge).
Priority: **soon**.

Files: `src/routes/app/index.tsx`, `src/routes/home.tsx`, `src/routes/settings/index.tsx`, plus everything in `src/routes/chat/components/`, `src/routes/chat/hooks/use-file-content-stream.ts`, `src/routes/chat/mocks/file-mock.ts`, and `src/routes/chat/utils/*.ts`.

### A.5 `src/components/` — 9 files
Generic shadcn-ish UI tweaks. `card.tsx`, `model-selector.tsx`, modal additions (`byok-api-keys-modal.tsx`, `config-card.tsx`, `config-modal.tsx`, `github-export-modal.tsx`, `model-config-tabs.tsx`), `monaco-editor/monaco-editor.tsx`, `shared/AppActionsDropdown.tsx`. Low risk, take wholesale.

### A.6 `worker/database/` — 8 files
`database.ts`, `index.ts`, `schema.ts`, `types.ts`, `services/{ApiKeyService,AuthService,ModelConfigService,ModelTestService}.ts`. Schema additions (cf accounts, ai gateways, etc.) — **but** these go with migrations 0004/0005 which are Bucket-D and *conflict* with our `SecretsService`. Cannot port schema without resolving the vault question. **Hold this set.**
Priority: **gated on user decision in §8**.

### A.7 `worker/utils/` — 6 files
`ErrorHandling.ts`, `authUtils.ts`, `cryptoUtils.ts`, `idGenerator.ts`, `images.ts`, `jwtUtils.ts`. Self-contained improvements. Easy port.
Priority: **now**.

### A.8 Other singletons
- `worker/types/{appenv,auth-types}.ts` — needed for the new auth types from ticket/vault features. Take with §A.6/§A.7.
- `worker/middleware/{auth/routeAuth.ts, security/websocket.ts}` — port with WS ticket auth.
- `worker/app.ts` — small (the file is also in Bucket B, listed there).
- `src/api-types.ts`, `src/App.tsx`, `src/index.css`, `src/hooks/{use-github-export,useAuthGuard}.ts`, `src/utils/string.ts` — straightforward.
- `shared/types/errors.ts` — adds new error subtypes; needed by rate-limit & vault.
- `migrations/meta/_journal.json` — must merge into our existing journal after deciding 0004/0005 fate.
- `vite.config.ts`, `vitest.config.ts` — confirm test infra changes don't clobber our scripts.
- `container/{cli-tools,process-monitor,storage,types}.ts`, `SandboxDockerfile` — sandbox container changes; pairs with `wrangler.jsonc` instance-type bump from Bucket B.
- `.dev.vars.example`, `README.md`, `CLAUDE.md` — review-and-merge, not blind take. Our CLAUDE.md has Dreamforge-specific notes.

---

## 4. Bucket B — CONFLICT (43 files)

The real merge work. Listed with diff size, what each side did, and a per-file recommendation.

### B.1 Infrastructure / config / scripts (must-preserve heavy)

| File | Δ | Our side | Upstream side | Recommendation |
|---|---|---|---|---|
| `wrangler.jsonc` | 127 | dreamforge-cf name, KV/D1 IDs, getdreamforge routes, migrations v3/v4/v5, CUSTOM_DOMAIN vars, AI gateway name | name→vibesdk-production, observability `logs`+`traces`, max_instances 10→1400, vcpu/mem object, SSH, PLATFORM_CAPABILITIES var, build.cloudflare.dev routes | **take-ours-cherry-pick-upstream-fix** — port observability block, instance_type object, SSH, max_instances, PLATFORM_CAPABILITIES; **keep** name/IDs/routes/migration history |
| `worker/index.ts` | 175 | Marketing-domain branch, AI proxy origin gate (PR #15), tombstone exports | Removed marketing branch, new agent-browser subdomain handler (`b-*`), Git protocol handler, OAuth `/oauth`+`/auth/callback` route, websocket-upgrade passthrough in sandbox proxy, `proxyToSandbox` moved to local module, `getAgentStub` indirection, `CodeGeneratorAgent` import from new path | **manual-merge-required** — preserve marketing routing & origin gate; adopt agent-browser handler, websocket upgrade, OAuth route, new CodeGeneratorAgent import |
| `worker/app.ts` | 18 | (unchanged by us; classed as B by historical touch) | Skip secure headers on OAuth redirects, wrap 404 ASSETS response in mutable headers | **take-upstream-rebase-our-change** — trivial |
| `worker-configuration.d.ts` | 68 | wrangler-generated, holds our Env shape (post PR #14 split) | regenerated for upstream's env vars (PLATFORM_CAPABILITIES, cf-connect, etc.) | **regenerate** locally via `npm run cf-typegen` after porting wrangler.jsonc; do not merge by hand |
| `tsconfig.worker.json` | 5 | (small) | (small) | **take-upstream-rebase-our-change** |
| `scripts/deploy.ts` | 70 | dreamforge-cf hooks (likely) | env vars in deploy template, prod-vars file creation pre-conflict, fork-detection by repo ownership | **manual-merge-required** — keep our name/domain constants; adopt env-vars + fork-detection refactors |
| `scripts/setup.ts` | 122 | (likely small rebrand) | AI Gateway token reuse, permission check refactor, "VibSDK"→"VibeSDK" typo fix | **take-upstream-rebase-our-change** — let upstream win, re-apply Dreamforge strings |
| `scripts/undeploy.ts` | 12 | (small) | (small) | **take-upstream-rebase-our-change** |
| `.github/workflows/ci.yml` | 176 | PR #13 pure pre-merge gate (cache, install, typecheck, lint, dry-run wrangler) — load-bearing | upstream-style single job, push+pr triggers | **take-ours** — our pre-merge gate is more rigorous and matches branch protection. Skip. |
| `.gitignore` | 23 | sync-logs, dreamforge assets | sdk/, husky, etc. | **manual-merge-required** — small, easy |
| `eslint.config.js` | 32 | PR #13 lint config | upstream eslint changes (commit 6fbf28b) | **take-upstream-rebase-our-change**, then re-run lint + fix any new errors |
| `package.json` | 146 | dreamforge-cf name + scripts | new deps (husky, commitlint, sdk workspace, isomorphic-git), version bumps, new scripts | **manual-merge-required** — preserve name + copy-landing-pages script; adopt all dep bumps and new scripts |
| `bun.lock` | 2309 | ours | upstream's | **regenerate** after package.json merge; do not merge by hand |
| `index.html` | 3 | Dreamforge title/meta | small upstream tweak | **take-ours** |
| `docs/architecture-diagrams.md` | 4 | (trivial) | (trivial) | **take-upstream-rebase-our-change** |

### B.2 Worker core / API / DB

| File | Δ | Description |
|---|---|---|
| `worker/api/controllers/auth/controller.ts` | 133 | Upstream adds: block email/login when OAuth providers configured, MAX_API_KEYS_PER_USER cap, sha256 hashing helper, JWT utils import. Our side: minor. **take-upstream-rebase-our-change**. |
| `worker/api/controllers/user/controller.ts` | 2 | Trivial. **take-upstream-rebase-our-change**. |
| `worker/api/controllers/agent/types.ts` | 13 | Type additions. **take-upstream-rebase-our-change**. |
| `worker/database/services/AppService.ts` | 73 | App-data access standardization (`e0a1083`). **take-upstream-rebase-our-change**. |
| `worker/observability/sentry.ts` | 2 | Trivial. **take-upstream-rebase-our-change**. |
| `worker/services/aigateway-proxy/controller.ts` | 41 | **CRITICAL — touches PR #15**. Upstream re-relaxes the CORS origin to `*` and forwards request origin, then adds a *response-header allowlist* defense. Our side has the hard origin gate already (PR #15 also moved it to `worker/index.ts`). **manual-merge-required** — keep our gate in index.ts, add upstream's response-header allowlist, do NOT regress CORS to `*`. |
| `worker/services/sandbox/sandboxSdkClient.ts` | 1264 | Massive rewrite — git tools, chunked storage, retry, signed URLs. Our edits here are negligible (rebrand only). **take-upstream-rebase-our-change**. |
| `worker/services/code-fixer/fixers/ts2304.ts` | 11 | Small. **take-upstream-rebase-our-change**. |
| `worker/utils/githubUtils.ts` | 2 | Trivial. **take-upstream-rebase-our-change**. |
| `worker/utils/urls.ts` | 71 | URL helpers updated. We added `isPreviewOrigin` (PR #15). **manual-merge-required** — ensure `isPreviewOrigin` survives or gets re-implemented against the new helpers. |

### B.3 Agent core (prompts/operations)

All four of these are large upstream rewrites of generator output; our diff is essentially `s/Orange/Dreamforge/g` + a single PR #13 lint pass.

| File | Δ | Recommendation |
|---|---|---|
| `worker/agents/prompts.ts` | 805 | **take-upstream-rebase-our-change** — let upstream win; re-grep for "Orange"/"vibesdk" in result, swap branding strings |
| `worker/agents/operations/PhaseImplementation.ts` | 504 | Same. |
| `worker/agents/operations/UserConversationProcessor.ts` | 522 | Same. |
| `worker/agents/schemas.ts` | 80 | **take-upstream-rebase-our-change**. |
| `worker/agents/assistants/realtimeCodeFixer.ts` | 27 | **take-upstream-rebase-our-change**. |
| `worker/agents/output-formats/streaming-formats/scof.ts` | 30 | **take-upstream-rebase-our-change**. |
| `worker/agents/output-formats/streaming-formats/xml-stream.ts` | 28 | **take-upstream-rebase-our-change**. |
| `worker/agents/tools/toolkit/get-logs.ts` | 76 | **take-upstream-rebase-our-change**. |

### B.4 Frontend chat (touches Dreamforge branding)

| File | Δ | Description |
|---|---|---|
| `src/routes/chat/components/messages.tsx` | 346 | Upstream: huge expansion (debug-session bubbles, JSON renderer, content-item splitting). Ours: 5 small commits adjusting logo size/positioning for Dreamforge wordmark. **manual-merge-required** — port upstream wholesale, re-apply our logo sizing tweaks in the avatar/header block. |
| `src/routes/chat/components/debug-panel.tsx` | 71 | Upstream additions; our diff negligible. **take-upstream-rebase-our-change**. |
| `src/routes/chat/hooks/use-chat.ts` | 292 | Major upstream changes (debug session, new WS messages, content detector). **take-upstream-rebase-our-change**. |
| `src/components/icons/logos.tsx` | 38 | **take-ours** — this is our Dreamforge logo asset wiring. |
| `src/components/layout/global-header.tsx` | 18 | Rebrand. **take-ours**. |
| `src/contexts/auth-context.tsx` | 62 | Upstream adds session-validation timer + refresh logic. **take-upstream-rebase-our-change**. |
| `src/hooks/use-auto-scroll.ts` | 2 | Trivial. **take-upstream-rebase-our-change**. |
| `src/hooks/use-image-upload.ts` | 23 | Small. **take-upstream-rebase-our-change**. |
| `src/lib/api-client.ts` | 241 | Significant upstream additions (vault endpoints, ticket auth, limits). **take-upstream-rebase-our-change** (after the Bucket-D vault decision). |
| `src/routes/apps/index.tsx` | 4 | Trivial. **take-upstream-rebase-our-change**. |
| `src/routes/discover/index.tsx` | 4 | Trivial. **take-upstream-rebase-our-change**. |

### B.5 Conflict summary by must-preserve impact

- **Marketing routing** lives entirely in `worker/index.ts` + `wrangler.jsonc` + `worker/static/landing-pages/` (Bucket C). Both B-files are flagged manual-merge.
- **GitHub import** (our local feature) — Bucket A `worker/services/github/GitHubService.ts` is the implementation; upstream rewrote it. Need to confirm our import flow still works on top of the upstream version. Worth a dedicated PR.
- **Env types split (PR #14)** — `worker-configuration.d.ts` should be **regenerated**, never merged by hand. `worker-secrets.d.ts` (Bucket C, ours-only) survives untouched.
- **AI proxy origin gate (PR #15)** — touches both `worker/index.ts` and `worker/services/aigateway-proxy/controller.ts`. Both flagged manual-merge.

---

## 5. Bucket C — SKIP_OURS (49 files)

All expected, no surprises. Grouped:

**Marketing & branding** (15 files)
- `worker/static/landing-pages/{index.html,script.js,styles.css}`
- `worker/static/landing-pages/dream-builder/{index.html,script.js,styles.css}`
- `scripts/copy-landing-pages.ts`
- `public/dreamforge-icon.{png,svg}`, `public/dreamforge-logo.{png,svg}`
- `Dreamforge Cloud icon.png`
- `bun.lockb` (legacy lockfile, our bun version)

**Env-types split (PR #14)**
- `worker-secrets.d.ts`

**Sync infrastructure** (8 files)
- `.sync-logs/{README.md, MULTI_AUTH_CHANGES.md, sync_*/*.{md,txt}}` (×7)
- `UPSTREAM_SYNC.md`

**CI workflows** (3 files)
- `.github/workflows/{README.md, deploy.yml, upstream-notifications.yml, upstream-sync-manual.yml}`

**Claude Code agent definitions** (13 files in `.claude/agents/`)
- `.claude/README.md` + 12 dreamforge-* agents

**Old agent generator (architecturally superseded by upstream's refactor — see Q1 in §8)**
- `worker/agents/core/simpleGeneratorAgent.ts`
- `worker/agents/core/smartGeneratorAgent.ts`
- `worker/agents/operations/CodeReview.ts`
- `worker/agents/operations/ScreenshotAnalysis.ts`
- `worker/agents/services/implementations/CodingAgent.ts`

**D1-backed secrets feature (architecturally superseded by upstream's DO vault — see Q1)**
- `worker/database/services/SecretsService.ts`

**Misc**
- `src/routes/chat/components/model-config-info.tsx` (upstream renamed/moved to `src/components/shared/ModelConfigInfo.tsx`)

**Flag for user attention**
- None unexpected. The two "architecturally superseded" sets (agent generator and secrets) are *also* implicated in Bucket B/D conflicts; their fate is the §8 Q1/Q2.

---

## 6. Bucket D — NEW_IN_UPSTREAM (243 files)

Grouped by feature/subsystem; per-subsystem port verdict.

### D.1 SDK package (`sdk/` — 39 files)
Brand-new top-level workspace. WebSocket client, phasic/agentic state mirrors, integration tests, NDJSON, retry, blueprint parsing, drizzle-type expansion script. Lands in commits `46d7769`, `a841168`, `932271f`, `dbcf51f`, `f8b14cd`.

**Recommendation: port-as-cohesive-feature, but DEFERRABLE.** The SDK is an external client library for third parties; not required to run the platform. Land last if at all. Verify the worker doesn't have hard runtime dependencies on `sdk/` (it shouldn't — it's a separate workspace).

### D.2 Agent core refactor (`worker/agents/core/`, `worker/agents/core/behaviors/`, `worker/agents/core/objectives/`, `worker/agents/core/features/` — ~12 files)
Files: `codingAgent.ts`, `AgentCore.ts`, `AgentComponent.ts`, `stateMigration.ts`, `behaviors/{base,phasic,agentic}.ts`, `objectives/base.ts`, `objectives/strategies/{presentation,types,index}.ts`, `features/{index,types}.ts`.

The single most consequential structural change. Upstream collapsed our two-DO design (`SmartCodeGeneratorAgent` + `SimpleCodeGeneratorAgent`) into one `CodeGeneratorAgent` DO with pluggable behaviors. The exported class name from `worker/index.ts` changes accordingly (Bucket B conflict).

**Recommendation: port-as-cohesive-feature, port HIGH PRIORITY.** This is the biggest "current best practice" win. Touches: index.ts export, websocket wiring (B.2), state migration, every operation in `worker/agents/operations/`. Wide blast radius, but cleanly separable.

### D.3 Agentic builder & deep-debugger (`worker/agents/operations/{AgenticProjectBuilder,DeepDebugger,SimpleCodeGeneration}.ts` + `worker/agents/operations/prompts/*` + `worker/agents/tools/toolkit/{deep-debugger,wait-for-debug,wait-for-generation,wait}.ts` — ~10 files)
Multi-turn agentic mode + a dedicated debugging operation with session persistence.

**Recommendation: port-as-cohesive-feature, MEDIUM PRIORITY.** Requires D.2 to land first.

### D.4 Git integration (`worker/agents/git/` + `worker/agents/tools/toolkit/git.ts` + `worker/api/handlers/git-protocol.ts` + `worker/api/handlers/git-cache.ts` + `src/components/shared/GitClone{Inline,Modal}.tsx` + `src/hooks/use-github-export.ts` — ~10 files)
Files: `git.ts`, `git-clone-service.ts`, `fs-adapter.ts`, `memfs.ts`, `index.ts` (the subsystem), plus the toolkit and API handlers and UI.

**Recommendation: port-as-cohesive-feature, HIGH PRIORITY.** Materially upgrades our must-preserve "GitHub import" feature. Should compose well with our existing GitHub import path — but **the user must confirm** what their current import implementation is and whether to replace or augment it. (See Q3.)

### D.5 Zero-knowledge vault (`worker/services/secrets/` + `worker/services/secrets/UserSecretsStore.test.ts` + `worker/middleware/auth/ticketAuth.ts` + `worker/utils/wsTicketManager.ts` + `worker/api/controllers/user-secrets/` + `worker/api/routes/userSecretsRoutes.ts` + `src/components/vault/` (7 files) + `src/contexts/vault-context.tsx` + `src/hooks/use-vault.ts` + `src/lib/vault-crypto.ts` — ~25 files)
The encrypted-DO secrets system with WebAuthn-PRF + Argon2id KDF. Replaces (architecturally) the D1-backed `SecretsService` we just kept under PR #16b.

**Recommendation: port-as-cohesive-feature, but BLOCKED on §8 Q1.** Migration 0004 drops `user_secrets` table → would lose existing user secrets if any exist in prod. This needs a deliberate decision before any port.

### D.6 Cloudflare OAuth Connect + usage limits (`worker/services/oauth/cloudflare-connect.ts` + `worker/services/cloudflare/CloudflareAccountService.ts` + `worker/api/controllers/{cloudflareAccount,cloudflareConnect,limits}/controller.ts` + `worker/api/routes/{cloudflareAccountRoutes,cloudflareConnectRoutes,limitsRoutes}.ts` + `worker/services/rate-limit/{index,usageChecker}.ts` + `src/contexts/limits-context.tsx` + `src/components/{cloudflare-account-selector,credits-banner,usage-limits-{badge,card}}.tsx` + `src/hooks/use-limits.ts` + `src/utils/usage-limit-checker.tsx` + `shared/constants/limits.ts` + `worker/utils/oauthCookie.ts` + `worker/utils/stateSigning.ts` + `worker/utils/tokenEncryption.ts` + `worker/api/controllers/capabilities/` — ~22 files)
The big `6fc180c` feature: lets a user connect their CF account and bring their own gateway/credits/account for BYOK inference. Touches frontend banners + backend OAuth flow.

**Recommendation: port-as-cohesive-feature, MEDIUM PRIORITY.** Self-contained but big. Requires migration 0005 + auth changes. Useful for production-grade BYOK story.

### D.7 Feature module system (`src/features/` — ~15 files)
`core/{context,registry,types}.tsx`, `app/`, `general/`, `presentation/` (with its own hooks subdir), `index.ts`. New "feature registry" pattern (`0534a95`) — lets you turn `app`/`presentation`/`general` modes on/off via `PLATFORM_CAPABILITIES` var in wrangler.

**Recommendation: port-as-cohesive-feature**, but presentation/general modes can be disabled. Pairs with `worker/api/controllers/capabilities/`. Useful pattern even if we keep only `app` enabled.

### D.8 Static analysis service (`worker/services/static-analysis/` — 9 files)
In-memory HTML/CSS/JS analyzer + cross-validator. Lands in `320fc84` "static analysis for browser rendered preview projects".

**Recommendation: port-as-cohesive-feature, MEDIUM PRIORITY.** Improves generator quality on minimal/HTML-only templates.

### D.9 New CI / DevOps workflows (`.github/workflows/{ai-pr-review,bonk,claude-docs-sync,deploy-release-live,pr-labeler,release,semgrep}.yml` + `.github/labeler.yml` + `.husky/{pre-commit,commit-msg}` + `commitlint.config.js` + `CHANGELOG.md`)
Release automation, AI PR review (Gemini-driven), Semgrep, conventional-commit enforcement.

**Recommendation: port-individually.** Most apply, but we already have `.github/workflows/{ci,deploy}.yml` doing the load-bearing work. Worth picking up `semgrep.yml` and `pr-labeler.yml`. Skip `release.yml`/`deploy-release-live.yml` (upstream's own release pipeline, conflicts with ours).

### D.10 Sandbox refactor pieces (`worker/services/sandbox/{fileTreeBuilder,request-handler,utils,zipExtractor}.ts`)
Local copy of sandbox-proxy code (`worker/index.ts` now imports from here instead of `@cloudflare/sandbox`), plus utilities for zip-based file uploads.

**Recommendation: port-as-cohesive-feature with §B.1 worker/index.ts merge.**

### D.11 Tool/toolkit expansion (`worker/agents/tools/toolkit/*.ts` — ~18 new tools)
Files including `alter-blueprint.ts`, `completion-signals.ts`, `exec-commands.ts`, `generate-{blueprint,files,images}.ts`, `get-runtime-errors.ts`, `init-suitable-template.ts`, `initialize-slides.ts`, `read-files.ts`, `regenerate-file.ts`, `rename-project.ts`, `run-analysis.ts`, `virtual-filesystem.ts`. Mostly the agentic-mode tools.

**Recommendation: port-as-cohesive-feature with D.3 + D.2.**

### D.12 Miscellaneous singletons
- `worker/services/secrets/SecretsClient.ts` — RPC client paired with `UserSecretsStore` DO (see D.5).
- `worker/utils/{encoding,pathUtils,screenshot-security}.ts` — small utilities; some imported by Bucket-A files. **Port now, individually**, alongside whatever uses them.
- `worker/api/controllers/modelConfig/constraintHelper.ts` — pairs with `modelConfig/controller.ts` Bucket-A change. Port together.
- `worker/api/controllers/ticket/controller.ts` + `worker/api/routes/ticketRoutes.ts` — pairs with WS ticket auth.
- `worker/agents/inferutils/{completionDetection,loopDetection,toolExecution}.ts` — used by D.3 deep-debugger.
- `worker/agents/utils/{codebaseContext,conversationCompactifier,packageSyncer,preDeploySafetyGate,templateCustomizer,templates}.ts` + the `.test.ts` for safety gate — agent utilities. Port alongside D.2.
- `worker/agents/services/implementations/{BaseAgentService,DeploymentManager}.ts` + interfaces — service layer for D.2.
- `migrations/0004_calm_omega_flight.sql` + `migrations/0005_cloudflare_oauth_connect.sql` + their snapshots — **CRITICAL: 0004 drops `user_secrets`. Blocked on Q1.**
- `wrangler.test.jsonc`, `test/worker-entry.ts`, `tsconfig.tsbuildinfo` — test infra (port with vitest changes).
- `debug-tools/`, `container/monitor-cli.test.ts`, `docs/{llm.md,usage-limits-ui.md}` — non-runtime. Port for completeness, low priority.
- `AGENTS.md` — upstream's Claude-Code instructions file, equivalent to our `CLAUDE.md`. **Skip** (we have our own).

---

## 7. Recommended port-forward sequence

Each PR is sized to be reviewable in one sitting and ordered so dependencies resolve in order. Risk band assumes the reviewer reads the changes; LoC is upstream-side gross.

### PR 1 — Utilities & small wins (Bucket A subset)
**Scope**: `worker/utils/{ErrorHandling,authUtils,cryptoUtils,idGenerator,images,jwtUtils}.ts`, `worker/utils/{encoding,pathUtils,screenshot-security}.ts` (D.12), `shared/types/errors.ts`, `src/utils/string.ts`, `src/hooks/{use-github-export,useAuthGuard}.ts`, `worker/types/{appenv,auth-types}.ts`.
**Risk**: low. ~500 LoC. Compile-only impact.
**Why first**: zero blast radius; unblocks types used by later PRs.

### PR 2 — Wrangler / config / build merge
**Scope**: `wrangler.jsonc` (cherry-pick observability + sandbox specs + PLATFORM_CAPABILITIES while keeping our name/routes/migrations), `worker-configuration.d.ts` (regenerate), `package.json` + lockfile (with new deps), `eslint.config.js`, `tsconfig.worker.json`, `.gitignore`, `vite.config.ts`, `vitest.config.ts`, `scripts/{deploy,setup,undeploy}.ts`, `SandboxDockerfile`, `container/*.ts`.
**Risk**: medium. ~2000 LoC. Touches deploy surface — must dry-run.
**Why second**: unblocks the new deps (isomorphic-git, husky, commitlint) and instance-type bumps needed by sandbox/git ports.

### PR 3 — `worker/app.ts` + `worker/index.ts` routing merge
**Scope**: merge `worker/app.ts` (trivial), then the hard one: `worker/index.ts`. Adopt agent-browser subdomain handler, OAuth route, websocket-upgrade passthrough, sandbox-proxy local import. **Preserve** marketing-domain branch, PR #15 origin gate, current `CodeGeneratorAgent` symbol export (until PR 5 retires it).
**Risk**: high (marketing routing + dual-domain). ~500 LoC effective. **Requires e2e smoke test on `getdreamforge.com` + `app.getdreamforge.com` + a preview subdomain.**
**Why third**: every other port lands on this entry-point; better to settle it before the agent refactor.

### PR 4 — API controllers & frontend chat plumbing (Bucket A + small B)
**Scope**: `worker/api/responses.ts`, `worker/api/websocketTypes.ts`, controllers/routes that don't require new subsystems (everything except `userSecretsRoutes`, `cloudflareConnectRoutes`, `limitsRoutes`, `capabilitiesRoutes`, `ticketRoutes`), `src/api-types.ts`, `src/App.tsx`, the `src/routes/chat/` Bucket-A files.
**Risk**: medium. ~1500 LoC. UI regressions possible.

### PR 5 — Agent core refactor (D.2 + the B-prompts cluster)
**Scope**: new `worker/agents/core/{codingAgent,AgentCore,AgentComponent,stateMigration}.ts` + `behaviors/` + `objectives/` + `features/`. Delete `simpleGeneratorAgent.ts` and `smartGeneratorAgent.ts` (Bucket C). Update worker/index.ts export. Take-upstream-rebase-our-change on `worker/agents/prompts.ts`, `operations/{PhaseImplementation,UserConversationProcessor,FileRegeneration,PhaseGeneration}.ts`, `agents/schemas.ts`, `agents/constants.ts`, `agents/inferutils/*`. Re-apply Dreamforge string substitutions afterward.
**Risk**: high. ~5000+ LoC. Generator quality regressions hard to QA — **insist on a manual app-gen smoke test before merge**.

### PR 6 — Git subsystem (D.4) + sandbox local proxy (D.10)
**Scope**: `worker/agents/git/`, `worker/services/sandbox/{fileTreeBuilder,request-handler,utils,zipExtractor}.ts`, sandboxSdkClient.ts (B-merge — take upstream), git-protocol + git-cache handlers, the toolkit git tools, frontend `GitClone*` components. **Audit** how upstream's git import interacts with our existing GitHub-import path (Q3).
**Risk**: medium. ~3000 LoC. New runtime dep on isomorphic-git.

### PR 7 — Rate limits + CSRF + GitHub service (rest of Bucket A `worker/services/`)
**Scope**: `worker/services/{rate-limit,csrf,github,oauth/base}.ts`, code-fixer/, plus the security/websocket middleware.
**Risk**: low-medium. ~1500 LoC.

### PR 8 — Agentic mode + deep-debugger + agent utils + static analysis
**Scope**: D.3 + D.8 + D.11 + remaining toolkit + `worker/agents/utils/*` + `worker/agents/services/implementations/{BaseAgentService,DeploymentManager}.ts`.
**Risk**: medium. ~4000 LoC.

### PR 9 — Vault decision (BLOCKED on Q1)
**Scope**: ONE of —
- **Option A (port vault)**: D.5 + migration 0004; delete `worker/database/services/SecretsService.ts`; preserve PR #16b only as historical receipt.
- **Option B (keep our D1 secrets)**: skip D.5 entirely; rewrite migration 0004 locally to NOT drop `user_secrets`; reconcile any A-files that imported vault types.
**Risk**: high (data migration if Option A). ~2500 LoC.
**Why late**: blocks on user direction.

### PR 10 — CF OAuth Connect + features + presentation gating
**Scope**: D.6 + D.7 + remaining capabilities/limits/ticket controllers. Disable presentation/general feature flags in wrangler `PLATFORM_CAPABILITIES`.
**Risk**: medium. ~3000 LoC. Touches auth — careful CSRF/cookie review.

### PR 11 (optional) — SDK package & release workflows
**Scope**: D.1 + D.9 minus deploy/release. Land only if there's a use case for the public SDK.
**Risk**: low (isolated). ~3500 LoC.

---

## 8. Open questions for the user

**Q1. UserSecretsStore: D1-backed or DO-backed?**
We just shipped PR #16b deleting `UserSecretsStore` as a phantom DO and standing on `worker/database/services/SecretsService.ts` (D1 + XChaCha20-Poly1305). Upstream's `fd28396` ("feat: new zero knowledge vault implementation") brings back `UserSecretsStore` as a **real**, session-bound, zero-knowledge DO with WebAuthn-PRF — and migration `0004_calm_omega_flight.sql` *drops the `user_secrets` D1 table*. These two designs cannot coexist. Decision needed before any port that depends on migrations 0004/0005 or the new vault UI.

Sub-question: do any production users currently have rows in `user_secrets`? If yes, Option A (port vault) needs a data-migration step.

**Q2. SmartCodeGeneratorAgent vs upstream's unified CodeGeneratorAgent.**
Our `worker/index.ts` currently exports `CodeGeneratorAgent = SmartCodeGeneratorAgent`. Upstream's refactor exports `CodeGeneratorAgent` directly from `worker/agents/core/codingAgent.ts` with the behaviors pattern. The Durable Object class name is the same — does CF accept the swap without a migration tag? (I believe yes: the *binding* name stays `CodeGenObject`, and the *class name* stays `CodeGeneratorAgent`; only the implementation module changes. Worth confirming before PR 5.)

**Q3. GitHub import: replace or augment?**
You listed "GitHub import feature" as must-preserve. Upstream has a sophisticated git-clone-into-DO subsystem (`worker/agents/git/`) plus git-protocol handlers (`worker/api/handlers/git-protocol.ts`) that materially upgrade that capability. Should I plan to:
- (a) **replace** our import path with upstream's git infrastructure (cleaner long-term), or
- (b) **augment** — keep our existing import flow as the user-facing entry, but use upstream's git internals underneath, or
- (c) **leave alone** and only port the parts that don't touch import?

I cannot find a single file path that obviously houses "our" GitHub import code (`worker/services/github/GitHubService.ts` is the upstream-originated file — Bucket A). Where does the import feature live in our fork specifically? That'll resolve this.

**Q4. PLATFORM_CAPABILITIES var: enable which features?**
Upstream's wrangler adds `PLATFORM_CAPABILITIES.features = { app, presentation, general }`. The new `src/features/` registry reads this. For Dreamforge I assume `app=true, presentation=false, general=false`. Confirm before PR 10.

**Q5. SDK package: ship it under Dreamforge or not?**
If we land Bucket D.1 (`sdk/`), do we publish it (and under what name — `dreamforge-sdk`?) or just keep it building for parity?

**Q6. AGENTS.md handling.**
Upstream's `AGENTS.md` (Claude-Code instructions) overlaps in purpose with our `CLAUDE.md`. Do we want to mirror our CLAUDE.md content into AGENTS.md too (so both Claude Code and Codex/Cursor agents see it), or stay CLAUDE-only? (Pure docs question, not blocking any code port.)
