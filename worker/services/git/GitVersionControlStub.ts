/**
 * GitVersionControlStub — informative no-op implementation of the
 * `GitVersionControl` interface declared in `worker/agents/core/AgentCore.ts`.
 *
 * Upstream `cloudflare/vibesdk` ships a `GitVersionControl` class backed
 * by a dedicated Git Durable Object (M4/PR-6 territory in the
 * Dreamforge port sequence). M3 lands the single-agent topology without
 * pulling in that subsystem; the agent code is structured to call into
 * a `GitVersionControl` instance regardless, so this shim satisfies the
 * type and returns informative-error results from every operation.
 *
 * The agentic-mode behavior loop should see these `{ ok: false, reason }`
 * results and plan around them (per OQ-H — "thinned git.ts tool routes
 * to sandbox-side git CLI; returns informative errors when unavailable"
 * — though this stub does not yet attempt the sandbox-CLI route; that's
 * a follow-on enhancement once we know whether agentic mode actually
 * tries git operations frequently enough for the loop-on-no-op risk
 * called out in the v2 plan to manifest in practice).
 *
 * Replacement path: when M4/PR-6 lands, swap this stub for the real
 * Git-DO-backed `GitVersionControl` class. The interface and call
 * surface should not change.
 */

import type { GitVersionControl } from '../../agents/core/AgentCore';

const UNAVAILABLE_REASON =
    'Git tooling not wired in this build (M3 ships without the Git Durable Object subsystem). Plan without git operations.';

export class GitVersionControlStub implements GitVersionControl {
    readonly available = false;

    async init(): Promise<{ ok: boolean; reason?: string }> {
        return { ok: false, reason: UNAVAILABLE_REASON };
    }

    async commit(_message: string): Promise<{ ok: boolean; sha?: string; reason?: string }> {
        return { ok: false, reason: UNAVAILABLE_REASON };
    }

    async push(): Promise<{ ok: boolean; reason?: string }> {
        return { ok: false, reason: UNAVAILABLE_REASON };
    }

    async status(): Promise<{
        ok: boolean;
        clean?: boolean;
        files?: string[];
        reason?: string;
    }> {
        return { ok: false, reason: UNAVAILABLE_REASON };
    }
}
