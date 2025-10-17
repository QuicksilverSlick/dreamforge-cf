# Quick Setup Guide: Missing Environment Variables

**Last Updated:** 2025-10-16
**Priority:** 🚨 CRITICAL - Code generation currently fails without these

---

## The Problem

Your DreamForge deployment is missing critical API keys, causing code generation to fail when using:
- Anthropic/Claude models with bracket notation `[claude]anthropic/claude-3.5-sonnet`
- OpenAI models directly
- OpenRouter routing
- Web search functionality
- OAuth authentication

---

## Quick Fix (5 Minutes)

### Step 1: Get Your API Keys

1. **Anthropic** (Required for Claude models)
   - Sign up: https://console.anthropic.com/
   - Create API key: Settings → API Keys
   - Copy key starting with `sk-ant-...`

2. **OpenAI** (Required for GPT models)
   - Sign up: https://platform.openai.com/
   - Create API key: API Keys → Create new secret key
   - Copy key starting with `sk-...`

3. **Cloudflare API** (Required for images/screenshots)
   - Go to: https://dash.cloudflare.com/profile/api-tokens
   - Create token with "Edit Workers" permissions
   - Copy your Account ID from any Workers project

### Step 2: Update Your `.dev.vars` File

Edit `/home/bishop/projects/dreamforge/.dev.vars`:

```bash
# Add these lines (replace with actual keys):
ANTHROPIC_API_KEY="sk-ant-your-key-here"
OPENAI_API_KEY="sk-your-key-here"
CLOUDFLARE_API_TOKEN="your-cf-token-here"
CLOUDFLARE_ACCOUNT_ID="your-account-id-here"
```

### Step 3: Deploy the Secrets

```bash
cd /home/bishop/projects/dreamforge
wrangler secret bulk .dev.vars
```

### Step 4: Verify

```bash
wrangler secret list
```

You should see:
- ✅ ANTHROPIC_API_KEY
- ✅ OPENAI_API_KEY
- ✅ CLOUDFLARE_API_TOKEN
- ✅ CLOUDFLARE_ACCOUNT_ID
- ✅ CLOUDFLARE_AI_GATEWAY_TOKEN (existing)
- ✅ GOOGLE_AI_STUDIO_API_KEY (existing)

---

## Complete .dev.vars Template

Copy this entire template and replace the placeholder values:

```bash
# Security Configuration
ENVIRONMENT="prod"

# Essential Secrets (CRITICAL - Required for AI)
CLOUDFLARE_AI_GATEWAY_TOKEN="your-existing-gateway-token"

# Provider API Keys (CRITICAL - Required for code generation)
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
OPENAI_API_KEY="sk-your-openai-key"
GOOGLE_AI_STUDIO_API_KEY="your-existing-google-key"
OPENROUTER_API_KEY="sk-or-your-openrouter-key"  # Optional
GROQ_API_KEY="gsk_your-groq-key"                # Optional

# Cloudflare API (CRITICAL - Required for images/screenshots)
CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"

# Internal Services (Already configured - keep as-is)
JWT_SECRET="15MEGLwXCRLuwneOoo/ytGuIHLDe7Up4Cjl6VD+kSkQ="
WEBHOOK_SECRET="BlnC16+RUmEtLRVHFqNEBGgwOiM+FVS4lreRN/O5YbE="
SECRETS_ENCRYPTION_KEY="2ksgTlmVsrGZGV8SknnXe+7it9g6c6MtYbKcYud0IJqh9o4PFnuNbj0/J+vqqkGm"

# Optional Features (Add these later for full functionality)
# SERPAPI_KEY="your-serpapi-key"                 # For web search
# SENTRY_DSN="your-sentry-dsn"                   # For error tracking
# GOOGLE_CLIENT_ID="your-google-oauth-id"        # For Google login
# GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
# GITHUB_CLIENT_ID="your-github-oauth-id"        # For GitHub login
# GITHUB_CLIENT_SECRET="your-github-oauth-secret"
```

---

## Why This Is Critical

### Current Behavior (WITHOUT provider keys)

```typescript
// Code tries to use bracket notation:
model: "[claude]anthropic/claude-3.5-sonnet"

// This triggers direct API call:
apiKey: env.ANTHROPIC_API_KEY  // ❌ undefined!

// Request fails with 401 Unauthorized
```

### Fixed Behavior (WITH provider keys)

```typescript
// Same model request:
model: "[claude]anthropic/claude-3.5-sonnet"

// Now has valid API key:
apiKey: env.ANTHROPIC_API_KEY  // ✅ "sk-ant-..."

// Request succeeds ✅
```

---

## Testing After Setup

### Test 1: Anthropic/Claude
```bash
# In your app, try generating code with:
Model: anthropic/claude-3.5-sonnet
Prompt: "Create a simple React counter"
```

### Test 2: OpenAI/GPT
```bash
Model: openai/gpt-4
Prompt: "Create a simple Todo list"
```

### Test 3: Bracket Notation
```bash
Model: [claude]anthropic/claude-3.5-sonnet
Prompt: "Test direct API access"
```

All should now work without errors.

---

## Optional: Enable Additional Features

### Web Search (Recommended for Agent)

1. Sign up: https://serpapi.com/
2. Get API key from dashboard
3. Add to `.dev.vars`:
   ```bash
   SERPAPI_KEY="your-serpapi-key"
   ```
4. Deploy: `wrangler secret bulk .dev.vars`

### Error Tracking with Sentry

1. Create project: https://sentry.io/
2. Get DSN from project settings
3. Add to `.dev.vars`:
   ```bash
   SENTRY_DSN="https://...@sentry.io/..."
   ```
4. Deploy: `wrangler secret bulk .dev.vars`

### OAuth Authentication

#### Google OAuth
1. Go to: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect: `https://app.getdreamforge.com/auth/callback/google`
4. Add to `.dev.vars`:
   ```bash
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

#### GitHub OAuth
1. Go to: https://github.com/settings/developers
2. Create new OAuth App
3. Authorization callback: `https://app.getdreamforge.com/auth/callback/github`
4. Add to `.dev.vars`:
   ```bash
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

---

## Troubleshooting

### "wrangler secret bulk" fails

```bash
# Make sure you're in the right directory
cd /home/bishop/projects/dreamforge

# Make sure .dev.vars exists and has correct format
cat .dev.vars

# Try deploying one secret at a time
echo "sk-ant-your-key" | wrangler secret put ANTHROPIC_API_KEY
```

### Secrets not showing in list

```bash
# Check you're looking at the right worker
wrangler whoami
wrangler secret list --name vibesdk-production
```

### Still getting auth errors

```bash
# Clear any cached credentials
wrangler logout
wrangler login

# Re-deploy secrets
wrangler secret bulk .dev.vars

# Check deployment
wrangler tail --format pretty
```

---

## Cost Estimates

### Free Tiers (Sufficient for Testing)

- **Anthropic Claude:** $5 free credit, then ~$3/million tokens
- **OpenAI GPT-4:** $5 free credit, then ~$10/million tokens
- **Google AI Studio:** Free quota for Gemini models
- **OpenRouter:** No free tier, pay-as-you-go
- **SerpAPI:** 100 searches/month free
- **Sentry:** 5K errors/month free

### Recommendation for Production

Start with:
1. ✅ Anthropic (primary for Claude)
2. ✅ OpenAI (backup/GPT models)
3. ✅ Google AI Studio (already have, free quota)
4. ⏸️ OpenRouter (skip for now, can add later)
5. ⏸️ Groq (skip for now, specialized use cases)

This gives you multi-model support at minimal cost.

---

## Security Notes

### DO NOT commit .dev.vars to Git

Your `.gitignore` should have:
```
.dev.vars
.prod.vars
*.env
```

### Rotate Keys Regularly

```bash
# Every 90 days, create new keys and update:
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put OPENAI_API_KEY
```

### Monitor API Usage

- Anthropic: https://console.anthropic.com/settings/usage
- OpenAI: https://platform.openai.com/usage
- Set billing alerts to avoid surprises

---

## Summary Checklist

### Immediate (Required)
- [ ] Get Anthropic API key
- [ ] Get OpenAI API key
- [ ] Get Cloudflare API token & account ID
- [ ] Update `.dev.vars` with all three
- [ ] Deploy secrets: `wrangler secret bulk .dev.vars`
- [ ] Verify: `wrangler secret list`
- [ ] Test code generation with Claude model
- [ ] Test code generation with GPT model

### Soon (Recommended)
- [ ] Get SerpAPI key for web search
- [ ] Get Sentry DSN for error tracking
- [ ] Deploy additional secrets
- [ ] Test web search functionality
- [ ] Verify Sentry error logging

### Later (Optional)
- [ ] Set up Google OAuth
- [ ] Set up GitHub OAuth
- [ ] Set up OpenRouter (if needed)
- [ ] Set up Groq (if needed)
- [ ] Configure Cloudflare Access

---

## Need Help?

1. **Wrangler Issues:** https://developers.cloudflare.com/workers/wrangler/
2. **API Key Setup:** See full analysis in `ENVIRONMENT_VARIABLES_ANALYSIS.md`
3. **Code Issues:** Check `/worker/agents/inferutils/core.ts` for implementation

---

**Last Check:** After completing the immediate checklist, verify by attempting to generate a simple app with Claude. It should work without any authentication errors.
