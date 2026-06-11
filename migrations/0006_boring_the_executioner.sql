CREATE UNIQUE INDEX `user_secrets_byok_slot_unique` ON `user_secrets` (`user_id`,`secret_type`) WHERE secret_type LIKE '%\_BYOK' ESCAPE '\';
