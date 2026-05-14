# BYOP Recovery Audit

**Date:** 2026-05-14
**Active branch:** `main` @ `17ebe7a` (post PR #19)
**Recovery source:** Bishop WSL clone @ `/home/bishop/projects/dreamforge`, HEAD `dab9e5d`
**Bishop's `origin/main`:** `17ebe7a` — bishop is rebased on the same tip as us, so `git diff origin/main` in the bishop repo gives an exact delta against our current main.
**Bishop divergence:** 659 commits ahead of `origin/main`. ~37.5K LoC added across ~235 files. **BYOP is only a slice of that divergence** — pulling files wholesale would drag in unrelated rewrites (codegen agent, sandbox client, marketing pages, Stripe).

---

## 1. Architectural Summary

BYOP ("Bring Your Own Project") is an authenticated import flow at `/import` that lets a user pick one of their GitHub repos, have it cloned and statically analyzed, and receive a Gemini-generated **completion blueprint** — a structured report of what the repo implements, what's missing, prioritised recommendations, and a phased build plan that can be fed into our `CodeGeneratorAgent` for follow-on generation.

**End-to-end user flow:**

1. **Auth.** OAuth with GitHub using the extended `repo` scope. `AuthService.handleOAuthCallback()` calls `GitHubTokenService.storeToken()` to persist the access token, XChaCha20-Poly1305-encrypted with `SECRETS_ENCRYPTION_KEY`, in a new D1 `github_tokens` table.
2. **Repo list.** `GET /api/byop/repositories` → decrypts token, calls Octokit, returns repos.
3. **Import.** `POST /api/byop/import` → creates a `CodebaseAnalyzer` Durable Object by `idFromName(\`${userId}-${Date.now()}\`)`, clones the repo into a sandbox container via `SandboxSdkClient.cloneGitHubRepository` (depth=1, GIT_ASKPASS credential helper to keep the token off `/proc`), reads files in batches (10/batch, max 500), POSTs them into the DO.
4. **Analyze.** Inside the DO: `CodeAnalysisService` (ts-morph + regex fallback) extracts framework, deps, entry points, source-file summaries, TODO/FIXME counts. Then `BlueprintGenerationService` calls **Gemini 2.5/3 Pro** via the Cloudflare AI Gateway (`/google-ai-studio/v1/models/gemini-3-pro-preview:generateContent`, 2M ctx, structured JSON). Because DO storage caps at 128KB, full file contents are persisted in R2 (`TEMPLATES_BUCKET` under key `byop-files/{analysisId}`). The completed blueprint is cached in D1 (`blueprint_cache` table, 7-day TTL).
5. **Progress.** Frontend polls `GET /api/byop/analysis/:id/status` every 5s, with a WebSocket upgrade path at `/api/byop/analysis/:id/ws` that forwards `c.req.raw` to the DO for real-time broadcasts.
6. **Build.** `POST /api/byop/analysis/:id/start-building` hands `{ blueprint, fileContentsR2Key, repositoryUrl }` off to the agent flow; `CodingAgentController` fetches files from R2 and seeds `CodeGeneratorAgent` with `importedRepository` instead of a template.

Services touched: `CodebaseAnalyzer` DO, `UserAppSandboxService` (DO), D1 (`github_tokens`, `blueprint_cache`), R2 (`TEMPLATES_BUCKET`), Cloudflare AI Gateway → Google AI Studio.

---

## 2. Production-Readiness State

**As of bishop HEAD (2025-12-06): functionally complete, recently stabilised, not yet observed clean in production.**

Bishop's last 25 BYOP-touching commits move from feature work to fix work, which is the signature of a feature in stabilisation:

| Commit | Message |
|---|---|
| `d4f74d5` | fix: resolve sandbox preview errors causing deployment failures |
| `09b614a` | fix: implement R2-based file storage for BYOP to bypass DO 128KB limit |
| `b267743` | feat: extract project name from README.md during BYOP import |
| `eae19ad` | fix: add CF_ACCOUNT_ID and CF_AI_GATEWAY_ID to production secrets |
| `03f261b` | fix: resolve all TypeScript compilation errors for BYOP and services |
| `f0d9a05` | fix: create agent database records for ownership validation |
| `3723c5c` | fix: reduce PBKDF2 iterations to comply with Cloudflare Workers limit |
| `5ec03d2` | fix(critical): validate D1 batch operations for GitHub token storage |
| `c7d8c86` | fix(auth): critical GitHub OAuth cookie and token storage fixes |
| `97fab4c` | fix(byop): prevent silent GitHub token storage failures |
| `9e9a8c9` | feat: add retry logic and D1 blueprint caching for BYOP |
| `ba04427` | feat: complete WebSocket real-time progress for BYOP analysis |
| `1651057` | fix(byop): critical security and reliability improvements |
| `4a20814` | feat(byop): Phase 5 — reverse blueprint generation with Gemini 2.5 Pro |
| `e6245da` | feat(byop): Phase 4 — create CodebaseAnalyzer Durable Object |

`BYOP_FEATURE_COMPLETE.md` self-rates the feature at "95% complete" with these remaining items: WebSocket real-time updates (since shipped in `ba04427`), comprehensive testing (blocked by Docker), analytics integration, performance monitoring.

**Most recent in-flight concerns:**

- **128KB DO storage limit** — fixed by `09b614a` (R2-backed file storage). The DO now persists only metadata; full contents live in R2.
- **`fileContentsR2Key` plumbing through to `CodeGeneratorAgent`** — `BYOP_COMPLETE_FIX_PLAN.md` documents this gap and the fix-list is marked completed and deployed.
- **Sandbox preview failures** — `d4f74d5` is the very last commit; described as "resolve sandbox preview errors causing deployment failures." No follow-up commit lands after it, so we don't know whether the fix was verified in production.
- **GitHub token storage silent-failure** — fixed by `97fab4c` (re-throw on storage error) and `c7d8c86` (cookie + token storage fixes).

**TODO/FIXME signals in BYOP source:** none. The only `TODO/FIXME` strings inside the BYOP files are in `BlueprintGenerationService.ts` and they're prompt-template references describing TODO comments in user code, not real code TODOs.

**Code-quality concern:** `worker/agents/analyzer/codebaseAnalyzer.ts:396` does `await import('../../services/migration/cloudflare-compatibility-checker')` — a **dynamic import**, which our `CLAUDE.md` explicitly forbids. This must be converted to a static import during recovery.

---

## 3. File-Level Diff Catalog

Diffs taken from inside the bishop repo: `git diff origin/main -- <path>` (bishop's `origin/main` = our `17ebe7a`).

### Bucket A — New files (no merge required, just port the file)

| File | Lines | Notes |
|---|---|---|
| `worker/api/routes/byopRoutes.ts` | 79 | Hono router; mounts under `/api/byop` |
| `worker/api/controllers/byop/controller.ts` | 909 | Controller (list, import, status, blueprint, ws, start-building) |
| `worker/agents/analyzer/codebaseAnalyzer.ts` | 686 | The DO. **Has one dynamic `await import` to fix.** |
| `worker/agents/utils/byopConfigNormalizers.ts` | 1,248 | Normalises imported repo configs for downstream codegen |
| `worker/agents/utils/templateCustomizer.ts` | 315 | New file — pure addition |
| `worker/database/services/GitHubTokenService.ts` | 386 | Self-contained; XChaCha20-Poly1305 via `@noble/ciphers` |
| `worker/database/services/BlueprintCacheService.ts` | 244 | D1 caching wrapper, 7-day TTL |
| `worker/services/blueprint/BlueprintGenerationService.ts` | 573 | Gemini caller via AI Gateway |
| `worker/services/analysis/CodeAnalysisService.ts` | 172 | ts-morph + regex fallback AST parser |
| `worker/services/migration/cloudflare-compatibility-checker.ts` | 712 | Used by analyzer DO — must port together |
| `worker/utils/readmeParser.ts` | 206 | Project-name extraction from README |
| `src/api-types-byop.ts` | 130 | Pure types |
| `src/hooks/use-byop.ts` | 337 | Hooks (repos, import, status, blueprint) |
| `src/routes/import.tsx` | 127 | Route component |
| `src/components/byop/AnalysisProgress.tsx` | 227 | Progress UI |
| `src/components/byop/BlueprintView.tsx` | 453 | Blueprint display |
| `src/components/byop/GitHubRepositoryList.tsx` | 254 | Repo picker |
| `tests/e2e/byop-happy-path.test.ts` | 341 | E2E |
| `tests/integration/controllers/BYOPController.test.ts` | 494 | Integration |
| `tests/unit/services/GitHubTokenService.test.ts` | 304 | Unit |
| `tests/utils/readmeParser.test.ts` | 189 | Unit |
| `tests/helpers/mock-github-api.ts` | 147 | Helper |
| `tests/helpers/websocket-client.ts` | 205 | Helper |
| `tests/fixtures/github-repositories.ts`, `github-tokens.ts`, `mock-blueprints.ts`, `analysis-states.ts`, `index.ts` | ~813 total | Fixtures |
| Docs (docs/ and root) | ~15 files | Pure additions |

### Bucket B — Modified files, surgical merge needed, no Phase D collision

| File | Bishop diff | What's BYOP-specific |
|---|---|---|
| `worker/api/routes/index.ts` | +12 / -0 | 3 lines: `import { setupBYOPRoutes }` and `setupBYOPRoutes(app);`. (The other 9 lines are Stripe imports/setup — **drop those**.) |
| `worker/services/oauth/github.ts` | +12 / -5 | (a) `scopes` adds `'repo'`. (b) `static create()` uses `env.CUSTOM_DOMAIN` for callback domain instead of `baseUrl`. Both are BYOP-required. |
| `worker/database/services/AuthService.ts` | +43 / -1 | One added block (~lines 420–460): after successful GitHub OAuth, instantiate `GitHubTokenService`, store the access token with scopes `['read:user','user:email','repo']`, re-throw on failure as `SecurityError`. Bishop block contains noisy `logger.info('=== ATTEMPTING TO STORE GITHUB TOKEN ===', …)` — strip debug logs on port. |
| `worker/database/schema.ts` | +293 / -0 | Three tables: `githubTokens`, `blueprintCache`, plus `oauthStates` and Stripe tables. **BYOP needs `githubTokens` and `blueprintCache` only** (with `fileContentsR2Key` column). Cherry-pick those two definitions and their type exports. |

### Bucket C — Modified files where bishop's diff **mixes BYOP with non-BYOP 659-commit drift**

These files have small BYOP-specific hunks buried inside massive unrelated rewrites. Do **not** apply bishop's version wholesale. Surgical hand-port only.

| File | Bishop diff | BYOP-relevant hunks (port these only) | Non-BYOP drift in same file (ignore) |
|---|---|---|---|
| `worker/api/controllers/agent/controller.ts` | +170 / -22 | **One ~40-line block:** "BYOP: Fetch imported files from R2 if `body.fileContentsR2Key` and not `body.importedRepository`" (lines ~54–88 in bishop). Constructs `importedRepository` object and threads it into the agent. | Signature change of `getAgentStub` (loses two args); new `AppService.createApp` ownership record; `generateAppTitle`; `getTemplateImportantFiles`; sandboxSessionId removal. These are PR-13/19-era codegen refactors that conflict with our agent layer. |
| `worker/api/controllers/agent/types.ts` | +22 / -1 | Add two fields to `CodeGenArgs`: `fileContentsR2Key?: string`, `repositoryUrl?: string`, `importedRepository?: { fileContents; repositoryName; repositoryUrl; framework; }`. | None — this file is purely additive. |
| `src/lib/api-client.ts` | +250 / -7 | **~55-line BYOP block (lines ~1125–1180):** 5 methods on the `apiClient` class — `listGitHubRepositories`, `importRepository`, `getAnalysisStatus`, `getBlueprint`, `startBuilding`. Plus type imports from `@/api-types-byop`. | Stripe / debug-session / signup / checkout method additions. |
| `src/routes/chat/utils/handle-websocket-message.ts` | +496 / -81 | **Effectively zero BYOP code.** The only `BYOP` string is a comment on line 201 ("Load generated files… includes BYOP imported files"). The branch `if (state.generatedFilesMap … && files.length === 0)` already exists in our main. | All 496/81 lines are unrelated WS protocol divergence. **Skip this file entirely for BYOP recovery.** |
| `worker/agents/core/simpleGeneratorAgent.ts` | +2,117 / -1,285 | The agent has been heavily reworked to consume `importedRepository` from `CodeGenArgs` and seed `generatedFilesMap` from it instead of `templateDetails.allFiles`. But this is interleaved with a 3,400-line rewrite of the whole agent. **Recommendation:** instead of editing `simpleGeneratorAgent`, add a small adapter in our existing `SmartCodeGeneratorAgent` constructor / init path: if `importedRepository.fileContents` is present, prime `generatedFilesMap` with it before phase loop. ~30-line change on our side, isolated from bishop's rewrite. |
| `worker/agents/core/types.ts` | +103 / -5 | One BYOP hunk: comment + optional `importedRepository?: ImportedRepository` field on the agent state (line 24). Plus the `ImportedRepository` interface. | The rest is broader type-system drift. |
| `worker/agents/operations/PhaseGeneration.ts` | +121 / -13 | **One BYOP-specific change:** prompt edit at line 49 adding the "BYOP (Imported Projects) Exception" clause that lets phases modify `tsconfig.json`/`vite.config.*` for imported repos. | Other prompt rewrites are general improvements. |
| `worker/agents/operations/PhaseImplementation.ts` | +70 / -115 | Same — one prompt-text addition at line 248. | Rest is general. |
| `worker/services/sandbox/sandboxSdkClient.ts` | +788 / -650 | **One BYOP-specific section** under the comment `// REPOSITORY CLONING (BYOP FEATURE)`: `cloneGitHubRepository()`, `extractRepositoryName()`, `validateRepositoryUrl()`, the GIT_ASKPASS credential-helper write. Roughly ~250 lines starting around line 2224 in bishop. | The other ~1,200 lines of diff are unrelated container/protocol divergence — **do not merge those**. |

### Special note on `worker/index.ts`

Bishop adds **one import** and **one export**:

```ts
import { CodebaseAnalyzer as BaseCodebaseAnalyzer } from './agents/analyzer/codebaseAnalyzer';
export const CodebaseAnalyzer = BaseCodebaseAnalyzer;
```

Trivially portable. Our main file is structurally identical at the relevant locations.

---

## 4. Database / Migration Impact

### Tables to add

From bishop `worker/database/schema.ts`:

- `githubTokens` (encrypted access token, scopes, status, indexes on `userId`, `isActive`, `lastUsed`).
- `blueprintCache` (cached blueprints by `(repositoryUrl, branch)`, with `fileContentsR2Key` column, `accessCount`, `expiresAt`).
- Both export `$inferSelect` / `$inferInsert` type aliases — port those too.

### Migrations bishop has that we don't

| Migration | Purpose | Port? |
|---|---|---|
| `0004_bumpy_ozymandias.sql` | `CREATE TABLE github_tokens` | **YES** |
| `0005_overconfident_the_captain.sql` | `CREATE TABLE blueprint_cache` | **YES** |
| `0006_wakeful_mongu.sql` | `ALTER TABLE blueprint_cache ADD file_contents_r2_key TEXT` | **YES — squash with 0005** |
| `0007_quiet_trauma.sql` | `CREATE TABLE generated_assets` | No (not BYOP) |
| `0008_condemned_nightmare.sql` | `CREATE TABLE stripe_connect_accounts` etc. | No (not BYOP) |
| `0009_careless_siren.sql` | More Stripe | No |

**Recommendation:** generate a fresh single migration `0004_byop_recovery.sql` from drizzle-kit after adding the two schema tables, rather than copying bishop's split migration files. Cleaner journal, no Stripe leakage.

### Durable Object migration tag — the critical bit

Our `wrangler.jsonc` migration history:

```
v1: new CodeGeneratorAgent, UserAppSandboxService
v2: new DORateLimitStore
v3: new UserSecretsStore + CodebaseAnalyzer    ← declaration only; CF already at v3
v4: deleted CodebaseAnalyzer                   ← Phase A; instances permanently gone
v5: deleted UserSecretsStore                   ← PR #19
```

Bishop's `wrangler.jsonc` knows nothing of v4 or v5: it only goes up to a v3 that declares `CodebaseAnalyzer` as a `new_sqlite_classes`.

**Strategy for recovery:** add a **v6 migration**:

```jsonc
{
  "new_sqlite_classes": ["CodebaseAnalyzer"],
  "tag": "v6"
}
```

And re-add the binding in the `durable_objects.bindings` array with class `CodebaseAnalyzer`, name `CodebaseAnalyzerObject`, `limits.cpu_ms: 300000`. Cloudflare permits re-declaring a previously-deleted class under a new tag — the class will be recreated fresh. **Pre-v4 instances are unrecoverable** (they were already gone, that's why we ran v4 in the first place). Document this explicitly in the wrangler comment block, in the same style as the existing v3/v4/v5 comments.

---

## 5. Dependency Graph for Recovery PR Sequence

Proposed plan validated against actual file deps:

### PR 20a — docs only

Pure addition under `docs/byop/` (or root). Zero code deps. **Safe to land first.**

### PR 20b — types + isolated frontend

- `src/api-types-byop.ts` (no runtime deps)
- `src/components/byop/*.tsx` (depend on api-types-byop only; framer-motion already a dep)
- `src/hooks/use-byop.ts` (depends on `apiClient` — see below ⚠)
- `src/routes/import.tsx` (depends on hooks + components)

⚠ **Dependency violation in current proposed order:** `use-byop.ts` imports `apiClient.listGitHubRepositories()` etc. Those methods don't exist on our `apiClient` until PR 20d adds them. Two options:

1. **Move the api-client BYOP methods into PR 20b** (only ~55 lines + an import). They're additive on our `apiClient` class with no behaviour change.
2. **Defer the frontend route registration** until PR 20e and have 20b ship only the types and isolated components (which don't reference the API).

Recommend option 1: include `src/lib/api-client.ts` BYOP additions in PR 20b. The frontend slice is then self-coherent.

### PR 20c — CodebaseAnalyzer DO + v6 migration

- `worker/agents/analyzer/codebaseAnalyzer.ts` (depends on `CodeAnalysisService` + `BlueprintGenerationService`)
- `worker/services/analysis/CodeAnalysisService.ts`
- `worker/services/blueprint/BlueprintGenerationService.ts` (depends on `cloudflare-compatibility-checker` types only — convert dynamic import in analyzer to static at this stage)
- `worker/services/migration/cloudflare-compatibility-checker.ts`
- `worker/index.ts` (1-line import + 1-line export of `CodebaseAnalyzer`)
- `wrangler.jsonc` (v6 migration + binding)
- Required env: `CF_ACCOUNT_ID`, `CF_AI_GATEWAY_ID`, `GOOGLE_AI_STUDIO_API_KEY` (already declared in our `worker-secrets.d.ts` ✓ — see §6).

Risk: this PR introduces a new DO binding. **Wrangler will deploy the v6 migration on first push.** Pre-merge: confirm staging worker accepts the binding. Do **not** ship 20c without 20d's controller calling into it, or the DO will be live but unused (harmless, but adds dead surface).

**Suggested merge:** combine 20c + 20d into a single backend PR. The DO has no callers without the controller, and the controller can't compile without the DO binding. Splitting them creates an in-between state that doesn't typecheck.

### PR 20d — worker backend (services, controller, routes)

- `worker/database/schema.ts` — add `githubTokens`, `blueprintCache` tables + types
- `migrations/0004_byop_recovery.sql` — fresh drizzle-generated migration
- `worker/database/services/GitHubTokenService.ts`
- `worker/database/services/BlueprintCacheService.ts`
- `worker/database/services/AuthService.ts` — port the OAuth-callback token-storage block
- `worker/services/oauth/github.ts` — add `repo` scope + `CUSTOM_DOMAIN` callback
- `worker/services/sandbox/sandboxSdkClient.ts` — port `cloneGitHubRepository` + helpers (extract the ~250-line block; do NOT take bishop's full file)
- `worker/agents/utils/byopConfigNormalizers.ts`
- `worker/agents/utils/templateCustomizer.ts`
- `worker/utils/readmeParser.ts`
- `worker/api/controllers/byop/controller.ts`
- `worker/api/routes/byopRoutes.ts` + 3-line registration in `worker/api/routes/index.ts`
- `worker/api/controllers/agent/types.ts` — 22 lines additive
- `worker/api/controllers/agent/controller.ts` — port the ~40-line R2-fetch block only
- `worker/agents/core/types.ts` — add `ImportedRepository` type + optional state field
- `worker/agents/operations/PhaseGeneration.ts`, `PhaseImplementation.ts` — prompt text additions only
- A small adapter on `SmartCodeGeneratorAgent` to seed `generatedFilesMap` from `importedRepository.fileContents` (do NOT take bishop's `simpleGeneratorAgent.ts` wholesale)

### PR 20e — frontend route + tests

If PR 20b already ships the components, 20e only adds:

- Route registration (`routes.ts` or equivalent router)
- Tests (`tests/e2e/byop-happy-path.test.ts`, `tests/integration/controllers/BYOPController.test.ts`, `tests/unit/services/GitHubTokenService.test.ts`, fixtures, helpers)

---

## 6. Conflicts with Our Phase D Work

### PR #14 — env types split (`worker-secrets.d.ts`)

`worker-secrets.d.ts` currently declares: `GOOGLE_AI_STUDIO_API_KEY`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_AI_GATEWAY_URL`, `CLOUDFLARE_AI_GATEWAY_TOKEN`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SECRETS_ENCRYPTION_KEY`. **All BYOP secrets are already declared.**

Bishop's `worker/agents/analyzer/codebaseAnalyzer.ts` and `BlueprintGenerationService.ts` use `env.CF_ACCOUNT_ID` and `env.CF_AI_GATEWAY_ID` (not the longer `CLOUDFLARE_*` names). Decide on canonical name during port. Likely add **aliases** to `worker-secrets.d.ts` (`CF_ACCOUNT_ID: string; CF_AI_GATEWAY_ID: string;`) since bishop's commit `eae19ad` deliberately added those as production secrets.

**Action:** PR 20d adds `CF_ACCOUNT_ID` and `CF_AI_GATEWAY_ID` to `worker-secrets.d.ts`.

### PR #15 — AI Gateway proxy origin gate at `/api/proxy/openai`

BYOP **does not touch** `/api/proxy/openai`. It calls Google AI Studio via the AI Gateway directly from inside the analyzer DO (`https://gateway.ai.cloudflare.com/v1/.../google-ai-studio/...`), not through our worker's `/api/proxy/*` path. No conflict.

### PR #19 — UserSecretsStore deleted via v5 migration

`GitHubTokenService` uses **D1 + `@noble/ciphers`** with `SECRETS_ENCRYPTION_KEY`. It does **not** depend on `UserSecretsStore`. Verified by grep across `worker/api/controllers/byop/`, `worker/agents/analyzer/`, `worker/database/services/GitHubTokenService.ts`, `worker/database/services/BlueprintCacheService.ts` — zero references to `UserSecretsStore`. Safe.

### Marketing routing in `worker/index.ts` and `wrangler.jsonc`

Bishop's `worker/index.ts` has its own landing-page routing logic (lines ~160–180: `getdreamforge.com` → landing assets, `app.getdreamforge.com` → app). This is a **different design from ours** and far broader than BYOP. **Our routing wins.** BYOP recovery touches `worker/index.ts` for two lines only (`CodebaseAnalyzer` import + export).

---

## 7. Risks & Open Questions

1. **`cloudflare-compatibility-checker.ts` is a 712-line non-BYOP-named dependency.** It's loaded via dynamic `await import()` from inside the analyzer DO at the start of analysis. The whole compat-checker module needs to ship in PR 20c, and the dynamic import must be converted to a static `import` (CLAUDE.md mandate). Verify the module's own deps are clean (no further cycles back into bishop-specific code).

2. **Sandbox container clone path** (`cloneGitHubRepository`) depends on `safeSandboxExec`, `getDefaultSession`, `extractRepositoryName`, `validateRepositoryUrl`. These helpers exist in bishop's `sandboxSdkClient.ts`; some may already exist in ours (the file has +788/-650 churn). Plan to write a **small extraction patch** that drops just the BYOP-clone block plus any missing helpers onto our current file; resist the temptation to take bishop's whole sandbox client.

3. **`importedRepository` flow into `SmartCodeGeneratorAgent`.** Bishop's `simpleGeneratorAgent` is a 3,400-line rewrite, not a delta. The minimum BYOP wiring is: when the agent boots and `args.importedRepository?.fileContents` is set, populate `generatedFilesMap` from it and skip the template-files copy. Confirm this is the only behavioural delta needed — review bishop's diff for any other reads of `importedRepository` (search confirms it's referenced in `PhaseGeneration`, `PhaseImplementation`, agent state migration, and a few prompt assembly helpers).

4. **`AppService.createApp(...)` in bishop's agent controller** — this is part of an "ownership validation" change that runs independent of BYOP. Our current agent controller does not create an app DB record on init. BYOP's "start building" call expects an app record to exist for the agent. **Open question:** does our flow create an app record elsewhere, or do we need to backfill `appService.createApp(...)` as a non-BYOP prerequisite? Verify in PR 20d planning.

5. **GitHub OAuth callback domain change.** Bishop forces `env.CUSTOM_DOMAIN` for the redirect_uri. Our current `app.getdreamforge.com` setup already serves auth on `CUSTOM_DOMAIN`; the change should be inert. But: confirm our GitHub OAuth app only has `https://app.getdreamforge.com/api/auth/callback/github` configured. If a second callback URI exists (e.g. for the landing domain), removing it from code without removing it from the OAuth app config is fine; the reverse is breaking.

6. **PBKDF2 iteration count in production.** Bishop commit `3723c5c` reduced iterations to comply with Workers CPU limits. The current `GitHubTokenService.ts` reflects the reduced value. Don't bump it back up during the port "for security" — it'll break on production CPU budgets.

7. **`d4f74d5` ("resolve sandbox preview errors causing deployment failures") was the very last commit and has no follow-up.** We can't tell from history whether the fix held. Plan a smoke test of full end-to-end import → analyze → blueprint → start-building → preview in staging before declaring 20d/20e green.

8. **Tests are bishop-generated** and our CLAUDE.md says all current tests need replacement. Treat the ported BYOP tests as scaffolding, not as a quality bar. Plan a follow-up test-rewrite pass after PR 20e lands.

---

## 8. Estimated Effort Per PR

| PR | Files | Approx LoC (added) | Risk |
|---|---|---|---|
| **20a — docs** | ~15 markdown files | ~5,000 | **Low** — docs only |
| **20b — types + frontend + api-client** | 7 files (`api-types-byop.ts`, `use-byop.ts`, 3× component, `import.tsx`, `api-client.ts` additions) | ~1,560 | **Low** — additive, no runtime risk without backend |
| **20c — Analyzer DO + v6 migration** | 6 (analyzer DO, 2 services, compat-checker, wrangler, worker/index) | ~2,150 + wrangler edits | **High** — new DO binding, requires v6 migration, needs production verification of `CF_ACCOUNT_ID`/`CF_AI_GATEWAY_ID` secrets. **Recommend merging with 20d.** |
| **20d — Worker backend** | ~14 (controller, routes, schema, 3× services, OAuth, sandbox clone slice, agent types, agent controller hunk, normalisers, templateCustomizer, readmeParser, prompt edits) | ~4,500 (mostly the 1,248-line normalisers + 909-line controller) | **High** — touches AuthService, OAuth callback, sandbox, agent types. Conflicts with our agent controller; requires surgical hunk-port, not file-copy. |
| **20e — Tests + route registration** | ~10 (tests + fixtures + helpers + routes.ts) | ~2,000 | **Medium** — tests are bishop-AI-generated; treat as scaffolding |
| **Total** | ~52 source files + 15 docs | ~15,200 LoC | — |

**Recommended sequencing:** 20a → 20b → (20c + 20d combined) → 20e. Combine 20c and 20d to avoid a typecheck-broken intermediate state where the DO exists with no caller and the controller imports a DO type that doesn't compile.

---

## Appendix: Bishop file inventory cross-reference

`BYOP_FEATURE_COMPLETE.md` in bishop lists 11 backend files + 7 frontend files + 2 config files + 3 docs as the canonical BYOP surface ("23 new/modified files, ~3,500 lines"). This audit found **substantially more** than that — the bishop count omits `byopConfigNormalizers.ts` (1,248 lines), `templateCustomizer.ts` (315), `cloudflare-compatibility-checker.ts` (712), `readmeParser.ts` (206), tests (~2,000), and frontend dependencies on `apiClient` modifications. The 3,500-LoC figure is an underestimate by roughly 4x.
