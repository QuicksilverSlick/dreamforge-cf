/**
 * Request validation for the organization-management API.
 *
 * Invite role is restricted to admin|member here: ownership is granted only via
 * an explicit role change by an existing owner (updateMemberRole), never minted
 * through an invitation. The service layer defends the same rule independently.
 */

import { z } from 'zod';

export const createTeamBodySchema = z.object({
    name: z.string().trim().min(1, 'Organization name is required').max(100, 'Name must be 100 characters or fewer'),
});
export type CreateTeamBody = z.infer<typeof createTeamBodySchema>;

export const switchOrgBodySchema = z.object({
    orgId: z.string().trim().min(1, 'orgId is required'),
});
export type SwitchOrgBody = z.infer<typeof switchOrgBodySchema>;

export const inviteBodySchema = z.object({
    email: z.string().trim().email('A valid email address is required').max(255),
    role: z.enum(['admin', 'member']).default('member'),
});
export type InviteBody = z.infer<typeof inviteBodySchema>;

export const renameOrgBodySchema = z.object({
    name: z.string().trim().min(1, 'Organization name is required').max(100, 'Name must be 100 characters or fewer'),
});
export type RenameOrgBody = z.infer<typeof renameOrgBodySchema>;

export const updateMemberRoleBodySchema = z.object({
    role: z.enum(['owner', 'admin', 'member']),
});
export type UpdateMemberRoleBody = z.infer<typeof updateMemberRoleBodySchema>;
