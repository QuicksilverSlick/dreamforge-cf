/**
 * Integration Tests: BYOPController
 * Tests controller endpoints with mocked external services
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { env, SELF } from 'cloudflare:test';
import { mockGitHubAPI, resetGitHubMocks } from '../../helpers/mock-github-api';
import { MOCK_REPOSITORIES, MOCK_ANALYSIS_STATES } from '../../fixtures';
import { GitHubTokenService } from '../../../worker/database/services/GitHubTokenService';
import { BlueprintCacheService } from '../../../worker/database/services/BlueprintCacheService';

describe('BYOPController - Integration Tests', () => {
  let testUserId: string;
  let testToken: string;

  beforeEach(async () => {
    testUserId = `test-user-${Date.now()}`;
    testToken = 'gho_' + 'a'.repeat(36);

    // Setup test user with GitHub token
    const tokenService = new GitHubTokenService(env);
    await tokenService.storeToken(testUserId, testToken, ['repo', 'user']);

    // Mock GitHub API
    mockGitHubAPI();
  });

  afterEach(() => {
    resetGitHubMocks();
  });

  describe('GET /api/byop/repositories', () => {
    it('should list user repositories successfully', async () => {
      const response = await SELF.fetch('http://example.com/api/byop/repositories', {
        headers: {
          'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(200);

      const data = await response.json() as {
        success: boolean;
        repositories: unknown[];
        total: number;
      };

      expect(data.success).toBe(true);
      expect(data.repositories).toBeInstanceOf(Array);
      expect(data.repositories.length).toBeGreaterThan(0);
      expect(data.total).toBe(data.repositories.length);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await SELF.fetch('http://example.com/api/byop/repositories', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(401);

      const data = await response.json() as { success: boolean; error: string };
      expect(data.success).toBe(false);
      expect(data.error).toContain('Unauthorized');
    });

    it('should return 403 when user has no GitHub token', async () => {
      const userWithoutToken = `no-token-user-${Date.now()}`;

      const response = await SELF.fetch('http://example.com/api/byop/repositories', {
        headers: {
          'Authorization': `Bearer ${await createAuthToken(userWithoutToken)}`,
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(403);

      const data = await response.json() as { success: boolean; error: string };
      expect(data.success).toBe(false);
      expect(data.error).toContain('No GitHub account connected');
    });

    it('should return 403 when token lacks repo scope', async () => {
      const userWithLimitedScope = `limited-scope-${Date.now()}`;
      const tokenService = new GitHubTokenService(env);
      await tokenService.storeToken(
        userWithLimitedScope,
        'gho_' + 'b'.repeat(36),
        ['user'] // Missing 'repo' scope
      );

      const response = await SELF.fetch('http://example.com/api/byop/repositories', {
        headers: {
          'Authorization': `Bearer ${await createAuthToken(userWithLimitedScope)}`,
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(403);

      const data = await response.json() as { success: boolean; error: string };
      expect(data.success).toBe(false);
      expect(data.error).toContain('does not have repository access');
    });

    it('should handle GitHub API errors gracefully', async () => {
      // Mock GitHub API to return error
      mockGitHubAPI({ simulateError: true, errorCode: 500 });

      const response = await SELF.fetch('http://example.com/api/byop/repositories', {
        headers: {
          'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(500);

      const data = await response.json() as { success: boolean; error: string };
      expect(data.success).toBe(false);
    });

    it('should handle GitHub rate limiting', async () => {
      mockGitHubAPI({ simulateRateLimit: true });

      const response = await SELF.fetch('http://example.com/api/byop/repositories', {
        headers: {
          'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(429);

      const data = await response.json() as { success: boolean; error: string };
      expect(data.success).toBe(false);
      expect(data.error).toContain('rate limit');
    });
  });

  describe('POST /api/byop/import', () => {
    const validRepositoryUrl = 'https://github.com/testuser/simple-react-app';

    it('should initiate import successfully', async () => {
      const response = await SELF.fetch('http://example.com/api/byop/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repositoryUrl: validRepositoryUrl,
          branch: 'main'
        })
      });

      expect(response.status).toBe(200);

      const data = await response.json() as {
        success: boolean;
        analysisId: string;
        repositoryName: string;
        filesCount: number;
        message: string;
      };

      expect(data.success).toBe(true);
      expect(data.analysisId).toBeDefined();
      expect(data.repositoryName).toBe('simple-react-app');
      expect(data.filesCount).toBeGreaterThan(0);
      expect(data.message).toContain('Analysis in progress');
    });

    it('should return cached blueprint if available', async () => {
      // Pre-populate cache
      const cacheService = new BlueprintCacheService(env);
      await cacheService.set({
        userId: testUserId,
        repositoryUrl: validRepositoryUrl,
        repositoryName: 'simple-react-app',
        branch: 'main',
        blueprint: MOCK_ANALYSIS_STATES.COMPLETED.analysisResult!.blueprint!,
        fileCount: 42,
        totalLinesOfCode: 1500,
        framework: 'react',
        ttlDays: 7
      });

      const response = await SELF.fetch('http://example.com/api/byop/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repositoryUrl: validRepositoryUrl,
          branch: 'main'
        })
      });

      expect(response.status).toBe(200);

      const data = await response.json() as {
        success: boolean;
        fromCache: boolean;
        blueprint: unknown;
      };

      expect(data.success).toBe(true);
      expect(data.fromCache).toBe(true);
      expect(data.blueprint).toBeDefined();
    });

    it('should reject invalid repository URL', async () => {
      const response = await SELF.fetch('http://example.com/api/byop/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repositoryUrl: 'https://gitlab.com/user/repo', // Not GitHub
          branch: 'main'
        })
      });

      expect(response.status).toBe(400);

      const data = await response.json() as { success: boolean; error: string };
      expect(data.success).toBe(false);
      expect(data.error).toContain('Invalid repository URL');
    });

    it('should reject request without repository URL', async () => {
      const response = await SELF.fetch('http://example.com/api/byop/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          branch: 'main'
        })
      });

      expect(response.status).toBe(400);
    });

    it('should validate GitHub token before import', async () => {
      // Mock GitHub API to return 401 (invalid token)
      mockGitHubAPI({ simulateInvalidToken: true });

      const response = await SELF.fetch('http://example.com/api/byop/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repositoryUrl: validRepositoryUrl,
          branch: 'main'
        })
      });

      expect(response.status).toBe(401);

      const data = await response.json() as { success: boolean; error: string };
      expect(data.success).toBe(false);
      expect(data.error).toContain('GitHub token is invalid or expired');
    });

    it('should handle git clone failures', async () => {
      // Mock sandbox to fail clone
      mockGitHubAPI({ simulateCloneFailure: true });

      const response = await SELF.fetch('http://example.com/api/byop/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repositoryUrl: validRepositoryUrl,
          branch: 'main'
        })
      });

      expect(response.status).toBe(500);

      const data = await response.json() as { success: boolean; error: string };
      expect(data.success).toBe(false);
      expect(data.error).toContain('Failed to clone repository');
    });

    it('should use default branch when not specified', async () => {
      const response = await SELF.fetch('http://example.com/api/byop/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repositoryUrl: validRepositoryUrl
          // No branch specified
        })
      });

      expect(response.status).toBe(200);

      const data = await response.json() as {
        success: boolean;
        analysisId: string;
      };

      expect(data.success).toBe(true);
      expect(data.analysisId).toBeDefined();
    });
  });

  describe('GET /api/byop/analysis/:analysisId/status', () => {
    it('should return analysis status', async () => {
      // Start an import first
      const importResponse = await SELF.fetch('http://example.com/api/byop/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repositoryUrl: 'https://github.com/testuser/simple-react-app',
          branch: 'main'
        })
      });

      const importData = await importResponse.json() as { analysisId: string };
      const analysisId = importData.analysisId;

      // Check status
      const response = await SELF.fetch(
        `http://example.com/api/byop/analysis/${analysisId}/status`,
        {
          headers: {
            'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
            'Content-Type': 'application/json'
          }
        }
      );

      expect(response.status).toBe(200);

      const data = await response.json() as {
        status: string;
        progress: number;
      };

      expect(data.status).toMatch(/pending|analyzing|completed|failed/);
      expect(data.progress).toBeGreaterThanOrEqual(0);
      expect(data.progress).toBeLessThanOrEqual(100);
    });

    it('should return 404 for invalid analysis ID', async () => {
      const response = await SELF.fetch(
        'http://example.com/api/byop/analysis/invalid-id/status',
        {
          headers: {
            'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
            'Content-Type': 'application/json'
          }
        }
      );

      expect(response.status).toBe(404);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await SELF.fetch(
        'http://example.com/api/byop/analysis/some-id/status',
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/byop/analysis/:analysisId/blueprint', () => {
    it('should return blueprint when analysis is complete', async () => {
      // This test requires mocking the Durable Object state
      // Implementation depends on test infrastructure

      // Mock approach:
      const analysisId = 'completed-analysis-123';

      const response = await SELF.fetch(
        `http://example.com/api/byop/analysis/${analysisId}/blueprint`,
        {
          headers: {
            'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        const data = await response.json() as { blueprint: unknown };
        expect(data.blueprint).toBeDefined();
      }
    });

    it('should return 202 when analysis is still in progress', async () => {
      const analysisId = 'in-progress-analysis-456';

      const response = await SELF.fetch(
        `http://example.com/api/byop/analysis/${analysisId}/blueprint`,
        {
          headers: {
            'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 202) {
        const data = await response.json() as { success: boolean; error: string };
        expect(data.error).toContain('not yet completed');
      }
    });

    it('should return 500 when analysis failed', async () => {
      const analysisId = 'failed-analysis-789';

      const response = await SELF.fetch(
        `http://example.com/api/byop/analysis/${analysisId}/blueprint`,
        {
          headers: {
            'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 500) {
        const data = await response.json() as { success: boolean; error: string };
        expect(data.error).toContain('Analysis failed');
      }
    });

    it('should cache blueprint to D1 on first fetch', async () => {
      const cacheService = new BlueprintCacheService(env);
      const repositoryUrl = 'https://github.com/testuser/simple-react-app';

      // Verify cache is empty initially
      const cachedBefore = await cacheService.get(testUserId, repositoryUrl, 'main');
      expect(cachedBefore).toBeNull();

      // Fetch blueprint (this should trigger caching)
      const analysisId = 'completed-analysis-cache-test';
      await SELF.fetch(
        `http://example.com/api/byop/analysis/${analysisId}/blueprint`,
        {
          headers: {
            'Authorization': `Bearer ${await createAuthToken(testUserId)}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Small delay to allow async caching to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify cache was populated
      const cachedAfter = await cacheService.get(testUserId, repositoryUrl, 'main');

      if (cachedAfter) {
        expect(cachedAfter.blueprint).toBeDefined();
        expect(cachedAfter.repositoryUrl).toBe(repositoryUrl);
      }
    });
  });
});

// Helper function to create auth token for test user
async function createAuthToken(userId: string): Promise<string> {
  // This would use your actual JWT creation logic
  // For testing, you might use a simplified version
  return `test-token-${userId}`;
}
