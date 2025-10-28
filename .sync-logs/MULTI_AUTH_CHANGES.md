# Multi-Authentication Changes Reference

This document tracks the custom changes made to enable both OAuth AND email/password authentication simultaneously.

## File Modified
`worker/api/controllers/auth/controller.ts`

## Changes to Re-apply After Upstream Syncs

### Change 1: Remove OAuth exclusivity check from `register` method
**Location:** Around line 47-53 in the register method

**REMOVE these lines:**
```typescript
// Check if OAuth providers are configured - if yes, block email/password registration
if (AuthController.hasOAuthProviders(env)) {
    return AuthController.createErrorResponse(
        'Email/password registration is not available when OAuth providers are configured. Please use OAuth login instead.',
        403
    );
}
```

---

### Change 2: Remove OAuth exclusivity check from `login` method
**Location:** Around line 103-108 in the login method

**REMOVE these lines:**
```typescript
// Check if OAuth providers are configured - if yes, block email/password login
if (AuthController.hasOAuthProviders(env)) {
    return AuthController.createErrorResponse(
        'Email/password login is not available when OAuth providers are configured. Please use OAuth login instead.',
        403
    );
}
```

---

### Change 3: Update `requiresEmailAuth` flag in `getAuthProviders` method
**Location:** Around line 640-643 in the getAuthProviders method

**CHANGE:**
```typescript
// OLD CODE:
requiresEmailAuth: !providers.google && !providers.github,

// NEW CODE:
requiresEmailAuth: true, // Email auth always available alongside OAuth
```

---

## Quick Check After Sync

After each upstream sync, run:
```bash
git diff HEAD~1 worker/api/controllers/auth/controller.ts
```

If the auth controller was modified by the sync, re-apply the 3 changes above.

---

## Commit History
- Initial multi-auth implementation: commit `cfe5470` (Oct 27, 2025)
- Auth controller unprotected from syncs: commit pending

## Testing Multi-Auth
After re-applying changes, test:
1. ✅ Google OAuth login works
2. ✅ Email/password registration works
3. ✅ Email/password login works
4. ✅ Both options visible on frontend simultaneously
