# Exact Fixes Required - Copy-Paste Ready

This document provides the exact changes needed to fix deployment issues. Each section shows the current (broken) code and the replacement code.

---

## File: `/home/bishop/projects/dreamforge/wrangler.jsonc`

### Fix #1: Container Instance Type (Lines 61-72)

**CURRENT CODE (BROKEN):**
```jsonc
"containers": [
    {
        "class_name": "UserAppSandboxService",
        "image": "./SandboxDockerfile",
        // "image": "registry.cloudflare.com/vibesdk-production-userappsandboxservice:cfe197fc",
        // Altering max_instances value will have no effect. Please use the MAX_SANDBOX_INSTANCES var instead.
        "max_instances": 10,
        // ATTENTION: Altering instance_type value will have no effect. Please use the SANDBOX_INSTANCE_TYPE var instead.
        "instance_type": "standard-3",
        "rollout_step_percentage": 100
    }
]
```

**REPLACEMENT CODE (FIXED):**
```jsonc
"containers": [
    {
        "class_name": "UserAppSandboxService",
        "image": "./SandboxDockerfile",
        // "image": "registry.cloudflare.com/vibesdk-production-userappsandboxservice:cfe197fc",
        // Altering max_instances value will have no effect. Please use the MAX_SANDBOX_INSTANCES var instead.
        "max_instances": 10,
        // ATTENTION: Altering instance_type value will have no effect. Please use the SANDBOX_INSTANCE_TYPE var instead.
        "instance_type": {
            "vcpu": 4,
            "memory_mib": 4096,
            "disk_mb": 6144
        },
        "rollout_step_percentage": 100
    }
]
```

**CHANGE SUMMARY:**
- Line 69: Change `"instance_type": "standard-3",` 
- Lines 69-73: Replace with object specification (vcpu, memory_mib, disk_mb)

---

### Fix #2: Dispatch Namespace Remote Flag (Lines 54-60)

**CURRENT CODE (BROKEN):**
```jsonc
"dispatch_namespaces": [
    {
        "binding": "DISPATCHER",
        "namespace": "orange-build-default-namespace",
        "experimental_remote": true
    }
],
```

**REPLACEMENT CODE (FIXED):**
```jsonc
"dispatch_namespaces": [
    {
        "binding": "DISPATCHER",
        "namespace": "orange-build-default-namespace",
        "remote": true
    }
],
```

**CHANGE SUMMARY:**
- Line 58: Change `"experimental_remote": true` to `"remote": true`

---

### Fix #3: DISPATCH_NAMESPACE Environment Variable (Line 144)

**CURRENT CODE (BROKEN):**
```jsonc
"vars": {
    "TEMPLATES_REPOSITORY": "https://github.com/cloudflare/vibesdk-templates",
    "ALLOWED_EMAIL": "",
    "DISPATCH_NAMESPACE": "",
    ...
}
```

**REPLACEMENT CODE (FIXED):**
```jsonc
"vars": {
    "TEMPLATES_REPOSITORY": "https://github.com/cloudflare/vibesdk-templates",
    "ALLOWED_EMAIL": "",
    "DISPATCH_NAMESPACE": "orange-build-default-namespace",
    ...
}
```

**CHANGE SUMMARY:**
- Line 144: Change `"DISPATCH_NAMESPACE": "",` to `"DISPATCH_NAMESPACE": "orange-build-default-namespace",`

---

### Fix #4: Verify Assets Directory (Line 15)

**CURRENT CODE:**
```jsonc
"assets": {
    "directory": "dist/client",
    ...
}
```

**REQUIRED CHECK:**
1. Run: `npm run build`
2. Check if files exist in:
   - `dist/client/` (current setting)
   - or just `dist/` (upstream vibesdk)

**IF files are in `dist/` only:**

Replace line 15:
```jsonc
"directory": "dist/client",
```

With:
```jsonc
"directory": "dist",
```

**IF files are in `dist/client/`:**
No change needed - configuration is correct.

---

## Verification Script

Run this after making changes to verify the syntax:

```bash
#!/bin/bash

# Check if wrangler.jsonc is valid JSON
echo "Validating wrangler.jsonc syntax..."
bun -e "
const fs = require('fs');
const { parse } = require('jsonc-parser');
const content = fs.readFileSync('/home/bishop/projects/dreamforge/wrangler.jsonc', 'utf8');
try {
  parse(content);
  console.log('✓ wrangler.jsonc syntax is valid');
} catch (e) {
  console.error('✗ Syntax error:', e.message);
  process.exit(1);
}
"

# Check specific values
echo ""
echo "Verifying critical configuration values..."

# Extract instance_type
INSTANCE_TYPE=$(grep -A 4 '"instance_type"' /home/bishop/projects/dreamforge/wrangler.jsonc | head -1)
if [[ $INSTANCE_TYPE == *"vcpu"* ]]; then
  echo "✓ instance_type is an object (correct)"
else
  echo "✗ instance_type is still a string (needs fix)"
fi

# Check for experimental_remote
if grep -q '"experimental_remote"' /home/bishop/projects/dreamforge/wrangler.jsonc; then
  echo "✗ Still using experimental_remote (needs fix)"
else
  echo "✓ Not using experimental_remote (correct)"
fi

# Check for remote flag
if grep -q '"remote": true' /home/bishop/projects/dreamforge/wrangler.jsonc | grep -A 3 dispatch_namespaces; then
  echo "✓ Using remote: true in dispatch_namespaces (correct)"
fi

# Check DISPATCH_NAMESPACE
DISPATCH_NS=$(grep '"DISPATCH_NAMESPACE"' /home/bishop/projects/dreamforge/wrangler.jsonc)
if [[ $DISPATCH_NS == *'""'* ]]; then
  echo "✗ DISPATCH_NAMESPACE is still empty (needs fix)"
elif [[ $DISPATCH_NS == *"orange-build-default-namespace"* ]]; then
  echo "✓ DISPATCH_NAMESPACE is set correctly (correct)"
else
  echo "⚠ DISPATCH_NAMESPACE has unexpected value"
fi

echo ""
echo "Build output directory check..."
if [ -d "dist/client" ]; then
  echo "✓ dist/client/ directory exists"
elif [ -d "dist" ]; then
  echo "⚠ Only dist/ exists - may need to update assets.directory in wrangler.jsonc"
fi
```

---

## Line-by-Line Summary

| Line(s) | Current | New | Reason |
|---------|---------|-----|--------|
| 15 | "directory": "dist/client" | Verify against build output | Sync with actual build location |
| 58 | "experimental_remote": true | "remote": true | Use stable feature flag |
| 69 | "instance_type": "standard-3" | "instance_type": {...object...} | Production Cloudflare requires explicit spec |
| 144 | "DISPATCH_NAMESPACE": "" | "DISPATCH_NAMESPACE": "orange-build-default-namespace" | Set required environment variable |

---

## Before & After Comparison

### wrangler.jsonc Sections

#### BEFORE (Broken):
```jsonc
"dispatch_namespaces": [
    {
        "binding": "DISPATCHER",
        "namespace": "orange-build-default-namespace",
        "experimental_remote": true  // ← WRONG
    }
],
"containers": [
    {
        "class_name": "UserAppSandboxService",
        "image": "./SandboxDockerfile",
        "max_instances": 10,
        "instance_type": "standard-3",  // ← WRONG
        "rollout_step_percentage": 100
    }
],
...
"vars": {
    "DISPATCH_NAMESPACE": "",  // ← WRONG
    ...
}
```

#### AFTER (Fixed):
```jsonc
"dispatch_namespaces": [
    {
        "binding": "DISPATCHER",
        "namespace": "orange-build-default-namespace",
        "remote": true  // ← FIXED
    }
],
"containers": [
    {
        "class_name": "UserAppSandboxService",
        "image": "./SandboxDockerfile",
        "max_instances": 10,
        "instance_type": {  // ← FIXED
            "vcpu": 4,
            "memory_mib": 4096,
            "disk_mb": 6144
        },
        "rollout_step_percentage": 100
    }
],
...
"vars": {
    "DISPATCH_NAMESPACE": "orange-build-default-namespace",  // ← FIXED
    ...
}
```

---

## Testing After Changes

```bash
# 1. Validate syntax
npm run cf-typegen

# 2. Build frontend
npm run build

# 3. Test locally
npm run local

# 4. Deploy to production
npm run deploy

# 5. Verify deployment
curl https://app.getdreamforge.com/api/health
```

---

## Rollback Instructions (if needed)

If something goes wrong, revert with:

```bash
git checkout wrangler.jsonc
npm run build
npm run deploy
```

---

## Expected Outcomes After Fixes

✓ Deployment completes without errors
✓ Worker is accessible at app.getdreamforge.com
✓ D1 database queries work
✓ Container sandbox instances spawn correctly
✓ Durable Objects persist state
✓ Assets load from correct directory
✓ No deployment warnings in Cloudflare dashboard

---

**Ready to implement**: Copy the exact replacement code sections above into your wrangler.jsonc file.

Generated: 2025-10-16
