/**
 * Secrets Service
 * Handles encryption/decryption and management of user API keys and secrets
 */

import { BaseService } from './BaseService';
import * as schema from '../schema';
import { eq, and, sql } from 'drizzle-orm';
import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { getBYOKTemplates } from '../../types/secretsTemplates';
import { generateId } from '../../utils/idGenerator';
import type { SecretData, EncryptedSecret } from '../types';

/**
 * Blob format version prefix. Versioning the format up front is what makes a
 * future master-key rotation or KDF migration possible without
 * trial-decryption heuristics.
 */
const BLOB_VERSION_PREFIX = 'v1:';

export class SecretsService extends BaseService {
    /**
     * The master secret must be high-entropy: the PBKDF2 work factor below is
     * capped by the Workers runtime and cannot compensate for a weak key.
     */
    private getMasterSecret(): string {
        const key = this.env.SECRETS_ENCRYPTION_KEY;
        if (!key) {
            throw new Error('SECRETS_ENCRYPTION_KEY environment variable not set');
        }
        if (key.trim().length < 32) {
            throw new Error('SECRETS_ENCRYPTION_KEY must be at least 32 characters of random data');
        }
        return key;
    }

    /**
     * AAD binds the ciphertext to its exact row identity: the owning user and
     * the secret slot. A ciphertext re-parented onto another user's row — or
     * swapped onto a different slot of the same user — fails the Poly1305 tag
     * check at decrypt time, so a decrypted secret can never be served outside
     * the (user, slot) it was encrypted for, even if a query bug or direct
     * database tampering moves rows around.
     */
    private buildAad(userId: string, secretType: string): Uint8Array {
        return new TextEncoder().encode(`${userId}:${secretType}`);
    }

    /**
     * Encrypt a secret value using XChaCha20-Poly1305 with the owning user's
     * id and the secret slot bound as additional authenticated data.
     */
    private async encryptSecret(value: string, userId: string, secretType: string): Promise<{ encryptedValue: string; keyPreview: string }> {
        try {
            const masterSecret = this.getMasterSecret();

            // Derive a per-record 32-byte key
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const keyMaterial = await this.deriveKey(masterSecret, salt);

            // Generate random 24-byte nonce for XChaCha20-Poly1305
            const nonce = crypto.getRandomValues(new Uint8Array(24));

            const cipher = xchacha20poly1305(keyMaterial, nonce, this.buildAad(userId, secretType));
            const data = new TextEncoder().encode(value);
            const encrypted = cipher.encrypt(data);

            // Combine salt + nonce + encrypted data
            const combined = new Uint8Array(salt.length + nonce.length + encrypted.length);
            combined.set(salt, 0);
            combined.set(nonce, salt.length);
            combined.set(encrypted, salt.length + nonce.length);

            const encryptedValue = `${BLOB_VERSION_PREFIX}${btoa(String.fromCharCode(...combined))}`;

            // Create preview (first 4 + last 4 characters, masked middle)
            const keyPreview = value.length > 8
                ? `${value.slice(0, 4)}${'*'.repeat(Math.max(0, value.length - 8))}${value.slice(-4)}`
                : '*'.repeat(value.length);

            return { encryptedValue, keyPreview };
        } catch (error) {
            this.logger.error('Error encrypting secret:', error);
            throw new Error('Failed to encrypt secret');
        }
    }

    /**
     * Decrypt a secret value. The expected owner's id and secret slot are
     * passed as the authenticated data, so decryption fails for any
     * (user, slot) other than the one the secret was encrypted for.
     */
    private async decryptSecret(encryptedValue: string, userId: string, secretType: string): Promise<string> {
        try {
            const masterSecret = this.getMasterSecret();

            if (!encryptedValue.startsWith(BLOB_VERSION_PREFIX)) {
                throw new Error('Unsupported secret blob format version');
            }

            // Decode the base64 encrypted data
            const combined = new Uint8Array(
                Array.from(atob(encryptedValue.slice(BLOB_VERSION_PREFIX.length)), c => c.charCodeAt(0))
            );

            // Extract salt (first 16 bytes), nonce (next 24 bytes) and encrypted data (rest)
            const salt = combined.slice(0, 16);
            const nonce = combined.slice(16, 40);
            const encrypted = combined.slice(40);

            // Derive the same key using PBKDF2
            const keyMaterial = await this.deriveKey(masterSecret, salt);

            const cipher = xchacha20poly1305(keyMaterial, nonce, this.buildAad(userId, secretType));
            const decrypted = cipher.decrypt(encrypted);

            return new TextDecoder().decode(decrypted);
        } catch (error) {
            this.logger.error('Error decrypting secret:', error);
            throw new Error('Failed to decrypt secret');
        }
    }

    /**
     * Whether a secret's optional expiry has passed.
     */
    private isExpired(secret: Pick<schema.UserSecret, 'expiresAt'>): boolean {
        return secret.expiresAt !== null && secret.expiresAt.getTime() <= Date.now();
    }

    /**
     * Derive a key using PBKDF2
     */
    private async deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);
        
        // Import password as key material
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );
        
        // Derive 256-bit key using PBKDF2
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                // Workers runtime maximum. The input is a validated
                // high-entropy machine secret (not a password), so the
                // work factor is not load-bearing here.
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            256 // 32 bytes
        );
        
        return new Uint8Array(derivedBits);
    }

    /**
     * Store a new secret for a user. BYOK provider keys (secretType matching
     * a BYOK template) are upserted — one live key per provider — because the
     * inference lookup resolves by secretType; other secret types insert a
     * new row and are referenced by id (e.g. custom model providers).
     */
    async storeSecret(userId: string, secretData: SecretData): Promise<EncryptedSecret> {
        try {
            // Validate input
            if (!secretData.value || !secretData.provider || !secretData.secretType) {
                throw new Error('Missing required secret data');
            }

            // A BYOK slot may only be written by its own template (which
            // carries the provider and value validation); anything else
            // claiming the slot would bypass that validation.
            const byokTemplate = getBYOKTemplates().find(
                (template) => template.envVarName === secretData.secretType
            );
            if (byokTemplate && byokTemplate.provider !== secretData.provider) {
                throw new Error(`Secret type ${secretData.secretType} is reserved for the ${byokTemplate.provider} provider key template`);
            }

            // Encrypt the secret value, bound to the owning user and slot
            const { encryptedValue, keyPreview } = await this.encryptSecret(secretData.value, userId, secretData.secretType);

            const now = new Date();
            const newSecret = {
                id: generateId(),
                userId,
                name: secretData.name,
                provider: secretData.provider,
                secretType: secretData.secretType,
                encryptedValue,
                keyPreview,
                description: secretData.description ?? null,
                expiresAt: secretData.expiresAt ?? null,
                lastUsed: null,
                isActive: true,
                usageCount: 0,
                createdAt: now,
                updatedAt: now
            };

            if (byokTemplate) {
                // Atomic upsert against the partial unique index on BYOK
                // rows: concurrent stores can never create duplicates, and
                // the inference lookup always resolves a single row.
                const [storedSecret] = await this.database
                    .insert(schema.userSecrets)
                    .values(newSecret)
                    .onConflictDoUpdate({
                        target: [schema.userSecrets.userId, schema.userSecrets.secretType],
                        targetWhere: sql`secret_type LIKE '%\\_BYOK' ESCAPE '\\'`,
                        set: {
                            name: secretData.name,
                            provider: secretData.provider,
                            encryptedValue,
                            keyPreview,
                            description: secretData.description ?? null,
                            expiresAt: secretData.expiresAt ?? null,
                            // A replaced credential starts its usage history over.
                            lastUsed: null,
                            usageCount: 0,
                            isActive: true,
                            updatedAt: now
                        }
                    })
                    .returning();

                if (!storedSecret) {
                    throw new Error('Failed to store secret');
                }

                this.logger.info('BYOK secret stored', {
                    userId,
                    provider: secretData.provider,
                    secretType: secretData.secretType
                });

                return this.formatSecretResponse(storedSecret);
            }

            await this.database.insert(schema.userSecrets).values(newSecret);

            this.logger.info('Secret stored successfully', {
                userId,
                provider: secretData.provider,
                secretType: secretData.secretType
            });

            // Return without encrypted value
            return this.formatSecretResponse(newSecret);
        } catch (error) {
            this.logger.error('Failed to store secret', error);
            throw error;
        }
    }

    /**
     * Get all secrets for a user (without decrypted values)
     */
    async getUserSecrets(userId: string): Promise<EncryptedSecret[]> {
        try {
            const secrets = await this.database
                .select()
                .from(schema.userSecrets)
                .where(
                    and(
                        eq(schema.userSecrets.userId, userId),
                        eq(schema.userSecrets.isActive, true)
                    )
                )
                .orderBy(schema.userSecrets.createdAt);

            return secrets.map(secret => this.formatSecretResponse(secret));
        } catch (error) {
            this.logger.error('Failed to get user secrets', error);
            throw error;
        }
    }

    /**
     * Get all secrets for a user (both active and inactive)
     */
    async getAllUserSecrets(userId: string): Promise<EncryptedSecret[]> {
        try {
            const secrets = await this.database
                .select()
                .from(schema.userSecrets)
                .where(eq(schema.userSecrets.userId, userId))
                .orderBy(schema.userSecrets.createdAt);

            return secrets.map(secret => this.formatSecretResponse(secret));
        } catch (error) {
            this.logger.error('Failed to get all user secrets', error);
            throw error;
        }
    }

    /**
     * Get decrypted secret value (for code generation use)
     */
    async getSecretValue(userId: string, secretId: string): Promise<string> {
        try {
            const secret = await this.database
                .select()
                .from(schema.userSecrets)
                .where(
                    and(
                        eq(schema.userSecrets.id, secretId),
                        eq(schema.userSecrets.userId, userId),
                        eq(schema.userSecrets.isActive, true)
                    )
                )
                .get();

            if (!secret) {
                throw new Error('Secret not found');
            }

            if (this.isExpired(secret)) {
                throw new Error('Secret has expired');
            }

            // Update last used
            await this.database
                .update(schema.userSecrets)
                .set({
                    lastUsed: new Date(),
                    usageCount: (secret.usageCount || 0) + 1
                })
                .where(eq(schema.userSecrets.id, secretId));

            return await this.decryptSecret(secret.encryptedValue, userId, secret.secretType);
        } catch (error) {
            this.logger.error('Failed to get secret value', error);
            throw error;
        }
    }

    /**
     * Delete a secret permanently
     */
    async deleteSecret(userId: string, secretId: string): Promise<void> {
        try {
            await this.database
                .delete(schema.userSecrets)
                .where(
                    and(
                        eq(schema.userSecrets.id, secretId),
                        eq(schema.userSecrets.userId, userId)
                    )
                );

            this.logger.info('Secret deleted successfully', { userId, secretId });
        } catch (error) {
            this.logger.error('Failed to delete secret', error);
            throw error;
        }
    }

    /**
     * Get BYOK (Bring Your Own Key) API keys as a map (provider -> decrypted key)
     */
    async getUserBYOKKeysMap(userId: string): Promise<Map<string, string>> {
        try {
            // Get BYOK templates dynamically
            const byokTemplates = getBYOKTemplates();
            
            // Get all user secrets
            const secrets = await this.database
                .select()
                .from(schema.userSecrets)
                .where(
                    and(
                        eq(schema.userSecrets.userId, userId),
                        eq(schema.userSecrets.isActive, true)
                    )
                );

            const keyMap = new Map<string, string>();

            // Match secrets to BYOK templates
            for (const template of byokTemplates) {
                const secret = secrets.find(s => s.secretType === template.envVarName && !this.isExpired(s));

                if (secret) {
                    try {
                        const decryptedKey = await this.decryptSecret(secret.encryptedValue, userId, secret.secretType);
                        keyMap.set(template.provider, decryptedKey);
                    } catch (error) {
                        this.logger.error(`Failed to decrypt BYOK key for provider ${template.provider}:`, error);
                    }
                }
            }

            this.logger.info(`Loaded ${keyMap.size} BYOK API keys from secrets system`, { userId });
            return keyMap;
        } catch (error) {
            this.logger.error('Failed to get user BYOK keys map', error);
            return new Map();
        }
    }

    /**
     * Get the decrypted BYOK key for a single provider. This is the inference
     * hot path: it decrypts only the requested provider's key (PBKDF2 key
     * derivation is expensive) instead of materializing the whole map.
     * Returns null when the user has no usable key for the provider.
     */
    async getUserBYOKKeyForProvider(userId: string, provider: string): Promise<string | null> {
        try {
            const template = getBYOKTemplates().find(t => t.provider === provider);
            if (!template) {
                return null;
            }

            const secret = await this.database
                .select()
                .from(schema.userSecrets)
                .where(
                    and(
                        eq(schema.userSecrets.userId, userId),
                        eq(schema.userSecrets.secretType, template.envVarName),
                        eq(schema.userSecrets.isActive, true)
                    )
                )
                .get();

            if (!secret || this.isExpired(secret)) {
                return null;
            }

            return await this.decryptSecret(secret.encryptedValue, userId, secret.secretType);
        } catch (error) {
            this.logger.error(`Failed to get BYOK key for provider ${provider}`, error);
            return null;
        }
    }

    /**
     * Toggle secret active status
     */
    async toggleSecretActiveStatus(userId: string, secretId: string): Promise<EncryptedSecret> {
        try {
            // First get the current secret to check ownership and current status
            const [currentSecret] = await this.database
                .select()
                .from(schema.userSecrets)
                .where(
                    and(
                        eq(schema.userSecrets.id, secretId),
                        eq(schema.userSecrets.userId, userId)
                    )
                )
                .limit(1);

            if (!currentSecret) {
                throw new Error('Secret not found or access denied');
            }

            // Toggle the status
            const newActiveStatus = !currentSecret.isActive;

            // Update the secret
            const [updatedSecret] = await this.database
                .update(schema.userSecrets)
                .set({
                    isActive: newActiveStatus,
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(schema.userSecrets.id, secretId),
                        eq(schema.userSecrets.userId, userId)
                    )
                )
                .returning();

            if (!updatedSecret) {
                throw new Error('Failed to update secret status');
            }

            this.logger.info(`Secret ${newActiveStatus ? 'activated' : 'deactivated'}`, {
                userId,
                secretId,
                provider: updatedSecret.provider
            });

            return this.formatSecretResponse(updatedSecret);
        } catch (error) {
            this.logger.error('Failed to toggle secret active status', error);
            throw error;
        }
    }

    /**
     * Format secret response (remove sensitive data)
     */
    private formatSecretResponse(secret: schema.UserSecret): EncryptedSecret {
        return {
            id: secret.id,
            userId: secret.userId,
            name: secret.name,
            provider: secret.provider,
            secretType: secret.secretType,
            keyPreview: secret.keyPreview,
            description: secret.description,
            expiresAt: secret.expiresAt,
            lastUsed: secret.lastUsed,
            usageCount: secret.usageCount,
            isActive: secret.isActive,
            createdAt: secret.createdAt,
            updatedAt: secret.updatedAt
        };
    }
}