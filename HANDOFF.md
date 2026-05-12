# WIP Integration Handoff — 2026-05-12

You're on branch `wip/integration-2026-05-12`. This is a snapshot/staging branch
created to consolidate work that lived on two `origin/claude/agent-*` branches
into one place where it can be tested and cherry-picked onto `main` selectively.
`main` itself was untouched.

---

## TL;DR

- **Live worker is 5 months stale.** Last deploy: `2025-12-15 19:35:25 UTC` from
  a local `wrangler deploy` — see "Deployment facts" below.
- **`main` HEAD = `95dc71c`** (`fix: clarify Cloudflare WARP note...`,
  2025-10-24). The deployed worker matches `main` exactly.
- **This branch = `main` + 5 cherry-picked commits** of WIP that hasn't shipped:
  landing pages, dual-domain arch, competitive analysis, auto-deploy workflow,
  and a landing-page dev-env fix.
- **Goal:** test combinations here; cherry-pick what you want onto `main` one at
  a time; deploy when ready. Don't merge this branch wholesale into `main` —
  see "Known issues" first.

---

## Deployment facts

- **GitHub repo:** https://github.com/QuicksilverSlick/dreamforge-cf
- **Cloudflare account:** `russelledeming@gmail.com` —
  account ID `00354a4cf3fd5ff6f93e809b915f0f58`
- **Worker name:** `dreamforge-cf`
- **Custom domain:** `app.getdreamforge.com` (zone `157d05cb90f7190794c33e37bef447db`)
- **Last deploy:** `2025-12-15T19:35:25Z`,
  version `beefe9bc-f463-48a5-bb37-c3d8c8bb4582`,
  source = `wrangler` (local CLI, not CI), author = `russelledeming@gmail.com`
- **Total versions retained on Cloudflare:** 100 (the cap). All sit between
  2025-12-08 and 2025-12-15. Anything before that has aged out.
- **Auto-deploy GHA:** present on `wip/integration-2026-05-12` (cherry-picked)
  but **not yet on `main`**. Until you pick `9653e4c` onto `main`, every deploy
  must be a manual local `wrangler deploy` or a manual `workflow_dispatch` of
  `.github/workflows/deploy.yml`.

---

## Branch landscape

| Branch | Where | What |
|---|---|---|
| `main` | local + origin | Deployed state. `95dc71c`. Don't push speculative work here. |
| `wip/integration-2026-05-12` | local + origin | **You are here.** Staging for cherry-pick. |
| `origin/claude/agent-team-analysis-011CUbsEF3rZf3pqgdUL68or` | origin only | Original source of 4 of the 5 picks. **Keep — raw history.** |
| `origin/claude/agent-system-overview-011CUQKNu4K4Fpra2hn4mQG6` | origin only | Original source of the auto-deploy commit. **Keep — raw history.** |
| `origin/backup/pre-sync-2025102{7,9}_*` (3 branches) | origin only | Pre-upstream-sync backups from late October. Leave alone. |

---

## What's on this branch (5 commits beyond `main`)

In application order (oldest first):

| SHA on this branch | Original SHA | Date | Summary |
|---|---|---|---|
| `9653e4c` | `a814630` | 2025-10-24 | enable auto-deploy on `main` + `claude/**` (`.github/workflows/deploy.yml`) |
| `701e0c8` | `4afd167` | 2025-10-29 | competitive analysis docs (4 root-level `.md` files: V0/Bolt/Lovable/Dreamforge) |
| `46bc4d3` | `e18bf3a` | 2025-10-29 | StoryBrand 2.0 landing pages + pricing strategy (18 files under `features/enterprise-landing/`, `landing-pages/individuals/`, plus root pricing docs) |
| `85812d3` | `b7ef38a` | 2025-10-29 | dual-domain architecture: landing-page static assets under `worker/static/landing-pages/`, `scripts/copy-landing-pages.ts`, DNS docs |
| `041f119` | `5646aaa` | 2025-10-30 | landing-page local dev config — **also adds `package-lock.json` (~29k lines)** |

### One commit was skipped

`a3362b5` — "feat: disable email whitelisting" — cherry-pick was empty because
`wrangler.jsonc` already has `"ALLOWED_EMAIL": ""` on `main`. The change is
already live; nothing to do.

---

## Known issues / gotchas

1. **`041f119` adds `package-lock.json` to a Bun repo.** The project uses
   `bun.lock`. Don't carry the npm lockfile onto `main`. When picking that
   commit:
   ```sh
   git cherry-pick -n 041f119
   git restore --staged package-lock.json
   rm package-lock.json
   git commit -C 041f119
   ```
2. **Auto-deploy commit `9653e4c` is a foot-gun once on `main`.** It re-enables
   `push: branches: [main, 'claude/**']` in the deploy workflow. The moment you
   merge it to `main` and push, the next push to `main` (or any `claude/**`
   branch) auto-deploys. Confirm secrets and bindings are correct first
   (`CLOUDFLARE_API_TOKEN` in repo secrets, etc.) before picking it.
3. **The four root-level `.md` competitive-analysis files** (`701e0c8`) clutter
   the repo root. Consider moving into `docs/research/` or similar before
   committing to `main` — your call, but easier to do as you pick than later.
4. **`worker/static/landing-pages/`** (`85812d3`) — verify the worker's asset
   serving config in `wrangler.jsonc` (`assets.directory = "dist"`) actually
   surfaces these files, or whether `scripts/copy-landing-pages.ts` is meant to
   copy them into `dist/` at build time. Test locally before deploy.
5. **`.dev.vars.example`** had been deleted in the working tree of the previous
   session's main checkout; restored before this branch was created. If you see
   it missing again, `git restore .dev.vars.example`.
6. **npm `EOVERRIDE` error on `npx`.** `package.json` has
   `"vite": "npm:rolldown-vite@^7.1.13"` as a direct dep AND as an override —
   npm refuses. Use `bunx` / `bun install` / the binaries in
   `node_modules/.bin/` directly. Don't run `npm install`.

---

## Setup on this device

The integration branch is already on `origin`, so:

```sh
git fetch origin
git worktree add .claude/worktrees/wip-integration wip/integration-2026-05-12
cd .claude/worktrees/wip-integration
bun install        # NOT npm install — see gotcha #6
```

To work on `main` simultaneously, use the existing checkout (or another
worktree). The primary checkout is at the repo root and stays on `main`.

---

## Suggested cherry-pick workflow

1. Decide which commit to land next (likely order: `9653e4c` last, after the
   content fixes are stable, so you don't auto-deploy mid-experiment).
2. From a worktree on `main`:
   ```sh
   git checkout main
   git cherry-pick <sha>          # use `-n` to inspect before committing
   ```
3. Test locally:
   ```sh
   bun run local                  # worker via wrangler
   bun run dev                    # vite frontend (separate terminal)
   ```
4. Deploy manually (until `9653e4c` is on `main`):
   ```sh
   bun run deploy
   ```
   or trigger the `Deploy to Cloudflare Workers` workflow via
   `workflow_dispatch` from the Actions tab.
5. Verify on https://app.getdreamforge.com.

---

## What NOT to do

- **Don't merge `wip/integration-2026-05-12` → `main` wholesale.** The
  `package-lock.json` and the four root-level analysis docs would land as-is.
- **Don't delete the `origin/claude/agent-*` branches** until everything's been
  picked and shipped. They're the immutable source of truth for these commits.
- **Don't rebase or force-push `wip/integration-2026-05-12`** if anyone else
  could be using it — it's now a shared ref on `origin`.
- **Don't run `npm install`.** See gotcha #6.

---

## Reference: how this branch was built

Created from `origin/main` (`95dc71c`) on 2026-05-12. Cherry-picked the 6
commits from the two `origin/claude/agent-*` branches in chronological order;
`a3362b5` skipped as empty (already on main). Pushed to
`origin/wip/integration-2026-05-12`. No deploy was triggered because the
auto-deploy workflow only matches `main` and `claude/**`.
