/**
 * E2E Test: BYOP Happy Path
 * Tests complete user journey from authentication to blueprint generation
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { env, SELF } from 'cloudflare:test';
import { GitHubTokenService } from '../../worker/database/services/GitHubTokenService';
import { BlueprintCacheService } from '../../worker/database/services/BlueprintCacheService';
import { createWebSocketClient } from '../helpers/websocket-client';
import { mockGitHubAPI, resetGitHubMocks } from '../helpers/mock-github-api';
import { MOCK_TOKENS } from '../fixtures/github-tokens';

describe('BYOP E2E - Happy Path', () => {
  let testUserId: string;
  let authToken: string;

  beforeAll(async () => {
    testUserId = `e2e-user-${Date.now()}`;

    // Setup: Store GitHub token for test user
    const tokenService = new GitHubTokenService(env);
    await tokenService.storeToken(
      testUserId,
      MOCK_TOKENS.VALID_OAUTH,
      ['repo', 'user']
    );

    // Create auth token
    authToken = await createTestAuthToken(testUserId);

    // Mock GitHub API
    mockGitHubAPI({
      repositories: [
        {
          id: 123456,
          name: 'simple-react-app',
          full_name: 'testuser/simple-react-app',
          html_url: 'https://github.com/testuser/simple-react-app',
          clone_url: 'https://github.com/testuser/simple-react-app.git',
          description: 'A simple React application',
          language: 'TypeScript',
          default_branch: 'main',
          private: false,
          stargazers_count: 42,
          forks_count: 7,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ]
    });
  });

  afterAll(() => {
    resetGitHubMocks();
  });

  it('should complete full BYOP import workflow', async () => {
    console.log('\n=== Starting E2E BYOP Happy Path Test ===\n');

    // Step 1: List Repositories
    console.log('Step 1: Listing repositories...');
    const listResponse = await SELF.fetch('http://example.com/api/byop/repositories', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    expect(listResponse.status).toBe(200);

    const listData = await listResponse.json() as {
      success: boolean;
      repositories: Array<{ name: string; fullName: string }>;
      total: number;
    };

    expect(listData.success).toBe(true);
    expect(listData.repositories).toBeInstanceOf(Array);
    expect(listData.repositories.length).toBeGreaterThan(0);

    const selectedRepo = listData.repositories[0];
    console.log(`  ✓ Found ${listData.total} repositories`);
    console.log(`  ✓ Selected: ${selectedRepo.fullName}\n`);

    // Step 2: Initiate Import
    console.log('Step 2: Initiating import...');
    const importResponse = await SELF.fetch('http://example.com/api/byop/import', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        repositoryUrl: 'https://github.com/testuser/simple-react-app',
        branch: 'main'
      })
    });

    expect(importResponse.status).toBe(200);

    const importData = await importResponse.json() as {
      success: boolean;
      analysisId: string;
      repositoryName: string;
      filesCount: number;
      fromCache?: boolean;
    };

    expect(importData.success).toBe(true);
    expect(importData.analysisId).toBeDefined();
    expect(importData.repositoryName).toBe('simple-react-app');

    const analysisId = importData.analysisId;

    // If from cache, skip to blueprint retrieval
    if (importData.fromCache) {
      console.log('  ✓ Cache hit - blueprint returned immediately\n');

      expect(importData).toHaveProperty('blueprint');
      console.log('=== E2E Test Completed Successfully (Cache Hit) ===\n');
      return;
    }

    console.log(`  ✓ Import started - Analysis ID: ${analysisId}`);
    console.log(`  ✓ Repository: ${importData.repositoryName}`);
    console.log(`  ✓ Files to analyze: ${importData.filesCount}\n`);

    // Step 3: Connect WebSocket for Progress Updates
    console.log('Step 3: Connecting to WebSocket...');
    const wsClient = await createWebSocketClient(analysisId, authToken);

    const progressUpdates: Array<{ phase: string; progress: number }> = [];

    wsClient.onMessage((message) => {
      console.log(`  📡 Progress: ${message.progress}% - ${message.phase || 'Processing'}`);
      progressUpdates.push({
        phase: message.phase || 'unknown',
        progress: message.progress
      });
    });

    // Wait for analysis to complete (or timeout after 60 seconds)
    const completed = await wsClient.waitForCompletion(60000);

    expect(completed).toBe(true);
    expect(progressUpdates.length).toBeGreaterThan(0);

    const lastUpdate = progressUpdates[progressUpdates.length - 1];
    expect(lastUpdate.progress).toBe(100);

    console.log('  ✓ WebSocket connection established');
    console.log(`  ✓ Received ${progressUpdates.length} progress updates`);
    console.log('  ✓ Analysis completed\n');

    wsClient.close();

    // Step 4: Poll Status (verify state)
    console.log('Step 4: Verifying analysis status...');
    const statusResponse = await SELF.fetch(
      `http://example.com/api/byop/analysis/${analysisId}/status`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    expect(statusResponse.status).toBe(200);

    const statusData = await statusResponse.json() as {
      status: string;
      progress: number;
      repositoryUrl: string;
      fileCount: number;
    };

    expect(statusData.status).toBe('completed');
    expect(statusData.progress).toBe(100);
    expect(statusData.repositoryUrl).toBe('https://github.com/testuser/simple-react-app');

    console.log('  ✓ Status: completed');
    console.log(`  ✓ Progress: ${statusData.progress}%`);
    console.log(`  ✓ Files analyzed: ${statusData.fileCount}\n`);

    // Step 5: Retrieve Blueprint
    console.log('Step 5: Retrieving blueprint...');
    const blueprintResponse = await SELF.fetch(
      `http://example.com/api/byop/analysis/${analysisId}/blueprint`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    expect(blueprintResponse.status).toBe(200);

    const blueprintData = await blueprintResponse.json() as {
      blueprint: {
        projectName: string;
        framework: string;
        currentState: {
          completenessPercentage: number;
        };
        dependencies: Record<string, string>;
        suggestedTasks: Array<{ title: string }>;
      };
    };

    expect(blueprintData.blueprint).toBeDefined();
    expect(blueprintData.blueprint.projectName).toBe('simple-react-app');
    expect(blueprintData.blueprint.framework).toBeDefined();
    expect(blueprintData.blueprint.currentState.completenessPercentage).toBeGreaterThan(0);
    expect(blueprintData.blueprint.dependencies).toBeDefined();
    expect(blueprintData.blueprint.suggestedTasks).toBeInstanceOf(Array);

    console.log('  ✓ Blueprint retrieved successfully');
    console.log(`  ✓ Project: ${blueprintData.blueprint.projectName}`);
    console.log(`  ✓ Framework: ${blueprintData.blueprint.framework}`);
    console.log(`  ✓ Completeness: ${blueprintData.blueprint.currentState.completenessPercentage}%`);
    console.log(`  ✓ Dependencies: ${Object.keys(blueprintData.blueprint.dependencies).length}`);
    console.log(`  ✓ Suggested tasks: ${blueprintData.blueprint.suggestedTasks.length}\n`);

    // Step 6: Verify Cache Storage
    console.log('Step 6: Verifying blueprint was cached...');
    const cacheService = new BlueprintCacheService(env);
    const cached = await cacheService.get(
      testUserId,
      'https://github.com/testuser/simple-react-app',
      'main'
    );

    expect(cached).not.toBeNull();
    expect(cached?.repositoryName).toBe('simple-react-app');
    expect(cached?.completenessPercentage).toBe(
      blueprintData.blueprint.currentState.completenessPercentage
    );

    console.log('  ✓ Blueprint cached in D1');
    console.log(`  ✓ Cache ID: ${cached?.id}`);
    console.log(`  ✓ Access count: ${cached?.accessCount}\n`);

    console.log('=== E2E Test Completed Successfully ===\n');
  }, 90000); // 90 second timeout for full workflow

  it('should handle cache hit on second import', async () => {
    console.log('\n=== Testing Cache Hit Scenario ===\n');

    const repositoryUrl = 'https://github.com/testuser/simple-react-app';

    // First import (should go through full analysis)
    console.log('Attempt 1: First import (full analysis)...');
    const firstResponse = await SELF.fetch('http://example.com/api/byop/import', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        repositoryUrl,
        branch: 'main'
      })
    });

    const firstData = await firstResponse.json() as {
      success: boolean;
      fromCache?: boolean;
      analysisId?: string;
      blueprint?: unknown;
    };

    if (!firstData.fromCache) {
      // Wait for analysis to complete
      const wsClient = await createWebSocketClient(firstData.analysisId!, authToken);
      await wsClient.waitForCompletion(60000);
      wsClient.close();

      // Retrieve blueprint to ensure it's cached
      await SELF.fetch(
        `http://example.com/api/byop/analysis/${firstData.analysisId}/blueprint`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('  ✓ First import completed and cached\n');
    }

    // Second import (should hit cache)
    console.log('Attempt 2: Second import (should hit cache)...');
    const secondResponse = await SELF.fetch('http://example.com/api/byop/import', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        repositoryUrl,
        branch: 'main'
      })
    });

    expect(secondResponse.status).toBe(200);

    const secondData = await secondResponse.json() as {
      success: boolean;
      fromCache: boolean;
      blueprint: unknown;
    };

    expect(secondData.success).toBe(true);
    expect(secondData.fromCache).toBe(true);
    expect(secondData.blueprint).toBeDefined();

    console.log('  ✓ Cache hit - instant return');
    console.log('  ✓ Blueprint retrieved from cache\n');

    // Verify cache access count increased
    const cacheService = new BlueprintCacheService(env);
    const cached = await cacheService.get(testUserId, repositoryUrl, 'main');

    expect(cached).not.toBeNull();
    expect(cached?.accessCount).toBeGreaterThan(0);

    console.log(`  ✓ Cache access count: ${cached?.accessCount}`);
    console.log('=== Cache Hit Test Completed ===\n');
  }, 90000);
});

// Helper to create test auth token
async function createTestAuthToken(userId: string): Promise<string> {
  // In real implementation, use your JWT creation logic
  // For testing, simplified approach
  return `test-auth-token-${userId}`;
}
