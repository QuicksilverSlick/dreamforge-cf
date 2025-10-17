# Configuration Side-by-Side Comparison

## wrangler.jsonc - Key Sections

| Configuration | vibesdk (upstream) | DreamForge (current) | Status |
|---|---|---|---|
| **compatibility_date** | 2025-08-10 | 2025-10-14 | ✓ OK (newer is good) |
| **assets.directory** | dist | dist/client | ⚠ Check build output |
| **assets.run_worker_first** | true | true | ✓ MATCH |
| **observability.enabled** | true | true | ✓ MATCH |
| **containers[0].max_instances** | 2900 | 10 | ℹ Different scale |
| **containers[0].instance_type** | {vcpu:4, memory_mib:4096, disk_mb:6144} | "standard-3" | ❌ **CRITICAL** |
| **dispatch_namespaces[0].remote** | true | - | ❌ **CRITICAL** |
| **dispatch_namespaces[0].experimental_remote** | - | true | ❌ **CRITICAL** |
| **d1_databases[0].remote** | true | true | ✓ MATCH |
| **workers_dev** | false | true | ℹ Different deployment mode |

---

## Environment Variables (vars section)

| Variable | vibesdk | DreamForge | Issue |
|---|---|---|---|
| TEMPLATES_REPOSITORY | vibesdk-templates | vibesdk-templates | ✓ MATCH |
| ALLOWED_EMAIL | "" | "" | ✓ MATCH |
| **DISPATCH_NAMESPACE** | vibesdk-default-namespace | "" | ❌ **CRITICAL** - Empty! |
| ENABLE_READ_REPLICAS | true | true | ✓ MATCH |
| CUSTOM_DOMAIN | "" | app.getdreamforge.com | ℹ Custom domain set in DF |
| MAX_SANDBOX_INSTANCES | 10 | 10 | ✓ MATCH |
| SANDBOX_INSTANCE_TYPE | standard-3 | standard-3 | ✓ MATCH (but likely invalid) |
| CLOUDFLARE_AI_GATEWAY | vibesdk-gateway | vibesdk-gateway | ✓ MATCH |
| USE_CLOUDFLARE_IMAGES | false | false | ✓ MATCH |

---

## Bindings & Resources

| Resource | vibesdk | DreamForge | Match |
|---|---|---|---|
| AI binding | ✓ | ✓ | ✓ |
| Dispatch Namespaces | 1 | 1 | ✓ |
| Containers | 1 | 1 | ✓ |
| D1 Databases | 1 | 1 | ✓ |
| R2 Buckets | 1 | 1 | ✓ |
| KV Namespaces | 1 | 1 | ✓ |
| Durable Objects | 3 classes | 3 classes | ✓ |

---

## Routes Configuration

| Route | vibesdk | DreamForge |
|---|---|---|
| Custom Domain 1 | build.cloudflare.dev | app.getdreamforge.com |
| Custom Domain 2 | *build-preview.cloudflare.dev/* | *preview.getdreamforge.com/* |

**Note:** vibesdk uses Cloudflare's internal domains, DreamForge uses custom domains

---

## GitHub Actions (CI/CD)

| Aspect | vibesdk | DreamForge | Status |
|---|---|---|---|
| **CI Workflow** | ci.yml | ci.yml | ✓ IDENTICAL |
| **Deploy Workflow** | None (manual) | deploy.yml | ✓ DreamForge has automation |
| **Triggers** | Push to all branches, PR to main | Same | ✓ MATCH |
| **Runtime** | ubuntu-latest | ubuntu-latest | ✓ MATCH |
| **Package Manager** | bun | bun | ✓ MATCH |
| **Build Command** | bun run build | bun run build | ✓ MATCH |
| **Deploy Command** | npm run deploy | npm run deploy | ✓ MATCH |

---

## Dockerfile Comparison (SandboxDockerfile)

Both files are **BYTE-IDENTICAL**:
- Base image: `docker.io/cloudflare/sandbox:0.1.3`
- Dependencies: git, ca-certificates, curl, procps, net-tools
- Monitoring system setup
- Package cache initialization
- Same environment variables

---

## Root Cause Summary

### Critical Issues (Blocking Deployment)

1. **Container Instance Type Configuration**
   - **vibesdk**: Explicit vCPU/memory/disk spec
   - **DreamForge**: String identifier "standard-3"
   - **Impact**: Production Cloudflare likely rejects the string format

2. **Dispatch Namespace Mode**
   - **vibesdk**: `"remote": true` (stable)
   - **DreamForge**: `"experimental_remote": true` (unstable)
   - **Impact**: Experimental features may not work or be deprecated

3. **DISPATCH_NAMESPACE Variable**
   - **vibesdk**: Set to "vibesdk-default-namespace"
   - **DreamForge**: Set to empty string ""
   - **Impact**: Workers for Platforms dispatch operations fail

### Minor Issues (May Cause Problems)

4. **Assets Directory Path**
   - **vibesdk**: `dist/`
   - **DreamForge**: `dist/client/`
   - **Impact**: Asset serving may fail if build doesn't create this directory

### Configuration Differences (Not Issues)

5. **Max Instances & Custom Domains**
   - DreamForge uses development settings, vibesdk uses production scale
   - This is expected and not a problem

