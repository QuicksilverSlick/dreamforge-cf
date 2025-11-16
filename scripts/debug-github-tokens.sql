-- GitHub Tokens Debug Script
-- Use: npx wrangler d1 execute DB --local --file=scripts/debug-github-tokens.sql
-- Or: npx wrangler d1 execute DB --remote --file=scripts/debug-github-tokens.sql

-- ============================================================================
-- 1. VERIFY TABLE STRUCTURE
-- ============================================================================
SELECT sql FROM sqlite_master WHERE type='table' AND name='github_tokens';

-- ============================================================================
-- 2. AGGREGATE STATISTICS
-- ============================================================================
SELECT
    COUNT(*) as total_tokens,
    COUNT(DISTINCT user_id) as unique_users,
    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_tokens,
    SUM(CASE WHEN is_revoked = 1 THEN 1 ELSE 0 END) as revoked_tokens,
    SUM(CASE WHEN is_active = 1 AND is_revoked = 0 THEN 1 ELSE 0 END) as valid_tokens
FROM github_tokens;

-- ============================================================================
-- 3. RECENT USERS WITH OAUTH PROVIDERS
-- ============================================================================
SELECT
    id,
    email,
    display_name,
    provider,
    email_verified,
    created_at,
    updated_at
FROM users
WHERE provider = 'github'
ORDER BY created_at DESC
LIMIT 10;

-- ============================================================================
-- 4. ALL GITHUB TOKENS WITH USER INFO
-- ============================================================================
SELECT
    gt.id as token_id,
    gt.user_id,
    u.email,
    u.display_name,
    gt.token_type,
    gt.scopes,
    gt.is_active,
    gt.is_revoked,
    gt.created_at,
    gt.updated_at,
    gt.last_used,
    CASE
        WHEN gt.is_active = 1 AND gt.is_revoked = 0 THEN 'VALID'
        WHEN gt.is_active = 0 THEN 'INACTIVE'
        WHEN gt.is_revoked = 1 THEN 'REVOKED'
        ELSE 'UNKNOWN'
    END as status
FROM github_tokens gt
LEFT JOIN users u ON gt.user_id = u.id
ORDER BY gt.created_at DESC
LIMIT 20;

-- ============================================================================
-- 5. TOKENS PER USER SUMMARY
-- ============================================================================
SELECT
    u.email,
    u.provider,
    COUNT(gt.id) as total_tokens,
    SUM(CASE WHEN gt.is_active = 1 AND gt.is_revoked = 0 THEN 1 ELSE 0 END) as valid_tokens,
    MAX(gt.created_at) as latest_token_created
FROM users u
LEFT JOIN github_tokens gt ON u.id = gt.user_id
WHERE u.provider = 'github'
GROUP BY u.id, u.email, u.provider
ORDER BY latest_token_created DESC;

-- ============================================================================
-- 6. DATA INTEGRITY ISSUES
-- ============================================================================

-- 6a. Users with multiple active tokens (should only have 1)
SELECT
    user_id,
    COUNT(*) as active_token_count,
    GROUP_CONCAT(id) as token_ids
FROM github_tokens
WHERE is_active = 1 AND is_revoked = 0
GROUP BY user_id
HAVING COUNT(*) > 1;

-- 6b. Orphaned tokens (user deleted but token remains - shouldn't happen with CASCADE)
SELECT
    gt.id,
    gt.user_id,
    gt.created_at
FROM github_tokens gt
LEFT JOIN users u ON gt.user_id = u.id
WHERE u.id IS NULL;

-- ============================================================================
-- 7. RECENT ACTIVITY (Last 7 days)
-- ============================================================================
SELECT
    DATE(created_at) as date,
    COUNT(*) as tokens_created,
    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as still_active
FROM github_tokens
WHERE created_at >= datetime('now', '-7 days')
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================================================
-- 8. FOREIGN KEY CONSTRAINT VERIFICATION
-- ============================================================================
PRAGMA foreign_keys;
PRAGMA foreign_key_check(github_tokens);
