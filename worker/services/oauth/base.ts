/**
 * Base OAuth Provider
 * Abstract base class for OAuth provider implementations
 */

import { OAuthUserInfo } from '../../types/auth-types';
import { createLogger } from '../../logger';

const logger = createLogger('OAuthProvider');


/**
 * OAuth tokens returned from providers
 */
export interface OAuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    tokenType: string;
}

/**
 * How client credentials are presented when calling the token endpoint.
 * - `body`: include `client_id`/`client_secret` in the form body (RFC 6749 default).
 * - `basic`: send credentials via HTTP Basic Authorization header
 *   (required by some providers, e.g. Cloudflare's OAuth).
 */
export type OAuthClientAuthMethod = 'body' | 'basic';

/**
 * Base OAuth Provider class
 */
export abstract class BaseOAuthProvider {
    protected abstract readonly provider: string;
    protected abstract readonly authorizationUrl: string;
    protected abstract readonly tokenUrl: string;
    protected abstract readonly userInfoUrl: string;
    protected abstract readonly scopes: string[];
    /** Providers may override to use HTTP Basic auth for token requests. */
    protected readonly clientAuthMethod: OAuthClientAuthMethod = 'body';

    constructor(
        protected clientId: string,
        protected clientSecret: string,
        protected redirectUri: string
    ) {}
    
    /**
     * Get authorization URL
     */
    async getAuthorizationUrl(state: string, codeVerifier?: string): Promise<string> {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            response_type: 'code',
            scope: this.scopes.join(' '),
            state,
            access_type: 'offline', // Request refresh token
            prompt: 'consent' // Force consent to get refresh token
        });
        
        // Add PKCE challenge if provided
        if (codeVerifier) {
            const challenge = await this.generateCodeChallenge(codeVerifier);
            params.append('code_challenge', challenge);
            params.append('code_challenge_method', 'S256');
        }
        
        return `${this.authorizationUrl}?${params.toString()}`;
    }
    
    /**
     * POST to the token endpoint with the configured client-auth method and parse
     * the standard OAuth token response. Subclasses pick `clientAuthMethod` to
     * either include client credentials in the form body (RFC 6749 default) or
     * send them via HTTP Basic Authorization (required by Cloudflare OAuth).
     */
    protected async postTokenRequest(
        params: URLSearchParams,
        context: 'exchange' | 'refresh'
    ): Promise<{
        access_token: string;
        refresh_token?: string;
        expires_in?: number;
        token_type?: string;
    }> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        };

        if (this.clientAuthMethod === 'basic') {
            headers.Authorization = `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`;
        } else {
            params.set('client_id', this.clientId);
            params.set('client_secret', this.clientSecret);
        }

        const response = await fetch(this.tokenUrl, {
            method: 'POST',
            headers,
            body: params.toString(),
        });

        if (!response.ok) {
            const error = await response.text();
            logger.error(`Token ${context} failed`, { provider: this.provider, error });
            throw new Error(`Token ${context} failed: ${error}`);
        }

        return await response.json() as {
            access_token: string;
            refresh_token?: string;
            expires_in?: number;
            token_type?: string;
        };
    }

    /**
     * Exchange authorization code for tokens
     */
    async exchangeCodeForTokens(
        code: string,
        codeVerifier?: string
    ): Promise<OAuthTokens> {
        try {
            const params = new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: this.redirectUri,
            });

            if (codeVerifier) {
                params.append('code_verifier', codeVerifier);
            }

            const data = await this.postTokenRequest(params, 'exchange');

            return {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiresIn: data.expires_in,
                tokenType: data.token_type || 'Bearer'
            };
        } catch (error) {
            logger.error('Error exchanging code for tokens', error);
            throw error;
        }
    }

    /**
     * Get user info from provider
     */
    abstract getUserInfo(accessToken: string): Promise<OAuthUserInfo>;

    /**
     * Refresh access token
     */
    async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
        try {
            const params = new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            });

            const data = await this.postTokenRequest(params, 'refresh');

            return {
                accessToken: data.access_token,
                refreshToken: data.refresh_token || refreshToken, // Some providers don't return new refresh token
                expiresIn: data.expires_in,
                tokenType: data.token_type || 'Bearer'
            };
        } catch (error) {
            logger.error('Error refreshing access token', error);
            throw error;
        }
    }
    
    /**
     * Generate PKCE code challenge
     */
    protected async generateCodeChallenge(verifier: string): Promise<string> {
        // Generate SHA256 hash of the verifier
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        
        // Convert to base64url
        const hashArray = new Uint8Array(hashBuffer);
        const base64String = btoa(String.fromCharCode(...hashArray));
        
        // Convert to base64url format
        return base64String
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
    
    /**
     * Generate PKCE code verifier
     */
    static generateCodeVerifier(): string {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return btoa(String.fromCharCode(...array))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
}