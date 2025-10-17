# Environment Variables & Secrets Configuration Analysis

**Analysis Date:** 2025-10-16
**Fork:** app.getdreamforge.com (dreamforge)
**Upstream:** github.com/cloudflare/vibesdk

---

## Executive Summary

Your DreamForge fork is **MISSING CRITICAL PROVIDER API KEYS** that are used by the code but not deployed as secrets. The code has fallback logic to use `CLOUDFLARE_AI_GATEWAY_TOKEN` when provider-specific keys are missing, which is why the system partially works but may fail for certain AI providers.

### Critical Issues Found

1. **Missing Provider API Keys** - Code references these but they're not deployed:
   - `ANTHROPIC_API_KEY` ❌
   - `OPENAI_API_KEY` ❌
   - `OPENROUTER_API_KEY` ❌
   - `GROQ_API_KEY` ❌
   - `CEREBRAS_API_KEY` ❌

2. **Missing Optional Services** - Referenced in code but not configured:
   - `SERPAPI_KEY` (web search functionality)
   - `SENTRY_DSN` (error tracking)
   - `CF_ACCESS_ID` / `CF_ACCESS_SECRET` (Cloudflare Access)

3. **Missing OAuth Credentials** - Auth system won't work:
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
   - `GITHUB_EXPORTER_CLIENT_ID` / `GITHUB_EXPORTER_CLIENT_SECRET`

---

## Comparison Tables

### 1. Vars Configuration (wrangler.jsonc)

| Variable | Upstream | Your Fork | Status |
|----------|----------|-----------|--------|
| `TEMPLATES_REPOSITORY` | ✅ cloudflare/vibesdk-templates | ✅ cloudflare/vibesdk-templates | ✅ Match |
| `ALLOWED_EMAIL` | ✅ "" | ✅ "" | ✅ Match |
| `DISPATCH_NAMESPACE` | ✅ "vibesdk-default-namespace" | ⚠️ "orange-build-default-namespace" | ⚠️ Different |
| `ENABLE_READ_REPLICAS` | ✅ "true" | ✅ "true" | ✅ Match |
| `CLOUDFLARE_AI_GATEWAY` | ✅ "vibesdk-gateway" | ✅ "vibesdk-gateway" | ✅ Match |
| `CUSTOM_DOMAIN` | ✅ "" | ✅ "app.getdreamforge.com" | ⚠️ Set (expected) |
| `CUSTOM_PREVIEW_DOMAIN` | ❌ Not set | ✅ "preview.getdreamforge.com" | ✅ Good |
| `MAX_SANDBOX_INSTANCES` | ✅ "10" | ✅ "10" | ✅ Match |
| `SANDBOX_INSTANCE_TYPE` | ✅ "standard-3" | ✅ "standard-3" | ✅ Match |
| `USE_CLOUDFLARE_IMAGES` | ✅ false | ✅ false | ✅ Match |

### 2. Bindings Configuration

| Binding Type | Upstream | Your Fork | Status |
|--------------|----------|-----------|--------|
| AI | ✅ Remote | ✅ Remote | ✅ Match |
| IMAGES | ❌ Not configured | ✅ Configured | ✅ Good |
| DB (D1) | ✅ vibesdk-db | ✅ vibesdk-db | ✅ Match (different IDs) |
| TEMPLATES_BUCKET (R2) | ✅ vibesdk-templates | ✅ vibesdk-templates | ✅ Match |
| VibecoderStore (KV) | ✅ Remote | ✅ Remote | ✅ Match |
| DISPATCHER | ✅ Remote | ✅ Remote | ✅ Match |
| API_RATE_LIMITER | ✅ 10000/min | ✅ 10000/min | ✅ Match |
| AUTH_RATE_LIMITER | ✅ 1000/min | ✅ 1000/min | ✅ Match |

### 3. Secrets Status (Environment Variables)

#### CURRENTLY DEPLOYED (Your Fork)
```
✅ CLOUDFLARE_AI_GATEWAY_TOKEN
✅ GOOGLE_AI_STUDIO_API_KEY
✅ JWT_SECRET
✅ SECRETS_ENCRYPTION_KEY
✅ WEBHOOK_SECRET
```

#### MISSING BUT USED IN CODE
```
❌ ANTHROPIC_API_KEY          # Used in inferutils/core.ts:282
❌ OPENAI_API_KEY             # Used in fallback logic
❌ OPENROUTER_API_KEY         # Used in inferutils/core.ts:272
❌ GROQ_API_KEY               # Referenced in .dev.vars.example
❌ CEREBRAS_API_KEY           # Referenced in secretsTemplates.ts
❌ CLOUDFLARE_API_TOKEN       # Used in images.ts, deploy.ts, simpleGeneratorAgent.ts
❌ CLOUDFLARE_ACCOUNT_ID      # Used in images.ts, deploy.ts, simpleGeneratorAgent.ts
❌ SERPAPI_KEY                # Used in web-search.ts:101
❌ SENTRY_DSN                 # Used in sentry.ts, tunnelController.ts
❌ CF_ACCESS_ID               # Used in sentry.ts, tunnelController.ts
❌ CF_ACCESS_SECRET           # Used in sentry.ts, tunnelController.ts
❌ GOOGLE_CLIENT_ID           # Used in auth/controller.ts
❌ GOOGLE_CLIENT_SECRET       # Used in auth/controller.ts
❌ GITHUB_CLIENT_ID           # Used in auth/controller.ts
❌ GITHUB_CLIENT_SECRET       # Used in auth/controller.ts
❌ GITHUB_EXPORTER_CLIENT_ID  # Referenced in .dev.vars.example
❌ GITHUB_EXPORTER_CLIENT_SECRET # Referenced in .dev.vars.example
❌ ENVIRONMENT                # Used in utils/envs.ts
❌ CLOUDFLARE_AI_GATEWAY_URL  # Used in inferutils/core.ts (optional override)
```

#### UPSTREAM HAS BUT NOT IN YOUR DEPLOYMENT
Based on upstream's worker-configuration.d.ts, these are defined as string types (secrets):
- All the above missing keys are also expected upstream

---

## Code Impact Analysis

### 1. AI Provider Fallback Logic

**File:** `/worker/agents/inferutils/core.ts`

```typescript
async function getApiKey(provider: string, env: Env, _userId: string): Promise<string> {
    // Dynamically constructs: OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.
    const providerKeyString = provider.toUpperCase().replaceAll('-', '_');
    const envKey = `${providerKeyString}_API_KEY` as keyof Env;
    let apiKey: string = env[envKey] as string;

    // Fallback to CLOUDFLARE_AI_GATEWAY_TOKEN if provider key missing
    if (!isValidApiKey(apiKey)) {
        apiKey = env.CLOUDFLARE_AI_GATEWAY_TOKEN;
    }
    return apiKey;
}
```

**Impact:**
- ✅ **Why it works:** AI Gateway Token acts as fallback for all providers
- ⚠️ **Limitation:** May hit rate limits faster, no provider-specific optimization
- ❌ **Bracket notation bypass fails:** When using `[openrouter]` or `[claude]` syntax to bypass AI Gateway, it tries to use `env.OPENROUTER_API_KEY` or `env.ANTHROPIC_API_KEY` which are undefined

### 2. Direct Provider Access (Bracket Notation)

**File:** `/worker/agents/inferutils/core.ts:266-285`

```typescript
const match = model.match(/\[(.*?)\]/);
if (match) {
    const provider = match[1];
    if (provider === 'openrouter') {
        return {
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: env.OPENROUTER_API_KEY,  // ❌ UNDEFINED
        };
    } else if (provider === 'gemini') {
        return {
            baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
            apiKey: env.GOOGLE_AI_STUDIO_API_KEY,  // ✅ EXISTS
        };
    } else if (provider === 'claude') {
        return {
            baseURL: 'https://api.anthropic.com/v1/',
            apiKey: env.ANTHROPIC_API_KEY,  // ❌ UNDEFINED
        };
    }
}
```

**Impact:**
- ❌ **Direct OpenRouter calls fail** - returns undefined API key
- ❌ **Direct Anthropic calls fail** - returns undefined API key
- ✅ **Direct Google AI calls work** - you have GOOGLE_AI_STUDIO_API_KEY
- 🐛 **This is why code generation fails** - The system tries to use bracket notation for specific providers and gets undefined keys

### 3. Web Search Functionality

**File:** `/worker/agents/tools/toolkit/web-search.ts:101`

```typescript
const apiKey = env.SERPAPI_KEY;
```

**Impact:**
- ❌ Web search tool completely non-functional
- ❌ Agent cannot perform web searches during code generation

### 4. Error Tracking & Monitoring

**Files:**
- `/worker/observability/sentry.ts:15`
- `/worker/api/controllers/sentry/tunnelController.ts:22`

```typescript
dsn: env.SENTRY_DSN,  // ❌ UNDEFINED
```

**Impact:**
- ❌ No error tracking to Sentry
- ❌ Cannot monitor production issues
- ❌ Sentry tunnel endpoint fails

### 5. Authentication System

**File:** `/worker/api/controllers/auth/controller.ts:37-38`

```typescript
return (!!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET) ||
       (!!env.GITHUB_CLIENT_ID && !!env.GITHUB_CLIENT_SECRET);
```

**Impact:**
- ❌ OAuth authentication completely disabled
- ❌ Users cannot sign in with Google or GitHub
- ⚠️ System falls back to email/password only

### 6. Cloudflare Images & Screenshots

**File:** `/worker/utils/images.ts:25-36`

```typescript
const url = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`;
headers: { 'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}` }
```

**Impact:**
- ❌ Cannot upload images to Cloudflare Images
- ❌ Screenshot functionality may be impaired
- ⚠️ Falls back to R2 bucket storage (works)

---

## Configuration Discrepancies

### 1. DISPATCH_NAMESPACE Mismatch

**Upstream:** `vibesdk-default-namespace`
**Your Fork:** `orange-build-default-namespace`

**Impact:**
- ⚠️ **Different namespace** - Your deployed apps go to a different namespace
- ✅ **Not a bug if intentional** - Likely you want separation from upstream
- 📝 **Document this** - Make sure this matches your actual Cloudflare configuration

### 2. Instance Type Configuration

**Upstream:** Uses object notation for instance_type
```json
"instance_type": {
    "vcpu": 4,
    "memory_mib": 4096,
    "disk_mb": 6144
}
```

**Your Fork:** Uses string notation
```json
"instance_type": "standard-3"
```

**Impact:**
- ⚠️ **Different syntax** - Both are valid but upstream has more granular control
- ✅ **Functionally equivalent** - "standard-3" maps to similar resources
- 📝 **Consider upgrading** to object notation for better resource control

### 3. Max Sandbox Instances

**Upstream:** 2900
**Your Fork:** 10

**Impact:**
- ⚠️ **Drastically lower limit** - You support 10 concurrent sandboxes vs 2900
- 💰 **Cost optimization** - Intentional for cost control?
- 🎯 **Production consideration** - May need to increase for scale

---

## .dev.vars Files Comparison

### Files are IDENTICAL ✅

Both upstream and your fork have the same `.dev.vars.example`:

```bash
# Commented out (optional)
CUSTOM_DOMAIN, ENVIRONMENT, CLOUDFLARE_AI_GATEWAY_TOKEN
ANTHROPIC_API_KEY, OPENAI_API_KEY, OPENROUTER_API_KEY, GROQ_API_KEY
GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID
GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
GITHUB_EXPORTER_CLIENT_SECRET, GITHUB_EXPORTER_CLIENT_ID
CLOUDFLARE_AI_GATEWAY_URL
CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID

# Active (required)
GOOGLE_AI_STUDIO_API_KEY=""
JWT_SECRET=""
WEBHOOK_SECRET=""
```

**Your actual `.dev.vars` has:**
```bash
ENVIRONMENT="prod"
CLOUDFLARE_AI_GATEWAY_TOKEN=""        # ⚠️ Empty
GOOGLE_AI_STUDIO_API_KEY=""           # ⚠️ Empty
JWT_SECRET="[REDACTED]"                # ✅ Set
WEBHOOK_SECRET="[REDACTED]"            # ✅ Set
SECRETS_ENCRYPTION_KEY="[REDACTED]"    # ✅ Set
```

---

## Deployment Script Analysis

**File:** `/scripts/deploy.ts:1700-1715`

The deployment script only uploads these secrets:
```typescript
const secretVars = [
    'CLOUDFLARE_AI_GATEWAY',
    'CLOUDFLARE_AI_GATEWAY_URL',
    'CLOUDFLARE_AI_GATEWAY_TOKEN',
    'ANTHROPIC_API_KEY',          // ❌ Not in .dev.vars
    'OPENAI_API_KEY',             // ❌ Not in .dev.vars
    'GOOGLE_AI_STUDIO_API_KEY',   // ⚠️ Empty in .dev.vars
    'OPENROUTER_API_KEY',         // ❌ Not in .dev.vars
    'GROQ_API_KEY',               // ❌ Not in .dev.vars
    'GOOGLE_CLIENT_SECRET',       // ❌ Not in .dev.vars
    'GOOGLE_CLIENT_ID',           // ❌ Not in .dev.vars
    'GITHUB_CLIENT_ID',           // ❌ Not in .dev.vars
    'GITHUB_CLIENT_SECRET',       // ❌ Not in .dev.vars
    'JWT_SECRET',                 // ✅ Set
    'WEBHOOK_SECRET',             // ✅ Set
    'MAX_SANDBOX_INSTANCES',
];
```

**Problem:** The script tries to deploy these secrets but they're not in your `.dev.vars`, so they deploy as empty/commented.

---

## Root Cause: Why Code Generation Fails

### The Failure Chain

1. **User requests code generation** with a model like `gpt-4` or uses bracket notation `[claude]anthropic/claude-3.5-sonnet`

2. **Code detects bracket notation** and tries direct provider access:
   ```typescript
   apiKey: env.ANTHROPIC_API_KEY  // ❌ undefined
   ```

3. **API call fails** with authentication error because apiKey is undefined

4. **AI Gateway fallback doesn't work** for bracket notation bypass attempts

5. **Code generation halts** due to inability to communicate with AI providers

### Why GOOGLE_AI_STUDIO_API_KEY Works

- ✅ You have this secret deployed
- ✅ Bracket notation `[gemini]` works correctly
- ✅ AI Gateway routing for Google also works

### Why Other Providers Fail

- ❌ No provider-specific API keys deployed
- ❌ Bracket notation bypass returns undefined
- ⚠️ AI Gateway fallback works ONLY when not using bracket notation
- ❌ Many agent workflows default to using bracket notation for reliability

---

## Recommended Actions

### IMMEDIATE (Critical for Code Generation)

1. **Add Provider API Keys to `.dev.vars`:**
   ```bash
   ANTHROPIC_API_KEY="sk-ant-..."
   OPENAI_API_KEY="sk-..."
   OPENROUTER_API_KEY="sk-or-..."
   CLOUDFLARE_API_TOKEN="your-token"
   CLOUDFLARE_ACCOUNT_ID="your-account-id"
   ```

2. **Deploy secrets:**
   ```bash
   wrangler secret bulk .dev.vars
   ```

3. **Verify deployment:**
   ```bash
   wrangler secret list
   ```

### HIGH PRIORITY (For Full Functionality)

4. **Enable Web Search:**
   ```bash
   # Add to .dev.vars
   SERPAPI_KEY="your-serpapi-key"
   ```

5. **Enable Error Tracking:**
   ```bash
   # Add to .dev.vars
   SENTRY_DSN="your-sentry-dsn"
   CF_ACCESS_ID="your-cf-access-id"
   CF_ACCESS_SECRET="your-cf-access-secret"
   ```

6. **Enable OAuth Authentication:**
   ```bash
   # Add to .dev.vars
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

### MEDIUM PRIORITY (Optimization)

7. **Set ENVIRONMENT variable:**
   ```bash
   # Add to .dev.vars (or wrangler.jsonc vars)
   ENVIRONMENT="prod"
   ```

8. **Configure AI Gateway URL override (optional):**
   ```bash
   # Only if you want to use a custom gateway
   CLOUDFLARE_AI_GATEWAY_URL="https://gateway.ai.cloudflare.com/v1/..."
   ```

9. **Review DISPATCH_NAMESPACE:**
   - Ensure `orange-build-default-namespace` exists in your Cloudflare account
   - Or change back to `vibesdk-default-namespace` if that's what you use

### LOW PRIORITY (Future Enhancements)

10. **GitHub Exporter OAuth:**
    ```bash
    GITHUB_EXPORTER_CLIENT_ID="your-exporter-client-id"
    GITHUB_EXPORTER_CLIENT_SECRET="your-exporter-client-secret"
    ```

11. **Cloudflare Images (if needed):**
    - Already have binding configured ✅
    - Just need API token/account ID (from step 1)

12. **Consider instance type upgrade:**
    - Current: `"standard-3"` (10 instances max)
    - Upstream: Object notation with 2900 instances max
    - Evaluate based on usage patterns

---

## Updated .dev.vars Template

Here's what your `.dev.vars` should look like:

```bash
# Security Configuration
ENVIRONMENT="prod"
CUSTOM_DOMAIN="app.getdreamforge.com"

# Essential Secrets (REQUIRED)
CLOUDFLARE_AI_GATEWAY_TOKEN="your-gateway-token"

# Provider API Keys (REQUIRED for code generation)
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."
GOOGLE_AI_STUDIO_API_KEY="your-google-api-key"
OPENROUTER_API_KEY="sk-or-..."
GROQ_API_KEY="gsk_..."

# Cloudflare API (REQUIRED for images, screenshots)
CLOUDFLARE_API_TOKEN="your-cf-api-token"
CLOUDFLARE_ACCOUNT_ID="your-account-id"

# Internal Services (REQUIRED)
JWT_SECRET="[your-existing-secret]"
WEBHOOK_SECRET="[your-existing-secret]"
SECRETS_ENCRYPTION_KEY="[your-existing-secret]"

# Web Search (OPTIONAL but recommended)
SERPAPI_KEY="your-serpapi-key"

# Error Tracking (OPTIONAL but recommended)
SENTRY_DSN="your-sentry-dsn"
CF_ACCESS_ID="your-cf-access-id"
CF_ACCESS_SECRET="your-cf-access-secret"

# OAuth (OPTIONAL - for user authentication)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# GitHub Exporter (OPTIONAL)
GITHUB_EXPORTER_CLIENT_ID="your-exporter-id"
GITHUB_EXPORTER_CLIENT_SECRET="your-exporter-secret"
```

---

## Testing Checklist

After adding the missing secrets:

### Code Generation Tests
- [ ] Test with `anthropic/claude-3.5-sonnet` (should work with ANTHROPIC_API_KEY)
- [ ] Test with `[claude]anthropic/claude-3.5-sonnet` (bracket notation)
- [ ] Test with `openai/gpt-4` (should work with OPENAI_API_KEY)
- [ ] Test with `[openrouter]...` (bracket notation)
- [ ] Test with Google AI models (already works)

### Feature Tests
- [ ] Web search functionality works
- [ ] Screenshots upload successfully
- [ ] Sentry errors are tracked
- [ ] OAuth login works (Google)
- [ ] OAuth login works (GitHub)

### Monitoring
- [ ] Check Sentry for errors
- [ ] Check AI Gateway analytics
- [ ] Monitor rate limits per provider
- [ ] Check sandbox instance usage

---

## Upstream Differences Summary

| Category | Difference | Impact | Action |
|----------|-----------|--------|--------|
| **Secrets** | Upstream expects all provider keys | HIGH | Add missing API keys |
| **DISPATCH_NAMESPACE** | Different namespace name | MEDIUM | Verify intentional |
| **Instance Type** | Different notation | LOW | Consider upgrade |
| **Max Instances** | 10 vs 2900 | MEDIUM | Monitor usage |
| **CUSTOM_DOMAIN** | You have custom domains set | ✅ GOOD | None |
| **IMAGES binding** | You have it configured | ✅ GOOD | Add API token |

---

## Files Referenced in Analysis

### Configuration Files
- `/home/bishop/projects/dreamforge/.dev.vars`
- `/home/bishop/projects/dreamforge/.dev.vars.example`
- `/home/bishop/projects/dreamforge/wrangler.jsonc`
- `/home/bishop/projects/dreamforge/worker-configuration.d.ts`

### Code Files with Environment Variable Usage
- `/home/bishop/projects/dreamforge/worker/agents/inferutils/core.ts`
- `/home/bishop/projects/dreamforge/worker/agents/tools/toolkit/web-search.ts`
- `/home/bishop/projects/dreamforge/worker/api/controllers/auth/controller.ts`
- `/home/bishop/projects/dreamforge/worker/utils/images.ts`
- `/home/bishop/projects/dreamforge/worker/observability/sentry.ts`
- `/home/bishop/projects/dreamforge/worker/api/controllers/sentry/tunnelController.ts`
- `/home/bishop/projects/dreamforge/worker/database/services/SecretsService.ts`
- `/home/bishop/projects/dreamforge/scripts/deploy.ts`

### Upstream Reference
- `https://github.com/cloudflare/vibesdk` (main branch)
- `/tmp/vibesdk/.dev.vars.example`
- `/tmp/vibesdk/wrangler.jsonc`
- `/tmp/vibesdk/worker-configuration.d.ts`

---

## Next Steps

1. **Review this analysis** and prioritize which secrets to add first
2. **Obtain API keys** from respective providers (Anthropic, OpenAI, etc.)
3. **Update `.dev.vars`** with the new keys
4. **Deploy secrets** using `wrangler secret bulk .dev.vars`
5. **Test code generation** with different providers
6. **Monitor logs** for any remaining authentication issues

---

**Analysis Complete** ✅
**Critical Issues Identified** ❌
**Action Required** 🚨
