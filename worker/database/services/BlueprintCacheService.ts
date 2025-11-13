/**
 * Blueprint Cache Service
 * Manages caching of completed BYOP blueprints in D1
 */

import { eq, and, lt } from 'drizzle-orm';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { blueprintCache, type BlueprintCache, type NewBlueprintCache } from '../schema';
import { createLogger } from '../../logger';
import type { GeneratedBlueprint } from '../../services/blueprint/BlueprintGenerationService';

const logger = createLogger('BlueprintCacheService');

export class BlueprintCacheService {
    private db: DrizzleD1Database;

    constructor(db: DrizzleD1Database) {
        this.db = db;
    }

    /**
     * Check if a blueprint exists in cache
     */
    async get(
        userId: string,
        repositoryUrl: string,
        branch: string
    ): Promise<BlueprintCache | null> {
        try {
            const now = Math.floor(Date.now() / 1000);

            const cached = await this.db
                .select()
                .from(blueprintCache)
                .where(
                    and(
                        eq(blueprintCache.userId, userId),
                        eq(blueprintCache.repositoryUrl, repositoryUrl),
                        eq(blueprintCache.branch, branch)
                    )
                )
                .limit(1)
                .get();

            if (!cached) {
                return null;
            }

            // Check if expired
            if (cached.expiresAt && cached.expiresAt < now) {
                logger.info('Cache entry expired, deleting', {
                    id: cached.id,
                    repositoryUrl,
                    branch
                });

                // Delete expired entry
                await this.db
                    .delete(blueprintCache)
                    .where(eq(blueprintCache.id, cached.id))
                    .execute();

                return null;
            }

            // Update access tracking
            await this.db
                .update(blueprintCache)
                .set({
                    accessCount: (cached.accessCount || 0) + 1,
                    lastAccessedAt: now
                })
                .where(eq(blueprintCache.id, cached.id))
                .execute();

            logger.info('Cache hit', {
                id: cached.id,
                repositoryUrl,
                branch,
                accessCount: (cached.accessCount || 0) + 1
            });

            return cached;
        } catch (error) {
            logger.error('Failed to get cached blueprint', { error, repositoryUrl, branch });
            return null;
        }
    }

    /**
     * Store a blueprint in cache
     */
    async set(options: {
        userId: string;
        repositoryUrl: string;
        repositoryName: string;
        branch: string;
        blueprint: GeneratedBlueprint;
        fileCount?: number;
        totalLinesOfCode?: number;
        framework?: string;
        ttlDays?: number;
    }): Promise<boolean> {
        try {
            const {
                userId,
                repositoryUrl,
                repositoryName,
                branch,
                blueprint,
                fileCount,
                totalLinesOfCode,
                framework,
                ttlDays = 7 // Default 7 days cache
            } = options;

            const now = Math.floor(Date.now() / 1000);
            const expiresAt = now + (ttlDays * 24 * 60 * 60);

            // Generate unique ID
            const id = `blueprint_${userId}_${Buffer.from(repositoryUrl + branch).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)}`;

            // Delete any existing cache for this repo+branch
            await this.db
                .delete(blueprintCache)
                .where(
                    and(
                        eq(blueprintCache.userId, userId),
                        eq(blueprintCache.repositoryUrl, repositoryUrl),
                        eq(blueprintCache.branch, branch)
                    )
                )
                .execute();

            // Insert new cache entry
            const newCache: NewBlueprintCache = {
                id,
                userId,
                repositoryUrl,
                repositoryName,
                branch,
                blueprint: JSON.stringify(blueprint),
                completenessPercentage: blueprint.currentState.completenessPercentage,
                fileCount,
                totalLinesOfCode,
                framework,
                expiresAt,
                accessCount: 0,
                lastAccessedAt: null
            };

            await this.db
                .insert(blueprintCache)
                .values(newCache)
                .execute();

            logger.info('Blueprint cached successfully', {
                id,
                repositoryUrl,
                branch,
                completenessPercentage: blueprint.currentState.completenessPercentage,
                expiresAt: new Date(expiresAt * 1000).toISOString()
            });

            return true;
        } catch (error) {
            logger.error('Failed to cache blueprint', { error, options });
            return false;
        }
    }

    /**
     * Delete a cached blueprint
     */
    async delete(
        userId: string,
        repositoryUrl: string,
        branch: string
    ): Promise<boolean> {
        try {
            await this.db
                .delete(blueprintCache)
                .where(
                    and(
                        eq(blueprintCache.userId, userId),
                        eq(blueprintCache.repositoryUrl, repositoryUrl),
                        eq(blueprintCache.branch, branch)
                    )
                )
                .execute();

            logger.info('Cache entry deleted', { repositoryUrl, branch });
            return true;
        } catch (error) {
            logger.error('Failed to delete cached blueprint', { error, repositoryUrl, branch });
            return false;
        }
    }

    /**
     * Clean up expired cache entries
     */
    async cleanupExpired(): Promise<number> {
        try {
            const now = Math.floor(Date.now() / 1000);

            const result = await this.db
                .delete(blueprintCache)
                .where(lt(blueprintCache.expiresAt, now))
                .execute();

            const deletedCount = result.rowsAffected || 0;

            if (deletedCount > 0) {
                logger.info('Cleaned up expired cache entries', { deletedCount });
            }

            return deletedCount;
        } catch (error) {
            logger.error('Failed to cleanup expired cache', { error });
            return 0;
        }
    }

    /**
     * Get all cached blueprints for a user
     */
    async listByUser(userId: string): Promise<BlueprintCache[]> {
        try {
            const now = Math.floor(Date.now() / 1000);

            const cached = await this.db
                .select()
                .from(blueprintCache)
                .where(
                    and(
                        eq(blueprintCache.userId, userId),
                        lt(now, blueprintCache.expiresAt)
                    )
                )
                .all();

            return cached;
        } catch (error) {
            logger.error('Failed to list cached blueprints', { error, userId });
            return [];
        }
    }
}
