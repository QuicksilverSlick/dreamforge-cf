CREATE TABLE `organization_members` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organization_members_org_user_idx` ON `organization_members` (`org_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `organization_members_org_idx` ON `organization_members` (`org_id`);--> statement-breakpoint
CREATE INDEX `organization_members_user_idx` ON `organization_members` (`user_id`);--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`plan` text DEFAULT 'free' NOT NULL,
	`is_personal` integer DEFAULT true NOT NULL,
	`owner_user_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_slug_unique` ON `organizations` (`slug`);--> statement-breakpoint
CREATE INDEX `organizations_owner_idx` ON `organizations` (`owner_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_owner_personal_unique` ON `organizations` (`owner_user_id`) WHERE is_personal = 1;--> statement-breakpoint
ALTER TABLE `ai_gateways` ADD `org_id` text REFERENCES organizations(id);--> statement-breakpoint
CREATE INDEX `ai_gateways_org_idx` ON `ai_gateways` (`org_id`);--> statement-breakpoint
ALTER TABLE `apps` ADD `org_id` text REFERENCES organizations(id);--> statement-breakpoint
CREATE INDEX `apps_org_idx` ON `apps` (`org_id`);--> statement-breakpoint
CREATE INDEX `apps_org_created_at_idx` ON `apps` (`org_id`,`created_at`);--> statement-breakpoint
ALTER TABLE `blueprint_cache` ADD `org_id` text REFERENCES organizations(id);--> statement-breakpoint
CREATE INDEX `blueprint_cache_org_idx` ON `blueprint_cache` (`org_id`);--> statement-breakpoint
ALTER TABLE `cloudflare_accounts` ADD `org_id` text REFERENCES organizations(id);--> statement-breakpoint
CREATE INDEX `cloudflare_accounts_org_idx` ON `cloudflare_accounts` (`org_id`);--> statement-breakpoint
ALTER TABLE `github_tokens` ADD `org_id` text REFERENCES organizations(id);--> statement-breakpoint
CREATE INDEX `github_tokens_org_idx` ON `github_tokens` (`org_id`);--> statement-breakpoint
ALTER TABLE `user_secrets` ADD `org_id` text REFERENCES organizations(id);--> statement-breakpoint
CREATE INDEX `user_secrets_org_idx` ON `user_secrets` (`org_id`);--> statement-breakpoint
-- Phase 2.0 backfill (idempotent): one personal org + owner membership per live
-- user, then stamp orgId on existing user-owned rows. Re-runnable; no-ops on an
-- empty users table (so the vitest D1 harness applies it harmlessly).
INSERT INTO `organizations` (`id`, `name`, `slug`, `plan`, `is_personal`, `owner_user_id`, `created_at`, `updated_at`)
SELECT 'org_' || u.`id`, COALESCE(NULLIF(u.`display_name`, ''), u.`email`) || '''s workspace', 'ws-' || u.`id`, 'free', 1, u.`id`, CAST(strftime('%s','now') AS INTEGER), CAST(strftime('%s','now') AS INTEGER)
FROM `users` u
WHERE u.`deleted_at` IS NULL
  AND NOT EXISTS (SELECT 1 FROM `organizations` o WHERE o.`owner_user_id` = u.`id` AND o.`is_personal` = 1);
--> statement-breakpoint
INSERT INTO `organization_members` (`id`, `org_id`, `user_id`, `role`, `created_at`, `updated_at`)
SELECT 'mem_' || u.`id`, 'org_' || u.`id`, u.`id`, 'owner', CAST(strftime('%s','now') AS INTEGER), CAST(strftime('%s','now') AS INTEGER)
FROM `users` u
WHERE u.`deleted_at` IS NULL
  AND EXISTS (SELECT 1 FROM `organizations` o WHERE o.`id` = 'org_' || u.`id`)
  AND NOT EXISTS (SELECT 1 FROM `organization_members` m WHERE m.`org_id` = 'org_' || u.`id` AND m.`user_id` = u.`id`);
--> statement-breakpoint
UPDATE `apps` SET `org_id` = 'org_' || `user_id` WHERE `user_id` IS NOT NULL AND `org_id` IS NULL AND EXISTS (SELECT 1 FROM `organizations` o WHERE o.`id` = 'org_' || `apps`.`user_id`);
--> statement-breakpoint
UPDATE `blueprint_cache` SET `org_id` = 'org_' || `user_id` WHERE `org_id` IS NULL AND EXISTS (SELECT 1 FROM `organizations` o WHERE o.`id` = 'org_' || `blueprint_cache`.`user_id`);
--> statement-breakpoint
UPDATE `user_secrets` SET `org_id` = 'org_' || `user_id` WHERE `org_id` IS NULL AND EXISTS (SELECT 1 FROM `organizations` o WHERE o.`id` = 'org_' || `user_secrets`.`user_id`);
--> statement-breakpoint
UPDATE `github_tokens` SET `org_id` = 'org_' || `user_id` WHERE `org_id` IS NULL AND EXISTS (SELECT 1 FROM `organizations` o WHERE o.`id` = 'org_' || `github_tokens`.`user_id`);
--> statement-breakpoint
UPDATE `cloudflare_accounts` SET `org_id` = 'org_' || `user_id` WHERE `org_id` IS NULL AND EXISTS (SELECT 1 FROM `organizations` o WHERE o.`id` = 'org_' || `cloudflare_accounts`.`user_id`);
--> statement-breakpoint
UPDATE `ai_gateways` SET `org_id` = 'org_' || `user_id` WHERE `org_id` IS NULL AND EXISTS (SELECT 1 FROM `organizations` o WHERE o.`id` = 'org_' || `ai_gateways`.`user_id`);
