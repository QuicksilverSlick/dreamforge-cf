/**
 * Per-app better-auth signing secret, derived (not stored) so the preview
 * sandbox and the deployed worker compute the SAME value.
 *
 * HKDF-SHA256 over the platform SECRETS_ENCRYPTION_KEY, salted by the app id:
 * one-way, unguessable, stable across restarts, and byte-identical everywhere
 * it is derived — so a user's sessions survive the preview → production
 * boundary with zero secret storage. Both the DO (preview env) and the deploy
 * path import this so the two derivations can never drift.
 */
export async function deriveBetterAuthSecret(secretsEncryptionKey: string, appId: string): Promise<string> {
	if (!secretsEncryptionKey || secretsEncryptionKey.length < 32) {
		throw new Error('SECRETS_ENCRYPTION_KEY must be set (>=32 chars) to derive the app auth secret');
	}
	if (!appId) {
		throw new Error('appId is required to derive the app auth secret');
	}
	const enc = new TextEncoder();
	const key = await crypto.subtle.importKey('raw', enc.encode(secretsEncryptionKey), 'HKDF', false, ['deriveBits']);
	const bits = await crypto.subtle.deriveBits(
		{ name: 'HKDF', hash: 'SHA-256', salt: enc.encode(appId), info: enc.encode('better-auth-secret') },
		key,
		256,
	);
	return Array.from(new Uint8Array(bits))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}
