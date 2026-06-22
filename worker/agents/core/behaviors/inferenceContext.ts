import type {
    AgentActionKey,
    InferenceContext,
    InferenceMetadata,
    ModelConfig,
} from '../../inferutils/config.types';

/**
 * Assemble the per-operation {@link InferenceContext} from persisted
 * `metadata` plus the resolved user model configs. Used by
 * `BaseCodingBehavior.getInferenceContext`.
 *
 * The two fixer toggles are forced OFF here and we deliberately do NOT read
 * `metadata.enableRealtimeCodeFix` / `metadata.enableFastSmartCodeFix`. They
 * were already effectively off in prod — the previous implementation read a
 * frozen seed default off the now-removed `state.inferenceContext`, so this
 * preserves that exact behavior. Honoring `metadata` instead would silently
 * turn the per-phase AI fixer on for the entire back-catalog of
 * direct-`/api/agent` DOs, which already have `enableFastSmartCodeFix: true`
 * persisted in `metadata`. Enabling it (and accepting the per-build AI cost)
 * is a deliberate, measured decision tracked as a follow-up; until then
 * `controller.ts` keeps the intent marker but it is not honored.
 *
 * Kept in its own module (no sandbox/service imports) so the neutrality
 * guarantee can be unit-tested without loading `base.ts`'s heavy graph.
 */
export function buildInferenceContext(
    metadata: InferenceMetadata,
    userModelConfigs: Record<AgentActionKey, ModelConfig> | undefined,
): InferenceContext {
    return {
        ...metadata,
        userModelConfigs,
        enableRealtimeCodeFix: false,
        enableFastSmartCodeFix: false,
    };
}
