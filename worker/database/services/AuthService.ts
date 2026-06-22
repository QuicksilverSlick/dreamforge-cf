/**
 * Main Authentication Service
 * Orchestrates all auth operations including login, registration, and OAuth
 */

import * as schema from '../schema';
import { eq, and, sql, or, lt, isNull } from 'drizzle-orm';
import { JWTUtils } from '../../utils/jwtUtils';
import { generateSecureToken } from '../../utils/cryptoUtils';
import { SessionService } from './SessionService';
import { OrganizationService } from './OrganizationService';
import { ImpersonationService, actorRoleMayImpersonate, targetRoleMayBeImpersonated } from './ImpersonationService';
import { PasswordService } from '../../utils/passwordService';
import { GoogleOAuthProvider } from '../../services/oauth/google';
import { GitHubOAuthProvider } from '../../services/oauth/github';
import { BaseOAuthProvider } from '../../services/oauth/base';
import { 
    SecurityError, 
    SecurityErrorType 
} from 'shared/types/errors';
import { AuthResult, AuthUserSession, OAuthUserInfo } from '../../types/auth-types';
import { generateId } from '../../utils/idGenerator';
import {
    AuthUser, 
    OAuthProvider
} from '../../types/auth-types';
import { mapUserResponse } from '../../utils/authUtils';
import { createLogger } from '../../logger';
import { validateEmail, validatePassword } from '../../utils/validationUtils';
import { extractRequestMetadata } from '../../utils/authUtils';
import { BaseService } from './BaseService';

const logger = createLogger('AuthService');

/**
 * Login credentials
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Registration data
 */
export interface RegistrationData {
    email: string;
    password: string;
    name?: string;
}


/**
 * Main Authentication Service
 */
export class AuthService extends BaseService {
    private readonly sessionService: SessionService;
    private readonly passwordService: PasswordService;
    private readonly organizationService: OrganizationService;
    private readonly impersonationService: ImpersonationService;

    constructor(
        env: Env,
    ) {
        super(env);
        this.sessionService = new SessionService(env);
        this.passwordService = new PasswordService();
        this.organizationService = new OrganizationService(env);
        this.impersonationService = new ImpersonationService(env);
    }
    
    /**
     * Register a new user
     */
    async register(data: RegistrationData, request: Request): Promise<AuthResult> {
        try {
            // Validate email format using centralized utility
            const emailValidation = validateEmail(data.email);
            if (!emailValidation.valid) {
                throw new SecurityError(
                    SecurityErrorType.INVALID_INPUT,
                    emailValidation.error || 'Invalid email format',
                    400
                );
            }
            
            // Validate password using centralized utility
            const passwordValidation = validatePassword(data.password, undefined, {
                email: data.email,
                name: data.name
            });
            if (!passwordValidation.valid) {
                throw new SecurityError(
                    SecurityErrorType.INVALID_INPUT,
                    passwordValidation.errors!.join(', '),
                    400
                );
            }
            
            // Check if user already exists
            const existingUser = await this.database
                .select()
                .from(schema.users)
                .where(eq(schema.users.email, data.email.toLowerCase()))
                .get();
            
            if (existingUser) {
                throw new SecurityError(
                    SecurityErrorType.INVALID_INPUT,
                    'Email already registered',
                    400
                );
            }
            
            // Hash password
            const passwordHash = await this.passwordService.hash(data.password);
            
            // Create user
            const userId = generateId();
            const now = new Date();
            
            // Store user as verified immediately (no OTP verification required)
            await this.database.insert(schema.users).values({
                id: userId,
                email: data.email.toLowerCase(),
                passwordHash,
                displayName: data.name || data.email.split('@')[0],
                emailVerified: true, // Set as verified immediately
                provider: 'email',
                providerId: userId,
                createdAt: now,
                updatedAt: now
            });
            
            // Get the created user
            const newUser = await this.database
                .select()
                .from(schema.users)
                .where(eq(schema.users.id, userId))
                .get();
            
            if (!newUser) {
                throw new SecurityError(
                    SecurityErrorType.INVALID_INPUT,
                    'Failed to retrieve created user',
                    500
                );
            }

            // Phase 2 (dark): every new user gets a personal org. Best-effort —
            // org plumbing must never block signup while orgId is unenforced.
            try {
                await new OrganizationService(this.env).ensurePersonalOrg(userId, {
                    displayName: newUser.displayName,
                    email: newUser.email,
                });
            } catch (error) {
                this.logger.error('Failed to ensure personal org on register', { userId, error });
            }

            // Log successful registration
            await this.logAuthAttempt(data.email, 'register', true, request);
            logger.info('User registered and logged in directly', { userId, email: data.email });
            
            // Create session and tokens immediately (log user in after registration)
            const { accessToken, session } = await this.sessionService.createSession(
                userId,
                request
            );
            
            return {
                user: mapUserResponse(newUser),
                sessionId: session.sessionId,
                expiresAt: session.expiresAt,
                accessToken,
            };
        } catch (error) {
            await this.logAuthAttempt(data.email, 'register', false, request);
            
            if (error instanceof SecurityError) {
                throw error;
            }
            
            logger.error('Registration error', error);
            throw new SecurityError(
                SecurityErrorType.INVALID_INPUT,
                'Registration failed',
                500
            );
        }
    }
    
    /**
     * Login with email and password
     */
    async login(credentials: LoginCredentials, request: Request): Promise<AuthResult> {
        try {
            // Find user
            const user = await this.database
                .select()
                .from(schema.users)
                .where(
                    and(
                        eq(schema.users.email, credentials.email.toLowerCase()),
                        sql`${schema.users.deletedAt} IS NULL`
                    )
                )
                .get();
            
            if (!user || !user.passwordHash) {
                await this.logAuthAttempt(credentials.email, 'login', false, request);
                throw new SecurityError(
                    SecurityErrorType.UNAUTHORIZED,
                    'Invalid email or password',
                    401
                );
            }
            
            // Verify password
            const passwordValid = await this.passwordService.verify(
                credentials.password,
                user.passwordHash
            );
            
            if (!passwordValid) {
                await this.logAuthAttempt(credentials.email, 'login', false, request);
                throw new SecurityError(
                    SecurityErrorType.UNAUTHORIZED,
                    'Invalid email or password',
                    401
                );
            }

            // Reject suspended/deactivated accounts only after a correct
            // password (never reveal account status to a wrong-password probe).
            if (user.isSuspended || user.isActive === false) {
                await this.logAuthAttempt(credentials.email, 'login', false, request);
                throw new SecurityError(
                    SecurityErrorType.FORBIDDEN,
                    'Your account has been suspended — please contact support.',
                    403
                );
            }

            // Create session
            const { accessToken, session } = await this.sessionService.createSession(
                user.id,
                request
            );
            
            // Log successful attempt
            await this.logAuthAttempt(credentials.email, 'login', true, request);
            
            logger.info('User logged in', { userId: user.id, email: user.email });
            
            return {
                user: mapUserResponse(user),
                accessToken,
                sessionId: session.sessionId,
                expiresAt: session.expiresAt,
            };
        } catch (error) {
            if (error instanceof SecurityError) {
                throw error;
            }
            
            logger.error('Login error', error);
            throw new SecurityError(
                SecurityErrorType.UNAUTHORIZED,
                'Login failed',
                500
            );
        }
    }
    
    /**
     * Logout
     */
    async logout(sessionId: string): Promise<void> {
        try {
            await this.sessionService.revokeSessionId(sessionId);
            logger.info('User logged out', { sessionId });
        } catch (error) {
            logger.error('Logout error', error);
            throw new SecurityError(
                SecurityErrorType.UNAUTHORIZED,
                'Logout failed',
                500
            );
        }
    }

    async getOauthProvider(provider: OAuthProvider, request: Request): Promise<BaseOAuthProvider> {
        const url = new URL(request.url).origin;
        
        switch (provider) {
            case 'google':
                return GoogleOAuthProvider.create(this.env, url);
            case 'github':
                return GitHubOAuthProvider.create(this.env, url);
            default:
                throw new SecurityError(
                    SecurityErrorType.INVALID_INPUT,
                    `OAuth provider ${provider} not configured`,
                    400
                );
        }
    }
    
    /**
     * Get OAuth authorization URL
     */
    async getOAuthAuthorizationUrl(
        provider: OAuthProvider,
        request: Request,
        intendedRedirectUrl?: string
    ): Promise<string> {
        const oauthProvider = await this.getOauthProvider(provider, request);
        if (!oauthProvider) {
            throw new SecurityError(
                SecurityErrorType.INVALID_INPUT,
                `OAuth provider ${provider} not configured`,
                400
            );
        }
        
        // Clean up expired OAuth states first
        await this.cleanupExpiredOAuthStates();
        
        // Validate and sanitize intended redirect URL
        let validatedRedirectUrl: string | null = null;
        if (intendedRedirectUrl) {
            validatedRedirectUrl = this.validateRedirectUrl(intendedRedirectUrl, request);
        }
        
        // Generate state for CSRF protection
        const state = generateSecureToken();
        
        // Generate PKCE code verifier
        const codeVerifier = BaseOAuthProvider.generateCodeVerifier();
        
        // Store OAuth state with intended redirect URL
        await this.database.insert(schema.oauthStates).values({
            id: generateId(),
            state,
            provider,
            codeVerifier,
            redirectUri: validatedRedirectUrl || oauthProvider['redirectUri'],
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 600000), // 10 minutes
            isUsed: false,
            scopes: [],
            userId: null,
            nonce: null
        });
        
        // Get authorization URL
        const authUrl = await oauthProvider.getAuthorizationUrl(state, codeVerifier);
        
        logger.info('OAuth authorization initiated', { provider });
        
        return authUrl;
    }
    
    /**
     * Clean up expired OAuth states
     */
    private async cleanupExpiredOAuthStates(): Promise<void> {
        try {
            const now = new Date();
            await this.database
                .delete(schema.oauthStates)
                .where(
                    or(
                        lt(schema.oauthStates.expiresAt, now),
                        eq(schema.oauthStates.isUsed, true)
                    )
                );
            
            logger.debug('Cleaned up expired OAuth states');
        } catch (error) {
            logger.error('Error cleaning up OAuth states', error);
        }
    }
    
    /**
     * Handle OAuth callback
     */
    async handleOAuthCallback(
        provider: OAuthProvider,
        code: string,
        state: string,
        request: Request
    ): Promise<AuthResult> {
        try {
            const oauthProvider = await this.getOauthProvider(provider, request);
            if (!oauthProvider) {
                throw new SecurityError(
                    SecurityErrorType.INVALID_INPUT,
                    `OAuth provider ${provider} not configured`,
                    400
                );
            }
            
            // Verify state
            const now = new Date();
            const oauthState = await this.database
                .select()
                .from(schema.oauthStates)
                .where(
                    and(
                        eq(schema.oauthStates.state, state),
                        eq(schema.oauthStates.provider, provider),
                        eq(schema.oauthStates.isUsed, false)
                    )
                )
                .get();
            
            if (!oauthState || new Date(oauthState.expiresAt) < now) {
                throw new SecurityError(
                    SecurityErrorType.CSRF_VIOLATION,
                    'Invalid or expired OAuth state',
                    400
                );
            }
            
            // Mark state as used
            await this.database
                .update(schema.oauthStates)
                .set({ isUsed: true })
                .where(eq(schema.oauthStates.id, oauthState.id));
            
            // Exchange code for tokens
            const tokens = await oauthProvider.exchangeCodeForTokens(
                code,
                oauthState.codeVerifier || undefined
            );
            
            // Get user info
            const oauthUserInfo = await oauthProvider.getUserInfo(tokens.accessToken);
            
            // Find or create user
            const user = await this.findOrCreateOAuthUser(provider, oauthUserInfo);

            // Suspended/deactivated accounts must not get a session via OAuth
            // either — mirror the email-login gate so enforcement is consistent
            // at every authenticate chokepoint, not only defended downstream.
            if (user.isSuspended || user.isActive === false) {
                await this.logAuthAttempt(user.email, `oauth_${provider}`, false, request);
                throw new SecurityError(
                    SecurityErrorType.FORBIDDEN,
                    'Your account has been suspended — please contact support.',
                    403
                );
            }

            // Create session
            const { accessToken: sessionAccessToken, session } = await this.sessionService.createSession(
                user.id,
                request
            );
            
            // Log auth attempt
            await this.logAuthAttempt(user.email, `oauth_${provider}`, true, request);
            
            logger.info('OAuth login successful', { userId: user.id, provider });
            
            return {
                user: mapUserResponse(user),
                accessToken: sessionAccessToken,
                sessionId: session.sessionId,
                expiresAt: session.expiresAt,
                redirectUrl: oauthState.redirectUri || undefined
            };
        } catch (error) {
            await this.logAuthAttempt('', `oauth_${provider}`, false, request);
            
            if (error instanceof SecurityError) {
                throw error;
            }
            
            logger.error('OAuth callback error', error);
            throw new SecurityError(
                SecurityErrorType.UNAUTHORIZED,
                'OAuth authentication failed',
                500
            );
        }
    }
    
    /**
     * Find or create OAuth user
     */
    private async findOrCreateOAuthUser(
        provider: OAuthProvider,
        oauthUserInfo: OAuthUserInfo
    ): Promise<schema.User> {
        // Check if user exists with this email
        let user = await this.database
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, oauthUserInfo.email.toLowerCase()))
            .get();
        
        if (!user) {
            // Create new user
            const userId = generateId();
            const now = new Date();
            
            await this.database.insert(schema.users).values({
                id: userId,
                email: oauthUserInfo.email.toLowerCase(),
                displayName: oauthUserInfo.name || oauthUserInfo.email.split('@')[0],
                avatarUrl: oauthUserInfo.picture,
                emailVerified: oauthUserInfo.emailVerified || false,
                provider: provider,
                providerId: oauthUserInfo.id,
                createdAt: now,
                updatedAt: now
            });
            
            user = await this.database
                .select()
                .from(schema.users)
                .where(eq(schema.users.id, userId))
                .get();

            // Phase 2 (dark): new OAuth users get a personal org (best-effort).
            try {
                await new OrganizationService(this.env).ensurePersonalOrg(userId, {
                    displayName: user?.displayName,
                    email: user?.email,
                });
            } catch (error) {
                this.logger.error('Failed to ensure personal org on OAuth signup', { userId, error });
            }
        } else {
            // Always update OAuth info and user data on login
            await this.database
                .update(schema.users)
                .set({
                    displayName: oauthUserInfo.name || user.displayName,
                    avatarUrl: oauthUserInfo.picture || user.avatarUrl,
                    provider: provider,
                    providerId: oauthUserInfo.id,
                    emailVerified: oauthUserInfo.emailVerified || user.emailVerified,
                    updatedAt: new Date()
                })
                .where(eq(schema.users.id, user.id));
            
            // Refresh user data after updates
            user = await this.database
                .select()
                .from(schema.users)
                .where(eq(schema.users.id, user.id))
                .get();
        }
        
        return user!;
    }
    
    /**
     * Log authentication attempt
     */
    private async logAuthAttempt(
        identifier: string,
        attemptType: string,
        success: boolean,
        request: Request
    ): Promise<void> {
        try {
            const requestMetadata = extractRequestMetadata(request);
            
            await this.database.insert(schema.authAttempts).values({
                identifier: identifier.toLowerCase(),
                attemptType: attemptType as 'login' | 'register' | 'oauth_google' | 'oauth_github' | 'refresh' | 'reset_password',
                success: success,
                ipAddress: requestMetadata.ipAddress
            });
        } catch (error) {
            logger.error('Failed to log auth attempt', error);
        }
    }
    
    /**
     * Validate and sanitize redirect URL to prevent open redirect attacks
     */
    private validateRedirectUrl(redirectUrl: string, request: Request): string | null {
        try {
            const requestUrl = new URL(request.url);
            
            // Handle relative URLs by constructing absolute URL with same origin
            const redirectUrlObj = redirectUrl.startsWith('/') 
                ? new URL(redirectUrl, requestUrl.origin)
                : new URL(redirectUrl);
            
            // Only allow same-origin redirects for security
            if (redirectUrlObj.origin !== requestUrl.origin) {
                logger.warn('OAuth redirect URL rejected: different origin', {
                    redirectUrl: redirectUrl,
                    requestOrigin: requestUrl.origin,
                    redirectOrigin: redirectUrlObj.origin
                });
                return null;
            }
            
            // Prevent redirecting to authentication endpoints to avoid loops
            const authPaths = ['/api/auth/', '/logout'];
            if (authPaths.some(path => redirectUrlObj.pathname.startsWith(path))) {
                logger.warn('OAuth redirect URL rejected: auth endpoint', {
                    redirectUrl: redirectUrl,
                    pathname: redirectUrlObj.pathname
                });
                return null;
            }
            
            return redirectUrl;
        } catch (error) {
            logger.warn('Invalid OAuth redirect URL format', { redirectUrl, error });
            return null;
        }
    }

    /**
     * Generate and store verification OTP for email
     */
    private async generateAndStoreVerificationOtp(email: string): Promise<void> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

        // Store OTP in database (you may need to create a verification_otps table)
        await this.database.insert(schema.verificationOtps).values({
            id: generateId(),
            email: email.toLowerCase(),
            otp: await this.passwordService.hash(otp), // Hash the OTP for security
            expiresAt,
            createdAt: new Date()
        });

        // TODO: Send email with OTP (integrate with email service)
        logger.info('Verification OTP generated', { email, otp: otp.slice(0, 2) + '****' });
    }

    /**
     * Verify email with OTP
     */
    async verifyEmailWithOtp(email: string, otp: string, request: Request): Promise<AuthResult> {
        try {
            // Find valid OTP
            const storedOtp = await this.database
                .select()
                .from(schema.verificationOtps)
                .where(
                    and(
                        eq(schema.verificationOtps.email, email.toLowerCase()),
                        eq(schema.verificationOtps.used, false),
                        sql`${schema.verificationOtps.expiresAt} > ${new Date()}`
                    )
                )
                .orderBy(sql`${schema.verificationOtps.createdAt} DESC`)
                .get();

            if (!storedOtp) {
                throw new SecurityError(
                    SecurityErrorType.INVALID_INPUT,
                    'Invalid or expired verification code',
                    400
                );
            }

            // Verify OTP
            const otpValid = await this.passwordService.verify(otp, storedOtp.otp);
            if (!otpValid) {
                throw new SecurityError(
                    SecurityErrorType.INVALID_INPUT,
                    'Invalid verification code',
                    400
                );
            }

            // Mark OTP as used
            await this.database
                .update(schema.verificationOtps)
                .set({ used: true, usedAt: new Date() })
                .where(eq(schema.verificationOtps.id, storedOtp.id));

            // Find and verify the user
            const user = await this.database
                .select()
                .from(schema.users)
                .where(eq(schema.users.email, email.toLowerCase()))
                .get();

            if (!user) {
                throw new SecurityError(
                    SecurityErrorType.INVALID_INPUT,
                    'User not found',
                    404
                );
            }

            // Update user as verified
            await this.database
                .update(schema.users)
                .set({ emailVerified: true, updatedAt: new Date() })
                .where(eq(schema.users.id, user.id));

            // Create session for verified user
            const { accessToken, session } = await this.sessionService.createSession(
                user.id,
                request
            );

            // Log successful verification
            await this.logAuthAttempt(email, 'email_verification', true, request);
            logger.info('Email verified successfully', { email, userId: user.id });

            return {
                user: mapUserResponse({ ...user, emailVerified: true }),
                accessToken,
                sessionId: session.sessionId,
                expiresAt: session.expiresAt,
            };
        } catch (error) {
            await this.logAuthAttempt(email, 'email_verification', false, request);
            
            if (error instanceof SecurityError) {
                throw error;
            }
            
            logger.error('Email verification error', error);
            throw new SecurityError(
                SecurityErrorType.INVALID_INPUT,
                'Email verification failed',
                500
            );
        }
    }

    /**
     * Get user for authentication (for middleware)
     */
    async getUserForAuth(userId: string): Promise<AuthUser | null> {
        try {
            const user = await this.database
                .select({
                    id: schema.users.id,
                    email: schema.users.email,
                    displayName: schema.users.displayName,
                    username: schema.users.username,
                    avatarUrl: schema.users.avatarUrl,
                    bio: schema.users.bio,
                    timezone: schema.users.timezone,
                    provider: schema.users.provider,
                    emailVerified: schema.users.emailVerified,
                    createdAt: schema.users.createdAt,
                    role: schema.users.role,
                })
                .from(schema.users)
                .where(
                    and(
                        eq(schema.users.id, userId),
                        isNull(schema.users.deletedAt),
                        // Suspended/deactivated accounts stop authenticating on
                        // every request, not just at login (defense in depth).
                        // NULL-tolerant: only an EXPLICIT suspended/inactive
                        // state blocks (mirrors the login check), so legacy rows
                        // with NULL status are never silently locked out.
                        or(isNull(schema.users.isSuspended), eq(schema.users.isSuspended, false)),
                        or(isNull(schema.users.isActive), eq(schema.users.isActive, true))
                    )
                )
                .get()
                .catch((error: unknown) => {
                    logger.error('getUserForAuth query failed', {
                        errorMessage: error instanceof Error ? error.message : String(error),
                        errorName: error instanceof Error ? error.name : 'UnknownError',
                        errorCause: (error as any)?.cause,
                        errorStack: error instanceof Error ? error.stack?.split('\n').slice(0, 5).join('\n') : undefined,
                        userId
                    });
                    throw error;
                });
            
            if (!user) {
                logger.debug('User not found for auth', { userId });
                return null;
            }
            
            return mapUserResponse(user);
        } catch (error: unknown) {
            logger.error('Error getting user for auth', {
                errorMessage: error instanceof Error ? error.message : String(error),
                errorName: error instanceof Error ? error.name : 'UnknownError',
                errorCause: (error as any)?.cause,
                userId
            });
            return null;
        }
    }
    
    /**
     * Validate token and return user (for middleware)
     */
    async validateTokenAndGetUser(token: string, env: Env): Promise<AuthUserSession | null> {
        try {
            const jwtUtils = JWTUtils.getInstance(env);
            const payload = await jwtUtils.verifyToken(token);
            
            if (!payload || payload.type !== 'access') {
                return null;
            }
            
            // Check if token is expired
            if (payload.exp * 1000 < Date.now()) {
                logger.debug('Token expired', { exp: payload.exp });
                return null;
            }
            
            // Get user from database
            const user = await this.getUserForAuth(payload.sub);
            if (!user) {
                return null;
            }

            // Impersonation indirection (Phase 1). If this actor holds an active
            // grant on this session, resolve the EFFECTIVE identity as the target
            // user (so every downstream consumer transparently acts as them),
            // while preserving the real actor for audit/attribution/the banner.
            // Re-checked from D1 every request, so a stop/revoke is instant; the
            // grant lookup is skipped entirely for non-impersonator roles.
            const impersonated = await this.tryResolveImpersonation(user, payload.sessionId);
            if (impersonated) {
                return { user: impersonated, sessionId: payload.sessionId };
            }

            // Resolve the active org per-request (NEVER from the JWT) from the
            // session's currentOrgId, re-validating membership so an org-switch
            // or revocation is effective on the very next request. Falls back to
            // the personal org for a null/stale/left active org.
            const activeOrg = await this.organizationService.resolveActiveOrg(user.id, payload.sessionId);

            return {
                user: { ...user, orgId: activeOrg.orgId, orgRole: activeOrg.orgRole },
                sessionId: payload.sessionId,
            };
        } catch (error) {
            logger.error('Token validation error', error);
            return null;
        }
    }

    /**
     * Resolve the effective (target) identity for an impersonated request, or
     * null for a normal session. The grant lookup is gated on the actor's role
     * FIRST, so the extra D1 read is incurred only for impersonator-capable
     * accounts — every normal user request short-circuits before touching the
     * grant table.
     *
     * Privilege is re-validated SYMMETRICALLY here every request: a demoted
     * actor's grant stops working immediately, a target since suspended/deleted
     * (so getUserForAuth returns null) collapses back to acting as the actor,
     * and a target PROMOTED into a staff/operator role mid-grant likewise stops
     * being impersonable (no impersonating up/laterally into staff). The
     * target's OWN current working org is resolved (resolveUserDefaultOrg —
     * NOT the actor's session, which could never match the target), and the real
     * actor is stamped onto the returned AuthUser for audit/attribution/banner.
     *
     * FAIL-SAFE: the impersonation subsystem must NEVER be able to break base
     * auth. Any error in the grant/target/org resolution degrades to null (act as
     * the actor themselves, non-impersonated) rather than failing the whole
     * token validation — otherwise a transient grant-table issue would 401 the
     * operator out entirely (it once did, when migration 0012 lagged the deploy).
     */
    private async tryResolveImpersonation(
        actor: AuthUser,
        sessionId: string,
    ): Promise<AuthUser | null> {
        if (!actorRoleMayImpersonate(actor.role)) {
            return null;
        }
        try {
            const grant = await this.impersonationService.resolveActiveGrant(sessionId);
            if (!grant || grant.actorUserId !== actor.id) {
                return null;
            }
            const target = await this.getUserForAuth(grant.targetUserId);
            if (!target || !targetRoleMayBeImpersonated(target.role)) {
                return null;
            }
            const activeOrg = await this.organizationService.resolveUserDefaultOrg(target.id);
            return {
                ...target,
                orgId: activeOrg.orgId,
                orgRole: activeOrg.orgRole,
                impersonatedBy: actor.id,
                impersonatorRole: actor.role,
                impersonationReadOnly: grant.readOnly,
            };
        } catch (error) {
            logger.error('Impersonation resolution failed; continuing as the actor', {
                actorId: actor.id,
                error,
            });
            return null;
        }
    }

    /**
     * Resend verification OTP
     */
    async resendVerificationOtp(email: string): Promise<void> {
        try {
            // Check if user exists and is unverified
            const user = await this.database
                .select()
                .from(schema.users)
                .where(eq(schema.users.email, email.toLowerCase()))
                .get();

            if (!user) {
                throw new SecurityError(
                    SecurityErrorType.INVALID_INPUT,
                    'No account found with this email',
                    404
                );
            }

            if (user.emailVerified) {
                throw new SecurityError(
                    SecurityErrorType.INVALID_INPUT,
                    'Email is already verified',
                    400
                );
            }

            // Invalidate existing OTPs
            await this.database
                .update(schema.verificationOtps)
                .set({ used: true, usedAt: new Date() })
                .where(
                    and(
                        eq(schema.verificationOtps.email, email.toLowerCase()),
                        eq(schema.verificationOtps.used, false)
                    )
                );

            // Generate new OTP
            await this.generateAndStoreVerificationOtp(email.toLowerCase());
            
            logger.info('Verification OTP resent', { email });
        } catch (error) {
            if (error instanceof SecurityError) {
                throw error;
            }
            
            logger.error('Resend verification OTP error', error);
            throw new SecurityError(
                SecurityErrorType.INVALID_INPUT,
                'Failed to resend verification code',
                500
            );
        }
    }
}