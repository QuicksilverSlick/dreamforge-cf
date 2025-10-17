# Cloudflare VibeSDK vs DreamForge: AI Gateway Configuration Analysis Report

## Executive Summary

This report provides a comprehensive analysis of how Cloudflare's VibeSDK and DreamForge implement AI Gateway configuration, provider handling, and model management. Both projects leverage Cloudflare's AI Gateway for intelligent routing across multiple LLM providers while maintaining fallback strategies and cost optimization.

---

## 1. AI GATEWAY CONFIGURATION

### 1.1 VibeSDK Gateway Setup

**File**: `/worker/agents/inferutils/core.ts` (lines 189-214)

```typescript
export async function buildGatewayUrl(env: Env, providerOverride?: AIGatewayProviders): Promise<string> {
    // If CLOUDFLARE_AI_GATEWAY_URL is set and is a valid URL, use it directly
    if (env.CLOUDFLARE_AI_GATEWAY_URL && 
        env.CLOUDFLARE_AI_GATEWAY_URL !== 'none' && 
        env.CLOUDFLARE_AI_GATEWAY_URL.trim() !== '') {
        
        try {
            const url = new URL(env.CLOUDFLARE_AI_GATEWAY_URL);
            // Validate it's actually an HTTP/HTTPS URL
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                // Add 'providerOverride' as a segment to the URL
                const cleanPathname = url.pathname.replace(/\/$/, ''); // Remove trailing slash
                url.pathname = providerOverride ? `${cleanPathname}/${providerOverride}` : `${cleanPathname}/compat`;
                return url.toString();
            }
        } catch (error) {
            // Invalid URL, fall through to use bindings
            console.warn(`Invalid CLOUDFLARE_AI_GATEWAY_URL provided: ${env.CLOUDFLARE_AI_GATEWAY_URL}. Falling back to AI bindings.`);
        }
    }
    
    // Build the url via bindings
    const gateway = env.AI.gateway(env.CLOUDFLARE_AI_GATEWAY);
    const baseUrl = providerOverride ? await gateway.getUrl(providerOverride) : `${await gateway.getUrl()}compat`;
    return baseUrl;
}
```

**Key Features**:
1. **Dual-mode Gateway Resolution**:
   - Primary: Uses `CLOUDFLARE_AI_GATEWAY_URL` environment variable if provided as a full URL
   - Fallback: Uses AI binding with `gateway.getUrl()` method from Cloudflare runtime
   
2. **URL Validation**:
   - Validates custom URL format before using it
   - Checks for HTTP/HTTPS protocol only
   - Gracefully falls back to bindings if URL is invalid

3. **Provider-Specific Paths**:
   - Appends provider name to gateway URL path for direct routing: `${gatewayUrl}/${provider}`
   - Defaults to `/compat` path for compatibility mode

4. **Environment Configuration**:
   - `wrangler.jsonc`: `"CLOUDFLARE_AI_GATEWAY": "vibesdk-gateway"`
   - Supports custom `CLOUDFLARE_AI_GATEWAY_URL` and `CLOUDFLARE_AI_GATEWAY_TOKEN`

### 1.2 DreamForge Gateway Setup

**File**: `/home/bishop/projects/dreamforge/worker/agents/inferutils/core.ts` (lines 189-214)

DreamForge implements **identical gateway configuration** to VibeSDK:
- Same `buildGatewayUrl()` function
- Same URL validation logic
- Same fallback mechanism to AI bindings
- Same provider-specific path routing

**Configuration in wrangler.jsonc**:
```json
"vars": {
    "CLOUDFLARE_AI_GATEWAY": "vibesdk-gateway",
    ...
}
```

**Status**: ✓ Aligned with upstream VibeSDK

---

## 2. PROVIDER HANDLING

### 2.1 Provider Bypass Strategy

**Critical Difference: Google AI Studio Direct Bypass**

#### VibeSDK Implementation
File: `/worker/agents/inferutils/core.ts` (lines 264-297)

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
    
    // Try to find API key of type <PROVIDER>_API_KEY else default to CLOUDFLARE_AI_GATEWAY_TOKEN
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

#### DreamForge Implementation
File: `/home/bishop/projects/dreamforge/worker/agents/inferutils/core.ts` (lines 264-312)

**Addition in DreamForge**:
```typescript
// Bypass AI Gateway for google-ai-studio provider (goes direct to Google)
if (provider === 'google-ai-studio') {
    return {
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
        apiKey: env.GOOGLE_AI_STUDIO_API_KEY,
    };
}
```

**Key Difference Analysis**:
- VibeSDK: Google AI Studio routes through gateway via `provider === 'google-ai-studio'` in model name parsing
- DreamForge: **ADDED explicit bypass** for `google-ai-studio` provider to go direct to Google's endpoints
- This is a **CRITICAL DIVERGENCE** that impacts:
  - **Cost**: Direct routing avoids gateway fees but loses analytics
  - **Latency**: Direct routing may be faster or slower depending on geography
  - **Monitoring**: Direct calls don't pass through Cloudflare's gateway for tracking

### 2.2 Supported Providers

#### VibeSDK Providers (from byokHelper.ts lines 89-121)
```typescript
const providerList = [
    'anthropic',
    'openai',
    'google-ai-studio',
    'cerebras',
    'groq',
];
```

#### DreamForge Providers (from byokHelper.ts line 97)
```typescript
// Same list as VibeSDK
const providerList = [
    'anthropic',
    'openai',
    'google-ai-studio',
    'cerebras',
    'groq',
];
```

#### Special Override Syntax
Both support bracket notation for direct provider override:
- `[openrouter]model-name` → Routes directly to OpenRouter
- `[gemini]model-name` → Routes directly to Google (with or without gateway bypass)
- `[claude]model-name` → Routes directly to Anthropic

### 2.3 Provider-Specific Streaming Handling

**File**: `/worker/agents/inferutils/core.ts` (lines 589-592)

```typescript
// Provider-specific logging
const provider = modelName.split('/')[0];
if (delta?.tool_calls && (provider === 'google-ai-studio' || provider === 'gemini')) {
    console.log(`[PROVIDER_DEBUG] ${provider} tool_calls delta:`, JSON.stringify(delta.tool_calls, null, 2));
}
```

Both implementations have **identical provider-specific debug logging** for Google providers.

---

## 3. API KEY MANAGEMENT

### 3.1 Key Resolution Flow

**File**: `/worker/agents/inferutils/core.ts` (lines 227-253)

Both VibeSDK and DreamForge use identical API key resolution:

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

**Resolution Priority**:
1. Check provider-specific key: `${PROVIDER}_API_KEY`
   - Supports: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_AI_STUDIO_API_KEY`, `CEREBRAS_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`
2. Fallback to: `CLOUDFLARE_AI_GATEWAY_TOKEN`
3. Validation: Keys must be:
   - Non-empty
   - Not "default" or "none"
   - At least 10 characters

### 3.2 AI Gateway Wholesaling Headers

**File**: `/worker/agents/inferutils/core.ts` (lines 304-306)

```typescript
const defaultHeaders = env.CLOUDFLARE_AI_GATEWAY_TOKEN && apiKey !== env.CLOUDFLARE_AI_GATEWAY_TOKEN ? {
    'cf-aig-authorization': `Bearer ${env.CLOUDFLARE_AI_GATEWAY_TOKEN}`,
} : undefined;
```

**Logic**:
- If gateway token exists AND the API key being used is NOT the gateway token itself
- Then add `cf-aig-authorization` header with gateway token
- This enables "AI Gateway Wholesaling" - mixing user BYOK keys with gateway token for analytics

---

## 4. MODEL CONFIGURATION

### 4.1 AGENT_CONFIG Structure

**VibeSDK** (`/worker/agents/inferutils/config.ts` lines 70-156):
- 12 agent action keys:
  - templateSelection
  - blueprint
  - projectSetup
  - phaseGeneration
  - firstPhaseImplementation
  - phaseImplementation
  - realtimeCodeFixer
  - fastCodeFixer
  - conversationalResponse
  - codeReview
  - fileRegeneration
  - screenshotAnalysis

**DreamForge** (`/home/bishop/projects/dreamforge/worker/agents/inferutils/config.ts` lines 70-163):
- 13 agent action keys (adds `planningConversation`)

### 4.2 Model Selection Strategy

#### VibeSDK Current Config
```typescript
export const AGENT_CONFIG: AgentConfig = {
    templateSelection: {
        name: AIModels.GEMINI_2_5_FLASH_LITE,
        max_tokens: 2000,
        fallbackModel: AIModels.GEMINI_2_5_FLASH,
        temperature: 0.6,
    },
    blueprint: {
        name: AIModels.GEMINI_2_5_PRO,
        reasoning_effort: 'medium',
        max_tokens: 64000,
        fallbackModel: AIModels.GEMINI_2_5_FLASH,
        temperature: 0.7,
    },
    // ... uses Google Gemini as primary
};
```

#### DreamForge Current Config
```typescript
export const AGENT_CONFIG: AgentConfig = {
    // ... identical to VibeSDK
    planningConversation: {
        name: AIModels.CLAUDE_4_5_SONNET,
        reasoning_effort: 'medium',
        max_tokens: 8000,
        temperature: 0.7,
        fallbackModel: AIModels.CLAUDE_4_SONNET,
    },
};
```

**Status**: DreamForge uses same Gemini-first strategy with added Claude planning capability

### 4.3 Model Definitions

Both use identical `AIModels` enum:

```typescript
export enum AIModels {
    DISABLED = 'disabled',
    
    // Google Gemini (google-ai-studio)
    GEMINI_2_0_FLASH = 'google-ai-studio/gemini-2.0-flash',
    GEMINI_2_5_PRO = 'google-ai-studio/gemini-2.5-pro',
    GEMINI_2_5_FLASH = 'google-ai-studio/gemini-2.5-flash',
    GEMINI_2_5_FLASH_LITE = 'google-ai-studio/gemini-2.5-flash-lite',
    
    // Anthropic Claude (anthropic)
    CLAUDE_3_5_SONNET_LATEST = 'anthropic/claude-3-5-sonnet-latest',
    CLAUDE_3_7_SONNET_20250219 = 'anthropic/claude-3-7-sonnet-20250219',
    CLAUDE_4_OPUS = 'anthropic/claude-opus-4-20250514',
    CLAUDE_4_SONNET = 'anthropic/claude-sonnet-4-20250514',
    CLAUDE_4_5_SONNET = 'anthropic/claude-sonnet-4-5-20250929',  // NEW in DreamForge
    
    // OpenAI (openai)
    OPENAI_O3 = 'openai/o3',
    OPENAI_O4_MINI = 'openai/o4-mini',
    OPENAI_5 = 'openai/gpt-5',
    OPENAI_5_MINI = 'openai/gpt-5-mini',
    
    // Cerebras (cerebras)
    CEREBRAS_GPT_OSS = 'cerebras/gpt-oss-120b',
    CEREBRAS_QWEN_3_CODER = 'cerebras/qwen-3-coder-480b',
}
```

**New Models in DreamForge**:
- `CLAUDE_4_5_SONNET = 'anthropic/claude-sonnet-4-5-20250929'`

---

## 5. KEY DIFFERENCES

### 5.1 Critical Divergences

| Aspect | VibeSDK | DreamForge | Impact |
|--------|---------|-----------|--------|
| **Google AI Studio Routing** | Via gateway | Direct bypass | Cost & observability |
| **Agent Actions** | 12 config items | 13 (adds planningConversation) | Feature expansion |
| **Claude Version** | claude-4-sonnet | claude-4-5-sonnet added | Newer reasoning |
| **AI Gateway URL Handling** | Supports custom URL | Supports custom URL | Same |
| **Provider Bypass Syntax** | Supports `[provider]` | Supports `[provider]` | Same |

### 5.2 Google AI Studio Routing Divergence - Deep Dive

**VibeSDK Pattern**:
1. Model: `google-ai-studio/gemini-2.5-pro`
2. Provider extracted: `google-ai-studio`
3. Call flow: `google-ai-studio → buildGatewayUrl() → AI binding → Cloudflare Gateway → Google`
4. Benefits: Analytics, Rate limiting, Cost tracking
5. Drawback: Extra hop adds latency

**DreamForge Pattern**:
1. Model: `google-ai-studio/gemini-2.5-pro`
2. Provider extracted: `google-ai-studio`
3. **EXPLICIT EARLY RETURN** with direct Google endpoint
4. Call flow: `google-ai-studio → Direct https://generativelanguage.googleapis.com → Google`
5. Benefits: Lower latency, direct cost control
6. Drawback: Loses Cloudflare gateway analytics, monitoring

**Why This Matters**:
- **Cost**: Cloudflare AI Gateway charges per request. Direct bypasses these charges.
- **Latency**: One fewer hop potentially improves response time.
- **Monitoring**: VibeSDK can track all Google calls through gateway. DreamForge cannot.
- **Consistency**: Creates inconsistency in routing for troubleshooting.

---

## 6. BYOK (BRING YOUR OWN KEY) SYSTEM

Both implementations have identical BYOK support:

### 6.1 User Provider Status

**File**: `byokHelper.ts` lines 15-60

Dynamically checks which providers user has configured:
```typescript
export async function getUserProviderStatus(
    userId: string,
    env: Env,
): Promise<UserProviderStatus[]> {
    // Gets BYOK templates
    const byokTemplates = await getBYOKTemplates();
    
    // Checks user secrets for each provider
    const userSecrets = await secretsService.getUserSecrets(userId);
    
    // Returns status: { provider, hasValidKey, keyPreview }
}
```

### 6.2 Platform vs User Keys

**Priority Order**:
1. User BYOK key (if configured and valid)
2. Platform API key (from environment)

**Validation in modelConfig Controller** (`controller.ts` lines 153-190):
```typescript
// Validate model access based on environment configuration and user BYOK status
const isValidAccess = validateModelAccessForEnvironment(
    modelConfig.name, 
    env, 
    userProviderStatus
);

if (!isValidAccess) {
    return ModelConfigController.createErrorResponse<ModelConfigUpdateData>(
        `Model requires API key for provider '${provider}'. Please add your API key in the BYOK settings...`,
        403
    );
}
```

---

## 7. INFERENCE REQUEST FLOW

Both implement identical inference orchestration:

### 7.1 Core Inference Function

**File**: `/worker/agents/inferutils/core.ts` lines 416-778

```typescript
export async function infer<OutputSchema extends z.AnyZodObject>({
    env,
    metadata,
    messages,
    schema,
    schemaName,
    actionKey,
    maxTokens,
    modelName,
    temperature,
    stream,
    tools,
    reasoning_effort,
}): Promise<InferResponseObject<OutputSchema> | InferResponseString> {
    // 1. Rate limit enforcement
    await RateLimitService.enforceLLMCallsRateLimit(env, userConfig.security.rateLimit, metadata.userId, modelName);
    
    // 2. Get model configuration (baseURL, apiKey, headers)
    const { apiKey, baseURL, defaultHeaders } = await getConfigurationForModel(modelName, env, metadata.userId);
    
    // 3. Create OpenAI client with configuration
    const client = new OpenAI({ apiKey, baseURL: baseURL, defaultHeaders });
    
    // 4. Optimize message inputs
    const optimizedMessages = optimizeInputs(messages);
    
    // 5. Handle structured output (if schema provided)
    const schemaObj = schema ? { response_format: zodResponseFormat(schema, schemaName) } : {};
    
    // 6. Call LLM with streaming or full response
    const response = await client.chat.completions.create({
        ...schemaObj,
        ...toolsOpts,
        model: modelName,
        messages: messagesToPass,
        max_completion_tokens: maxTokens,
        stream: stream ? true : false,
        reasoning_effort,
        temperature,
    }, {
        headers: {
            "cf-aig-metadata": JSON.stringify({
                chatId: metadata.agentId,
                userId: metadata.userId,
                schemaName,
                actionKey,
            })
        }
    });
    
    // 7. Handle streaming vs non-streaming
    // 8. Process tool calls if any
    // 9. Return structured or string response
}
```

### 7.2 Metadata Tracking Headers

```typescript
headers: {
    "cf-aig-metadata": JSON.stringify({
        chatId: metadata.agentId,
        userId: metadata.userId,
        schemaName,
        actionKey,
    })
}
```

This metadata helps Cloudflare's AI Gateway track:
- Which agent is making the call
- Which user is making it
- What type of schema was requested
- What action triggered the inference

---

## 8. ANALYTICS & MONITORING

### 8.1 AI Gateway Analytics Service

**File**: `AiGatewayAnalyticsService.ts`

Both implementations track:
- Request volume by provider
- Model usage patterns
- User/organization costs
- Error rates per provider

**Configuration**:
```typescript
if (env.CLOUDFLARE_AI_GATEWAY_URL) {
    const { accountId, gateway, isStaging } = this.parseGatewayUrl(env.CLOUDFLARE_AI_GATEWAY_URL);
    // Configures analytics for custom gateway endpoints
}
```

**Critical Issue**: If DreamForge routes Google directly, these analytics won't track those requests!

---

## 9. RATE LIMITING

Both implement identical rate limiting:

**Service**: `RateLimitService`

```typescript
await RateLimitService.enforceLLMCallsRateLimit(
    env,
    userConfig.security.rateLimit,
    metadata.userId,
    modelName
);
```

Enforces user-level rate limits by:
- User ID
- Model type
- Time window (configurable)

---

## 10. TOOL CALLING & STREAMING

### 10.1 Streaming Tool Call Accumulation

Both handle complex streaming scenarios identically:

**Challenge**: Tool calls arrive in deltas with incomplete arguments

**Solution** (`core.ts` lines 34-146):
```typescript
// Accumulate tool calls by index and ID
const byIndex = new Map<number, ToolAccumulatorEntry>();
const byId = new Map<string, ToolAccumulatorEntry>();
const orderCounterRef = { value: 0 };

for await (const event of response) {
    const delta = event.choices[0]?.delta;
    
    if (delta?.tool_calls) {
        for (const deltaToolCall of delta.tool_calls) {
            accumulateToolCallDelta(byIndex, byId, deltaToolCall, orderCounterRef);
        }
    }
    
    content += delta?.content || '';
}

// Assemble into complete tool calls
const toolCalls = assembleToolCalls(byIndex, byId);
```

**Provider-Specific Debug**:
```typescript
if (delta?.tool_calls && (provider === 'google-ai-studio' || provider === 'gemini')) {
    console.log(`[PROVIDER_DEBUG] ${provider} tool_calls delta:`, ...);
}
```

---

## SUMMARY OF KEY FINDINGS

### What's the Same:
1. Gateway URL resolution (buildGatewayUrl)
2. Provider handling logic (override syntax, fallbacks)
3. API key resolution strategy
4. Rate limiting implementation
5. Streaming tool call handling
6. BYOK (Bring Your Own Key) system
7. Model configuration structure

### What's Different:
1. **Google AI Studio Routing** (CRITICAL):
   - VibeSDK: Routes through Cloudflare Gateway
   - DreamForge: **Explicit bypass to direct Google endpoints**
   - Impact: Cost savings but lost observability

2. **Agent Actions**:
   - VibeSDK: 12 configurations
   - DreamForge: 13 (adds `planningConversation`)

3. **Claude Models**:
   - VibeSDK: Up to claude-4-sonnet
   - DreamForge: Adds claude-4-5-sonnet

### Recommendations:

1. **Clarify Google Routing Strategy**:
   - Decide if direct bypass is intentional
   - If yes, update analytics to track direct calls
   - If no, revert to gateway routing

2. **Sync Model Configurations**:
   - Consider whether VibeSDK should adopt the newer Claude models
   - Test impact of direct Google routing on latency/costs

3. **Documentation**:
   - Document the provider bypass feature
   - Add comments explaining the Wholesaling headers feature
   - Create troubleshooting guide for routing issues

4. **Monitoring**:
   - Add custom logging for direct-routed providers
   - Correlate analytics gaps with direct Google calls
   - Monitor latency differences between routed vs direct

