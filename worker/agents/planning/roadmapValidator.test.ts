/**
 * Roadmap validator tests — pure logic. Covers id repair, referential
 * integrity, cycle breaking, capability partial-order reordering,
 * dependency-respecting topological order, and requirement coverage.
 */

import { describe, expect, it } from 'vitest';
import { validateRoadmap } from './roadmapValidator';
import type { RoadmapPhase } from '../schemas';
import type { InterviewSpec } from '../interview/types';

function phase(overrides: Partial<RoadmapPhase> & { phase: string }): RoadmapPhase {
    return {
        description: overrides.phase,
        id: null,
        dependsOn: null,
        capability: null,
        satisfies: null,
        demonstrable: null,
        ...overrides,
    };
}

const SPEC: InterviewSpec = {
    problem: 'p',
    outcome: 'o',
    usersAndRoles: 'u',
    userStories: [
        { id: 'US-1', story: 'book a slot' },
        { id: 'US-2', story: 'take payments' },
    ],
    acceptanceCriteria: [{ id: 'AC-1', criterion: 'WHEN a booking is made, THE SYSTEM SHALL persist it.' }],
    capabilityFlags: { 'scheduling.calendar': true },
    assumptions: [],
    credentialsNeeded: [],
    lookAndFeel: null,
    appName: null,
    enhancedQuery: 'q',
};

describe('validateRoadmap', () => {
    it('passes a well-formed dependency-ordered roadmap through unchanged', () => {
        const roadmap = [
            phase({ phase: 'Shell', id: 'shell', capability: 'shell' }),
            phase({ phase: 'Booking flow', id: 'booking', capability: 'core-flow', dependsOn: ['shell'] }),
            phase({ phase: 'Auth', id: 'auth', capability: 'auth', dependsOn: ['shell'] }),
            phase({ phase: 'Payments', id: 'payments', capability: 'payments', dependsOn: ['auth', 'booking'] }),
        ];
        const { roadmap: ordered, issues } = validateRoadmap(roadmap, null);
        expect(ordered.map((p) => p.id)).toEqual(['shell', 'booking', 'auth', 'payments']);
        expect(issues).toEqual([]);
    });

    it('generates missing and duplicate ids deterministically', () => {
        const roadmap = [
            phase({ phase: 'App Shell & Routing!' }),
            phase({ phase: 'Core Flow', id: 'core' }),
            phase({ phase: 'Core Flow Again', id: 'core' }),
        ];
        const { roadmap: ordered, issues } = validateRoadmap(roadmap, null);
        expect(ordered[0].id).toBe('app-shell-routing');
        expect(ordered.map((p) => p.id)).toContain('core');
        expect(ordered.map((p) => p.id)).toContain('core-flow-again');
        expect(issues.join(' ')).toContain('Duplicate roadmap id');
    });

    it('drops references to unknown phases and reports them', () => {
        const roadmap = [
            phase({ phase: 'Shell', id: 'shell', dependsOn: ['does-not-exist'] }),
        ];
        const { roadmap: ordered, issues } = validateRoadmap(roadmap, null);
        expect(ordered[0].dependsOn).toEqual([]);
        expect(issues.join(' ')).toContain('unknown phase');
    });

    it('breaks dependency cycles instead of hanging or throwing', () => {
        const roadmap = [
            phase({ phase: 'A', id: 'a', dependsOn: ['b'] }),
            phase({ phase: 'B', id: 'b', dependsOn: ['a'] }),
        ];
        const { roadmap: ordered, issues } = validateRoadmap(roadmap, null);
        expect(ordered).toHaveLength(2);
        expect(issues.join(' ')).toContain('cycle');
    });

    it('reorders capability-sequence violations (payments before auth) without authored deps', () => {
        const roadmap = [
            phase({ phase: 'Payments', id: 'payments', capability: 'payments' }),
            phase({ phase: 'Auth', id: 'auth', capability: 'auth' }),
            phase({ phase: 'Shell', id: 'shell', capability: 'shell' }),
        ];
        const { roadmap: ordered, issues } = validateRoadmap(roadmap, null);
        expect(ordered.map((p) => p.id)).toEqual(['shell', 'auth', 'payments']);
        expect(issues.join(' ')).toContain('reordered');
    });

    it('never orders a phase before its dependencies, even against capability rank', () => {
        // Admin ranks after payments, but payments declares a dependency on
        // it — dependencies always win over the capability tiebreak.
        const roadmap = [
            phase({ phase: 'Payments', id: 'payments', capability: 'payments', dependsOn: ['admin'] }),
            phase({ phase: 'Admin', id: 'admin', capability: 'admin' }),
        ];
        const { roadmap: ordered } = validateRoadmap(roadmap, null);
        expect(ordered.map((p) => p.id)).toEqual(['admin', 'payments']);
    });

    it('reports requirements no phase claims when a spec is present', () => {
        const roadmap = [
            phase({ phase: 'Shell', id: 'shell', capability: 'shell', satisfies: ['US-1', 'AC-1'] }),
        ];
        const { issues } = validateRoadmap(roadmap, SPEC);
        expect(issues.join(' ')).toContain('US-2');
        expect(issues.join(' ')).not.toContain('US-1,');
    });

    it('stays quiet about coverage when the model emitted no satisfies at all', () => {
        const roadmap = [phase({ phase: 'Shell', id: 'shell' })];
        const { issues } = validateRoadmap(roadmap, SPEC);
        expect(issues.filter((issue) => issue.includes('Requirements'))).toEqual([]);
    });

    it('handles an empty roadmap', () => {
        const { roadmap, issues } = validateRoadmap([], SPEC);
        expect(roadmap).toEqual([]);
        expect(issues).toEqual([]);
    });
});
