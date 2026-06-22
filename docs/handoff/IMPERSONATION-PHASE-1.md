# Impersonation — Phase 1 (human superadmin "act as")

Status: **in progress** (PR 1.1 — schema + grant service + auth-chokepoint indirection).
Owner-approved design, 2026-06-22. Phase 2 (read-only AI-agent "diagnose as") is a
separate plane, deferred until Phase 1 ships + is verified.

## Goal
A platform **superadmin** can impersonate ("act as") any normal user to test and
diagnose, with **full write** access minus a hard block-list, fully **audited**, on
a **time-boxed, user-extendable** session.

## Architecture — two planes, one seam
The human (Phase 1) and AI-agent (Phase 2) paths are deliberately distinct at
credential / token / write-scope / audit-weight, and converge only at the role
plane (`users.role`) and the audit store (`audit_logs`).

The **one seam** is `AuthService.validateTokenAndGetUser` — the single per-request
identity builder feeding both HTTP controllers and the agent/WebSocket path. When
an active grant exists for the actor's session, it resolves the **effective**
identity as the **target** user (so the whole app transparently acts as them) while
stamping the real actor onto `AuthUser.impersonatedBy` for accountability.

**Why a server-side grant, not a JWT claim:** the codebase's hard invariant is that
authorization state is resolved per-request from D1 (never trusted from the JWT) so
revocation is instant — the same discipline as `sessions.current_org_id` +
`resolveActiveOrg`. Putting impersonation in the JWT would make it un-revocable
until expiry. The grant lookup is gated on the actor's role first, so only
superadmins ever incur the extra read.

## Data model (migration 0012)
`impersonation_sessions` — one grant row, keyed to the actor's `sessions` row
(per-device, ends when the session ends). Dual-clock: `expiresAt` (idle window,
pushed on a re-validated extend) and `absoluteExpiresAt` (written once, **never
moves**). Active iff `!isRevoked AND now < min(expiresAt, absoluteExpiresAt)`.

`AuthUser` gains `impersonatedBy` (actor id), `impersonatorRole`, and
`impersonationReadOnly` — set only on an impersonated request.

## Time-box (Phase 1 defaults — `IMPERSONATION_CONFIG`)
- Idle window: **15 min** · Absolute cap: **60 min** (~3 extends) · Extend: **+15 min**, clamped to the cap.
- Pre-expiry prompt fires ~2 min before the idle window ends (frontend, PR 1.4).
- **Extend re-validates server-side every time** (actor still privileged, target still
  impersonable, cap not exhausted) — never a silent client timer. At the absolute
  cap the session ends; a fresh start is required.

## Block-list — actions ALWAYS denied while impersonating (decision 3)
Enforced in the auth/route middleware (PR 1.2), **not** the UI, and applied even in
full-write mode. **Adjustable in one config file** — revisit as the product changes.

- **Credentials/identity:** password / email / MFA change; OAuth link/unlink;
  API-key create/rotate; BYOK secret reveal or rotate.
- **Money/entitlements:** billing, plan up/downgrade, payment methods, credit purchase,
  BYOK/credit config.
- **Destructive:** account deletion, app deletion, data export/download.
- **Privilege/membership:** `setRole`, org member add/remove, org-role changes,
  granting platform-staff roles.
- **Consent/legal:** accepting ToS / privacy / data-processing on the user's behalf.
- **Escalation:** starting a **nested** impersonation from within an impersonated session.

Read-only mode (the Phase-2 agent default, and an optional human mode) additionally
blocks **all** non-idempotent (non-GET) requests except an explicit write allow-list.

## Privilege guards
- Only `superadmin` may hold a grant (Phase 1) — re-checked every request.
- Cannot impersonate **self**, a **suspended/inactive** account, or a **protected**
  target (`superadmin` / `support` / `ai_support` / `ai_admin`) — no impersonating
  up or laterally into staff.
- Rate-limit + `RATE_LIMIT_EXEMPT_USER_IDS` + Sentry + audit `actorId` all attribute
  to the **actor**, never the target (PR 1.2).

## Audit (audited-only, decision 4)
Reuses `AuditLogService.buildRow` + the fail-closed `batch()` discipline. Verbs:
`admin.user.impersonate.start` / `.extend` / `.stop`. `actorId` = the real operator,
`entityId` = the target, `reason` required. No notification to the impersonated user.

## PR plan
- **1.1** (this) — migration 0012 + `ImpersonationService` (start/stop/extend +
  `resolveActiveGrant`) + chokepoint indirection + `AuthUser` fields + audit verbs.
  Ships **inert** (no endpoint yet creates a grant).
- **1.2** — block-list / read-only middleware in `routeAuth` + actor attribution for
  rate-limit / Sentry / audit.
- **1.3** — admin endpoints `POST /api/admin/users/:id/impersonate` (start),
  `POST /api/admin/impersonation/extend`, `DELETE /api/admin/impersonation` (stop),
  superadmin-gated (start) / actor-gated (stop+extend, since the effective user is the
  target), behind the `ADMIN_CONSOLE_ENABLED` kill-switch + CSRF.
- **1.4** — frontend: Impersonate button in the `/admin` user detail, a persistent
  "Viewing as <user> — Exit" banner, and the pre-expiry extend prompt.
