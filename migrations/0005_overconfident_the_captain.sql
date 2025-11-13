CREATE TABLE `blueprint_cache` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`repository_url` text NOT NULL,
	`repository_name` text NOT NULL,
	`branch` text NOT NULL,
	`blueprint` text NOT NULL,
	`completeness_percentage` integer NOT NULL,
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
CREATE INDEX `blueprint_cache_expires_at_idx` ON `blueprint_cache` (`expires_at`);