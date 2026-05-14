export const getProtocolForHost = (host: string): string => {
    if (host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('0.0.0.0') || host.startsWith('::1')) {
        return 'http';
    } else {
        return 'https';
    }
}
export function getPreviewDomain(env: Env): string {
    if (env.CUSTOM_PREVIEW_DOMAIN && env.CUSTOM_PREVIEW_DOMAIN.trim() !== '') {
        return env.CUSTOM_PREVIEW_DOMAIN;
    }
    return env.CUSTOM_DOMAIN;
}

export function buildUserWorkerUrl(env: Env, deploymentId: string): string {
    const domain = getPreviewDomain(env);
    const protocol = getProtocolForHost(domain);
    return `${protocol}://${deploymentId}.${domain}`;
}

/**
 * Returns true when `origin` is a browser Origin that belongs to a preview
 * deployment under `CUSTOM_PREVIEW_DOMAIN` (or `CUSTOM_DOMAIN` as fallback).
 *
 * Used to gate the AI Gateway proxy at `/api/proxy/openai` so that only
 * generated user-app iframes (running on `<deploymentId>.<previewDomain>`)
 * can reach it — never arbitrary third-party sites and never the main app
 * domain itself, which talks to providers directly.
 *
 * Matching rules:
 *  - Origin header must be present and parse as a URL
 *  - Hostname must equal `previewDomain` OR end with `.<previewDomain>`
 *  - Missing / malformed / mismatched origins return `false`
 */
export function isPreviewOrigin(env: Env, origin: string | null): boolean {
    if (!origin) return false;
    let hostname: string;
    try {
        hostname = new URL(origin).hostname;
    } catch {
        return false;
    }
    const previewDomain = getPreviewDomain(env);
    if (!previewDomain) return false;
    return hostname === previewDomain || hostname.endsWith(`.${previewDomain}`);
}