/**
 * Per-app Cloudflare resource ids recorded on first provision and reused on
 * every subsequent sandbox (re)creation (continuity arc). Passing these as
 * `knownResources` makes provisioning skip creation and bind the same store.
 * Sourced from the zod schema so the wire and internal shapes never drift.
 */
import type { KnownResources } from './sandboxTypes';
export type { KnownResources };

export interface ResourceProvisioningResult {
    success: boolean;
    provisioned: Array<{
        placeholder: string;
        resourceType: 'KV' | 'D1';
        resourceId: string;
        binding?: string;
    }>;
    failed: Array<{
        placeholder: string;
        resourceType: 'KV' | 'D1';
        error: string;
        binding?: string;
    }>;
    replacements: Record<string, string>;
    wranglerUpdated: boolean;
    /** Ids CREATED this call (not reused) — the caller records them on the app row. */
    newlyProvisioned: KnownResources;
}

export interface ResourceProvisioningOptions {
    projectName: string;
    instanceId: string;
    continueOnError: boolean;
}

export interface WranglerConfigValidationResult {
    isValid: boolean;
    hasPlaceholders: boolean;
    unresolvedPlaceholders: string[];
    errors?: string[];
}