# Phase 0 — Identity Keystone (Roles + Admin Auth Tier + Account-Status Enforcement)

> **Status:** DRAFT for review — no code yet.
> **Author:** dev lead, 2026-06-13.
> **Scope owner decision required** on the four open questions in §10 before implementation.

## 1. Purpose & context

The near-term product goal is a multi-tenant SaaS with (a) an operator **admin dashboard**, (b) **organizations** (org-with-users *or* solo user), and (c) **customer support via the dashboard**. A readiness assessment (2026-06-13) found that **all three depend on one foundational change that does not exist today: a notion of platform "role."**

Today:
- `AuthLevel` is exactly `'public' | 'authenticated' | 'owner-only'` ([routeAuth.ts:23](../../worker/middleware/auth/routeAuth.ts)). There is **no admin tier**.
- The `users` table has **no `role`/`isAdmin` column** ([schema.ts:16–59](../../worker/database/schema.ts)).
- The only "operator" concept is the `RATE_LIMIT_EXEMPT_USER_IDS` allowlist secret ([rateLimits.ts:203](../../worker/services/rate-limit/rateLimits.ts)) — a **billing-bypass**, not an authorization role. It must **never** be reused as the source of admin power (different trust domain).
- `users.isSuspended` and `users.isActive` exist ([schema.ts:41–42](../../worker/database/schema.ts)) but are **dead columns** — never checked in `login`/`getUserForAuth`, so a suspended user authenticates normally. (Soft-delete `deletedAt` *is* enforced at [AuthService.ts:188](../../worker/database/services/AuthService.ts) and `:712`.)

**Phase 0 delivers the role foundation + admin route guard + account-status enforcement, shipped "dark"** (no admin routes or UI yet — those are Phase 1). It is almost entirely additive and has near-zero behavior change for normal users.

This phase unblocks: Phase 1 (operator admin + read-only support), Phase 2 (organizations), Phase 3 (billing).

## 2. Goals / Non-goals

**Goals**
1. Add a platform `role` to the user identity (`'user' | 'admin'`), resolved per-request (not baked into the JWT) for instant revocation.
2. Add an `adminOnly` auth tier (`AuthConfig.adminOnly`) that fails closed.
3. Enforce account status: a `isSuspended` (and `isActive === false`) user can no longer authenticate.
4. Make `role` non-escalatable: it can never be set through any user-facing path (profile update, OAuth upsert).
5. Surface `role` on the auth/profile response so the frontend can later render an admin entry point.
6. Seed the platform owner as the bootstrap `admin`.

**Non-goals (explicitly deferred)**
- Organizations / `orgId` / membership / org-scoped ownership → **Phase 2**.
- Admin routes, controllers, dashboard UI, cross-user read APIs → **Phase 1**.
- Customer-support read views, "act-as"/impersonation, audit-log writes for admin actions → **Phase 1** (the `auditLogs` table already exists at [schema.ts:511](../../worker/database/schema.ts) and is the intended sink).
- Billing / plans / metering → **Phase 3**.
- A separate `'support'` role tier (see §10 Q1).

## 3. Design decisions

**All four open questions were resolved by the owner (2026-06-13); choices below are final/implemented.**

| Decision | Choice | Rationale |
|---|---|---|
| Role storage | `users.role TEXT NOT NULL DEFAULT 'user'` | Additive, safe default; backfill owner to `'superadmin'`. |
| Role values | `superadmin \| admin \| user \| support \| ai_support \| ai_admin` | Owner's full set. `superadmin` = platform operator; `admin` = **org-admin** (dormant until Phase 2 org scoping); `support`/`ai_support`/`ai_admin` = human/AI staff agents. |
| Guard tiers | `AuthConfig.superadminOnly` (only `superadmin`) and `AuthConfig.platformStaff` (`superadmin`+`support`+`ai_support`+`ai_admin`; **excludes org `admin` and `user`**) | Lets Phase 1 gate destructive actions to superadmin while support roles get read surfaces. Backed by `PLATFORM_STAFF_ROLES` in auth-types. Fails closed. |
| Role in JWT? | **No** | Re-resolved from D1 every request via `getUserForAuth`. Instant revocation; no `jwtUtils`/`TokenPayload` change. |
| Admin identification | DB `role` column, **not** `RATE_LIMIT_EXEMPT_USER_IDS` | Authz and billing-exemption are different trust domains. |
| Account-status enforcement | Suspended/inactive rejected at `login` (friendly 403 "account suspended — contact support") **and** filtered out in `getUserForAuth` WHERE (every request) | Closes the live latent bug where `isSuspended` was never checked. |
| `orgId` pre-add now? | **No** | Org-free Phase 0; `orgId` lands with the Phase 2 org model + isolation tests. |

## 4. Data model change

### 4.1 Schema ([worker/database/schema.ts](../../worker/database/schema.ts), `users` table)
Add inside the "Account Status" block (after `isSuspended`, line 42):
```ts
// Platform authorization role. 'user' = normal end user; 'admin' = platform operator.
// Resolved per-request from D1 (never trusted from the JWT) so revocation is instant.
role: text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
```
Add to the table indexes block (after `isActiveIdx`, line 57):
```ts
roleIdx: index('users_role_idx').on(table.role),
```

### 4.2 Migration `migrations/0008_<name>.sql` (next in sequence after `0007_past_mephisto.sql`)
Generated via `npm run db:generate:remote`, then the backfill statement is appended by hand:
```sql
ALTER TABLE `users` ADD `role` text DEFAULT 'user' NOT NULL;
CREATE INDEX `users_role_idx` ON `users` (`role`);
-- Bootstrap the platform owner as admin (the existing operator account).
UPDATE `users` SET `role` = 'superadmin' WHERE `id` = '0d7fc30b-d9d1-4211-b7cd-50435671cfc8';
```
- Applied to prod by the existing auto-deploy path (`npm run db:migrate:remote`, CI=true). Additive column → safe, no table rewrite.
- The owner id is the same account already in `RATE_LIMIT_EXEMPT_USER_IDS` (russelledeming@gmail.com), confirmed in D1. Backfilling in the migration avoids any lockout/bootstrap script.

> **Drizzle SQLi rule (CLAUDE.md):** the migration is static SQL with a literal id — fine. Any *future* admin user-search (Phase 1) must use prepared placeholders, never `sql.raw` with operator input.

## 5. Worker change set (file-by-file, exhaustive)

1. **[worker/types/auth-types.ts](../../worker/types/auth-types.ts)** — add to `AuthUser` (line 15–27):
   ```ts
   role?: 'user' | 'admin';
   ```
   (Optional — leave `TokenPayload` untouched: role is intentionally **not** a JWT claim.)

2. **[worker/database/services/AuthService.ts](../../worker/database/services/AuthService.ts)**
   - `getUserForAuth` (line 693–712): add `role` to the select projection and to the returned `AuthUser`.
   - **Account-status enforcement** at the two auth chokepoints (`login` ~line 188 and `getUserForAuth` ~line 712), extending the existing `deletedAt IS NULL` predicate:
     ```ts
     // existing: isNull(schema.users.deletedAt)
     // add:      eq(schema.users.isSuspended, false), eq(schema.users.isActive, true)
     ```
     A suspended/inactive user then fails auth the same way a soft-deleted one does. (Decide UX in §10 Q4 — silent 401 vs. explicit "account suspended" message.)
   - `findOrCreateOAuthUser` (~line 454–499): **must not write `role`** on the per-login upsert. Verify the update object does not include `role` (it currently overwrites `provider`/`providerId`/profile only — leave as-is, just confirm in review).

3. **[worker/utils/authUtils.ts](../../worker/utils/authUtils.ts)** — `mapUserResponse` (line 258): include `role` in the response object so `/api/auth/profile` surfaces it to the SPA.

4. **[worker/middleware/auth/routeAuth.ts](../../worker/middleware/auth/routeAuth.ts)** — *(as implemented)*
   - `AuthLevel` gains `'role'`; `AuthRequirement` gains `allowedRoles?: readonly UserRole[]`.
   - `AuthConfig.superadminOnly` (`allowedRoles: ['superadmin']`) and `AuthConfig.platformStaff` (`allowedRoles: PLATFORM_STAFF_ROLES`).
   - `routeAuthChecks` gains a fail-closed `'role'` branch: no user → 401; `!allowedRoles.includes(user.role)` → 403.
   - `enforceAuthRequirement` resolves the user for `'role'`-level routes too.
   - **Cleanup:** removed the PII-leaking `console.log('requirement', …, user)` that logged the full user object on every request.

5. **[worker/database/services/UserService.ts](../../worker/database/services/UserService.ts)** — operator-only mutators (no route wires them in Phase 0; Phase 1 exposes them behind `superadminOnly`):
   ```ts
   async setRole(userId: string, role: UserRole): Promise<void>
   async suspendUser(userId: string): Promise<void>     // isSuspended = true
   async reactivateUser(userId: string): Promise<void>  // isSuspended = false, isActive = true
   ```
   - `updateUserProfileWithValidation` cannot set `role`/`isSuspended` — it uses an explicit field whitelist (username/displayName/bio/theme). Confirmed.

6. **No change** to `jwtUtils.ts` (role is not a claim) or to `RATE_LIMIT_EXEMPT_USER_IDS` (stays a billing concern).

## 6. Frontend change set — DEFERRED to Phase 1
The API now returns `role` (via `mapUserResponse`), which is all Phase 0 needs. The role-gated client route guard + admin UI are Phase 1. No `src/` changes in this PR.

## 7. Security review checklist (must pass before merge)
- [ ] `role` is never settable via `PUT /api/user/profile` or any user-facing controller.
- [ ] `role` is never written by `findOrCreateOAuthUser` on login upsert.
- [ ] Admin check **fails closed** (`user.role !== 'admin'` → 403; missing user → 401).
- [ ] Role resolved **per request** from D1, not from the JWT.
- [ ] Admin tier does **not** weaken CSRF / `__Host-` cookie / origin / HMAC-OAuth-state hardening.
- [ ] `RATE_LIMIT_EXEMPT_USER_IDS` is **not** consulted for authorization anywhere.
- [ ] Migration sets `DEFAULT 'user'` and backfills exactly one admin (the owner id).
- [ ] Suspended/inactive users are rejected at both `login` and `getUserForAuth`.
- [ ] PII `console.log` at routeAuth.ts:74 removed.

## 8. Testing
- **Migration:** `npm run db:migrate:local` applies cleanly; existing rows default to `'user'`; owner row becomes `'superadmin'`.
- **Unit/integration (Vitest, Workers pool):**
  - Suspended user → `login` and authenticated request both fail.
  - `inactive` (isActive=false) user → auth fails.
  - A route set to `AuthConfig.adminOnly`: anonymous → 401; normal user → 403; admin user → 200. (Add a throwaway test route or test the middleware directly.)
  - `role` cannot be mutated through `updateUserProfileWithValidation` (attempt → ignored/rejected).
  - `getUserForAuth` returns `role`; `mapUserResponse` includes it.
- **Gate:** typecheck 0, lint 0, `vite build` green, existing suite still 252 passed / 1 skipped (+ new tests). 2 pre-existing BYOP failures acceptable.

## 9. Rollout & rollback
- **Rollout:** single PR (schema + migration + identity plumbing + admin tier + tests), merged to `main` → auto-deploy runs `db:migrate:remote` then `wrangler deploy` with health check + auto-rollback (per `reference_deployment_process`).
- **Blast radius:** Phase 0 is "dark" — no `adminOnly` routes exist yet, so the only runtime behavior change is the new suspended/inactive login rejection (covered by tests). Everything else is an unused column + plumbing.
- **Rollback:** the column is additive and unused by default; reverting the worker deploy restores prior behavior. Do **not** drop the column on rollback (harmless if left).

## 10. Decisions — RESOLVED (owner, 2026-06-13)
1. **Role values:** full set `superadmin | admin | user | support | ai_support | ai_admin` (`admin` = org-admin, dormant until Phase 2).
2. **`orgId` now:** No — Phase 0 is org-free.
3. **Bootstrap admin:** Yes — via the migration `UPDATE` (owner → `superadmin`).
4. **Suspended-user UX:** explicit **"Your account has been suspended — please contact support."** (403 at login).

## 11. Operator account seeding (Phase 0)
Two superadmin accounts are seeded post-migration via `scripts/seed-superadmins.ts` (npm: `seed:superadmins`). Credentials are supplied at run time via `SEED_SUPERADMINS` env or `--file ./.seed.json` (gitignored) — **never committed**. The script hashes with the same PBKDF2 primitive as `PasswordService`, emits idempotent `INSERT … ON CONFLICT(email) DO UPDATE` SQL (dry-run by default), and applies via OAuth-authed `wrangler d1 execute … --remote` only with `--execute --remote`.

Accounts to seed (role `superadmin`, dummy emails on getdreamforge.com):
- **Gannon Brown** — `gbrown@getdreamforge.com` — password `Super User 2`
- **Dr. Webb** — `drwebb@getdreamforge.com` — password `Super User 1`

`username` is left null (the display names contain spaces/period and `support`/`admin` are reserved username strings); the names are stored as `displayName`. Both passwords satisfy the validator (≥8 chars, upper+lower+digit).

> ⚠️ **Security note:** `Super User 1/2` are weak for production superadmin accounts. Recommend rotating to strong unique passwords after first login (or before, by editing the creds file). Seeding runs only after the owner's explicit go-ahead, and only against the deployed migration.

## 12. Effort
~Medium, one PR. No upstream code to port (vibesdk has none of this — greenfield). Dependencies: none beyond the existing D1/Drizzle/auth stack.
