# BYOP — Bring Your Own Project

Reference documentation for the **BYOP** (Bring Your Own Project) feature: importing any GitHub repository, analyzing it with the `CodebaseAnalyzer` Durable Object, generating an AI Blueprint for refactoring/extension, and deploying the result to Cloudflare.

## Status

The BYOP source code was force-pushed off `origin/main` before our active development cycle and has been recovered from a divergent local clone. The recovery is preserved on origin as branch [`recovery/bishop-divergent-line`](https://github.com/QuicksilverSlick/dreamforge-cf/tree/recovery/bishop-divergent-line) (659 commits ahead of `main` as of `dab9e5d`, 2025-12-06).

These documents are the **architectural reference** that survived. They predate the active per-slice port-back into `main` and may reference file paths or migration tags that change as the recovery sequence lands.

## Recovery PR sequence

| PR | Scope |
|---|---|
| **20a** *(this PR)* | Architectural docs — zero runtime impact |
| **20b** | BYOP TypeScript types, isolated frontend components, `api-client` BYOP methods |
| **20c** | D1 schema + new migration + `GitHubTokenService`, `BlueprintCacheService`, `AuthService` deltas + new secrets in `worker-secrets.d.ts` |
| **20d** | `CodebaseAnalyzer` Durable Object + v6 `new_sqlite_classes` migration + binding + controller + routes + integration |
| **20e** | `/import` React route registration + WebSocket handler wiring + tests |

See `BYOP_RECOVERY_AUDIT.md` at the repo root for the file-level diff catalog and per-PR file lists.

## Document index

### Feature & architecture
- [`BYOP_FEATURE_COMPLETE.md`](./BYOP_FEATURE_COMPLETE.md) — what the feature does end-to-end
- [`BYOP_DEVELOPER_GUIDE.md`](./BYOP_DEVELOPER_GUIDE.md) — developer-facing API and integration guide
- [`BYOP_COMPATIBILITY_INTEGRATION.md`](./BYOP_COMPATIBILITY_INTEGRATION.md) — repo compatibility checks
- [`BYOP_CLOUDFLARE_COMPATIBILITY_ANALYSIS.md`](./BYOP_CLOUDFLARE_COMPATIBILITY_ANALYSIS.md) — Cloudflare-native dependency analysis
- [`BYOP_DEVELOPMENT_MODES.md`](./BYOP_DEVELOPMENT_MODES.md) — local vs production development modes

### Real-time progress + WebSocket
- [`BYOP_WEBSOCKET_FLOW.md`](./BYOP_WEBSOCKET_FLOW.md) — WebSocket message protocol
- [`BYOP_REALTIME_PROGRESS_IMPLEMENTATION.md`](./BYOP_REALTIME_PROGRESS_IMPLEMENTATION.md) — implementation notes
- [`BYOP_REALTIME_PROGRESS_SUMMARY.md`](./BYOP_REALTIME_PROGRESS_SUMMARY.md) — high-level summary

### Fix plans + retrospective
- [`BYOP_COMPLETE_FIX_PLAN.md`](./BYOP_COMPLETE_FIX_PLAN.md) — fix plan that was in flight at the time the feature was lost
- [`BYOP_FIX_SUMMARY.md`](./BYOP_FIX_SUMMARY.md) — summary of fixes applied
- [`BYOP_GITHUB_TOKEN_DEBUG_REPORT.md`](./BYOP_GITHUB_TOKEN_DEBUG_REPORT.md) — debug report on GitHub token persistence

### Testing
- [`BYOP_TESTING_GUIDE.md`](./BYOP_TESTING_GUIDE.md) — full testing strategy
- [`BYOP_QUICK_TEST.md`](./BYOP_QUICK_TEST.md) — quick manual smoke test

### Market research
- [`BYOP_COMPETITIVE_RESEARCH_2025.md`](./BYOP_COMPETITIVE_RESEARCH_2025.md) — competitor analysis from 2025
