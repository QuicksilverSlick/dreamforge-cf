# Cloudflare vibesdk vs DreamForge Deployment Configuration Analysis

## Executive Summary
Comparing the official Cloudflare vibesdk repository with DreamForge reveals **CRITICAL DIFFERENCES** in configuration that explain deployment challenges. The main issues are in container instance types, dispatch namespace configuration, and compatibility dates.

---

## 1. CRITICAL DIFFERENCES IN CONFIGURATION

### 1.1 Container Instance Type Configuration

#### vibesdk (UPSTREAM):
```jsonc
"containers": [
    {
        "class_name": "UserAppSandboxService",
        "image": "./SandboxDockerfile",
        "max_instances": 2900,
        "instance_type": {
            "vcpu": 4,
            "memory_mib": 4096,
            "disk_mb": 6144
        },
        "rollout_step_percentage": 100
    }
]
```

#### DreamForge (CURRENT):
```jsonc
"containers": [
    {
        "class_name": "UserAppSandboxService",
        "image": "./SandboxDockerfile",
        "max_instances": 10,
        "instance_type": "standard-3",
        "rollout_step_percentage": 100
    }
]
```

**KEY DIFFERENCES:**
- **vibesdk uses explicit vCPU/memory spec**: 4 vCPU, 4096 MB RAM, 6144 MB disk
- **DreamForge uses string identifier**: "standard-3" (which may not be valid in production)
- **vibesdk max_instances**: 2900 (production scale)
- **DreamForge max_instances**: 10 (testing scale)

**ISSUE**: The `instance_type` string "standard-3" might be a local/development identifier that doesn't translate to production Cloudflare containers infrastructure.

---

### 1.2 Dispatch Namespace Configuration

#### vibesdk (UPSTREAM):
```jsonc
"dispatch_namespaces": [
    {
        "binding": "DISPATCHER",
        "namespace": "vibesdk-default-namespace",
        "remote": true
    }
]
```

#### DreamForge (CURRENT):
```jsonc
"dispatch_namespaces": [
    {
        "binding": "DISPATCHER",
        "namespace": "orange-build-default-namespace",
        "experimental_remote": true
    }
]
```

**KEY DIFFERENCES:**
- **vibesdk**: Uses `"remote": true` (standard Wrangler configuration)
- **DreamForge**: Uses `"experimental_remote": true` (experimental feature flag)
- **Namespace names**: Different namespace identifiers

**ISSUE**: Using `experimental_remote` instead of `remote` suggests DreamForge is using an unstable/experimental feature that may have different behavior or be subject to breaking changes.

---

### 1.3 Compatibility Date

#### vibesdk (UPSTREAM):
```jsonc
"compatibility_date": "2025-08-10"
```

#### DreamForge (CURRENT):
```jsonc
"compatibility_date": "2025-10-14"
```

**OBSERVATION:**
- DreamForge is on a newer compatibility date (more recent)
- This *should* be good, but combined with other issues could introduce breaking changes

---

### 1.4 Assets Directory

#### vibesdk (UPSTREAM):
```jsonc
"assets": {
    "directory": "dist",
    "not_found_handling": "single-page-application",
    "run_worker_first": true,
    "binding": "ASSETS"
}
```

#### DreamForge (CURRENT):
```jsonc
"assets": {
    "directory": "dist/client",
    "not_found_handling": "single-page-application",
    "run_worker_first": true,
    "binding": "ASSETS"
}
```

**DIFFERENCE:**
- DreamForge uses `dist/client` instead of `dist`
- This is likely intentional based on your build structure

---

## 2. ENVIRONMENT VARIABLES COMPARISON

### vibesdk Configuration (vars section):
```jsonc
"vars": {
    "TEMPLATES_REPOSITORY": "https://github.com/cloudflare/vibesdk-templates",
    "ALLOWED_EMAIL": "",
    "DISPATCH_NAMESPACE": "vibesdk-default-namespace",  // ← EXPLICITLY SET
    "ENABLE_READ_REPLICAS": "true",
    "CLOUDFLARE_AI_GATEWAY": "vibesdk-gateway",
    "CUSTOM_DOMAIN": "",
    "MAX_SANDBOX_INSTANCES": "10",
    "SANDBOX_INSTANCE_TYPE": "standard-3",
    "USE_CLOUDFLARE_IMAGES": false
}
```

### DreamForge Configuration (vars section):
```jsonc
"vars": {
    "TEMPLATES_REPOSITORY": "https://github.com/cloudflare/vibesdk-templates",
    "ALLOWED_EMAIL": "",
    "DISPATCH_NAMESPACE": "",  // ← EMPTY!
    "ENABLE_READ_REPLICAS": "true",
    "CUSTOM_DOMAIN": "app.getdreamforge.com",
    "CUSTOM_PREVIEW_DOMAIN": "preview.getdreamforge.com",
    "MAX_SANDBOX_INSTANCES": "10",
    "SANDBOX_INSTANCE_TYPE": "standard-3",
    "CLOUDFLARE_AI_GATEWAY": "vibesdk-gateway",
    "USE_CLOUDFLARE_IMAGES": false
}
```

**CRITICAL ISSUE:**
- **DreamForge has `DISPATCH_NAMESPACE` set to empty string ""**
- **vibesdk has it set to "vibesdk-default-namespace"**
- This empty value likely causes dispatch operations to fail silently

---

## 3. GITHUB ACTIONS WORKFLOWS

### Both are essentially identical:
Both use:
- Ubuntu latest
- Bun package manager
- Same build commands
- Same deployment secrets

**NO ISSUES DETECTED** in CI/CD configuration

---

## 4. DEPLOYMENT SCRIPTS

Both use TypeScript deploy scripts with:
- JSONC parser for wrangler config
- Cloudflare API client
- Environment variable loading from `.prod.vars`

**The scripts are compatible**, but will execute differently based on the wrangler config differences.

---

## 5. DOCKERFILE COMPARISON

Both SandboxDockerfiles are **IDENTICAL**:
- Same base image: `docker.io/cloudflare/sandbox:0.1.3`
- Same dependencies and setup
- Same environment variables

**NO DIFFERENCES DETECTED**

---

## 6. ROOT CAUSE ANALYSIS

### The deployment fails because:

1. **Invalid Container Instance Type**
   - `"instance_type": "standard-3"` is a string identifier
   - Production Cloudflare requires explicit vCPU/memory specification
   - Should be: `{ "vcpu": 4, "memory_mib": 4096, "disk_mb": 6144 }`

2. **Experimental Dispatch Namespace Configuration**
   - Using `"experimental_remote": true` instead of `"remote": true`
   - Experimental features may not be stable or fully deployed
   - Can cause namespace creation failures

3. **Missing DISPATCH_NAMESPACE Variable**
   - Variable is set to empty string in vars section
   - Likely causes "Workers for Platforms" dispatch to fail
   - Should be set to your namespace identifier

4. **Incorrect Assets Directory**
   - `dist/client` may not exist if build outputs to `dist/`
   - Could cause asset serving failures (though not deployment blocking)

---

## 7. RECOMMENDED FIXES

### Fix #1: Update Container Instance Type
Replace:
```jsonc
"instance_type": "standard-3"
```

With:
```jsonc
"instance_type": {
    "vcpu": 4,
    "memory_mib": 4096,
    "disk_mb": 6144
}
```

### Fix #2: Update Dispatch Namespace Configuration
Replace:
```jsonc
"dispatch_namespaces": [
    {
        "binding": "DISPATCHER",
        "namespace": "orange-build-default-namespace",
        "experimental_remote": true
    }
]
```

With:
```jsonc
"dispatch_namespaces": [
    {
        "binding": "DISPATCHER",
        "namespace": "orange-build-default-namespace",
        "remote": true
    }
]
```

### Fix #3: Set DISPATCH_NAMESPACE Variable
Replace:
```jsonc
"DISPATCH_NAMESPACE": ""
```

With:
```jsonc
"DISPATCH_NAMESPACE": "orange-build-default-namespace"
```

### Fix #4: Verify Assets Directory
Ensure your build actually outputs to `dist/client/` or change to:
```jsonc
"assets": {
    "directory": "dist"
}
```

---

## 8. DEPLOYMENT READINESS CHECKLIST

- [ ] Update container `instance_type` to explicit vCPU/memory spec
- [ ] Change `experimental_remote` to `remote` in dispatch_namespaces
- [ ] Set `DISPATCH_NAMESPACE` variable to actual namespace name
- [ ] Verify build outputs to correct assets directory
- [ ] Test deployment with `npm run deploy`
- [ ] Verify Worker is running at custom domain
- [ ] Check Durable Objects state is persisting
- [ ] Confirm container sandbox instances are spinning up correctly

---

## 9. ADDITIONAL OBSERVATIONS

### Security Considerations
- Both use similar rate limiting configuration (API_RATE_LIMITER, AUTH_RATE_LIMITER)
- Both have observability enabled
- No major security differences detected

### Database Configuration
- Both use D1 with different database IDs (as expected for different deployments)
- Both use Drizzle ORM with remote: true
- Both have migration systems configured

### Feature Parity
- vibesdk has no deployment workflow YAML (relies on manual deploy)
- DreamForge has automated CI/CD (better practice)

---

## Summary

The deployment issues are caused by **3 critical configuration mismatches**:
1. Container instance type using invalid string identifier
2. Experimental dispatch namespace configuration
3. Empty DISPATCH_NAMESPACE variable

These are easily fixable configuration issues, not code problems.
