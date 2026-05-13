# GitHub Actions workflows

This directory defines the deployment contract for `dreamforge-cf`. **The contract is the source of truth — read this before changing `wrangler.jsonc` deploy semantics or the workflow YAML.**

## The deploy contract

1. **No direct commits to `main`.** Every change reaches `main` via PR. Branch protection enforces this.
2. **Every PR runs CI** ([`ci.yml`](./ci.yml)): install, typecheck, build, and `wrangler types` config validation. All hard gates. Lint runs in parallel as a non-blocking soft signal until Phase D (when the existing 40 errors are fixed).
   - **Note:** we deliberately do **not** run `wrangler deploy --dry-run` in CI. This project bundles the Worker through `@cloudflare/vite-plugin` (see [`vite.config.ts`](../../vite.config.ts)), not wrangler's built-in esbuild. `wrangler deploy --dry-run` runs its own esbuild that can't resolve the Vite-only `worker/*` and `shared/*` path aliases. The **Build** job (`bun run build`) is the real bundle gate — it exercises the same path that production deploys use. `wrangler types` covers `wrangler.jsonc` syntax, binding references, and DO migration consistency.
3. **Merge to `main` triggers deploy** ([`deploy.yml`](./deploy.yml)): install, build, deploy to Cloudflare, health check `https://app.getdreamforge.com/api/health`, auto-rollback on health-check failure.
4. **No deploys from feature branches.** The previous `claude/**` push trigger was a foot-gun and is intentionally removed.
5. **Manual deploys** are possible via `workflow_dispatch` on `deploy.yml` for emergency cases (e.g. cherry-pick a fix without going through PR). Use sparingly and document the reason in the input field.

## Workflows

| File | When | Purpose |
|---|---|---|
| [`ci.yml`](./ci.yml) | PR to `main` | Pre-merge gate — validates every PR before it can be merged |
| [`deploy.yml`](./deploy.yml) | Push to `main`, `workflow_dispatch` | Deploy to Cloudflare with health-check + rollback |
| [`upstream-sync-manual.yml`](./upstream-sync-manual.yml) | `workflow_dispatch` only | Sync from `cloudflare/vibesdk` upstream (see [`UPSTREAM_SYNC.md`](../../UPSTREAM_SYNC.md)) |
| [`upstream-notifications.yml`](./upstream-notifications.yml) | Weekly cron | Open a GitHub issue summarising new upstream commits |

## Required repository secrets

The deploy workflow needs these to be set under **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Scoped API token — see "Cloudflare token scopes" below. **Do not** use a global token. |
| `CLOUDFLARE_ACCOUNT_ID` | `00354a4cf3fd5ff6f93e809b915f0f58` (not strictly secret, kept here so it can be rotated alongside the token) |
| `ISSUE_TOKEN` | Already set. Used by `upstream-notifications.yml` to create issues from the bot context. |

### Cloudflare token scopes

Create the token at https://dash.cloudflare.com/profile/api-tokens with these account-scoped permissions on account `00354a4cf3fd5ff6f93e809b915f0f58`:

- Account → Workers Scripts → Edit
- Account → Workers R2 Storage → Edit
- Account → Workers KV Storage → Edit
- Account → D1 → Edit
- Account → Durable Objects → Edit
- Account → Account Settings → Read
- Zone → Workers Routes → Edit (zone `getdreamforge.com`)
- User → User Details → Read

The "Edit Cloudflare Workers" template covers most of these — add D1 and the zone scope manually.

## Health check contract

`deploy.yml` requires `GET https://app.getdreamforge.com/api/health` to return `200 OK` with a body containing `"status":"ok"`. The handler lives in [`worker/api/controllers/status/`](../../worker/api/controllers/status/) (`/api/health`). **Do not break this endpoint** — if you do, every future deploy will auto-rollback.

## Rollback semantics

If the deploy succeeds but the health check fails (10 retries × 6s = ~60s), the workflow runs `wrangler rollback` to the version that was active immediately before the deploy. This restores the Worker but **does not** revert the merge commit on `main` — fix forward with another PR, or revert the merge manually if needed.

If the deploy *itself* fails (e.g. `wrangler deploy` errors), there is nothing to roll back from — the previous version remains active on Cloudflare.

## Deploy metadata

We use Cloudflare's built-in `CF_VERSION_METADATA` binding (configured in `wrangler.jsonc`) for runtime version introspection. At runtime, code can read:

```ts
env.CF_VERSION_METADATA.id         // version UUID
env.CF_VERSION_METADATA.tag        // version tag if set
env.CF_VERSION_METADATA.timestamp  // CF-side deploy timestamp
```

The git SHA is embedded in the deploy *message* (visible via `wrangler deployments list`) for correlating CF versions to commits. **Phase F follow-up:** surface a `/api/version` route that returns the version metadata + git SHA from the deploy message, for support/debugging.

## Local validation

Before opening a PR you can run the same gates locally:

```sh
bun install
./node_modules/.bin/tsc -b                            # typecheck — must pass
bun run build                                         # build (Vite + @cloudflare/vite-plugin)
./node_modules/.bin/wrangler types --include-runtime false   # wrangler.jsonc validation
./node_modules/.bin/eslint .                          # lint (soft until Phase D)
```

`bun run build` is the real bundle gate — if it succeeds locally it will succeed in CI.

### How the build / deploy hand-off works

`bun run build` (Vite + `@cloudflare/vite-plugin`) emits:

- `dist/client/` — the frontend SPA
- `dist/dreamforge_cf/index.js` — the pre-bundled Worker
- `dist/dreamforge_cf/wrangler.json` — a wrangler config with `"no_bundle": true` that points at the pre-bundled `index.js` and the sibling `../client/` assets

The deploy workflow runs `wrangler deploy -c dist/dreamforge_cf/wrangler.json`. The `-c` flag is essential — without it, wrangler reads the source `wrangler.jsonc` and re-bundles `worker/index.ts` with its built-in esbuild, which cannot resolve the Vite-only `worker/*` and `shared/*` path aliases.

**Do not** use `wrangler deploy --dry-run` against the source `wrangler.jsonc` for local validation — it will fail with `Could not resolve "worker/..."` errors that don't reflect real deploy behaviour. If you want a deploy dry-run locally, build first, then:

```sh
./node_modules/.bin/wrangler deploy --dry-run -c dist/dreamforge_cf/wrangler.json --outdir=/tmp/dist-worker
```

(On Windows, this currently hits a `UV_HANDLE_CLOSING` libuv crash in wrangler 4.42 — fixed in 4.87+. CI runs on Linux so this doesn't affect deploys.)
