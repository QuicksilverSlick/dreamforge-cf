CREATE TABLE `blueprint_cache` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`repository_url` text NOT NULL,
	`repository_name` text NOT NULL,
	`branch` text NOT NULL,
	`blueprint` text NOT NULL,
	`completeness_percentage` integer NOT NULL,
	`file_contents_r2_key` text,
	`file_count` integer,
	`total_lines_of_code` integer,
	`framework` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`expires_at` integer NOT NULL,
	`access_count` integer DEFAULT 0,
	`last_accessed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `blueprint_cache_user_idx` ON `blueprint_cache` (`user_id`);--> statement-breakpoint
CREATE INDEX `blueprint_cache_repository_idx` ON `blueprint_cache` (`repository_url`,`branch`);--> statement-breakpoint
CREATE INDEX `blueprint_cache_expires_at_idx` ON `blueprint_cache` (`expires_at`);--> statement-breakpoint
CREATE TABLE `github_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`encrypted_access_token` text NOT NULL,
	`token_type` text DEFAULT 'bearer' NOT NULL,
	`scopes` text NOT NULL,
	`expires_at` integer,
	`last_used` integer,
	`is_active` integer DEFAULT true,
	`is_revoked` integer DEFAULT false,
	`revoked_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `github_tokens_user_idx` ON `github_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `github_tokens_is_active_idx` ON `github_tokens` (`is_active`);--> statement-breakpoint
CREATE INDEX `github_tokens_last_used_idx` ON `github_tokens` (`last_used`);