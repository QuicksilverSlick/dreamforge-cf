import { describe, it, expect } from 'vitest';
import {
    hasJustStalled,
    stalledAlertMessage,
    stalledUserMessage,
    STALLED_EDIT_THRESHOLD,
} from './stalledBuild';

describe('hasJustStalled', () => {
    it('stays quiet below the threshold', () => {
        for (let i = 0; i < STALLED_EDIT_THRESHOLD; i++) {
            expect(hasJustStalled(i)).toBe(false);
        }
    });

    it('fires exactly at the threshold', () => {
        expect(hasJustStalled(STALLED_EDIT_THRESHOLD)).toBe(true);
    });

    it('does not re-fire as the same streak continues', () => {
        // The counter only increments or resets, so equality gives us
        // once-per-streak for free. A wedged build must not alert per retry:
        // the production incident would have produced 12 alerts.
        for (let i = STALLED_EDIT_THRESHOLD + 1; i <= 12; i++) {
            expect(hasJustStalled(i)).toBe(false);
        }
    });

    it('fires again after a reset and a fresh streak', () => {
        expect(hasJustStalled(0)).toBe(false);
        expect(hasJustStalled(STALLED_EDIT_THRESHOLD)).toBe(true);
    });
});

describe('stalledUserMessage', () => {
    it('names the count and that it costs money', () => {
        const message = stalledUserMessage(3);
        expect(message).toContain('3 changes in a row');
        expect(message).toMatch(/sparks/i);
    });

    it('says stuck rather than slow, and offers a concrete next step', () => {
        const message = stalledUserMessage(3);
        expect(message).toMatch(/stuck rather than slow/i);
        expect(message).toMatch(/restart the preview server/i);
    });
});

describe('stalledAlertMessage', () => {
    const base = {
        agentId: '6ebec499-4212-4d8d-ad5c-6c5b3a6b76d1',
        orgId: 'org_123',
        userId: 'user_123',
        editsSinceProgress: 3,
        lastCompletedPhase: 'Phase 28: Revert Excel Import',
    };

    it('carries the agent id and last phase for triage', () => {
        const message = stalledAlertMessage(base);
        expect(message).toContain('6ebec499-4212-4d8d-ad5c-6c5b3a6b76d1');
        expect(message).toContain('Phase 28: Revert Excel Import');
        expect(message).toContain('3 paid edits');
    });

    it('reads sensibly when no phase has ever completed', () => {
        const message = stalledAlertMessage({ ...base, lastCompletedPhase: null });
        expect(message).toContain('last phase: none');
    });
});
