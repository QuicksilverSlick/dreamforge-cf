CREATE TABLE `org_invitations` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`invitee_email` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`token_hash` text NOT NULL,
	`inviter_user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`expires_at` integer NOT NULL,
	`accepted_at` integer,
	`accepted_user_id` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`inviter_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`accepted_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `org_invitations_token_hash_idx` ON `org_invitations` (`token_hash`);--> statement-breakpoint
CREATE INDEX `org_invitations_org_email_idx` ON `org_invitations` (`org_id`,`invitee_email`);--> statement-breakpoint
CREATE INDEX `org_invitations_expires_at_idx` ON `org_invitations` (`expires_at`);--> statement-breakpoint
CREATE INDEX `org_invitations_org_idx` ON `org_invitations` (`org_id`);--> statement-breakpoint
ALTER TABLE `sessions` ADD `current_org_id` text REFERENCES organizations(id);--> statement-breakpoint
CREATE INDEX `sessions_current_org_id_idx` ON `sessions` (`current_org_id`);--> statement-breakpoint
-- Phase 2.2 backfill (idempotent): point every existing session at its user's
-- personal org so per-request active-org resolution has a value before the user
-- ever switches. Re-runnable; no-ops on an empty sessions table (so the vitest
-- D1 harness applies it harmlessly) and on rows already set. Mirrors the 0009
-- backfill convention.
UPDATE `sessions`
SET `current_org_id` = (
	SELECT o.`id` FROM `organizations` o
	WHERE o.`owner_user_id` = `sessions`.`user_id` AND o.`is_personal` = 1
)
WHERE `current_org_id` IS NULL
  AND EXISTS (
	SELECT 1 FROM `organizations` o
	WHERE o.`owner_user_id` = `sessions`.`user_id` AND o.`is_personal` = 1
  );