/**
 * Type augmentations for Cloudflare Env
 * These are additional environment variables not auto-detected by wrangler types
 */
declare namespace Cloudflare {
	interface Env {
		// Development mode flag
		DEV_MODE?: string;

		// Cloudflare configuration
		CF_ACCOUNT_ID?: string;
		CF_AI_GATEWAY_ID?: string;
		CLOUDFLARE_ACCOUNT_ID?: string;
		CLOUDFLARE_API_TOKEN?: string;
		CLOUDFLARE_AI_GATEWAY_URL?: string;

		// OAuth providers
		GOOGLE_CLIENT_ID?: string;
		GOOGLE_CLIENT_SECRET?: string;
		GITHUB_CLIENT_ID?: string;
		GITHUB_CLIENT_SECRET?: string;
		GITHUB_EXPORTER_CLIENT_ID?: string;
		GITHUB_EXPORTER_CLIENT_SECRET?: string;

		// AI/ML API keys
		OPENROUTER_API_KEY?: string;
		ANTHROPIC_API_KEY?: string;

		// Observability
		SENTRY_DSN?: string;
		CF_ACCESS_ID?: string;
		CF_ACCESS_SECRET?: string;

		// External services
		SERPAPI_KEY?: string;
		SANDBOX_SERVICE_TYPE?: string;
		SANDBOX_SERVICE_URL?: string;
		SANDBOX_SERVICE_API_KEY?: string;
	}
}
