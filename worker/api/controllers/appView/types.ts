/**
 * Type definitions for AppView Controller responses
 * Following strict DRY principles by reusing existing database types
 */

import { AgentSummary } from '../../../agents/core/types';
import { EnhancedAppData } from '../../../database/types';

/**
 * Generated code file structure
 */
export interface GeneratedCodeFile {
    filePath: string;
    fileContents: string;
    explanation?: string;
}

/**
 * Response data for getAppDetails - extends existing EnhancedAppData
 * Adds only fields unique to app view response, uses EnhancedAppData stats directly
 */
export interface AppDetailsData extends EnhancedAppData {
    cloudflareUrl: string | null;
    previewUrl: string | null;
    /**
     * Whether the requesting user can open + drive this app (build/iterate/deploy).
     * True for any member of the app's org — NOT creator-only. Drives the editor
     * entry point and owner-level controls in the UI.
     */
    canEdit: boolean;
    /** The requesting user's role in the app's org, or null if not a member. */
    viewerOrgRole: 'owner' | 'admin' | 'member' | null;
    user: {
        id: string;
        displayName: string;
        avatarUrl: string | null;
    };
    agentSummary: AgentSummary | null;
}

/**
 * Response data for toggleAppStar
 */
export interface AppStarToggleData {
    isStarred: boolean;
    starCount: number;
}

// /**
//  * Response data for forkApp
//  */
// export interface ForkAppData {
//     forkedAppId: string;
//     message: string;
// }