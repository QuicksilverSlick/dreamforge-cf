/**
 * StateMigration tests — the legacy-field hydration path that must keep
 * working after the deprecated `agentMode` / `inferenceContext` fields were
 * removed from the canonical `BaseProjectState` type. Legacy Durable Objects
 * created before the rename still hydrate with the old keys present in their
 * raw persisted payload; the migration reads them off the raw record and
 * translates them to `behaviorType` / `metadata`.
 */

import { describe, expect, it } from 'vitest';
import { StateMigration } from './stateMigration';
import { createLogger } from '../../logger';
import type { AgentState } from './state';

const logger = createLogger('stateMigration.test');

/** Build a minimally-valid legacy phasic payload with arbitrary overrides. */
function legacyState(overrides: Record<string, unknown>): AgentState {
    return {
        query: 'a small app',
        projectName: 'Legacy App',
        generatedFilesMap: {},
        projectUpdatesAccumulator: [],
        ...overrides,
    } as unknown as AgentState;
}

describe('StateMigration.migratePhasic — legacy agentMode → behaviorType', () => {
    it("maps agentMode 'smart' to behaviorType 'agentic' and strips agentMode", () => {
        const migrated = StateMigration.migratePhasic(
            legacyState({ agentMode: 'smart' }),
            logger,
        );

        expect(migrated).not.toBeNull();
        expect(migrated!.behaviorType).toBe('agentic');
        // The retired legacy key must not survive on hydrated state.
        expect((migrated as unknown as Record<string, unknown>).agentMode).toBeUndefined();
    });

    it("maps agentMode 'deterministic' to behaviorType 'phasic' and strips agentMode", () => {
        const migrated = StateMigration.migratePhasic(
            legacyState({ agentMode: 'deterministic' }),
            logger,
        );

        expect(migrated).not.toBeNull();
        expect(migrated!.behaviorType).toBe('phasic');
        expect((migrated as unknown as Record<string, unknown>).agentMode).toBeUndefined();
    });
});

describe('StateMigration.migrateCommon — legacy inferenceContext → metadata', () => {
    it('lifts agentId/userId out of inferenceContext into metadata and strips inferenceContext', () => {
        const migrated = StateMigration.migrateCommon(
            legacyState({
                inferenceContext: {
                    agentId: 'agent-1',
                    userId: 'user-1',
                    // A back-catalog toggle that must NOT leak into canonical
                    // metadata identity.
                    enableFastSmartCodeFix: true,
                },
            }),
        );

        expect(migrated).not.toBeNull();
        expect(migrated!.metadata).toEqual({ agentId: 'agent-1', userId: 'user-1' });
        expect((migrated as unknown as Record<string, unknown>).inferenceContext).toBeUndefined();
    });

    it('returns null when canonical metadata is already present', () => {
        const migrated = StateMigration.migrateCommon(
            legacyState({ metadata: { agentId: 'agent-1', userId: 'user-1' } }),
        );

        expect(migrated).toBeNull();
    });
});
