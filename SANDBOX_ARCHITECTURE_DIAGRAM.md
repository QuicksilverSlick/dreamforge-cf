# Cloudflare Vibesdk Sandbox Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE EDGE NETWORK                              │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ DNS ROUTING                                                          │  │
│  │                                                                      │  │
│  │ *.build.cloudflare.dev ──┐                                         │  │
│  │                          ├──→ Cloudflare Wrangler Worker            │  │
│  │ *.build-preview.*.dev ──┘    (index.ts - main entry point)        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ REQUEST ROUTING (worker/index.ts)                                   │  │
│  │                                                                      │  │
│  │  if (hostname == CUSTOM_DOMAIN) {                                  │  │
│  │    → /api/* → Hono App (createApp)                                │  │
│  │    → /* → Static Assets (env.ASSETS)                             │  │
│  │  }                                                                  │  │
│  │                                                                      │  │
│  │  if (hostname ends with .CUSTOM_PREVIEW_DOMAIN) {                │  │
│  │    → try proxyToSandbox(request, env)                            │  │
│  │       ├─ SUCCESS: return sandbox response [X-Preview-Type: sandbox]│  │
│  │       └─ MISS: fallback to dispatcher                            │  │
│  │    → dispatcher.get(appName).fetch(request) [X-Preview-Type: dispatcher]│
│  │  }                                                                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                    ┌───────────────┴───────────────┐                        │
│                    ▼                               ▼                        │
│  ┌───────────────────────────────┐  ┌──────────────────────────────────┐  │
│  │ LIVE SANDBOX PATH             │  │ DEPLOYED WORKER PATH             │  │
│  │ (proxyToSandbox)              │  │ (dispatcher namespace)            │  │
│  └───────────────────────────────┘  └──────────────────────────────────┘  │
│           │                                   │                             │
└───────────┼───────────────────────────────────┼─────────────────────────────┘
            │                                   │
            ▼                                   ▼
    ┌──────────────────────────┐       ┌──────────────────────┐
    │ SANDBOX CONTAINERS       │       │ DEPLOYED WORKERS     │
    │ (Durable Objects)        │       │ (Dispatch Namespace) │
    │                          │       │                      │
    │ env.Sandbox binding      │       │ env.DISPATCHER       │
    │ UserAppSandboxService    │       │ persistent workers   │
    │ multiple instances       │       │                      │
    └──────────────────────────┘       └──────────────────────┘
```

---

## Sandbox Container Lifecycle

```
USER REQUEST FOR PREVIEW
         │
         ▼
┌────────────────────────────┐
│ 1. CREATE INSTANCE         │
│                            │
│ Input:                     │
│  - templateName            │
│  - projectName             │
│  - localEnvVars (optional) │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ 2. VERIFY ALLOCATION STRATEGY              │
│                                            │
│ MANY_TO_ONE:                              │
│  hash(sessionId) → container-pool-N       │
│  Multiple sessions share same container   │
│                                            │
│ ONE_TO_ONE:                               │
│  Dedicated container per session          │
│  (checks for conflicts)                   │
└────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ 3. PREPARE INSTANCE                        │
│                                            │
│ a. Ensure template exists (download if needed from R2)
│ b. Generate instanceId: i-{randomId}     │
│ c. Copy template → instanceId directory   │
│ d. Update package.json & wrangler.jsonc  │
│    with projectName                      │
│ e. Provision Cloudflare resources        │
│    (D1, KV, R2, etc.)                    │
└────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ 4. PORT ALLOCATION & EXPOSURE              │
│                                            │
│ a. Find available port (8001-8999)        │
│ b. Start dev server on port               │
│    (bun run dev)                          │
│ c. Call sandbox.exposePort(port, {       │
│      hostname: getPreviewDomain(env)      │
│    })                                     │
│ d. Receive previewURL                    │
│    https://{uuid}.{domain}/               │
└────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ 5. STORE METADATA                          │
│                                            │
│ {instanceId}-metadata.json:               │
│  {                                         │
│    templateName,                          │
│    projectName,                           │
│    startTime (ISO),                       │
│    previewURL,                            │
│    tunnelURL,                             │
│    processId,                             │
│    allocatedPort,                         │
│    donttouch_files [],                    │
│    redacted_files []                      │
│  }                                        │
│                                            │
│ Also cache in memory:                     │
│  metadataCache: Map<instanceId, metadata> │
└────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ 6. RETURN BOOTSTRAP RESPONSE               │
│                                            │
│ {                                         │
│   success: true,                          │
│   runId: instanceId,                      │
│   previewURL: "https://...",              │
│   tunnelURL: "https://...",               │
│   processId: "...",                       │
│   message: "..."                          │
│ }                                         │
└────────────────────────────────────────────┘
         │
         ▼
    READY FOR USE
```

---

## Preview URL Resolution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ USER BROWSER: https://i-abc123.build-preview.cloudflare.dev    │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ DNS RESOLUTION                                                  │
│ *.build-preview.cloudflare.dev → Cloudflare Edge               │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ WORKER FETCH HANDLER (worker/index.ts)                         │
│                                                                 │
│ const url = new URL(request.url)                               │
│ const hostname = "i-abc123.build-preview.cloudflare.dev"       │
│ const pathname = "/"                                           │
│                                                                 │
│ isSubdomainRequest = true                                      │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ SANDBOX PROXY                                                   │
│                                                                 │
│ const sandboxResponse = await proxyToSandbox(request, env)    │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─ SUCCESS ─────────────┐
         │                       │
         │                       ▼
         │            ┌──────────────────────────┐
         │            │ GET SANDBOX METADATA     │
         │            │ for i-abc123             │
         │            │                          │
         │            │ allocatedPort: 8042      │
         │            │ processId: "proc-xyz"    │
         │            │ previewURL: "https://..." │
         │            └──────────────────────────┘
         │                       │
         │                       ▼
         │            ┌──────────────────────────┐
         │            │ ROUTE TO LOCAL PORT      │
         │            │ localhost:8042           │
         │            │ (in sandbox container)   │
         │            └──────────────────────────┘
         │                       │
         │                       ▼
         │            ┌──────────────────────────┐
         │            │ DEV SERVER RESPONSE      │
         │            │ (Vite, React, etc.)      │
         │            └──────────────────────────┘
         │                       │
         │                       ▼
         │            ┌──────────────────────────┐
         │            │ ADD X-Preview-Type:      │
         │            │ sandbox                  │
         │            └──────────────────────────┘
         │                       │
         └───────────────────────┼──────────┐
                                 │          │
                                 ▼          ▼
                           BROWSER    SHOWS APP
                           
         
         MISS (no sandbox) ─────┐
         │                       ▼
         │            ┌──────────────────────────┐
         │            │ DISPATCHER FALLBACK      │
         │            │                          │
         │            │ appName = "i-abc123"     │
         │            │ worker = DISPATCHER.get( │
         │            │   appName                │
         │            │ )                        │
         │            │ response = worker.fetch()│
         │            │                          │
         │            │ (permanent deployment)   │
         │            └──────────────────────────┘
         │                       │
         └───────────────────────┼──────────┐
                                 │          │
                                 ▼          ▼
                           BROWSER    SHOWS APP
```

---

## Container Instance Configuration

```
┌──────────────────────────────────────────────────────────────────┐
│ WRANGLER.JSONC CONTAINERS DEFINITION                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ "containers": [{                                                │
│   "class_name": "UserAppSandboxService",  ← Durable Object name │
│   "image": "./SandboxDockerfile",         ← Can be local or     │
│      OR "image": "registry.cloudflare..." │   registry image     │
│   "max_instances": 2900,                  ← Env var override:   │
│                                              MAX_SANDBOX_INST.. │
│   "instance_type": {                                            │
│     "vcpu": 4,                            ← vCPUs per instance  │
│     "memory_mib": 4096,                   ← 4GB RAM per inst.   │
│     "disk_mb": 6144                       ← 6GB disk per inst.  │
│   },                                      ← Env var override:   │
│                                              SANDBOX_INSTANCE.. │
│   "rollout_step_percentage": 100                                │
│ }]                                                              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ PORT AVAILABILITY CALCULATION                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Port Range:      8001 - 8999 (≈999 ports)                       │
│                                                                  │
│ Max Instances:   MAX_SANDBOX_INSTANCES (default 10)             │
│                                                                  │
│ Concurrent Apps: 10 instances × 999 ports = 9,990 apps         │
│                                                                  │
│ Reality:         Usually 1-2 apps per instance                  │
│                  (depends on allocation strategy)               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ALLOCATION STRATEGY COMPARISON                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ MANY_TO_ONE (Default):                                          │
│  ├─ Sessions: N (unlimited)                                     │
│  ├─ Containers: 10                                              │
│  ├─ Distribution: hash(sessionId) % 10                          │
│  ├─ Benefit: Resource efficient                                 │
│  └─ Cost: Potential contention                                  │
│                                                                  │
│ ONE_TO_ONE:                                                     │
│  ├─ Sessions: M (limited to instances)                          │
│  ├─ Containers: M (each session gets own)                       │
│  ├─ Distribution: Check for conflicts, dedicate                 │
│  ├─ Benefit: Isolated performance                               │
│  └─ Cost: Resource intensive                                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: File Updates in Sandbox

```
FRONTEND USER EDITS CODE
         │
         ▼
┌────────────────────────────────────────────┐
│ WEBSOCKET MESSAGE: FileUpdate              │
│ {                                          │
│   type: "file_update",                     │
│   files: [                                 │
│     {                                      │
│       filePath: "src/App.tsx",             │
│       fileContents: "..."                  │
│     }                                      │
│   ]                                        │
│ }                                          │
└────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ AGENT RECEIVES UPDATE                      │
│ (smartGeneratorAgent.ts)                   │
└────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ WRITE FILES TO SANDBOX                     │
│                                            │
│ sandboxService.writeFiles(                 │
│   instanceId,                              │
│   files,                                   │
│   commitMessage                            │
│ )                                          │
└────────────────────────────────────────────┘
         │
         ├─ SDK CLIENT PATH ────────────────────┐
         │                                      │
         │  1. Filter donttouch_files          │
         │  2. sandbox.writeFile() for each    │
         │  3. Create git commit               │
         │  4. Touch vite.config.ts            │
         │  5. Return write results            │
         │                                      │
         └──────────────────────────────────────┘
         │
         ├─ RUNNER SERVICE PATH ────────────────┐
         │                                      │
         │  POST /instances/{id}/files         │
         │  with Bearer token                  │
         │  Returns status + errors            │
         │                                      │
         └──────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ DEV SERVER DETECTS CHANGES                 │
│ (Vite hot reload)                          │
│                                            │
│ vite.config.ts touch triggers rebuild      │
└────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ BROWSER RECEIVES HMR UPDATE                │
│ (websocket from dev server)                │
└────────────────────────────────────────────┘
         │
         ▼
    APP UPDATED ON SCREEN
```

---

## Request Routing Decision Tree

```
┌─ INCOMING REQUEST
│
├─ Is hostname = CUSTOM_DOMAIN or localhost?
│  ├─ YES
│  │  ├─ Is pathname = /api/*?
│  │  │  ├─ YES → Hono Application
│  │  │  │         ├─ /api/agent/* → Agent Controller
│  │  │  │         ├─ /api/apps/* → Apps Controller
│  │  │  │         ├─ /api/templates/* → Template Controller
│  │  │  │         └─ ...other API routes
│  │  │  └─ NO → Static Assets (env.ASSETS)
│  │  │         ├─ HTML/CSS/JS
│  │  │         ├─ Images
│  │  │         └─ Fallback to index.html (SPA)
│  │  │
│  │  └─ Response: Direct from Wrangler Worker
│  │
│  └─ NO
│
├─ Is hostname ending with .CUSTOM_PREVIEW_DOMAIN?
│  ├─ YES → User App Request
│  │  │
│  │  ├─ Call proxyToSandbox(request, env)
│  │  │  ├─ Found sandbox? 
│  │  │  │  ├─ YES → Proxy request to sandbox
│  │  │  │  │        Response: X-Preview-Type: sandbox
│  │  │  │  │        (This is a live dev server)
│  │  │  │  │
│  │  │  │  └─ NO → Fall through to dispatcher
│  │  │  │
│  │  ├─ Extract appName (first subdomain)
│  │  ├─ Get worker from DISPATCHER namespace
│  │  ├─ Call worker.fetch(request)
│  │  │  Response: X-Preview-Type: dispatcher
│  │  │  (This is a deployed worker)
│  │  │
│  │  └─ Response: From Sandbox or Dispatcher
│  │
│  └─ NO
│
└─ No match
   └─ Response: 404 Not Found
```

---

## Environment Variables Reference

```
CATEGORY: SANDBOX CONFIGURATION
├─ MAX_SANDBOX_INSTANCES
│  ├─ Default: "10"
│  ├─ Range: 1-2900
│  ├─ Effect: Overrides wrangler.jsonc containers[0].max_instances
│  └─ Use: Controls how many parallel containers can run
│
├─ SANDBOX_INSTANCE_TYPE
│  ├─ Values: "standard-1", "standard-2", "standard-3", ...
│  ├─ Default: "standard-3"
│  ├─ Effect: Overrides instance_type sizing
│  └─ Use: 4vCPU/4GB/6GB disk per instance
│
└─ ALLOCATION_STRATEGY
   ├─ Values: "many_to_one" (default), "one_to_one"
   ├─ many_to_one: Multiple users share containers (hash-based)
   ├─ one_to_one: Each user gets dedicated container
   └─ Use: Performance vs. resource efficiency tradeoff


CATEGORY: SERVICE SELECTION
├─ SANDBOX_SERVICE_TYPE
│  ├─ Values: "runner", "sdk" (default)
│  ├─ runner: Use external RemoteSandboxServiceClient
│  └─ sdk: Use local SandboxSdkClient (env.Sandbox binding)
│
├─ SANDBOX_SERVICE_URL
│  ├─ Used if: SANDBOX_SERVICE_TYPE = "runner"
│  ├─ Example: "https://runner-service.example.com"
│  └─ Use: Base URL for remote runner API
│
└─ SANDBOX_SERVICE_API_KEY
   ├─ Used if: SANDBOX_SERVICE_TYPE = "runner"
   ├─ Format: Bearer token
   └─ Use: Authentication for remote runner requests


CATEGORY: DOMAIN & PREVIEW
├─ CUSTOM_DOMAIN
│  ├─ Example: "build.cloudflare.dev"
│  ├─ REQUIRED: Must not be empty
│  ├─ Effect: Main platform domain for API & platform
│  └─ DNS: Must point to Cloudflare
│
├─ CUSTOM_PREVIEW_DOMAIN
│  ├─ Example: "build-preview.cloudflare.dev"
│  ├─ Fallback: Uses CUSTOM_DOMAIN if not set
│  ├─ Effect: Subdomain for user app previews
│  └─ DNS: Wildcard *.domain must point to Cloudflare
│
└─ USE_TUNNEL_FOR_PREVIEW
   ├─ Values: true, false (default)
   ├─ true: Use cloudflared tunnel (https://*.trycloudflare.com)
   └─ false: Use port exposure (https://uuid.domain)


CATEGORY: ROUTING & ZONES
├─ DISPATCH_NAMESPACE
│  ├─ Default: "vibesdk-default-namespace"
│  ├─ Effect: Workers for Platforms namespace
│  └─ Use: Deployed apps dispatcher

└─ ZONE_ID (in wrangler.jsonc routes)
   ├─ Example: "db01fac4261b2604aacad8410443a3e2"
   ├─ Effect: Cloudflare zone for *.domain routing
   └─ Use: Where DNS records are managed
```

---

## Error & Status Codes

```
BOOTSTRAP RESPONSE CODES
┌─────────────────────────────────────────────────────────────┐
│ Success                                                     │
├─────────────────────────────────────────────────────────────┤
│ {                                                           │
│   success: true,                                           │
│   runId: "i-abc123xyz",                                    │
│   previewURL: "https://...",                              │
│   tunnelURL: "https://...",                               │
│   processId: "proc-123",                                  │
│   message: "Successfully created instance..."            │
│ }                                                          │
└─────────────────────────────────────────────────────────────┘

X-PREVIEW-TYPE RESPONSE HEADERS
├─ sandbox
│  └─ Request succeeded, served from live dev server
├─ sandbox-error
│  └─ Sandbox returned HTTP 500 error
├─ dispatcher
│  └─ Request succeeded, served from deployed worker
└─ (not set)
   └─ Not a preview route (main platform)
```

