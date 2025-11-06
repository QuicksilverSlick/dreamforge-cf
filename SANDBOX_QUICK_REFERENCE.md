# Sandbox Configuration Quick Reference

## TL;DR - What You Need to Know

### Critical Settings for Sandboxes to Work
```bash
# In wrangler.jsonc vars section - MUST HAVE:
CUSTOM_DOMAIN=build.cloudflare.dev              # Main domain (REQUIRED)
CUSTOM_PREVIEW_DOMAIN=build-preview.cloudflare.dev  # Preview subdomain
MAX_SANDBOX_INSTANCES=10                         # Max parallel containers
SANDBOX_INSTANCE_TYPE=standard-3                 # Instance size (4vCPU/4GB/6GB)
```

### What Gets Created
When a user generates an app, vibesdk:
1. Allocates a port (8001-8999)
2. Starts a dev server (`bun run dev`)
3. Exposes port via Cloudflare sandbox binding
4. Returns preview URL: `https://i-{id}.{CUSTOM_PREVIEW_DOMAIN}`

### How Preview URLs Work
```
User browser request
    ↓
https://i-abc123.build-preview.cloudflare.dev/
    ↓
Worker routes to sandbox container
    ↓
Proxies to localhost:8042 (allocated port inside container)
    ↓
Dev server responds (Vite React app, etc.)
```

---

## Configuration Checklist

### Deployment
- [ ] `CUSTOM_DOMAIN` set in wrangler.jsonc vars
- [ ] `CUSTOM_PREVIEW_DOMAIN` set or will fallback to CUSTOM_DOMAIN
- [ ] DNS records exist: `*.domain` → Cloudflare
- [ ] Zone ID correct in wrangler.jsonc routes
- [ ] Container config in wrangler.jsonc with UserAppSandboxService

### Environment Variables
```bash
# Required
export CUSTOM_DOMAIN="build.cloudflare.dev"

# Recommended
export MAX_SANDBOX_INSTANCES="10"
export SANDBOX_INSTANCE_TYPE="standard-3"

# Optional
export ALLOCATION_STRATEGY="many_to_one"  # or "one_to_one"
export USE_TUNNEL_FOR_PREVIEW="false"     # Use cloudflared tunnel instead
export SANDBOX_SERVICE_TYPE="sdk"         # or "runner" for external service
```

### DNS Requirements
```bash
# Wildcard for preview domain - should exist and point to Cloudflare
*.build-preview.cloudflare.dev  A/CNAME  → Cloudflare nameservers

# Main domain - should exist and point to Cloudflare
build.cloudflare.dev  A/CNAME  → Cloudflare nameservers
```

---

## Key Facts

| Aspect | Detail |
|--------|--------|
| **Base Image** | `docker.io/cloudflare/sandbox:0.1.3` |
| **Dev Server** | Runs on allocated port 8001-8999 with `bun run dev` |
| **Port Exposure** | `sandbox.exposePort(port, {hostname})` returns https URL |
| **Storage** | Instance metadata stored in `{instanceId}-metadata.json` |
| **Allocation** | Hash-based distribution across containers (MANY_TO_ONE) or dedicated (ONE_TO_ONE) |
| **Max Per Instance** | 4 vCPU, 4096 MB RAM, 6144 MB disk |
| **Health Check** | Monitors dev server logs for "ready" patterns (Vite detection) |
| **Shutdown** | Kills process, unexposes port, deletes files |
| **Fallback** | If sandbox missing → tries dispatcher/permanent worker |
| **Response Header** | `X-Preview-Type: sandbox` or `dispatcher` or `sandbox-error` |

---

## Environment Variables Reference

### Sandbox Control
```
MAX_SANDBOX_INSTANCES=10              # Override wrangler.jsonc
SANDBOX_INSTANCE_TYPE=standard-3      # Override wrangler.jsonc
ALLOCATION_STRATEGY=many_to_one       # or one_to_one
```

### Service Selection
```
SANDBOX_SERVICE_TYPE=sdk              # Default: local SDK binding
                                      # Alternative: runner

SANDBOX_SERVICE_URL=...               # If using runner service
SANDBOX_SERVICE_API_KEY=...           # If using runner service
```

### Domain & Routing
```
CUSTOM_DOMAIN=build.cloudflare.dev    # Main platform domain (REQUIRED)
CUSTOM_PREVIEW_DOMAIN=...             # Preview domain (fallback to CUSTOM_DOMAIN)
USE_TUNNEL_FOR_PREVIEW=false          # Use cloudflared tunnel instead of port exposure
DISPATCH_NAMESPACE=...                # Workers for Platforms namespace
```

---

## Troubleshooting Quick Guide

### Preview URL Returns 404
**Check:**
```bash
# 1. Is CUSTOM_DOMAIN set?
env.CUSTOM_DOMAIN  # Should NOT be empty

# 2. Check response header
curl -I https://i-abc.build-preview.dev/
# Look for: X-Preview-Type: sandbox (good)
#           X-Preview-Type: dispatcher (app deployed, not in sandbox)
#           Missing header (wrong domain)

# 3. Check instance status
sandboxService.getInstanceStatus(instanceId)
# isHealthy: true (process running)
# previewURL: should have value
```

### Dev Server Crashes
**Check:**
```bash
# Get instance logs
sandboxService.getLogs(instanceId)
# Look for error messages in stdout/stderr

# Check process health
getProcess(processId).status === 'running'

# Common causes:
# - Port already in use (rare, port allocation should handle)
# - Dependencies not installed (bun install failed)
# - Template corrupted
```

### Port Allocation Fails
**Cause:** Range 8001-8999 exhausted  
**Solution:** Reduce MAX_SANDBOX_INSTANCES or shutdown unused instances

### Wildcard DNS Not Working
**Check:**
```bash
# Does DNS resolve?
dig *.build-preview.cloudflare.dev

# Should resolve to Cloudflare nameservers
# If not, add DNS record in zone
```

---

## Key Code Locations

| Purpose | File | Lines |
|---------|------|-------|
| Main routing | `worker/index.ts` | 1-178 |
| Sandbox SDK | `worker/services/sandbox/sandboxSdkClient.ts` | 1-1800+ |
| Instance setup | `worker/services/sandbox/sandboxSdkClient.ts` | 852-939 |
| Port exposure | `worker/services/sandbox/sandboxSdkClient.ts` | 909 |
| Preview domain | `worker/utils/urls.ts` | 8-13 |
| Container config | `wrangler.jsonc` | 58-72 |
| Routes config | `wrangler.jsonc` | 131-141 |
| Sandbox Dockerfile | `SandboxDockerfile` | 1-56 |

---

## Response Headers & Types

### Success Responses

**Sandbox (Live):**
```
HTTP/1.1 200 OK
X-Preview-Type: sandbox
X-Powered-By: Cloudflare-Sandbox
```

**Dispatcher (Deployed):**
```
HTTP/1.1 200 OK
X-Preview-Type: dispatcher
X-Powered-By: Workers-for-Platforms
```

**Sandbox Error:**
```
HTTP/1.1 500 Internal Server Error
X-Preview-Type: sandbox-error
```

### Bootstrap Response (Creating Instance)
```json
{
  "success": true,
  "runId": "i-abc123xyz",
  "previewURL": "https://i-abc123xyz.build-preview.cloudflare.dev",
  "tunnelURL": "https://example-tunnel.trycloudflare.com",
  "processId": "proc-123",
  "message": "Successfully created instance from template react"
}
```

---

## Performance Guidelines

### Realistic Concurrency
- **Max instances:** 10 containers
- **Ports per container:** ~999 (8001-8999)
- **Theoretical max:** 9,990 concurrent apps
- **Practical:** 1-2 apps per container = 10-20 concurrent

### Resource Limits Per Sandbox
- vCPU: 4 cores
- Memory: 4 GB
- Disk: 6 GB
- CPU Throttle: Fair-share across container pool

### Optimization Tips
- Use MANY_TO_ONE allocation for efficiency
- Monitor instance uptime, shutdown unused
- Cache metadata in memory (already done in SandboxSdkClient)
- Use KV storage for wrangler.jsonc persistence

---

## Debugging Commands

### Check Instance Health
```typescript
const status = await sandboxService.getInstanceStatus(instanceId);
console.log(status.isHealthy);  // true = process running
console.log(status.previewURL); // Should have URL
```

### Get Instance Logs
```typescript
const logs = await sandboxService.getLogs(instanceId);
console.log(logs.logs.stdout);  // Dev server output
console.log(logs.logs.stderr);  // Error output
```

### List All Instances
```typescript
const instances = await sandboxService.listAllInstances();
instances.instances.forEach(inst => {
  console.log(inst.runId, inst.previewURL, inst.uptime);
});
```

### Check Port Availability
```typescript
// Manually test (inside sandbox)
netstat -tuln | grep 8042
ss -tuln | grep 8042
```

---

## Common Issues & Solutions

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| "Application not available" | CUSTOM_DOMAIN empty | Set CUSTOM_DOMAIN env var |
| Preview loads but 404 | Dev server not listening | Check getLogs() for errors |
| Port allocation fails | 8001-8999 exhausted | Shutdown instances or reduce MAX_SANDBOX_INSTANCES |
| Metadata not found | Instance corrupted | Recreate instance |
| DNS resolution fails | Zone not configured | Add wildcard DNS record |
| Tunnel URL doesn't work | cloudflared not running | Set USE_TUNNEL_FOR_PREVIEW only if needed |
| High latency | Over-provisioned | Reduce MAX_SANDBOX_INSTANCES or use ONE_TO_ONE |

---

## Deployment Checklist

Before going live with sandboxes:

- [ ] Wrangler.jsonc has containers section configured
- [ ] CUSTOM_DOMAIN environment variable is set
- [ ] CUSTOM_PREVIEW_DOMAIN is set or you accept fallback
- [ ] DNS records exist and point to Cloudflare
- [ ] Zone ID in routes config is correct
- [ ] Routes config includes pattern for `*.domain/*`
- [ ] SandboxDockerfile exists and builds successfully
- [ ] env.Sandbox binding defined in durable_objects
- [ ] workers_dev = false in wrangler.jsonc
- [ ] preview_urls = false in wrangler.jsonc
- [ ] MAX_SANDBOX_INSTANCES set appropriately for your capacity
- [ ] Tested instance creation → port exposure → preview load

