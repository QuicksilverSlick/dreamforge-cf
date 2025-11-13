/**
 * GitHub Token Service
 * Handles storage and retrieval of GitHub OAuth access tokens for BYOP feature
 */

import { BaseService } from './BaseService';
import * as schema from '../schema';
import { eq, and, desc } from 'drizzle-orm';
import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { generateId } from '../../utils/idGenerator';

export class GitHubTokenService extends BaseService {
    /**
     * Encrypt a GitHub access token using XChaCha20-Poly1305
     */
    private async encryptToken(accessToken: string): Promise<string> {
        try {
            if (!this.env.SECRETS_ENCRYPTION_KEY) {
                throw new Error('SECRETS_ENCRYPTION_KEY environment variable not set');
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

            return btoa(String.fromCharCode(...combined));
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

            const combined = new Uint8Array(
                Array.from(atob(encryptedToken), c => c.charCodeAt(0))
            );

            const salt = combined.slice(0, 16);
            const nonce = combined.slice(16, 40);
            const encrypted = combined.slice(40);

            const keyMaterial = await this.deriveKey(this.env.SECRETS_ENCRYPTION_KEY, salt);

            const cipher = xchacha20poly1305(keyMaterial, nonce);
            const decrypted = cipher.decrypt(encrypted);

            return new TextDecoder().decode(decrypted);
        } catch (error) {
            this.logger.error('Error decrypting GitHub token:', error);
            throw new Error('Failed to decrypt GitHub token');
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
                iterations: 100000,
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
            const encryptedAccessToken = await this.encryptToken(accessToken);

            const now = new Date();
            const newToken = {
                id: generateId(),
                userId,
                encryptedAccessToken,
                tokenType: 'bearer',
                scopes: JSON.stringify(scopes),
                expiresAt: null,
                lastUsed: null,
                isActive: true,
                isRevoked: false,
                revokedAt: null,
                createdAt: now,
                updatedAt: now
            };

            await this.database
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
                );

            await this.database.insert(schema.githubTokens).values(newToken);

            this.logger.info('GitHub token stored successfully', {
                userId,
                scopes: scopes.join(',')
            });
        } catch (error) {
            this.logger.error('Failed to store GitHub token', error);
            throw error;
        }
    }

    /**
     * Get active GitHub token for a user
     */
    async getActiveToken(userId: string): Promise<{ token: string; scopes: string[] } | null> {
        try {
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

            if (!tokenRecord) {
                return null;
            }

            await this.database
                .update(schema.githubTokens)
                .set({ lastUsed: new Date() })
                .where(eq(schema.githubTokens.id, tokenRecord.id));

            const decryptedToken = await this.decryptToken(tokenRecord.encryptedAccessToken);
            const scopes = JSON.parse(tokenRecord.scopes as string) as string[];

            return {
                token: decryptedToken,
                scopes
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
