/**
 * Test Environment Setup
 * Provides configured Cloudflare Workers test environment
 */

import { env as cloudflareTestEnv } from 'cloudflare:test';

/**
 * Create test environment with all required bindings
 */
export async function createTestEnv(): Promise<Env> {
  // Cloudflare Vitest integration provides env automatically
  // This helper adds any custom configuration needed for tests

  const env = cloudflareTestEnv as Env;

  // Ensure encryption key is set for tests
  if (!env.SECRETS_ENCRYPTION_KEY) {
    // Use a test-only encryption key
    (env as { SECRETS_ENCRYPTION_KEY: string }).SECRETS_ENCRYPTION_KEY =
      'test-encryption-key-32-characters-long-for-testing-only';
  }

  // Set other test-specific env vars
  if (!env.GOOGLE_AI_STUDIO_API_KEY) {
    (env as { GOOGLE_AI_STUDIO_API_KEY?: string }).GOOGLE_AI_STUDIO_API_KEY =
      'test-gemini-api-key';
  }

  return env;
}

/**
 * Clean up test database after tests
 */
export async function cleanupTestDatabase(env: Env): Promise<void> {
  // Delete test data
  await env.DB.exec(`
    DELETE FROM github_tokens WHERE userId LIKE 'test-%';
    DELETE FROM blueprint_cache WHERE userId LIKE 'test-%';
  `);
}

/**
 * Reset Durable Object state for testing
 */
export async function resetDurableObjectState(
  env: Env,
  objectName: string,
  objectId: string
): Promise<void> {
  // Durable Objects in tests have isolated storage per test
  // This is handled automatically by vitest-pool-workers
  // This function is a placeholder for custom reset logic if needed
}
