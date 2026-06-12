/**
 * URL validation for user-supplied reference sites. Workers' fetch already
 * blocks direct IP-literal egress at the edge, but the rules here are the
 * application-level SSRF posture (OWASP A10): scheme allowlist, no IP
 * literals or internal hostnames, and a hard block on our own surfaces so
 * the ingester can never be pointed at the platform itself.
 */

export interface UrlValidationOk {
    ok: true;
    url: URL;
}

export interface UrlValidationError {
    ok: false;
    reason: string;
}

export type UrlValidationResult = UrlValidationOk | UrlValidationError;

const BLOCKED_HOST_SUFFIXES = [
    'getdreamforge.com',
    'cloudflare.com',
    'localhost',
    'local',
    'internal',
    'home.arpa',
];

const IPV4_PATTERN = /^\d{1,3}(\.\d{1,3}){3}$/;

function isIpLiteral(hostname: string): boolean {
    if (IPV4_PATTERN.test(hostname)) return true;
    // URL normalizes IPv6 hosts to bracketed form.
    if (hostname.startsWith('[') || hostname.includes(':')) return true;
    return false;
}

function isBlockedHost(hostname: string): boolean {
    const host = hostname.toLowerCase();
    return BLOCKED_HOST_SUFFIXES.some(
        (suffix) => host === suffix || host.endsWith(`.${suffix}`),
    );
}

export function validateReferenceUrl(raw: string): UrlValidationResult {
    let url: URL;
    try {
        url = new URL(raw.trim());
    } catch {
        return { ok: false, reason: 'Not a valid URL' };
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        return { ok: false, reason: `Unsupported scheme: ${url.protocol}` };
    }
    if (url.username !== '' || url.password !== '') {
        return { ok: false, reason: 'URLs with embedded credentials are not allowed' };
    }
    if (isIpLiteral(url.hostname)) {
        return { ok: false, reason: 'IP-literal hosts are not allowed' };
    }
    if (!url.hostname.includes('.')) {
        return { ok: false, reason: 'Single-label hostnames are not allowed' };
    }
    if (isBlockedHost(url.hostname)) {
        return { ok: false, reason: 'This host cannot be used as a reference site' };
    }
    return { ok: true, url };
}

/**
 * Pulls the first usable URL out of free text (the interview's look-and-feel
 * answer). Accepts explicit http(s) URLs and bare `www.` / domain-with-path
 * mentions, normalizing to https.
 */
export function extractUrlFromText(text: string): string | null {
    const explicit = text.match(/https?:\/\/[^\s"'<>)]+/i);
    const candidate =
        explicit?.[0] ??
        text.match(/(?:^|\s)((?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s"'<>)]*)?)(?:\s|$|[.,!?])/i)?.[1];
    if (!candidate) return null;

    const normalized = candidate.startsWith('http') ? candidate : `https://${candidate}`;
    const validation = validateReferenceUrl(normalized.replace(/[.,!?]+$/, ''));
    return validation.ok ? validation.url.toString() : null;
}

/**
 * Minimal robots.txt courtesy check for third-party sites: honors a
 * full-site `Disallow: /` under `User-agent: *`. Errors (no robots.txt,
 * network failure) read as allowed.
 */
export async function isAllowedByRobots(url: URL): Promise<boolean> {
    try {
        const response = await fetch(`${url.origin}/robots.txt`, {
            signal: AbortSignal.timeout(5000),
            headers: { 'User-Agent': 'DreamforgeReferenceBot/1.0 (+https://getdreamforge.com)' },
        });
        if (!response.ok) return true;
        const body = await response.text();

        let inWildcardGroup = false;
        for (const rawLine of body.split('\n')) {
            const line = rawLine.replace(/#.*$/, '').trim().toLowerCase();
            if (line.startsWith('user-agent:')) {
                inWildcardGroup = line.slice('user-agent:'.length).trim() === '*';
            } else if (inWildcardGroup && line === 'disallow: /') {
                return false;
            }
        }
        return true;
    } catch {
        return true;
    }
}
