import { ACQUISITION_COOKIE } from 'worker/types/acquisition';
import type { Acquisition } from 'worker/types/acquisition';

const OUR_HOSTS = ['getdreamforge.com', 'localhost'];
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days

function hasCookie(name: string): boolean {
	return document.cookie.split(';').some((c) => c.trim().startsWith(`${name}=`));
}

/** document.referrer only when it's an EXTERNAL site (internal navigation isn't acquisition). */
function externalReferrer(): string | undefined {
	if (!document.referrer) {
		return undefined;
	}
	try {
		const host = new URL(document.referrer).hostname;
		const internal = OUR_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
		return internal ? undefined : document.referrer.slice(0, 300);
	} catch {
		return undefined;
	}
}

/**
 * Capture FIRST-TOUCH acquisition (UTM params + referrer) into the df_acq cookie,
 * ONLY if it isn't already set — so it survives until the visitor signs up, when
 * the server reads it once and writes users.acquisition. Idempotent and first-touch:
 * a returning visitor whose cookie is already set is left untouched. Best-effort —
 * never throws into app boot. (JSON.stringify drops the undefined fields.)
 */
export function captureAcquisition(): void {
	try {
		if (hasCookie(ACQUISITION_COOKIE)) {
			return; // first touch already recorded
		}
		const params = new URLSearchParams(window.location.search);
		const pick = (k: string): string | undefined => params.get(k)?.slice(0, 200) || undefined;
		const acquisition: Acquisition = {
			utmSource: pick('utm_source'),
			utmMedium: pick('utm_medium'),
			utmCampaign: pick('utm_campaign'),
			utmTerm: pick('utm_term'),
			utmContent: pick('utm_content'),
			referrer: externalReferrer(),
			landingPath: (window.location.pathname + window.location.search).slice(0, 300),
			capturedAt: new Date().toISOString(),
		};
		const value = encodeURIComponent(JSON.stringify(acquisition));
		const secure = window.location.protocol === 'https:' ? '; Secure' : '';
		document.cookie = `${ACQUISITION_COOKIE}=${value}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
	} catch {
		// Attribution is best-effort; a failure must never break app boot.
	}
}
