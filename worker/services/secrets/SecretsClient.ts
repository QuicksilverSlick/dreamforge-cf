/**
 * SecretsClient — no-op shim.
 *
 * Upstream `cloudflare/vibesdk` ships a `SecretsClient` that talks to the
 * `UserSecretsStore` Durable Object (a per-user encrypted KV with TTL).
 * The Dreamforge fork tombstoned `UserSecretsStore` in DO migration v5
 * and moved secret storage to D1 via `worker/database/services/
 * SecretsService.ts`. The upstream agent code expects a `SecretsClient`
 * instance to be reachable from the agent infrastructure regardless;
 * this shim provides one whose methods return null / empty so the
 * agent can run on the fork's D1-backed pattern without code branches.
 *
 * If/when the fork lands a real vault (e.g. M4/PR-9), replace this file
 * with a thin adapter over the D1-backed `SecretsService`.
 */

/** Mirror of upstream's `UserSecretsStoreStub` shape. Unused in the shim. */
export type UserSecretsStoreStub = unknown;

export class SecretsClient {
    /**
     * True when a real vault is wired; always false on the fork. Code
     * paths that need to gate on vault availability should read this
     * rather than `instanceof` checking.
     */
    readonly available = false;

    constructor(_env: Env, _userId?: string) {
        // Intentionally empty — the shim has no state.
    }

    async get(_key: string): Promise<string | null> {
        return null;
    }

    async set(_key: string, _value: string): Promise<void> {
        // no-op
    }

    async delete(_key: string): Promise<void> {
        // no-op
    }

    async list(): Promise<string[]> {
        return [];
    }
}
