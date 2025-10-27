# 🔄 Dreamforge Upstream Sync Guide

Quick reference for syncing with [cloudflare/vibesdk](https://github.com/cloudflare/vibesdk) upstream repository.

## 🚀 Quick Start

### Run Sync via GitHub Actions

1. Go to: https://github.com/QuicksilverSlick/dreamforge-cf/actions
2. Select **"Manual Upstream Sync with Logging"**
3. Click **"Run workflow"**
4. **Recommended settings for first sync:**
   - Sync type: `dry-run`
   - Create backup: ✅ Yes
   - Preserve branding: ✅ Yes

## 📋 Current Status

**Last checked:** 2025-10-24

- **Commits behind upstream:** 359
- **Dreamforge-specific commits:** 35
- **Diverged since:** Initial fork

## 🎯 Sync Options

### Dry Run (RECOMMENDED FIRST)
```
✓ Preview what would change
✓ No actual changes made
✓ Review conflicts before syncing
✓ Zero risk
```

**Use this to:**
- See what's changed upstream
- Identify potential conflicts
- Plan which files to sync

### Sync All
```
✓ Syncs all upstream changes
✓ Preserves Dreamforge branding (if enabled)
✓ Creates backup branch
⚠️ May have merge conflicts
```

**Use this when:**
- You want all upstream improvements
- You're confident in the changes
- You've reviewed the dry-run results

### Sync Selective
```
✓ Syncs only non-branding files
✓ Maximum branding preservation
✓ Safer than sync-all
⚠️ More manual work
```

**Use this when:**
- You want to be extra careful
- Branding conflicts in dry-run
- Piecemeal sync preferred

## 🛡️ What's Protected

The sync system **automatically preserves**:

### 🎨 Branding
- Dreamforge logos (PNG files)
- Dreamforge icons
- Brand colors and styling

### ⚙️ Configuration
- Custom domain (`app.getdreamforge.com`)
- Database name (`vibesdk-db`)
- Secrets and environment variables
- Deployment settings

### 🔐 Custom Features
- Multi-authentication (OAuth + email/password)
- Email whitelisting disabled
- Custom auth controller modifications

### 🚀 CI/CD
- Manual deploy workflow
- Upstream notification system
- Custom GitHub Actions

## 📊 What You'll Get from Upstream

Based on the 359 commits you're behind, upstream includes:

### Recent Major Features
- **Phase Context Optimization** - Reduces AI token usage
- **Image Upload Improvements** - Better R2 + Cloudflare Images handling
- **Conversation History** - Separate Durable Object storage
- **Local Development Fixes** - WARP compatibility improvements
- **CSRF Token Refresh** - Better security after register/login

### Bug Fixes
- Database migration improvements
- Tracing deployment fixes
- Frontend type improvements
- Filename handling in R2

## 🔙 Rollback (If Needed)

### Instant Rollback
```bash
# Emergency rollback to backup
git fetch origin
git reset --hard origin/backup/pre-sync-TIMESTAMP
git push origin main --force
npm run deploy
```

### Surgical Rollback
```bash
# Revert just the sync commit
git revert HEAD
git push origin main
npm run deploy
```

## 🧪 Post-Sync Testing

Run this checklist after every sync:

```bash
# 1. Build test
npm run build

# 2. Local test
npm run local

# 3. Visit http://localhost:3000 and test:
# - Google OAuth login
# - Email/password registration
# - Email/password login
# - Code generation
# - Dreamforge branding visible

# 4. Deploy to production
npm run deploy

# 5. Test production
# Visit https://app.getdreamforge.com
```

## 📝 Sync Logs

Every sync creates detailed logs in `.sync-logs/sync_TIMESTAMP/`:

- `sync_log.md` - Complete sync report
- `files_changed.txt` - All modified files
- `conflicts.txt` - Merge conflicts (if any)
- `full_diff.patch` - Complete diff
- `branding_files.txt` - Protected files list

## 🔔 Automatic Notifications

You have a weekly notification system:
- **Runs:** Every Monday 9 AM UTC
- **Checks:** New upstream commits
- **Creates:** GitHub issue with details
- **Workflow:** `.github/workflows/upstream-notifications.yml`

## 🎓 Best Practices

### First Time Syncing
1. **Always start with dry-run**
2. Review the diff carefully
3. Check for breaking changes in release notes
4. Test thoroughly after sync

### Regular Syncing
1. Sync weekly or bi-weekly
2. Stay close to upstream (easier merges)
3. Document any manual conflict resolutions
4. Keep branding files list updated

### Before Major Releases
1. Sync with upstream first
2. Test all features
3. Create release branch
4. Deploy to production

## 🚨 Common Issues

### Issue: Merge Conflicts
**Solution:**
1. Check `.sync-logs/sync_TIMESTAMP/conflicts.txt`
2. Manually resolve conflicts
3. Run `git add .` and `git commit`

### Issue: Branding Overwritten
**Solution:**
1. Check if file is in branding_files.txt
2. If not, add it and re-run sync
3. Or manually restore: `git checkout HEAD -- file.ext`

### Issue: Build Fails After Sync
**Solution:**
1. Check sync log for dependency changes
2. Run `npm install` (or `bun install`)
3. Review breaking changes in upstream commits

### Issue: Tests Failing
**Solution:**
1. Upstream might have new test requirements
2. Review test files in diff
3. Update tests to match new code

## 📞 Getting Help

If sync fails or you're unsure:

1. **Check Logs:** `.sync-logs/sync_TIMESTAMP/sync_log.md`
2. **Check Issues:** GitHub issues labeled `upstream-sync`
3. **Rollback:** Use backup branch if needed
4. **Manual Sync:** Follow manual procedure in `.sync-logs/README.md`

## 🔗 Quick Links

- **Run Sync:** https://github.com/QuicksilverSlick/dreamforge-cf/actions
- **Upstream Repo:** https://github.com/cloudflare/vibesdk
- **Sync Logs:** `.sync-logs/`
- **Workflow File:** `.github/workflows/upstream-sync-manual.yml`
- **Detailed Guide:** `.sync-logs/README.md`

---

**Pro Tip:** Run a dry-run every week to stay informed about upstream changes, even if you don't sync immediately.

**Next Steps:**
1. ✅ Dry-run to see what's changed
2. ✅ Review the 359 commits in the log
3. ✅ Decide: sync-all or sync-selective
4. ✅ Execute sync with backups enabled
5. ✅ Test thoroughly
6. ✅ Deploy to production
