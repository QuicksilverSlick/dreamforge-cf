import { defineWorkersProject, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';

/**
 * D1-backed service tests (e.g. SecretsService). Runs miniflare without a
 * worker entry: tests get a real D1 with the production migrations (via the
 * TEST_MIGRATIONS binding + applyD1Migrations in each suite's beforeAll)
 * without loading worker/index.ts and its agents/MCP-SDK import graph.
 */
export default defineWorkersProject(async () => {
  const migrations = await readD1Migrations('./migrations');

  return {
    test: {
      name: 'd1',
      poolOptions: {
        workers: {
          miniflare: {
            compatibilityDate: '2025-08-10',
            compatibilityFlags: ['nodejs_compat'],
            d1Databases: ['DB'],
            bindings: {
              TEST_MIGRATIONS: migrations,
              SECRETS_ENCRYPTION_KEY:
                '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
            },
          },
        },
      },
      globals: true,
      setupFiles: ['./test/setup.ts'],
      include: ['worker/database/services/*.test.ts'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/.claude/**'],
    },
  };
});
