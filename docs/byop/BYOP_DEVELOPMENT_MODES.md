# BYOP Development Modes

## Overview

BYOP (Bring Your Own Project) blueprint generation uses Gemini 2.5 Pro via Cloudflare AI Gateway. Due to workerd's strict TLS validation in local development, we use a **dual-mode development approach**.

## The Problem

External HTTPS fetches (like calls to Google's Gemini API) fail in local workerd development with errors like:

```
fetch failed
TLS peer's certificate is not trusted; reason = unable to get local issuer certificate
```

This is a **known limitation** of workerd local development, not a configuration issue.

## Solution: Dual-Mode Development

### Mode 1: Fast Local Iteration (Default)

**Command**: `npm run dev`

**Purpose**: Rapid UI/UX development and feature iteration

**Behavior**:
- Runs Vite dev server with hot module replacement
- External API calls use fallback/mock data
- Blueprint generation uses `createFallbackBlueprint()`
- Docker connectivity via `DOCKER_HOST=unix:///var/run/docker.sock`
- `DEV_MODE=true` flag triggers fallback logic

**When to use**:
- Developing UI components
- Testing frontend logic
- Iterating on user experience
- Fast feedback loops

### Mode 2: Production Integration Testing

**Command**: `npm run dev:remote`

**Purpose**: Test real Gemini 2.5 Pro integration

**Behavior**:
- Uses `wrangler dev --remote`
- Temporarily deploys Worker to Cloudflare's network
- Enables genuine external HTTPS fetches
- Slower dev cycle (requires deployment)
- Tests production behavior accurately

**When to use**:
- Validating Gemini API integration
- Testing blueprint quality with real AI
- Pre-production validation
- Debugging API-specific issues

## Implementation Details

### Environment Variables

**.dev.vars**:
```bash
DEV_MODE="true"  # Triggers fallback logic in local Vite dev
CF_ACCOUNT_ID="00354a4cf3fd5ff6f93e809b915f0f58"
CF_AI_GATEWAY_ID="vibesdk-gateway"
GOOGLE_AI_STUDIO_API_KEY="[key]"
```

### Code Logic

**BlueprintGenerationService.ts**:
```typescript
if (env.DEV_MODE === 'true') {
    // Use fallback for fast local iteration
    logger.warn('DEV_MODE detected: Using fallback blueprint');
    return this.createFallbackBlueprint(context);
}

// Production mode: Call Gemini 2.5 Pro via AI Gateway
const gatewayUrl = `https://gateway.ai.cloudflare.com/...`;
const response = await fetch(gatewayUrl, { ... });
```

## Production Deployment

In production (deployed to Cloudflare Workers):
- `DEV_MODE` is not set
- External HTTPS fetches work natively
- Real Gemini 2.5 Pro API is used
- No TLS validation issues

## Testing Checklist

### Before Committing UI Changes
- ✅ Test with `npm run dev` (fallback blueprint)
- ✅ Verify UI handles blueprint data correctly
- ✅ Check error states and loading indicators

### Before Merging to Main
- ✅ Test with `npm run dev:remote` (real Gemini)
- ✅ Verify blueprint quality and accuracy
- ✅ Confirm AI Gateway connectivity
- ✅ Check production logs for errors

## References

- [Cloudflare Vite Plugin Docs](https://developers.cloudflare.com/workers/vite-plugin/)
- [Wrangler Dev Remote Mode](https://developers.cloudflare.com/workers/wrangler/commands/)
- [workerd TLS Issues](https://github.com/cloudflare/workerd/issues/4293)
- [Workers Local Development](https://blog.cloudflare.com/miniflare-and-workerd/)

---

*Last Updated: November 2025*
