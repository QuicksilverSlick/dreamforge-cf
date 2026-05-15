# Phase E Upstream Sync — PR 2 Per-File Merge Survey

**Date**: 2026-05-15
**Branch baseline**: `origin/main` @ `69fbf6f` (post PR #25 / Phase E PR 1)
**Upstream**: `upstream/main` @ `a632039` (`cloudflare/vibesdk`)
**Scope**: PR 2 of the Phase E upstream-sync plan — wrangler / config / build / scripts / container surface.

This document is read-only analysis. No files were modified in producing it. Recommendations defer to `CLAUDE.md` and the prior phase-E PRs.

---

## File 1: `wrangler.jsonc`

### Local state
Exists. Core deployment manifest. Carries massive local customization:
- `name: "dreamforge-cf"` (not upstream's `vibesdk-production`)
- D1 ID `0d8d35e2-91e1-4231-90b1-f49cc313876c`, KV ID `7fc3452e180a4a8997c52346f41685d1` (our account's IDs)
- Migration chain **v1 → v6** with extensive in-file comments documenting the `CodebaseAnalyzer` / `UserSecretsStore` lifecycle (delete-then-resurrect saga). v6 is the live tag.
- `CodebaseAnalyzerObject` binding (PR 20d) with `cpu_ms: 300000` limit.
- Three custom-domain routes: `getdreamforge.com`, `www.getdreamforge.com`, `app.getdreamforge.com` + wildcard `*app.getdreamforge.com/*` on our zone `157d05cb...`.
- `CUSTOM_DOMAIN: app.getdreamforge.com`, `CUSTOM_PREVIEW_DOMAIN: app.getdreamforge.com`.
- `USE_CLOUDFLARE_IMAGES: false` var.
- `max_instances: 10`, `instance_type: "standard-3"` (string form).

### Upstream state
Existing file, materially diverged. Adopts:
- Worker name `vibesdk-production`
- Object-form `instance_type` (`{vcpu, memory_mib, disk_mb}`)
- `max_instances: 1400` and `ssh.enabled: true` on container binding
- Adds `observability.logs` and `observability.traces` blocks
- New DO binding `UserSecretsStore` (the very class we just buried in v5!)
- `migrations` collapsed to v1–v3 only (no v4/v5/v6)
- Adds `routes` for `build.cloudflare.dev` + `*build-preview.cloudflare.dev/*` on upstream zone
- New `PLATFORM_CAPABILITIES` JSON var with `features.app/presentation/general`

### Diff size
`147 lines (+71 / -76)` per `--shortstat`.

### Conflict surface
- **PRESERVE-OURS**: worker name, D1 ID, KV ID, route block (all 3 domains + wildcard), `CodebaseAnalyzerObject` binding, the entire v1–v6 migration sequence and its comments, `CUSTOM_DOMAIN` values.
- **SURGICAL-MERGE**:
  - `instance_type` object form — adopting upstream's structured form is a real config improvement but **only** if `MAX_SANDBOX_INSTANCES` / `SANDBOX_INSTANCE_TYPE` vars still override at runtime per the wrangler comment.
  - `observability.logs` + `observability.traces` — pure additive observability, safe to take.
  - `ssh.enabled: true` on container — quality-of-life for debugging sandboxes; adopt.
  - `max_instances: 1400` — this is a static cap that the `MAX_SANDBOX_INSTANCES` var overrides; safe to bump to keep header room for var-driven scaling.
- **DECISION-NEEDED**:
  - **`PLATFORM_CAPABILITIES`**: does Dreamforge want the new feature-flag JSON? Worker code likely now reads `env.PLATFORM_CAPABILITIES.features.app.enabled`. Need to check worker source before adopting.
  - **`UserSecretsStore` resurrection**: upstream re-adds it as an active DO. We just permanently deleted it in v5. If upstream now uses it for secrets-by-DO again (vs. our D1-based `SecretsService`), this is a real fork. Recommend skipping unless we plan to switch back to DO secrets.
- **TAKE-AS-IS**: nothing material — most of upstream's changes here either conflict with our customizations or need decision input.

### Recommendation
**selective-merge** — adopt observability/SSH/structured-instance-type additively; preserve name/domains/migrations/IDs absolutely; flag PLATFORM_CAPABILITIES and UserSecretsStore as decision-blockers.

### Estimated effort
**medium** (30–90 min, requires care). The migration history is non-negotiable; one wrong line invalidates the entire prod DO state.

---

## File 2: `worker-configuration.d.ts`

### Local state
Exists. **Auto-generated** by `wrangler types --include-runtime false`. Reflects our current bindings (`CodebaseAnalyzer` DO, our domain-string types, etc.). Hash in header `f086aed4...`.

### Upstream state
Different generated output. Hash `a642a922...`. Reflects upstream's bindings: no `CodebaseAnalyzerObject`, has `UserSecretsStore`, has the `PLATFORM_CAPABILITIES` literal-typed var, plus many secret-env declarations that upstream apparently inlines into types.

### Diff size
`71 lines (+47 / -22)`.

### Conflict surface
N/A — this file is never hand-edited. It regenerates from `wrangler.jsonc` via `npm run cf-typegen`. Per CLAUDE.md & the PR-14 split note, our flow keeps **`worker-secrets.d.ts`** as a separate file for hand-typed secrets; the generated file should match only the wrangler.jsonc reality.

### Recommendation
**skip-this-PR** — do not merge upstream's version. Regenerate ours via `npm run cf-typegen` after `wrangler.jsonc` lands. The PR review should explicitly verify regeneration was run and the diff matches the new bindings only.

### Estimated effort
**small** — single command after wrangler.jsonc settles.

---

## File 3: `package.json`

### Local state
Exists. Local customizations:
- The `vite: "npm:rolldown-vite@^7.1.13"` devDep **and** the matching `overrides.vite: "npm:rolldown-vite@^7.1.13"` (PR 14). Both must stay aligned.
- `overrides["@cloudflare/containers"]: "^0.0.28"`.
- `build` script chains `tsc -b → vite build → tsx scripts/copy-landing-pages.ts` — the trailing call is **required** to ship marketing landing pages.
- Local-only deps in line: keeps `dotenv`, `node-fetch`, `chalk`, `glob`, `prettier`, `ts-jest`, `@vitejs/plugin-react-swc`, `@vitejs/plugin-react-oxc`, `@types/node`, `@typescript-eslint/eslint-plugin/parser/typescript-estree`, `@sentry/vite-plugin`, `agents@0.1.6`, `vite-plugin-monaco-editor`, `vite-plugin-node-polyfills`, `perfect-arrows`, `suffix-array`.
- `"name": "vibesdk"`, `"version": "0.0.0"`.

### Upstream state
Existing, heavily evolved:
- Version bumped to `1.5.0`
- Adds `husky` (`prepare` script)
- Adds CLI/TUI tooling: `cli` & `tui` scripts, plus ink/inquirer deps and `cli/` directory
- Adds `typecheck` script (tsc --noEmit)
- Adds `test:integration`, `test:bun`, `test:bun:watch` scripts
- Drops `scripts/copy-landing-pages.ts` from `build`
- Many dep version bumps (sandbox `0.1.3 → 0.5.6`, agents `0.1.6 → 0.2.32`, framer/react-router/etc.)
- New deps: `acorn`, `@babel/parser/generator/traverse/types`, `@simplewebauthn/browser`, `cli-table3`, `cross-spawn`, `fflate`, `hash-wasm`, `htmlparser2`, `ink-*`, `inquirer`, `nanoid`, `ora`, `mdast-util-to-string`, `remark-parse`, `rolldown-vite` (as dep, not just override), `unified`, `ws`, `@ashishkumar472/cf-git`, `@types/argon2-browser`, `@types/mdast`, `@cloudflare/workers-types`, `@vitest/coverage-v8`
- Drops: `dotenv`, `chalk`, `node-fetch`, `@octokit/rest` change, `@typescript-eslint/eslint-plugin` (subsumed by `typescript-eslint` meta), `@vitejs/plugin-react-oxc`, `@vitejs/plugin-react-swc`, `@types/node`, `agents@0.1.6`, `glob`, `perfect-arrows`, `suffix-array`, `vite-plugin-monaco-editor`, `vite-plugin-node-polyfills`, `prettier`, `ts-jest`, `@sentry/vite-plugin`
- `overrides.vite: "npm:rolldown-vite@latest"` (we hard-pin `^7.1.13`)
- Pins `vite: "npm:rolldown-vite@7.1.13"` (exact) in devDeps, `wrangler: 4.90.0` (we have 4.90.1)

### Diff size
`146 lines (+78 / -68)`.

### Conflict surface
- **PRESERVE-OURS**: `build` script (must keep `copy-landing-pages.ts` call), `name`, version (keep `0.0.0` or bump independently — do not adopt `1.5.0` mid-cycle), the `overrides.vite` pinned to `^7.1.13` (not `latest`), the `overrides["@cloudflare/containers"]` value.
- **SURGICAL-MERGE**:
  - **Dep version bumps**: most are safe to take (Radix patches, Sentry, framer, openai, drizzle-orm). Several need verification: `@cloudflare/sandbox 0.1.3 → 0.5.6` is a **major** version jump and is tied to the `SandboxDockerfile` `FROM` line; these MUST land together. `agents 0.1.6 → 0.2.32` is also major. `esbuild 0.25 → 0.27` is major.
  - `typecheck` script — pure add, take it.
  - `prepare: husky` — only useful if we want husky hooks; recommend **skip** unless we adopt their commitlint flow too (we do not on this PR).
- **DECISION-NEEDED**:
  - **CLI/TUI tooling**: adds `cli/` directory + 7+ deps (ink-*, inquirer, cli-table3, ora, cross-spawn, @ashishkumar472/cf-git). Big surface. If we don't ship the CLI feature, skip all of these deps. If we do, this is its own PR.
  - **`@babel/*` + `acorn` deps**: implies upstream now does AST-based code analysis in the worker (CodebaseAnalyzer-ish behaviour?). Need to know which worker code wants these before pulling them in.
  - **`@simplewebauthn/browser` + `@types/argon2-browser` + `hash-wasm`**: upstream added WebAuthn / password-hashing client flow. Out of scope for PR 2 (auth surface is owned by Phase D/E auth PRs).
  - **`overrides.vite: "latest"` vs pinned**: upstream's "latest" is dangerous for reproducible builds; keep our `^7.1.13` pin.
- **TAKE-AS-IS**: minor Radix bumps, drizzle-orm `0.44.5 → 0.44.7`, eslint plugins minor bumps, tsx, typescript, tailwindcss minor bumps.

### Recommendation
**selective-merge** — but cleaved into two sub-merges (see sequencing below). The dep churn is large enough that this file alone justifies its own sub-PR.

### Estimated effort
**large** (>90 min — dep audit, bun lock regen, smoke build, verify rolldown-vite pin still satisfied, verify deploy build still produces landing pages).

---

## File 4: `bun.lock`

### Local state
Exists. Lockfile artifact.

### Upstream state
Exists, diverged.

### Diff size
Captured in the 9-file shortstat (1079+/1717-). Don't read it.

### Conflict surface
N/A — regenerated. The merge plan must just delete the local lockfile and run `bun install` after `package.json` lands.

### Recommendation
**take-wholesale** by regeneration. Never hand-merge a lockfile.

### Estimated effort
**small** — one `bun install` command + a sanity build.

---

## File 5: `eslint.config.js`

### Local state
Exists. PR 13 customization: `@typescript-eslint/no-unused-expressions: ['error', { allowTaggedTemplates: true }]` (for the Workers SQL DO ``this.sql`...` `` tagged-template pattern). 6 pre-existing `react-refresh/only-export-components` warnings are baseline-acceptable.

### Upstream state
Exists. Adds:
- `cf-git/**` to the global `ignores` array
- Two new file-scoped overrides that disable `react-refresh/only-export-components`:
  - `src/contexts/**/*.{ts,tsx}` + `src/features/**/*.{ts,tsx}`
  - `src/components/auth/**/*.{ts,tsx}`
- **Removes** our `@typescript-eslint/no-unused-expressions` override

### Diff size
`32 lines (+24 / -8)`.

### Conflict surface
- **PRESERVE-OURS**: the `no-unused-expressions` rule with `allowTaggedTemplates: true`. Removing it will break the SQL DO pattern wholesale (per the comment in our config: linter would flag every `this.sql`...` ` as unused).
- **TAKE-AS-IS**: `cf-git/**` ignore (cheap, future-compatible with the cli-feature merge if we ever take it).
- **SURGICAL-MERGE**: the two file-scoped `react-refresh` overrides — these would **silence the existing 6 baseline warnings** but only in those specific directories. Taking them is a behaviour change: the rule still warns elsewhere, but no longer for contexts/features/auth-modal. Acceptable, but call it out in the PR description.

### Recommendation
**selective-merge**. Take ignores + file-scoped overrides; keep the `no-unused-expressions` rule.

### Estimated effort
**small**.

---

## File 6: `tsconfig.worker.json`

### Local state
Exists. PR 14 customization: `types` array includes `./worker-secrets.d.ts` between `worker-configuration.d.ts` and `vite/client`. `include` array has `./worker-secrets.d.ts` as well. This is the **split between generated bindings types and hand-typed secrets** that we deliberately introduced.

### Upstream state
Exists. Removes `worker-secrets.d.ts` from both arrays. Adds `@cloudflare/workers-types` to `types`. Adds `./worker/types` to `include`. Adds an `exclude` for tests.

### Diff size
`5 lines (+3 / -2)`.

### Conflict surface
- **PRESERVE-OURS**: both `worker-secrets.d.ts` entries (in `types` AND in `include`).
- **DECISION-NEEDED**: `@cloudflare/workers-types` in `types` — this is *also* added to upstream's `package.json` as a new devDep. The generated `worker-configuration.d.ts` already provides these types via wrangler's `--include-runtime false` mechanism, so adding `@cloudflare/workers-types` may **double-declare** the same ambient types, which can break type resolution. Need to verify there's no conflict.
- **TAKE-AS-IS**: `./worker/types` in `include` (only if such a directory exists or gets added — verify); the `exclude` block is a tidy-up that's safe.

### Recommendation
**selective-merge**. Keep our PR-14 secrets-split, optionally add `./worker/types` include if the directory exists post-merge, leave `@cloudflare/workers-types` out unless adopted as a deliberate decision.

### Estimated effort
**small**.

---

## File 7: `.gitignore`

### Local state
Exists. Custom entries:
- `# Claude Code worktrees and local settings` → `.claude/worktrees/` + `.claude/settings.local.json`
- `# Local-only review folder used during landing-page comparison` → `landing-previews/`
- `# Development artifacts (root directory only)` → `/*.PNG`, `/*.png`, `screencapture-*.png`, `SANDBOX_*.md`, `deploy*.log`

### Upstream state
Exists. Adds: `*.tsbuildinfo`, `debug-tools/extracted`, `debug-tools/presentation-tester`, `.test-data`, `cli`. Drops nothing meaningful but the formatting is messier (leading spaces on `dist-ssr` / `.tmp` look like an editor mishap upstream).

### Diff size
`23 lines (+7 / -16)`.

### Conflict surface
- **PRESERVE-OURS**: every local entry listed above.
- **TAKE-AS-IS**: `*.tsbuildinfo` (incremental tsc output, definitely should be ignored), `.test-data`.
- **DECISION-NEEDED**: `cli` — only relevant if we adopt the upstream CLI tooling (which I recommend deferring); if we skip, this entry is harmless but unused.
- **SKIP**: the leading-whitespace formatting regression on `dist-ssr` / `.tmp`.

### Recommendation
**selective-merge**. Pure additive — append the upstream additions to our existing file, don't reformat.

### Estimated effort
**small**.

---

## File 8: `vite.config.ts`

### Local state
Exists. Carries `experimental: { remoteBindings: true }` on the cloudflare plugin call. Carries `build: { sourcemap: true }`. Has commented-out node-polyfills + sentry plugin scaffolding. Multiple commented-out alias entries.

### Upstream state
Exists. Removes `experimental.remoteBindings`, removes the `sourcemap: true` build block, cleans up commented-out lines, tidies whitespace on alias entries.

### Diff size
`26 lines (+5 / -21)`.

### Conflict surface
- **DECISION-NEEDED**: `experimental.remoteBindings: true` — this is the flag enabling remote bindings during `wrangler dev`. If we still use that flow, **preserve it**. If we've moved to fully-local dev via `npm run local`, dropping it is fine.
- **DECISION-NEEDED**: `build.sourcemap: true` — production sourcemaps. If we want Sentry source-map upload to actually work, keep it. Otherwise upstream's removal is cleaner.
- **TAKE-AS-IS**: comment cleanup and alias formatting tidy.

### Recommendation
**selective-merge** — decision-gated on remoteBindings + sourcemap. Cosmetic cleanup otherwise.

### Estimated effort
**small**.

---

## File 9: `vitest.config.ts`

### Local state
Exists. Simple config: `pool` defaults, `setupFiles: ['./test/setup.ts']`, basic exclude list (`worker/api/routes/**`).

### Upstream state
Exists. Much bigger:
- Adds `resolve.alias['bun:test'] = 'vitest'` (lets bun-test source files run on vitest)
- Adds `test.deps.optimizer.ssr` with includes for `@cloudflare/containers`, `@cloudflare/sandbox`, `@babel/traverse`, `@babel/types`
- Adds `main: './test/worker-entry.ts'` to pool workers
- Removes `setupFiles: ['./test/setup.ts']`
- Drops `**/test/**` from exclude (would let entry/setup files run), adds `**/test/worker-entry.ts`, `**/container/monitor-cli.test.ts`, `**/cf-git/**`, `**/sdk/test/**`, plus conditional `**/sdk/test/integration/**`
- Reads env var `VIBESDK_RUN_INTEGRATION_TESTS`

### Diff size
`37 lines (+24 / -13)`.

### Conflict surface
- **DECISION-NEEDED**: upstream relies on file paths that don't exist in our tree (`./test/worker-entry.ts`, `sdk/test/`, `cf-git/`). Taking the config as-is would point vitest at missing files. Whatever subset we take must match what we actually have.
- **PRESERVE-OURS**: `setupFiles: ['./test/setup.ts']` if our test/setup.ts still exists (verify; per CLAUDE.md tests are flagged as "all AI-generated, needs rewrite" — this whole layer may get torn down anyway).
- **DECISION-NEEDED**: `bun:test → vitest` alias — only useful if we have any bun-test source files. Default-skip unless we do.

### Recommendation
**skip-this-PR** for vitest.config.ts. Test infra is flagged for replacement in CLAUDE.md; do not deepen the upstream-test-shape dependency until the auth/test rewrite happens. Revisit in a later PR alongside the test rewrite.

### Estimated effort
**small** (the decision itself), but the work it represents is deferred.

---

## File 10: `scripts/deploy.ts`

### Local state
Exists. Branded "Dreamforge" throughout (banner, log messages, comments). Some logic divergence from upstream around the AI Gateway token, secrets, and conflict resolution.

### Upstream state
Exists. Diverged on:
- All branding strings flipped back to "Cloudflare Orange Build"
- Adds `ssh?: { enabled: boolean }` to the `WranglerConfig` interface (matches the wrangler.jsonc SSH addition)
- Better env-var inheritance for the templates-deploy subprocess: replaces `...process.env` with an explicit allow-list (`PATH`, `HOME`, `CI`, `GITHUB_WORKSPACE`, etc.) — **security improvement worth taking**
- CI-aware AI-Gateway-token logging (suppresses the token in CI=true)
- Expands the prod-vars list: adds `SECRETS_ENCRYPTION_KEY`, `SENTRY_DSN`, `AI_PROXY_JWT_SECRET`, `CUSTOM_DOMAIN`, `CUSTOM_PREVIEW_DOMAIN`, `SANDBOX_INSTANCE_TYPE`, `DISPATCH_NAMESPACE`, `ALLOCATION_STRATEGY`, `ENVIRONMENT`, `PLATFORM_MODEL_PROVIDERS`, `USE_CLOUDFLARE_IMAGES`
- Moves `createProdVarsFile()` call earlier in the orchestration
- AI Gateway default name reverts to `orange-build-gateway`

### Diff size
`70 lines (+50 / -20)`.

### Conflict surface
- **PRESERVE-OURS**: every "Dreamforge" branding string, the AI Gateway default `dreamforge-gateway`, the dispatch-namespace default `dreamforge-default-namespace`.
- **TAKE-AS-IS**: SSH interface addition (paired with wrangler.jsonc), CI-aware token logging, expanded prod-vars list (all those env names are real config vars that should be propagated).
- **SURGICAL-MERGE**: env-var inheritance allow-list — this is a meaningful security and reproducibility improvement (prevents leaking arbitrary env into the subprocess). Take the mechanism but verify the allow-list covers everything our deploy depends on (esp. our custom `DREAMFORGE_*` vars if any).
- **SURGICAL-MERGE**: the `createProdVarsFile()` ordering change — minor; verify it doesn't break our deploy flow.

### Recommendation
**selective-merge**. Branding stays ours; structural improvements take.

### Estimated effort
**medium**.

---

## File 11: `scripts/setup.ts`

### Local state
Exists. Includes a banner typo "VibSDK" (sic — `setup.ts:60`) and friendly closer "Happy coding with VibSDK!". Token-permissions check is the shorter (older) implementation.

### Upstream state
Exists. Branding fixed to "VibeSDK" (note: upstream uses VibeSDK not Dreamforge here — we may want to flip both spellings to "Dreamforge" as a follow-up). Materially improves:
- Uses existing configured AI-Gateway token from devVars if present
- Falls back to main API token if it has AI-Gateway access (skips unnecessary specialized-token creation)
- Better fallback behaviour on token-creation failure (warns and continues with main token)
- Far more thorough `checkTokenPermissions()`: verifies token is `active`, lists matching permission groups, tests the AI-Gateway API for `200 / 403 / 404` to definitively classify access

### Diff size
`122 lines (+103 / -19)`.

### Conflict surface
- **PRESERVE-OURS**: any "Dreamforge" branding strings (the current local file is half-branded — already an inconsistency we may want to clean up).
- **TAKE-AS-IS**: the entire token-permissions logic. The new flow is strictly better — handles cached tokens, fewer wasteful API calls, clearer diagnostics.
- **DECISION-NEEDED**: should we flip "VibSDK"/"VibeSDK" → "Dreamforge" throughout setup.ts as part of this merge? If yes, do it; if no, accept upstream's spelling fix but flag this as tech debt.

### Recommendation
**take-wholesale** on the logic, with a search-and-replace pass on the branding strings.

### Estimated effort
**medium**.

---

## File 12: `scripts/undeploy.ts`

### Local state
Exists. Pure branding fork — "Dreamforge" throughout the banner and completion messages.

### Upstream state
Exists. Branding "Cloudflare Orange Build" / "Orange Build".

### Diff size
`12 lines (+6 / -6)` — purely cosmetic.

### Conflict surface
- **PRESERVE-OURS**: every branding string.

### Recommendation
**skip-this-PR** — no functional change from upstream worth merging. Keep ours as-is.

### Estimated effort
**small (already done — no work).**

---

## File 12b: `scripts/copy-landing-pages.ts` (local-only, upstream-absent)

### Local state
Exists, **local-only** (introduced in PR #7 / #12). Post-build step that copies `worker/static/landing-pages/{,dream-builder/}{index.html,styles.css,script.js}` into `dist/client/marketing/` so the worker's `env.ASSETS.fetch('/marketing/...')` can serve them. Required for the `getdreamforge.com` and `www.getdreamforge.com` marketing routes to function.

### Upstream state
**Deleted upstream** (does not exist in `upstream/main`).

### Diff size
`55 lines deleted` if we take upstream wholesale.

### Conflict surface
- **PRESERVE-OURS**: keep the entire file. Deleting it breaks the live marketing pages on prod.
- **PRESERVE-OURS**: keep the `tsx scripts/copy-landing-pages.ts` call in `package.json`'s `build` script.

### Recommendation
**skip-this-PR** (i.e. do not adopt upstream's deletion). Out of scope.

### Estimated effort
**small (no work).**

---

## File 13: `SandboxDockerfile`

### Local state
Exists. `FROM docker.io/cloudflare/sandbox:0.1.3`. Workdir layout uses `/app/container/`, `/app/data/`. Has the package-cache pre-warm step (`BUN_INSTALL_CACHE_DIR=/app/container/packages-cache`). Runs `CMD ["bun", "index.ts"]`. Tightly coupled to local `container/*.ts` files.

### Upstream state
Exists. Major changes:
- `FROM docker.io/cloudflare/sandbox:0.5.6` — **major version bump on the base image**, paired with the `@cloudflare/sandbox@0.5.6` npm bump
- Workdir layout migrated to `/workspace/container/`, `/workspace/data/`
- Adds explicit `bunx tsc --version` smoke step
- Adds symlink for `bunx`
- **Comments out** the packages-cache pre-warm (potentially regression for cold-start template installs)
- Adds `WORKDIR /container-server` final reset
- `CMD ["./startup.sh"]` instead of `["bun", "index.ts"]` — implies upstream now bundles a startup script in the base image at `/container-server/startup.sh`

### Diff size
`42 lines (+22 / -20)`.

### Conflict surface
- **DECISION-NEEDED**: the sandbox base-image major bump (`0.1.3 → 0.5.6`) is a cross-cutting decision that affects: (a) `package.json` `@cloudflare/sandbox` dep, (b) `package.json` `overrides`, (c) this Dockerfile's `FROM`, (d) every `container/*.ts` that depends on sandbox-image filesystem layout, (e) the `CMD` mechanism (startup.sh vs `bun index.ts`). All five must move together or none should.
- **DECISION-NEEDED**: packages-cache pre-warm: keeping it speeds up sandbox boot for template installs; upstream commented it out (regression?). Recommend keeping it active.
- **SURGICAL-MERGE**: workdir flip `/app/ → /workspace/` is necessary if we adopt the new base image but cosmetic if we keep the old one.

### Recommendation
**needs-decision**. The sandbox image bump is the single biggest decision in PR 2. If yes, it should be its own sub-PR with explicit testing of code-generation flows end-to-end in a staging env. If no, keep everything at 0.1.3.

### Estimated effort
**large** (>90 min, plus runner-service integration testing).

---

## File 14: `container/*.ts` (multi-file)

### Files in scope and current state
Per `git ls-tree`:
- `container/bun-sqlite.d.ts` — **identical to upstream** (same blob hash `053c25a4`). Skip.
- `container/cli-tools.ts` — local diverged. **290 line diff.**
- `container/example-usage.sh` — **identical to upstream**. Skip.
- `container/package.json` — **identical to upstream**. Skip.
- `container/packages-cache/bun.lock` + `package.json` — **identical to upstream**. Skip.
- `container/process-monitor.ts` — **974 line diff**. Huge upstream rewrite.
- `container/storage.ts` — **62 line diff**.
- `container/types.ts` — **52 line diff**.
- `container/monitor-cli.test.ts` (upstream-only, **+3052 lines**) and `container/monitor-cli.test.ts.bak` (upstream-only, **+2645 lines**) — pure additions.

### Local state characterization
The local `container/*.ts` set hasn't been touched since the initial commit `0b375ef` ("Initial commit: Dreamforge"). It's a snapshot of what upstream looked like 5+ months ago. No local features were added on top. So the divergence here is **purely upstream-evolution**, not a fork.

### Upstream state characterization
Major rewrite of `process-monitor.ts` (+974 lines). New schemas/fields (`expectedPort` for port-based health checks). Removed features (`enableMetrics`, `restarting` state). Adjusted defaults (`maxRestarts 6→3`, `errorBufferSize 300→100`, `healthCheckInterval 10000→30000`). Removed the `getCliToolsPath()` runtime path-resolver entirely. Two new gigantic test files.

### Conflict surface
- **TAKE-AS-IS**: identical-blob files (bun-sqlite.d.ts, example-usage.sh, package.json, packages-cache).
- **TAKE-AS-IS** (effectively): cli-tools.ts, process-monitor.ts, storage.ts, types.ts — these have no local customizations to preserve. We can adopt upstream wholesale here, *provided* we also adopt the matching sandbox-image version (or verify the new code still runs on the old base image).
- **DECISION-NEEDED**: monitor-cli.test.ts + monitor-cli.test.ts.bak — 5697 lines of test code. The `.bak` file is upstream's slip-up (a backup file checked into the repo) and should NOT be brought in. The `.test.ts` should be excluded from vitest (upstream's vitest.config.ts excludes it anyway) but kept for use under `bun test`. Recommend: take the `.test.ts`, skip the `.bak`.

### Recommendation
**take-wholesale on the 4 diverged source files** + monitor-cli.test.ts, **gated on** the `@cloudflare/sandbox` version decision (since these files are tightly coupled to whichever base image runs them).

### Estimated effort
**medium** for the file copy itself; **large** for the validation (boot a sandbox, run a generation, watch process-monitor logs end-to-end).

---

# Proposed PR Sequencing

The 14-file scope is too large for a single PR and the changes have hard dependencies on each other. Recommend splitting into **three sub-PRs**:

### PR 2a — Tooling-only (low risk, ship first)
**Files**: `.gitignore`, `eslint.config.js`, `tsconfig.worker.json`, `vite.config.ts`

- All four are config files with small, low-risk diffs.
- No runtime impact.
- Can ship today, blocks nothing.
- **Effort**: ~1 hour total. **Risk**: low.

### PR 2b — Deploy script improvements (medium risk, ship second)
**Files**: `scripts/deploy.ts`, `scripts/setup.ts`

- Genuinely-useful structural improvements (env-var inheritance allow-list, smarter token-permissions check, CI-aware logging) with no dep-chain implications.
- Preserve Dreamforge branding throughout.
- Does NOT include `scripts/undeploy.ts` (skip) or `scripts/copy-landing-pages.ts` (preserve).
- **Effort**: ~2 hours. **Risk**: medium (touches the deploy hot path — must be tested on a staging deploy before merge).

### PR 2c — Wrangler + deps + container + Dockerfile (high risk, ship last, gated on decisions)
**Files**: `wrangler.jsonc`, `worker-configuration.d.ts` (regen), `package.json`, `bun.lock` (regen), `SandboxDockerfile`, all `container/*.ts`

- These changes are mutually-dependent: `package.json` deps determine what the worker can `import`, which determines what bindings get used in `wrangler.jsonc`, which regenerates `worker-configuration.d.ts`, which is what `tsconfig.worker.json` types pick up; `SandboxDockerfile` `FROM` line must match the `@cloudflare/sandbox` npm version; `container/*.ts` must run on whichever sandbox image is selected.
- **Blocked on user decisions** (see Risk Callouts).
- **Effort**: large (>4 hours). **Risk**: high — this is what actually deploys to prod.

### Skip / defer entirely
- `vitest.config.ts` — defer until the test-rewrite phase per CLAUDE.md ("all tests AI-generated and need replacement").
- `scripts/undeploy.ts` — pure branding diff, no value in merging.
- `scripts/copy-landing-pages.ts` — local-only, must not be deleted.

### Dependency analysis
1. `package.json` MUST land before any code that imports new deps.
2. `wrangler.jsonc` changes trigger `worker-configuration.d.ts` regeneration via `npm run cf-typegen` — make this a CI step or a PR-checklist item.
3. `SandboxDockerfile` `FROM` version MUST match `package.json`'s `@cloudflare/sandbox` version exactly.
4. `container/*.ts` versions are coupled to the sandbox base image — adopt as a single unit, not piecewise.

---

# Risk Callouts

1. **`@cloudflare/sandbox 0.1.3 → 0.5.6` is a major-version bump**. Breaking changes are likely (filesystem layout already changed from `/app/` to `/workspace/`, startup mechanism flipped to `startup.sh`). Requires a real end-to-end test in staging before promoting to prod. This is the highest-risk change in PR 2.

2. **`UserSecretsStore` resurrection in upstream's `wrangler.jsonc`** directly conflicts with our v5 `deleted_classes` migration. If we accidentally re-add `UserSecretsStore` to `new_sqlite_classes` after deleting it in v5, wrangler will reject the deploy (CF error 10074-class). The migration history is one-shot; do NOT touch v1–v6 even if upstream collapses them.

3. **`PLATFORM_CAPABILITIES` env var**: if worker code now reads it (likely — upstream added it deliberately) and we don't add it to `wrangler.jsonc`, the worker will crash at startup on `undefined.features.app.enabled`. Need to grep worker source after-merging upstream's worker code to confirm.

4. **`overrides.vite: "latest"` in upstream's package.json** — must NOT adopt. Floating "latest" overrides break reproducible builds and have already bitten us. Keep our `^7.1.13` pin.

5. **`scripts/copy-landing-pages.ts` deletion would silently break getdreamforge.com / www.getdreamforge.com.** The marketing landing pages would 404 in prod. Ensure this script and its `build`-script call are preserved.

6. **Worker name flip**: if `wrangler.jsonc` accidentally takes upstream's `vibesdk-production`, the next deploy creates a brand new worker and the existing `dreamforge-cf` worker keeps running stale code. Every PR touching `wrangler.jsonc` must explicitly verify `name: "dreamforge-cf"` is intact.

7. **CodebaseAnalyzer DO binding (PR 20d)** is a load-bearing customization. If upstream's wrangler.jsonc replaces it with `UserSecretsStore`, the BYOP feature stops working. Preserve absolutely.

---

# Blockers / Decisions Needed From the User

Before PR 2c can be drafted:

1. **Adopt `@cloudflare/sandbox 0.5.6`?** (yes/no — drives Dockerfile FROM, container/*.ts rewrite, deps choice)
2. **Adopt `PLATFORM_CAPABILITIES` env var?** (yes/no — required iff we are also pulling worker-side code that reads it)
3. **Adopt CLI/TUI tooling from upstream?** (yes/no — adds ~10 deps, a `cli/` directory, husky, commitlint; bigger surface than this PR)
4. **Adopt `@simplewebauthn/browser` + WebAuthn auth flow?** (yes/no — auth surface is owned by Phase D; this likely belongs to a different PR)
5. **Adopt `agents@0.2.32`?** (yes/no — major version bump on the agents framework that powers `CodeGeneratorAgent`)
6. **Bump our package version?** Upstream is at `1.5.0`. We are at `0.0.0`. Independent versioning is fine; just decide.

If decisions 1–5 default to **NO** for this cycle, PR 2c becomes much smaller and safer: just observability/SSH wrangler additives, dep patch-version bumps, type regen, container/*.ts only if their behaviour-on-old-image is verified.

---

*End of survey.*
