# BYOP Feature Test Strategy (2025 Standards)

## Research Summary

Based on current 2025 testing best practices:

### Key Findings

1. **Testing Trophy Model (2025 Standard)**
   - Source: Kent C. Dodds Testing Trophy, 2025 modern practices
   - Distribution: 10% Static Analysis, 30% Unit, 50% Integration, 10% E2E
   - Rationale: Integration tests provide best ROI for API-heavy features

2. **Cloudflare Workers Testing (Official Recommendation)**
   - Source: Cloudflare Docs (November 2025)
   - Tool: Vitest with `@cloudflare/vitest-pool-workers` v0.8.71+
   - Runs tests in workerd runtime (same as production)
   - Built-in support for D1, Durable Objects, Service Bindings

3. **Property-Based Testing**
   - Source: fast-check (trusted by Jest, React, io-ts)
   - Use case: Encryption/decryption, token validation, edge cases
   - Generates hundreds of test cases automatically

4. **WebSocket Testing**
   - Source: 2025 Testing Best Practices
   - Focus: Message protocol, reconnection, concurrent connections
   - Tools: Native WebSocket mocking in Vitest

5. **Durable Object Testing**
   - Source: Cloudflare Docs (2025)
   - Strategy: Use Miniflare for local state testing
   - Isolated per-test storage via `cloudflare:test`

## Testing Trophy Distribution for BYOP

```
       E2E (10%)
      /         \
   Integration (50%)
    /              \
  Unit Tests (30%)
   /                \
Static Analysis (10%)
```

### Static Analysis (10%)
- TypeScript strict mode enforcement
- ESLint for API patterns and security
- Type coverage for critical paths
- Drizzle schema validation

### Unit Tests (30%)
- Pure functions and algorithms
- Encryption/decryption logic
- Token validation
- Cache key generation
- Error handling utilities

### Integration Tests (50%)
- Controller endpoints with mocked services
- Durable Object lifecycle
- Database operations (D1)
- WebSocket protocol compliance
- Service interactions

### E2E Tests (10%)
- Critical user journey: Full import flow
- GitHub OAuth → List repos → Import → Blueprint
- Cache hit scenario
- Error recovery paths

## Test Coverage Matrix

### Component Coverage

| Component | Unit | Integration | E2E | Priority |
|-----------|------|-------------|-----|----------|
| GitHubTokenService | ✅ | ✅ | ❌ | Critical |
| BlueprintCacheService | ✅ | ✅ | ❌ | High |
| BYOPController | ❌ | ✅ | ✅ | Critical |
| CodebaseAnalyzer (DO) | ⚠️ | ✅ | ✅ | Critical |
| SandboxSdkClient | ⚠️ | ✅ | ❌ | High |
| WebSocket Protocol | ❌ | ✅ | ✅ | Critical |
| CodeAnalysisService | ✅ | ⚠️ | ❌ | Medium |
| BlueprintGenerationService | ⚠️ | ✅ | ❌ | High |

Legend:
- ✅ Full coverage needed
- ⚠️ Partial coverage (mock-heavy)
- ❌ Not required

## Test Scenarios by Category

### 1. Unit Test Scenarios

#### GitHubTokenService
- ✅ Encrypt token with valid GitHub PAT format
- ✅ Decrypt previously encrypted token
- ✅ Reject invalid token formats (wrong prefix, length)
- ✅ Handle encryption key missing
- ✅ Property-based: Encrypt/decrypt roundtrip for all valid tokens
- ✅ Binary-safe Base64 encoding/decoding
- ✅ PBKDF2 key derivation (600k iterations)
- ❌ Database corruption recovery
- ❌ Token expiration handling

#### BlueprintCacheService
- ✅ Cache miss returns null
- ✅ Cache hit returns valid blueprint
- ✅ Expired cache auto-deleted
- ✅ Access count incremented on hit
- ✅ Generate deterministic cache IDs
- ✅ Handle malformed blueprint JSON
- ❌ Concurrent cache writes (race condition)
- ❌ Cache eviction under memory pressure

#### Token Validation
- ✅ Validate gho_ OAuth tokens (36 chars)
- ✅ Validate ghp_ PAT tokens (36 chars)
- ✅ Validate github_pat_ fine-grained (22+59 chars)
- ✅ Reject tokens with invalid characters
- ✅ Reject tokens exceeding 255 chars
- ✅ Property-based: All valid formats pass

### 2. Integration Test Scenarios

#### BYOPController Endpoints

**GET /api/byop/repositories**
- ✅ Authenticated user lists repositories
- ❌ Unauthenticated request returns 401
- ❌ User with no GitHub token returns 403
- ❌ Expired/invalid GitHub token returns 401
- ✅ Token missing repo scope returns 403
- ✅ GitHub API rate limit handling
- ⚠️ Mock Octokit responses

**POST /api/byop/import**
- ✅ Valid repository URL starts analysis
- ✅ Cache hit returns immediate result
- ❌ Invalid repository URL returns 400
- ❌ Private repo without access returns 403
- ❌ Repository not found returns 404
- ❌ GitHub token validation fails
- ✅ Sandbox initialization failure handling
- ✅ Git clone failure handling
- ⚠️ Analysis timeout (30+ seconds)

**GET /api/byop/analysis/:id/status**
- ✅ Returns pending status during analysis
- ✅ Returns completed status with progress 100%
- ✅ Returns failed status with error details
- ❌ Invalid analysisId returns 404
- ❌ Unauthorized access to other user's analysis

**GET /api/byop/analysis/:id/blueprint**
- ✅ Returns blueprint on completion
- ❌ Returns 202 while analyzing
- ❌ Returns 500 on analysis failure
- ✅ Caches blueprint to D1 on first fetch
- ❌ Missing blueprint returns 404

#### CodebaseAnalyzer Durable Object
- ✅ Start analysis transitions to 'analyzing' state
- ✅ Progress updates from 0 to 100
- ✅ WebSocket broadcasts progress events
- ✅ State persists across fetch() calls
- ✅ Multiple concurrent analyses (isolated state)
- ❌ Analysis timeout after 5 minutes
- ❌ Gemini API failure handling (retry logic)
- ✅ ts-morph parsing errors gracefully handled

#### WebSocket Protocol
- ✅ Client connects to /api/byop/ws/:analysisId
- ✅ Server broadcasts progress updates
- ✅ Client receives phase transitions
- ✅ Connection closes on completion
- ❌ Reconnection with state sync
- ❌ Multiple clients for same analysis
- ✅ Client disconnects don't stop analysis
- ❌ Invalid analysisId connection rejected

#### Database Operations (D1)
- ✅ Store encrypted GitHub token
- ✅ Retrieve and decrypt token
- ✅ Update lastUsed timestamp
- ✅ Revoke token (soft delete)
- ✅ Cache blueprint with TTL
- ✅ Cleanup expired cache entries
- ✅ Transaction rollback on error
- ⚠️ Concurrent updates (optimistic locking)

### 3. E2E Test Scenarios

#### Happy Path: Full Import Flow
```
1. User authenticates → GitHub token stored
2. User lists repositories → 100 repos returned
3. User selects repo → Import initiated
4. Analysis starts → WebSocket connects
5. Progress updates → 0% → 25% → 50% → 75% → 100%
6. Blueprint generated → Cached in D1
7. User fetches blueprint → Success
```

#### Cache Hit Scenario
```
1. User imports repo (first time)
2. Blueprint generated and cached
3. User imports SAME repo again
4. Cache hit → Instant return (no analysis)
5. Verify cache metadata updated (access count)
```

#### Error Recovery Scenarios
```
Scenario A: GitHub Token Expired
1. User starts import
2. Token validation fails (HTTP 401)
3. User receives error message
4. User re-authenticates
5. Import succeeds

Scenario B: Analysis Timeout
1. User imports large repo (1000+ files)
2. Analysis exceeds 5-minute timeout
3. Analysis marked as 'failed'
4. Error message shown to user
5. User retries with smaller file limit

Scenario C: Network Failure During Clone
1. Git clone operation starts
2. Network interruption
3. Clone fails with error
4. User receives actionable error message
5. Retry succeeds
```

#### Repository Edge Cases
- ✅ Import empty repository (no files)
- ✅ Import monorepo with multiple package.json
- ✅ Import repository without package.json
- ✅ Import repository with symbolic links
- ✅ Import repository with binary files
- ❌ Import repository with submodules
- ❌ Import repository with 10,000+ files
- ✅ Import private repository with valid token

## Test Data Fixtures

### Mock GitHub Repositories

#### Fixture 1: Simple React App
```json
{
  "id": 123456,
  "name": "simple-react-app",
  "full_name": "testuser/simple-react-app",
  "private": false,
  "html_url": "https://github.com/testuser/simple-react-app",
  "clone_url": "https://github.com/testuser/simple-react-app.git",
  "default_branch": "main",
  "language": "TypeScript",
  "files": [
    "package.json",
    "src/App.tsx",
    "src/index.tsx",
    "tsconfig.json"
  ],
  "package.json": {
    "name": "simple-react-app",
    "dependencies": {
      "react": "^18.0.0",
      "react-dom": "^18.0.0"
    }
  }
}
```

#### Fixture 2: Complex Next.js Project
```json
{
  "id": 789012,
  "name": "nextjs-ecommerce",
  "full_name": "testuser/nextjs-ecommerce",
  "private": true,
  "html_url": "https://github.com/testuser/nextjs-ecommerce",
  "clone_url": "https://github.com/testuser/nextjs-ecommerce.git",
  "default_branch": "develop",
  "language": "TypeScript",
  "files": [
    "package.json",
    "next.config.js",
    "app/page.tsx",
    "app/layout.tsx",
    "components/Cart.tsx",
    "lib/db.ts"
  ],
  "package.json": {
    "name": "nextjs-ecommerce",
    "dependencies": {
      "next": "^14.0.0",
      "react": "^18.0.0",
      "drizzle-orm": "^0.30.0"
    }
  }
}
```

#### Fixture 3: Edge Cases Repository
```json
{
  "id": 345678,
  "name": "edge-cases-repo",
  "full_name": "testuser/edge-cases-repo",
  "private": false,
  "html_url": "https://github.com/testuser/edge-cases-repo",
  "clone_url": "https://github.com/testuser/edge-cases-repo.git",
  "default_branch": "main",
  "language": null,
  "files": [],
  "package.json": null
}
```

### Mock GitHub Tokens

```typescript
export const MOCK_TOKENS = {
  VALID_OAUTH: 'gho_' + 'a'.repeat(36),
  VALID_PAT: 'ghp_' + 'b'.repeat(36),
  VALID_FINE_GRAINED: 'github_pat_' + 'c'.repeat(22) + '_' + 'd'.repeat(59),
  INVALID_SHORT: 'gho_short',
  INVALID_PREFIX: 'xyz_' + 'e'.repeat(36),
  EXPIRED: 'gho_' + 'f'.repeat(36), // Special: Returns 401 from GitHub API
};
```

### Mock Blueprint Outputs

```typescript
export const MOCK_BLUEPRINT: GeneratedBlueprint = {
  projectName: "simple-react-app",
  framework: "react",
  buildTool: "vite",
  currentState: {
    completenessPercentage: 85,
    implementedFeatures: ["routing", "state-management"],
    missingFeatures: ["authentication", "testing"]
  },
  suggestedTasks: [
    {
      id: "task-1",
      title: "Add authentication",
      priority: "high",
      estimatedEffort: "2-4 hours"
    }
  ],
  dependencies: {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  fileStructure: [
    { path: "src/App.tsx", purpose: "Main application component" },
    { path: "src/index.tsx", purpose: "Entry point" }
  ]
};
```

### Mock Analysis States

```typescript
export const MOCK_ANALYSIS_STATES = {
  PENDING: {
    status: 'pending',
    progress: 0,
    repositoryUrl: 'https://github.com/testuser/simple-react-app',
    repositoryName: 'simple-react-app'
  },
  ANALYZING_25: {
    status: 'analyzing',
    progress: 25,
    currentPhase: 'Reading file structure',
    fileCount: 42
  },
  ANALYZING_75: {
    status: 'analyzing',
    progress: 75,
    currentPhase: 'Generating blueprint with AI',
    fileCount: 42
  },
  COMPLETED: {
    status: 'completed',
    progress: 100,
    completedAt: new Date().toISOString(),
    analysisResult: {
      framework: 'react',
      sourceFiles: [],
      blueprint: MOCK_BLUEPRINT
    }
  },
  FAILED: {
    status: 'failed',
    progress: 50,
    error: 'Gemini API rate limit exceeded',
    failedAt: new Date().toISOString()
  }
};
```

## Testing Tools & Frameworks (2025)

### Core Testing Stack

```json
{
  "framework": "Vitest 3.2.4+",
  "runtime": "@cloudflare/vitest-pool-workers 0.8.71+",
  "mocking": "cloudflare:test module",
  "assertions": "Vitest built-in (Chai-based)",
  "property-testing": "fast-check 3.x",
  "coverage": "Vitest coverage (c8/istanbul)"
}
```

### Additional Tools

- **WebSocket Testing**: `ws` package with Vitest mocks
- **Database Testing**: Miniflare D1 in-memory (via vitest-pool-workers)
- **Durable Objects**: `cloudflare:test` isolated storage
- **GitHub API Mocking**: `cloudflare:test` fetch mocking
- **Time Travel**: Vitest `vi.useFakeTimers()`
- **Snapshot Testing**: Vitest built-in snapshots

### VS Code Test Integration

```json
{
  "testing.automaticallyOpenPeekView": "failureInVisibleDocument",
  "vitest.enable": true,
  "vitest.commandLine": "npm run test:watch"
}
```

## Test File Structure

```
tests/
├── unit/
│   ├── services/
│   │   ├── GitHubTokenService.test.ts
│   │   ├── BlueprintCacheService.test.ts
│   │   └── CodeAnalysisService.test.ts
│   ├── utils/
│   │   ├── tokenValidation.test.ts
│   │   └── cacheKeyGenerator.test.ts
│   └── property-based/
│       └── encryption.property.test.ts
│
├── integration/
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
├── e2e/
│   ├── byop-happy-path.test.ts
│   ├── byop-cache-hit.test.ts
│   └── byop-error-recovery.test.ts
│
├── fixtures/
│   ├── github-repositories.ts
│   ├── github-tokens.ts
│   ├── mock-blueprints.ts
│   └── analysis-states.ts
│
└── helpers/
    ├── test-env.ts
    ├── mock-github-api.ts
    └── websocket-client.ts
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: BYOP Tests

on:
  push:
    branches: [main, develop]
    paths:
      - 'worker/api/controllers/byop/**'
      - 'worker/database/services/GitHubTokenService.ts'
      - 'worker/database/services/BlueprintCacheService.ts'
      - 'worker/agents/analyzer/**'
      - 'tests/**'
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run static analysis
        run: |
          npm run lint
          npm run typecheck

      - name: Run unit tests
        run: npm run test:unit
        env:
          SECRETS_ENCRYPTION_KEY: ${{ secrets.TEST_ENCRYPTION_KEY }}

      - name: Run integration tests
        run: npm run test:integration
        env:
          SECRETS_ENCRYPTION_KEY: ${{ secrets.TEST_ENCRYPTION_KEY }}
          GOOGLE_AI_STUDIO_API_KEY: ${{ secrets.TEST_GEMINI_KEY }}

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          SECRETS_ENCRYPTION_KEY: ${{ secrets.TEST_ENCRYPTION_KEY }}
          GOOGLE_AI_STUDIO_API_KEY: ${{ secrets.TEST_GEMINI_KEY }}
          TEST_GITHUB_TOKEN: ${{ secrets.TEST_GITHUB_TOKEN }}

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json
          flags: byop
          name: byop-coverage

      - name: Comment PR with coverage
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          lcov-file: ./coverage/lcov.info
          github-token: ${{ secrets.GITHUB_TOKEN }}

  mutation-testing:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Run mutation tests
        run: npx stryker run
        continue-on-error: true
```

### Package.json Scripts

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

## Quality Gates

### Deployment Blockers (CI Must Pass)

- ❌ Any test failure in unit or integration suites
- ❌ Code coverage below 80% for new code
- ❌ TypeScript compilation errors
- ❌ ESLint errors (warnings allowed)
- ❌ Critical security vulnerabilities (npm audit)
- ❌ Mutation score below 70% for critical paths

### Warnings (Review Required)

- ⚠️ E2E test failures (may be flaky)
- ⚠️ Coverage decrease >5% from main branch
- ⚠️ Performance regression >20% in benchmarks
- ⚠️ Missing tests for new public APIs
- ⚠️ Snapshot changes without explanation

## Coverage Metrics (2025 Standards)

### Primary Metrics

1. **Mutation Score** (Most Important)
   - Target: 70%+ for critical paths
   - Tool: Stryker Mutator
   - Measures: Quality of tests, not just quantity

2. **Behavior Coverage**
   - Target: 100% of documented user flows
   - Measures: Critical paths tested end-to-end

3. **Code Coverage** (Secondary)
   - Target: 80%+ overall, 90%+ for services
   - Tool: Vitest coverage (c8)
   - Line, Branch, Function coverage

4. **Performance Benchmarks**
   - Token encryption/decryption: <5ms
   - Cache lookup: <10ms
   - Blueprint generation: <30s (median)

### Coverage Reporting

```bash
# Generate HTML coverage report
npm run test:coverage

# View in browser
open coverage/index.html

# Check specific thresholds
vitest run --coverage --coverage.statements=80 --coverage.branches=75
```

## Performance Testing

### Benchmark Tests

```typescript
import { describe, bench } from 'vitest';
import { GitHubTokenService } from '../worker/database/services/GitHubTokenService';

describe('GitHubTokenService Performance', () => {
  bench('encrypt token', async () => {
    const service = new GitHubTokenService(env);
    await service.encryptToken(MOCK_TOKENS.VALID_OAUTH);
  }, {
    time: 1000, // Run for 1 second
    iterations: 100
  });

  bench('decrypt token', async () => {
    const service = new GitHubTokenService(env);
    await service.decryptToken(encryptedToken);
  }, {
    time: 1000,
    iterations: 100
  });
});
```

### Load Testing (Durable Objects)

```typescript
describe('CodebaseAnalyzer Concurrent Load', () => {
  test('handles 10 concurrent analyses', async () => {
    const analyses = Array.from({ length: 10 }, (_, i) =>
      startAnalysis({ repositoryUrl: `https://github.com/user/repo${i}` })
    );

    const results = await Promise.all(analyses);

    expect(results.every(r => r.success)).toBe(true);
  });
});
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- ✅ Setup Vitest with @cloudflare/vitest-pool-workers
- ✅ Create test fixtures for GitHub data
- ✅ Setup CI/CD pipeline
- ✅ Write first unit tests for GitHubTokenService

### Phase 2: Unit Tests (Week 1-2)
- ✅ GitHubTokenService full coverage
- ✅ BlueprintCacheService full coverage
- ✅ Property-based tests for encryption
- ✅ Token validation edge cases

### Phase 3: Integration Tests (Week 2-3)
- ✅ BYOPController endpoints
- ✅ Database operations (D1)
- ✅ Durable Object lifecycle
- ✅ WebSocket protocol

### Phase 4: E2E Tests (Week 3-4)
- ✅ Happy path flow
- ✅ Cache hit scenario
- ✅ Error recovery paths
- ✅ Edge case repositories

### Phase 5: Polish (Week 4)
- ✅ Performance benchmarks
- ✅ Mutation testing setup
- ✅ Coverage thresholds enforcement
- ✅ Documentation updates

## Success Criteria

### Definition of Done

A test suite is complete when:

1. ✅ All critical paths have integration tests
2. ✅ Unit test coverage ≥80% for services
3. ✅ E2E tests cover main user journey
4. ✅ Property-based tests for cryptographic functions
5. ✅ WebSocket protocol fully tested
6. ✅ CI/CD pipeline passes consistently
7. ✅ Mutation score ≥70% for critical code
8. ✅ Performance benchmarks within targets
9. ✅ Documentation includes test examples
10. ✅ Zero flaky tests in CI

### Maintenance Plan

- **Daily**: Run tests locally before commits
- **Weekly**: Review coverage reports and flaky tests
- **Monthly**: Update fixtures with real-world data
- **Quarterly**: Review and update test strategy
- **Yearly**: Evaluate new testing tools and methodologies

---

**Generated by Dreamforge Test Engineer**
**Standards: 2025 Testing Best Practices**
**Framework: Vitest + Cloudflare Workers + Testing Trophy**
**Date: 2025-11-13**
