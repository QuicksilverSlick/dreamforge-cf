# Cloudflare Vibesdk Sandbox Documentation Index

This directory contains comprehensive documentation of the Cloudflare Vibesdk sandbox and preview system configuration.

## Documents Overview

### 1. SANDBOX_CONFIGURATION.md
**Purpose:** Comprehensive technical reference for sandbox architecture and configuration

**Contents:**
- Executive summary of the sandbox system
- Container configuration (wrangler.jsonc)
- Environment variables reference
- Preview URL generation and exposure mechanism
- Route configuration and request routing
- Sandbox instance lifecycle
- Critical configuration requirements
- Communication layer (BaseSandboxService)
- Performance and scaling analysis
- Deployment configuration
- Troubleshooting flow

**When to use:** When you need detailed understanding of how sandboxes work, configuration requirements, or need to troubleshoot issues

**Length:** ~11 sections, 300+ lines

---

### 2. SANDBOX_ARCHITECTURE_DIAGRAM.md
**Purpose:** Visual representation of sandbox system architecture and flows

**Contents:**
- System architecture overview (ASCII diagram)
- Sandbox container lifecycle (flowchart)
- Preview URL resolution flow
- Container instance configuration details
- Data flow for file updates
- Request routing decision tree
- Environment variables with visual layout
- Error and status codes

**When to use:** When you want to understand the system visually or need to explain to others

**Length:** ~8 major diagrams with explanations

---

### 3. SANDBOX_QUICK_REFERENCE.md
**Purpose:** Quick lookup guide for developers and operators

**Contents:**
- TL;DR critical settings
- Configuration checklist
- Key facts table
- Environment variables quick reference
- Troubleshooting quick guide
- Key code locations
- Response headers and types
- Performance guidelines
- Debugging commands
- Common issues and solutions
- Deployment checklist

**When to use:** For quick lookups, deployment, troubleshooting, or as a cheat sheet

**Length:** ~15 quick reference sections

---

## Critical Information at a Glance

### What Makes Sandboxes Work

1. **CUSTOM_DOMAIN** environment variable MUST be set
2. DNS wildcards (`*.domain`) pointing to Cloudflare
3. Container configuration in wrangler.jsonc
4. Durable Object binding: `env.Sandbox`
5. Routes configuration for subdomain patterns

### How Preview URLs Work

```
User generates app
    ↓
Sandbox allocates port 8001-8999
    ↓
Dev server starts (bun run dev)
    ↓
Port exposed via sandbox.exposePort()
    ↓
Preview URL returned: https://i-{id}.{domain}
    ↓
Browser request → Worker → proxyToSandbox() → localhost:port
```

### Key Configuration

```jsonc
// wrangler.jsonc
"containers": [{
    "class_name": "UserAppSandboxService",
    "image": "./SandboxDockerfile",
    "max_instances": 2900,
    "instance_type": {
        "vcpu": 4,
        "memory_mib": 4096,
        "disk_mb": 6144
    }
}]

"routes": [
    {
        "pattern": "build.cloudflare.dev",
        "custom_domain": true
    },
    {
        "pattern": "*build-preview.cloudflare.dev/*",
        "custom_domain": false,
        "zone_id": "..."
    }
]

"vars": {
    "CUSTOM_DOMAIN": "build.cloudflare.dev",
    "CUSTOM_PREVIEW_DOMAIN": "build-preview.cloudflare.dev",
    "MAX_SANDBOX_INSTANCES": "10",
    "SANDBOX_INSTANCE_TYPE": "standard-3"
}
```

---

## Quick Navigation

### I need to...

**Understand the overall architecture**
→ Read: SANDBOX_ARCHITECTURE_DIAGRAM.md (System Architecture Overview)

**Deploy sandboxes**
→ Read: SANDBOX_QUICK_REFERENCE.md (Deployment Checklist)

**Debug why previews aren't loading**
→ Read: SANDBOX_QUICK_REFERENCE.md (Troubleshooting Quick Guide)

**Understand how preview URLs are generated**
→ Read: SANDBOX_CONFIGURATION.md (Section 3: Preview URL Generation)

**Understand request routing**
→ Read: SANDBOX_ARCHITECTURE_DIAGRAM.md (Request Routing Decision Tree)

**Find configuration options**
→ Read: SANDBOX_QUICK_REFERENCE.md (Environment Variables Reference) or SANDBOX_CONFIGURATION.md (Section 2: Environment Variables)

**Scale the system**
→ Read: SANDBOX_CONFIGURATION.md (Section 8: Performance & Scaling)

**Understand instance lifecycle**
→ Read: SANDBOX_ARCHITECTURE_DIAGRAM.md (Sandbox Container Lifecycle) or SANDBOX_CONFIGURATION.md (Section 5)

**Troubleshoot common issues**
→ Read: SANDBOX_QUICK_REFERENCE.md (Common Issues & Solutions)

**Understand the codebase**
→ Read: SANDBOX_QUICK_REFERENCE.md (Key Code Locations) + SANDBOX_CONFIGURATION.md (Section 10: Key Files Reference)

---

## Key Facts Summary

| Aspect | Detail |
|--------|--------|
| **Container Base** | docker.io/cloudflare/sandbox:0.1.3 |
| **Dev Server** | bun run dev on allocated port (8001-8999) |
| **Port Range** | 8001-8999 (≈999 ports) |
| **Max Per Sandbox** | 4 vCPU, 4GB RAM, 6GB disk |
| **Instance Count** | Configurable, default 10 |
| **Allocation** | Hash-based (MANY_TO_ONE) or Dedicated (ONE_TO_ONE) |
| **URL Format** | https://i-{id}.{CUSTOM_PREVIEW_DOMAIN} |
| **Health Status** | X-Preview-Type response header |
| **Fallback** | Dispatcher → Permanent deployed worker |
| **DNS** | Wildcard required: *.{domain} |

---

## Architecture Highlights

### Three-Layer Stack

1. **Edge Layer (Cloudflare)**
   - DNS routing for *.domain
   - Worker processes requests
   - Smart proxy to sandbox or dispatcher

2. **Container Layer (Sandbox DO)**
   - Manages instance lifecycle
   - Allocates ports and processes
   - Stores instance metadata

3. **App Layer (Dev Server)**
   - Bun/Vite dev server
   - Runs user's generated code
   - Responds to requests via exposed port

### Request Paths

**Path 1: Live Sandbox (Priority)**
```
Request → Worker → proxyToSandbox() → 
Container Port Mapping → Dev Server → App Response
Header: X-Preview-Type: sandbox
```

**Path 2: Fallback to Deployed Worker**
```
Request → Worker → Sandbox Miss → 
Dispatcher Namespace → Deployed Worker → App Response
Header: X-Preview-Type: dispatcher
```

---

## Environment Variables Quick Reference

### Critical
- `CUSTOM_DOMAIN` - Main platform domain (REQUIRED)

### Sandbox Control
- `MAX_SANDBOX_INSTANCES` - Number of concurrent containers (default: 10)
- `SANDBOX_INSTANCE_TYPE` - Instance size (default: standard-3)
- `ALLOCATION_STRATEGY` - many_to_one or one_to_one (default: many_to_one)

### Service Selection
- `SANDBOX_SERVICE_TYPE` - sdk or runner (default: sdk)
- `SANDBOX_SERVICE_URL` - If using runner service
- `SANDBOX_SERVICE_API_KEY` - Authentication for runner service

### Domain & Preview
- `CUSTOM_PREVIEW_DOMAIN` - Preview subdomain (fallback: CUSTOM_DOMAIN)
- `USE_TUNNEL_FOR_PREVIEW` - Use cloudflared tunnel (default: false)
- `DISPATCH_NAMESPACE` - Workers for Platforms namespace

---

## Common Mistakes to Avoid

1. **Not setting CUSTOM_DOMAIN** - System will fail fatally
2. **Not creating wildcard DNS record** - Preview URLs won't resolve
3. **Incorrect zone ID in routes** - Routing won't work
4. **Missing container configuration** - No sandboxes available
5. **Having workers_dev = true** - Conflicts with custom domains
6. **Having preview_urls = true** - Conflicts with custom routing

---

## Performance Profile

- **Concurrent Users:** 10-20 realistic (10 containers × 1-2 apps each)
- **Port Range:** 8001-8999 provides ~999 ports per container
- **Startup Time:** Usually 2-5 seconds (depends on template)
- **Memory per App:** ~100-500MB (depends on framework)
- **Disk per App:** ~500MB-2GB (depends on dependencies)

---

## File Structure Reference

```
dreamforge/
├── wrangler.jsonc                          # Container & route config
├── SandboxDockerfile                       # Container image definition
├── worker/
│   ├── index.ts                            # Main routing (178 lines)
│   ├── utils/urls.ts                       # Preview domain logic
│   └── services/sandbox/
│       ├── sandboxSdkClient.ts             # Core SDK (1800+ lines)
│       ├── remoteSandboxService.ts         # Alternative impl.
│       ├── factory.ts                      # Service selection
│       ├── sandboxTypes.ts                 # TypeScript schemas
│       └── BaseSandboxService.ts           # Abstract interface
├── container/
│   ├── cli-tools.ts                        # Monitoring system
│   ├── process-monitor.ts                  # Process tracking
│   └── storage.ts                          # Error storage
├── scripts/
│   ├── deploy.ts                           # Deployment config
│   └── undeploy.ts
└── SANDBOX_DOCUMENTATION_INDEX.md          # This file
```

---

## Related Documentation

- `/home/bishop/projects/dreamforge/CLAUDE.md` - Project-specific instructions
- `/home/bishop/CLAUDE.md` - Global DreamForge instructions
- Cloudflare official: https://developers.cloudflare.com/workers/platform/sandbox/

---

## Version Information

- **Sandbox Base Image:** docker.io/cloudflare/sandbox:0.1.3
- **Compatibility Date:** 2025-08-10
- **Compatibility Flags:** nodejs_compat
- **Last Updated:** 2025-10-18

---

## Support & Troubleshooting

For issues:

1. Check **SANDBOX_QUICK_REFERENCE.md** for common solutions
2. Review **SANDBOX_CONFIGURATION.md** Section 6.3 (Issues & Solutions)
3. Check container logs: `sandboxService.getLogs(instanceId)`
4. Verify environment variables are set
5. Confirm DNS records exist and point to Cloudflare

For questions about specific implementation details, consult the referenced file locations in **SANDBOX_QUICK_REFERENCE.md** (Key Code Locations section).

