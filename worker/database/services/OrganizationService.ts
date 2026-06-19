/**
 * Organization Service — Phase 2 tenant model.
 *
 * Phase 2.0 is "dark": this service creates the org rows and the per-user
 * personal org, but nothing reads/enforces orgId yet. Every user gets exactly
 * one personal org (isPersonal=true) they own; teams (isPersonal=false) come in
 * a later sub-phase. Org roles live on organizationMembers, never on
 * users.role.
 */

import { BaseService } from './BaseService';
import * as schema from '../schema';
import { and, eq } from 'drizzle-orm';
import { generateId } from '../../utils/idGenerator';

export interface EnsurePersonalOrgInput {
    displayName?: string | null;
    email?: string | null;
}

export class OrganizationService extends BaseService {
    /**
     * Idempotently ensure the user has a personal org (+ owner membership).
     * Returns the personal org id. Safe to call repeatedly (e.g. on every
     * login) — it no-ops when one already exists.
     */
    async ensurePersonalOrg(userId: string, input: EnsurePersonalOrgInput = {}): Promise<string> {
        const existing = await this.getPersonalOrgId(userId);
        if (existing) {
            return existing;
        }

        const orgId = generateId();
        const base = input.displayName?.trim() || input.email?.split('@')[0] || 'My';
        const name = `${base}'s workspace`;
        const slug = this.buildSlug(input.displayName || input.email || userId);

        // Create the personal org guarded by the partial unique index (one
        // personal org per owner). On a lost race the insert no-ops and returns
        // no row, so we re-read the winning org id.
        const inserted = await this.database
            .insert(schema.organizations)
            .values({ id: orgId, name, slug, isPersonal: true, ownerUserId: userId })
            .onConflictDoNothing()
            .returning({ id: schema.organizations.id });

        const resolvedOrgId = inserted[0]?.id ?? (await this.getPersonalOrgId(userId));
        if (!resolvedOrgId) {
            throw new Error(`Failed to resolve personal org for user ${userId}`);
        }

        // Ensure the owner membership exists, idempotent via the unique
        // (org_id, user_id) index — safe whether we created the org or lost the race.
        await this.database
            .insert(schema.organizationMembers)
            .values({ id: generateId(), orgId: resolvedOrgId, userId, role: 'owner' })
            .onConflictDoNothing();

        return resolvedOrgId;
    }

    /** The user's personal org id, or null if none yet. */
    async getPersonalOrgId(userId: string): Promise<string | null> {
        const row = await this.database
            .select({ id: schema.organizations.id })
            .from(schema.organizations)
            .where(
                and(
                    eq(schema.organizations.ownerUserId, userId),
                    eq(schema.organizations.isPersonal, true),
                ),
            )
            .get();
        return row?.id ?? null;
    }

    /** Orgs the user is a member of (with their org role). */
    async getUserOrganizations(
        userId: string,
    ): Promise<Array<{ org: schema.Organization; role: schema.OrganizationMember['role'] }>> {
        const rows = await this.getReadDb('fast')
            .select({ org: schema.organizations, role: schema.organizationMembers.role })
            .from(schema.organizationMembers)
            .innerJoin(schema.organizations, eq(schema.organizationMembers.orgId, schema.organizations.id))
            .where(eq(schema.organizationMembers.userId, userId));
        return rows;
    }

    /**
     * URL-safe, collision-resistant slug: a slugified base plus a short id
     * suffix (the slug column is uniquely indexed).
     */
    private buildSlug(base: string): string {
        const normalized = base
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 32);
        return `${normalized || 'workspace'}-${generateId().slice(0, 8)}`;
    }
}
