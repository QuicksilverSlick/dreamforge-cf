/**
 * Throttle-decision tests for the lastActiveAt activity touch. The decision is
 * pure (shouldTouchActivity); the write path is fire-and-forget via waitUntil
 * and attributed to `impersonatedBy ?? id` at the call site — these lock the
 * throttle semantics that keep the touch to at most one D1 write per actor per
 * interval and prevent write storms on paths that don't resolve staleness.
 */
import { describe, it, expect } from 'vitest';
import { shouldTouchActivity } from './routeAuth';

const NOW = 1_800_000_000_000;
const MINUTE = 60 * 1000;

describe('shouldTouchActivity', () => {
	it('never touches when the chokepoint did not resolve a value (undefined)', () => {
		expect(shouldTouchActivity(undefined, NOW)).toBe(false);
	});

	it('touches a never-stamped user (null)', () => {
		expect(shouldTouchActivity(null, NOW)).toBe(true);
	});

	it('skips when the stamp is fresh (< 15 min)', () => {
		expect(shouldTouchActivity(new Date(NOW - 14 * MINUTE), NOW)).toBe(false);
		expect(shouldTouchActivity(new Date(NOW), NOW)).toBe(false);
	});

	it('touches when the stamp is stale (>= 15 min)', () => {
		expect(shouldTouchActivity(new Date(NOW - 15 * MINUTE), NOW)).toBe(true);
		expect(shouldTouchActivity(new Date(NOW - 24 * 60 * MINUTE), NOW)).toBe(true);
	});
});
