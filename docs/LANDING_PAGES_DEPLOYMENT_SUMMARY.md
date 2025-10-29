# Landing Pages Deployment Summary

## What Was Implemented

This document summarizes the landing page implementation for Dreamforge's dual-domain architecture.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│         getdreamforge.com (Marketing)               │
├─────────────────────────────────────────────────────┤
│  /                → Individual "Vibe Coder" Page    │
│  /dream-builder   → Enterprise Training Page        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│      app.getdreamforge.com (Application)            │
├─────────────────────────────────────────────────────┤
│  /*               → React Application               │
│  /api/*           → API Endpoints                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│    *.app.getdreamforge.com (User Apps)              │
├─────────────────────────────────────────────────────┤
│  /*               → Generated App Previews          │
└─────────────────────────────────────────────────────┘
```

## Files Modified

### 1. Worker Routing (`worker/index.ts`)
**Changes:**
- Added hostname-based routing logic
- Distinguishes between `getdreamforge.com` and `app.getdreamforge.com`
- Rewrites URLs to serve landing pages from `/marketing/` directory in ASSETS
- Routes marketing domain to landing pages, app domain to React app

**Key Logic:**
```typescript
const isMarketingDomain =
    hostname === 'getdreamforge.com' ||
    hostname === 'www.getdreamforge.com';

const isAppDomain =
    hostname === 'app.getdreamforge.com' ||
    hostname === env.CUSTOM_DOMAIN;

if (isMarketingDomain) {
    // Rewrite URL to /marketing/ directory
    // Serve landing pages from ASSETS
}

if (isAppDomain) {
    // Serve React app from ASSETS root
}
```

### 2. Build Process (`package.json`)
**Changes:**
- Updated `build` script to include post-build step
- Now runs: `tsc → vite build → copy-landing-pages.ts`

**Before:**
```json
"build": "./node_modules/.bin/tsc -b --incremental && ./node_modules/.bin/vite build"
```

**After:**
```json
"build": "./node_modules/.bin/tsc -b --incremental && ./node_modules/.bin/vite build && tsx scripts/copy-landing-pages.ts"
```

### 3. Landing Page Copy Script (`scripts/copy-landing-pages.ts`)
**Purpose:**
- Copies landing page files to `dist/marketing/` after Vite build
- Ensures landing pages are included in Worker deployment

**Directory Structure Created:**
```
dist/
├── marketing/
│   ├── index.html           # Individual landing page
│   ├── styles.css
│   ├── script.js
│   └── dream-builder/
│       ├── index.html       # Enterprise landing page
│       ├── styles.css
│       └── script.js
├── index.html               # React app
├── assets/                  # React app bundles
└── ...
```

### 4. Worker Routes (`wrangler.jsonc`)
**Changes:**
- Added routes for `getdreamforge.com` and `www.getdreamforge.com`
- Maintains existing routes for `app.getdreamforge.com`

**Routes Added:**
```jsonc
{
    "pattern": "getdreamforge.com/*",
    "custom_domain": true,
    "zone_id": "157d05cb90f7190794c33e37bef447db"
},
{
    "pattern": "www.getdreamforge.com/*",
    "custom_domain": true,
    "zone_id": "157d05cb90f7190794c33e37bef447db"
}
```

### 5. Documentation Created
- **`docs/CLOUDFLARE_DNS_SETUP.md`** - Complete DNS configuration guide
- **`docs/LANDING_PAGES_DEPLOYMENT_SUMMARY.md`** - This file

## Landing Pages Included

### Individual "Vibe Coder" Landing Page
**Location:** `landing-pages/individuals/`
**URL:** `https://getdreamforge.com/`
**Target Audience:**
- Individuals worried about AI taking jobs
- Aspiring entrepreneurs wanting to monetize apps
- "Vibe coders" seeking recurring income

**Features:**
- StoryBrand 2.0 framework applied
- 11 conversion-optimized sections
- Lead magnet: "The Vibe Coder's Playbook"
- 4 nurture + 1 sales email sequence
- Orange/gold color scheme (energy, empowerment)
- Mobile-first responsive design

### Enterprise Training Landing Page
**Location:** `features/enterprise-landing/`
**URL:** `https://getdreamforge.com/dream-builder`
**Target Audience:**
- Small businesses wanting to train staff
- Companies needing AI upskilling
- Organizations looking for competitive advantage

**Features:**
- StoryBrand 2.0 framework applied
- 10 conversion-optimized sections
- Interactive ROI calculator
- Lead magnet: "5 Apps Every Small Business Should Build First"
- 3 nurture + 1 sales email sequence
- Purple/cyan color scheme (trust, professionalism)
- Team-focused messaging

## Pricing Strategy

### Individual Segment
| Tier | Monthly | Annual | Features |
|------|---------|--------|----------|
| Free | $0 | $0 | 5 projects/month |
| Pro | $27 | $270/yr ($22.47/mo) | Unlimited projects, 10 training hours |
| Ultimate | $47 | $470/yr ($39.14/mo) | Everything + API access |

### Business Segment
| Team Size | Monthly | Per Seat | Discount |
|-----------|---------|----------|----------|
| 1 seat | $297 | $297 | Base (BETA price) |
| 2 seats | $547 | $274 | 8% off |
| 3 seats | $747 | $249 | 16% off |
| 5 seats | $1,097 | $219 | 26% off |
| 10 seats | $1,747 | $175 | 41% off |
| 20+ seats | Custom | $79-89 | Up to 73% off |

**Revenue Projections:**
- Year 1 ARR: $4.4M
- Year 3 ARR: $55.4M
- Break-even: Q3 Year 2

## Deployment Steps

### 1. Build the Application
```bash
npm run build
# or with bun
bun run build
```

This will:
1. Compile TypeScript
2. Build React app with Vite
3. Copy landing pages to `dist/marketing/`

### 2. Deploy to Cloudflare
```bash
npm run deploy
# or trigger GitHub Actions workflow manually
```

### 3. Configure DNS (One-Time Setup)
Follow the instructions in `docs/CLOUDFLARE_DNS_SETUP.md` to:
1. Add DNS records for `getdreamforge.com`, `www`, and `app`
2. Verify Worker routes in Cloudflare Dashboard
3. Configure SSL/TLS to "Full (strict)"

### 4. Verify Deployment
Visit the following URLs:
- https://getdreamforge.com/ → Individual landing page
- https://getdreamforge.com/dream-builder → Enterprise landing page
- https://app.getdreamforge.com/ → React application

## Testing Locally

### Option 1: Wrangler Dev Server
```bash
npm run local
```
Access at:
- http://localhost:8787/marketing/ → Individual page
- http://localhost:8787/marketing/dream-builder/ → Enterprise page
- http://localhost:8787/ → React app

### Option 2: Update /etc/hosts
Add to `/etc/hosts`:
```
127.0.0.1 getdreamforge.com
127.0.0.1 app.getdreamforge.com
```

Then:
```bash
npm run local
```

Access at:
- http://getdreamforge.com:8787/ → Marketing pages
- http://app.getdreamforge.com:8787/ → React app

## What Happens on Request

### Request to `getdreamforge.com/`
1. DNS resolves to Cloudflare Worker
2. Worker receives request with hostname `getdreamforge.com`
3. `isMarketingDomain` = true
4. Worker rewrites URL: `/` → `/marketing/index.html`
5. Worker fetches from ASSETS binding: `dist/marketing/index.html`
6. Individual landing page is served

### Request to `getdreamforge.com/dream-builder`
1. DNS resolves to Cloudflare Worker
2. Worker receives request with hostname `getdreamforge.com`
3. `isMarketingDomain` = true
4. Worker detects path starts with `/dream-builder`
5. Worker rewrites URL: `/dream-builder` → `/marketing/dream-builder/index.html`
6. Worker fetches from ASSETS binding
7. Enterprise landing page is served

### Request to `app.getdreamforge.com/`
1. DNS resolves to Cloudflare Worker
2. Worker receives request with hostname `app.getdreamforge.com`
3. `isAppDomain` = true
4. Worker serves from ASSETS root: `dist/index.html`
5. React application is served

### Request to `app.getdreamforge.com/api/status`
1. DNS resolves to Cloudflare Worker
2. Worker receives request with hostname `app.getdreamforge.com`
3. `isAppDomain` = true
4. Path starts with `/api/`
5. Worker routes to Hono application
6. API response is returned

## Environment Variables

No new environment variables are required for landing pages. Existing variables:

```env
CUSTOM_DOMAIN=app.getdreamforge.com
CUSTOM_PREVIEW_DOMAIN=app.getdreamforge.com
```

These are already configured in `wrangler.jsonc` under `[vars]`.

## Analytics & Tracking

Both landing pages include:
- **Google Analytics 4** tracking code (replace `G-XXXXXXXXXX` with your GA4 ID)
- **Plausible Analytics** ready (uncomment if using)
- Built-in event tracking for:
  - CTA button clicks
  - Email form submissions
  - Scroll depth
  - Video plays (if added)

**To configure:**
1. Open `landing-pages/individuals/index.html`
2. Replace `G-XXXXXXXXXX` with your GA4 measurement ID
3. Repeat for `features/enterprise-landing/index.html`

## Lead Magnets & Email Sequences

Detailed outlines are provided for:
1. **Individual Lead Magnet**: "The Vibe Coder's Playbook" (45-page guide)
   - Location: `landing-pages/individuals/lead-magnet-outline.md`

2. **Enterprise Lead Magnet**: "5 Apps Every Small Business Should Build First"
   - Location: `features/enterprise-landing/lead-magnet-outline.md`

3. **Email Sequences**:
   - Individual: `landing-pages/individuals/email-sequence.md`
   - Enterprise: `features/enterprise-landing/email-sequence.md`

## Next Steps

### Immediate (Pre-Launch)
- [ ] Replace placeholder logo SVG with actual Dreamforge logo
- [ ] Update Google Analytics tracking codes with real IDs
- [ ] Create lead magnet PDFs from provided outlines
- [ ] Set up email marketing platform (ConvertKit, Mailchimp, Resend)
- [ ] Configure DNS records in Cloudflare Dashboard
- [ ] Test deployment on staging environment

### Week 1 (Launch)
- [ ] Deploy to production via GitHub Actions
- [ ] Verify all URLs are accessible
- [ ] Test email capture forms
- [ ] Monitor error rates in Wrangler logs
- [ ] Launch Product Hunt campaigns
- [ ] Share on social media

### Week 2-4 (Optimization)
- [ ] A/B test pricing ($27 vs $25 for Pro tier)
- [ ] A/B test headlines and CTAs
- [ ] Analyze conversion funnel
- [ ] Optimize for Core Web Vitals
- [ ] Gather user feedback
- [ ] Iterate on copy based on data

## Support & Troubleshooting

If issues arise:

1. **Check Worker logs:**
   ```bash
   npx wrangler tail
   ```

2. **Verify build output:**
   ```bash
   ls -la dist/marketing/
   ls -la dist/marketing/dream-builder/
   ```

3. **Test routes locally:**
   ```bash
   npm run local
   # Visit http://localhost:8787/marketing/
   ```

4. **Review DNS configuration:**
   - See `docs/CLOUDFLARE_DNS_SETUP.md`

5. **Clear Cloudflare cache:**
   - Dashboard → Caching → Purge Everything

## Success Metrics (90 Days)

Track these KPIs:

**Traffic:**
- [ ] 10,000+ unique visitors
- [ ] <40% bounce rate
- [ ] >2 min average time on page

**Conversions:**
- [ ] 1,000+ email signups (10% conversion)
- [ ] 75+ paying customers
- [ ] $25,000+ MRR

**Technical:**
- [ ] <2.5s Largest Contentful Paint (LCP)
- [ ] <200ms Interaction to Next Paint (INP)
- [ ] 95+ Lighthouse score
- [ ] 99.9% uptime

## Additional Resources

- **Competitive Analysis**: See root directory for competitor research files
  - `lovable-dev-comprehensive-research-oct-2025.md`
  - `bolt-new-research-2025.md`
  - `V0_COMPREHENSIVE_RESEARCH_REPORT_2025.md`

- **Pricing Strategy**: `dreamforge-pricing-strategy-2025.md`

- **Revenue Projections**: `revenue-projections-detailed.md`

## Questions?

For implementation questions or issues:
1. Check `docs/CLOUDFLARE_DNS_SETUP.md` for DNS/deployment
2. Review Worker logs with `npx wrangler tail`
3. Inspect network requests in browser DevTools
4. Verify environment variables in wrangler.jsonc

---

**Last Updated:** October 29, 2025
**Implementation Status:** ✅ Complete and ready for deployment
