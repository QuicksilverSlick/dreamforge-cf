import { describe, it, expect } from 'vitest';
import {
    allErrors,
    canClaimHealthy,
    extractBuildErrors,
    serializeBuildHealth,
    type BuildHealth,
} from './buildHealth';

/** The exact failure that shipped to production and was reported as "fixed". */
const VITE_IMPORT_FAILURE = `
9:41:02 AM [vite] Internal server error: Failed to resolve import "xlsx" from "src/lib/excel-parser.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /app/src/lib/excel-parser.ts:1:18
  1  |  import * as XLSX from 'xlsx';
     |                         ^
`.trim();

describe('extractBuildErrors', () => {
    it('finds the import failure that runtime error feeds never see', () => {
        const errors = extractBuildErrors(VITE_IMPORT_FAILURE);
        expect(errors).toHaveLength(1);
        expect(errors[0].message).toContain('Failed to resolve import "xlsx"');
    });

    it('keeps the indented detail block with its header line', () => {
        const [error] = extractBuildErrors(VITE_IMPORT_FAILURE);
        expect(error.message).toContain('Plugin: vite:import-analysis');
        expect(error.message).toContain('src/lib/excel-parser.ts:1:18');
    });

    it('returns nothing for a clean dev server', () => {
        const clean = [
            'VITE v5.4.2  ready in 412 ms',
            '➜  Local:   http://localhost:8001/',
            '➜  press h + enter to show help',
        ].join('\n');
        expect(extractBuildErrors(clean)).toEqual([]);
    });

    it('returns nothing for empty or whitespace-only output', () => {
        expect(extractBuildErrors('')).toEqual([]);
        expect(extractBuildErrors('   \n  \n')).toEqual([]);
    });

    it('de-duplicates the same failure repeated across HMR attempts', () => {
        const repeated = [VITE_IMPORT_FAILURE, VITE_IMPORT_FAILURE, VITE_IMPORT_FAILURE].join('\n');
        expect(extractBuildErrors(repeated)).toHaveLength(1);
    });

    it('ignores advisory lines that merely mention errors', () => {
        const advisory = [
            '[vite] error overlay is enabled',
            '[vite] re-optimizing dependencies because lockfile has changed',
        ].join('\n');
        expect(extractBuildErrors(advisory)).toEqual([]);
    });

    it('caps how many errors it returns', () => {
        const many = Array.from(
            { length: 30 },
            (_, i) => `[plugin:vite:import-analysis] Failed to resolve import "pkg-${i}"`,
        ).join('\n');
        expect(extractBuildErrors(many, 5)).toHaveLength(5);
    });

    it('detects the other common build-failure shapes', () => {
        const shapes = [
            'error during build:',
            'Could not resolve "./missing" from src/app.tsx',
            'Cannot find module \'@/lib/gone\'',
        ].join('\n');
        expect(extractBuildErrors(shapes).length).toBeGreaterThanOrEqual(3);
    });
});

describe('canClaimHealthy', () => {
    const base: BuildHealth = { status: 'ok', runtimeErrors: [], buildErrors: [] };

    it('permits a healthy claim only on positive evidence', () => {
        expect(canClaimHealthy(base)).toBe(true);
    });

    it('refuses a healthy claim when health is unknown', () => {
        // The regression that mattered: an unreadable feed looked like "no
        // errors", so the agent told the user the app was working.
        expect(canClaimHealthy({ ...base, status: 'unknown', reason: 'sandbox down' })).toBe(false);
    });

    it('refuses a healthy claim when errors are outstanding', () => {
        expect(canClaimHealthy({ ...base, status: 'errors' })).toBe(false);
    });
});

describe('serializeBuildHealth', () => {
    it('tells the model explicitly not to imply success when unknown', () => {
        const text = serializeBuildHealth({
            status: 'unknown',
            runtimeErrors: [],
            buildErrors: [],
            reason: 'the preview sandbox did not respond',
        });
        expect(text).toContain('UNKNOWN');
        expect(text).toContain('the preview sandbox did not respond');
        expect(text).toMatch(/do not state or imply that it works/i);
    });

    it('never reports an unknown status as being free of errors', () => {
        const text = serializeBuildHealth({
            status: 'unknown',
            runtimeErrors: [],
            buildErrors: [],
        });
        expect(text).not.toMatch(/no build or runtime errors/i);
    });

    it('flags build errors as boot-blocking', () => {
        const text = serializeBuildHealth({
            status: 'errors',
            runtimeErrors: [],
            buildErrors: extractBuildErrors(VITE_IMPORT_FAILURE),
        });
        expect(text).toContain('BUILD ERRORS (1)');
        expect(text).toContain('stop the app from starting');
        expect(text).toContain('Failed to resolve import "xlsx"');
    });
});

describe('allErrors', () => {
    it('surfaces build errors ahead of runtime errors', () => {
        const health: BuildHealth = {
            status: 'errors',
            buildErrors: extractBuildErrors(VITE_IMPORT_FAILURE),
            runtimeErrors: [
                { timestamp: '2026-08-01T00:00:00.000Z', level: 50, message: 'boom', rawOutput: 'boom' },
            ],
        };
        const combined = allErrors(health);
        expect(combined).toHaveLength(2);
        expect(combined[0].message).toContain('Failed to resolve import');
    });
});
