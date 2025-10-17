# AI Gateway Configuration: Code Comparison

This document shows side-by-side code comparison of key differences between VibeSDK and DreamForge.

---

## 1. Core Gateway URL Resolution (IDENTICAL)

### Both Projects: buildGatewayUrl()

**Location**: 
- VibeSDK: `/worker/agents/inferutils/core.ts` lines 189-214
- DreamForge: `/worker/agents/inferutils/core.ts` lines 189-214

```typescript
export async function buildGatewayUrl(env: Env, providerOverride?: AIGatewayProviders): Promise<string> {
    // If CLOUDFLARE_AI_GATEWAY_URL is set and is a valid URL, use it directly
    if (env.CLOUDFLARE_AI_GATEWAY_URL && 
        env.CLOUDFLARE_AI_GATEWAY_URL !== 'none' && 
        env.CLOUDFLARE_AI_GATEWAY_URL.trim() !== '') {
        
        try {
            const url = new URL(env.CLOUDFLARE_AI_GATEWAY_URL);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                const cleanPathname = url.pathname.replace(/\/$/, '');
                url.pathname = providerOverride ? `${cleanPathname}/${providerOverride}` : `${cleanPathname}/compat`;
                return url.toString();
            }
        } catch (error) {
            console.warn(`Invalid CLOUDFLARE_AI_GATEWAY_URL provided: ${env.CLOUDFLARE_AI_GATEWAY_URL}. Falling back to AI bindings.`);
        }
    }
    
    // Build the url via bindings
    const gateway = env.AI.gateway(env.CLOUDFLARE_AI_GATEWAY);
    const baseUrl = providerOverride ? await gateway.getUrl(providerOverride) : `${await gateway.getUrl()}compat`;
    return baseUrl;
}
```

**Status**: ✓ IDENTICAL across both projects

---

## 2. Model Configuration Resolution (CRITICAL DIFFERENCE)

### getConfigurationForModel() - Main Entry Point

**Location**: 
- VibeSDK: `/worker/agents/inferutils/core.ts` lines 255-304
- DreamForge: `/worker/agents/inferutils/core.ts` lines 255-312

### VibeSDK Version

```typescript
export async function getConfigurationForModel(
    model: AIModels | string, 
    env: Env, 
    userId: string,
): Promise<{
    baseURL: string,
    apiKey: string,
    defaultHeaders?: Record<string, string>,
}> {
    let providerForcedOverride: AIGatewayProviders | undefined;
    
    // Check if provider forceful-override is set
    const match = model.match(/\[(.*?)\]/);
    if (match) {
        const provider = match[1];
        if (provider === 'openrouter') {
            return {
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: env.OPENROUTER_API_KEY,
            };
        } else if (provider === 'gemini') {
            return {
                baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
                apiKey: env.GOOGLE_AI_STUDIO_API_KEY,
            };
        } else if (provider === 'claude') {
            return {
                baseURL: 'https://api.anthropic.com/v1/',
                apiKey: env.ANTHROPIC_API_KEY,
            };
        }
        providerForcedOverride = provider as AIGatewayProviders;
    }

    const baseURL = await buildGatewayUrl(env, providerForcedOverride);

    // Extract the provider name from model name. Model name is of type `provider/model_name`
    const provider = providerForcedOverride || model.split('/')[0];
    const apiKey = await getApiKey(provider, env, userId);
    
    // AI Gateway Wholesaling checks
    const defaultHeaders = env.CLOUDFLARE_AI_GATEWAY_TOKEN && apiKey !== env.CLOUDFLARE_AI_GATEWAY_TOKEN ? {
        'cf-aig-authorization': `Bearer ${env.CLOUDFLARE_AI_GATEWAY_TOKEN}`,
    } : undefined;
    
    return {
        baseURL,
        apiKey,
        defaultHeaders
    };
}
```

**Flow Chart**:
```
Model: google-ai-studio/gemini-2.5-pro
  ↓
Check for [provider] brackets? NO
  ↓
Call buildGatewayUrl() → routes through Cloudflare Gateway
  ↓
Return gateway URL to Google
```

### DreamForge Version (WITH GOOGLE BYPASS)

```typescript
export async function getConfigurationForModel(
    model: AIModels | string, 
    env: Env, 
    userId: string,
): Promise<{
    baseURL: string,
    apiKey: string,
    defaultHeaders?: Record<string, string>,
}> {
    let providerForcedOverride: AIGatewayProviders | undefined;
    
    // Check if provider forceful-override is set
    const match = model.match(/\[(.*?)\]/);
    if (match) {
        const provider = match[1];
        if (provider === 'openrouter') {
            return {
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: env.OPENROUTER_API_KEY,
            };
        } else if (provider === 'gemini') {
            return {
                baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
                apiKey: env.GOOGLE_AI_STUDIO_API_KEY,
            };
        } else if (provider === 'claude') {
            return {
                baseURL: 'https://api.anthropic.com/v1/',
                apiKey: env.ANTHROPIC_API_KEY,
            };
        }
        providerForcedOverride = provider as AIGatewayProviders;
    }

    // DREAMFORGE ADDITION: Bypass AI Gateway for google-ai-studio provider (goes direct to Google)
    // This is the CRITICAL DIFFERENCE - NOT in VibeSDK
    if (provider === 'google-ai-studio') {
        return {
            baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
            apiKey: env.GOOGLE_AI_STUDIO_API_KEY,
        };
    }

    const baseURL = await buildGatewayUrl(env, providerForcedOverride);

    // Extract the provider name from model name. Model name is of type `provider/model_name`
    const provider = providerForcedOverride || model.split('/')[0];
    const apiKey = await getApiKey(provider, env, userId);
    
    // AI Gateway Wholesaling checks
    const defaultHeaders = env.CLOUDFLARE_AI_GATEWAY_TOKEN && apiKey !== env.CLOUDFLARE_AI_GATEWAY_TOKEN ? {
        'cf-aig-authorization': `Bearer ${env.CLOUDFLARE_AI_GATEWAY_TOKEN}`,
    } : undefined;
    
    return {
        baseURL,
        apiKey,
        defaultHeaders
    };
}
```

**Flow Chart**:
```
Model: google-ai-studio/gemini-2.5-pro
  ↓
Check for [provider] brackets? NO
  ↓
Extract provider: google-ai-studio
  ↓
Is provider === 'google-ai-studio'? YES ← DREAMFORGE ADDITION
  ↓
RETURN EARLY with direct Google URL
  ↓
(Never calls buildGatewayUrl())
```

**Visual Diff**:
```diff
export async function getConfigurationForModel(
    model: AIModels | string, 
    env: Env, 
    userId: string,
): Promise<{...}> {
    // ... bracket override logic ...
    
+   // Bypass AI Gateway for google-ai-studio provider (goes direct to Google)
+   if (provider === 'google-ai-studio') {
+       return {
+           baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
+           apiKey: env.GOOGLE_AI_STUDIO_API_KEY,
+       };
+   }
    
    const baseURL = await buildGatewayUrl(env, providerForcedOverride);
    // ... rest of function ...
}
```

**Key Issue**: 
- Line 289: `const provider = providerForcedOverride || model.split('/')[0];`
  - For model `google-ai-studio/gemini-2.5-pro`, provider becomes `google-ai-studio`
- Lines 292-297 (DreamForge ONLY): Early return if provider is google-ai-studio
- This bypasses the entire gateway infrastructure

---

## 3. API Key Resolution (IDENTICAL)

### Both Projects: getApiKey()

**Location**: 
- VibeSDK: `/worker/agents/inferutils/core.ts` lines 227-253
- DreamForge: `/worker/agents/inferutils/core.ts` lines 227-253

```typescript
async function getApiKey(provider: string, env: Env, _userId: string): Promise<string> {
    console.log("Getting API key for provider: ", provider);
    
    // Fallback to environment variables
    const providerKeyString = provider.toUpperCase().replaceAll('-', '_');
    const envKey = `${providerKeyString}_API_KEY` as keyof Env;
    let apiKey: string = env[envKey] as string;
    
    // Check if apiKey is empty or undefined and is valid
    if (!isValidApiKey(apiKey)) {
        apiKey = env.CLOUDFLARE_AI_GATEWAY_TOKEN;
    }
    return apiKey;
}

function isValidApiKey(apiKey: string): boolean {
    if (!apiKey || apiKey.trim() === '') {
        return false;
    }
    // Check if value is not 'default' or 'none' and is more than 10 characters long
    if (apiKey.trim().toLowerCase() === 'default' || apiKey.trim().toLowerCase() === 'none' || apiKey.trim().length < 10) {
        return false;
    }
    return true;
}
```

**Status**: ✓ IDENTICAL across both projects

---

## 4. Agent Configuration (DIFFERENT)

### VibeSDK: 12 Agent Actions

**Location**: `/worker/agents/inferutils/config.ts` lines 70-156

```typescript
export const AGENT_CONFIG: AgentConfig = {
    templateSelection: { ... },
    blueprint: { ... },
    projectSetup: { ... },
    phaseGeneration: { ... },
    firstPhaseImplementation: { ... },
    phaseImplementation: { ... },
    realtimeCodeFixer: { ... },
    fastCodeFixer: { ... },
    conversationalResponse: { ... },
    codeReview: { ... },
    fileRegeneration: { ... },
    screenshotAnalysis: { ... },
};
```

### DreamForge: 13 Agent Actions (ADDS planningConversation)

**Location**: `/home/bishop/projects/dreamforge/worker/agents/inferutils/config.ts` lines 70-163

```typescript
export const AGENT_CONFIG: AgentConfig = {
    templateSelection: { ... },
    blueprint: { ... },
    projectSetup: { ... },
    phaseGeneration: { ... },
    firstPhaseImplementation: { ... },
    phaseImplementation: { ... },
    realtimeCodeFixer: { ... },
    fastCodeFixer: { ... },
    conversationalResponse: { ... },
    // NEW IN DREAMFORGE:
    planningConversation: {
        name: AIModels.CLAUDE_4_5_SONNET,
        reasoning_effort: 'medium',
        max_tokens: 8000,
        temperature: 0.7,
        fallbackModel: AIModels.CLAUDE_4_SONNET,
    },
    codeReview: { ... },
    fileRegeneration: { ... },
    screenshotAnalysis: { ... },
};
```

**Difference**: DreamForge adds a new agent action for planning conversations using Claude.

---

## 5. Model Definitions (DIFFERENT)

### VibeSDK: Claude up to claude-4-sonnet

**Location**: `/worker/agents/inferutils/config.types.ts` lines 27-30

```typescript
export enum AIModels {
    // ... other models ...
    
    // Anthropic Claude
    CLAUDE_3_5_SONNET_LATEST = 'anthropic/claude-3-5-sonnet-latest',
    CLAUDE_3_7_SONNET_20250219 = 'anthropic/claude-3-7-sonnet-20250219',
    CLAUDE_4_OPUS = 'anthropic/claude-opus-4-20250514',
    CLAUDE_4_SONNET = 'anthropic/claude-sonnet-4-20250514',
    
    // ... rest of models ...
}
```

### DreamForge: Claude up to claude-4-5-sonnet (ADDS claude-4-5-sonnet)

**Location**: `/home/bishop/projects/dreamforge/worker/agents/inferutils/config.types.ts` lines 27-31

```typescript
export enum AIModels {
    // ... other models ...
    
    // Anthropic Claude
    CLAUDE_3_5_SONNET_LATEST = 'anthropic/claude-3-5-sonnet-latest',
    CLAUDE_3_7_SONNET_20250219 = 'anthropic/claude-3-7-sonnet-20250219',
    CLAUDE_4_OPUS = 'anthropic/claude-opus-4-20250514',
    CLAUDE_4_SONNET = 'anthropic/claude-sonnet-4-20250514',
    CLAUDE_4_5_SONNET = 'anthropic/claude-sonnet-4-5-20250929',  // NEW
    
    // ... rest of models ...
}
```

**Difference**: DreamForge adds the newer Claude 4.5 Sonnet model.

---

## 6. Streaming & Tool Calls (IDENTICAL)

Both projects handle streaming tool calls identically, with same provider-specific debug logging:

```typescript
// Provider-specific logging
const provider = modelName.split('/')[0];
if (delta?.tool_calls && (provider === 'google-ai-studio' || provider === 'gemini')) {
    console.log(`[PROVIDER_DEBUG] ${provider} tool_calls delta:`, JSON.stringify(delta.tool_calls, null, 2));
}
```

**Status**: ✓ IDENTICAL across both projects

---

## 7. Gateway Configuration (IDENTICAL)

### wrangler.jsonc Configuration

**VibeSDK** (line 147):
```json
"vars": {
    "CLOUDFLARE_AI_GATEWAY": "vibesdk-gateway",
}
```

**DreamForge** (line 150):
```json
"vars": {
    "CLOUDFLARE_AI_GATEWAY": "vibesdk-gateway",
}
```

**Status**: ✓ IDENTICAL across both projects

---

## Summary Table

| Component | VibeSDK | DreamForge | Match? |
|-----------|---------|-----------|--------|
| buildGatewayUrl() | Lines 189-214 | Lines 189-214 | ✓ YES |
| getConfigurationForModel() | Lines 255-304 | Lines 255-312 | ✓ NO - Google bypass added |
| getApiKey() | Lines 227-253 | Lines 227-253 | ✓ YES |
| Agent actions | 12 config items | 13 config items | ⚠️ Enhanced |
| Claude models | claude-4-sonnet | claude-4-5-sonnet | ⚠️ Updated |
| Streaming/tools | Identical | Identical | ✓ YES |
| Gateway config | vibesdk-gateway | vibesdk-gateway | ✓ YES |

---

## The Google AI Studio Bypass Explained

When DreamForge processes a Google model:

```
Input: AIModels.GEMINI_2_5_FLASH = 'google-ai-studio/gemini-2.5-flash'
        ↓
getConfigurationForModel('google-ai-studio/gemini-2.5-flash')
        ↓
Line 289: provider = 'google-ai-studio'
        ↓
Line 292-297: if (provider === 'google-ai-studio') ✓ TRUE
        ↓
RETURN DIRECTLY: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: env.GOOGLE_AI_STUDIO_API_KEY,
}
        ↓
OpenAI client connects directly to Google's API
        ↓
Never goes through Cloudflare Gateway ✗
```

Contrast with VibeSDK:

```
Input: AIModels.GEMINI_2_5_FLASH = 'google-ai-studio/gemini-2.5-flash'
        ↓
getConfigurationForModel('google-ai-studio/gemini-2.5-flash')
        ↓
Line 289: provider = 'google-ai-studio'
        ↓
No google-ai-studio bypass check
        ↓
Call buildGatewayUrl(env, undefined)
        ↓
Returns: Cloudflare Gateway URL (e.g., https://gateway.cloudflare.com/compat)
        ↓
OpenAI client connects to Gateway
        ↓
Gateway routes to Google's API ✓
        ↓
All requests tracked through Cloudflare ✓
```

---

## Files to Review

1. **Critical Divergence**:
   - `/home/bishop/projects/dreamforge/worker/agents/inferutils/core.ts` lines 291-297

2. **New Agent Config**:
   - `/home/bishop/projects/dreamforge/worker/agents/inferutils/config.ts` lines 134-140

3. **New Model**:
   - `/home/bishop/projects/dreamforge/worker/agents/inferutils/config.types.ts` line 31

4. **Analytics Impact**:
   - `/home/bishop/projects/dreamforge/worker/services/analytics/AiGatewayAnalyticsService.ts`

---

## Recommendations

1. **Document the bypass decision** if intentional
2. **Add custom logging** to track direct Google calls
3. **Consider performance testing**: Direct vs Gateway latency
4. **Consider cost analysis**: Savings from bypassing gateway
5. **Update monitoring** to account for analytics gap

