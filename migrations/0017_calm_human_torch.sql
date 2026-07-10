ALTER TABLE `impersonation_sessions` ADD `active_org_id` text REFERENCES organizations(id) ON DELETE SET NULL;
