# GitHub Actions workflows

This directory defines the deployment contract for `dreamforge-cf`. **The contract is the source of truth — read this before changing `wrangler.jsonc` deploy semantics or the workflow YAML.**

## The deploy contract

1. **No direct commits to `main`.** Every change reaches `main` via PR. Branch protection enforces this.
2. **Every PR runs CI** ([`ci.yml`](./ci.yml)): install, typecheck, build, and `wrangler types` config validation. All hard gates. Lint runs in parallel as a non-blocking soft signal until Phase D (when the existing 40 errors are fixed).
   - **Note:** we deliberately do **not** run `wrangler deploy --dry-run` in CI. This project bundles the Worker through `@cloudflare/vite-plugin` (see [`vite.config.ts`](../../vite.config.ts)), not wrangler's built-in esbuild. `wrangler deploy --dry-run` runs its own esbuild that can't resolve the Vite-only `worker/*` and `shared/*` path aliases. The **Build** job (`bun run build`) is the real bundle gate — it exercises the same path that production deploys use. `wrangler types` covers `wrangler.jsonc` syntax, binding references, and DO migration consistency.
3. **Merge to `main` triggers deploy** ([`deploy.yml`](./deploy.yml)): install, build, deploy to Cloudflare, health check `https://app.getdreamforge.com/api/health`, auto-rollback on health-check failure.
4. **No deploys from feature branches.** The previous `claude/**` push trigger was a foot-gun and is intentionally removed.
5. **Manual deploys** are possible via `workflow_dispatch` on `deploy.yml` for emergency cases (e.g. cherry-pick a fix without going through PR). Use sparingly and document the reason in the input field.
6. **The Worker and the templates deploy on separate tracks.** `deploy.yml` deploys **only the Worker bundle**. The app-generation **templates** (the zips + catalog in the `vibesdk-templates` R2 bucket) deploy via [`deploy-templates.yml`](./deploy-templates.yml) — see "[Template deploy contract](#template-deploy-contract)". A change to the templates fork does **not** reach production until that workflow runs.

## Workflows

| File | When | Purpose |
|---|---|---|
| [`ci.yml`](./ci.yml) | PR to `main` | Pre-merge gate — validates every PR before it can be merged |
| [`deploy.yml`](./deploy.yml) | Push to `main`, `workflow_dispatch` | Deploy the **Worker** to Cloudflare with health-check + rollback |
| [`deploy-templates.yml`](./deploy-templates.yml) | `repository_dispatch` from the templates fork, `workflow_dispatch` | Generate + upload **templates** to the `vibesdk-templates` R2 bucket |
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

## Template deploy contract

Generated apps are scaffolded from **templates** stored as zips + a `template_catalog.json` in the **`vibesdk-templates` R2 bucket** (bound as `TEMPLATES_BUCKET`). These are **not** part of the Worker bundle and **`deploy.yml` never touches them** — a template fix is not live until [`deploy-templates.yml`](./deploy-templates.yml) runs.

### Source of truth: the owned fork

`wrangler.jsonc` → `vars.TEMPLATES_REPOSITORY` points at **`QuicksilverSlick/vibesdk-templates`** (our fork of `cloudflare/vibesdk-templates`). Templates are *generated* there (`tools/generate_templates.py` from `definitions/*` + `reference/*`), not stored as plain dirs — fix cross-cutting things (e.g. Vite config) in `reference/*`. Keep `upstream` as a remote on the fork and periodically merge it; our patch set is intentionally small.

### How a template change reaches production

1. Land the change on the fork's `main` (PR → merge).
2. The fork's push-to-`main` workflow fires a **`repository_dispatch` (`templates-updated`)** at this repo, which runs `deploy-templates.yml`.
3. `deploy-templates.yml` checks out the fork, runs `deploy_templates.sh` (generate → zip via `create_zip.py` → `wrangler r2 object put … --remote`), uploading every template zip + the catalog to R2.
4. The next app generation pulls the updated templates. (No Worker redeploy needed.)

You can also run it **manually** via `workflow_dispatch` (optionally pin a `templates_ref`) — use this for the first deploy, to redeploy after fixing a broken template, or if the auto-trigger isn't wired yet.

> The legacy path — `npm run deploy` (`scripts/deploy.ts`) — still deploys templates as part of a full local deploy. `deploy-templates.yml` is the CI equivalent and the preferred path: it runs on Linux with the repo Actions secrets, is monitorable, and doesn't require a local `.prod.vars`.

### Secrets

`deploy-templates.yml` (in **this** repo) reuses the existing `CLOUDFLARE_API_TOKEN` (needs **Workers R2 Storage → Edit**) and `CLOUDFLARE_ACCOUNT_ID` Actions secrets — no new secret needed for manual runs.

The **auto-on-fork-change** path needs one secret **in the fork** (`QuicksilverSlick/vibesdk-templates` → Settings → Secrets → Actions):

| Secret (in the fork) | Value |
|---|---|
| `DISPATCH_TOKEN` | A GitHub token (classic `repo`, or fine-grained with **Contents: read+write** on `dreamforge-cf`) so the fork can POST a `repository_dispatch` to `dreamforge-cf`. Without it, the auto-trigger no-ops and you deploy via `workflow_dispatch`. |

### Monitoring & surfacing deployment issues

- **Watch a run:** `gh run watch <id> --repo QuicksilverSlick/dreamforge-cf --exit-status`, or the Actions tab → "Deploy Templates to R2".
- **List recent template deploys:** `gh run list --repo QuicksilverSlick/dreamforge-cf --workflow=deploy-templates.yml`.
- **What deployed:** the run **Summary** records the source fork, ref, bucket, and trigger.
- **Rollback reference:** each run uploads the *previous* `template_catalog.json` as the **`prev-template-catalog`** artifact (30-day retention) before overwriting — use it to see what changed / what to restore.
- **Verify what's live in R2:** `wrangler r2 object get vibesdk-templates/template_catalog.json --remote --file=- ` (or download a specific `<template>.zip` and inspect, as we did to confirm a zip wasn't corrupt).

### Troubleshooting

| Symptom | Likely cause / action |
|---|---|
| All new app builds fail to scaffold | A bad template zip/catalog was uploaded. Re-run `deploy-templates.yml` from a known-good fork SHA (`templates_ref`), or fix-forward on the fork and re-deploy. Uploads are the last step, so a *failed* run leaves R2 unchanged. |
| `wrangler r2 object put … 10000 Authentication error` | `CLOUDFLARE_API_TOKEN` lacks **R2 Storage → Edit**, or wrong `CLOUDFLARE_ACCOUNT_ID`. |
| `Failed to download/extract template … extra bytes / bad zipfile` reported by the sandbox | The served zip is corrupt **or** the running sandbox instance has a stale/partial cached copy. Confirm the R2 object is a valid zip (download + `unzip -t`); if R2 is fine, the wedged instance recovers on a fresh build. |
| Auto-deploy didn't fire on a fork change | `DISPATCH_TOKEN` missing/expired in the fork, or the change didn't touch a watched path. Trigger `deploy-templates.yml` manually. |
| Template change deployed but apps still show old behaviour | A *running* sandbox instance keeps its image/template until it recycles; new instances pick up the change. |

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
