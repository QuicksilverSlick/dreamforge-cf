PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_apps` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`icon_url` text,
	`original_prompt` text NOT NULL,
	`final_prompt` text,
	`framework` text,
	`user_id` text,
	`org_id` text NOT NULL,
	`session_token` text,
	`visibility` text DEFAULT 'private' NOT NULL,
	`status` text DEFAULT 'generating' NOT NULL,
	`deployment_id` text,
	`github_repository_url` text,
	`github_repository_visibility` text,
	`is_archived` integer DEFAULT false,
	`is_featured` integer DEFAULT false,
	`version` integer DEFAULT 1,
	`parent_app_id` text,
	`screenshot_url` text,
	`screenshot_captured_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`last_deployed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_apps`("id", "title", "description", "icon_url", "original_prompt", "final_prompt", "framework", "user_id", "org_id", "session_token", "visibility", "status", "deployment_id", "github_repository_url", "github_repository_visibility", "is_archived", "is_featured", "version", "parent_app_id", "screenshot_url", "screenshot_captured_at", "created_at", "updated_at", "last_deployed_at") SELECT "id", "title", "description", "icon_url", "original_prompt", "final_prompt", "framework", "user_id", "org_id", "session_token", "visibility", "status", "deployment_id", "github_repository_url", "github_repository_visibility", "is_archived", "is_featured", "version", "parent_app_id", "screenshot_url", "screenshot_captured_at", "created_at", "updated_at", "last_deployed_at" FROM `apps`;--> statement-breakpoint
DROP TABLE `apps`;--> statement-breakpoint
ALTER TABLE `__new_apps` RENAME TO `apps`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `apps_user_idx` ON `apps` (`user_id`);--> statement-breakpoint
CREATE INDEX `apps_org_idx` ON `apps` (`org_id`);--> statement-breakpoint
CREATE INDEX `apps_org_created_at_idx` ON `apps` (`org_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `apps_status_idx` ON `apps` (`status`);--> statement-breakpoint
CREATE INDEX `apps_visibility_idx` ON `apps` (`visibility`);--> statement-breakpoint
CREATE INDEX `apps_session_token_idx` ON `apps` (`session_token`);--> statement-breakpoint
CREATE INDEX `apps_parent_app_idx` ON `apps` (`parent_app_id`);--> statement-breakpoint
CREATE INDEX `apps_search_idx` ON `apps` (`title`,`description`);--> statement-breakpoint
CREATE INDEX `apps_framework_status_idx` ON `apps` (`framework`,`status`);--> statement-breakpoint
CREATE INDEX `apps_visibility_status_idx` ON `apps` (`visibility`,`status`);--> statement-breakpoint
CREATE INDEX `apps_created_at_idx` ON `apps` (`created_at`);--> statement-breakpoint
CREATE INDEX `apps_updated_at_idx` ON `apps` (`updated_at`);