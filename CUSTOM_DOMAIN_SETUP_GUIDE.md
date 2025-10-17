# Custom Domain Setup Guide for DreamForge
**Date**: October 7, 2025
**Domain**: getdreamforge.com
**Status**: ✅ Code Configuration Complete | ⏳ DNS Configuration Pending

---

## 🏗️ Final Architecture

```
getdreamforge.com                           → Landing page (marketing, auth)
app.getdreamforge.com                       → Main builder application
preview.getdreamforge.com                   → Preview domain
├─ 8001-abc123.preview.getdreamforge.com   → Individual preview instances
├─ 8002-def456.preview.getdreamforge.com
└─ 8003-ghi789.preview.getdreamforge.com
```

### Why This Architecture?

✅ **Industry standard** (like app.vercel.com, app.github.com)
✅ **Clean separation** of marketing vs application
✅ **Independent caching** and deployment strategies
✅ **Simple OAuth** redirect configuration
✅ **Professional** SaaS appearance
✅ **Wildcard SSL** for unlimited preview instances

---

## 📋 Complete Setup Checklist

### ✅ COMPLETED: Code Configuration

- [x] Updated `wrangler.jsonc` with custom domains
- [x] Set `CUSTOM_DOMAIN = "app.getdreamforge.com"`
- [x] Set `CUSTOM_PREVIEW_DOMAIN = "preview.getdreamforge.com"`
- [x] Disabled workers.dev subdomain
- [x] Built project successfully

### ⏳ PENDING: Your Actions

- [ ] **Step 1**: Configure DNS records
- [ ] **Step 2**: Enable Total TLS
- [ ] **Step 3**: Deploy to production
- [ ] **Step 4**: Test SSL and preview URLs

---

## STEP 1: Configure DNS Records in Cloudflare

### 🎯 Navigate to DNS Settings

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select domain: **getdreamforge.com**
3. Click **DNS** → **Records**

### 📝 Add These 3 DNS Records:

#### Record 1: Main Application Domain
```
Type:    CNAME
Name:    app
Target:  vibesdk-production.russelledeming.workers.dev
Proxy:   ✅ Enabled (orange cloud)
TTL:     Auto
```

**Result**: `app.getdreamforge.com` → Your Worker

---

#### Record 2: Preview Wildcard Domain
```
Type:    A
Name:    *.preview
Target:  192.0.2.1
Proxy:   ✅ Enabled (orange cloud)
TTL:     Auto
```

**Result**: `*.preview.getdreamforge.com` → Container preview instances

**Important**: The IP `192.0.2.1` is a placeholder. Cloudflare's proxy will route traffic correctly through their edge network.

---

#### Record 3: Root Domain (Optional - for landing page)
```
Type:    CNAME
Name:    @ (or leave empty for root)
Target:  vibesdk-production.russelledeming.workers.dev
Proxy:   ✅ Enabled (orange cloud)
TTL:     Auto
```

**Result**: `getdreamforge.com` → Can serve landing page or redirect to app

**Note**: You can change this later when you build a dedicated marketing site.

---

## STEP 2: Enable Total TLS for Wildcard SSL

### 🎯 Navigate to SSL Settings

1. In Cloudflare Dashboard for **getdreamforge.com**
2. Go to **SSL/TLS** → **Edge Certificates**
3. Scroll down to find **Total TLS** section

### ⚙️ Enable Total TLS

1. Click **Enable Total TLS**
2. Wait for confirmation (should be instant)

### ⏱️ Certificate Provisioning Timeline

- **Base domains** (`app.getdreamforge.com`): ~5 minutes
- **Wildcard domains** (`*.preview.getdreamforge.com`): ~15 minutes
- **No action required**: Certificates auto-renew

### ✅ Verify SSL Configuration

After 15-20 minutes, test certificate provisioning:

```bash
# Test main app domain
curl -I https://app.getdreamforge.com

# Test wildcard preview domain
curl -I https://test-123.preview.getdreamforge.com
```

**Expected**: HTTP/2 200 or 404 (NOT SSL errors)

---

## STEP 3: Deploy to Production

### Prerequisites Check

Before deploying, verify you have:

```bash
# Check .prod.vars exists with required secrets
cat .prod.vars

# Should contain:
# CLOUDFLARE_API_TOKEN="..."
# CLOUDFLARE_ACCOUNT_ID="..."
# JWT_SECRET="..."
# SECRETS_ENCRYPTION_KEY="..."
# GOOGLE_AI_STUDIO_API_KEY="..."
```

### Deploy with Custom Domains

```bash
# Option 1: Using npm script
npm run deploy

# Option 2: Direct wrangler deploy
npx wrangler deploy
```

### Expected Output

```
✨ Built successfully
⚡ Deploying to vibesdk-production...
✅ Uploaded successfully
🌐 Worker deployed
📍 Custom domain: app.getdreamforge.com
📍 Preview domain: preview.getdreamforge.com
```

### Post-Deployment

Cloudflare will automatically:
- ✅ Route `app.getdreamforge.com` to your Worker
- ✅ Configure preview URLs to use `preview.getdreamforge.com`
- ✅ Enable HTTPS with automatic certificates

---

## STEP 4: Test Everything

### Test 1: Main Application Access

```bash
# Test app domain resolves
curl -I https://app.getdreamforge.com

# Test health endpoint
curl https://app.getdreamforge.com/api/health
```

**Expected**: HTTP/2 200 with JSON response

---

### Test 2: Create Test App and Verify Preview URL

1. **Navigate to**: `https://app.getdreamforge.com`
2. **Create a new app** with any template
3. **Check preview URL format**: Should be `https://8001-<id>.preview.getdreamforge.com`
4. **Verify SSL**: Click the preview URL - should load without SSL errors ✅

---

### Test 3: Preview URL SSL Verification

```bash
# Test a specific preview URL (replace with actual URL from your app)
curl -I https://8001-abc123.preview.getdreamforge.com

# Should return HTTP/2 200 (not SSL errors)
```

---

## 🔧 OAuth Configuration (After DNS is Working)

Once your custom domains are working, update OAuth redirect URLs:

### Google OAuth
```
Authorized redirect URIs:
https://app.getdreamforge.com/api/auth/callback/google
```

### GitHub OAuth
```
Authorization callback URL:
https://app.getdreamforge.com/api/auth/callback/github
```

### GitHub Export OAuth
```
Authorization callback URL:
https://app.getdreamforge.com/api/github/export/callback
```

---

## 🚨 Troubleshooting

### Issue: DNS not resolving after 5 minutes

**Check**:
```bash
dig app.getdreamforge.com
dig test.preview.getdreamforge.com
```

**Solution**:
- Verify DNS records in Cloudflare dashboard
- Ensure "Proxy" is enabled (orange cloud ☁️)
- Wait up to 15 minutes for global propagation

---

### Issue: SSL certificate errors on preview URLs

**Check**:
```bash
# Test certificate
echo | openssl s_client -connect test-123.preview.getdreamforge.com:443 -servername test-123.preview.getdreamforge.com 2>/dev/null | grep 'subject='
```

**Solution**:
- Confirm Total TLS is enabled
- Wait 15-20 minutes for wildcard certificate provisioning
- Verify `*.preview` DNS record exists and is proxied

---

### Issue: App loads but preview URLs still use old domain

**Check**:
```bash
# View live Worker logs
npx wrangler tail

# Look for preview URL generation in logs
```

**Solution**:
- Clear browser cache
- Verify deployment succeeded: `npx wrangler deployments list`
- Confirm `CUSTOM_PREVIEW_DOMAIN` in production environment

---

### Issue: "workers.dev" URLs still appearing

**Check** `wrangler.jsonc`:
```json
"workers_dev": false,  // Should be false
"preview_urls": false  // Should be false
```

**Solution**:
```bash
npm run build
npm run deploy
```

---

## 📊 Environment Variable Reference

### In `wrangler.jsonc` (lines 145-146):
```json
"CUSTOM_DOMAIN": "app.getdreamforge.com",
"CUSTOM_PREVIEW_DOMAIN": "preview.getdreamforge.com"
```

### In `.prod.vars` (if overriding):
```bash
# Optional: Override wrangler.jsonc settings
CUSTOM_DOMAIN="app.getdreamforge.com"
CUSTOM_PREVIEW_DOMAIN="preview.getdreamforge.com"
```

---

## 🎯 Success Criteria

### ✅ Setup Complete When:

1. **Main app loads**: `https://app.getdreamforge.com` → 200 OK
2. **No SSL errors**: Green padlock in browser
3. **Preview URLs work**: `https://8001-*.preview.getdreamforge.com` loads without errors
4. **OAuth redirects**: If configured, Google/GitHub login works
5. **Wrangler logs clean**: No DNS or SSL errors

---

## 📈 Next Steps After Setup

### Immediate
- [ ] Test app creation and preview functionality
- [ ] Configure OAuth providers with new redirect URLs
- [ ] Update any external integrations with new domain

### Short-Term
- [ ] Build landing page for `getdreamforge.com`
- [ ] Set up analytics and monitoring
- [ ] Configure custom error pages

### Long-Term
- [ ] Consider increasing container limits (10 → 2900)
- [ ] Set up staging environment (e.g., `staging.getdreamforge.com`)
- [ ] Implement rate limiting based on domain

---

## 🔄 Rolling Back (If Needed)

If you need to revert to workers.dev:

```bash
# Edit wrangler.jsonc
"CUSTOM_DOMAIN": "vibesdk-production.russelledeming.workers.dev",
# Remove or comment out CUSTOM_PREVIEW_DOMAIN
"workers_dev": true,
"preview_urls": true

# Rebuild and redeploy
npm run build
npm run deploy
```

---

## 📞 Support Resources

- **Cloudflare Workers Docs**: https://developers.cloudflare.com/workers/
- **Custom Domains Guide**: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- **Total TLS Docs**: https://developers.cloudflare.com/ssl/edge-certificates/total-tls/
- **DNS Configuration**: https://developers.cloudflare.com/dns/

---

## 📝 Summary

### What Changed in Code:
- ✅ Updated `wrangler.jsonc` with `CUSTOM_DOMAIN` and `CUSTOM_PREVIEW_DOMAIN`
- ✅ Disabled workers.dev subdomain routing
- ✅ Built project successfully

### What You Need to Do:
1. ⏳ Add 3 DNS records in Cloudflare dashboard
2. ⏳ Enable Total TLS for automatic SSL certificates
3. ⏳ Deploy to production
4. ⏳ Test preview URLs work with HTTPS

### Estimated Time:
- **DNS Setup**: 5 minutes
- **Certificate Provisioning**: 15-20 minutes
- **Deployment**: 2 minutes
- **Testing**: 5 minutes

**Total**: ~30 minutes from start to fully working custom domain setup

---

**Generated**: October 7, 2025
**Status**: Ready for DNS configuration and deployment
