# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository (`dreamforge-cf`, deployed as the worker `dreamforge-cf`) is a fork of the open-source [`cloudflare/vibesdk`](https://github.com/cloudflare/vibesdk) project, productionized as **Dreamforge** at:

- App: `app.getdreamforge.com` (React SPA + Workers API)
- Marketing: `getdreamforge.com` / `www.getdreamforge.com` (StoryBrand landing pages)
- Preview apps: `*.app.getdreamforge.com` (wildcard subdomain routed to sandbox containers / dispatched workers)

It is a React 19 + Vite frontend backed by a Cloudflare Workers + Hono API and Durable-Object-based AI agents that build webapps phase-wise from user prompts.

**Important context:**
- Core functionality: AI-powered webapp generation via Durable Objects (`CodeGeneratorAgent`, `UserAppSandboxService`)
- Two parallel agent implementations live under `worker/agents/core/`:
  - `simpleGeneratorAgent.ts` — the **live** path used by the exported `CodeGeneratorAgent` Durable Object (post-Phase-E-recovery)
  - `smartGeneratorAgent.ts` — a TODO stub that is currently re-exported through `worker/index.ts` as the public DO class. The full smart-agent rewrite (Phase E mega-bundle, PRs 5/6/7/8 unified) is deferred behind the `agents@0.1.6` pin.
- **BYOP (Bring Your Own Project)** is a first-class feature: a user can import an existing GitHub repository and the `CodebaseAnalyzer` Durable Object (`worker/agents/analyzer/codebaseAnalyzer.ts`) ingests it for AI iteration. See `docs/byop/README.md`.
- Auth, secrets, and rate-limit subsystems are production-hardened (CSRF defense-in-depth, OAuth state HMAC, per-record salts, `__Host-` cookies, JWT secret validator, AI Gateway origin allowlist + JWT verify + D1 ownership check). The original "AI-generated, needs rewrite" caveat in the upstream README no longer applies to those areas.
- Full Cloudflare stack: Workers, D1 (Drizzle ORM, migrations v1–v6), Durable Objects (SQLite), R2, KV, AI Gateway, Containers, Dispatch Namespaces.

## Development Commands

### Frontend Development
```bash
npm run dev              # Start Vite dev server with hot reload (DEV_MODE=true)
npm run build            # tsc -b + Vite build + copy landing pages
npm run typecheck        # tsc -b --noEmit
npm run lint             # ESLint
npm run preview          # Build then `vite preview`
```

### Worker Development
```bash
npm run cf-typegen       # Generate worker-configuration.d.ts from wrangler.jsonc
npm run deploy           # bun --env-file .prod.vars scripts/deploy.ts
```

### Database (D1 + Drizzle)
```bash
npm run db:generate          # Generate migration (local config)
npm run db:generate:remote   # Generate migration (remote config)
npm run db:migrate:local     # Apply migrations locally
npm run db:migrate:remote    # Apply migrations to production (CI=true)
npm run db:studio            # Drizzle Studio against local DB
npm run db:studio:remote     # Drizzle Studio against remote DB
```

### Testing (Vitest + `@cloudflare/vitest-pool-workers`)
```bash
npm run test            # vitest run (Workers pool, miniflare)
npm run test:watch      # vitest in watch mode
npm run test:coverage   # vitest run --coverage
```

Tests run against a Miniflare worker via `vitest.config.ts` (`compatibility_date: 2024-12-12`, `nodejs_compat`). Worktrees under `.claude/` and the `bun:test`-based `container/monitor-cli.test.ts` are excluded.

### Knip (dead-code analysis)
```bash
npm run knip
npm run knip:fix
npm run knip:production
```

## Core Architecture: AI Code Generation

### Phase-wise Generation System (`worker/agents/`)

The heart of the system is a Durable Object that implements phased code generation:

1. **Blueprint Phase**: Analyzes user requirements and produces a project blueprint
2. **Incremental Generation**: Emits code phase-by-phase with explicit per-phase file lists
3. **SCOF Protocol**: Structured Code Output Format for streaming generated code
4. **Review Cycles**: Multiple automated review passes:
   - Static analysis (linting, type checking)
   - Runtime validation via the sandbox container (`UserAppSandboxService`)
   - AI-powered error detection and fixes
5. **Diff Support**: Efficient file updates via unified-diff format

### Key Components
- **Durable Object class** (live): `worker/agents/core/simpleGeneratorAgent.ts`
- **Durable Object class** (stub, currently exported as `CodeGeneratorAgent`): `worker/agents/core/smartGeneratorAgent.ts` — pending mega-bundle land
- **Worker entrypoint**: `worker/index.ts` — wires Sentry, the three DOs (`CodeGeneratorAgent`, `DORateLimitStore`, `CodebaseAnalyzer`), and three routes (marketing, app/API, user-app subdomains)
- **Hono app**: `worker/app.ts` — middleware stack + route mounting
- **State management**: `worker/agents/core/state.ts`, `worker/agents/core/types.ts`
- **WebSocket protocol**: `worker/agents/core/websocket.ts` (server) ↔ `src/routes/chat/utils/handle-websocket-message.ts` (client)
- **Sandbox container**: `worker/services/sandbox/sandboxSdkClient.ts` (preview / build execution)
- **Codebase analyzer (BYOP)**: `worker/agents/analyzer/codebaseAnalyzer.ts` — Durable Object that ingests imported repositories

### Frontend ↔ Worker Communication
- **Initial request**: `POST /api/agent`
- **WebSocket connection**: `/api/agent/:agentId/ws` for real-time updates
- **AI Gateway proxy** (for generated apps): `/api/proxy/openai` — Origin allowlisted to `*.app.getdreamforge.com` + JWT verify + D1 ownership cross-check
- **Message types**: Typed protocol for file updates, errors, phase transitions

## Routing and Domain Model

`worker/index.ts` `fetch()` performs domain-based routing in this order:

1. **Marketing** (`getdreamforge.com` / `www.getdreamforge.com`, or `localhost/marketing/*` for local preview) — served from `dist/client/marketing/` via `env.ASSETS`. APIs are 404'd on the marketing domain.
2. **Main app** (`app.getdreamforge.com` or bare `localhost`) — non-`/api/*` paths served from `env.ASSETS` (SPA fallback enabled in `wrangler.jsonc`); `/api/*` handled by the Hono app; `/api/proxy/openai` gated by Origin check before the controller runs.
3. **User app subdomains** (`*.app.getdreamforge.com` or `*.localhost`) — `handleUserAppRequest()` proxies first to the active sandbox via `proxyToSandbox`, then falls back to a dispatched worker via `env.DISPATCHER`.

IP-host requests are 403'd. The Sentry wrapper (`Sentry.withSentry`) instruments the entire worker entrypoint; each Durable Object is wrapped with `Sentry.instrumentDurableObjectWithSentry`.

## Areas Still Evolving

### Smart agent rewrite (Phase E mega-bundle)
`SmartCodeGeneratorAgent` is a TODO stub. The full agent rewrite, the corresponding `agents@0.1.6 → 0.2.32` upgrade, the new MCP-SDK calls in the BYOP tests, and the unified PRs 5/6/7/8 are blocked on this deferred work.

### Sandbox modernization
The sandbox container (`@cloudflare/sandbox 0.5.6`, `@cloudflare/containers 0.0.28`) is pinned. Upstream has progressed; bumps land separately from the mega-bundle.

## Working with the Codebase

### Adding features to code generation
1. Modify agent logic in `worker/agents/core/simpleGeneratorAgent.ts` (live) or `worker/agents/core/smartGeneratorAgent.ts` (post-bundle).
2. Update state shapes in `worker/agents/core/state.ts` / `types.ts`.
3. Add new message types in `worker/agents/core/websocket.ts`.
4. Update the frontend handler in `src/routes/chat/utils/handle-websocket-message.ts` and `src/routes/chat/hooks/use-chat.ts`.

### Cloudflare-specific patterns
- **Durable Objects**: SQLite-backed where possible; use `this.sql\`...\`` API in new code (see `SimpleCodeGeneratorAgent`).
- **D1**: Use batch operations and `prepare()` placeholders. **Never** use `sql.raw()` with user input (Drizzle SQLi CVE GHSA-gpj5-g38j-94v9, fixed in 0.45.2+ — we're on `^0.45.2`).
- **Environment bindings**: Access via the `env` parameter (or `cloudflare:workers`'s exported `env` global, adopted across the worker).
- **Rate limits**: First-class `ratelimits` config (GA 2025) in `wrangler.jsonc`. Auth limiter **fails closed** on DO error; other limiters fail open. Limit type is passed explicitly through `enforceDORateLimit`.
- **Sandbox**: Accessed via `proxyToSandbox()` from `@cloudflare/sandbox` for live preview proxying.
- **Dispatcher**: Permanent deployed user apps accessed via `env.DISPATCHER.get(appName)`.

### Environment variables
Required in `.dev.vars` for local development (and `.prod.vars` for deploys):
- `JWT_SECRET` — **must** pass the validator in `worker/utils/jwtUtils.ts` (≥32 chars, mixed character classes, no weak words, no 4-char runs)
- `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_AI_STUDIO_API_KEY` — AI providers
- `WEBHOOK_SECRET`, `SECRETS_ENCRYPTION_KEY`
- OAuth: `GOOGLE_CLIENT_ID`/`SECRET`, `GITHUB_CLIENT_ID`/`SECRET`, `GITHUB_EXPORTER_CLIENT_ID`/`SECRET`
- Sentry: `SENTRY_DSN` (worker DSN — Sentry wrapping is live; see `worker/observability/sentry.ts`)

## Important Notes
- Focus on core AI generation, BYOP, and sandbox functionality when making changes.
- Prefer Cloudflare-native solutions (D1, Durable Objects, R2, KV, Dispatch Namespaces).
- Always **strictly** follow DRY principles.
- Keep code quality high and maintainability in mind.
- Always research and understand the codebase before making changes.
- **Never use `any`.** If you see `any`, find the proper type in the project and replace it. If nothing fits, write a type for it.
- **Never use `as any`.** If you see one, refactor the underlying types so the cast is unnecessary.
- **Never use dynamic imports.** If you see one, correct it to a static import.
- Implement everything the **right** and **correct** way, not the **fast** and **quick** way.
- Don't add comments to explain your changes to me — comments should be professional, to the point, and explain the code itself.
- Don't write new "corrected" versions of files alongside the existing ones — fix the existing files in place.
- Don't reproduce upstream `cloudflare/vibesdk` defaults blindly; the fork has diverged on auth, secrets storage (D1, not the deleted `UserSecretsStore` DO), rate limits, routing, and observability.

## Common Tasks

### Debugging Code Generation
1. Run the worker locally with `wrangler dev` (see Wrangler docs).
2. Check WebSocket messages in browser DevTools (path `/api/agent/:agentId/ws`).
3. Verify sandbox connectivity (`proxyToSandbox` log line in `worker/index.ts`).
4. Review DO state via Cloudflare dashboard → Durable Objects → `CodeGenObject`.

### Working with Durable Objects
- `CodeGenObject` → class `CodeGeneratorAgent` (Sentry-wrapped export of `SmartCodeGeneratorAgent` from `worker/index.ts`)
- `Sandbox` → class `UserAppSandboxService` (from `@cloudflare/sandbox`)
- `DORateLimitStore` → class `DORateLimitStore` (from `worker/services/rate-limit/DORateLimitStore.ts`)
- `CodebaseAnalyzerObject` → class `CodebaseAnalyzer` (from `worker/agents/analyzer/codebaseAnalyzer.ts`)
- Migration history: see `wrangler.jsonc` `migrations` (v1 → v6 including the v3 phantom-class workaround, the v4/v5 deletes with tombstone, and the v6 `CodebaseAnalyzer` resurrection for BYOP)

### Sandbox / preview integration
- Sandbox class: `UserAppSandboxService`, exported from `worker/services/sandbox/sandboxSdkClient.ts`
- Container image: `./SandboxDockerfile` (`vcpu: 2, memory_mib: 8192, disk_mb: 16000` — passes Cloudflare's memory-per-vCPU ratio check on our account tier)
- Instance type at runtime: controlled by `SANDBOX_INSTANCE_TYPE` env var (`wrangler.jsonc` values are validation-only)
- Preview URL routing: `<deploymentId>.app.getdreamforge.com` → `handleUserAppRequest()` in `worker/index.ts`
