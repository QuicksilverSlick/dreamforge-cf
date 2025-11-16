/**
 * Blueprint Cache Service
 * Manages caching of completed BYOP blueprints in D1
 */

import { eq, and, lt, gt } from 'drizzle-orm';
import { blueprintCache, type BlueprintCache, type NewBlueprintCache } from '../schema';
import { BaseService } from './BaseService';
import type { GeneratedBlueprint } from '../../services/blueprint/BlueprintGenerationService';

export class BlueprintCacheService extends BaseService {

    /**
     * Check if a blueprint exists in cache
     */
    async get(
        userId: string,
        repositoryUrl: string,
        branch: string
    ): Promise<BlueprintCache | null> {
        try {
            const now = new Date();

            const cached = await this.database
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
            if (cached.expiresAt && new Date(cached.expiresAt) < now) {
                this.logger.info('Cache entry expired, deleting', {
                    id: cached.id,
                    repositoryUrl,
                    branch
                });

                // Delete expired entry
                await this.database
                    .delete(blueprintCache)
                    .where(eq(blueprintCache.id, cached.id))
                    .execute();

                return null;
            }

            // Update access tracking
            await this.database
                .update(blueprintCache)
                .set({
                    accessCount: (cached.accessCount || 0) + 1,
                    lastAccessedAt: now
                })
                .where(eq(blueprintCache.id, cached.id))
                .execute();

            this.logger.info('Cache hit', {
                id: cached.id,
                repositoryUrl,
                branch,
                accessCount: (cached.accessCount || 0) + 1
            });

            return cached;
        } catch (error) {
            this.logger.error('Failed to get cached blueprint', { error, repositoryUrl, branch });
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

            const now = new Date();
            const expiresAt = new Date(now.getTime() + (ttlDays * 24 * 60 * 60 * 1000));

            // Generate unique ID
            const id = `blueprint_${userId}_${Buffer.from(repositoryUrl + branch).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)}`;

            // Delete any existing cache for this repo+branch
            await this.database
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

            await this.database
                .insert(blueprintCache)
                .values(newCache)
                .execute();

            this.logger.info('Blueprint cached successfully', {
                id,
                repositoryUrl,
                branch,
                completenessPercentage: blueprint.currentState.completenessPercentage,
                expiresAt: expiresAt.toISOString()
            });

            return true;
        } catch (error) {
            this.logger.error('Failed to cache blueprint', { error, options });
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
            await this.database
                .delete(blueprintCache)
                .where(
                    and(
                        eq(blueprintCache.userId, userId),
                        eq(blueprintCache.repositoryUrl, repositoryUrl),
                        eq(blueprintCache.branch, branch)
                    )
                )
                .execute();

            this.logger.info('Cache entry deleted', { repositoryUrl, branch });
            return true;
        } catch (error) {
            this.logger.error('Failed to delete cached blueprint', { error, repositoryUrl, branch });
            return false;
        }
    }

    /**
     * Clean up expired cache entries
     */
    async cleanupExpired(): Promise<number> {
        try {
            const now = new Date();

            const result = await this.database
                .delete(blueprintCache)
                .where(lt(blueprintCache.expiresAt, now))
                .execute();

            const deletedCount = result.success ? result.meta.changes : 0;

            if (deletedCount > 0) {
                this.logger.info('Cleaned up expired cache entries', { deletedCount });
            }

            return deletedCount;
        } catch (error) {
            this.logger.error('Failed to cleanup expired cache', { error });
            return 0;
        }
    }

    /**
     * Get all cached blueprints for a user
     */
    async listByUser(userId: string): Promise<BlueprintCache[]> {
        try {
            const now = new Date();

            const cached = await this.database
                .select()
                .from(blueprintCache)
                .where(
                    and(
                        eq(blueprintCache.userId, userId),
                        gt(blueprintCache.expiresAt, now)
                    )
                )
                .all();

            return cached;
        } catch (error) {
            this.logger.error('Failed to list cached blueprints', { error, userId });
            return [];
        }
    }
}
