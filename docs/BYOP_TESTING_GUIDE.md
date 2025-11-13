# BYOP Backend API Testing Guide

## Prerequisites

### 1. Docker Running
```bash
# Verify Docker is running
docker ps

# If not running, start Docker Desktop on Windows
# Then verify again in WSL
```

### 2. Development Server
```bash
# Start the development server
npm run dev

# Server should start on http://localhost:5173
# Worker API will be proxied through Vite
```

### 3. GitHub OAuth Setup
You need to authenticate with GitHub to test BYOP features:

1. Navigate to `http://localhost:5173`
2. Click "Sign in with GitHub"
3. Authorize the app with `repo` scope
4. You'll be redirected back with a session cookie

## Test Plan

### Phase 1: Authentication & Token Storage

**Objective**: Verify GitHub OAuth stores access token with `repo` scope

**Steps**:
1. Sign in with GitHub
2. Check browser DevTools > Application > Cookies for `session` cookie
3. Verify in logs that token was stored

**Expected Result**:
```
[GitHubTokenService] GitHub token stored successfully
  userId: <user-id>
  scopes: read:user,user:email,repo
```

**Database Verification**:
```bash
# Check token was encrypted and stored
npm run db:studio

# Navigate to github_tokens table
# Verify:
# - encryptedAccessToken is present (encrypted)
# - scopes = ["read:user", "user:email", "repo"]
# - isActive = true
```

---

### Phase 2: List GitHub Repositories

**Endpoint**: `GET /api/byop/repositories`

**Authentication**: Required (session cookie)

**Test with cURL**:
```bash
# Get your session token from browser cookies
SESSION_TOKEN="<your-session-token>"

curl -X GET "http://localhost:5173/api/byop/repositories" \
  -H "Cookie: session=${SESSION_TOKEN}" \
  -H "Content-Type: application/json"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "repositories": [
      {
        "id": 123456789,
        "name": "my-repo",
        "fullName": "username/my-repo",
        "url": "https://github.com/username/my-repo",
        "cloneUrl": "https://github.com/username/my-repo.git",
        "description": "My awesome project",
        "language": "TypeScript",
        "stargazersCount": 42,
        "forksCount": 5,
        "isPrivate": false,
        "defaultBranch": "main",
        "updatedAt": "2025-11-13T10:00:00Z",
        "createdAt": "2024-01-15T08:30:00Z"
      }
    ],
    "total": 1
  }
}
```

**Error Cases to Test**:

1. **No authentication**:
```bash
curl -X GET "http://localhost:5173/api/byop/repositories"
# Expected: 401 Unauthorized
```

2. **No GitHub token stored**:
   - Delete token from database
   - Make request
   - Expected: 403 "No GitHub account connected"

3. **Invalid GitHub token** (expired/revoked):
   - Revoke token on GitHub: https://github.com/settings/tokens
   - Make request
   - Expected: Error from GitHub API

**Logs to Check**:
```
[BYOPController] Fetching GitHub repositories for user: <user-id>
[GitHubTokenService] Retrieved active token for user
[Octokit] Fetching repositories from GitHub API
```

---

### Phase 3: Initiate Repository Import

**Endpoint**: `POST /api/byop/import`

**Authentication**: Required

**Request Body**:
```json
{
  "repositoryUrl": "https://github.com/username/my-small-repo",
  "branch": "main"  // optional, defaults to default branch
}
```

**Test with cURL**:
```bash
SESSION_TOKEN="<your-session-token>"

curl -X POST "http://localhost:5173/api/byop/import" \
  -H "Cookie: session=${SESSION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "repositoryUrl": "https://github.com/username/my-small-repo",
    "branch": "main"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "success": true,
    "analysisId": "byop-user-123-1699876543210-analyzerId",
    "repositoryName": "my-small-repo",
    "filesCount": 42,
    "message": "Repository import started. Analysis in progress."
  }
}
```

**What Happens Internally**:
1. ✅ Validates repository URL (must be GitHub)
2. ✅ Gets user's GitHub access token
3. ✅ Creates sandbox instance: `byop-<userId>-<timestamp>`
4. ✅ Clones repository using GIT_ASKPASS (secure, no token in URL)
5. ✅ Lists files matching patterns (*.ts, *.js, *.json, etc.)
6. ✅ Reads up to 500 files in batches of 10
7. ✅ Creates CodebaseAnalyzer Durable Object
8. ✅ Starts asynchronous analysis (5 minute timeout)
9. ✅ Returns analysisId for status tracking

**Logs to Monitor**:
```
[BYOPController] Starting repository import
  userId: <user-id>
  repositoryUrl: https://github.com/username/my-repo
  branch: main

[SandboxSdkClient] Cloning GitHub repository
  repositoryUrl: https://github.com/username/my-repo
  targetPath: /app/imported-repo

[SandboxSdkClient] Repository cloned successfully
  filesCount: 42

[BYOPController] Found files to analyze
  count: 42

[BYOPController] Read repository files
  repositoryPath: /app/imported-repo
  filesRead: 38

[CodebaseAnalyzer] Analysis initialized
  analysisId: <id>
  repository: my-repo
  fileCount: 38
  totalSize: 524288

[CodebaseAnalyzer] Analysis started
  status: analyzing
  progress: 10
```

**Error Cases to Test**:

1. **Invalid repository URL**:
```bash
curl -X POST "http://localhost:5173/api/byop/import" \
  -H "Cookie: session=${SESSION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"repositoryUrl": "https://invalid-url.com/repo"}'
# Expected: 400 "Invalid repository URL"
```

2. **Private repo without access**:
```bash
curl -X POST "http://localhost:5173/api/byop/import" \
  -H "Cookie: session=${SESSION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"repositoryUrl": "https://github.com/some-org/private-repo"}'
# Expected: 500 "Failed to clone repository: Permission denied"
```

3. **Repository too large** (exceeds 50MB or 500 files):
   - Expected: 500 "Input validation failed: Total size too large"

4. **Non-existent repository**:
```bash
curl -X POST "http://localhost:5173/api/byop/import" \
  -H "Cookie: session=${SESSION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"repositoryUrl": "https://github.com/username/repo-that-does-not-exist"}'
# Expected: 500 "Failed to clone repository: Repository not found"
```

---

### Phase 4: Check Analysis Status

**Endpoint**: `GET /api/byop/analysis/:analysisId/status`

**Authentication**: Required

**Test with cURL**:
```bash
SESSION_TOKEN="<your-session-token>"
ANALYSIS_ID="<id-from-import-response>"

curl -X GET "http://localhost:5173/api/byop/analysis/${ANALYSIS_ID}/status" \
  -H "Cookie: session=${SESSION_TOKEN}"
```

**Expected Response - In Progress** (200 OK):
```json
{
  "success": true,
  "data": {
    "repositoryUrl": "https://github.com/username/my-repo",
    "repositoryName": "my-repo",
    "clonePath": "/app/imported-repo",
    "status": "analyzing",
    "progress": 65,
    "currentPhase": "Building codebase context",
    "fileCount": 38,
    "startedAt": "2025-11-13T10:30:00.000Z"
  }
}
```

**Expected Response - Completed** (200 OK):
```json
{
  "success": true,
  "data": {
    "repositoryUrl": "https://github.com/username/my-repo",
    "repositoryName": "my-repo",
    "status": "completed",
    "progress": 100,
    "currentPhase": "Analysis complete",
    "fileCount": 38,
    "startedAt": "2025-11-13T10:30:00.000Z",
    "completedAt": "2025-11-13T10:35:00.000Z",
    "analysisResult": {
      "framework": "react",
      "packageManager": "npm",
      "dependencies": { "react": "^18.2.0", "vite": "^5.0.0" },
      "devDependencies": { "typescript": "^5.0.0" },
      "entryPoints": ["src/index.tsx"],
      "configFiles": ["package.json", "tsconfig.json", "vite.config.ts"],
      "sourceFiles": [...],
      "completionSuggestions": [
        "Add error boundary component",
        "Implement user authentication"
      ],
      "estimatedCompleteness": 75,
      "blueprint": { ... }
    }
  }
}
```

**Expected Response - Failed** (200 OK):
```json
{
  "success": true,
  "data": {
    "repositoryUrl": "https://github.com/username/my-repo",
    "status": "failed",
    "progress": 50,
    "error": "Analysis timeout after 5 minutes",
    "completedAt": "2025-11-13T10:35:00.000Z"
  }
}
```

**Polling Strategy**:
```javascript
// Frontend implementation example
async function pollAnalysisStatus(analysisId) {
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes at 5 second intervals

  while (attempts < maxAttempts) {
    const response = await fetch(`/api/byop/analysis/${analysisId}/status`);
    const { data } = await response.json();

    if (data.status === 'completed' || data.status === 'failed') {
      return data;
    }

    // Update UI with progress
    updateProgressBar(data.progress);
    updatePhaseText(data.currentPhase);

    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }

  throw new Error('Polling timeout');
}
```

---

### Phase 5: Get Completed Blueprint

**Endpoint**: `GET /api/byop/analysis/:analysisId/blueprint`

**Authentication**: Required

**Test with cURL**:
```bash
SESSION_TOKEN="<your-session-token>"
ANALYSIS_ID="<id-from-import-response>"

curl -X GET "http://localhost:5173/api/byop/analysis/${ANALYSIS_ID}/blueprint" \
  -H "Cookie: session=${SESSION_TOKEN}"
```

**Expected Response - Success** (200 OK):
```json
{
  "success": true,
  "data": {
    "blueprint": {
      "projectName": "my-repo",
      "description": "React application with TypeScript and Vite",
      "currentState": {
        "framework": "react",
        "totalFiles": 38,
        "totalLinesOfCode": 1250,
        "completenessPercentage": 75,
        "implementedFeatures": [
          "User interface components",
          "Basic routing"
        ],
        "missingComponents": [
          "Error handling",
          "User authentication",
          "API integration"
        ]
      },
      "recommendations": [
        {
          "priority": "high",
          "category": "functionality",
          "title": "Add Error Boundary",
          "description": "Implement React error boundaries to handle runtime errors gracefully",
          "estimatedEffort": "2 hours"
        },
        {
          "priority": "high",
          "category": "security",
          "title": "Implement Authentication",
          "description": "Add user authentication using OAuth or JWT",
          "estimatedEffort": "8 hours"
        }
      ],
      "nextSteps": [
        "Implement error boundary wrapper component",
        "Add authentication service and protected routes",
        "Create API service layer with error handling"
      ],
      "technicalDebt": [
        "TODO comments found in 5 files",
        "FIXME comments found in 2 files",
        "Missing unit tests for 12 components"
      ],
      "completionPhases": [
        {
          "phase": 1,
          "title": "Error Handling & Resilience",
          "tasks": ["Add error boundaries", "Implement toast notifications"],
          "estimatedTime": "4 hours"
        },
        {
          "phase": 2,
          "title": "Authentication & Security",
          "tasks": ["OAuth integration", "Protected routes", "Session management"],
          "estimatedTime": "12 hours"
        }
      ]
    }
  }
}
```

**Error Cases**:

1. **Analysis not completed**:
```bash
# Call before analysis finishes
# Expected: 202 "Analysis not yet completed"
```

2. **Analysis failed**:
```bash
# Call after analysis failed
# Expected: 500 "Analysis failed: <error message>"
```

3. **Invalid analysis ID**:
```bash
curl -X GET "http://localhost:5173/api/byop/analysis/invalid-id/blueprint" \
  -H "Cookie: session=${SESSION_TOKEN}"
# Expected: 500 "Internal server error" or 404
```

---

## Integration Test Script

Create this script to automate testing:

**File**: `scripts/test-byop-api.sh`

```bash
#!/bin/bash

# BYOP API Integration Test Script

set -e

# Configuration
BASE_URL="http://localhost:5173"
SESSION_TOKEN="${SESSION_TOKEN}"
TEST_REPO="https://github.com/cloudflare/workers-sdk"
TEST_BRANCH="main"

if [ -z "$SESSION_TOKEN" ]; then
  echo "Error: SESSION_TOKEN environment variable not set"
  echo "Usage: SESSION_TOKEN='your-session-token' ./test-byop-api.sh"
  exit 1
fi

echo "🧪 Starting BYOP API Integration Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: List Repositories
echo ""
echo "📋 Test 1: List GitHub Repositories"
REPOS_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/byop/repositories" \
  -H "Cookie: session=${SESSION_TOKEN}" \
  -H "Content-Type: application/json")

if echo "$REPOS_RESPONSE" | jq -e '.success == true' > /dev/null; then
  REPO_COUNT=$(echo "$REPOS_RESPONSE" | jq '.data.total')
  echo "✅ PASS: Found ${REPO_COUNT} repositories"
else
  echo "❌ FAIL: Failed to list repositories"
  echo "$REPOS_RESPONSE" | jq '.'
  exit 1
fi

# Test 2: Import Repository
echo ""
echo "📦 Test 2: Import Repository"
IMPORT_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/byop/import" \
  -H "Cookie: session=${SESSION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"repositoryUrl\": \"${TEST_REPO}\", \"branch\": \"${TEST_BRANCH}\"}")

if echo "$IMPORT_RESPONSE" | jq -e '.success == true' > /dev/null; then
  ANALYSIS_ID=$(echo "$IMPORT_RESPONSE" | jq -r '.data.analysisId')
  FILES_COUNT=$(echo "$IMPORT_RESPONSE" | jq '.data.filesCount')
  echo "✅ PASS: Import started"
  echo "   Analysis ID: ${ANALYSIS_ID}"
  echo "   Files: ${FILES_COUNT}"
else
  echo "❌ FAIL: Failed to import repository"
  echo "$IMPORT_RESPONSE" | jq '.'
  exit 1
fi

# Test 3: Poll Analysis Status
echo ""
echo "⏳ Test 3: Monitor Analysis Progress"
MAX_ATTEMPTS=60
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  STATUS_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/byop/analysis/${ANALYSIS_ID}/status" \
    -H "Cookie: session=${SESSION_TOKEN}")

  STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.data.status')
  PROGRESS=$(echo "$STATUS_RESPONSE" | jq -r '.data.progress')
  PHASE=$(echo "$STATUS_RESPONSE" | jq -r '.data.currentPhase')

  echo "   [${PROGRESS}%] ${PHASE}"

  if [ "$STATUS" = "completed" ]; then
    echo "✅ PASS: Analysis completed successfully"
    break
  elif [ "$STATUS" = "failed" ]; then
    ERROR=$(echo "$STATUS_RESPONSE" | jq -r '.data.error')
    echo "❌ FAIL: Analysis failed: ${ERROR}"
    exit 1
  fi

  sleep 5
  ATTEMPT=$((ATTEMPT + 1))
done

if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
  echo "❌ FAIL: Analysis timeout (exceeded 5 minutes)"
  exit 1
fi

# Test 4: Get Blueprint
echo ""
echo "📘 Test 4: Retrieve Blueprint"
BLUEPRINT_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/byop/analysis/${ANALYSIS_ID}/blueprint" \
  -H "Cookie: session=${SESSION_TOKEN}")

if echo "$BLUEPRINT_RESPONSE" | jq -e '.success == true' > /dev/null; then
  COMPLETENESS=$(echo "$BLUEPRINT_RESPONSE" | jq -r '.data.blueprint.currentState.completenessPercentage')
  RECOMMENDATIONS=$(echo "$BLUEPRINT_RESPONSE" | jq '.data.blueprint.recommendations | length')
  echo "✅ PASS: Blueprint retrieved"
  echo "   Completeness: ${COMPLETENESS}%"
  echo "   Recommendations: ${RECOMMENDATIONS}"

  # Save blueprint to file
  echo "$BLUEPRINT_RESPONSE" | jq '.data.blueprint' > "blueprint-${ANALYSIS_ID}.json"
  echo "   Saved to: blueprint-${ANALYSIS_ID}.json"
else
  echo "❌ FAIL: Failed to retrieve blueprint"
  echo "$BLUEPRINT_RESPONSE" | jq '.'
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All tests passed!"
```

**Make executable and run**:
```bash
chmod +x scripts/test-byop-api.sh

# Get session token from browser DevTools > Application > Cookies
SESSION_TOKEN="your-session-token-here" ./scripts/test-byop-api.sh
```

---

## Performance Benchmarks

**Expected Timings**:
- List repositories: < 2 seconds
- Clone repository (small, <50 files): 5-15 seconds
- Clone repository (medium, 100-500 files): 15-45 seconds
- Read files: 2-10 seconds
- ts-morph parsing: 5-20 seconds
- Gemini analysis: 10-30 seconds
- **Total import time**: 30-90 seconds for typical repos

**Resource Limits**:
- Max file size: 5MB per file
- Max total size: 50MB
- Max files: 1000 (limited to 500 in controller)
- Analysis timeout: 5 minutes
- Workers execution time: 30 seconds (request), unlimited (Durable Object)

---

## Troubleshooting

### "No GitHub account connected"
**Cause**: User hasn't authenticated or token was deleted

**Fix**:
1. Sign out and sign in again with GitHub
2. Ensure GitHub OAuth has `repo` scope
3. Check database for stored token

### "Failed to clone repository"
**Possible Causes**:
- Private repo without access
- Invalid repository URL
- Repository doesn't exist
- Network issues
- Docker not running

**Debug**:
```bash
# Check Docker
docker ps

# Check sandbox logs
# Look for GIT_ASKPASS and git clone commands
```

### "Analysis timeout after 5 minutes"
**Possible Causes**:
- Repository too large
- Gemini API slow/unavailable
- ts-morph parsing taking too long

**Debug**:
- Check CodebaseAnalyzer logs for progress
- Verify Gemini API key is configured
- Check file count and total size

### "Input validation failed"
**Cause**: Repository exceeds size limits

**Fix**:
- Use smaller repository
- Increase limits in `CodebaseAnalyzer.validateInput()`
- Filter out large files before reading

---

## Security Checklist

- [ ] GitHub token is encrypted (XChaCha20-Poly1305) ✅
- [ ] Token is NOT in git clone URL (uses GIT_ASKPASS) ✅
- [ ] Token is sanitized from error messages ✅
- [ ] Repository URL is validated ✅
- [ ] Input size limits enforced ✅
- [ ] Analysis timeout prevents infinite loops ✅
- [ ] Authentication required for all endpoints ✅
- [ ] CSRF protection enabled ✅
- [ ] Rate limiting applied ✅

---

## Next Steps

Once testing is complete:
1. **Build Frontend UI** - Create React components for BYOP flow
2. **Add WebSocket Support** - Real-time progress updates (Phase 7)
3. **Implement Retry Logic** - Handle transient failures
4. **Add Caching** - Cache blueprint results in KV/D1
5. **Monitoring** - Add Sentry/logging for production
6. **Documentation** - User-facing guide for BYOP feature
