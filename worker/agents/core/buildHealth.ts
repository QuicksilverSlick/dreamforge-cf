/**
 * Build health — the truth signal behind every claim the agent makes about
 * whether the app works.
 *
 * A build failure that stops the app from booting used to be invisible: the
 * client never mounts, so it never reports a runtime error, so the error feed
 * came back empty and an empty feed was read as "no errors". The agent then
 * told users their build was fixed while the preview was still broken.
 *
 * Two ideas fix that:
 *   1. `unknown` is a first-class status. Failing to READ the errors is not the
 *      same as there being none, and callers must be able to tell them apart.
 *   2. Dev-server stderr is a second error source. Vite reports import/transform
 *      failures there and nowhere else, because the page never runs.
 */
import type { RuntimeError } from '../../services/sandbox/sandboxTypes';

/** Pino error level, matching the levels used by the container's error feed. */
const ERROR_LEVEL = 50;

/**
 * Substrings that mark a dev-server line as a real build failure rather than
 * incidental noise. Matched case-insensitively against each stderr line.
 */
const BUILD_ERROR_SIGNATURES: readonly string[] = [
    'failed to resolve import',
    'failed to resolve entry',
    'could not resolve',
    '[plugin:vite:',
    'pre-transform error',
    'transform failed',
    'internal server error',
    'error during build',
    'build failed',
    'module not found',
    'cannot find module',
];

/**
 * Lines that contain an error signature but are known to be advisory — Vite
 * echoes the overlay hint and dependency-optimization chatter on stderr too.
 */
const BUILD_ERROR_EXCLUSIONS: readonly string[] = [
    'error overlay',
    're-optimizing dependencies',
];

export type BuildHealthStatus =
    /** Errors were read successfully and there were none. */
    | 'ok'
    /** Errors were read successfully and some are outstanding. */
    | 'errors'
    /** The error feed could not be read — health is genuinely unknown. */
    | 'unknown';

export interface BuildHealth {
    status: BuildHealthStatus;
    /** Errors reported by the running app (needs the app to have booted). */
    runtimeErrors: RuntimeError[];
    /** Build/transform failures scraped from dev-server stderr. */
    buildErrors: RuntimeError[];
    /** Why the status is `unknown`; omitted otherwise. */
    reason?: string;
}

/** Every outstanding error, whichever source it came from. */
export function allErrors(health: BuildHealth): RuntimeError[] {
    return [...health.buildErrors, ...health.runtimeErrors];
}

/**
 * True when the agent is allowed to tell the user something is fixed. Requires
 * positive evidence: the feed was readable AND nothing is outstanding. `unknown`
 * deliberately fails this check — that is the whole point of the type.
 */
export function canClaimHealthy(health: BuildHealth): boolean {
    return health.status === 'ok';
}

function isBuildErrorLine(line: string): boolean {
    const lower = line.toLowerCase();
    if (BUILD_ERROR_EXCLUSIONS.some((exclusion) => lower.includes(exclusion))) {
        return false;
    }
    return BUILD_ERROR_SIGNATURES.some((signature) => lower.includes(signature));
}

/**
 * Pull build failures out of dev-server stderr.
 *
 * Vite prints a failure as a header line followed by indented detail (file,
 * frame, stack), so each matching line carries its following indented block
 * along as context. Identical failures repeat on every HMR attempt, so they are
 * de-duplicated by message.
 */
export function extractBuildErrors(stderr: string, maxErrors: number = 10): RuntimeError[] {
    if (!stderr.trim()) {
        return [];
    }

    const lines = stderr.split('\n');
    const seen = new Set<string>();
    const errors: RuntimeError[] = [];

    for (let i = 0; i < lines.length && errors.length < maxErrors; i++) {
        const line = lines[i];
        if (!isBuildErrorLine(line)) {
            continue;
        }

        const detail: string[] = [line.trim()];
        for (let j = i + 1; j < lines.length; j++) {
            const next = lines[j];
            // An indented or blank-but-followed-by-indented line continues the
            // block; a fresh left-aligned line starts something else.
            if (next.trim() === '' || /^\s/.test(next)) {
                if (next.trim() !== '') {
                    detail.push(next.trimEnd());
                }
                continue;
            }
            break;
        }

        const message = detail.join('\n').slice(0, 2000);
        const key = detail[0];
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);

        errors.push({
            timestamp: new Date().toISOString(),
            level: ERROR_LEVEL,
            message,
            rawOutput: message,
        });
    }

    return errors;
}

/**
 * Render build health for an LLM prompt. Phrased so an `unknown` status reads as
 * a reason to go and check rather than as reassurance.
 */
export function serializeBuildHealth(health: BuildHealth): string {
    if (health.status === 'unknown') {
        return [
            'STATUS: UNKNOWN — the build/error feed could not be read.',
            `REASON: ${health.reason ?? 'the preview sandbox did not respond'}`,
            'You do NOT know whether the app builds. Do not state or imply that it works.',
        ].join('\n');
    }

    if (health.status === 'ok') {
        return 'STATUS: OK — the preview responded and reported no build or runtime errors.';
    }

    const sections: string[] = ['STATUS: ERRORS — the app has outstanding errors.'];
    if (health.buildErrors.length > 0) {
        sections.push(
            `BUILD ERRORS (${health.buildErrors.length}) — these stop the app from starting at all:`,
            health.buildErrors.map((error) => `<error>${error.message}</error>`).join('\n\n'),
        );
    }
    if (health.runtimeErrors.length > 0) {
        sections.push(
            `RUNTIME ERRORS (${health.runtimeErrors.length}):`,
            health.runtimeErrors.map((error) => `<error>${error.message}</error>`).join('\n\n'),
        );
    }
    return sections.join('\n\n');
}
