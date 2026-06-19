# Handoff — Admin Platform Continuation (Phase 1: Admin Dashboard)

> **Purpose:** self-contained kickoff for a NEW Claude Code session to continue the multi-tenant
> admin/support platform work. Assumes no memory of the session that produced it. Read this top to
> bottom before touching code.

---

## 0. How to use this
Paste the kickoff prompt at the very bottom (§8) as the first message of a new session. Then read the
two in-repo design docs referenced in §6 before writing any code.

## 1. Project context
- Repo: `dreamforge-cf` (fork of `cloudflare/vibesdk`), deployed as worker **`dreamforge-cf`**, live at
  **app.getdreamforge.com**. React 19 + Vite SPA front end; Cloudflare Workers + Hono API; D1 (Drizzle),
  Durable Objects, R2, KV, AI Gateway, Containers.
- This is a **productionized consumer product**, not the upstream dev kit. Auth, secrets (D1 BYOK), rate
  limits, routing, and observability have diverged from upstream and are security-hardened.
- The near-term product direction is a **multi-tenant SaaS**: (a) an operator **admin dashboard**, (b)
  **organizations** (org-with-users OR solo-user-no-org), (c) **customer support via the dashboard**.
  Upstream has **none** of this — it's all greenfield/net-new for us.

## 2. Current state — Phase 0 is LIVE (do not redo)
Phase 0 ("identity keystone") shipped the role foundation **dark** (no admin UI yet). In production now:
- **`users.role`** column — enum `superadmin | admin | user | support | ai_support | ai_admin`, default
  `user` (migration `0008`, applied to prod D1 + recorded in the `d1_migrations` ledger). `admin` is the
  **org-admin** role, dormant until Phase 2.
- **Role guards** in `worker/middleware/auth/routeAuth.ts`: `AuthConfig.superadminOnly` (only `superadmin`)
  and `AuthConfig.platformStaff` (`PLATFORM_STAFF_ROLES` = superadmin + support + ai_support + ai_admin;
  **excludes org `admin` and `user`**). New fail-closed `'role'` `AuthLevel`. **Role is resolved
  per-request from D1, never from the JWT** (instant revocation). No route is gated yet (dark).
- **Account-status enforcement** — suspended/inactive users get a 403 *"Your account has been suspended —
  please contact support."* at email login AND OAuth callback, and are filtered out per-request in
  `AuthService.getUserForAuth` (NULL-tolerant).
- **Operator-only mutators** (unwired to any route): `UserService.setRole/suspendUser/reactivateUser`.
  `role` is unreachable via profile-update or OAuth upsert.
- **`mapUserResponse`** surfaces `role`, so `/api/auth/profile` returns it.
- Seed script `scripts/seed-superadmins.ts` exists (env/file creds, gitignored, PBKDF2-identical to
  `PasswordService`, dry-run default).
- A CSRF first-login fix shipped separately (PR #141): client resyncs the CSRF token after
  login/register/verify/logout.

**Accounts today:** owner `russelledeming@gmail.com` = `superadmin`. Two internal test accounts
(`gbrown@getdreamforge.com`, `drwebb@getdreamforge.com`) exist as `user` (they test building apps).

## 3. What Phase 1 must build (the actual admin dashboard + read-only support)
Goal: turn the superadmin role into a visible operator console. Suggested scope, **read-only first**:
1. **Promote a role tier for staff** if needed (decide: keep `superadmin`-only for now, or also let
   `support`/`ai_support` into read views via `platformStaff`).
2. **Admin API** — new `/api/admin/*` route group + controller, gated by `AuthConfig.superadminOnly`
   (and/or `platformStaff` for read-only): user search/list, user detail (their apps/builds/sessions/usage),
   app/build drill-down. Add cross-user read methods to `UserService`/`AppService`/`AnalyticsService`
   (today everything is self-scoped `userId === self`).
3. **Account actions** — wire the existing `UserService.suspendUser/reactivateUser/setRole` behind
   `superadminOnly`. (Suspension enforcement already works end-to-end.)
4. **Audit logging** — every cross-user view/action writes to the existing `auditLogs` table
   (`worker/database/schema.ts`; write pattern in `SessionService`). MANDATORY for a hardened SaaS.
5. **Frontend** — a role-gated `/admin` route group + a role-aware variant of
   `src/routes/protected-route.tsx`, plus the dashboard UI (user list, detail, drill-down). Read `role`
   from `/api/auth/profile` (already returned).
6. **Sentry link** — Sentry user context is already set per request (`routeAuth.ts`); a user-detail page
   can deep-link to that user's errors.

Phases 2 (organizations / multi-tenancy) and 3 (billing) come after — see the roadmap memory.

## 4. NON-NEGOTIABLE security guardrails
- Admin power comes from the DB `role` column — **never** from `RATE_LIMIT_EXEMPT_USER_IDS` (that's a
  billing-bypass allowlist, a different trust domain).
- Resolve role **per request** from D1, not from the JWT.
- **Read-only first.** Support views must **NEVER decrypt** BYOK secrets/GitHub tokens — expose
  `keyPreview` only. "Act as a user"/impersonation is a separate, stronger, fully-audited gate (defer it).
- `role`/status must stay unreachable from any user-facing path (profile update, OAuth upsert).
- Admin checks **fail closed**. Keep CSRF / `__Host-` cookie / origin / HMAC-OAuth-state hardening intact.
- Drizzle prepared placeholders for any admin search — never `sql.raw` with operator input.

## 5. CRITICAL operational rules (this repo bites the unwary)
- **Strict PR flow. NEVER commit to `main`.** `git checkout -b` BEFORE implementing. `gh pr create
  --repo QuicksilverSlick/dreamforge-cf`. Merge auto-deploys to prod (`.github/workflows/deploy.yml`:
  build → wrangler deploy → /api/health → auto-rollback). Never advise a manual `npm run deploy`. Never
  `git add -A` (sweeps `.claude/` scratch + `.playwright-mcp/`).
- **Gate before PR:** `npm run typecheck` (0), `npm run lint` (0), `npm run test` (Workers/vitest pool),
  `node_modules/.bin/vite build`. On Windows use **bun.exe** for installs; vitest teardown prints benign
  `EBUSY` warnings. Baseline ≈ 264 passed / 1 skipped + **2 pre-existing BYOP failures that are acceptable**.
- **Migrations (IMPORTANT):** local `wrangler d1 ... --remote` currently **fails with `7403`
  account-not-authorized**, so `npm run db:migrate:remote` is broken locally. Apply migrations to prod
  **via the Cloudflare D1 MCP** (`d1_database_query`, database_id `0d8d35e2-91e1-4231-90b1-f49cc313876c`):
  run the migration's SQL statements, then `INSERT INTO d1_migrations (name, applied_at) VALUES
  ('00NN_name.sql', CURRENT_TIMESTAMP)` to keep the ledger consistent. **ROLLOUT ORDER:** apply the
  migration to prod D1 **BEFORE** the worker that reads the new column deploys — additive columns are
  backward-compatible (the old worker ignores them), so the safe sequence is migrate-prod → merge PR →
  worker deploys against a DB that already has the column. (Deploy.yml has no migrate step — a worthwhile
  fix once wrangler remote-D1 auth is sorted.)
- **Frontend changes can't be previewed locally on Windows** (`@cloudflare/vite-plugin` refuses local dev
  with containers declared) — verify frontend behavior on prod after deploy, or via the served bundle.
- The edge zone caches aggressively; app-domain HTML is `no-store` and deploys run a cache-purge step.
  Verify a frontend deploy reached users by checking the served `index-*.js` bundle hash changed.

## 6. Key files & in-repo docs to read first
- `docs/specs/PHASE-0-IDENTITY-KEYSTONE.md` — the full Phase 0 design (roles, guards, migration, seeding).
- `worker/middleware/auth/routeAuth.ts` — `AuthLevel`, `AuthConfig` (incl. `superadminOnly`/`platformStaff`),
  `routeAuthChecks`, `enforceAuthRequirement`, `checkAppOwnership`.
- `worker/types/auth-types.ts` — `UserRole`, `PLATFORM_STAFF_ROLES`, `AuthUser`.
- `worker/database/schema.ts` — `users` (now with `role`), `auditLogs`, all `userId`-scoped tables.
- `worker/database/services/AuthService.ts` (`getUserForAuth`, login/OAuth status gates),
  `UserService.ts` (`setRole/suspendUser/reactivateUser`, `findUser`).
- `worker/api/routes/index.ts` (route mounting), `analyticsRoutes.ts`, `statsRoutes.ts`.
- `CLAUDE.md` — repo conventions (note: its "simpleGeneratorAgent is the live agent" line is STALE; the
  live DO is `CodeGeneratorAgent` from `worker/agents/core/codingAgent.ts`).

## 7. Open follow-ups (not Phase 1, but track them)
- Fix the wrangler remote-D1 `7403` auth so `npm run db:migrate:remote` works locally again; consider
  adding a `wrangler d1 migrations apply --remote` step to `deploy.yml` (verify the CI token has D1 perms).
- Test accounts are plain `user`s now → subject to normal rate limits; add their ids to
  `RATE_LIMIT_EXEMPT_USER_IDS` if heavy build-testing hits the 100-credits/hr LLM cap.

## 8. Paste-this kickoff prompt for the new session
```
Continue the Dreamforge multi-tenant admin platform work. Read docs/handoff/PHASE-1-ADMIN-DASHBOARD-KICKOFF.md
in full first, then docs/specs/PHASE-0-IDENTITY-KEYSTONE.md. Phase 0 (roles + admin guards + suspension
enforcement) is ALREADY LIVE in prod — do not redo it. Build Phase 1: a read-only operator admin dashboard
(/api/admin/* gated by AuthConfig.superadminOnly, cross-user read APIs, account suspend/reactivate, audit
logging to the auditLogs table, and a role-gated /admin frontend). Follow the security guardrails and the
strict PR/gate/migration rules in the handoff doc — especially: never commit to main, gate before PR,
apply any migration to prod D1 via the Cloudflare D1 MCP BEFORE the worker deploys, and never expose
decrypted secrets in support views. Start by proposing a concrete Phase 1 implementation plan for my review
before writing code.
```
