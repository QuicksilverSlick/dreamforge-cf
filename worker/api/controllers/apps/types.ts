/**
 * Type definitions for App Controller responses
 */

import { App } from '../../../database/schema';
import { AppWithFavoriteStatus, PaginationInfo, FavoriteToggleResult, EnhancedAppData } from '../../../database/types';

/**
 * App with extended user and social stats for public listings
 */
export type AppWithUserAndStats = EnhancedAppData & {
    updatedAtFormatted: string;
};

/**
 * Response data for getUserApps, getRecentApps, getFavoriteApps
 */
export interface AppsListData {
    apps: AppWithFavoriteStatus[];
}

/**
 * Response data for getPublicApps
 */
export interface PublicAppsData {
    apps: AppWithUserAndStats[];
    pagination: PaginationInfo;
}

/**
 * Response data for getApp
 */
export interface SingleAppData {
    app: AppWithFavoriteStatus;
}

/**
 * Response data for toggleFavorite
 */
export type FavoriteToggleData = FavoriteToggleResult;

/**
 * Response data for createApp
 */
export interface CreateAppData {
    app: App;
}

/**
 * Response data for updateAppVisibility
 */
export interface UpdateAppVisibilityData {
    app: {
        id: string;
        title: string;
        visibility: App['visibility'];
        updatedAt: Date | null;
    };
    message: string;
}

/**
 * Response data for GET /api/apps/:id/database/restore-info (CONT-4).
 * Tells the client whether the app has a restorable per-app D1 and the
 * Time Travel window it can restore within.
 */
export interface DatabaseRestoreInfo {
    /** True only for apps with a provisioned per-app D1 (the D1 flagship). */
    hasDatabase: boolean;
    databaseName: string | null;
    retentionDays: number;
    /** Earliest ISO timestamp the app can be restored to (now − retention). */
    earliestRestoreAt: string;
    now: string;
}

/**
 * Response data for POST /api/apps/:id/database/restore (CONT-4).
 */
export interface DatabaseRestoreResult {
    restoredToBookmark: string;
    /** Restore to this bookmark to undo the restore. */
    previousBookmark: string;
    message: string;
    restoredAt: string;
}

/**
 * Response data for deleteApp
 */
export interface AppDeleteData {
    success: boolean;
    message: string;
}