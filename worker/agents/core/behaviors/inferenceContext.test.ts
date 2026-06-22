/**
 * Neutrality guard for `buildInferenceContext` (the assembly behind
 * `BaseCodingBehavior.getInferenceContext`).
 *
 * The post-phase AI fixer (`enableFastSmartCodeFix`) and the realtime fixer
 * (`enableRealtimeCodeFix`) are intentionally OFF. Existing direct-`/api/agent`
 * DOs persist `enableFastSmartCodeFix: true` in `state.metadata`, so honoring
 * metadata would silently turn the per-phase AI fixer on for the whole
 * back-catalog. This test locks the "always off" guarantee against an
 * accidental future rebase onto `metadata`.
 */

import { describe, expect, it } from 'vitest';
import { buildInferenceContext } from './inferenceContext';
import type {
    AgentActionKey,
    InferenceContext,
    ModelConfig,
} from '../../inferutils/config.types';

describe('buildInferenceContext', () => {
    it('forces both fixer toggles off even when metadata has them on', () => {
        // Simulate a back-catalog DO whose persisted metadata carries the
        // controller's `enableFastSmartCodeFix: true` (and a true realtime
        // toggle for good measure).
        const metadataWithTogglesOn: InferenceContext = {
            agentId: 'agent-1',
            userId: 'user-1',
            enableRealtimeCodeFix: true,
            enableFastSmartCodeFix: true,
        };

        const ctx = buildInferenceContext(metadataWithTogglesOn, undefined);

        expect(ctx.enableFastSmartCodeFix).toBe(false);
        expect(ctx.enableRealtimeCodeFix).toBe(false);
        // Identity fields still flow through from metadata.
        expect(ctx.agentId).toBe('agent-1');
        expect(ctx.userId).toBe('user-1');
    });

    it('keeps toggles off and passes userModelConfigs through for bare metadata', () => {
        const userModelConfigs = {
            blueprint: { name: 'some-model' },
        } as unknown as Record<AgentActionKey, ModelConfig>;

        const ctx = buildInferenceContext(
            { agentId: 'a', userId: 'u' },
            userModelConfigs,
        );

        expect(ctx.enableFastSmartCodeFix).toBe(false);
        expect(ctx.enableRealtimeCodeFix).toBe(false);
        expect(ctx.userModelConfigs).toBe(userModelConfigs);
    });
});
