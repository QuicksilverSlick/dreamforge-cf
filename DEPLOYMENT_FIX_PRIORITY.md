# Deployment Fix Priority Guide

## URGENT: 3 Critical Configuration Issues Found

Your deployment is failing due to configuration mismatches with the official Cloudflare vibesdk repository. These are **NOT code bugs** - they are **wrangler.jsonc configuration issues** that can be fixed immediately.

---

## Priority 1: CRITICAL - Container Instance Type

**Current (BROKEN):**
```jsonc
"instance_type": "standard-3"
```

**Upstream vibesdk:**
```jsonc
"instance_type": {
    "vcpu": 4,
    "memory_mib": 4096,
    "disk_mb": 6144
}
```

**Why it fails:** Cloudflare production deployment rejects the string identifier "standard-3" in wrangler.jsonc. It needs explicit resource specification.

**Fix:** Update `/home/bishop/projects/dreamforge/wrangler.jsonc` line 69:

```jsonc
"instance_type": {
    "vcpu": 4,
    "memory_mib": 4096,
    "disk_mb": 6144
},
```

**Estimated impact:** This is likely the PRIMARY cause of deployment failures.

---

## Priority 2: CRITICAL - Dispatch Namespace Remote Flag

**Current (BROKEN):**
```jsonc
"dispatch_namespaces": [
    {
        "binding": "DISPATCHER",
        "namespace": "orange-build-default-namespace",
        "experimental_remote": true
    }
]
```

**Upstream vibesdk:**
```jsonc
"dispatch_namespaces": [
    {
        "binding": "DISPATCHER",
        "namespace": "vibesdk-default-namespace",
        "remote": true
    }
]
```

**Why it fails:** Using `"experimental_remote": true` instead of `"remote": true` means you're using an unstable/experimental Wrangler feature. This could:
- Be removed in future Wrangler versions
- Not be fully deployed to Cloudflare infrastructure
- Have different behavior than the stable version

**Fix:** Update `/home/bishop/projects/dreamforge/wrangler.jsonc` line 58, change:

```jsonc
"experimental_remote": true  // REMOVE THIS
```

To:

```jsonc
"remote": true  // ADD THIS
```

**Estimated impact:** This likely causes "Workers for Platforms" dispatch namespace creation to fail.

---

## Priority 3: CRITICAL - Empty DISPATCH_NAMESPACE Variable

**Current (BROKEN):**
```jsonc
"vars": {
    "DISPATCH_NAMESPACE": "",  // ← EMPTY STRING
    ...
}
```

**Upstream vibesdk:**
```jsonc
"vars": {
    "DISPATCH_NAMESPACE": "vibesdk-default-namespace",  // ← SET TO NAMESPACE
    ...
}
```

**Why it fails:** An empty string means any code using `env.DISPATCH_NAMESPACE` will get an empty value. This breaks any Workers for Platforms dispatch operations.

**Fix:** Update `/home/bishop/projects/dreamforge/wrangler.jsonc` line 144:

```jsonc
"DISPATCH_NAMESPACE": "orange-build-default-namespace",
```

**Estimated impact:** This causes silent failures when trying to dispatch requests to the worker namespace.

---

## Priority 4: MEDIUM - Assets Directory Path

**Current:**
```jsonc
"assets": {
    "directory": "dist/client",
    ...
}
```

**Upstream vibesdk:**
```jsonc
"assets": {
    "directory": "dist",
    ...
}
```

**Why it might fail:** If your build outputs to `dist/` instead of `dist/client/`, the Workers won't find any assets. This would cause:
- 404 errors for all static assets
- Blank/broken frontend

**Fix:** Check your build output first:
1. Run `npm run build`
2. Check if files exist at `dist/client/` or just `dist/`
3. If they're in `dist/`, update wrangler.jsonc line 15 to:
   ```jsonc
   "directory": "dist",
   ```

**Estimated impact:** Medium - this causes asset serving failures, not Worker deployment failures.

---

## Fix Application Order

### Step 1: Update wrangler.jsonc (5 minutes)
1. Change `instance_type` from string to object (lines 69-71)
2. Change `experimental_remote` to `remote` (line 58)
3. Set `DISPATCH_NAMESPACE` from "" to "orange-build-default-namespace" (line 144)
4. Verify assets directory path matches your build output (line 15)

### Step 2: Test Locally (2 minutes)
```bash
npm run build
npm run cf-typegen
npm run local
```

### Step 3: Deploy (5 minutes)
```bash
npm run deploy
```

### Step 4: Verify Deployment (5 minutes)
- Check Worker is deployed to your custom domain
- Check D1 database connectivity
- Check container sandbox instances are starting
- Check Durable Objects have persisted state

---

## Quick Reference: What Changed

| Issue | Location | Change | Priority |
|-------|----------|--------|----------|
| Instance Type | `wrangler.jsonc:69` | String → Object spec | CRITICAL |
| Dispatch Remote | `wrangler.jsonc:58` | experimental_remote → remote | CRITICAL |
| Dispatch Namespace | `wrangler.jsonc:144` | "" → "orange-build-default-namespace" | CRITICAL |
| Assets Directory | `wrangler.jsonc:15` | Verify dist/client exists | MEDIUM |

---

## Why These Issues Exist

These configuration mismatches likely occurred because:

1. **Container Instance Type**: The string "standard-3" might have worked in local development or an older Wrangler version but doesn't work in production Cloudflare deployment.

2. **Experimental Remote**: DreamForge was forked before this feature was stabilized. The experimental feature flag was used for testing.

3. **Empty DISPATCH_NAMESPACE**: This was likely left as a placeholder during configuration setup.

4. **Asset Directory**: This might be a legitimate difference based on DreamForge's build structure, but should be verified.

---

## Verification Checklist

After applying fixes:

- [ ] Container instance_type is an object with vcpu, memory_mib, disk_mb
- [ ] dispatch_namespaces uses "remote": true (not experimental_remote)
- [ ] DISPATCH_NAMESPACE variable is set to "orange-build-default-namespace"
- [ ] Assets directory matches your build output location
- [ ] `npm run build` succeeds
- [ ] `npm run local` starts the Worker without errors
- [ ] `npm run deploy` completes successfully
- [ ] Worker responds at app.getdreamforge.com
- [ ] D1 database is accessible from Worker
- [ ] Container sandbox instances are created for code generation

---

## Next Steps

1. **Update wrangler.jsonc** with the 3 critical fixes above
2. **Test locally** with `npm run local`
3. **Deploy** with `npm run deploy`
4. **Monitor** for errors in Cloudflare dashboard

These configuration changes should resolve your deployment issues immediately. They're not code problems - just configuration alignment with the upstream vibesdk reference implementation.

---

## Reference Documentation

- **Upstream Repository**: https://github.com/cloudflare/vibesdk/
- **Wrangler Configuration**: https://developers.cloudflare.com/workers/wrangler/configuration/
- **Cloudflare Containers**: https://developers.cloudflare.com/workers/platform/containers/
- **Workers for Platforms**: https://developers.cloudflare.com/workers-for-platforms/

---

**Generated**: 2025-10-16
**Based on**: Comparison with cloudflare/vibesdk@latest
**Status**: Ready to implement
