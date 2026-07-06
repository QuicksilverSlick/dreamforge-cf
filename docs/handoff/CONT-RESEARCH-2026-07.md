# Continuity Arc — Execution Brief (Preview on Real Bindings)

**Synthesized 2026-07-06** from four research reports (Cloudflare platform, auth layer, upstream vibesdk, our code seams) against `docs/handoff/SANDBOX-TO-PROD-CONTINUITY.md` (Architecture A, CONT-1..5). Repo @ main tip `9f7fd4b`.

---

## 1. Assumption deltas

| June assumption | July-2026 reality | Plan impact |
|---|---|---|
| "better-auth 1.5 = first-class D1" | Stable is **1.6.23** (1.7 in beta). **1.6 switched password hashing to native `node:crypto` scrypt** — on 1.5, sign-up intermittently blows the Workers CPU limit (issues #8456/#8860). Adapters were also extracted to standalone packages (`@better-auth/drizzle-adapter`) and the CLI renamed to `npx auth`. | CONT-1 pins **^1.6.23, never 1.5**. Template deps/docs use the new package/CLI names; 2025 tutorials are stale. |
| Cookie sketch implied cross-subdomain cookies for `*.app.getdreamforge.com` | `crossSubDomainCookies` with `domain: app.getdreamforge.com` would make **sibling generated apps receive each other's session cookies** — a cross-tenant leak. | Use better-auth's **default host-only cookies**. Custom-domain moves need only `baseURL`/`trustedOrigins` env changes — no code change. |
| Token hard problem framed as "scoped token vs separate account vs process isolation" | Two new facts: (a) **`CLOUDFLARE_API_BASE_URL` is honored by every wrangler API call** (all remote-binding control-plane calls go through `cfetch`) — a platform-side authorizing proxy is viable; (b) the token needs **account-wide Workers Scripts Edit** on top of D1 Edit (edge-preview session + proxy-worker upload) — a leaked container token could overwrite ANY worker in the account. | The blast radius is worse than assumed AND a clean fix exists. See §2 — the proxy is now **mandatory**, and it becomes the decided answer. |
| Per-database D1 token scoping "might ship" | Has NOT shipped. D1 permission groups remain account-wide "D1 Read/Edit" only (the Jan-2026 granular-permissions changelog was Cloudflare Access). | No waiting play. Enforcement must be application-level (the proxy). |
| "The deployer uploads no vars/secrets" | **Half wrong.** `vars` ARE fully plumbed (wrangler `vars` block → KV snapshot → `metadata.vars` → multipart upload); nothing uploads only because templates carry no `vars`. **Secrets: confirmed zero mechanism** (no `secret_text` anywhere). | CONT-3 shrinks: non-secret vars ship with ~zero new code (put them in the template's `vars` block); only the secrets half is net-new. |
| CONT-3 requires plumbing creds through the whole deploy stack | `DeploymentManager.deployToCloudflare` **already accepts** `{target, token, metadata}` and `objectives/base.ts:110-114` already forwards them — it's discarded at exactly one hop (`DeploymentManager.ts:191` `void options;` + `deployToCloudflareWorkers(instanceId)` taking no creds). | CONT-3 user-token surface is one-hop work, not a rewrite. |
| CONT-2 = "record provisioned ids on the apps row" (bookkeeping) | **Worse than unrecorded: every sandbox recreation re-provisions brand-new D1/KV** (fresh zip → virgin `{{D1_ID}}` → new `${projectName}-db-${Date.now()}`), orphaning the old DB. Sandbox self-heal silently rotates the app's database *today*. | CONT-2's real fix is **record AND reuse** (skip provisioning when ids exist). This is a data-loss bug fix, not plumbing. Also: `DeploymentManager` is a lazily-memoised singleton — token/env values freeze at first getter access; delivery must be callback-style. |
| "Upstream will eventually need what we're building" | **Dead.** Upstream landed the think/space/facet architecture (2026-06-10): per-app DB = a **DO facet** inside a SpaceDO, previews built/served in-DO (no container sandbox), deploy = a SQLite row in the space. No D1, no remote bindings, no auth template. Facet data is platform-trapped (no REST/Time Travel/replication; dispatch deploy abandons it). | Architecture A stands and is now a genuine **differentiator** ("your data in a first-class, user-ownable D1"), but expect zero upstream help; divergence widens. Steal their **DB-tab inspector pattern** for D1. DO facets are still beta but became billed May 26 — re-check quarterly, not "at GA someday". |
| D1 limits: 50k DBs, 10 GB/DB | Confirmed, plus: **10 GB/DB is explicitly NOT raisable**; **account total storage caps at 1 TB paid (raisable on request)**; Time Travel now has **REST endpoints** (`time_travel/bookmark` / `time_travel/restore`, max 10 restores/10 min/DB); read replication is GA-quality and free (Sessions API is Worker-binding-only). | CONT-4 restore flow can be fully programmatic. File the 1 TB raise request before scale. |
| Remote bindings mechanics stable | Confirmed GA; current versions wrangler 4.107.0 / vite-plugin 1.43.0 (default-on since 1.13.0). New gotcha: workers-sdk **#13956** — vite-plugin remote-binding upload failed (error 10375) when the worker combined a **DO binding with remote bindings**; now fixed, but it validates keeping the flagship template DO-free. `wrangler dev --remote` is officially "Legacy". | Flagship = D1-only, no DO. Smoke-test local-DO+remote-D1 on current versions before any DO-variant gets remote bindings. Official DO workaround if ever needed: deployed worker hosting the DO + `remote: true` **service binding** (service bindings ARE remote-capable). |
| better-auth-cloudflare packages the CF wiring | Real but thin (zpg6, v0.3.0, 0.x single-maintainer). Also: **KV secondary storage + `cookieCache` is broken right now** (bug #4203, reopened Jan 2026 — expired cookie cache logs users out) and KV's 60 s min TTL conflicts with better-auth's 10 s rate-limit window. | Hand-wire core better-auth in the template (~30 lines); steal patterns, don't depend. **v1 = D1-only: no KV secondary storage, no cookieCache.** |
| (Not in plan) | Three June-2026 upstream security fixes map onto live surfaces of ours: AI-Gateway baseUrl key leak (BYOK), chat markdown-image prompt-injection exfil, bootstrap postinstall RCE. | Outside this arc but **do not sit on them** — cheap cherry-picks, listed in §6 as a scheduling question only. |

---

## 2. Token-isolation decision memo

**Problem restated with July facts:** remote bindings require a credential in the container where AI-generated code runs. That credential must carry account-wide **D1 Edit + Workers Scripts Edit** — there is no per-database D1 scoping, and Scripts Edit means a leaked token can overwrite any worker in the account, including `dreamforge-cf` itself.

**Options:**

1. **Container-held scoped token** — *eliminated.* The scope needed doesn't exist. Tightest possible (account token, D1 Edit + Scripts Edit, TTL, IP filter) is still account-wide on both axes. Unshippable.
2. **Short-lived minted token in container** — *insufficient alone.* Account-owned tokens (`cfat_`, GA) support TTL and API creation, so minting per-session is real — but during its TTL the blast radius is identical to (1), and the lazily-memoised `DeploymentManager` makes rotation awkward. Useful only as defense-in-depth *behind* the proxy.
3. **Platform-side authorizing proxy via `CLOUDFLARE_API_BASE_URL`** — *verified viable in wrangler source.* All remote-binding control-plane calls (`GET .../workers/subdomain/edge-preview`, `GET .../workers/subdomain`, `POST .../workers/scripts/{name}/edge-preview`) go through `cfetch`, which honors the env var. Container gets a **dummy** `CLOUDFLARE_API_TOKEN` (wrangler only checks presence) + pinned `CLOUDFLARE_ACCOUNT_ID` (avoids a `/memberships` lookup) + `CLOUDFLARE_API_BASE_URL` pointing at our proxy. The proxy holds the real token and enforces: (a) endpoint allowlist (exactly the three calls above), (b) per-app script-name allowlist on the upload path, (c) **inspection of the multipart upload `metadata` to permit only the app's own recorded D1 `database_id`s** — the per-tenant scoping Cloudflare tokens can't express. Data-plane traffic (the `exchange_url` fetch and the JSRPC WebSocket to the workers.dev preview host) bypasses the proxy, but carries only **session-scoped preview tokens, never the account token** — token isolation holds.
4. **Separate Cloudflare account for user-app resources** — *deferred.* It shrinks blast radius but breaks the deploy story: dispatched workers bind D1 by `database_id` **within the same account**, so user-app D1s in a second account would force migrating the entire dispatch namespace (and Sparks metering, screenshots, etc.) with them. Heavy ops cost for protection the proxy already provides at the enforcement layer. Revisit only if the proxy proves insufficient.

**RECOMMENDATION: build the platform-side authorizing proxy (option 3), with a short-TTL account-owned token behind it (option 2) as defense-in-depth.** It is the only option that achieves real single-app isolation today, it is verified against wrangler source, and it keeps all resources in the main account so the existing deploy path binds the same ids unchanged. It also gives us an audit log of every provisioning/preview-session action per app — useful for Sparks metering later.

**Failure modes to design for:**
- **Wrangler internals drift.** The three endpoints are un-versioned internals; a wrangler upgrade could add calls the proxy blocks → previews break. Mitigation: pin wrangler exactly in the template; proxy logs-and-403s unknown paths loudly; upgrade wrangler only with a proxy-compat check.
- **Control-plane-only visibility.** Once a preview session is approved, the container can run arbitrary code against the *approved* bindings for the session lifetime. Acceptable by design (it's the app's own DB), but the proxy cannot audit data-plane queries — Time Travel (CONT-4) is the recovery story for hostile/errant writes.
- **Proxy availability = preview availability.** The proxy Worker becomes a hard dependency of every preview boot. Keep it dependency-free (KV/D1 read of the app→database_id map only), deploy it separately from `dreamforge-cf`.
- **Script-name squatting.** The edge-preview upload creates scripts on our workers.dev subdomain; enforce deterministic per-app script names (`preview-app-<appId>`) or a session could shadow another app's preview.
- **Account pinning gap.** If `CLOUDFLARE_ACCOUNT_ID` is ever unset in-container, wrangler calls `/memberships`; the proxy must 403 that path (never serve it).

---

## 3. CONT-1 spec refinement (flagship template `vite-cf-d1-runner`)

**Naming constraint:** must not contain the substring "next" (catalog filter, `BaseSandboxService.ts:83`). `vite-cf-d1-runner` is safe.

**Stack pins (exact, July 2026):**

| Dep | Pin | Why |
|---|---|---|
| `wrangler` | **4.107.0 exact** | Proxy-compat (see §2 failure mode 1); ≥4.37.0 required for remote bindings |
| `@cloudflare/vite-plugin` | **1.43.0 exact** | Remote bindings default-on since 1.13.0; upstream templates pin exact (1.17.1) precisely because floats broke builds — copy that discipline at current version; contains the #13956 fix |
| `better-auth` | **^1.6.23** (floor 1.6.0) | Native `node:crypto` scrypt — 1.5 blows CPU limits on sign-up |
| `@better-auth/drizzle-adapter` | latest ^1.6-compatible | Adapters are standalone packages since 1.5 |
| `drizzle-orm` | **^0.45.2** | Matches platform; SQLi CVE GHSA-gpj5-g38j-94v9 floor |
| `drizzle-kit` | matching ^0.45-compatible | Migration generation |
| `vite` | per vite-plugin 1.43.0 peer range | — |

**Binding layout (`wrangler.jsonc`, "STRICTLY DO NOT MODIFY", hidden from AI — copy upstream's convention):**
- `d1_databases: [{ binding: "DB", database_id: "{{D1_ID}}", remote: true }]` — the existing `templateParser.ts` `{{D1_ID}}` machinery picks this up unchanged.
- **NO Durable Objects** in the flagship (avoids the #13956 class; the existing `vite-cf-DO-v2-runner` stays for realtime apps, fully local).
- `compatibility_flags: ["nodejs_compat"]` (better-auth requirement).
- `assets: { not_found_handling: "single-page-application", run_worker_first: ["/api/*"] }`.
- `vars: { BETTER_AUTH_URL: "http://localhost:5173" }` — overridden at deploy (§5); riding `vars` means it uploads with zero new deployer code.
- `.dev.vars` (seeded via CONT-2): `BETTER_AUTH_SECRET`, plus the three proxy env vars (`CLOUDFLARE_API_TOKEN` dummy, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_BASE_URL`).

**Auth scaffolding shape:**
- **Per-request factory** — `createAuth(env, ctx)` built in Hono middleware, stored on context. Never a module singleton (documented D1 write-lock hangs).
- **Drizzle adapter over `drizzle(env.DB)`** (`provider: 'sqlite'`) rather than native D1 — keeps ONE drizzle schema covering app tables + auth tables, one migration chain.
- Auth tables (`user`/`session`/`account`/`verification`) generated **once at template-authoring time** via `npx auth generate --adapter drizzle`, checked into the template's drizzle migrations; applied to the per-app D1 at provision time (`wrangler d1 migrations apply`, or programmatically via `getMigrations` from `better-auth/db/migration` in the provisioner).
- Config: `emailAndPassword: { enabled: true }`; social providers **off** by default; `trustedOrigins: [env.BETTER_AUTH_URL]`; `advanced.useSecureCookies: true`; `advanced.backgroundTasks: { handler: (p) => ctx.waitUntil(p) }` (post-response work dies otherwise).
- **Host-only cookies (default). Do NOT set `crossSubDomainCookies`** — cross-tenant leak on `*.app.getdreamforge.com` (§1).
- **D1-only in v1: no KV secondary storage, no `cookieCache`** (bug #4203 + KV 60 s TTL clamp). Cost: one D1 read per session check — fine.
- Mount at `/api/auth/*` (must match default `basePath`); session guard via `auth.api.getSession({ headers })`. Client: `createAuthClient({ baseURL })` — same-origin single-worker, no CORS config.
- `better-auth/minimal` for bundle size if the worker bundle gets heavy.

**Prompts/catalog:** `description.selection` copy must steer the LLM picker toward D1-backed data apps (the picker sees only name/language/frameworks/selection text — `templateSelector.ts:38-40`); usage prompts teach the drizzle-on-D1 data layer and the auth API surface. Ship via `QuicksilverSlick/vibesdk-templates` (definition + catalog entry) → `deploy-templates.yml` → R2 `vibesdk-templates`.

---

## 4. CONT-2 implementation plan (ordered)

**Goal: provision once per app, record, reuse forever; deliver proxy creds into the container.** Fixes the silent-DB-rotation bug as step 1–4.

1. **`worker/database/schema.ts:293-360` + migration `0016`** — add to `apps`: `d1DatabaseId`, `d1DatabaseName`, `kvNamespaceId` (nullable text columns; a `resourcesProvisionedAt` timestamp). The KV snapshot `wrangler-${instanceId}` stays as the deploy-path mechanism but stops being the only durable record.
2. **`worker/services/sandbox/resourceProvisioner.ts:65-167`** — deterministic naming: `app-<appId>-db` / `app-<appId>-kv` (drop `${Date.now()}`); make `createD1Database`/`createKVNamespace` idempotent (list-by-name → reuse) as a backstop.
3. **`worker/services/sandbox/sandboxSdkClient.ts:753-879` (`provisionTemplateResources`)** — accept an optional `knownResources: { d1DatabaseId?, kvNamespaceId? }` parameter. When present, **skip REST provisioning entirely** and substitute recorded ids into the placeholders (existing `templateParser.replacePlaceholders` at `templateParser.ts:81-92` unchanged). When absent, provision then **return the created ids** to the caller.
4. **`worker/agents/services/implementations/DeploymentManager.ts:26, 70, 80, 143`** — extend `DeploymentManagerOptions` with `getAppResources()` / `onResourcesProvisioned(ids)` callbacks (callback-style, like `getSessionId` — the manager is a lazily-memoised singleton, `codingAgent.ts:150-180`; values must not freeze). Thread `knownResources` into every `createInstance` call site including retry and self-heal — this is what stops self-heal from rotating the database.
5. **`worker/agents/core/codingAgent.ts:168-177`** — construct `DeploymentManager` with the new callbacks (reading/writing the `apps` row via `AppService`) **and `localEnvVars`** as a getter-callback returning: `CLOUDFLARE_API_TOKEN` (dummy constant), `CLOUDFLARE_ACCOUNT_ID` (platform account id), `CLOUDFLARE_API_BASE_URL` (proxy URL), plus a proxy session JWT scoping the container to this appId. This activates the two existing (currently dead) delivery mechanisms: `sandbox.setEnvVars()` at `sandboxSdkClient.ts:1107-1110` (process env — what the vite-plugin/wrangler auth chain reads) and the `.dev.vars` write at `:967-979`.
6. **New service: the authorizing proxy Worker** (per §2) — separate deployable; per-app map of `appId → {d1DatabaseId, allowed script name}` read from D1/KV; allowlists the three control-plane endpoints; validates the multipart `metadata` bindings on `POST .../workers/scripts/{name}/edge-preview` against the app's recorded ids; 403s `/memberships` and everything else; real `cfat_` token (short TTL, auto-rotated) held as a secret.
7. **Gating** — provision-at-first-build only for authenticated users: branch in `worker/api/controllers/agent/controller.ts` (~`:192`, where template selection runs) or at first `createInstance`; anonymous sessions stay on today's local-miniflare behavior (CONT-5 B-mode later).
8. **Smoke tests before merge:** (a) remote D1 from container preview round-trip via proxy; (b) sandbox self-heal reuses same database_id; (c) local-DO template + remote-D1 combo on pinned versions (#13956 regression check).

---

## 5. CONT-3 implementation plan (deployer vars + secrets)

**Vars — nearly free.** The chain `deploy.ts:38 (vars: config.vars)` → `deployer.ts:136-138/197-199 (metadata.vars = vars)` → `cloudflare-api.ts:146 (formData.append('metadata', ...))` already works. Work items:
1. Template carries `vars.BETTER_AUTH_URL` (§3) — uploads automatically from the KV-snapshotted wrangler config.
2. **Per-deploy override** in `buildDeploymentConfig` (`worker/services/deployer/deploy.ts:18-40`): set `vars.BETTER_AUTH_URL = https://<deploymentId>.app.getdreamforge.com` at deploy time (the value can't live statically in the template since the hostname is minted at deploy).

**Secrets — net-new, two changes:**
3. **`worker/services/deployer/utils/index.ts:161-220` (`buildWorkerBindings`)** — add `secret_text` synthesis: accept a `secrets: Record<string,string>` input and emit `{ type: 'secret_text', name, text }` bindings into the metadata (the WfP multipart upload supports this directly — verified). Add `keep_bindings: ['secret_text']` to `WorkerMetadata` (`types.ts:85` area) and set it in `deployer.ts:105-138` (and the mirror at `:178-199`) so **subsequent uploads don't wipe secrets** when we redeploy without re-sending them. (Alternative `PUT .../dispatch/namespaces/{ns}/scripts/{script}/secrets` endpoint exists; metadata-inline + keep_bindings is fewer calls and atomic with the deploy — prefer it.)
4. **Secret sourcing/persistence:** mint `BETTER_AUTH_SECRET` per app at provision time (CONT-2 step 3/5), store encrypted using the existing `SECRETS_ENCRYPTION_KEY` infrastructure (new column or reuse of the secrets table pattern — AAD-bound like BYOK), decrypt worker-side at deploy and pass into the deploy call. It must be identical in preview (`.dev.vars`) and prod (secret_text) or sessions break across the boundary.
5. **Unblock the pre-plumbed hop:** `DeploymentManager.ts:187-191` — delete `void options;`, forward `{target, token, metadata}`; extend `deployToCloudflareWorkers(instanceId)` (`sandboxSdkClient.ts:2038-2223`) to accept `{ vars?, secrets?, token? }` and merge into `buildDeploymentConfig`. (`objectives/base.ts:110-114` already forwards from above — no change.) This same hop is the future CF-OAuth deploy-on-user-token surface; design the signature for it now.
6. **Test:** deploy → confirm `secret_text` visible in the WfP dashboard user-worker view (bindings visible since Dec 2025); redeploy without secrets → confirm `keep_bindings` preserved them; sign-up on the deployed app → session survives a redeploy.

---

## 6. Risks & open questions (survived research)

1. **Owner decision — commit to the authorizing-proxy build.** §2 is decisive on the *choice*, but the proxy is a new always-on service in the preview critical path (~1 PR of its own plus ops). Owner sign-off needed on that scope before CONT-2 starts.
2. **Spike — `CLOUDFLARE_API_BASE_URL` end-to-end through the vite-plugin.** Verified in wrangler source (`cfetch`), but the vite-plugin drives wrangler's internals its own way (e.g., PR #11009 account_id handling). One-day spike: container + pinned versions + dummy token + proxy → working remote D1 preview. **Gate CONT-2 on this.**
3. **Spike — remote-D1 preview latency.** Every DB query in preview becomes a network hop from the container to the edge preview host (JSRPC over WebSocket). Nobody has measured whether hot-reload-loop UX survives ~50–150 ms per query. If it's bad, mitigation options (query batching in drizzle, read-replica sessions) exist but change the template.
4. **`BETTER_AUTH_SECRET` lifecycle** — persistence design (encrypted column vs secrets-table pattern), rotation story, and what happens to live sessions if it ever rotates. Needs a short design note before CONT-3 step 4.
5. **Anonymous/build-first tier economics (CONT-5)** — per-throwaway-session D1 provisioning is cheap but not free (orphan cleanup, 50k-DB slot burn, 1 TB aggregate cap). Owner call: B-mode promotion at first deploy (as planned) vs provision-on-signup only. Also file the 1 TB account-storage raise request early.
6. **Strategic positioning vs upstream facets** — upstream answered continuity with platform-trapped facet storage; we're betting on user-ownable D1 ("real apps → your Cloudflare"). The brief recommends staying the course, but this is an owner-level positioning call since it widens permanent divergence from upstream (merges get harder every quarter). Re-evaluate DO facets quarterly (billed since May 26; still beta).
7. **Scheduling, not scope: three upstream security cherry-picks** (AI-Gateway baseUrl key leak `d8a2526e`, prompt-injection image-exfil `b6ab895e`, bootstrap RCE hardening `31bfc6fc`+`5dca3ab4`) touch live surfaces of ours and predate this arc. They should land **before or alongside** CONT-1 — owner to slot them.
8. **Data-plane blindness is permanent** — the proxy audits control-plane only; hostile generated code can do anything to *its own* approved database. Time Travel restore (CONT-4, now fully REST-able, 10 restores/10 min/DB) is the accepted recovery answer. Confirm the owner accepts this residual risk explicitly.

---

## Appendix: sources

### cf
- https://developers.cloudflare.com/workers/local-development/ (remote bindings section, modified 2026-06-25)
- https://developers.cloudflare.com/changelog/post/2025-09-16-remote-bindings-ga/
- https://developers.cloudflare.com/changelog/post/2025-06-18-remote-bindings-beta/
- https://developers.cloudflare.com/workers/local-development/bindings-per-env/ (modified 2026-06-25)
- https://blog.cloudflare.com/connecting-to-production-the-architecture-of-remote-bindings/ (2025-11-12)
- https://developers.cloudflare.com/workers/wrangler/system-environment-variables/
- https://github.com/cloudflare/workers-sdk/blob/main/packages/workers-utils/src/environment-variables/misc-variables.ts (L123-136 getCloudflareApiBaseUrl)
- https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/cfetch/internal.ts (L84/L256/L315 baseURL)
- https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/api/remoteBindings/index.ts (requireAuth/requireApiToken)
- https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/api/remoteBindings/start-remote-proxy-session.ts (dev.remote 'minimal', raw bindings)
- https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/dev/create-worker-preview.ts (edge-preview endpoints, minimal_mode)
- https://github.com/cloudflare/workers-sdk/blob/main/packages/vite-plugin-cloudflare/CHANGELOG.md (1.13.0 default-on PR #10604; 1.14.0 remoteBindings option PR #11162; PR #11009 account_id)
- https://github.com/cloudflare/workers-sdk/issues/13956 (vite-plugin remote bindings + DO error 10375)
- https://developers.cloudflare.com/fundamentals/api/reference/permissions/ (D1 Read/Edit account-scoped)
- https://developers.cloudflare.com/fundamentals/api/get-started/account-owned-tokens/ (GA, cfat_ prefix, expiration)
- https://developers.cloudflare.com/changelog/post/2026-01-22-granular-api-token-permissions/ (Access only)
- https://developers.cloudflare.com/d1/platform/limits/ (modified 2026-04-21)
- https://developers.cloudflare.com/d1/platform/pricing/ (modified 2026-04-21)
- https://developers.cloudflare.com/d1/reference/time-travel/
- https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/d1/timeTravel/restore.ts (POST .../time_travel/restore)
- https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/d1/timeTravel/utils.ts (GET .../time_travel/bookmark)
- https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/d1/export.ts (POST .../export polling + signed_url)
- https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/d1/execute.ts (import init/ingest/poll)
- https://developers.cloudflare.com/d1/best-practices/read-replication/
- https://developers.cloudflare.com/d1/best-practices/import-export-data/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/bindings/
- https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/ (modified 2026-07-03)
- https://developers.cloudflare.com/changelog/product/workers-for-platforms/ (Dec 18 2025 dashboard; Feb 20 2025 sync deploys; Apr 15 2025 Secrets API; Jan 31 2025 static assets)
- https://blog.cloudflare.com/durable-object-facets-dynamic-workers/ (April 2026, beta, Workers Paid)
- https://developers.cloudflare.com/dynamic-workers/pricing/ (billing since 2026-05-26)
- https://developers.cloudflare.com/dynamic-workers/usage/durable-object-facets/ (modified 2026-04-21)
- https://blog.cloudflare.com/dynamic-workflows/ (May 2026)
- https://www.infoq.com/news/2026/05/cloudflare-dynamic-workflows/
- npm registry: wrangler 4.107.0, @cloudflare/vite-plugin 1.43.0, miniflare 4.20260701.0, better-auth 1.6.23, better-auth-cloudflare 0.3.0 (checked 2026-07-06)

### auth
- https://better-auth.com/blog/1-5
- https://better-auth.com/blog/1-6
- https://www.npmjs.com/package/better-auth
- https://github.com/better-auth/better-auth/releases
- https://github.com/zpg6/better-auth-cloudflare
- https://www.npmjs.com/package/better-auth-cloudflare
- https://www.npmjs.com/package/@better-auth-cloudflare/cli
- https://better-auth.com/docs/concepts/cookies
- https://better-auth.com/docs/concepts/database
- https://better-auth.com/docs/concepts/cli
- https://hono.dev/examples/better-auth-on-cloudflare
- https://github.com/better-auth/better-auth/issues/8456
- https://github.com/better-auth/better-auth/issues/8860
- https://medium.com/@senioro.valentino/better-auth-cloudflare-workers-the-integration-guide-nobody-wrote-8480331d805f
- https://developers.cloudflare.com/changelog/2025-09-16-remote-bindings-ga/
- https://developers.cloudflare.com/workers/development-testing/bindings-per-env/
- https://github.com/cloudflare/workers-sdk/issues/13956
- https://developers.cloudflare.com/d1/platform/limits/
- https://developers.cloudflare.com/d1/best-practices/read-replication/
- https://developers.cloudflare.com/fundamentals/api/reference/permissions/
- https://developers.cloudflare.com/api/resources/workers_for_platforms/subresources/dispatch/subresources/namespaces/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/bindings/
- https://blog.cloudflare.com/durable-object-facets-dynamic-workers/
- https://www.infoq.com/news/2026/05/cloudflare-dynamic-workflows/
- https://openauth.js.org/docs/
- https://www.wisp.blog/blog/lucia-auth-is-dead-whats-next-for-auth
- https://docs.lovable.dev/integrations/supabase
- https://vanbeaumond.nl/en/blog/lovable-supabase-integration-database-auth-complete-guide-2026
- https://lovable.dev/guides/bolt-vs-replit-vs-lovable
- https://blog.replit.com/auth
- https://docs.replit.com/references/auth-and-identity/authentication
- https://vercel.com/templates/next.js/supabase
- https://community.vercel.com/t/supabase-integration-issues-in-vercel-environment-variables-mess/24748
- docs/handoff/SANDBOX-TO-PROD-CONTINUITY.md:29-62

### upstream
- https://github.com/cloudflare/vibesdk/commit/16670aff (feat: think-based agent + code space, 2026-06-10)
- https://github.com/cloudflare/vibesdk/commit/d8a2526e (AI gateway baseUrl key leak fix, 2026-06-16)
- https://github.com/cloudflare/vibesdk/commit/b6ab895e (prompt-injection exfil fix, 2026-06-16)
- https://github.com/cloudflare/vibesdk/commit/31bfc6fc (bootstrap RCE hardening, 2026-06-18)
- https://github.com/cloudflare/vibesdk/commit/22f19000 (strip Service-Worker-Allowed, 2026-06-25)
- https://raw.githubusercontent.com/cloudflare/vibesdk/main/space/src/space/deploy-engine.ts
- https://raw.githubusercontent.com/cloudflare/vibesdk/main/space/src/space/durable-object.ts
- https://raw.githubusercontent.com/cloudflare/vibesdk/main/space/src/space/inspector-wrapper.ts
- https://raw.githubusercontent.com/cloudflare/vibesdk/main/space/README.md
- https://raw.githubusercontent.com/cloudflare/vibesdk/main/worker/api/controllers/appDatabase/controller.ts
- https://raw.githubusercontent.com/cloudflare/vibesdk/main/worker/services/deployer/deploy.ts
- https://raw.githubusercontent.com/cloudflare/vibesdk/main/worker/services/deployer/deployer.ts
- https://raw.githubusercontent.com/cloudflare/vibesdk/main/worker/services/sandbox/resourceProvisioner.ts
- https://raw.githubusercontent.com/cloudflare/vibesdk/main/worker/agents/core/behaviors/think.ts
- https://raw.githubusercontent.com/cloudflare/vibesdk/main/wrangler.jsonc
- https://github.com/cloudflare/vibesdk-templates (commit 7ea201fa 2026-05-13)
- https://raw.githubusercontent.com/cloudflare/vibesdk-templates/main/template_catalog.json
- https://raw.githubusercontent.com/cloudflare/vibesdk-templates/main/reference/vite-reference/wrangler.jsonc
- https://raw.githubusercontent.com/cloudflare/vibesdk-templates/main/reference/vite-reference/package.json (@cloudflare/vite-plugin 1.17.1)
- https://developers.cloudflare.com/changelog/2025-09-16-remote-bindings-ga/
- https://developers.cloudflare.com/workers/development-testing/
- https://developers.cloudflare.com/d1/platform/limits/
- https://developers.cloudflare.com/fundamentals/api/reference/permissions/
- https://better-auth.com/blog/1-5
- https://github.com/zpg6/better-auth-cloudflare
- https://developers.cloudflare.com/api/resources/workers_for_platforms/subresources/dispatch/subresources/namespaces/subresources/scripts/subresources/settings/methods/edit/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/bindings/
- https://blog.cloudflare.com/durable-object-facets-dynamic-workers/
- https://developers.cloudflare.com/dynamic-workers/usage/durable-object-facets/

### seams
- worker/services/sandbox/resourceProvisioner.ts:35-181
- worker/services/sandbox/templateParser.ts:22-92
- worker/services/sandbox/sandboxSdkClient.ts:54
- worker/services/sandbox/sandboxSdkClient.ts:159
- worker/services/sandbox/sandboxSdkClient.ts:342-376
- worker/services/sandbox/sandboxSdkClient.ts:753-879
- worker/services/sandbox/sandboxSdkClient.ts:967-1069
- worker/services/sandbox/sandboxSdkClient.ts:1103-1176
- worker/services/sandbox/sandboxSdkClient.ts:2038-2223
- worker/services/sandbox/BaseSandboxService.ts:73-128
- worker/services/sandbox/factory.ts:6-13
- worker/services/sandbox/remoteSandboxService.ts:121-133
- worker/services/deployer/deploy.ts:18-115
- worker/services/deployer/deployer.ts:105-216
- worker/services/deployer/api/cloudflare-api.ts:122-173
- worker/services/deployer/utils/index.ts:161-220
- worker/services/deployer/types.ts:5-115
- worker/agents/services/implementations/DeploymentManager.ts:13-209
- worker/agents/core/codingAgent.ts:150-207
- worker/agents/core/behaviors/base.ts:378-431
- worker/agents/core/behaviors/base.ts:655-688
- worker/agents/core/behaviors/phasic.ts:215
- worker/agents/core/objectives/base.ts:28-116
- worker/agents/core/state.ts:127
- worker/agents/index.ts:73-121
- worker/agents/planning/templateSelector.ts:23-137
- worker/api/controllers/agent/controller.ts:192
- worker/database/schema.ts:293-360
- migrations/0000_living_forge.sql — migrations/0015_big_preak.sql
- wrangler.jsonc:141-142
- wrangler.jsonc:270
- .github/workflows/README.md:13-95
- .github/workflows/deploy-templates.yml:47-117
