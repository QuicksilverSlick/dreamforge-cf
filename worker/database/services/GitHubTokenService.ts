/**
 * GitHub Token Service
 * Handles storage and retrieval of GitHub OAuth access tokens for BYOP feature
 */

import { BaseService } from './BaseService';
import * as schema from '../schema';
import { eq, and, desc } from 'drizzle-orm';
import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { generateId } from '../../utils/idGenerator';
import type { GitHubTokenStatus } from '../types';

// GitHubTokenStatus (plaintext-safe, metadata only) lives in ../types so the
// SPA can consume it without importing this service's runtime module.
export type { GitHubTokenStatus } from '../types';

export class GitHubTokenService extends BaseService {
    /**
     * Helper: Convert Uint8Array to Base64 string (binary-safe)
     */
    private arrayBufferToBase64(buffer: Uint8Array): string {
        let binary = '';
        for (let i = 0; i < buffer.length; i++) {
            binary += String.fromCharCode(buffer[i]);
        }
        return btoa(binary);
    }

    /**
     * Helper: Convert Base64 string to Uint8Array (binary-safe)
     */
    private base64ToArrayBuffer(base64: string): Uint8Array {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    /**
     * Validate GitHub token format
     */
    private isValidGitHubToken(token: string): boolean {
        const tokenPatterns = [
            /^gho_[A-Za-z0-9_]+$/,              // OAuth tokens (variable length, includes underscore)
            /^ghu_[A-Za-z0-9_]+$/,              // User-to-server tokens (variable length, includes underscore)
            /^ghp_[A-Za-z0-9_]+$/,              // Personal access tokens (classic, variable length)
            /^github_pat_[A-Za-z0-9]{22}_[A-Za-z0-9]{59}$/  // Fine-grained PATs (fixed length)
        ];

        return tokenPatterns.some(pattern => pattern.test(token)) && token.length >= 20 && token.length <= 255;
    }

    /**
     * Encrypt a GitHub access token using XChaCha20-Poly1305
     */
    private async encryptToken(accessToken: string): Promise<string> {
        try {
            if (!this.env.SECRETS_ENCRYPTION_KEY) {
                throw new Error('SECRETS_ENCRYPTION_KEY environment variable not set');
            }

            // Validate token format before encryption
            if (!this.isValidGitHubToken(accessToken)) {
                this.logger.error('Invalid GitHub token format before encryption', {
                    tokenPrefix: accessToken.substring(0, 4),
                    tokenLength: accessToken.length
                });
                throw new Error('Invalid GitHub token format');
            }

            const salt = crypto.getRandomValues(new Uint8Array(16));
            const keyMaterial = await this.deriveKey(this.env.SECRETS_ENCRYPTION_KEY, salt);

            const nonce = crypto.getRandomValues(new Uint8Array(24));

            const cipher = xchacha20poly1305(keyMaterial, nonce);
            const encoder = new TextEncoder();
            const data = encoder.encode(accessToken);
            const encrypted = cipher.encrypt(data);

            const combined = new Uint8Array(salt.length + nonce.length + encrypted.length);
            combined.set(salt, 0);
            combined.set(nonce, salt.length);
            combined.set(encrypted, salt.length + nonce.length);

            // Use binary-safe Base64 encoding instead of btoa with spread operator
            return this.arrayBufferToBase64(combined);
        } catch (error) {
            this.logger.error('Error encrypting GitHub token:', error);
            throw new Error('Failed to encrypt GitHub token');
        }
    }

    /**
     * Decrypt a GitHub access token
     */
    async decryptToken(encryptedToken: string): Promise<string> {
        try {
            if (!this.env.SECRETS_ENCRYPTION_KEY) {
                throw new Error('SECRETS_ENCRYPTION_KEY environment variable not set');
            }

            // Use binary-safe Base64 decoding
            const combined = this.base64ToArrayBuffer(encryptedToken);

            const salt = combined.slice(0, 16);
            const nonce = combined.slice(16, 40);
            const encrypted = combined.slice(40);

            const keyMaterial = await this.deriveKey(this.env.SECRETS_ENCRYPTION_KEY, salt);

            const cipher = xchacha20poly1305(keyMaterial, nonce);

            let decrypted: Uint8Array;
            try {
                decrypted = cipher.decrypt(encrypted);
            } catch (decryptError) {
                this.logger.error('XChaCha20-Poly1305 decryption failed - possible data corruption or wrong key', {
                    encryptedLength: encryptedToken.length,
                    combinedLength: combined.length
                });
                throw new Error('Token decryption failed - authentication tag mismatch');
            }

            const decryptedToken = new TextDecoder().decode(decrypted);

            // Validate token format after decryption
            if (!this.isValidGitHubToken(decryptedToken)) {
                this.logger.error('Decrypted token has invalid format', {
                    tokenPrefix: decryptedToken.substring(0, 4),
                    tokenLength: decryptedToken.length,
                    looksValid: decryptedToken.length >= 40 && /^gh[opus]_/.test(decryptedToken)
                });
                throw new Error('Invalid GitHub token format after decryption');
            }

            this.logger.info('Token decryption successful', {
                tokenPrefix: decryptedToken.substring(0, 4),
                tokenSuffix: decryptedToken.substring(decryptedToken.length - 4),
                tokenLength: decryptedToken.length,
                tokenFormat: decryptedToken.startsWith('ghp_') ? 'PAT' :
                             decryptedToken.startsWith('gho_') ? 'OAuth' :
                             decryptedToken.startsWith('ghs_') ? 'Installation' : 'Unknown'
            });

            return decryptedToken;
        } catch (error) {
            this.logger.error('Error decrypting GitHub token:', {
                error: error instanceof Error ? error.message : String(error),
                hasEncryptionKey: !!this.env.SECRETS_ENCRYPTION_KEY
            });
            throw error instanceof Error ? error : new Error('Failed to decrypt GitHub token');
        }
    }

    /**
     * Derive encryption key using PBKDF2
     */
    private async deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);

        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );

        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,  // Cloudflare Workers maximum (platform limit, OWASP 2025 recommends 600,000)
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        );

        return new Uint8Array(derivedBits);
    }

    /**
     * Store GitHub OAuth access token for a user
     */
    async storeToken(userId: string, accessToken: string, scopes: string[]): Promise<void> {
        try {
            this.logger.info('=== GitHubTokenService.storeToken START ===', {
                userId,
                scopes,
                tokenPrefix: accessToken.substring(0, 4),
                tokenLength: accessToken.length,
                hasDatabase: !!this.database,
                hasEncryptionKey: !!this.env.SECRETS_ENCRYPTION_KEY
            });

            this.logger.info('Step 1: Encrypting token');
            const encryptedAccessToken = await this.encryptToken(accessToken);
            this.logger.info('Step 1: Token encrypted successfully', {
                encryptedLength: encryptedAccessToken.length
            });

            const now = new Date();
            const tokenId = generateId();
            const newToken = {
                id: tokenId,
                userId,
                encryptedAccessToken,
                tokenType: 'bearer',
                scopes,
                expiresAt: null,
                lastUsed: null,
                isActive: true,
                isRevoked: false,
                revokedAt: null,
                createdAt: now,
                updatedAt: now
            };

            this.logger.info('Step 2: Executing atomic UPDATE+INSERT in D1 batch transaction', {
                userId,
                tokenId
            });

            // Use D1 batch for atomic operation - all succeed or all rollback
            const [deactivateResult, insertResult] = await this.database.batch([
                this.database
                    .update(schema.githubTokens)
                    .set({
                        isActive: false,
                        updatedAt: now
                    })
                    .where(
                        and(
                            eq(schema.githubTokens.userId, userId),
                            eq(schema.githubTokens.isActive, true)
                        )
                    ),
                this.database
                    .insert(schema.githubTokens)
                    .values(newToken)
            ]);

            this.logger.info('Step 2: Batch transaction complete', {
                deactivate: {
                    changes: deactivateResult.meta?.changes ?? 0,
                    success: deactivateResult.success,
                    hadActiveTokens: (deactivateResult.meta?.changes ?? 0) > 0
                },
                insert: {
                    changes: insertResult.meta?.changes ?? 0,
                    success: insertResult.success,
                    lastRowId: insertResult.meta?.last_row_id,
                    duration: insertResult.meta?.duration
                }
            });

            // CRITICAL: Validate the UPDATE succeeded
            if (!deactivateResult.success) {
                throw new Error('Failed to deactivate existing GitHub tokens - D1 batch operation returned success=false');
            }

            // CRITICAL: Validate the INSERT succeeded
            if (!insertResult.success) {
                throw new Error('GitHub token INSERT failed - D1 batch operation returned success=false');
            }

            // CRITICAL: Validate a row was actually inserted
            const changesCount = insertResult.meta?.changes ?? 0;
            if (changesCount !== 1) {
                throw new Error(`GitHub token INSERT failed - expected 1 row inserted, got ${changesCount} changes`);
            }

            this.logger.info('✅ GitHub token stored successfully', {
                userId,
                tokenId,
                scopes: scopes.join(',')
            });
        } catch (error) {
            this.logger.error('❌ Failed to store GitHub token', {
                userId,
                errorMessage: error instanceof Error ? error.message : String(error),
                errorStack: error instanceof Error ? error.stack : undefined,
                errorName: error instanceof Error ? error.name : 'Unknown'
            });
            throw error;
        }
    }

    /**
     * Get active GitHub token for a user
     */
    async getActiveToken(userId: string): Promise<{ token: string; scopes: string[] } | null> {
        try {
            this.logger.info('=== GitHubTokenService.getActiveToken START ===', {
                userId,
                hasDatabase: !!this.database,
                hasSchema: !!schema.githubTokens
            });

            this.logger.info('Executing database query for GitHub token');
            const tokenRecord = await this.database
                .select()
                .from(schema.githubTokens)
                .where(
                    and(
                        eq(schema.githubTokens.userId, userId),
                        eq(schema.githubTokens.isActive, true),
                        eq(schema.githubTokens.isRevoked, false)
                    )
                )
                .orderBy(desc(schema.githubTokens.createdAt))
                .get();

            this.logger.info('Database query result:', {
                hasTokenRecord: !!tokenRecord,
                tokenId: tokenRecord?.id
            });

            if (!tokenRecord) {
                this.logger.warn('No active GitHub token found for user', { userId });
                return null;
            }

            await this.database
                .update(schema.githubTokens)
                .set({ lastUsed: new Date() })
                .where(eq(schema.githubTokens.id, tokenRecord.id));

            const decryptedToken = await this.decryptToken(tokenRecord.encryptedAccessToken);

            return {
                token: decryptedToken,
                scopes: tokenRecord.scopes
            };
        } catch (error) {
            this.logger.error('Failed to get GitHub token', error);
            throw error;
        }
    }

    /**
     * Revoke GitHub token for a user
     */
    async revokeToken(userId: string): Promise<void> {
        try {
            const now = new Date();
            await this.database
                .update(schema.githubTokens)
                .set({
                    isActive: false,
                    isRevoked: true,
                    revokedAt: now,
                    updatedAt: now
                })
                .where(
                    and(
                        eq(schema.githubTokens.userId, userId),
                        eq(schema.githubTokens.isActive, true)
                    )
                );

            this.logger.info('GitHub token revoked successfully', { userId });
        } catch (error) {
            this.logger.error('Failed to revoke GitHub token', error);
            throw error;
        }
    }

    /**
     * Read GitHub connection status for an operator/admin view. Metadata only:
     * selects no encrypted column and never calls decryptToken. Returns null
     * when the user has never connected GitHub.
     */
    async getTokenStatus(userId: string): Promise<GitHubTokenStatus | null> {
        const record = await this.getReadDb('fast')
            .select({
                isActive: schema.githubTokens.isActive,
                isRevoked: schema.githubTokens.isRevoked,
                tokenType: schema.githubTokens.tokenType,
                scopes: schema.githubTokens.scopes,
                lastUsed: schema.githubTokens.lastUsed,
                revokedAt: schema.githubTokens.revokedAt,
                createdAt: schema.githubTokens.createdAt,
                updatedAt: schema.githubTokens.updatedAt,
            })
            .from(schema.githubTokens)
            .where(eq(schema.githubTokens.userId, userId))
            .orderBy(desc(schema.githubTokens.createdAt))
            .get();

        if (!record) {
            return null;
        }

        return {
            connected: true,
            isActive: record.isActive ?? false,
            isRevoked: record.isRevoked ?? false,
            tokenType: record.tokenType,
            scopes: record.scopes,
            lastUsed: record.lastUsed ?? null,
            revokedAt: record.revokedAt ?? null,
            createdAt: record.createdAt ?? null,
            updatedAt: record.updatedAt ?? null,
        };
    }

    /**
     * Check if user has an active GitHub token with required scopes
     */
    async hasTokenWithScopes(userId: string, requiredScopes: string[]): Promise<boolean> {
        try {
            const tokenData = await this.getActiveToken(userId);

            if (!tokenData) {
                return false;
            }

            return requiredScopes.every(scope => tokenData.scopes.includes(scope));
        } catch (error) {
            this.logger.error('Failed to check GitHub token scopes', error);
            return false;
        }
    }
}
