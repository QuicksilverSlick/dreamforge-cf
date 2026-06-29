/**
 * Starts the "Connect Cloudflare" OAuth flow.
 *
 * Navigates to the worker's `/oauth/login` route (carved out to Hono in PR A),
 * which begins the authorization-code exchange and sets the encrypted OAuth
 * cookie on the callback. `return_url` brings the user back to where they
 * started once the flow completes; it defaults to the current location.
 */
export function startCloudflareConnect(returnUrl?: string): void {
	const url = new URL('/oauth/login', window.location.origin);
	url.searchParams.set(
		'return_url',
		returnUrl ?? window.location.pathname + window.location.search,
	);
	window.location.href = url.toString();
}
