ALTER TABLE `users` ADD `role` text DEFAULT 'user' NOT NULL;--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);--> statement-breakpoint
-- Bootstrap the platform owner (existing operator account) as superadmin.
UPDATE `users` SET `role` = 'superadmin' WHERE `id` = '0d7fc30b-d9d1-4211-b7cd-50435671cfc8';