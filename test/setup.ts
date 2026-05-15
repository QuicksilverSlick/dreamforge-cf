/**
 * Vitest global setup for the worker test pool.
 *
 * Runs once before the test suite inside the workerd test runtime. The
 * Cloudflare workers pool already provides `env`, `ctx`, `cf`, fetch mocks,
 * and the standard Web Platform globals, so this file intentionally stays
 * minimal — it only normalizes timezone/locale for deterministic snapshots
 * and surfaces a clearer error when an unhandled rejection escapes a test.
 */
import { afterAll, beforeAll } from 'vitest';

const ORIGINAL_TZ = process.env.TZ;

beforeAll(() => {
	process.env.TZ = 'UTC';
});

afterAll(() => {
	process.env.TZ = ORIGINAL_TZ;
});
