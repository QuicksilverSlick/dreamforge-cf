CREATE TABLE `impersonation_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_user_id` text NOT NULL,
	`actor_role` text NOT NULL,
	`target_user_id` text NOT NULL,
	`session_id` text NOT NULL,
	`reason` text NOT NULL,
	`read_only` integer DEFAULT false NOT NULL,
	`issued_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`absolute_expires_at` integer NOT NULL,
	`extend_count` integer DEFAULT 0 NOT NULL,
	`is_revoked` integer DEFAULT false NOT NULL,
	`revoked_at` integer,
	`ended_reason` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `impersonation_sessions_session_active_idx` ON `impersonation_sessions` (`session_id`,`is_revoked`);--> statement-breakpoint
CREATE INDEX `impersonation_sessions_actor_idx` ON `impersonation_sessions` (`actor_user_id`);--> statement-breakpoint
CREATE INDEX `impersonation_sessions_target_idx` ON `impersonation_sessions` (`target_user_id`);