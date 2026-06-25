/**
 * First-touch acquisition attribution captured at signup. Populated from the
 * `df_acq` first-party cookie the SPA sets on first load (UTM params + referrer),
 * written to `users.acquisition` ONCE at user creation. All fields optional — a
 * direct visit with no UTMs and no referrer yields an (almost) empty record.
 */
export interface Acquisition {
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmTerm?: string;
	utmContent?: string;
	/** document.referrer at first touch (the prior site, e.g. a search engine). */
	referrer?: string;
	/** First-touch path on our property (e.g. '/?prompt=...'). */
	landingPath?: string;
	/** ISO timestamp of first touch. */
	capturedAt?: string;
}

/** The first-party cookie the SPA writes at first touch and the server reads at signup. */
export const ACQUISITION_COOKIE = 'df_acq';

/** Max bytes accepted from the cookie — a hard cap against an oversized forged cookie. */
export const ACQUISITION_MAX_BYTES = 1024;
