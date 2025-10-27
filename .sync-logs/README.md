# Dreamforge Upstream Sync Logs

This directory contains detailed logs of all upstream syncs with the [cloudflare/vibesdk](https://github.com/cloudflare/vibesdk) repository.

## 📁 Directory Structure

```
.sync-logs/
├── README.md                    # This file
├── sync_YYYYMMDD_HHMMSS/       # Individual sync logs (timestamped)
│   ├── sync_log.md             # Detailed sync report
│   ├── files_changed.txt       # List of files changed
│   ├── branding_files.txt      # Branding files preserved
│   ├── conflicts.txt           # Merge conflicts (if any)
│   ├── full_diff.patch         # Complete diff of changes
│   └── merge_preview.txt       # Dry-run merge preview
└── .gitkeep
```

## 🔄 Sync Workflow

### Manual Sync via GitHub Actions

1. Go to: **Actions** → **Manual Upstream Sync with Logging**
2. Click **Run workflow**
3. Choose sync options:
   - **Sync Type:**
     - `dry-run` - Preview changes without applying them
     - `sync-all` - Sync all files (with branding preservation)
     - `sync-selective` - Sync only non-branding files
   - **Create Backup:** Always recommended (creates `backup/pre-sync-*` branch)
   - **Preserve Branding:** Keep Dreamforge logos, configs, auth changes

### What Gets Logged

Each sync creates a timestamped directory with:

1. **Pre-Sync State**
   - Current commit hash
   - Upstream latest commit
   - Divergence statistics
   - List of new upstream commits
   - Dreamforge-specific commits

2. **Branding Files Preserved**
   - Logo/icon files
   - Configuration files
   - Custom auth implementation
   - Deployment workflows

3. **Sync Execution**
   - Files modified
   - Merge conflicts (if any)
   - Changes summary
   - Full diff patch

4. **Rollback Information**
   - Backup branch name
   - Restore commands
   - Revert instructions

## 🛡️ Branding Protection

The following files are **automatically preserved** during sync:

### Assets & Branding
- `src/assets/icon.png`
- `src/assets/logo.png`
- `public/dreamforge-icon.png`
- `public/dreamforge-logo.png`
- `public/favicon.ico`

### Configuration
- `wrangler.jsonc` - Custom domain, database, secrets
- `package.json` - Project name and metadata
- `README.md` - Dreamforge documentation

### Custom Features
- `worker/api/controllers/auth/controller.ts` - Multi-auth support
- `.github/workflows/deploy.yml` - Deployment configuration
- `.github/workflows/upstream-notifications.yml` - Notification system

### UI Components
- `src/components/header.tsx`
- `src/components/layout/header.tsx`

## 🔙 Rollback Procedures

### Option 1: Reset to Backup Branch

```bash
# Fetch the backup branch
git fetch origin

# Reset to backup (replace TIMESTAMP with actual timestamp)
git reset --hard origin/backup/pre-sync-TIMESTAMP

# Force push to main (⚠️ use with caution)
git push origin main --force
```

### Option 2: Revert Sync Commit

```bash
# Revert the most recent sync commit
git revert HEAD

# Push the revert
git push origin main
```

### Option 3: Cherry-Pick Specific Fixes

```bash
# If you want to keep some changes but not others
git log  # Find the commit hashes you want

# Cherry-pick specific commits
git cherry-pick <commit-hash>

# Push changes
git push origin main
```

## 📊 Sync History

| Date | Type | Commits Synced | Status | Backup Branch | Notes |
|------|------|---------------|--------|---------------|-------|
| *Logs will appear here after first sync* |

## 🧪 Post-Sync Testing Checklist

After every sync, test the following:

- [ ] **Build:** `npm run build` succeeds
- [ ] **Deploy:** `npm run deploy` works
- [ ] **Auth:** Google OAuth login functional
- [ ] **Auth:** Email/password registration works
- [ ] **Auth:** Email/password login works
- [ ] **Branding:** Dreamforge logos visible
- [ ] **Branding:** No vibesdk references in UI
- [ ] **Code Gen:** AI code generation functional
- [ ] **Console:** No JavaScript errors

## 🔍 Comparing Sync Logs

### View Changes Between Two Syncs

```bash
# Compare two sync logs
diff .sync-logs/sync_20251024_120000/sync_log.md \
     .sync-logs/sync_20251024_150000/sync_log.md
```

### Search for Specific File Changes

```bash
# Find all syncs that modified a specific file
grep -r "src/components/auth/login-modal.tsx" .sync-logs/*/files_changed.txt
```

### View Conflict History

```bash
# List all syncs that had conflicts
find .sync-logs -name "conflicts.txt" -type f -exec echo {} \; -exec cat {} \;
```

## 📝 Manual Sync (Local)

If you need to sync locally:

```bash
# 1. Create backup branch
git checkout -b backup/manual-sync-$(date +%Y%m%d_%H%M%S)
git push origin HEAD

# 2. Switch back to main
git checkout main

# 3. Fetch upstream
git remote add upstream https://github.com/cloudflare/vibesdk.git || true
git fetch upstream main

# 4. Create sync log directory
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p .sync-logs/sync_${TIMESTAMP}

# 5. Generate pre-sync log
git log -1 > .sync-logs/sync_${TIMESTAMP}/pre_sync.txt
git log --oneline HEAD..upstream/main > .sync-logs/sync_${TIMESTAMP}/new_commits.txt

# 6. Attempt merge
git merge upstream/main --no-commit --no-ff

# 7. Restore branding files
git checkout HEAD -- src/assets/icon.png
git checkout HEAD -- src/assets/logo.png
git checkout HEAD -- public/dreamforge-icon.png
git checkout HEAD -- public/dreamforge-logo.png
git checkout HEAD -- wrangler.jsonc
git checkout HEAD -- worker/api/controllers/auth/controller.ts
# ... add more as needed

# 8. Review and commit
git status
git diff
git commit -m "feat: sync with upstream vibesdk - ${TIMESTAMP}"

# 9. Generate post-sync log
git log -1 > .sync-logs/sync_${TIMESTAMP}/post_sync.txt
git diff HEAD~1 > .sync-logs/sync_${TIMESTAMP}/changes.patch

# 10. Push
git push origin main
```

## 🚨 Emergency Rollback

If production breaks after a sync:

```bash
# IMMEDIATE: Redeploy previous backup
git fetch origin
git reset --hard origin/backup/pre-sync-<TIMESTAMP>
npm run deploy

# Then investigate the logs to find the issue
cat .sync-logs/sync_<TIMESTAMP>/sync_log.md
```

## 📧 Notifications

The sync workflow automatically:
- Creates a GitHub issue with rollback instructions
- Uploads logs as workflow artifacts (90-day retention)
- Adds entry to GitHub Actions summary

## 🔗 Related Workflows

- **Upstream Notifications** (`.github/workflows/upstream-notifications.yml`)
  - Runs weekly on Monday 9 AM UTC
  - Checks for new upstream commits
  - Creates GitHub issues for review

- **Manual Upstream Sync** (`.github/workflows/upstream-sync-manual.yml`)
  - Manual trigger only
  - Creates detailed logs
  - Preserves branding
  - Creates backup branches

## 📚 References

- Upstream Repository: https://github.com/cloudflare/vibesdk
- Dreamforge Repository: https://github.com/QuicksilverSlick/dreamforge-cf
- Sync Workflow: `.github/workflows/upstream-sync-manual.yml`

---

**Last Updated:** 2025-10-24
**Maintainer:** Dreamforge Team
