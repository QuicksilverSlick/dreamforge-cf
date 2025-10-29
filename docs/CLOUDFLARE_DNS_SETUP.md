# Cloudflare DNS Configuration for Dreamforge

This document outlines the DNS configuration required to serve:
- **getdreamforge.com** → Marketing landing pages
- **app.getdreamforge.com** → React application
- **\*.app.getdreamforge.com** → User-generated app previews

## Domain Architecture

```
getdreamforge.com/
  ├─ /                    → Individual "Vibe Coder" landing page
  └─ /dream-builder       → Enterprise landing page

app.getdreamforge.com/
  └─ /*                   → React application (logged-in users)

*.app.getdreamforge.com/
  └─ /*                   → User-generated app previews
```

## Required DNS Records

Add the following DNS records in your Cloudflare dashboard for the `getdreamforge.com` zone:

### 1. Root Domain (getdreamforge.com)
```
Type: CNAME or AAAA (depending on your Worker deployment)
Name: @
Content: <your-worker-url>.workers.dev
Proxy status: Proxied (orange cloud)
TTL: Auto
```

**Alternative using AAAA Records (Recommended):**
```
Type: AAAA
Name: @
Content: 100::
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### 2. WWW Subdomain (www.getdreamforge.com)
```
Type: CNAME
Name: www
Content: getdreamforge.com
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### 3. App Subdomain (app.getdreamforge.com)
```
Type: AAAA
Name: app
Content: 100::
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### 4. Wildcard for User Apps (*.app.getdreamforge.com)
```
Type: AAAA
Name: *.app
Content: 100::
Proxy status: Proxied (orange cloud)
TTL: Auto
```

## Worker Routes Configuration

The `wrangler.jsonc` file already contains the necessary route configuration:

```jsonc
"routes": [
    {
        "pattern": "getdreamforge.com/*",
        "custom_domain": true,
        "zone_id": "157d05cb90f7190794c33e37bef447db"
    },
    {
        "pattern": "www.getdreamforge.com/*",
        "custom_domain": true,
        "zone_id": "157d05cb90f7190794c33e37bef447db"
    },
    {
        "pattern": "app.getdreamforge.com",
        "custom_domain": true
    },
    {
        "pattern": "*app.getdreamforge.com/*",
        "custom_domain": false,
        "zone_id": "157d05cb90f7190794c33e37bef447db"
    }
]
```

These routes tell Cloudflare which requests should be handled by your Worker.

## Verification Steps

After configuring DNS and deploying the Worker:

### 1. Test Marketing Pages
```bash
# Individual landing page
curl -I https://getdreamforge.com/
# Expected: 200 OK, Content-Type: text/html

# Enterprise landing page
curl -I https://getdreamforge.com/dream-builder
# Expected: 200 OK, Content-Type: text/html

# WWW redirect
curl -I https://www.getdreamforge.com/
# Expected: 200 OK, same content as root
```

### 2. Test Application Domain
```bash
# React app
curl -I https://app.getdreamforge.com/
# Expected: 200 OK, serves React app

# API endpoint
curl -I https://app.getdreamforge.com/api/status
# Expected: 200 OK, JSON response
```

### 3. Test User App Previews
```bash
# Example user app preview
curl -I https://test-app.app.getdreamforge.com/
# Expected: 200 OK or 404 if no app deployed
```

## SSL/TLS Configuration

Cloudflare automatically handles SSL/TLS certificates for:
- Root domain (`getdreamforge.com`)
- All subdomains (`app.getdreamforge.com`, `*.app.getdreamforge.com`)

**Recommended SSL/TLS Settings:**
1. Go to: Cloudflare Dashboard → getdreamforge.com → SSL/TLS
2. Set SSL/TLS encryption mode: **Full (strict)**
3. Enable: **Always Use HTTPS**
4. Enable: **Automatic HTTPS Rewrites**
5. Minimum TLS Version: **TLS 1.2**

## Cloudflare Dashboard Steps

### Step 1: Add DNS Records
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account and the `getdreamforge.com` zone
3. Navigate to **DNS** → **Records**
4. Click **Add record** and add each DNS record listed above

### Step 2: Verify Worker Routes
1. In the same zone, navigate to **Workers Routes**
2. Verify the routes match those in `wrangler.jsonc`
3. If not present, they will be automatically added on deployment

### Step 3: Test Deployment
After running `npm run deploy` or triggering the GitHub Actions workflow:

1. Visit https://getdreamforge.com/ (should show individual landing page)
2. Visit https://getdreamforge.com/dream-builder (should show enterprise page)
3. Visit https://app.getdreamforge.com/ (should show React app)

## Troubleshooting

### Issue: "DNS resolution error" or "This site can't be reached"
**Solution:** DNS propagation can take 5-60 minutes. Use [DNS Checker](https://dnschecker.org) to verify propagation.

### Issue: Landing pages show 404
**Possible causes:**
1. Landing pages not copied to `dist/marketing/` during build
2. Worker routing logic not deployed
3. Routes not configured in wrangler.jsonc

**Solution:**
```bash
# Rebuild and redeploy
npm run build
npm run deploy

# Check dist directory structure
ls -la dist/marketing/
ls -la dist/marketing/dream-builder/
```

### Issue: React app shows on marketing domain
**Solution:**
- Clear Cloudflare cache: Dashboard → Caching → Purge Everything
- Verify Worker routing logic in `worker/index.ts`
- Check `isMarketingDomain` and `isAppDomain` logic

### Issue: SSL/TLS errors
**Solution:**
- Ensure SSL/TLS mode is set to "Full (strict)" in Cloudflare Dashboard
- Verify DNS records are proxied (orange cloud)
- Wait 15 minutes for certificate provisioning

## Development / Local Testing

To test the landing pages locally before deploying:

### Option 1: Test with Wrangler Dev
```bash
npm run local
# Access marketing pages at: http://localhost:8787/marketing/
# Access app at: http://localhost:8787/
```

### Option 2: Test with Static Server
```bash
# Build first
npm run build

# Serve dist directory
npx serve dist

# Marketing pages: http://localhost:3000/marketing/
# App: http://localhost:3000/
```

### Option 3: Update /etc/hosts for Domain Testing
Add to `/etc/hosts`:
```
127.0.0.1 getdreamforge.com
127.0.0.1 app.getdreamforge.com
```

Then run:
```bash
npm run local
```

Access:
- http://getdreamforge.com:8787/ (marketing)
- http://app.getdreamforge.com:8787/ (app)

## Deployment Checklist

Before deploying to production:

- [ ] DNS records configured in Cloudflare Dashboard
- [ ] SSL/TLS set to "Full (strict)"
- [ ] Landing pages built and present in `dist/marketing/`
- [ ] Worker routes configured in `wrangler.jsonc`
- [ ] Environment variables set in Cloudflare Dashboard (Secrets)
- [ ] GitHub Actions secrets configured (if using CI/CD)
- [ ] Test build locally: `npm run build`
- [ ] Deploy: `npm run deploy`
- [ ] Verify all three URLs work correctly
- [ ] Check browser console for errors
- [ ] Test on mobile devices

## Monitoring & Analytics

Consider adding:
1. **Cloudflare Web Analytics** (privacy-friendly, no cookies)
2. **Google Analytics 4** (already added in landing page HTML)
3. **Cloudflare Logpush** for Worker logs

To view Worker logs in real-time:
```bash
npx wrangler tail
```

## Further Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- [Custom Domains for Workers](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Wrangler Routes](https://developers.cloudflare.com/workers/wrangler/configuration/#routes)
