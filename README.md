# Dreamforge

> **AI vibe-coding platform for Cloudflare.** Generate full-stack web apps from natural-language prompts. React + Vite frontend, Cloudflare Workers + Durable Objects backend, live previews in sandboxed containers, one-click deploy of generated apps to Workers for Platforms.

**Live:**
- App: **[app.getdreamforge.com](https://app.getdreamforge.com)**
- Marketing: **[getdreamforge.com](https://getdreamforge.com)**

Dreamforge is built on top of the open-source [`cloudflare/vibesdk`](https://github.com/cloudflare/vibesdk) project and hardened for production use (CSRF defense-in-depth, OAuth state HMAC, AI Gateway origin-gated proxy with JWT + D1 ownership cross-check, Sentry observability, first-class CF rate limits, JWT-secret validator, BYOP recovery).

---

## What you can do with it

- **Describe an app in plain English** → blueprint → phase-wise code generation → live preview in a sandbox container → deploy.
- **Bring Your Own Project (BYOP)** → import an existing GitHub repository and iterate on it with the AI agent. Backed by a dedicated `CodebaseAnalyzer` Durable Object.
- **Real-time iteration** over WebSocket — typed message protocol streams file updates, phase transitions, and errors back to the frontend.
- **Sandbox-isolated previews** — generated apps run inside `@cloudflare/sandbox` containers, not in your worker.
- **One-click deploy** of generated apps to Workers for Platforms via the configured dispatch namespace.

---

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite (rolldown-vite), Tailwind 4, Radix UI, framer-motion, monaco-editor, react-router 7 |
| API | Cloudflare Workers + Hono 4 |
| AI agents | Durable Objects (SQLite-backed where possible) — `CodeGeneratorAgent`, `CodebaseAnalyzer` |
| Database | D1 + Drizzle ORM (`^0.45.2`) |
| Sandbox | `@cloudflare/sandbox` + `@cloudflare/containers` (custom `SandboxDockerfile`) |
| AI | Multi-provider via Cloudflare AI Gateway (`vibesdk-gateway`) |
| Storage | R2 (`vibesdk-templates`), KV (`VibecoderStore`) |
| Deploy | Workers for Platforms, dispatch namespace `vibesdk-default-namespace` |
| Observability | `@sentry/cloudflare` — worker + per-DO instrumented |
| Testing | Vitest + `@cloudflare/vitest-pool-workers` (Miniflare) |

Strict TypeScript (`strict: true`), ESLint, Knip, Prettier.

---

## Routing model

The worker's `fetch()` handler at [`worker/index.ts`](./worker/index.ts) dispatches by hostname:

| Hostname | Route |
| --- | --- |
| `getdreamforge.com`, `www.getdreamforge.com` | Marketing — StoryBrand landing pages served from `dist/client/marketing/` via `env.ASSETS`. APIs are 404'd here. |
| `app.getdreamforge.com` | Main app — SPA + `/api/*` via Hono. `/api/proxy/openai` is Origin-allowlisted + JWT-verified + D1-cross-checked. |
| `*.app.getdreamforge.com` | User app subdomains — proxied to live sandbox via `proxyToSandbox()`, with dispatcher fallback. |
| `localhost` (no `/marketing` prefix) | Same as main-app domain in local dev. |
| `localhost/marketing/*` | Preview marketing pages locally. |
| `*.localhost` | Same as user-app subdomains in local dev. |

Bare-IP requests are 403'd at the front of the worker.

---

## Repository layout (high-level)

```
worker/
  index.ts                       # entrypoint, routing, Sentry wrapping
  app.ts                         # Hono app + middleware + route mounting
  agents/
    core/
      simpleGeneratorAgent.ts    # live DO implementation
      smartGeneratorAgent.ts     # exported as CodeGeneratorAgent (stub — Phase E mega-bundle)
      state.ts, types.ts, websocket.ts
    analyzer/
      codebaseAnalyzer.ts        # BYOP — repo-ingest Durable Object
  api/                           # Hono routes + controllers
  auth/                          # OAuth (Google/GitHub), JWT, CSRF, sessions
  database/                      # Drizzle schema + services (SecretsService etc.)
  services/
    sandbox/                     # @cloudflare/sandbox client + UserAppSandboxService
    rate-limit/                  # DO + KV-backed rate limiters
    aigateway-proxy/             # /api/proxy/openai controller (3-gate)
  observability/                 # Sentry setup
  utils/                         # JWT validator, URL helpers, security config
src/
  routes/                        # React Router 7 routes (chat, BYOP /import, ...)
  components/                    # Radix-backed UI primitives + app components
docs/
  byop/README.md                 # Bring Your Own Project — feature index
  setup.md                       # Detailed setup + troubleshooting
  architecture-diagrams.md
  archives/                      # Session-scoped planning artifacts
migrations/                      # D1 SQL migrations
SandboxDockerfile                # Sandbox container image
wrangler.jsonc                   # Worker config (bindings, routes, migrations v1–v6)
```

---

## Production environment

| Setting | Value |
| --- | --- |
| Worker name | `dreamforge-cf` |
| Custom domain | `app.getdreamforge.com` |
| Custom preview domain | `app.getdreamforge.com` (wildcard `*.app.getdreamforge.com`) |
| AI Gateway | `vibesdk-gateway` |
| D1 database | `vibesdk-db` |
| R2 bucket | `vibesdk-templates` |
| KV namespace | `VibecoderStore` |
| Dispatch namespace | `vibesdk-default-namespace` |
| Containers | `UserAppSandboxService` — `vcpu=2, memory_mib=8192, disk_mb=16000`, runtime instance type via `SANDBOX_INSTANCE_TYPE` |
| Durable Objects | `CodeGeneratorAgent`, `UserAppSandboxService`, `DORateLimitStore`, `CodebaseAnalyzer` |
| DO migrations | v1 → v6 (see `wrangler.jsonc` for the documented migration history including the v3/v4/v5/v6 phantom-class workaround and the BYOP-driven `CodebaseAnalyzer` resurrection) |
| Compatibility date | `2025-08-10` (worker), `2024-12-12` (vitest miniflare) |
| Node compat | `nodejs_compat` |

---

## Local development

### Prerequisites
- Node 22+ (or Bun) and `npm` / `bun`
- Cloudflare account with Workers Paid plan + Workers for Platforms
- `wrangler` 4.x (pinned via devDependencies)

### Setup

```bash
npm install
cp .dev.vars.example .dev.vars   # fill in secrets — see "Environment variables" below
npm run cf-typegen                # generate worker-configuration.d.ts
npm run db:migrate:local          # apply D1 migrations locally
npm run dev                       # Vite dev server with DEV_MODE=true
```

Visit **`http://localhost:5173`**.

### Tests

```bash
npm run test            # vitest run via Workers pool
npm run test:watch
npm run test:coverage
```

Worktrees under `.claude/` and the `bun:test`-based `container/monitor-cli.test.ts` are excluded from collection (see `vitest.config.ts`).

### Common scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (HMR) with `DEV_MODE=true` |
| `npm run build` | `tsc -b --incremental && vite build && tsx scripts/copy-landing-pages.ts` |
| `npm run typecheck` | `tsc -b --incremental --noEmit` |
| `npm run lint` | ESLint |
| `npm run preview` | Build then `vite preview` |
| `npm run deploy` | `bun --env-file .prod.vars scripts/deploy.ts` |
| `npm run cf-typegen` | Generate `worker-configuration.d.ts` |
| `npm run db:generate` / `:remote` | Generate Drizzle migrations |
| `npm run db:migrate:local` / `:remote` | Apply D1 migrations |
| `npm run db:studio` / `:remote` | Drizzle Studio |
| `npm run knip` / `:fix` / `:production` | Dead-code analysis |

---

## Environment variables

Required in `.dev.vars` (local) and `.prod.vars` (production). The deploy script reads from `.prod.vars`.

| Variable | Notes |
| --- | --- |
| `JWT_SECRET` | **Must pass** the validator in `worker/utils/jwtUtils.ts` — ≥32 chars, ≥3 character classes, no weak words, no 4-char repeats. The worker refuses to boot on a weak secret. |
| `ANTHROPIC_API_KEY` | AI provider |
| `OPENAI_API_KEY` | AI provider |
| `GOOGLE_AI_STUDIO_API_KEY` | AI provider |
| `WEBHOOK_SECRET` | Webhook auth |
| `SECRETS_ENCRYPTION_KEY` | At-rest encryption for the per-user secrets table |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth (sign-in) |
| `GITHUB_EXPORTER_CLIENT_ID` / `GITHUB_EXPORTER_CLIENT_SECRET` | GitHub OAuth (separate app for "Export to GitHub") |
| `CLOUDFLARE_AI_GATEWAY_TOKEN` | AI Gateway runtime token (Run permission) |
| `SENTRY_DSN` | Worker DSN |

OAuth callback URLs (configure in the respective provider consoles):
- Google: `https://app.getdreamforge.com/api/auth/callback/google`
- GitHub (sign-in): `https://app.getdreamforge.com/api/auth/callback/github`
- GitHub (exporter): `https://app.getdreamforge.com/api/github-exporter/callback`

---

## Deploy

Local deploy:

```bash
npm run deploy
```

CI deploy: pushes to `main` trigger a GitHub Actions workflow (`Release`) that runs `wrangler deploy`. Cloudflare Workers Builds is **not** the source of deploys — disconnect it if it's still attached.

Migrations:

```bash
npm run db:migrate:remote   # CI=true wrangler d1 migrations apply vibesdk-db --remote
```

---

## Security model (summary)

- **Auth**: CSRF double-submit cookie + `SameSite=Strict` + TTL + rotation on auth, OAuth state HMAC with HKDF-derived key, `__Host-` cookie prefix in prod, per-record salts, `token.userId` cross-check.
- **AI Gateway proxy** (`/api/proxy/openai`): three independent gates — Origin allowlist (only `*.app.getdreamforge.com` preview subdomains), JWT verify, D1 ownership cross-check.
- **JWT secret validation** at worker boot — weak secrets are rejected.
- **Rate limiting**: first-class Cloudflare `ratelimits` (GA 2025); auth limiter **fails closed** on DO error.
- **BYOP repo handling**: shell-escaped credential-helper script via printf, repository URL regex-validated to `github.com` only, GitHub token format validated at storage.
- **Sentry**: worker + every Durable Object instrumented, security events captured.
- **Drizzle**: pinned to `^0.45.2` (clears GHSA-gpj5-g38j-94v9).

For the full security posture and outstanding hardening backlog, see [`MAY_2026_CODE_REVIEW.md`](./MAY_2026_CODE_REVIEW.md) and the three track deep-dives (`REVIEW_T1_SECURITY_DEPS_CI.md`, `REVIEW_T2_QUALITY_ARCH.md`, `REVIEW_T3_DOCS_TESTS_A11Y.md`).

---

## Documentation

- **Setup**: [`docs/setup.md`](./docs/setup.md)
- **BYOP feature**: [`docs/byop/README.md`](./docs/byop/README.md)
- **Architecture diagrams**: [`docs/architecture-diagrams.md`](./docs/architecture-diagrams.md)
- **Code review (May 2026)**: [`MAY_2026_CODE_REVIEW.md`](./MAY_2026_CODE_REVIEW.md)
- **Agent context (this repo)**: [`CLAUDE.md`](./CLAUDE.md)
- **Session-scoped planning artifacts**: [`docs/archives/`](./docs/archives/)

---

## Upstream relationship

This fork tracks `cloudflare/vibesdk` selectively. Notable divergences:

- **Secrets storage** uses D1 (`worker/database/services/SecretsService.ts`), not the upstream `UserSecretsStore` DO (which was deleted in DO migration v5 — see `wrangler.jsonc` for the documented v3 phantom-class / v4 / v5 tombstone history).
- **Rate limits** use the first-class `ratelimits` config form, not the legacy `unsafe.bindings` shape.
- **Sentry** is wired live (`Sentry.withSentry()` on the worker, `Sentry.instrumentDurableObjectWithSentry()` on every DO, `initHonoSentry()` in the app).
- **JWT secret validator** is enforced at boot.
- **Auth rate-limiter** fails closed.
- **Routing** has an explicit marketing-domain branch in addition to the main app and user-app-subdomain branches.
- **BYOP** is a first-class recovered feature with a dedicated `CodebaseAnalyzer` Durable Object (v6 migration).
- **`agents@0.1.6` is pinned** pending the deferred mega-bundle (PRs 5/6/7/8 unified).

---

## License

MIT — see [`LICENSE`](./LICENSE).
