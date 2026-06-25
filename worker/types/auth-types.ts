/**
 * Authentication Type Definitions
 */

import type { ApiKey, AuthAttempt as SchemaAuthAttempt, AuditLog, OAuthState, OrgRole } from '../database/schema';

export type { OrgRole };

/**
 * OAuth provider types
 */
export type OAuthProvider = 'google' | 'github';

/**
 * Platform authorization roles. 'user' is the baseline end user. 'admin' is
 * the org-admin role (org scoping lands in Phase 2). 'superadmin' is the
 * platform operator. 'support'/'ai_support'/'ai_admin' are staff/agent roles.
 * The union is derived from USER_ROLES so the canonical list lives in one place.
 */
export const USER_ROLES = ['superadmin', 'admin', 'user', 'support', 'ai_support', 'ai_admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Narrow an untrusted string to a known UserRole (e.g. a value read off a header). */
export function isUserRole(value: unknown): value is UserRole {
    return typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value);
}

/** Platform-staff roles that may access operator surfaces (NOT org 'admin', NOT 'user'). */
export const PLATFORM_STAFF_ROLES: readonly UserRole[] = ['superadmin', 'support', 'ai_support', 'ai_admin'];

/**
 * Authenticated user for middleware and session context
 */
export interface AuthUser {
	id: string;
	email: string;
	displayName?: string;
	username?: string;
	avatarUrl?: string;
    bio?: string;
    timezone?: string;
    provider?: string;
    emailVerified?: boolean;
    createdAt?: Date;
    isAnonymous?: boolean;
    /** Platform role, resolved per-request from D1. Absent => treat as 'user'. */
    role?: UserRole;
    /**
     * Active organization for this request, resolved per-request from D1 via
     * the session's currentOrgId (NEVER from the JWT) so an org-switch or a
     * membership revocation takes effect on the very next request. Falls back to
     * the user's personal org when the session has no/stale active org.
     */
    orgId?: string;
    /** The user's role IN the active org (orgId). Absent => not resolved. */
    orgRole?: OrgRole;

    /**
     * Impersonation context. When set, THIS request is an impersonation: the
     * effective identity (id/email/role/org above) is the TARGET user, while the
     * real actor is named here. Resolved per-request from a D1 grant at the auth
     * chokepoint (never from the JWT). Absent => a normal, non-impersonated
     * session. Audit, rate-limit attribution, Sentry, and the UI banner read
     * these — accountability follows the actor, data visibility follows the
     * effective (target) user.
     */
    impersonatedBy?: string;
    /** The actor's platform role (for re-gating the stop/extend controls + banner). */
    impersonatorRole?: UserRole;
    /** true => mutations are structurally blocked for this request (read-only mode). */
    impersonationReadOnly?: boolean;
}

/**
 * Session information for active authentication
 */
export interface AuthSession {
	userId: string;
	email: string;
	sessionId: string;
	expiresAt: Date | null;
};

/**
 * Token payload structure for JWT tokens
 */
export interface TokenPayload {
	// Standard JWT claims
	sub: string; // User ID
	iat: number; // Issued at
	exp: number; // Expires at

	// Custom claims
	email: string;
	type: 'access' | 'refresh';
	jti?: string; // JWT ID (for refresh tokens)

	// Session context
	sessionId: string;

	// Security metadata
	ipHash?: string; // Hashed IP for security validation
}

export interface AuthUserSession {
    user: AuthUser;
    sessionId: string;
}

/**
 * Authentication result from login/register operations
 */
export interface AuthResult extends AuthUserSession {
    expiresAt: Date | null;
	accessToken: string;
	isNewUser?: boolean;
	requiresEmailVerification?: boolean;
	redirectUrl?: string;
};

/**
 * OAuth provider user information
 */
export interface OAuthUserInfo {
	id: string;
	email: string;
	name?: string;
	picture?: string;
	emailVerified?: boolean;
	locale?: string;

	// Provider-specific data
	providerData?: Record<string, unknown>;
}

/**
 * OAuth tokens from provider
 */
export interface OAuthTokens {
	accessToken: string;
	refreshToken?: string;
	idToken?: string;
	tokenType: string;
	expiresIn?: number;
	scope?: string;
}

/**
 * OAuth state for secure authentication flow
 * Uses OAuthState schema with typed provider
 */
export type OAuthStateData = Omit<OAuthState, 'provider'> & {
	provider: OAuthProvider;
};

/**
 * API Key info for client display
 * Subset of ApiKey schema without sensitive data
 */
export type ApiKeyInfo = Pick<ApiKey, 'id' | 'name' | 'keyPreview' | 'createdAt' | 'lastUsed' | 'isActive'>;

/**
 * Re-export AuthAttempt from schema
 */
export type { SchemaAuthAttempt as AuthAttempt };

/**
 * Password validation result with strength scoring
 */
export interface PasswordValidationResult {
	valid: boolean;
	errors?: string[];
	score: number; // 0-4 strength score

	// Detailed validation
	requirements?: {
		minLength: boolean;
		hasLowercase: boolean;
		hasUppercase: boolean;
		hasNumbers: boolean;
		hasSpecialChars: boolean;
		notCommon: boolean;
		noSequential: boolean;
	};

	// Suggestions for improvement
	suggestions?: string[];
}

/**
 * Security context for authentication operations
 */
export interface SecurityContext {
	// Request metadata
	ipAddress: string;
	userAgent: string;
	requestId: string;

	// Geographic and network info
	country?: string;
	region?: string;
	isp?: string;

	// Device fingerprinting
	deviceFingerprint?: string;

	// Risk assessment
	riskScore?: number; // 0-100
	riskFactors?: string[];
}

/**
 * Audit log entry with security context
 */
export type AuditLogEntry = AuditLog & {
	securityContext?: Partial<SecurityContext>;
};

/**
 * WebSocket ticket for secure, one-time-use authentication
 * Stored in Agent DO memory, consumed on WebSocket connection
 */
export interface PendingWsTicket {
	token: string;
	user: AuthUser;
	sessionId: string;
	createdAt: number;
	expiresAt: number;
}

/**
 * Result of ticket consumption from Agent DO
 */
export interface TicketConsumptionResult {
	user: AuthUser;
	sessionId: string;
}
