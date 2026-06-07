# Roadmap: Sandbox Preview Stability

Status: **active initiative** · Last updated: 2026-06-07

## Goal

Make the sandbox preview load reliably and stay loaded — on first build, on hard
refresh, and on returning to an app after the container has idled out. Today the
preview is declared "ready" before it is, the URL it points at moves every deploy,
nothing revives a dead container automatically, and Vite HMR (a dev-only feature
the viewer doesn't need) actively destabilizes the preview.

This is the top user-reported pain: *"sometimes it loads and plays fine, but
refresh / come back later → it doesn't load, and I have to hit Reset."*

## Root causes (grounded in code)

| # | Root cause | Where | Symptom |
|---|-----------|-------|---------|
| 1 | **Readiness race** — `DEPLOYMENT_COMPLETED` broadcast immediately after `deployToSandbox()` returns; dev-server readiness check is non-blocking and ignored on failure | `worker/agents/core/behaviors/base.ts:577` (broadcast); `worker/services/sandbox/sandboxSdkClient.ts:716-745` `startDevServer` / `:662-714` `waitForServerReady` (non-blocking) | preview 404-polls 8-10x before the port serves; "ordering" feel |
| 2 | **Port + token churn** — every `createInstance` allocates a fresh port; `exposePort` mints a new token per call; no sticky port/URL | `worker/services/sandbox/sandboxSdkClient.ts:304-334` `allocateAvailablePort`, `:1006` (fresh alloc), `:1036` `exposePort` | `8001→8002→8003`, new token each deploy; old URLs 404 forever |
| 3 | **Idle container, no auto-revive** — no keepalive; on return the container is gone (404); client auto-redeploys only if the WS is still open | `worker/services/sandbox/sandboxSdkClient.ts:1303-1356` `shutdownInstance` (no idle policy in-repo); `src/routes/chat/components/preview-iframe.tsx:214` (redeploy only if WS open) | come back later → dead URL until manual Reset |
| 4 | **HMR WS churn** — template path leaves Vite HMR on with defaults; HMR WS can't survive the proxy → `[vite] server connection lost. Polling for restart…`; earlier agent injected `ProxiedWebSocket` / `/api/client-errors` band-aids INTO generated apps (Phases 9-11) | `worker/agents/utils/templates.ts:72-76` (no `server.hmr`); BYOP path disables it at `worker/agents/utils/byopConfigNormalizers.ts:425` (`hmr:false`) — inconsistent | flicker, reload loops, console spam, wasted generation phases |

## Plan (each slice atomic-green: typecheck 0 / lint 0 / 191·1·2; shipped PR→CI→deploy)

- **Slice 1 — Readiness gate** *(highest impact, lowest risk; START HERE)*
  Confirm the dev server serves a real 200 on the port (HTTP poll + timeout)
  before emitting `previewURL` / `DEPLOYMENT_COMPLETED`. → fixes #1.
- **Slice 2 — Reliable idle-revive on return**
  On preview 404 (dead container), auto-recreate without manual Reset; on
  chat-page load, health-check + revive even on a fresh WS. → fixes #3.
- **Slice 3 — Kill HMR churn**
  Correct, stable Vite preview posture: HMR configured to ride the proxy
  reliably, or native HMR disabled with agent-driven full-reload doing
  refreshes. → fixes #4.
- **Slice 4 — URL/port stability**
  Reuse the instance's port across *phase* deploys (churn only on a true
  wedged-recreate) so the preview URL stays put mid-build. → fixes #2.
- **Slice 5 — Stop the model band-aiding HMR**
  Prompt/template guard so the model never rewrites Vite/WebSocket config or
  POSTs to `/api/client-errors`; the platform owns preview. → removes cruft source.

## Already shipped (foundation)

- **#76** self-heal a wedged instance (recreate when unhealthy / no previewURL).
- **#77** fileless deploy writes the full generated app (no bare template).
- **#78** fail-loud static analysis + retry/self-heal (unrelated but adjacent).

## Related open threads (tracked elsewhere, not part of this initiative)

- **A — Anthropic key → Opus 4.8 flip.** Gated on adding the Anthropic credential
  to the AI Gateway secret store (alias `default`). Then 1-commit flip of the
  code-bearing roles back to `CLAUDE_OPUS_4_8` / fallback `CLAUDE_SONNET_4_6`
  (documented inline in `worker/agents/inferutils/config.ts`).
- **C — "Deploy to Cloudflare" flaky first attempt.** Fails once ("Error in
  deployment, please try again"), succeeds on retry. Investigate
  `deployToCloudflareWorkers` + dispatch-namespace cold race; add a retry.
- **D — Blueprint NDJSON streaming parse noise.** Client `createRepairingJSONParser`
  errors on partial chunks (`src/.../use-chat.ts` + `ndjson-parser.ts`); cosmetic.

## Upstream comparison (cloudflare/vibesdk, checked 2026-06-07)

Upstream does **not** solve any of these — we are at parity, not regressed:
- `sandboxSdkClient.ts` readiness/port/`exposePort` logic is identical (same
  non-blocking `waitForServerReady`, fresh port + new token per deploy).
- `@cloudflare/sandbox` is **0.5.6** in BOTH (the CLAUDE.md "upstream progressed"
  note is stale); same `@cloudflare/vite-plugin` 1.17.1 + rolldown-vite 7.1.13.
- The template `vite.config.ts` HMR setup is byte-identical (`allowedHosts:true`,
  no `server.hmr`, `full-reload` plugin).

Two things upstream HAS that we should leverage:
1. **`USE_TUNNEL_FOR_PREVIEW`** (`sandboxSdkClient.ts:1010,1046`) — opt-in
   cloudflared-tunnel preview. Tunnels carry WebSockets (incl. Vite HMR)
   natively and give a stabler URL. Upstream keeps it dev-only (cloudflared
   per-container cost at scale). **This is the upstream-blessed fix for
   HMR-over-proxy** → candidate approach for Slices 3+4 (Path B below).
2. **`resolvePreviewUrl` / `migratePreviewUrl`** (upstream `worker/utils/urls.ts`)
   — our fork DROPPED these. Normalizes/migrates stored preview URLs onto the
   current domain. Cheap, upstream-aligned robustness win; restore.

### Decision for Slices 3 & 4 (HMR + URL stability)
- **Path A — exposePort + per-template HMR + sticky port:** stay on the
  `<port>-<id>-<token>` subdomain; set vite `server.hmr {clientPort:443,
  protocol:'wss'}`; reuse the port across phase deploys. No infra change.
- **Path B — `USE_TUNNEL_FOR_PREVIEW`:** route preview through cloudflared
  tunnel (native WS, stabler URL); collapses 3+4. Needs cloudflared in the
  container image + prod validation; per-container cost.

## Verification (prod-only — CI has no live container)

Per slice, after deploy: generate a fresh app, tail (`wrangler tail dreamforge-cf`),
and confirm — no 404-poll storm before `deployment_completed` (S1); hard-refresh +
return-after-idle reload cleanly (S2); no `[vite] server connection lost` churn (S3);
preview URL stable across phases (S4); no `ProxiedWebSocket`/`client-errors` in
generated output (S5).
