# Wrangler Authentication Guide for WSL2 (October 2025)

## Current Issue
OAuth tokens expire frequently and WSL2 has localhost callback issues with `wrangler login`. This causes authentication errors during deployment.

---

## ⭐ RECOMMENDED: API Token Authentication

**Best for WSL2, headless environments, and stable long-term access**

### Setup Steps:

1. **Create API Token:**
   - Go to: https://dash.cloudflare.com/profile/api-tokens
   - Click **"Create Token"**
   - Select template: **"Edit Cloudflare Workers"**

2. **Add Required Permissions:**
   The template includes most permissions, but you need to manually add:
   - ✅ Workers Scripts: Edit (included)
   - ✅ Workers KV Storage: Edit (included)
   - ✅ Workers Routes: Edit (included)
   - ⚠️ **Containers: Edit** (ADD THIS MANUALLY)
   - ✅ D1: Edit (add if needed)
   - ✅ R2: Edit (add if needed)
   - ✅ Account Settings: Read (included)
   - ✅ Zone: Read (for your domain: getdreamforge.com)

3. **Generate and Save Token:**
   - Click **"Continue to summary"**
   - Click **"Create Token"**
   - **COPY THE TOKEN IMMEDIATELY** (you won't see it again)

4. **Configure WSL2:**
   ```bash
   # Add to your shell profile
   echo 'export CLOUDFLARE_API_TOKEN="your-token-here"' >> ~/.bashrc
   source ~/.bashrc

   # Or set for current session only
   export CLOUDFLARE_API_TOKEN="your-token-here"
   ```

5. **Remove Old OAuth Config (optional):**
   ```bash
   rm -rf ~/.wrangler/config/default.toml
   ```

6. **Test Authentication:**
   ```bash
   wrangler whoami
   ```

### Pros:
- ✅ No localhost callback issues
- ✅ Long-lived tokens (set expiration as needed)
- ✅ Works perfectly in WSL2/headless environments
- ✅ Recommended by Cloudflare for CI/CD
- ✅ No refresh token complexity
- ✅ Can be version-controlled (in secure vaults)

### Cons:
- ❌ Need to manually configure all permissions
- ❌ Need to manage token security yourself
- ❌ No automatic refresh (need to regenerate when expired)

---

## Alternative: OAuth via Windows PowerShell + Copy to WSL2

**Use this if you need full OAuth scopes with automatic refresh**

### Setup Steps:

1. **Login on Windows PowerShell:**
   ```powershell
   npx wrangler@latest login --scopes "account:read user:read workers:write workers_kv:write workers_routes:write workers_scripts:write workers_tail:read d1:write pages:write zone:read ssl_certs:write ai:write queues:write pipelines:write secrets_store:write containers:write cloudchamber:write connectivity:admin offline_access"
   ```

2. **Copy OAuth Config to WSL2:**
   ```bash
   # In WSL2 terminal
   mkdir -p ~/.wrangler/config
   cp "/mnt/c/Users/PC owner/AppData/Roaming/xdg.config/.wrangler/config/default.toml" ~/.wrangler/config/
   ```

3. **Test Authentication:**
   ```bash
   wrangler whoami
   ```

### Pros:
- ✅ Full OAuth scopes automatically
- ✅ Automatic token refresh via refresh_token
- ✅ Can revoke access via Cloudflare dashboard
- ✅ Short-lived tokens (more secure)

### Cons:
- ❌ Requires Windows + WSL2 workflow
- ❌ Tokens expire periodically (need to re-login)
- ❌ Extra manual steps required
- ❌ Config file location can change

---

## Comparison Table

| Feature | API Token | OAuth (Windows→WSL2) |
|---------|-----------|---------------------|
| **WSL2 Friendly** | ✅ Excellent | ⚠️ Workaround required |
| **Setup Complexity** | 🟢 Simple | 🟡 Medium |
| **Token Lifespan** | ✅ Long-lived | ⚠️ Expires frequently |
| **Auto-Refresh** | ❌ No | ✅ Yes |
| **Headless Support** | ✅ Perfect | ❌ No |
| **CI/CD Ready** | ✅ Yes | ⚠️ Not ideal |
| **Revocation** | ⚠️ Manual | ✅ Dashboard |
| **Scope Granularity** | ✅ Custom | ✅ Full scopes |

---

## Troubleshooting

### Issue: "You do not have access to this feature [code: 10023]"
**Solution:** Ensure your token has **Containers:Edit** permission. This is NOT included in the default template.

### Issue: "An unknown API error occurred [code: 500]"
**Solution:**
1. Check if token is expired
2. Verify Cloudflare API status: https://www.cloudflarestatus.com
3. Try regenerating token

### Issue: OAuth token expired
**Solution:**
- API Token: Generate new token
- OAuth: Re-login via Windows PowerShell and copy config

---

## Security Best Practices

1. **Never commit tokens to git:**
   ```bash
   # Add to .gitignore
   echo '.env' >> .gitignore
   echo '.dev.vars' >> .gitignore
   ```

2. **Use environment variables:**
   - Store in `~/.bashrc` for local development
   - Use secret management for CI/CD (GitHub Secrets, etc.)

3. **Set token expiration:**
   - API tokens: Set reasonable expiration (90 days recommended)
   - Rotate tokens regularly

4. **Minimal permissions:**
   - Only grant permissions actually needed
   - Use separate tokens for different projects

---

## Current Project Setup (Dreamforge)

**Account ID:** 00354a4cf3fd5ff6f93e809b915f0f58
**Worker Name:** vibesdk-production

**Required Permissions:**
- Workers Scripts: Edit
- Workers KV Storage: Edit
- **Containers: Edit** ⚠️ CRITICAL
- Workers Routes: Edit (Zone: getdreamforge.com)
- D1: Edit
- R2: Edit
- AI Gateway: Edit
- Cloudflare Images: Edit
- Account Settings: Read
- Zone: Read

**Current Status:** OAuth tokens expiring frequently, switch to API Token recommended.

---

## Quick Commands Reference

```bash
# Check authentication status
wrangler whoami

# Login with OAuth (Windows PowerShell)
npx wrangler@latest login

# Set API token (Linux/WSL2)
export CLOUDFLARE_API_TOKEN="your-token-here"

# Test deployment
npm run deploy

# Clear OAuth cache
rm -rf ~/.wrangler/config/

# View wrangler logs
ls -la ~/.wrangler/logs/
```

---

**Last Updated:** October 15, 2025
**Status:** API Token authentication recommended for WSL2 stability
