# BYOP Quick Test Reference

## Prerequisites
```bash
# 1. Start Docker Desktop on Windows
# 2. Verify Docker is running
docker ps

# 3. Start dev server
npm run dev
# Should see: "Ready on http://localhost:5173"
```

## Get Session Token
1. Open http://localhost:5173 in browser
2. Sign in with GitHub
3. Open DevTools → Application → Cookies
4. Copy the `session` cookie value

## Run Automated Tests
```bash
# Export session token
export SESSION_TOKEN="your-session-token-here"

# Run all tests (uses cloudflare/workers-sdk as test repo)
./scripts/test-byop-api.sh

# Test with custom repo
TEST_REPO="https://github.com/username/my-repo" \
TEST_BRANCH="main" \
SESSION_TOKEN="your-token" \
./scripts/test-byop-api.sh
```

## Manual Testing (cURL)

### 1. List Repositories
```bash
curl -X GET "http://localhost:5173/api/byop/repositories" \
  -H "Cookie: session=${SESSION_TOKEN}" | jq
```

### 2. Import Repository
```bash
curl -X POST "http://localhost:5173/api/byop/import" \
  -H "Cookie: session=${SESSION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"repositoryUrl": "https://github.com/username/repo"}' | jq

# Save analysis ID from response
export ANALYSIS_ID="<id-from-response>"
```

### 3. Check Status
```bash
curl -X GET "http://localhost:5173/api/byop/analysis/${ANALYSIS_ID}/status" \
  -H "Cookie: session=${SESSION_TOKEN}" | jq
```

### 4. Get Blueprint (once completed)
```bash
curl -X GET "http://localhost:5173/api/byop/analysis/${ANALYSIS_ID}/blueprint" \
  -H "Cookie: session=${SESSION_TOKEN}" | jq > blueprint.json
```

## Expected Timings
- List repos: < 2s
- Clone small repo (<50 files): 5-15s
- Clone medium repo (100-500 files): 15-45s
- Analysis: 30-90s total

## Troubleshooting

### Docker not running
```
Error: The Docker CLI could not be launched
→ Start Docker Desktop on Windows
```

### No GitHub connection
```
{"error": "No GitHub account connected"}
→ Sign out and sign in again via GitHub OAuth
```

### Repository too large
```
{"error": "Total size too large (52.5MB). Maximum: 50MB"}
→ Use smaller repository or increase limits
```

## Next Steps
1. ✅ Backend API working → Build frontend UI
2. ⏳ Add WebSocket for real-time progress
3. ⏳ Add caching for blueprints
4. ⏳ Production deployment

See full testing guide: `docs/BYOP_TESTING_GUIDE.md`
