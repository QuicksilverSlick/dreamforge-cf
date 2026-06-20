/**
 * Organization Controller — team management endpoints (/api/orgs/*, plus
 * /api/auth/switch-org and /api/invites/:token/accept).
 *
 * Authorization is enforced at the route layer (orgRoutes.ts): member-management
 * routes use AuthConfig.orgAdminOnly (owner/admin of the ACTIVE org === :id),
 * while list-my-orgs / create-team / switch-org / accept-invite are merely
 * authenticated. Every mutation's audit row is written by OrganizationService in
 * the same D1 batch as the state change. Guards (last-owner, owner-manages-
 * owners, personal-org rejection, cross-tenant scoping) live in the service and
 * surface here as OrgActionError → HTTP status.
 */

import { z } from 'zod';
import { BaseController } from '../baseController';
import { RouteContext } from '../../types/route-context';
import { ApiResponse, ControllerResponse } from '../types';
import { createLogger } from '../../../logger';
import { extractRequestMetadata } from '../../../utils/authUtils';
import {
    OrganizationService,
    OrgActionError,
    type OrgInvitationView,
    type OrgMutationContext,
} from '../../../database/services/OrganizationService';
import { EmailService } from '../../../services/email/EmailService';
import {
    createTeamBodySchema,
    switchOrgBodySchema,
    inviteBodySchema,
    renameOrgBodySchema,
    updateMemberRoleBodySchema,
} from './schemas';
import type {
    MyOrgsData,
    OrgData,
    MembersData,
    InvitesData,
    CreateInviteData,
    MemberData,
    RemoveMemberData,
    RevokeInviteData,
} from './types';

export class OrgController extends BaseController {
    static logger = createLogger('OrgController');

    /** GET /api/orgs — the caller's orgs + their active-org context. */
    static async listMyOrgs(
        _request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<MyOrgsData>>> {
        try {
            const actor = context.user!;
            const organizations = await new OrganizationService(env).getUserOrganizations(actor.id);
            return OrgController.createSuccessResponse({
                organizations,
                activeOrgId: actor.orgId,
                activeOrgRole: actor.orgRole,
            });
        } catch (error) {
            this.logger.error('Error listing organizations', error);
            return OrgController.createErrorResponse<MyOrgsData>('Failed to load organizations', 500);
        }
    }

    /** POST /api/orgs — create a team org and switch the session to it. */
    static async createTeam(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<OrgData>>> {
        const body = await OrgController.readBody(request, createTeamBodySchema);
        if (!body.ok) {
            return body.response;
        }
        try {
            const orgService = new OrganizationService(env);
            const org = await orgService.createTeamOrg(body.data.name, OrgController.mutationContext(request, context));
            // Auto-switch the creating session into the new org.
            if (context.sessionId) {
                await orgService.setActiveOrg(context.sessionId, context.user!.id, org.id);
            }
            return OrgController.createSuccessResponse({ organization: org });
        } catch (error) {
            return OrgController.mapError<OrgData>(error, 'create organization');
        }
    }

    /** POST /api/auth/switch-org — set the session's active org. */
    static async switchOrg(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<OrgData>>> {
        const body = await OrgController.readBody(request, switchOrgBodySchema);
        if (!body.ok) {
            return body.response;
        }
        if (!context.sessionId) {
            return OrgController.createErrorResponse<OrgData>('No active session', 400);
        }
        try {
            const org = await new OrganizationService(env).setActiveOrg(
                context.sessionId,
                context.user!.id,
                body.data.orgId,
            );
            return OrgController.createSuccessResponse({ organization: org });
        } catch (error) {
            return OrgController.mapError<OrgData>(error, 'switch organization');
        }
    }

    /** PATCH /api/orgs/:id — rename an org (owner/admin). */
    static async renameOrg(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<OrgData>>> {
        const orgId = context.pathParams.id;
        if (!orgId) {
            return OrgController.createErrorResponse<OrgData>('Organization id is required', 400);
        }
        const body = await OrgController.readBody(request, renameOrgBodySchema);
        if (!body.ok) {
            return body.response;
        }
        try {
            const org = await new OrganizationService(env).renameOrg(
                orgId,
                body.data.name,
                OrgController.mutationContext(request, context),
            );
            return OrgController.createSuccessResponse({ organization: org });
        } catch (error) {
            return OrgController.mapError<OrgData>(error, 'rename organization');
        }
    }

    /** GET /api/orgs/:id/members — roster (owner/admin). */
    static async getMembers(
        _request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<MembersData>>> {
        const orgId = context.pathParams.id;
        if (!orgId) {
            return OrgController.createErrorResponse<MembersData>('Organization id is required', 400);
        }
        try {
            const members = await new OrganizationService(env).listMembers(orgId);
            return OrgController.createSuccessResponse({ members });
        } catch (error) {
            this.logger.error('Error listing members', error);
            return OrgController.createErrorResponse<MembersData>('Failed to load members', 500);
        }
    }

    /** GET /api/orgs/:id/invites — pending invitations (owner/admin). */
    static async getInvites(
        _request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<InvitesData>>> {
        const orgId = context.pathParams.id;
        if (!orgId) {
            return OrgController.createErrorResponse<InvitesData>('Organization id is required', 400);
        }
        try {
            const invitations = await new OrganizationService(env).listInvitations(orgId);
            return OrgController.createSuccessResponse({ invitations });
        } catch (error) {
            this.logger.error('Error listing invitations', error);
            return OrgController.createErrorResponse<InvitesData>('Failed to load invitations', 500);
        }
    }

    /** POST /api/orgs/:id/invites — invite a member; email + copy-link (owner/admin). */
    static async createInvite(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<CreateInviteData>>> {
        const orgId = context.pathParams.id;
        if (!orgId) {
            return OrgController.createErrorResponse<CreateInviteData>('Organization id is required', 400);
        }
        const body = await OrgController.readBody(request, inviteBodySchema);
        if (!body.ok) {
            return body.response;
        }
        try {
            const orgService = new OrganizationService(env);
            const { invitation, token } = await orgService.createInvitation(
                orgId,
                body.data.email,
                body.data.role,
                OrgController.mutationContext(request, context),
            );

            const acceptUrl = OrgController.buildAcceptUrl(env, token);

            // Best-effort delivery; the invite already exists and the link is
            // always returned, so a failed/absent email is non-fatal.
            const org = await orgService.getOrgById(orgId);
            const actor = context.user!;
            const emailOutcome = await new EmailService(env).sendOrgInvite({
                to: invitation.inviteeEmail,
                orgName: org?.name ?? 'your team',
                inviterName: actor.displayName || actor.email,
                role: invitation.role,
                acceptUrl,
                replyTo: actor.email,
                expiresAt: invitation.expiresAt,
            });

            return OrgController.createSuccessResponse({
                invitation: OrgController.toInvitationView(invitation),
                acceptUrl,
                email: { sent: emailOutcome.sent, messageId: emailOutcome.messageId },
            });
        } catch (error) {
            return OrgController.mapError<CreateInviteData>(error, 'create invitation');
        }
    }

    /** DELETE /api/orgs/:id/invites/:inviteId — revoke a pending invite (owner/admin). */
    static async revokeInvite(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<RevokeInviteData>>> {
        const orgId = context.pathParams.id;
        const inviteId = context.pathParams.inviteId;
        if (!orgId || !inviteId) {
            return OrgController.createErrorResponse<RevokeInviteData>('Organization id and invite id are required', 400);
        }
        try {
            const result = await new OrganizationService(env).revokeInvitation(
                orgId,
                inviteId,
                OrgController.mutationContext(request, context),
            );
            return OrgController.createSuccessResponse(result);
        } catch (error) {
            return OrgController.mapError<RevokeInviteData>(error, 'revoke invitation');
        }
    }

    /** PATCH /api/orgs/:id/members/:userId — change a member's role (owner/admin). */
    static async updateMember(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<MemberData>>> {
        const orgId = context.pathParams.id;
        const targetUserId = context.pathParams.userId;
        if (!orgId || !targetUserId) {
            return OrgController.createErrorResponse<MemberData>('Organization id and user id are required', 400);
        }
        const body = await OrgController.readBody(request, updateMemberRoleBodySchema);
        if (!body.ok) {
            return body.response;
        }
        try {
            const member = await new OrganizationService(env).updateMemberRole(
                orgId,
                targetUserId,
                body.data.role,
                OrgController.mutationContext(request, context),
            );
            return OrgController.createSuccessResponse({ member });
        } catch (error) {
            return OrgController.mapError<MemberData>(error, 'update member role');
        }
    }

    /** DELETE /api/orgs/:id/members/:userId — remove a member or leave (owner/admin, or self). */
    static async removeMember(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<RemoveMemberData>>> {
        const orgId = context.pathParams.id;
        const targetUserId = context.pathParams.userId;
        if (!orgId || !targetUserId) {
            return OrgController.createErrorResponse<RemoveMemberData>('Organization id and user id are required', 400);
        }
        try {
            const result = await new OrganizationService(env).removeMember(
                orgId,
                targetUserId,
                OrgController.mutationContext(request, context),
            );
            return OrgController.createSuccessResponse(result);
        } catch (error) {
            return OrgController.mapError<RemoveMemberData>(error, 'remove member');
        }
    }

    /** POST /api/invites/:token/accept — accept an invite and switch into the org. */
    static async acceptInvite(
        request: Request,
        env: Env,
        _ctx: ExecutionContext,
        context: RouteContext,
    ): Promise<ControllerResponse<ApiResponse<OrgData>>> {
        const token = context.pathParams.token;
        if (!token) {
            return OrgController.createErrorResponse<OrgData>('Invitation token is required', 400);
        }
        try {
            const orgService = new OrganizationService(env);
            const metadata = extractRequestMetadata(request);
            const org = await orgService.acceptInvitation(token, context.user!.id, {
                metadata: { ipAddress: metadata.ipAddress, userAgent: metadata.userAgent },
            });
            // Auto-switch into the joined org so the user lands inside it.
            if (context.sessionId) {
                await orgService.setActiveOrg(context.sessionId, context.user!.id, org.id);
            }
            return OrgController.createSuccessResponse({ organization: org });
        } catch (error) {
            return OrgController.mapError<OrgData>(error, 'accept invitation');
        }
    }

    // ---- helpers ----

    private static mutationContext(request: Request, context: RouteContext): OrgMutationContext {
        const metadata = extractRequestMetadata(request);
        const actor = context.user!;
        return {
            actorUserId: actor.id,
            actorRole: actor.role,
            metadata: { ipAddress: metadata.ipAddress, userAgent: metadata.userAgent },
        };
    }

    private static buildAcceptUrl(env: Env, token: string): string {
        const domain = env.CUSTOM_DOMAIN || 'app.getdreamforge.com';
        return `https://${domain}/invite/${token}`;
    }

    private static toInvitationView(invitation: {
        id: string;
        inviteeEmail: string;
        role: OrgInvitationView['role'];
        status: OrgInvitationView['status'];
        expiresAt: Date;
        createdAt: Date | null;
        inviterUserId: string;
    }): OrgInvitationView {
        return {
            id: invitation.id,
            inviteeEmail: invitation.inviteeEmail,
            role: invitation.role,
            status: invitation.status,
            expiresAt: invitation.expiresAt,
            createdAt: invitation.createdAt,
            inviterUserId: invitation.inviterUserId,
        };
    }

    private static async readBody<S extends z.ZodTypeAny>(
        request: Request,
        schema: S,
    ): Promise<{ ok: true; data: z.infer<S> } | { ok: false; response: ControllerResponse<ApiResponse<never>> }> {
        const parsed = await BaseController.parseJsonBody<unknown>(request);
        if (!parsed.success) {
            return { ok: false, response: parsed.response as ControllerResponse<ApiResponse<never>> };
        }
        const validation = schema.safeParse(parsed.data ?? {});
        if (!validation.success) {
            const message = validation.error.issues[0]?.message ?? 'Invalid request body';
            return { ok: false, response: OrgController.createErrorResponse(message, 400) };
        }
        return { ok: true, data: validation.data };
    }

    private static mapError<T>(error: unknown, action: string): ControllerResponse<ApiResponse<T>> {
        if (error instanceof OrgActionError) {
            return OrgController.createErrorResponse<T>(error.message, error.statusCode);
        }
        this.logger.error(`Error during ${action}`, error);
        return OrgController.createErrorResponse<T>(`Failed to ${action}`, 500);
    }
}
