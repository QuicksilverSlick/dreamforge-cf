# Handoff — Phase 2.2: Organization Management & Teams

> **Purpose:** self-contained kickoff for a NEW Claude Code session (no memory of prior work) to build
> Phase 2.2 of the Dreamforge multi-tenant org platform. Read this top to bottom, then the two specs in
> §9, **before writing code**. Start by proposing a concrete plan for the owner's review.

---

## 0. How to use this
Paste the kickoff prompt in §10 as the first message of a new session. Then read the in-repo design docs in
§9. **Do not write code until the owner approves a plan and resolves the open decisions in §7** — especially
the email-vs-link invite fork (§4), which changes the whole invite design.

## 1. Project context
- Repo `dreamforge-cf` (fork of `cloudflare/vibesdk`), deployed as worker **`dreamforge-cf`**, live at
  **app.getdreamforge.com**. React 19 + Vite SPA; Cloudflare Workers + Hono API; D1 (Drizzle ORM),
  Durable Objects, R2, KV, AI Gateway, Containers, Dispatch Namespaces.
- Productionized consumer SaaS. Auth, secrets, rate limits, routing, observability are security-hardened and
  have diverged from upstream — do **not** reintroduce upstream defaults.

## 2. Current state — Phases 0, 1, 2.0, 2.1 are LIVE (do NOT redo)
- **Phase 0** — `users.role` platform-role enum (`superadmin | admin | user | support | ai_support | ai_admin`),
  `AuthConfig.superadminOnly`/`platformStaff` guards, suspension enforcement. Role resolved per-request from D1,
  never the JWT.
- **Phase 1** — operator admin console: `/api/admin/*` (superadmin-only) + audited suspend/reactivate + the
  role-gated `/admin` SPA. `ADMIN_CONSOLE_ENABLED` kill-switch.
- **Phase 2.0** — `organizations` + `organizationMembers` tables; **every user has exactly ONE personal org**
  (`isPersonal=1`, an `'owner'` membership), created on signup (`OrganizationService.ensurePersonalOrg`) and
  backfilled for existing users (migration `0009`). `apps.orgId` (+ forward-compat `orgId` on
  `blueprintCache/userSecrets/githubTokens/cloudflareAccounts/aiGateways`) added & backfilled.
- **Phase 2.1** — app access is enforced by **org membership**, centralized in
  [`worker/database/appAccess.ts`](../../worker/database/appAccess.ts) `userAppAccessCondition(db, userId)` =
  `apps.orgId IN (orgs the user is a member of) OR apps.userId === userId`. The `userId` branch is a
  **transition fallback** (a superset of the old scoping) so nobody is locked out while `orgId` is nullable; it
  is dropped in **2.3**. `AppService.checkAppOwnership` is org-membership-based (returns `orgRole`) and is the
  chokepoint `AuthConfig.ownerOnly` funnels through, so app visibility/delete + agent WS/connect + agent
  analytics are all org-scoped with no `routeAuth` change.

**Org-role plane vs platform-role plane (critical):** org roles (`owner | admin | member`) live on
`organizationMembers.role`. Platform roles live on `users.role`. They are SEPARATE. `PLATFORM_STAFF_ROLES`
(superadmin/support/ai_support/ai_admin) gates operator surfaces and **never** includes org `admin`. Do not
conflate org-admin with platform `superadmin`.

**Deferred from 2.1 (you build these now):** `AuthUser` does **not** yet carry `orgId`/`orgRole` and
`getUserForAuth` was **not** extended — that "active org" plumbing was deferred to 2.2 because 2.1's enforcement
is membership-by-`userId` and didn't need it.

## 3. What Phase 2.2 must build
Turn the single-member org foundation into **real teams**:
1. **Active-org context** — a user can belong to multiple orgs; resolve the *active* org per-request and carry
   `orgId`/`orgRole` on `AuthUser` (resolved from D1, **never** the JWT). Add an org-switcher.
2. **Team orgs** — create a non-personal org (`isPersonal=0`), rename it, view it. (Personal orgs stay solo;
   collaboration happens in team orgs.)
3. **Invitations** — invite a person to a team org with a role; they accept and become a member. **See §4 —
   there is no email infra today, so the delivery mechanism is an owner decision.**
4. **Member management** — list members + pending invites; change a member's role; remove a member; with
   **last-owner protection** (an org must always retain ≥1 owner) and **anti-self-lockout**.
5. **Org-admin role activation** — a new `org-admin` auth gate (owner/admin) for member-management endpoints,
   distinct from the platform `superadminOnly` gate.
6. **Org management UI** — org-switcher + an Organization settings/members page + invite/accept flow.
7. **Audit** — every member/role/invite mutation writes to `auditLogs` (the existing `AuditLogService`).

Out of scope (later): org-shared **secrets/BYOK/CF accounts** (separate phase — `userSecrets` etc. AAD is
user-bound); **2.3** enforces `orgId NOT NULL` and drops the 2.1 `userId` fallback; the "deploy to your own
Cloudflare account" track.

## 4. ⚠️ CRITICAL FORK — there is NO email sending wired today
Verified: all email is a **TODO stub**. `AuthService.generateAndStoreVerificationOtp`
([AuthService.ts:622-637](../../worker/database/services/AuthService.ts)) stores an OTP hash and has an explicit
`// TODO: Send email with OTP` at ~:635; registration sets `emailVerified=true` immediately (~:123) so no email
is ever sent. There is **no email provider** in `worker-secrets.d.ts` or `wrangler.jsonc` (no Resend/SendGrid/
SES/Mailchannels/Postmark binding). So the invite flow must choose:
- **(A) Copy-link invites (recommended for 2.2):** generate a tokenized accept-link; the inviter copies/shares
  it out-of-band. **No email dependency — ships now.** Add real email as a separate fast-follow.
- **(B) Email invites:** first wire an email provider (Cloudflare Email Routing / MailChannels / Resend) +
  secret + an `EmailService`, then send the link. Larger; also unblocks the dormant OTP/password-reset flows.

Recommend **A** for 2.2 (decouples teams from an email-infra project), with the token/accept machinery built so
email is a drop-in later. Confirm with the owner.

## 5. Backend change set (file-by-file)
**Migration `0010_*.sql`** (additive; next after `0009_dizzy_lila_cheney`). Generated via `npm run db:generate`,
backfill appended by hand (mirror the 0009 pattern). Adds:
- `sessions.currentOrgId text REFERENCES organizations(id) ON DELETE SET NULL` (nullable). Backfill existing
  sessions' `currentOrgId` to the user's personal org.
- `org_invitations` table: `id` PK, `orgId` FK (cascade), `inviteeEmail`, `role` (owner/admin/member, default
  member), `tokenHash` (unique), `inviterUserId` FK, `status` (pending/accepted/revoked), `expiresAt`,
  `acceptedAt`, `acceptedUserId` FK nullable, timestamps. Indexes: `tokenHash` (unique), `(orgId, inviteeEmail)`,
  `expiresAt`. Mirror the existing token-table pattern (`emailVerificationTokens`, schema ~:547-558) — store a
  **hash** of the token, never the raw token.
- Apply to prod D1 **via the Cloudflare D1 MCP** (see §8) BEFORE the worker deploys.

**`worker/database/schema.ts`** — add the two schema changes above + type exports (`OrgInvitation`, etc.).

**`worker/database/services/OrganizationService.ts`** (currently: `ensurePersonalOrg`, `getPersonalOrgId`,
`getUserOrganizations`) — add:
- `createTeamOrg(ownerUserId, name)` → org (`isPersonal=0`) + owner membership (atomic batch, like
  `ensurePersonalOrg`).
- `createInvitation(orgId, inviteeEmail, role, inviterUserId)` → secure token (return raw for the link, store
  hash); one pending invite per (orgId, email).
- `acceptInvitation(rawToken, userId)` → validate hash + not-expired + pending + (optionally) email match;
  insert membership (idempotent via the `(orgId,userId)` unique index); mark accepted. Return the org.
- `listMembers(orgId)`, `listInvitations(orgId)`, `updateMemberRole(orgId, targetUserId, newRole, actor)`,
  `removeMember(orgId, targetUserId, actor)`, `revokeInvitation(orgId, inviteId, actor)`.
- **Guards:** last-owner protection (block removing/downgrading the final owner — compute count in the same
  read), anti-self-lockout, and "actor must be owner/admin of this org."

**Active-org plumbing:**
- [`worker/types/auth-types.ts`](../../worker/types/auth-types.ts) `AuthUser` (~:25-39) — add `orgId?: string`,
  `orgRole?: 'owner'|'admin'|'member'`. **Do NOT** add org to `TokenPayload` (~:54-70) — org is per-request D1
  state for instant revocation.
- [`worker/database/services/AuthService.ts`](../../worker/database/services/AuthService.ts) `getUserForAuth`
  (~:738-795) / `validateTokenAndGetUser` (~:800-829) — after loading the user, resolve the active org from
  `sessions.currentOrgId` (the session id is available in `validateTokenAndGetUser`) and the membership role via
  `organizationMembers`, and populate `AuthUser.orgId`/`orgRole`. Fallback to the personal org if
  `currentOrgId` is null or points to a since-deleted/left org (re-validate membership every request).
- [`worker/database/services/SessionService.ts`](../../worker/database/services/SessionService.ts)
  `createSession` (~:88-157) — default `currentOrgId` to the personal org; add
  `setActiveOrg(sessionId, userId, orgId)` (validate membership, update the column).
- Endpoint `POST /api/auth/switch-org` (or `/api/orgs/switch`) → `setActiveOrg`. Org-switch on invite-accept
  (auto-switch to the joined org — confirm in §7).

**Org-admin gate:** [`worker/middleware/auth/routeAuth.ts`](../../worker/middleware/auth/routeAuth.ts) — add an
`'org-admin'` `AuthLevel` (~:23) + `AuthConfig.orgAdminOnly` (~:39-79) whose check requires `user.orgRole ∈
{owner, admin}` **and** the route's `:orgId` param equals the user's active `orgId` (fail-closed 401/403),
mirroring how `superadminOnly` works in `routeAuthChecks` (~:84-169). Org-admin can NEVER pass
`PLATFORM_STAFF_ROLES` checks.

**Routes + controller:** new `worker/api/controllers/organizations/` + `worker/api/routes/orgRoutes.ts`
(mounted in [`worker/api/routes/index.ts`](../../worker/api/routes/index.ts)). Suggested surface:
`GET /api/orgs` (my orgs), `POST /api/orgs` (create team), `GET /api/orgs/:id/members`,
`POST /api/orgs/:id/invites`, `GET /api/orgs/:id/invites`, `POST /api/invites/:token/accept`,
`PATCH /api/orgs/:id/members/:userId` (role), `DELETE /api/orgs/:id/members/:userId`,
`DELETE /api/orgs/:id/invites/:inviteId`, `POST /api/auth/switch-org`. Member-management routes use
`orgAdminOnly`; accept-invite is `authenticated` (any logged-in user with the token). Mirror the existing
controller/route conventions (`adaptController`, `createSuccessResponse`, Zod schemas) — see
`worker/api/controllers/admin/` from Phase 1 as the closest template.

**Audit:** call `AuditLogService` (`worker/database/services/AuditLogService.ts`) on every invite/accept/
role-change/remove with namespaced actions (e.g. `org.member.invite`, `org.member.role_change`,
`org.member.remove`), actor + target + orgId + before/after.

## 6. Frontend change set (mirror Phase 1's `/admin` patterns)
- **`src/routes/org-route.tsx`** — org-role guard mirroring [`admin-route.tsx`](../../src/routes/admin-route.tsx)
  (which gates on `isAdminRole`); gate org-admin pages on `isOrgAdminRole(user?.orgRole)`. **UX-only — the
  server is the boundary.**
- **`src/routes/org/org-utils.ts`** — `ORG_ADMIN_ROLES`, `isOrgAdminRole`, `formatOrgRole` (mirror
  [`admin/admin-utils.ts`](../../src/routes/admin/admin-utils.ts)).
- **`src/contexts/auth-context.tsx`** — expose `activeOrgId`/`activeOrgRole` (from the extended `AuthUser`) +
  `switchOrg(orgId)` (calls the switch endpoint, then `refreshUser()`).
- **Org-switcher** — a `dropdown-menu` (or `command` for many orgs) in
  [`global-header.tsx`](../../src/components/layout/global-header.tsx) or the `SidebarFooter` of
  [`app-sidebar.tsx`](../../src/components/layout/app-sidebar.tsx) (§7 fork).
- **Organization settings/members page** — new route under `/organization` (or `/settings/organization`),
  mounted in [`src/routes.ts`](../../src/routes.ts) wrapped by the org guard. Mirror
  [`settings/index.tsx`](../../src/routes/settings/index.tsx) (Card sections) + [`admin/users.tsx`](../../src/routes/admin/users.tsx)
  (members table) + `dialog`/`alert-dialog` for invite + destructive confirms.
- **Invite/accept** — an **unauthenticated** accept landing route (e.g. `/invite/:token`) mounted at the
  **root level, OUTSIDE `AppLayout`** (no sidebar/header); if the invitee isn't logged in, route them to sign
  up/in (preserving the token) then accept.
- **api-client + hooks** — add org methods to [`api-client.ts`](../../src/lib/api-client.ts) and
  `src/hooks/use-organizations.ts` built on the `useAsyncData` helper in
  [`use-admin.ts`](../../src/hooks/use-admin.ts). **Existing app reads need no client change.**

## 7. Open decisions for the owner (resolve BEFORE building)
1. **Invite delivery — copy-link vs email (§4).** Recommend copy-link now; email as a fast-follow.
2. **Active-org default & switch.** Recommend: default to personal org at login; switcher post-auth;
   **auto-switch** to a team on invite-accept.
3. **Role powers.** Recommend: **owner** = everything incl. delete-org + manage owners; **admin** = manage
   members/invites + apps; **member** = use apps (read/build), no member management.
4. **Org-switcher placement** — global header vs sidebar footer. (Minor; recommend header.)
5. **Org creation availability** — can any user create team orgs in 2.2 (recommend yes), or gated/limited?
6. **Deleted/left active org** — on a stale `currentOrgId`, fall back to personal org (recommend).

## 8. CRITICAL operational rules (this repo bites the unwary)
- **Strict PR flow. NEVER commit to `main`.** `git checkout -b` off latest `main` first. `gh pr create --repo
  QuicksilverSlick/dreamforge-cf`. Merge auto-deploys to prod (`.github/workflows/deploy.yml`: build → wrangler
  deploy → `/api/health` → auto-rollback). Never advise a manual deploy. Never `git add -A` (sweeps `.claude/`
  scratch + `.playwright-mcp/`); stage explicit paths.
- **Gate before PR:** `npm run typecheck` (0), `npm run lint` (0), `npm run test`, `./node_modules/.bin/vite
  build`. On Windows use **bun.exe** for installs. Baseline ≈ **292 passed / 1 skipped + 2 pre-existing BYOP
  failures that are acceptable**.
- **Run an adversarial pre-PR review** (multi-agent or `/code-review`) focused on cross-tenant isolation +
  last-owner/lockout guards before opening the PR.
- **Migration → prod via the Cloudflare D1 MCP, BEFORE the worker deploys.** `npm run db:migrate:remote` is
  broken locally (wrangler `7403`). Use the D1 MCP `d1_database_query` against **database_id
  `0d8d35e2-91e1-4231-90b1-f49cc313876c`** (name `vibesdk-db`): run the migration's statements, then
  `INSERT INTO d1_migrations (name, applied_at) VALUES ('0010_<name>.sql', CURRENT_TIMESTAMP)`. Additive columns
  are backward-compatible, so the safe order is **migrate-prod → merge PR → worker deploys against the migrated
  DB**. The D1 MCP supports multi-statement queries (one result per statement). **Get the owner's explicit go
  before touching prod D1.**
  - **Ledger quirk:** prod `d1_migrations` has a stale pre-fork epoch (ids 1–10, e.g. `0009_careless_siren.sql`)
    PLUS the fork epoch (ids 11+, ending `0008_freezing_vin_gonzales.sql`, then `0009_dizzy_lila_cheney.sql`).
    Match migrations by **exact filename**; the fork's next number is **0010**. A `name LIKE '0010%'` check will
    be clean.
- **Frontend can't be previewed locally on Windows** (`@cloudflare/vite-plugin` refuses local dev with
  containers). Verify the SPA on prod after deploy (owner can eyeball; confirm the served `index-*.js` bundle
  hash changed — deploy purges cache).
- **Security guardrails:** org context resolved **per request from D1** (never the JWT) for instant revocation;
  org-admin gate **fails closed**; member-management endpoints validate `:orgId` against the actor's membership;
  Drizzle prepared placeholders only (no `sql.raw` with user input); never expose decrypted secrets; keep CSRF/
  `__Host-`/origin/HMAC-OAuth-state hardening intact. **No DB migration is needed for app-access** (2.1 already
  shipped it) — 0010 is only `sessions.currentOrgId` + `org_invitations`.

## 9. Key files & in-repo docs to read first
- `docs/specs/PHASE-0-IDENTITY-KEYSTONE.md` — the role/auth foundation.
- `docs/handoff/PHASE-1-ADMIN-DASHBOARD-KICKOFF.md` — the closest template for backend route group + role-gated
  SPA conventions.
- `worker/database/schema.ts` (organizations/organizationMembers/sessions/token tables),
  `worker/database/services/OrganizationService.ts`, `worker/database/appAccess.ts`,
  `worker/database/services/AuthService.ts` (`getUserForAuth`), `worker/middleware/auth/routeAuth.ts`
  (`AuthConfig`), `worker/types/auth-types.ts`.
- `worker/api/controllers/admin/` + `worker/api/routes/adminRoutes.ts` (Phase 1 — route/controller/test pattern).
- `migrations/0009_dizzy_lila_cheney.sql` (the additive + appended-backfill pattern to mirror).
- Frontend: `src/routes/admin-route.tsx`, `src/routes/admin/admin-utils.ts`, `src/routes/admin/users.tsx`,
  `src/hooks/use-admin.ts`, `src/contexts/auth-context.tsx`, `src/components/layout/{global-header,app-sidebar,app-layout}.tsx`,
  `src/routes/settings/index.tsx`, `src/lib/api-client.ts`.
- **Test harness note:** D1-backed service tests live in `worker/database/services/*.test.ts` (the `d1` vitest
  project, real D1 via `applyD1Migrations`). Main-project tests must NOT import from `cloudflare:test` (it loads
  the worker entry and dies on the MCP-SDK ajv shim) — use a mock env/ctx (see
  `worker/api/controllers/admin/adminGate.test.ts`). The `d1` bindings already include a valid `JWT_SECRET`.

## 10. Paste-this kickoff prompt for the new session
```
Continue the Dreamforge multi-tenant org platform. Read docs/handoff/PHASE-2.2-ORG-MANAGEMENT-KICKOFF.md in
full first, then docs/specs/PHASE-0-IDENTITY-KEYSTONE.md and skim docs/handoff/PHASE-1-ADMIN-DASHBOARD-KICKOFF.md
for the route/controller/SPA conventions. Phases 0, 1, 2.0, and 2.1 are ALREADY LIVE in prod — do not redo them.
Build Phase 2.2: organization management & teams — active-org context (orgId/orgRole on AuthUser, resolved
per-request from D1, never the JWT), create team orgs, invitations + accept, member management with last-owner
protection, an org-admin auth gate distinct from platform superadmin, audit logging, and the org-switcher + org
settings/members UI. Follow the non-negotiable rules in the handoff: never commit to main, gate before PR, run
an adversarial pre-PR review focused on cross-tenant isolation + lockout, and apply migration 0010 to prod D1
via the Cloudflare D1 MCP (db 0d8d35e2-91e1-4231-90b1-f49cc313876c) BEFORE the worker deploys. There is NO email
infrastructure wired today, so resolve the invite-delivery fork (copy-link vs email) and the other §7 decisions
with me FIRST. Start by proposing a concrete Phase 2.2 implementation plan for my review before writing code.
```
