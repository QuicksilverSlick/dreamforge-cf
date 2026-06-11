import { defineConfig } from 'vitest/config';

/**
 * Root config delegating to two workers-pool projects:
 *  - vitest.config.main.ts — the regular suite, booted from wrangler.test.jsonc
 *    (worker entry + DO bindings).
 *  - vitest.config.d1.ts — D1-backed service tests in a miniflare-only
 *    environment. These cannot run in the main project because importing
 *    `cloudflare:test` there loads the worker entry, whose import graph hits
 *    the broken `@modelcontextprotocol/sdk` ajv CJS/ESM shim (the same issue
 *    behind the two known BYOP test failures, deferred with the agents pin).
 */
export default defineConfig({
  test: {
    projects: ['./vitest.config.main.ts', './vitest.config.d1.ts'],
  },
});
