/**
 * Roadmap validation: turns the model-authored implementation roadmap into a
 * dependency-consistent, capability-ordered plan — in code, not prompt-trust.
 * Never throws: always returns a usable roadmap plus the issues it repaired,
 * so a malformed model output degrades to the old informal roadmap instead of
 * failing blueprint generation. Spec: docs/specs/21-QUESTIONS-INTAKE-INTERVIEW.md §6.2-6.3
 */

import type { InterviewSpec } from '../interview/types';
import type { RoadmapPhase } from '../schemas';

/**
 * Canonical capability partial order (house canon, grounded in
 * walking-skeleton doctrine and Stripe's published integration sequence):
 * shell → core flow → persistence-with-its-feature → auth → uploads →
 * payments → email → realtime → admin → analytics/polish.
 */
const CAPABILITY_RANK: Record<string, number> = {
    'shell': 0,
    'core-flow': 1,
    'persistence': 2,
    'auth': 3,
    'uploads': 4,
    'payments': 5,
    'email': 6,
    'realtime': 7,
    'admin': 8,
    'analytics': 9,
    'polish': 10,
};

export interface RoadmapValidationResult {
    roadmap: RoadmapPhase[];
    /** Human-readable notes about everything that was repaired or flagged. */
    issues: string[];
}

function slugify(name: string, taken: Set<string>): string {
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'phase';
    let slug = base;
    let counter = 2;
    while (taken.has(slug)) {
        slug = `${base}-${counter}`;
        counter++;
    }
    return slug;
}

function capabilityRank(phase: RoadmapPhase): number {
    const rank = phase.capability ? CAPABILITY_RANK[phase.capability] : undefined;
    return rank ?? Number.MAX_SAFE_INTEGER;
}

/**
 * Repairs ids and dependency references, breaks cycles, orders the roadmap
 * topologically with a (capability-rank, original-index) tiebreak, and — when
 * a spec is present — reports requirement ids no phase claims to satisfy.
 */
export function validateRoadmap(
    roadmap: RoadmapPhase[],
    spec?: InterviewSpec | null,
): RoadmapValidationResult {
    const issues: string[] = [];
    if (roadmap.length === 0) {
        return { roadmap, issues };
    }

    // 1. Ensure stable unique ids.
    const taken = new Set<string>();
    const phases = roadmap.map((phase) => {
        let id = phase.id?.trim() || '';
        if (!id || taken.has(id)) {
            const generated = slugify(phase.phase, taken);
            if (id) {
                issues.push(`Duplicate roadmap id "${id}" — renamed to "${generated}"`);
            }
            id = generated;
        }
        taken.add(id);
        return { ...phase, id };
    });

    // 2. Referential integrity: drop dependencies on unknown ids.
    const known = new Set(phases.map((phase) => phase.id));
    for (const phase of phases) {
        const deps = (phase.dependsOn ?? []).filter((dep) => dep !== phase.id);
        const valid = deps.filter((dep) => known.has(dep));
        const dropped = deps.filter((dep) => !known.has(dep));
        if (dropped.length > 0) {
            issues.push(`Phase "${phase.id}" depended on unknown phase(s): ${dropped.join(', ')} — dropped`);
        }
        phase.dependsOn = valid;
    }

    // 3. Topological order via Kahn's algorithm with deterministic tiebreak:
    //    among ready phases pick the lowest (capability rank, original index).
    //    This both validates the DAG and repairs orderings that violate the
    //    canonical capability sequence without authored dependencies.
    const originalIndex = new Map(phases.map((phase, index) => [phase.id, index] as const));
    const remaining = new Map(phases.map((phase) => [phase.id, new Set(phase.dependsOn ?? [])] as const));
    const ordered: RoadmapPhase[] = [];

    while (remaining.size > 0) {
        const ready = phases
            .filter((phase) => remaining.has(phase.id) && remaining.get(phase.id)!.size === 0)
            .sort((a, b) =>
                capabilityRank(a) - capabilityRank(b) ||
                originalIndex.get(a.id)! - originalIndex.get(b.id)!,
            );

        if (ready.length === 0) {
            // Cycle: break it by releasing the phase with the fewest unmet
            // dependencies (then earliest), dropping its remaining edges.
            const cyclic = [...remaining.keys()]
                .map((id) => phases.find((phase) => phase.id === id)!)
                .sort((a, b) =>
                    remaining.get(a.id)!.size - remaining.get(b.id)!.size ||
                    originalIndex.get(a.id)! - originalIndex.get(b.id)!,
                )[0];
            issues.push(`Dependency cycle involving "${cyclic.id}" — broke it by dropping its unmet dependencies (${[...remaining.get(cyclic.id)!].join(', ')})`);
            cyclic.dependsOn = (cyclic.dependsOn ?? []).filter((dep) => !remaining.get(cyclic.id)!.has(dep));
            remaining.get(cyclic.id)!.clear();
            continue;
        }

        const next = ready[0];
        ordered.push(next);
        remaining.delete(next.id);
        for (const deps of remaining.values()) {
            deps.delete(next.id);
        }
    }

    if (ordered.some((phase, index) => phases[index].id !== phase.id)) {
        issues.push('Roadmap reordered to satisfy dependencies and the capability sequence');
    }

    // 4. Requirement coverage: every spec requirement should be claimed by
    //    at least one phase. Reported, never invented around.
    if (spec) {
        const claimed = new Set(ordered.flatMap((phase) => phase.satisfies ?? []));
        const requirementIds = [
            ...spec.userStories.map((story) => story.id),
            ...spec.acceptanceCriteria.map((criterion) => criterion.id),
        ];
        const uncovered = requirementIds.filter((id) => !claimed.has(id));
        if (uncovered.length > 0 && claimed.size > 0) {
            issues.push(`Requirements not claimed by any roadmap phase: ${uncovered.join(', ')}`);
        }
    }

    return { roadmap: ordered, issues };
}
