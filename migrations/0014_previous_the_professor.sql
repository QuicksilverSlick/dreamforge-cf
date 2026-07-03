CREATE TABLE `billing_customers` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`user_id` text NOT NULL,
	`stripe_customer_id` text NOT NULL,
	`email` text,
	`currency` text DEFAULT 'usd' NOT NULL,
	`delinquent` integer DEFAULT false NOT NULL,
	`dispute_frozen` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `billing_customers_org_unique` ON `billing_customers` (`org_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `billing_customers_stripe_customer_unique` ON `billing_customers` (`stripe_customer_id`);--> statement-breakpoint
CREATE INDEX `billing_customers_user_idx` ON `billing_customers` (`user_id`);--> statement-breakpoint
CREATE TABLE `credit_ledger` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`user_id` text,
	`kind` text NOT NULL,
	`action_type` text,
	`delta` integer NOT NULL,
	`balance_after` integer NOT NULL,
	`idempotency_key` text NOT NULL,
	`lot_kind` text,
	`draws_from_lot_id` text,
	`expires_at` integer,
	`stripe_event_id` text,
	`stripe_invoice_id` text,
	`stripe_charge_id` text,
	`subscription_id` text,
	`agent_id` text,
	`model_name` text,
	`reason` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `credit_ledger_idempotency_unique` ON `credit_ledger` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `credit_ledger_org_created_idx` ON `credit_ledger` (`org_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `credit_ledger_org_kind_idx` ON `credit_ledger` (`org_id`,`kind`);--> statement-breakpoint
CREATE INDEX `credit_ledger_lot_idx` ON `credit_ledger` (`draws_from_lot_id`);--> statement-breakpoint
CREATE INDEX `credit_ledger_expires_at_idx` ON `credit_ledger` (`expires_at`);--> statement-breakpoint
CREATE INDEX `credit_ledger_stripe_event_idx` ON `credit_ledger` (`stripe_event_id`);--> statement-breakpoint
CREATE TABLE `stripe_webhook_events` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`api_version` text,
	`status` text DEFAULT 'received' NOT NULL,
	`error` text,
	`received_at` integer DEFAULT CURRENT_TIMESTAMP,
	`processed_at` integer
);
--> statement-breakpoint
CREATE INDEX `stripe_webhook_events_type_idx` ON `stripe_webhook_events` (`type`);--> statement-breakpoint
CREATE INDEX `stripe_webhook_events_status_idx` ON `stripe_webhook_events` (`status`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`billing_customer_id` text NOT NULL,
	`stripe_subscription_id` text NOT NULL,
	`stripe_price_id` text NOT NULL,
	`plan_key` text NOT NULL,
	`status` text NOT NULL,
	`monthly_credit_allotment` integer DEFAULT 0 NOT NULL,
	`cancel_at_period_end` integer DEFAULT false NOT NULL,
	`current_period_start` integer,
	`current_period_end` integer,
	`canceled_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`billing_customer_id`) REFERENCES `billing_customers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_stripe_sub_unique` ON `subscriptions` (`stripe_subscription_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_org_idx` ON `subscriptions` (`org_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_customer_idx` ON `subscriptions` (`billing_customer_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_status_idx` ON `subscriptions` (`status`);--> statement-breakpoint
CREATE INDEX `subscriptions_period_end_idx` ON `subscriptions` (`current_period_end`);--> statement-breakpoint
ALTER TABLE `users` ADD `use_own_cloudflare_credits` integer DEFAULT false NOT NULL;--> statement-breakpoint
-- Backfill (billing spec §7.6): any user already routing through a connected
-- Cloudflare gateway keeps BYO routing after the CF-OAuth demotion, instead of
-- being silently moved onto platform billing. An active ai_gateways row is the
-- "connected + selected" signal (mirrors hasCloudflareConfigured()).
UPDATE `users` SET `use_own_cloudflare_credits` = 1 WHERE `id` IN (SELECT DISTINCT `user_id` FROM `ai_gateways` WHERE `is_active` = 1);