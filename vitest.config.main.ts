import { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersProject({
  test: {
    name: 'worker',
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.test.jsonc' },
        miniflare: {
          compatibilityDate: '2024-12-12',
          compatibilityFlags: ['nodejs_compat'],
        },
      },
    },
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
      '**/test/**',
      '**/worker/api/routes/**',
      // Worktree checkouts under `.claude/worktrees/*` mirror the repo and
      // would cause vitest to double-collect every test file. Without this
      // exclude, our 159 unique tests reported as ~318. See May 2026 code
      // review track 3 (REVIEW_T3_DOCS_TESTS_A11Y.md) for the discovery.
      '**/.claude/**',
      '.claude/**',
      // `container/monitor-cli.test.ts` imports `bun:test`, not vitest. It is
      // meant to be run via `bun test` against the sandbox container image.
      // vitest can't resolve `bun:test` and errors on every run.
      '**/container/monitor-cli.test.ts',
      // D1-backed service tests run in the d1 project (vitest.config.d1.ts);
      // in this project their `cloudflare:test` import would load the worker
      // entry and die on the MCP-SDK ajv shim.
      '**/worker/database/services/*.test.ts',
    ],
  },
});
