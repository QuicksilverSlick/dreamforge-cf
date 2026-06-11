# Dreamforge-CF — Developer Handoff (for a fresh Fable 5 dev agent)

**Audience:** a Claude Code dev agent running on Anthropic **Fable 5** (`claude-fable-5`), High reasoning / Ultracode, that has never seen this codebase. Your job is to implement the four open threads in Section 5 under the protocol in Section 4.

**Snapshot date:** 2026-06-10 · **Branch:** `main` · **Repo:** `QuicksilverSlick/dreamforge-cf` (worker `dreamforge-cf`).

> Read this whole document before touching code. Then read the agent memory (Section 7) and `CLAUDE.md` at the repo root. Sections 3 and 4 are the two you cannot skip — they encode mistakes that cost real prod outages.

---

## Table of contents

1. [Mission & current state](#1-mission--current-state)
2. [Architecture in 60 seconds](#2-architecture-in-60-seconds)
3. [THE HARD-WON LESSONS — don't relearn these the hard way](#3-the-hard-won-lessons--dont-relearn-these-the-hard-way)
4. [The deploy & quality protocol](#4-the-deploy--quality-protocol)
5. [Open threads](#5-open-threads)
   - [5.1 BYOK re-enablement (highest value)](#51-byok-re-enablement-highest-value)
   - [5.2 Lucide brand-icon prevention (cheap win)](#52-lucide-brand-icon-prevention-cheap-win)
   - [5.3 NDJSON blueprint-stream parse noise](#53-ndjson-blueprint-stream-parse-noise)
   - [5.4 Design refinements](#54-design-refinements)
6. [Working with Fable 5](#6-working-with-fable-5)
7. [Pointers](#7-pointers)

---

## 1. Mission & current state

Dreamforge is a productionized fork of `cloudflare/vibesdk`: an AI platform that builds working webapps **phase-by-phase from a single prompt**. A React 19 + Vite SPA talks to a Cloudflare Workers + Hono API; the generation itself runs inside a Durable Object AI agent that emits code phase-by-phase, previews it in a sandbox container, and runs automated review cycles. Live app at `app.getdreamforge.com`; marketing at `getdreamforge.com`; preview apps at `*.app.getdreamforge.com`.

Live and stable as of this handoff:

- **Model posture:** app code-gen runs on **Gemini 3.1 Pro** (blueprint + first-phase implementation) and **Gemini 3.5 Flash** (phase implementation + code review), both at high reasoning, via the AI Gateway `/compat` path. This is deliberate — see Section 3.
- **Non-blocking image pipeline (#110):** images generate concurrently with coding rather than as a blocking barrier; the preview refreshes when images complete.
- **Deterministic design verification pass (#102, #111):** placeholder detector + AI-tells detector + Lucide brand-icon detector run post-generation and auto-fix.
- **BYOK is OFF (deliberately):** the platform currently eats 100% of inference cost. Re-enabling it is open thread 5.1.
- **Marketing repositioned + rebranded** to Electric Aqua-Teal; live app still ships the old orange until the next deploy.

---

## 2. Architecture in 60 seconds

- **Phasic generation.** A Durable Object analyzes the prompt → blueprint → emits code phase-by-phase (explicit per-phase file lists) over the SCOF streaming protocol → runs review cycles (static analysis, runtime validation in the sandbox, AI error-fix) → applies unified-diff updates.
- **Durable Objects.** `CodeGeneratorAgent` (the code-gen agent), `DORateLimitStore` (rate limits), `CodebaseAnalyzer` (BYOP — imports an existing GitHub repo for AI iteration). The live agent path is `worker/agents/core/simpleGeneratorAgent.ts`; `smartGeneratorAgent.ts` is a stub pending the deferred Phase-E mega-bundle.
- **Inference layer (`/compat`).** All model calls go through the OpenAI SDK → Cloudflare AI Gateway `/compat` endpoint. The per-model routing lives in `worker/agents/inferutils/`. **This `/compat` path is the source of the biggest gotcha in this repo — see Section 3.**
- **D1.** The worker binds `DB` → database **`vibesdk-db`** (id `0d8d35e2-91e1-4231-90b1-f49cc313876c`), Drizzle ORM, migrations v1–v6. New app rows go **here**, NOT to `vibesdk-dreamforge-db`.
- **Routing (`worker/index.ts` `fetch()`).** Domain-based: marketing domain → static assets; main app → SPA + `/api/*` Hono app; `*.app.getdreamforge.com` → sandbox proxy then dispatched-worker fallback. IP-host requests are 403'd. Sentry wraps the entrypoint and each DO.
- **Deploy pipeline.** Merge to `main` **auto-deploys prod** via `.github/workflows/deploy.yml` (build → `wrangler deploy` of the Vite-plugin `dist/dreamforge_cf/wrangler.json` config → `/api/health` poll → automatic rollback on health failure). CI (`ci.yml`) is a pre-merge gate only. **Never run `wrangler deploy` by hand.**

---

## 3. THE HARD-WON LESSONS — don't relearn these the hard way

These cost two live prod outages this session (builds `74b95461` and `3a641bc9`, PRs #104–#108). Do not repeat them.

### 3.1 The app's code-gen inference models CANNOT be Anthropic models through the current `/compat` path

This is the single most important constraint in the repo.

- All model calls route through the **OpenAI SDK → Cloudflare AI Gateway `/compat`** endpoint.
- Anthropic's OpenAI-compat layer **silently DROPS `response_format`** (structured outputs) and `reasoning_effort`.
- The agent relies on structured outputs at init. With `response_format` dropped, a Claude/Opus/Fable code-gen call **fails schema validation at agent init → the app row is never written to D1 → the user gets a 404 + a dead WebSocket.**
- This was verified by two live prod outages. PR #106 (force `temperature=1`, omit `reasoning_effort` for Claude) is **benign and did NOT fix it** — the structured-output drop is the root cause, and it lives in the gateway, not in our request params.

**Consequence:** the app's code-gen stays on **Gemini** (3.1 Pro + 3.5 Flash, high reasoning). Using any `anthropic/*` model for **app inference** requires **first building a native Anthropic Messages backend (`/ai/v1/messages`)** — a separate project, NOT a config flip. Do not "just try Opus again."

> **Scope note — this does NOT constrain you.** This lesson is about the **app's** code-gen inference. **You, the dev agent, run on Fable 5 and are completely unaffected.** Fable 5 is your own model, not the app's code-gen model. Don't confuse the two.

### 3.2 Current model posture (leave it alone unless that's your task)

- Blueprint + first-phase implementation → `GEMINI_3_1_PRO_PREVIEW` @ high.
- Phase implementation + code review → `GEMINI_3_5_FLASH` @ high.
- Root cause this posture exists: the `/compat` structured-output drop above. Rooted in PR #109.

### 3.3 The non-blocking image pipeline (#110) is intentional

Images generate **concurrently** with coding, not as a blocking barrier; the preview refreshes on image completion. Don't reintroduce a blocking image step.

### 3.4 The deterministic design verification pass (#102, #111) is a backstop, not a crutch

A post-generation pass deterministically detects placeholders, AI-tells, and removed Lucide brand icons and auto-fixes them. It is a safety net. Cheaper wins come from **preventing** issues in the prompt before the pass has to correct them (that's literally open thread 5.2).

---

## 4. The deploy & quality protocol

### 4.1 STRICT PR FLOW — NEVER commit to `main`

`main` is branch-protected and merging to it **auto-deploys prod**. For every change:

1. `git branch --show-current` first — confirm you're not on `main`.
2. Create a feature branch.
3. `gh pr create --repo QuicksilverSlick/dreamforge-cf --base main ...` (always pin `--repo` and `--base`).
4. **Wait for CI green.**
5. `gh pr merge <#> --repo QuicksilverSlick/dreamforge-cf --squash --admin`.

Merging triggers `.github/workflows/deploy.yml`: build → `wrangler deploy -c dist/dreamforge_cf/wrangler.json` → `/api/health` poll (10 attempts, 6s apart, expects `{"status":"ok"}`) → **auto-rollback** to the prior version on health failure. **NEVER run or advise a manual `wrangler deploy` / `npm run deploy` for prod.** (Container build can occasionally fail on a transient Docker Hub `cloudflare/sandbox:0.5.6` pull timeout → `gh run rerun <id> --failed`.)

### 4.2 ATOMIC-GREEN GATE — run before every PR

| Check | Command | Pass condition |
|---|---|---|
| Typecheck | `npm run typecheck` | **0 errors** |
| Lint | `npm run lint` | **0 errors** |
| Tests | `npm run test` | **baseline 191 passed / 1 skipped** |

- The **2 pre-existing BYOP test failures are acceptable** — they are not regressions; do not count them as such.
- **CI has NO test job.** `ci.yml` runs Install / Lint / Typecheck / Build / Validate-wrangler only. **Run tests locally** — CI will not catch a test regression for you.

### 4.3 Windows dev environment (PowerShell)

- Use bun, not npm, to install: `"/c/Users/PC owner/.bun/bin/bun.exe" install`. `npm install` fails on the `@rolldown/binding-linux-x64-gnu` cross-platform binary.
- `npm run build` fails locally on a `./node_modules/.bin` shell quirk. To confirm the frontend bundles, run **`node_modules/.bin/vite build`** (no leading `./`). CI builds fine on Linux.
- Miniflare EBUSY temp-dir warnings during tests are Windows noise — ignore them.

### 4.4 Code-quality rules (from `CLAUDE.md`)

Never use `any` / `as any` / dynamic imports. Strict DRY. Fix files in place (no "corrected" copies alongside originals). Comments explain the code, not your change. Prefer Cloudflare-native solutions.

---

## 5. Open threads

Priority order. Each has a goal, exact file:line pointers, recommended approach, and acceptance criteria. **Verify each line pointer with a `Read` before editing** — line numbers drift.

### 5.1 BYOK re-enablement (highest value)

**Goal:** let users bring their own provider API keys so the platform stops eating 100% of inference cost. BYOK is fully scaffolded but **deliberately disabled "for security reasons."** This is a **security-sensitive** change — recommend a security review before merge.

**Where it's disabled / inert:**

- `worker/agents/inferutils/core.ts`
  - `:19` — `// import { SecretsService } from '../../database';` (import commented out).
  - `:227` — `async function getApiKey(provider: string, env: Env, _userId: string)` — userId param is `_userId` (unused).
  - `:229–242` — the entire per-user key lookup block is commented out (`new SecretsService(env)` → `getUserBYOKKeysMap(userId)` → return user key if valid).
  - `:243–252` — live path is env-only: `${PROVIDER}_API_KEY` → fallback `env.CLOUDFLARE_AI_GATEWAY_TOKEN`. (So every token bills to us.)
  - `:294` (`getConfigurationForModel`) — caller already passes `userId` through to `getApiKey`; the receiver ignores it today.
- `worker/database/services/SecretsService.ts` — three write paths hard-throw `new Error('BYOK is not supported for now')` under a `// DISABLED: BYOK Disabled for security reasons` comment:
  - `:123–125` `storeSecret`, `:250–252` `deleteSecret`, `:316–318` `toggleSecretActiveStatus`.
  - **Read paths already work:** `getUserSecrets` (`:172`), `getSecretValue` (`:213`), `getUserBYOKKeysMap` (`:273`). Re-enabling means un-commenting `storeSecret` (+ delete/toggle) and the `core.ts:229` block.
- Already-built, live-but-inert scaffolding (no throws): `worker/api/controllers/modelConfig/byokHelper.ts` — `getUserProviderStatus` (`:15`), `getPlatformEnabledProviders` (`:89`), `getPlatformAvailableModels` (`:126`), `validateModelAccessForEnvironment` (`:140`, returns `hasPlatformKey || hasUserKey`). Plus `worker/api/routes/secretsRoutes.ts`, `worker/types/secretsTemplates.ts`, and the settings model picker (`userModelConfigs`).

**Upstream reference (port carefully, don't copy blind):** `cloudflare/vibesdk` has BYOK fully wired. Its `getApiKey` takes `(provider, env, userId, runtimeOverrides, shouldUseUserKey, encryptedUserToken)`: free tier runs on platform keys, then switches to the **user's own decrypted token** once they exceed free-tier limits; the decrypted token is **validated against the user to prevent token theft**; it also supports a user-supplied custom gateway (`aiGatewayOverride` — "user's gateway = user's credentials only"). Our fork has diverged on secrets storage (D1, not the deleted upstream `UserSecretsStore` DO) — port the **logic**, not the storage layer.

**Recommended approach:**

1. Un-comment the `core.ts:19` import and the `:229–242` lookup; thread `userId` (rename `_userId` → `userId`).
2. Re-enable `SecretsService` write paths (`storeSecret`, `deleteSecret`, `toggleSecretActiveStatus`) with **encryption at rest** using `SECRETS_ENCRYPTION_KEY` (env var already exists) and **anti-theft validation** (decrypted token must validate against the owning user).
3. Keep the free-tier-on-platform-keys → user-key-on-overage gating; route it through the existing `byokHelper.ts` / `validateModelAccessForEnvironment`.
4. Recommend a security review before merge. Note that **two BYOP test failures are pre-existing baseline** — don't conflate with new BYOK work.

**Acceptance:** a user can store a provider key (encrypted at rest in D1 `vibesdk-db`); inference uses that user's key for that user's builds; free-tier users still run on platform keys; no key leakage across users.

### 5.2 Lucide brand-icon prevention (cheap win)

**Goal:** Lucide removed brand/social icons (instagram, facebook, twitter, linkedin, youtube, github, twitch, slack, figma, dribbble, gitlab, tiktok, discord, pinterest) over trademark. Generated apps that reference them render **blank** social icons. A deterministic detector already backstops this post-hoc; add a **preventive** note to the design skill text so the model doesn't emit them in the first place.

**Where:** `worker/agents/prompts/designSkills.ts`

- The detector (already shipped #111): `LUCIDE_REMOVED_BRAND_ICONS` (`:114–117`), `LUCIDE_BRAND_DATA_ATTR` (`:118`), `LUCIDE_BRAND_IMPORT` (`:119`), both registered in `DESIGN_TELL_CHECKS` (`:121–129`) and consumed by `findDesignTells()` (`:135–144`).
- **Add the preventive note in `FRONTEND_CRAFT_SKILL`** (`:56`), specifically inside the **"AI TELLS — forbidden patterns"** block (`:66–70`, e.g. extend the "Resources" line at `:69`). Tell the model: do not import brand/social icons from `lucide-react` (they were removed); use **inline SVG brand marks** for social links instead.

**Recommended approach:** one short, plain sentence (Fable-era models follow concise instruction better than enumeration — see Section 6). The regex detector stays as the backstop; this just shifts the fix upstream of the corrective model pass.

**Acceptance:** skill text updated; fresh builds render social icons; the detector still backstops it.

### 5.3 NDJSON blueprint-stream parse noise

**Goal:** during blueprint streaming the client logs repeated `Error parsing JSON: createRepairingJSONParser: unable to repair JSON`. It's benign (the blueprint completes) but it's console-error spam on partial streamed chunks. Stop logging mid-stream repair attempts as errors (or make the parser tolerate partial/incremental chunks).

**Where (note the path correction):** the brief named `src/routes/chat/utils/ndjson-parser.ts` — **that file does not exist.** The real file is **`src/utils/ndjson-parser/ndjson-parser.ts`**.

- `createRepairingJSONParser()` at `:64`; `feed()` at `:148`; `finalize()` at `:150–169` runs an escalating repair ladder (raw parse → `closeStrings` → `stripCommas` → `balanceBrackets` → `fixKeys` → else `throw` at `:168`). `ndjsonStream()` generator at `:1`; `NDJSONStreamParser` class at `:32`.
- Consumer: `src/routes/chat/hooks/use-chat.ts` around line 463 — `:461` `parser.feed(obj.chunk)`; `:462–467` `try { const partial = parser.finalize(); setBlueprint(partial); } catch (e) { logger.error('Error parsing JSON:', e, obj.chunk); }`. Every chunk re-runs the ladder to render a progressively-completing blueprint; failure is swallowed and logged, not fatal.

**Recommended approach:** the right fix is at the **consumer** — a mid-stream `finalize()` failure on a partial chunk is *expected*, not an error. Stop logging it at `error` level during the stream (downgrade to debug/trace, or simply skip the `setBlueprint` for that chunk and wait for the next). Do **not** weaken the parser's final-completeness guarantee. Keep root-cause integrity: the final blueprint must still parse.

**Acceptance:** no error-level console spam during a normal blueprint stream.

### 5.4 Design refinements

**Goal:** the design skill bans 3-equal-column grids but builds still ship them; section whitespace runs sparse ("airy" tipping into "disconnected"). Steer away from 3-equal-column menu grids and toward tighter vertical rhythm.

**Where:** `worker/agents/prompts/designSkills.ts`, `FRONTEND_CRAFT_SKILL` (`:56`):

- `:61` — the load-bearing **Layout diversification** line: the generic "3 equal cards in a row" is BANNED (prefer 2-column zig-zag / asymmetric grid / horizontal scroll); bans centered hero/H1 blocks.
- `:59` typography spacing; `:62` materiality / negative-space (`divide-y`, `border-t`); `:64` forms `gap-2`.
- **Important:** per `:99–101`, aesthetic judgments (AI-purple, centered hero, **3-equal-cards**) are **intentionally NOT** in `DESIGN_TELL_CHECKS` — they're taught in the prompt and left to a semantic judge, not regex, to avoid false positives. So the anti-3-column rule is **prompt-only, not verified**.

**Recommended approach:** tune the prompt text (and optionally the semantic-judge side of the verification pass) — tighten the `:61` layout language and add a vertical-rhythm/section-spacing instruction. Keep it concise (Section 6). Decide deliberately whether to add a verification check; the existing design intentionally keeps these aesthetic calls out of regex to avoid false positives — don't add a brittle regex that fires on legitimate `md:grid-cols-3` usage.

**Acceptance:** fresh builds show non-generic featured/asymmetric layouts and tighter section spacing.

---

## 6. Working with Fable 5

You run on **`claude-fable-5`** (GA on the Claude API since 2026-06-09). Facts that matter for how you should operate, with Anthropic doc URLs:

- **Context / output:** 1M-token context window (full window at standard pricing), 128K max output. Knowledge cutoff is **not documented** by Anthropic for Fable 5. [overview](https://platform.claude.com/docs/en/about-claude/models/overview.md)
- **Thinking is adaptive and always on** — it's the only mode. `thinking: {type:"disabled"}` is **rejected**; omit the param. Raw chain-of-thought is never returned (`display` defaults to `"omitted"`; set `"summarized"` to read a summary). [adaptive-thinking](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)
- **Effort is the reasoning-depth control, not `budget_tokens`.** Levels: `low | medium | high | xhigh | max`; **`high` is the default** (identical to omitting the param). Manual `thinking: {type:"enabled", budget_tokens:N}` returns a **400 error**. "Ultracode" == **`xhigh` effort + multi-agent autonomy**, not a separate API tier. [effort](https://platform.claude.com/docs/en/build-with-claude/effort.md)
- **`max_tokens` is a hard cap on total output = thinking + response text.** At high/xhigh set it generously (~64K+ start); if you see `stop_reason: "max_tokens"`, raise it or lower effort. [adaptive-thinking](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)
- **No response prefill** on the last assistant turn (Fable-era models 400 on it). Force formats via Structured Outputs or direct instruction instead. [prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- **`reasoning_extraction` refusal:** never ask Fable 5 to dump/echo its own chain-of-thought into the answer text — it can refuse (`stop_reason: "refusal"`, HTTP 200). Read `thinking` blocks instead. [prompting Claude Fable 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5)
- **Temperature=1 requirement: NOT documented for Fable 5.** That rule comes from legacy *manual* extended thinking on older models; the adaptive-thinking and effort pages state no temperature constraint for Fable 5. (PR #106's `temperature=1` patch was about the **app's** Claude calls via `/compat`, a different concern.) [extended-thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- **When High earns its cost:** `high` (default) is right for complex reasoning, nuanced analysis, and difficult coding — i.e. most of this work. Step up to `xhigh`/Ultracode for long-horizon agentic runs (>30 min, repeated tool calls, deep search). Use `max` sparingly (it can over-think structured-output tasks for small gains). Step down to `medium`/`low` for routine edits; lower Fable-5 effort still often beats prior models' `xhigh`. [effort](https://platform.claude.com/docs/en/build-with-claude/effort.md)
- **Prompting style for this generation:** steer with **one concise instruction**, not enumerated guardrails — over-enumeration can degrade output. State the *intent* behind an instruction. Act when you have enough to act; before ending a turn, if your last paragraph is a plan/question/promise, do that work now. Ground progress claims against actual tool results. These directly inform threads 5.2 and 5.4 (keep prompt additions short). [prompting Claude Fable 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5)

---

## 7. Pointers

- **Agent memory (read first, in this order):** `C:\Users\PC owner\.claude\projects\C--Users-PC-owner-Desktop-Dreamforge-Cloud\memory\` → start with `MEMORY.md`, then the `project_*.md` files (**especially `project_design_quality_model_bottleneck.md` and `project_byok_disabled.md`**) and `feedback_*.md` (**`feedback_git_workflow.md`, `feedback_windows_build.md`**).
- **`CLAUDE.md`** at repo root — full architecture + commands + the non-negotiable code rules.
- **Key files by thread:**
  - BYOK: `worker/agents/inferutils/core.ts`, `worker/database/services/SecretsService.ts`, `worker/api/controllers/modelConfig/byokHelper.ts`, `worker/api/routes/secretsRoutes.ts`, `worker/types/secretsTemplates.ts`.
  - Lucide + design: `worker/agents/prompts/designSkills.ts`.
  - NDJSON: `src/utils/ndjson-parser/ndjson-parser.ts`, `src/routes/chat/hooks/use-chat.ts`.
- **Agent core:** `worker/agents/core/simpleGeneratorAgent.ts` (live), `worker/agents/core/state.ts` / `types.ts`, `worker/agents/core/websocket.ts`. Worker entrypoint `worker/index.ts`; Hono app `worker/app.ts`.
- **CI/deploy:** `.github/workflows/ci.yml` (pre-merge gate), `.github/workflows/deploy.yml` (auto-deploy on merge to main).
- **Recent session PRs:** #97–#111. The #104→#108 sequence is the Opus flip-flop (deploy → revert → re-apply → revert); current state is Gemini (#109). #110 non-blocking images; #111 Lucide detector.
