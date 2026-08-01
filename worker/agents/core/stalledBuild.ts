/**
 * Stalled-build detection.
 *
 * A build can be charging the user for every message while making no actual
 * progress: the conversational rail answers, work gets queued, and no phase ever
 * completes. Nothing else notices this. Browser error reporting sees nothing
 * (the app runs fine), and the worker sees no exception (each turn "succeeds").
 * The only symptom is a pattern across turns — repeated paid edits with no
 * completed phase between them.
 *
 * That pattern cost one production user 360 Sparks across 12 attempts over 18
 * hours before a human noticed. This module turns it into a signal.
 */

/**
 * Paid edits with no completed phase in between before we treat the build as
 * stalled. Three is deliberately early: by the third identical retry the user
 * already knows something is wrong, and the alert should not lag their
 * experience.
 */
export const STALLED_EDIT_THRESHOLD = 3;

/**
 * True exactly once per stalled streak — when the counter first reaches the
 * threshold. The counter only ever increments or resets to zero, so equality
 * fires once and never repeats for the same streak, which keeps one wedged
 * build from generating an alert per retry.
 */
export function hasJustStalled(editsSinceProgress: number): boolean {
    return editsSinceProgress === STALLED_EDIT_THRESHOLD;
}

/**
 * What the USER sees. Names the situation plainly, credits included, and points
 * at the two things that actually help — rather than letting them keep paying
 * to retry the same request.
 */
export function stalledUserMessage(editsSinceProgress: number): string {
    return (
        `Heads up: that's ${editsSinceProgress} changes in a row without a completed build step, ` +
        `and each one costs Sparks. Something is likely stuck rather than slow. ` +
        `Try describing the problem differently — or ask me to restart the preview server and ` +
        `show you the exact build output, which usually reveals what's actually failing.`
    );
}

/** Structured payload for the ops alert. */
export interface StalledBuildAlert {
    agentId: string;
    orgId: string | null;
    userId: string;
    editsSinceProgress: number;
    lastCompletedPhase: string | null;
}

export function stalledAlertMessage(alert: StalledBuildAlert): string {
    return (
        `Build stalled: ${alert.editsSinceProgress} paid edits with no completed phase ` +
        `(agent ${alert.agentId}, last phase: ${alert.lastCompletedPhase ?? 'none'})`
    );
}
