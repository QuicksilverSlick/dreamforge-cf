/**
 * GitHub API Mocking Utilities
 * Provides mock responses for GitHub API calls
 */

import { vi } from 'vitest';
import { fetchMock } from 'cloudflare:test';
import { MOCK_REPOSITORIES } from '../fixtures/github-repositories';
import { MOCK_TOKEN_VALIDATION_RESPONSES } from '../fixtures/github-tokens';

interface MockGitHubOptions {
  repositories?: typeof MOCK_REPOSITORIES;
  simulateError?: boolean;
  errorCode?: number;
  simulateRateLimit?: boolean;
  simulateInvalidToken?: boolean;
  simulateCloneFailure?: boolean;
}

/**
 * Setup GitHub API mocks
 */
export function mockGitHubAPI(options: MockGitHubOptions = {}): void {
  const {
    repositories = MOCK_REPOSITORIES,
    simulateError = false,
    errorCode = 500,
    simulateRateLimit = false,
    simulateInvalidToken = false
  } = options;

  // Mock GitHub API user endpoint (token validation)
  fetchMock.get('https://api.github.com')
    .intercept({ hostname: 'api.github.com', path: '/user' })
    .reply((request) => {
      const authHeader = request.headers.get('Authorization');

      if (simulateInvalidToken || !authHeader) {
        return Response.json(
          MOCK_TOKEN_VALIDATION_RESPONSES.EXPIRED.body,
          {
            status: 401,
            headers: MOCK_TOKEN_VALIDATION_RESPONSES.EXPIRED.headers
          }
        );
      }

      if (simulateRateLimit) {
        return Response.json(
          MOCK_TOKEN_VALIDATION_RESPONSES.RATE_LIMITED.body,
          {
            status: 403,
            headers: MOCK_TOKEN_VALIDATION_RESPONSES.RATE_LIMITED.headers
          }
        );
      }

      return Response.json(
        MOCK_TOKEN_VALIDATION_RESPONSES.VALID.body,
        {
          status: 200,
          headers: MOCK_TOKEN_VALIDATION_RESPONSES.VALID.headers
        }
      );
    });

  // Mock GitHub API repositories list endpoint
  fetchMock.get('https://api.github.com')
    .intercept({ hostname: 'api.github.com', path: '/user/repos' })
    .reply(() => {
      if (simulateError) {
        return Response.json(
          { message: 'Internal Server Error' },
          { status: errorCode }
        );
      }

      if (simulateRateLimit) {
        return Response.json(
          { message: 'API rate limit exceeded' },
          {
            status: 429,
            headers: {
              'x-ratelimit-remaining': '0',
              'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 3600)
            }
          }
        );
      }

      const repoArray = Object.values(repositories);
      return Response.json(repoArray, { status: 200 });
    });

  // Mock GitHub repository details endpoint
  fetchMock.get('https://api.github.com')
    .intercept({ hostname: 'api.github.com', path: /\/repos\/[\w-]+\/[\w-]+$/ })
    .reply((request) => {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const repoName = pathParts[pathParts.length - 1];

      const repo = Object.values(repositories).find(r => r.name === repoName);

      if (!repo) {
        return Response.json(
          { message: 'Not Found' },
          { status: 404 }
        );
      }

      return Response.json(repo, { status: 200 });
    });
}

/**
 * Reset all GitHub API mocks
 */
export function resetGitHubMocks(): void {
  fetchMock.deactivate();
  vi.clearAllMocks();
}

/**
 * Mock Octokit client for integration tests
 */
export function createMockOctokit() {
  return {
    repos: {
      listForAuthenticatedUser: vi.fn().mockResolvedValue({
        data: Object.values(MOCK_REPOSITORIES)
      }),
      get: vi.fn().mockResolvedValue({
        data: MOCK_REPOSITORIES.SIMPLE_REACT
      })
    },
    users: {
      getAuthenticated: vi.fn().mockResolvedValue({
        data: {
          login: 'testuser',
          id: 123456,
          email: 'testuser@example.com'
        }
      })
    }
  };
}
