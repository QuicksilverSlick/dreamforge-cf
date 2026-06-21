/**
 * Centralized tenant-access predicate for apps (Phase 2.3 contract).
 *
 * Every app read/ownership check scopes through this single condition so the
 * tenant boundary is defined in exactly one auditable place. An app is
 * accessible to a user when, and only when, it belongs to an org the user is a
 * member of — access is PURELY org-membership.
 *
 * The Phase 2.1/2.2 transition `OR apps.userId === userId` fallback was dropped
 * here in 2.3 now that `apps.orgId` is enforced NOT NULL and every app is filed
 * under an org the creator is a verified member of (AppService.createApp). No
 * lockout results (the contract migration confirmed zero apps whose owner is not
 * a member of the app's org). This is also the correct team semantic: an app
 * built in a team belongs to the team, so leaving the team loses access to it —
 * the lingering userId fallback would otherwise leak it back.
 */

import { type SQL, eq, inArray } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './schema';

export function userAppAccessCondition(
    db: DrizzleD1Database<typeof schema>,
    userId: string,
): SQL {
    const memberOrgIds = db
        .select({ orgId: schema.organizationMembers.orgId })
        .from(schema.organizationMembers)
        .where(eq(schema.organizationMembers.userId, userId));

    return inArray(schema.apps.orgId, memberOrgIds);
}

/**
 * Narrower LIST predicate: apps belonging to a single (the ACTIVE) org. Used by
 * the user-facing app lists so the sidebar / Apps page show only the org the
 * user has selected in the switcher, reducing "which context am I in" confusion.
 *
 * This is a strict subset of userAppAccessCondition (the active org is always one
 * of the user's member orgs). It scopes the LIST only — ownership/open/drive/
 * delete checks (checkAppOwnership, deleteApp) keep using userAppAccessCondition
 * so a member can still act on any org app regardless of the active switcher.
 */
export function activeOrgAppCondition(orgId: string): SQL {
    return eq(schema.apps.orgId, orgId);
}
