#!/bin/bash

# BYOP API Integration Test Script

set -e

# Configuration
BASE_URL="http://localhost:5173"
SESSION_TOKEN="${SESSION_TOKEN}"
TEST_REPO="${TEST_REPO:-https://github.com/cloudflare/workers-sdk}"
TEST_BRANCH="${TEST_BRANCH:-main}"

if [ -z "$SESSION_TOKEN" ]; then
  echo "Error: SESSION_TOKEN environment variable not set"
  echo "Usage: SESSION_TOKEN='your-session-token' ./test-byop-api.sh"
  echo ""
  echo "Optional environment variables:"
  echo "  TEST_REPO   - Repository URL to import (default: cloudflare/workers-sdk)"
  echo "  TEST_BRANCH - Branch to import (default: main)"
  exit 1
fi

echo "🧪 Starting BYOP API Integration Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Base URL: ${BASE_URL}"
echo "Test Repo: ${TEST_REPO}"
echo "Branch: ${TEST_BRANCH}"

# Test 1: List Repositories
echo ""
echo "📋 Test 1: List GitHub Repositories"
REPOS_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/byop/repositories" \
  -H "Cookie: session=${SESSION_TOKEN}" \
  -H "Content-Type: application/json")

if echo "$REPOS_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  REPO_COUNT=$(echo "$REPOS_RESPONSE" | jq '.data.total')
  echo "✅ PASS: Found ${REPO_COUNT} repositories"

  # Show first 3 repos
  echo "$REPOS_RESPONSE" | jq -r '.data.repositories[:3] | .[] | "   - \(.fullName) (\(.language // "N/A"))"'
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

if echo "$IMPORT_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  ANALYSIS_ID=$(echo "$IMPORT_RESPONSE" | jq -r '.data.analysisId')
  FILES_COUNT=$(echo "$IMPORT_RESPONSE" | jq '.data.filesCount')
  REPO_NAME=$(echo "$IMPORT_RESPONSE" | jq -r '.data.repositoryName')

  echo "✅ PASS: Import started"
  echo "   Repository: ${REPO_NAME}"
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
LAST_PROGRESS=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  STATUS_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/byop/analysis/${ANALYSIS_ID}/status" \
    -H "Cookie: session=${SESSION_TOKEN}")

  STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.data.status')
  PROGRESS=$(echo "$STATUS_RESPONSE" | jq -r '.data.progress')
  PHASE=$(echo "$STATUS_RESPONSE" | jq -r '.data.currentPhase')

  # Only print if progress changed
  if [ "$PROGRESS" != "$LAST_PROGRESS" ]; then
    # Create progress bar
    FILLED=$((PROGRESS / 2))
    EMPTY=$((50 - FILLED))
    BAR=$(printf "%${FILLED}s" | tr ' ' '█')$(printf "%${EMPTY}s" | tr ' ' '░')

    echo "   [${BAR}] ${PROGRESS}% - ${PHASE}"
    LAST_PROGRESS=$PROGRESS
  fi

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

if echo "$BLUEPRINT_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  COMPLETENESS=$(echo "$BLUEPRINT_RESPONSE" | jq -r '.data.blueprint.currentState.completenessPercentage')
  RECOMMENDATIONS=$(echo "$BLUEPRINT_RESPONSE" | jq '.data.blueprint.recommendations | length')
  NEXT_STEPS=$(echo "$BLUEPRINT_RESPONSE" | jq '.data.blueprint.nextSteps | length')

  echo "✅ PASS: Blueprint retrieved"
  echo "   Completeness: ${COMPLETENESS}%"
  echo "   Recommendations: ${RECOMMENDATIONS}"
  echo "   Next Steps: ${NEXT_STEPS}"

  # Save blueprint to file
  BLUEPRINT_FILE="blueprint-${ANALYSIS_ID}.json"
  echo "$BLUEPRINT_RESPONSE" | jq '.data.blueprint' > "$BLUEPRINT_FILE"
  echo "   📄 Saved to: ${BLUEPRINT_FILE}"

  # Show top 3 recommendations
  echo ""
  echo "   Top Recommendations:"
  echo "$BLUEPRINT_RESPONSE" | jq -r '.data.blueprint.recommendations[:3] | .[] | "   • [\(.priority)] \(.title)"'
else
  echo "❌ FAIL: Failed to retrieve blueprint"
  echo "$BLUEPRINT_RESPONSE" | jq '.'
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All tests passed!"
echo ""
echo "Summary:"
echo "  • Repositories listed: ${REPO_COUNT}"
echo "  • Files analyzed: ${FILES_COUNT}"
echo "  • Completeness: ${COMPLETENESS}%"
echo "  • Recommendations: ${RECOMMENDATIONS}"
echo "  • Blueprint saved: ${BLUEPRINT_FILE}"
