/**
 * Centralized tenant-access predicate for apps (Phase 2.1).
 *
 * Every app read/ownership check scopes through this single condition so the
 * tenant boundary is defined in exactly one auditable place. An app is
 * accessible to a user when it belongs to an org the user is a member of, OR
 * (transition fallback) it is directly owned by the user's userId.
 *
 * The userId fallback guarantees no lockout while apps.orgId is still nullable
 * (some rows may predate the backfill); it is a SUPERSET of the prior
 * userId-only scoping, so the cutover cannot be more restrictive than before.
 * Cross-tenant isolation still holds: another user is neither a member of this
 * app's org nor the app's userId. The fallback is dropped in the 2.3 contract
 * step once orgId is enforced NOT NULL.
 */

import { type SQL, eq, inArray, or } from 'drizzle-orm';
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

    return or(inArray(schema.apps.orgId, memberOrgIds), eq(schema.apps.userId, userId))!;
}
