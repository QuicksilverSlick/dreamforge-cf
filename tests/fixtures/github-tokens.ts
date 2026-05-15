/**
 * Mock GitHub Token Fixtures
 * Provides test tokens for various scenarios
 */

export const MOCK_TOKENS = {
  // Valid token formats
  VALID_OAUTH: 'gho_' + 'a'.repeat(36),
  VALID_PAT: 'ghp_' + 'b'.repeat(36),
  VALID_USER_TOKEN: 'ghu_' + 'c'.repeat(36),
  VALID_FINE_GRAINED: 'github_pat_' + 'd'.repeat(22) + '_' + 'e'.repeat(59),

  // Invalid formats
  INVALID_PREFIX: 'xyz_' + 'f'.repeat(36),
  INVALID_SHORT: 'gho_short',
  INVALID_LONG: 'gho_' + 'g'.repeat(252), // Exceeds 255 char limit
  INVALID_SPECIAL_CHARS: 'gho_' + 'h'.repeat(30) + '@#$!%^',
  INVALID_EMPTY: '',

  // Simulated states
  EXPIRED: 'gho_' + 'expired123456789012345678901234',
  REVOKED: 'gho_' + 'revoked123456789012345678901234',
  RATE_LIMITED: 'gho_' + 'ratelimit12345678901234567890'
} as const;

/**
 * Generate random valid OAuth token for property-based testing
 */
export function generateValidOAuthToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 36; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'gho_' + suffix;
}

/**
 * Generate random valid PAT token
 */
export function generateValidPATToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 36; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'ghp_' + suffix;
}

/**
 * Token scopes for testing
 */
export const MOCK_SCOPES = {
  FULL_ACCESS: ['repo', 'user', 'gist', 'workflow'],
  REPO_ONLY: ['repo'],
  PUBLIC_REPO_ONLY: ['public_repo'],
  USER_ONLY: ['user'],
  NO_REPO: ['user', 'gist'], // Missing repo access
  EMPTY: []
} as const;

/**
 * GitHub API responses for token validation
 */
export const MOCK_TOKEN_VALIDATION_RESPONSES = {
  VALID: {
    status: 200,
    headers: {
      'x-oauth-scopes': 'repo, user, gist'
    },
    body: {
      login: 'testuser',
      id: 123456,
      email: 'testuser@example.com'
    }
  },
  EXPIRED: {
    status: 401,
    headers: {},
    body: {
      message: 'Bad credentials',
      documentation_url: 'https://docs.github.com/rest'
    }
  },
  RATE_LIMITED: {
    status: 403,
    headers: {
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 3600)
    },
    body: {
      message: 'API rate limit exceeded',
      documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting'
    }
  },
  NO_REPO_SCOPE: {
    status: 200,
    headers: {
      'x-oauth-scopes': 'user, gist' // Missing 'repo'
    },
    body: {
      login: 'testuser',
      id: 123456
    }
  }
} as const;
