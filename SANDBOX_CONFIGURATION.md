# Cloudflare Vibesdk Sandbox & Preview Configuration Analysis

## Executive Summary
The vibesdk system uses **Cloudflare Sandbox containers** (Durable Objects) to provide live development environments for generated web applications. Previews are exposed via Cloudflare's port exposure mechanism and routed through subdomain-based request handling.

---

## 1. SANDBOX CONTAINER CONFIGURATION

### 1.1 Wrangler Configuration (wrangler.jsonc)

The core sandbox setup is defined in the `containers` section:

```jsonc
"containers": [
    {
        "class_name": "UserAppSandboxService",
        "image": "./SandboxDockerfile",
        // Alternative: "image": "registry.cloudflare.com/vibesdk-production-userappsandboxservice:cfe197fc",
        
        // Max instances - overridden by env var MAX_SANDBOX_INSTANCES
        "max_instances": 2900,
        
        // Instance sizing - overridden by env var SANDBOX_INSTANCE_TYPE
        "instance_type": {
            "vcpu": 4,
            "memory_mib": 4096,
            "disk_mb": 6144
        },
        "rollout_step_percentage": 100
    }
]
```

**Key Points:**
- `class_name` = "UserAppSandboxService" - The Durable Object class that runs in containers
- `image` points to SandboxDockerfile OR a pre-built registry image
- Env vars **override** wrangler config values
- Standard instance size: 4 vCPU, 4GB RAM, 6GB disk

### 1.2 Durable Objects Bindings

```jsonc
"durable_objects": {
    "bindings": [
        {
            "class_name": "UserAppSandboxService",
            "name": "Sandbox"
        }
    ]
}
```

**Purpose:** Provides the `env.Sandbox` binding for allocating sandbox instances

### 1.3 SandboxDockerfile

The container image is built from `./SandboxDockerfile`:

```dockerfile
FROM docker.io/cloudflare/sandbox:0.1.3

# System dependencies
RUN apt-get install -y git curl cloudflared
RUN git config --global user.email "vibesdk-bot@cloudflare.com"

# Copy error monitoring system
COPY container/ /app/container/
RUN bun install && bun run build

# Setup packages cache for templates
ENV BUN_INSTALL_CACHE_DIR=/app/container/packages-cache
RUN bun install

# Environment & logging
ENV CONTAINER_ENV=docker
ENV VITE_LOGGER_TYPE=json

WORKDIR /app
EXPOSE 3000
CMD ["bun", "index.ts"]
```

**Key Components:**
- Base: `cloudflare/sandbox:0.1.3`
- Installs: git, curl, cloudflared (for tunnels)
- Includes: process monitoring system, package cache
- Logger: JSON-formatted for structured logging

---

## 2. ENVIRONMENT VARIABLES FOR SANDBOXES

### 2.1 Sandbox Control Variables

**In wrangler.jsonc vars section:**

```jsonc
"vars": {
    "MAX_SANDBOX_INSTANCES": "10",           // Max simultaneous sandboxes
    "SANDBOX_INSTANCE_TYPE": "standard-3",   // Instance size profile
    "CUSTOM_DOMAIN": "",                      // Main domain (e.g., build.cloudflare.dev)
    "CUSTOM_PREVIEW_DOMAIN": "",              // Preview domain (e.g., build-preview.cloudflare.dev)
    "ALLOCATION_STRATEGY": "many_to_one|one_to_one",  // Container allocation
    "USE_TUNNEL_FOR_PREVIEW": false,          // Use cloudflared tunnel instead of port exposure
}
```

### 2.2 Allocation Strategy

From `sandboxSdkClient.ts` line 83-106:

```typescript
enum AllocationStrategy {
    MANY_TO_ONE = 'many_to_one',    // Multiple users share containers
    ONE_TO_ONE = 'one_to_one'       // Each session gets dedicated container
}
```

- **MANY_TO_ONE**: Sessions distributed via hash across MAX_SANDBOX_INSTANCES containers
- **ONE_TO_ONE**: Each session maps to dedicated container (checks for conflicts)

### 2.3 Runner Service vs. SDK Service

**Environment Variable:** `SANDBOX_SERVICE_TYPE`

```typescript
// factory.ts
if (env.SANDBOX_SERVICE_TYPE == 'runner') {
    return new RemoteSandboxServiceClient(sessionId);  // External runner service
} else {
    return new SandboxSdkClient(sessionId, agentId);   // Local sandbox SDK
}
```

**Configuration for Runner Service (Remote):**
```
SANDBOX_SERVICE_TYPE=runner
SANDBOX_SERVICE_URL=https://runner-service.example.com
SANDBOX_SERVICE_API_KEY=<auth-token>
```

**Configuration for SDK Service (Local/Native):**
```
SANDBOX_SERVICE_TYPE=sdk (or omitted - defaults to SDK)
# Uses env.Sandbox binding directly
```

---

## 3. PREVIEW URL GENERATION & EXPOSURE

### 3.1 Port Allocation & Exposure

**Location:** `sandboxSdkClient.ts` lines 852-926

```typescript
private async setupInstance(
    instanceId: string, 
    projectName: string, 
    localEnvVars?: Record<string, string>
): Promise<{previewURL: string, tunnelURL: string, processId: string, allocatedPort: number}> {
    
    // 1. Allocate available port (8001-8999)
    const allocatedPort = await this.allocateAvailablePort();
    
    // 2. Start dev server on that port
    const processId = await this.startDevServer(instanceId, allocatedPort);
    
    // 3. Expose port to internet
    const previewResult = await sandbox.exposePort(allocatedPort, { 
        hostname: getPreviewDomain(env) 
    });
    
    let previewURL = previewResult.url;
    
    // 4. Optional: Replace domain if needed
    if (!isDev(env)) {
        const previewDomain = getPreviewDomain(env);
        previewURL = previewURL.replace(env.CUSTOM_DOMAIN, previewDomain);
    }
    
    return { previewURL, tunnelURL, processId, allocatedPort };
}
```

**Key Steps:**
1. Find available port in range **8001-8999**
2. Start dev server (Vite) on that port
3. Call `sandbox.exposePort(port, {hostname})`
4. Receive preview URL (format: `https://<subdomain>.<hostname>`)

### 3.2 Preview URL Construction

From `worker/utils/urls.ts`:

```typescript
export function getPreviewDomain(env: Env): string {
    if (env.CUSTOM_PREVIEW_DOMAIN && env.CUSTOM_PREVIEW_DOMAIN.trim() !== '') {
        return env.CUSTOM_PREVIEW_DOMAIN;  // e.g., "build-preview.cloudflare.dev"
    }
    return env.CUSTOM_DOMAIN;              // e.g., "build.cloudflare.dev"
}

export function buildUserWorkerUrl(env: Env, deploymentId: string): string {
    const domain = getPreviewDomain(env);
    const protocol = getProtocolForHost(domain);
    return `${protocol}://${deploymentId}.${domain}`;
}
```

**Example URLs:**
- Sandbox preview: `https://i-abc123xyz.build-preview.cloudflare.dev` (port exposed)
- Deployed worker: `https://my-app.build.cloudflare.dev` (dispatched to Workers namespace)

### 3.3 Cloudflared Tunnel Alternative

If `USE_TUNNEL_FOR_PREVIEW=true`:

```typescript
private async startCloudflaredTunnel(instanceId: string, port: number): Promise<string> {
    const process = await this.getSandbox().startProcess(
        `cloudflared tunnel --url http://localhost:${port}`, 
        { cwd: instanceId }
    );
    
    // Parse logs for tunnel URL format: https://*.trycloudflare.com
    const logStream = await this.getSandbox().streamProcessLogs(process.id);
    
    // Resolve with URL matching: https://[a-z0-9-]+\.trycloudflare\.com
    return <tunnel_url>;  // e.g., https://abc-def-ghi.trycloudflare.com
}
```

---

## 4. ROUTE CONFIGURATION & REQUEST ROUTING

### 4.1 Wrangler Routes

```jsonc
"routes": [
    {
        "pattern": "build.cloudflare.dev",
        "custom_domain": true
    },
    {
        "pattern": "*build-preview.cloudflare.dev/*",
        "custom_domain": false,
        "zone_id": "db01fac4261b2604aacad8410443a3e2"
    }
]
```

**Routing Logic:**
- Main domain (`build.cloudflare.dev`): API & platform
- Preview subdomain (`*build-preview.cloudflare.dev`): User apps

### 4.2 Worker Request Routing (index.ts)

```typescript
async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const { hostname, pathname } = url;
    
    // Extract preview domain from env
    const previewDomain = getPreviewDomain(env);
    
    // Route 1: Main domain requests
    const isMainDomainRequest = 
        hostname === env.CUSTOM_DOMAIN || hostname === 'localhost';
    
    if (isMainDomainRequest) {
        if (!pathname.startsWith('/api/')) {
            return env.ASSETS.fetch(request);  // Static assets
        }
        return createApp(env).fetch(request, env, ctx);  // API
    }
    
    // Route 2: Subdomain requests (user apps)
    const isSubdomainRequest = hostname.endsWith(`.${previewDomain}`);
    
    if (isSubdomainRequest) {
        // 2a. Try live sandbox first
        const sandboxResponse = await proxyToSandbox(request, env);
        if (sandboxResponse) {
            headers.set('X-Preview-Type', 'sandbox');
            return response;  // Sandbox request succeeded
        }
        
        // 2b. Fall back to deployed worker via dispatcher
        const appName = hostname.split('.')[0];
        const worker = env['DISPATCHER'].get(appName);
        const dispatcherResponse = await worker.fetch(request);
        headers.set('X-Preview-Type', 'dispatcher');
        return response;  // Dispatcher request
    }
}
```

**Request Flow:**
1. Request arrives at `xyz.build-preview.cloudflare.dev`
2. Worker extracts hostname `xyz`
3. Calls `proxyToSandbox()` → routes to live sandbox container
4. If no sandbox (not running), dispatches to permanent worker via namespace
5. Both responses include `X-Preview-Type` header

---

## 5. SANDBOX INSTANCE LIFECYCLE

### 5.1 Instance Creation

From `sandboxSdkClient.ts` createInstance():

```
1. Check allocation strategy (many_to_one vs. one_to_one)
2. Ensure template exists (download if needed)
3. Generate instance ID: i-{randomId}
4. Move template to instance directory
5. Setup instance:
   a. Update package.json and wrangler.jsonc with project name
   b. Provision Cloudflare resources (D1, KV, etc.)
   c. Store wrangler config in KV for later retrieval
   d. Allocate available port
   e. Start dev server process (bun run dev)
   f. Expose port via sandbox.exposePort()
   g. Store metadata (previewURL, processId, etc.)
6. Return bootstrap response with preview URL
```

### 5.2 Instance Metadata Storage

Stored in sandbox filesystem as `{instanceId}-metadata.json`:

```typescript
interface InstanceMetadata {
    templateName: string;
    projectName: string;
    startTime: string;                // ISO timestamp
    webhookUrl?: string;
    previewURL?: string;              // e.g., https://i-abc.build-preview.dev
    tunnelURL?: string;               // e.g., https://xyz.trycloudflare.com
    processId?: string;               // Dev server process ID
    allocatedPort?: number;           // Port number (8001-8999)
    donttouch_files: string[];        // Files protected from modification
    redacted_files: string[];         // Files not sent to frontend
}
```

Cached in memory for fast access: `metadataCache: Map<string, InstanceMetadata>`

### 5.3 Instance Shutdown

```typescript
async shutdownInstance(instanceId: string): Promise<ShutdownResponse> {
    // 1. Kill dev server process
    await sandbox.killProcess(metadata.processId);
    
    // 2. Unexpose the port
    await sandbox.unexposePort(metadata.allocatedPort);
    
    // 3. Clean up files
    await sandbox.exec(`rm -rf /app/${instanceId}`);
    
    // 4. Invalidate metadata cache
    this.invalidateMetadataCache(instanceId);
}
```

---

## 6. CRITICAL CONFIGURATION REQUIREMENTS

### 6.1 For Sandboxes to Work

**Must Have:**
1. ✅ `CUSTOM_DOMAIN` environment variable set
2. ✅ `CUSTOM_PREVIEW_DOMAIN` or fallback to CUSTOM_DOMAIN
3. ✅ DNS routing for `*.{domain}` → Cloudflare
4. ✅ Routes configured in wrangler.jsonc
5. ✅ Container configuration with proper instance sizes
6. ✅ Durable Object binding: `env.Sandbox`

**Check:**
```bash
# Verify CUSTOM_DOMAIN is not empty
env.CUSTOM_DOMAIN !== '' && env.CUSTOM_DOMAIN !== undefined

# Verify preview domain resolves
getPreviewDomain(env) // Should return non-empty string
```

### 6.2 For Preview URLs to Load

**Checklist:**
- [ ] Port exposure successful (`sandbox.exposePort()` returns URL)
- [ ] Dev server started and listening (`bun run dev` on port 8001-8999)
- [ ] Process is running (`getProcess(processId).status === 'running'`)
- [ ] Hostname DNS points to Cloudflare
- [ ] Zone ID correct in routes config
- [ ] No rate limiting blocking requests

### 6.3 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Application not available" | CUSTOM_DOMAIN not set | Set env var in wrangler or dashboard |
| Preview URL returns 404 | proxyToSandbox failing | Check X-Preview-Type header; verify sandbox running |
| Port allocation fails | Range 8001-8999 exhausted | Reduce MAX_SANDBOX_INSTANCES or increase range |
| Preview URL loads but app fails | Dev server crashed | Check instance logs via getLogs() |
| Tunnel URL doesn't work | cloudflared not running | Enable USE_TUNNEL_FOR_PREVIEW only if needed |

---

## 7. SANDBOX COMMUNICATION LAYER

### 7.1 Service Interface (BaseSandboxService)

All sandbox operations go through abstraction:

```typescript
abstract class BaseSandboxService {
    abstract createInstance(templateName, projectName, webhookUrl?, envVars?): Promise<BootstrapResponse>;
    abstract getInstanceStatus(instanceId): Promise<BootstrapStatusResponse>;
    abstract writeFiles(instanceId, files, commitMessage?): Promise<WriteFilesResponse>;
    abstract executeCommands(instanceId, commands, timeout?): Promise<ExecuteCommandsResponse>;
    abstract getInstanceErrors(instanceId): Promise<RuntimeErrorResponse>;
    abstract runStaticAnalysisCode(instanceId, lintFiles?): Promise<StaticAnalysisResponse>;
    abstract deployToCloudflareWorkers(instanceId): Promise<DeploymentResult>;
    abstract shutdownInstance(instanceId): Promise<ShutdownResponse>;
}
```

### 7.2 Two Implementation Strategies

**Strategy 1: Local Sandbox SDK** (Default)
- Direct access to `env.Sandbox` Durable Object binding
- Uses `@cloudflare/sandbox` package
- Methods: `exec()`, `readFile()`, `writeFile()`, `exposePort()`, `startProcess()`

**Strategy 2: Remote Runner Service**
- HTTP requests to external runner service
- Uses headers: `Authorization: Bearer {token}`, `x-session-id: {id}`
- Identical API interface
- For distributed or managed setups

---

## 8. PERFORMANCE & SCALING

### 8.1 Instance Allocation Strategy

**Distribution Algorithm:**
```typescript
function getAutoAllocatedSandbox(sessionId: string): string {
    let hash = 0;
    for (let i = 0; i < sessionId.length; i++) {
        hash = ((hash << 5) - hash) + sessionId.charCodeAt(i);
    }
    hash = Math.abs(hash & 0xFFFFFFFF);
    
    const containerIndex = hash % MAX_SANDBOX_INSTANCES;
    return `container-pool-${containerIndex}`;
}
```

- Deterministic: Same session ID always maps to same container
- Consistent hashing: Rebalances gracefully if instances scale

### 8.2 Resource Limits

**Per Instance:**
- vCPU: 4
- Memory: 4096 MB
- Disk: 6144 MB (6 GB)
- Port Range: 8001-8999 (≈999 ports)

**System:**
- Max instances: Configured via `MAX_SANDBOX_INSTANCES` (default 10)
- Max theoretical concurrent: 10 × 999 ports = 9,990 concurrent apps

---

## 9. DEPLOYMENT CONFIGURATION

### 9.1 Required Wrangler.jsonc Settings

```jsonc
{
    "name": "vibesdk-production",
    "compatibility_date": "2025-08-10",
    "compatibility_flags": ["nodejs_compat"],
    
    "containers": [{
        "class_name": "UserAppSandboxService",
        "image": "./SandboxDockerfile",
        "max_instances": 2900,
        "instance_type": {
            "vcpu": 4,
            "memory_mib": 4096,
            "disk_mb": 6144
        }
    }],
    
    "durable_objects": {
        "bindings": [{
            "class_name": "UserAppSandboxService",
            "name": "Sandbox"
        }]
    },
    
    "routes": [
        {
            "pattern": "build.cloudflare.dev",
            "custom_domain": true
        },
        {
            "pattern": "*build-preview.cloudflare.dev/*",
            "custom_domain": false,
            "zone_id": "db01fac4261b2604aacad8410443a3e2"
        }
    ],
    
    "vars": {
        "CUSTOM_DOMAIN": "build.cloudflare.dev",
        "CUSTOM_PREVIEW_DOMAIN": "build-preview.cloudflare.dev",
        "MAX_SANDBOX_INSTANCES": "10",
        "SANDBOX_INSTANCE_TYPE": "standard-3"
    },
    
    "workers_dev": false,
    "preview_urls": false
}
```

### 9.2 Deploy Script Integration

From `scripts/deploy.ts`:

```typescript
// Automatically updates container config based on env vars
if (process.env.MAX_SANDBOX_INSTANCES) {
    // Updates wrangler.jsonc containers[0].max_instances
}

if (process.env.SANDBOX_INSTANCE_TYPE) {
    // Updates instance_type (vcpu, memory_mib, disk_mb)
}
```

---

## 10. KEY FILES REFERENCE

| File | Purpose |
|------|---------|
| `wrangler.jsonc` | Container, route, and variable configuration |
| `SandboxDockerfile` | Container image definition |
| `worker/services/sandbox/sandboxSdkClient.ts` | Core sandbox SDK implementation (1,800 lines) |
| `worker/services/sandbox/remoteSandboxService.ts` | Remote runner service client |
| `worker/services/sandbox/factory.ts` | Service selection (SDK vs. Runner) |
| `worker/index.ts` | Main request routing & sandbox proxy |
| `worker/utils/urls.ts` | Preview domain and URL construction |
| `container/cli-tools.ts` | Container monitoring system |
| `worker/services/sandbox/sandboxTypes.ts` | TypeScript schemas (Zod) |

---

## 11. TROUBLESHOOTING FLOW

```
Preview URL not loading?
├─ Check X-Preview-Type header
│  ├─ "sandbox" → Dev server crashed or not listening
│  │  └─ Call getLogs() to see dev server output
│  └─ "dispatcher" → Permanent worker, not sandbox
│     └─ App was deployed, sandbox already shutdown
├─ Check instance status
│  └─ getInstanceStatus(instanceId).isHealthy
├─ Verify port exposed
│  └─ sandbox.exposePort() returned valid URL?
└─ Check hostname DNS
   └─ Does *.build-preview.cloudflare.dev resolve?
```

---

## Summary

Vibesdk's sandbox & preview system is a sophisticated multi-layer architecture:

1. **Containers**: Durable Objects with 4vCPU/4GB RAM per instance
2. **Ports**: Dynamically allocated (8001-8999) and exposed via Cloudflare
3. **URLs**: Generated via DNS wildcards (`*.build-preview.cloudflare.dev`)
4. **Routing**: Smart fallback from live sandbox → permanent deployed worker
5. **Scale**: Consistent hashing across configurable pool of containers
6. **Flexibility**: Supports both local SDK and remote runner service implementations

Critical config: **CUSTOM_DOMAIN** must be set for entire system to function.

