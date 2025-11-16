# BYOP Testing Implementation Guide

## Quick Start

### 1. Install Dependencies

```bash
# Core testing dependencies already in package.json:
# - vitest: 3.2.4+
# - @cloudflare/vitest-pool-workers: 0.8.71+

# Add property-based testing
npm install --save-dev fast-check
```

### 2. Configure Vitest

Create `vitest.config.ts` (already exists):

```typescript
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
        miniflare: {
          compatibilityDate: '2024-12-12',
          compatibilityFlags: ['nodejs_compat'],
        },
      },
    },
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/tests/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  },
});
```

### 3. Create Test Setup File

Create `tests/setup.ts`:

```typescript
import { beforeAll, afterAll } from 'vitest';
import { env } from 'cloudflare:test';

beforeAll(async () => {
  // Global test setup
  console.log('Setting up test environment...');

  // Ensure test encryption key is set
  if (!env.SECRETS_ENCRYPTION_KEY) {
    throw new Error('SECRETS_ENCRYPTION_KEY must be set for tests');
  }
});

afterAll(async () => {
  // Global test cleanup
  console.log('Cleaning up test environment...');
});
```

### 4. Update Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "vitest run tests/e2e",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:debug": "vitest --inspect --no-file-parallelism"
  }
}
```

## Running Tests

### Local Development

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Run specific test file
npm test tests/unit/services/GitHubTokenService.test.ts

# Run tests matching pattern
npm test -- --grep "encryption"

# Run with coverage
npm run test:coverage

# Debug tests (with Chrome DevTools)
npm run test:debug
```

### CI/CD

Tests automatically run on:
- Push to `main` or `develop` branches
- Pull requests
- Changes to BYOP-related files

## Test File Organization

```
tests/
├── unit/                           # Unit tests (30% of coverage)
│   ├── services/
│   │   ├── GitHubTokenService.test.ts
│   │   ├── BlueprintCacheService.test.ts
│   │   └── CodeAnalysisService.test.ts
│   ├── utils/
│   │   └── tokenValidation.test.ts
│   └── property-based/
│       └── encryption.property.test.ts
│
├── integration/                    # Integration tests (50% of coverage)
│   ├── controllers/
│   │   └── BYOPController.test.ts
│   ├── durable-objects/
│   │   └── CodebaseAnalyzer.test.ts
│   ├── database/
│   │   ├── githubTokens.test.ts
│   │   └── blueprintCache.test.ts
│   └── websocket/
│       └── analysisWebSocket.test.ts
│
├── e2e/                            # E2E tests (10% of coverage)
│   ├── byop-happy-path.test.ts
│   ├── byop-cache-hit.test.ts
│   └── byop-error-recovery.test.ts
│
├── fixtures/                       # Test data
│   ├── index.ts
│   ├── github-tokens.ts
│   ├── github-repositories.ts
│   ├── mock-blueprints.ts
│   └── analysis-states.ts
│
└── helpers/                        # Test utilities
    ├── test-env.ts
    ├── mock-github-api.ts
    └── websocket-client.ts
```

## Writing Your First Test

### Example: Unit Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { GitHubTokenService } from '../../../worker/database/services/GitHubTokenService';
import { createTestEnv } from '../../helpers/test-env';

describe('GitHubTokenService', () => {
  let env: Env;
  let service: GitHubTokenService;

  beforeEach(async () => {
    env = await createTestEnv();
    service = new GitHubTokenService(env);
  });

  it('should encrypt and decrypt token successfully', async () => {
    const originalToken = 'gho_' + 'a'.repeat(36);

    const encrypted = await (service as any).encryptToken(originalToken);
    const decrypted = await service.decryptToken(encrypted);

    expect(decrypted).toBe(originalToken);
  });
});
```

### Example: Integration Test

```typescript
import { describe, it, expect } from 'vitest';
import { env, SELF } from 'cloudflare:test';

describe('BYOP API', () => {
  it('should list repositories', async () => {
    const response = await SELF.fetch('http://example.com/api/byop/repositories', {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.repositories).toBeInstanceOf(Array);
  });
});
```

### Example: Property-Based Test

```typescript
import { describe, it } from 'vitest';
import fc from 'fast-check';

describe('Token Validation Properties', () => {
  it('should accept all valid OAuth token formats', async () => {
    await fc.assert(
      fc.property(
        fc.tuple(
          fc.constant('gho_'),
          fc.stringOf(fc.alphaNumeric(), { minLength: 36, maxLength: 36 })
        ).map(([prefix, suffix]) => prefix + suffix),
        (validToken) => {
          const isValid = validateGitHubToken(validToken);
          expect(isValid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

## Common Testing Patterns

### Mocking GitHub API

```typescript
import { mockGitHubAPI, resetGitHubMocks } from '../../helpers/mock-github-api';

beforeEach(() => {
  mockGitHubAPI({
    repositories: [
      { name: 'test-repo', ... }
    ]
  });
});

afterEach(() => {
  resetGitHubMocks();
});
```

### Testing Durable Objects

```typescript
import { env } from 'cloudflare:test';

it('should handle Durable Object state', async () => {
  const analyzerId = env.CodebaseAnalyzerObject.idFromName('test-analysis');
  const analyzerStub = env.CodebaseAnalyzerObject.get(analyzerId);

  const response = await analyzerStub.fetch('http://analyzer/start', {
    method: 'POST',
    body: JSON.stringify({ repositoryUrl: 'https://github.com/user/repo' })
  });

  const result = await response.json();
  expect(result.success).toBe(true);
});
```

### Testing WebSocket Connections

```typescript
import { createWebSocketClient } from '../../helpers/websocket-client';

it('should receive progress updates via WebSocket', async () => {
  const wsClient = await createWebSocketClient(analysisId, authToken);

  const progressUpdates: number[] = [];

  wsClient.onMessage((message) => {
    if (message.progress !== undefined) {
      progressUpdates.push(message.progress);
    }
  });

  await wsClient.waitForCompletion(30000);

  expect(progressUpdates.length).toBeGreaterThan(0);
  expect(progressUpdates[progressUpdates.length - 1]).toBe(100);

  wsClient.close();
});
```

### Testing Database Operations

```typescript
it('should store and retrieve encrypted token', async () => {
  const tokenService = new GitHubTokenService(env);

  await tokenService.storeToken('user-123', 'gho_token', ['repo']);

  const retrieved = await tokenService.getActiveToken('user-123');

  expect(retrieved).not.toBeNull();
  expect(retrieved?.token).toBe('gho_token');
});
```

## Debugging Tests

### Using Chrome DevTools

```bash
# Start tests in debug mode
npm run test:debug

# Open chrome://inspect in Chrome
# Click "inspect" on the Node target
# Set breakpoints and debug
```

### Vitest UI

```bash
# Start Vitest UI
npm run test:ui

# Open http://localhost:51204/__vitest__/
# Visual test runner with filtering and debugging
```

### Logging

```typescript
it('should debug test issue', () => {
  console.log('Debug info:', someVariable);
  console.table(arrayData);

  // Vitest will show these in test output
});
```

## Coverage Requirements

### Per-Component Targets

- **Services** (GitHubTokenService, etc.): 90%+ coverage
- **Controllers**: 85%+ coverage
- **Utilities**: 80%+ coverage
- **Overall**: 80%+ coverage

### Viewing Coverage Reports

```bash
# Generate coverage
npm run test:coverage

# Open HTML report
open coverage/index.html
```

### Coverage Exclusions

Add comments to exclude lines from coverage:

```typescript
/* istanbul ignore next */
function unreachableCode() {
  // This won't count against coverage
}
```

## Troubleshooting

### Issue: Tests fail with "SECRETS_ENCRYPTION_KEY not set"

**Solution**: Create `.dev.vars` file with test key:

```bash
echo "SECRETS_ENCRYPTION_KEY=test-key-32-chars-long-here-ok" > .dev.vars
```

### Issue: Durable Object tests are slow

**Solution**: Use isolated test cases and reset state:

```typescript
beforeEach(() => {
  // Each test gets fresh DO state
});
```

### Issue: WebSocket tests timeout

**Solution**: Increase timeout for async operations:

```typescript
it('should complete analysis', async () => {
  // Test code...
}, 60000); // 60 second timeout
```

### Issue: Database tests interfere with each other

**Solution**: Use unique user IDs per test:

```typescript
const testUserId = `test-user-${Date.now()}`;
```

## Best Practices

### 1. Test Naming

```typescript
// Good
it('should encrypt token with XChaCha20-Poly1305')
it('should return 401 when GitHub token is expired')
it('should cache blueprint after successful analysis')

// Bad
it('works')
it('test encryption')
it('api test')
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('should deactivate old token when storing new one', async () => {
  // Arrange
  const userId = 'test-user';
  await service.storeToken(userId, 'old-token', ['repo']);

  // Act
  await service.storeToken(userId, 'new-token', ['repo']);

  // Assert
  const retrieved = await service.getActiveToken(userId);
  expect(retrieved?.token).toBe('new-token');
});
```

### 3. Test Independence

```typescript
// Each test should be independent
describe('GitHubTokenService', () => {
  beforeEach(async () => {
    // Fresh state for each test
    env = await createTestEnv();
    service = new GitHubTokenService(env);
  });

  // Tests don't depend on each other
});
```

### 4. Mock External Dependencies

```typescript
// Don't make real API calls in tests
beforeEach(() => {
  mockGitHubAPI();
});

afterEach(() => {
  resetGitHubMocks();
});
```

### 5. Use Fixtures

```typescript
// Use shared fixtures instead of inline data
import { MOCK_TOKENS, MOCK_REPOSITORIES } from '../fixtures';

it('should validate token', async () => {
  const result = await service.validateToken(MOCK_TOKENS.VALID_OAUTH);
  expect(result).toBe(true);
});
```

## Next Steps

1. **Run existing tests**: `npm test`
2. **Add unit tests** for new services
3. **Implement integration tests** for API endpoints
4. **Create E2E tests** for critical user journeys
5. **Set up CI/CD** to run tests automatically
6. **Monitor coverage** and maintain 80%+ threshold

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Cloudflare Workers Testing](https://developers.cloudflare.com/workers/testing/)
- [fast-check Documentation](https://fast-check.dev/)
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

---

**Generated by Dreamforge Test Engineer**
**2025 Testing Standards**
