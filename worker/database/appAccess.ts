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
