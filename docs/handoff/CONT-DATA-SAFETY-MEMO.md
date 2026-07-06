# Decision memo — Data-plane risk mitigation for per-app D1 (Continuity arc)

**Date:** 2026-07-04 · **Status:** DECIDED — supersedes "Time Travel restore alone"
**Context:** Architecture A ("preview data IS prod data") + the authorizing proxy (CONT-RESEARCH §2) leave one accepted residual: *generated code can do anything to its own approved database* (§6.8). This memo picks the July-2026 best-practice stack under the owner's bar: **no promotion step, no UX friction, idle cost ≈ $0.**

Two research findings change the picture from the original CONT plan:

1. **The data plane is NOT uninspectable.** D1 remote-binding calls are HTTP POSTs carrying SQL + params through a plaintext local hop, and — decisively — `wrangler d1 migrations apply --remote` rides `cfetch`, meaning **migration SQL already transits our authorizing proxy today**. Wire-level enforcement is buildable; migration-level enforcement is nearly free.
2. **Bookmarks are free, per-write, and nameable.** A Time Travel bookmark is just a string; capture it at lifecycle moments, store it in a ledger, and you have Replit-style named checkpoints at $0. Restore is in-place but **reversible** (`previous_bookmark` is returned), so nothing inside the 30-day window is ever unrecoverable.

---

## 1. Damage classes and coverage

| # | Damage class | Frequency / severity | Covered by |
|---|---|---|---|
| A | **Errant destructive SQL** — un-`WHERE`'d DELETE/UPDATE, careless `DROP`, from sloppy LLM output (the overwhelming majority of real incidents; cf. Replit/SaaStr) | High / High | AST gate blocks most pre-write (L4); bookmark ledger recovers the rest (L1) |
| B | **Buggy migration** — bad DDL wipes or corrupts a table on apply (highest single-event damage) | Medium / Critical | Migration gate at the proxy + auto-bookmark before DDL (L3); ledger restore (L1) |
| C | **Hostile generated code** — prompt-injected or adversarial code using raw `env.DB` at runtime; bypasses all in-template guards by construction | Low / High | Recovery only: L1 within 30 days, L2 beyond; deferred SQL firewall is the only true prevention (§3) |
| D | **Slow corruption** — subtle bad writes discovered days/weeks later | Medium / Medium | Per-write bookmark granularity ≤30d (L1); nightly R2 exports beyond (L2); dual-DB swap for inspect-before-commit (L5) |
| E | **Database deletion / >30-day loss** — the DB itself destroyed, or Time Travel window expired | Low / Critical | R2 exports + import-to-new-DB rebind (L2) — the only layer that survives this |
| F | **Data exfiltration via DB read** — hostile code reads and ships data out of the container | Low / High | **Not mitigable by any snapshot layer.** Partially bounded by the AST gate and the CONT token posture; confidentiality, once lost, cannot be restored (§5) |

Classes A, B, D are the volume; the stack below drives their expected loss to near zero. C and F are the honest residual.

## 2. Recommended defense-in-depth stack (ship all five)

**L1 — Named bookmark ledger at lifecycle hooks** *(effort: small — DO FIRST)*
`db_snapshots` table (appId, bookmark, trigger, r2Key?, createdAt). Auto-capture (silently, zero chips): before each user-approved change batch (`phasic.ts:601-628` when `pendingUserInputs` drain), before schema-touching phases, and before deploy (`objectives/base.ts:110`). Uses the platform-held API token in `resourceProvisioner.ts` — token never enters the container. *Tradeoff:* recovery-only, 30-day horizon, in-place restore (reversible). *Cost:* $0, invisible. **Prereq test:** one 5-minute integration check that a Sessions-API bookmark is accepted by `time_travel/restore`.

**L2 — R2 export snapshots: pre-deploy + nightly sweep with bookmark-delta skip** *(effort: small)*
Cron Worker (billing-reconciler precedent, PR #197): compare current bookmark to last ledger entry — bookmarks sort lexicographically, so **unchanged bookmark ⇒ skip entirely**. Idle apps generate zero API calls and zero R2 growth; idle ≈ $0 holds exactly. *Tradeoff:* export briefly blocks the DB (schedule off-peak; preview DBs are MBs); 5 GiB import cap; FTS5/virtual tables unsupported — lint generated schemas for them.

**L3 — Migration gating at the authorizing proxy + auto-bookmark before DDL** *(effort: medium)*
The single highest-damage vector (B), gated at a choke point **we are already building** and the container cannot bypass: recognize D1 `/query` calls for the app's DB in the proxy, auto-bookmark before any DDL, 403 destructive statements pending a consent token. Non-destructive migrations auto-proceed — no friction on the happy path. Optional later: scratch-DB dry-run (`import last export → apply → PRAGMA foreign_key_check`). *Tradeoff:* covers only the wrangler/REST path; runtime-binding schema changes fall through to L4 — steer the template so migrations only run via wrangler.

**L4 — Template data-layer guard + donttouch hardening + platform-side SQL-danger AST gate** *(effort: medium)*
The AST gate is the load-bearing piece: extend `runPreDeploySafetyGate` (already in the phase pipeline, runs on **our** worker, unbypassable from the container) to flag raw `env.DB.prepare`, `DROP TABLE`, drizzle `.delete()` without `.where()`, write-PRAGMAs → route to `RealtimeCodeFixer` or emit a consent chip only when genuinely destructive. Fix the donttouch path-normalization hole (`writeFiles` is exact-path `Set.has`; `isFileModifiable` is dead code). **Label honestly: friction, not a boundary** — `executeCommands` shell and runtime `env.DB` defeat the in-template guard; that's what L1/L2 are for.

**L5 — Restore UX: in-place restore chips + dual-DB restore-to-copy** *(effort: medium, second wave)*
Clone the proven `IMAGE_GENERATION_CONSENT` chip pattern for a `DESTRUCTIVE_DB_CONSENT` / restore flow; per-phase restore-point markers in `phase-timeline.tsx`; Database card in the app view. Restores are **always explicit user consent — the agent never auto-restores** — and never Spark-metered (recovery from platform-side risk). Dual-DB swap (import R2 dump into fresh D1 → flip `apps.d1DatabaseId` → proxy map update → rebind/redeploy) gives non-destructive preview-before-restore, immune to the 10-restores/10-min limit, with the old DB kept a grace week as the forensic copy.

**Order:** L1 → L2 → L3 → L4 → L5. L1+L2 alone convert the accepted-risk story from "PITR exists somewhere" to "named restore point before every risky moment, forever, at $0 idle." This mirrors the shipped industry pattern (Replit checkpoint-bound snapshots, PlanetScale deploy-request gating, Lovable pre-publish scan) with D1-native primitives.

## 3. What we explicitly do NOT do

- **Data-plane SQL-firewall interposer (rewrite the edge-preview `exchange_url` to a parsing Worker).** Verified feasible — the "uninspectable JSRPC" assumption is false, and CONT-1's exact wrangler pin makes it survivable — but it's a version-coupled undocumented protocol, a latency hop on every preview query, and an interposer bug is a total preview outage. Prevention value against class C doesn't justify that blast radius today. **DEFER; re-evaluate on the first real hostile incident.** (The narrower platform-held-preview-token variant stays on the CONT roadmap for the token-in-container problem — that's a credential decision, not a data-plane one.)
- **Staging/promotion step (Replit dev/prod split).** Directly violates Architecture A and the owner's no-promotion bar. Our answer to the same risk is checkpoints-everywhere instead of environment duplication.
- **Soft-delete "Recently Deleted" recycle bin (Base44 pattern).** Best-in-category UX but prompt-level only, bypassable by raw SQL, schema bloat, and the LLM will forget the filter. Revisit as a *product feature* once the gateway/template layers mature; it is not a safety control.
- **SQLite triggers / read-only bindings / RLS as guards.** Don't exist in a usable form on D1: triggers can't intercept DDL and are droppable; the Worker binding is always full read-write. Waiting on D1 branching is also out — still unshipped, one changelog entry in all of 2026.
- **Time Travel alone (status quo).** Rejected by owner; correctly so — no named checkpoints, no >30-day story, no prevention, manual-support-ticket recovery.

## 4. Changes to CONT-1..5 scope

| PR | Addition |
|---|---|
| **CONT-1** (template + pinned toolchain) | Ship the data-layer guard in the template; steer migrations to the wrangler path only; fix donttouch path normalization in `sandboxSdkClient.ts` |
| **CONT-2** (per-app D1 provisioning + `d1DatabaseId`) | Add the `db_snapshots` ledger table to migration 0016; add `getBookmark()` / `exportToR2()` siblings in `resourceProvisioner.ts` (~30 lines); run the bookmark≡restore-point integration test here |
| **CONT-3** (authorizing proxy) | Migration gating: recognize D1 `/query` for the app's DB, auto-bookmark before DDL, 403 destructive statements pending consent |
| **CONT-4** (pre-deploy snapshot — already specced) | Implement as **bookmark + R2 export** at `ProjectObjective.deploy`; add the nightly bookmark-delta sweep cron in the same PR |
| **CONT-5** (+ follow-on) | L1 lifecycle hooks in the agent (phasic seam + deploy WS handler) + `DESTRUCTIVE_DB_CONSENT` / restore chips + phase-timeline markers |
| **New: CONT-6** | Dual-DB swap restore-to-copy + app-view Database card; AST-gate SQL-danger detector in `preDeploySafetyGate` (can land as an independent PR any time — it has no CONT dependency) |

File the 1 TB account-storage raise request (CONT-RESEARCH §6.5) now; dual-DB doubles storage transiently.

## 5. Remaining truly-irreducible risk

With all five layers shipped, the irreducible residue is this: **hostile generated code holding its own `env.DB` binding at runtime can still, in the window between two checkpoints, write garbage or read everything — and while every *write* is recoverable to the last bookmark (≤30 days, per-write granularity) or last R2 export (forever), a *read* is not: data exfiltrated from the container is confidentiality permanently lost, and no snapshot layer restores it.** Prevention against this class exists only in the deferred SQL-firewall interposer, and even that covers preview only — a deployed dispatch worker binds D1 directly, so production runtime will always be recovery-not-prevention. Additionally, slow corruption detected after 30 days recovers only to nightly-export granularity, and the whole stack presumes the container never obtains the platform API token (already the CONT posture). This matches CONT-RESEARCH §6.8's accepted-risk framing, now with the loss bounded to "since the last checkpoint" instead of "whatever Time Travel happens to cover" — that bound, plus honest documentation that per-app DBs should not hold data the app's own code must never read, is the floor.