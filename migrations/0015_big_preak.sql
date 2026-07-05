CREATE TABLE `produce_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`company` text,
	`tier` text NOT NULL,
	`project_description` text NOT NULL,
	`source` text,
	`status` text DEFAULT 'new' NOT NULL,
	`ack_sent` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `produce_applications_email_idx` ON `produce_applications` (`email`);--> statement-breakpoint
CREATE INDEX `produce_applications_status_idx` ON `produce_applications` (`status`);--> statement-breakpoint
CREATE INDEX `produce_applications_created_idx` ON `produce_applications` (`created_at`);