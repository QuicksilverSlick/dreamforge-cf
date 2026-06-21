/**
 * Organization-management routes (/api/orgs/*, /api/auth/switch-org,
 * /api/invites/:token/accept).
 *
 * Two gates:
 *  - AuthConfig.authenticated — list my orgs, create a team, switch active org,
 *    accept an invitation (any logged-in user; accept is token-bearing).
 *  - AuthConfig.orgAdminOnly — member/invite management. Fail-closed: requires
 *    the actor to be owner/admin AND the route's :id to equal their ACTIVE org,
 *    so a member of one org can never act on another (see routeAuth.ts).
 *
 * The org-admin plane is entirely separate from the platform-role plane: an org
 * admin is NOT platform staff and these routes never consult superadminOnly.
 */

import { Hono } from 'hono';
import { AppEnv } from '../../types/appenv';
import { AuthConfig, setAuthLevel } from '../../middleware/auth/routeAuth';
import { adaptController } from '../honoAdapter';
import { OrgController } from '../controllers/organizations/controller';

export function setupOrgRoutes(app: Hono<AppEnv>): void {
    // ---- Any authenticated user ----
    app.get(
        '/api/orgs',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(OrgController, OrgController.listMyOrgs),
    );
    app.post(
        '/api/orgs',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(OrgController, OrgController.createTeam),
    );
    app.post(
        '/api/auth/switch-org',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(OrgController, OrgController.switchOrg),
    );
    app.post(
        '/api/invites/:token/accept',
        setAuthLevel(AuthConfig.authenticated),
        adaptController(OrgController, OrgController.acceptInvite),
    );

    // ---- Org owner/admin of the active org (:id) ----
    app.patch(
        '/api/orgs/:id',
        setAuthLevel(AuthConfig.orgAdminOnly),
        adaptController(OrgController, OrgController.renameOrg),
    );
    // Owner-only delete (route binds :id to the active org; owner-role enforced in the service).
    app.delete(
        '/api/orgs/:id',
        setAuthLevel(AuthConfig.orgAdminOnly),
        adaptController(OrgController, OrgController.deleteOrg),
    );
    app.get(
        '/api/orgs/:id/members',
        setAuthLevel(AuthConfig.orgAdminOnly),
        adaptController(OrgController, OrgController.getMembers),
    );
    app.patch(
        '/api/orgs/:id/members/:userId',
        setAuthLevel(AuthConfig.orgAdminOnly),
        adaptController(OrgController, OrgController.updateMember),
    );
    app.delete(
        '/api/orgs/:id/members/:userId',
        setAuthLevel(AuthConfig.orgAdminOnly),
        adaptController(OrgController, OrgController.removeMember),
    );
    app.get(
        '/api/orgs/:id/invites',
        setAuthLevel(AuthConfig.orgAdminOnly),
        adaptController(OrgController, OrgController.getInvites),
    );
    app.post(
        '/api/orgs/:id/invites',
        setAuthLevel(AuthConfig.orgAdminOnly),
        adaptController(OrgController, OrgController.createInvite),
    );
    app.delete(
        '/api/orgs/:id/invites/:inviteId',
        setAuthLevel(AuthConfig.orgAdminOnly),
        adaptController(OrgController, OrgController.revokeInvite),
    );
}
