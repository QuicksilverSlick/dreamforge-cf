/**
 * Unit Tests: GitHubTokenService
 * Tests encryption, decryption, and token validation logic
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GitHubTokenService } from '../../../worker/database/services/GitHubTokenService';
import { MOCK_TOKENS } from '../../fixtures/github-tokens';
import { createTestEnv } from '../../helpers/test-env';

describe('GitHubTokenService - Unit Tests', () => {
  let env: Env;
  let service: GitHubTokenService;

  beforeEach(async () => {
    env = await createTestEnv();
    service = new GitHubTokenService(env);
  });

  describe('Token Validation', () => {
    it('should validate OAuth token format (gho_)', () => {
      const isValid = (service as any).isValidGitHubToken(MOCK_TOKENS.VALID_OAUTH);
      expect(isValid).toBe(true);
    });

    it('should validate PAT token format (ghp_)', () => {
      const isValid = (service as any).isValidGitHubToken(MOCK_TOKENS.VALID_PAT);
      expect(isValid).toBe(true);
    });

    it('should validate fine-grained PAT format (github_pat_)', () => {
      const isValid = (service as any).isValidGitHubToken(MOCK_TOKENS.VALID_FINE_GRAINED);
      expect(isValid).toBe(true);
    });

    it('should reject token with invalid prefix', () => {
      const isValid = (service as any).isValidGitHubToken(MOCK_TOKENS.INVALID_PREFIX);
      expect(isValid).toBe(false);
    });

    it('should reject token that is too short', () => {
      const isValid = (service as any).isValidGitHubToken(MOCK_TOKENS.INVALID_SHORT);
      expect(isValid).toBe(false);
    });

    it('should reject token exceeding 255 characters', () => {
      const longToken = 'ghp_' + 'a'.repeat(252); // Total 256 chars
      const isValid = (service as any).isValidGitHubToken(longToken);
      expect(isValid).toBe(false);
    });

    it('should reject empty string', () => {
      const isValid = (service as any).isValidGitHubToken('');
      expect(isValid).toBe(false);
    });

    it('should reject token with special characters', () => {
      const invalidToken = 'gho_' + 'a'.repeat(30) + '@#$!%^';
      const isValid = (service as any).isValidGitHubToken(invalidToken);
      expect(isValid).toBe(false);
    });
  });

  describe('Encryption & Decryption', () => {
    it('should encrypt a valid GitHub token', async () => {
      const encrypted = await (service as any).encryptToken(MOCK_TOKENS.VALID_OAUTH);

      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(MOCK_TOKENS.VALID_OAUTH);
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should decrypt to original token', async () => {
      const encrypted = await (service as any).encryptToken(MOCK_TOKENS.VALID_PAT);
      const decrypted = await service.decryptToken(encrypted);

      expect(decrypted).toBe(MOCK_TOKENS.VALID_PAT);
    });

    it('should produce different ciphertext for same token (unique nonce)', async () => {
      const encrypted1 = await (service as any).encryptToken(MOCK_TOKENS.VALID_OAUTH);
      const encrypted2 = await (service as any).encryptToken(MOCK_TOKENS.VALID_OAUTH);

      expect(encrypted1).not.toBe(encrypted2);

      const decrypted1 = await service.decryptToken(encrypted1);
      const decrypted2 = await service.decryptToken(encrypted2);

      expect(decrypted1).toBe(MOCK_TOKENS.VALID_OAUTH);
      expect(decrypted2).toBe(MOCK_TOKENS.VALID_OAUTH);
    });

    it('should reject invalid token before encryption', async () => {
      await expect(
        (service as any).encryptToken(MOCK_TOKENS.INVALID_PREFIX)
      ).rejects.toThrow('Invalid GitHub token format');
    });

    it('should reject decryption with invalid ciphertext', async () => {
      const invalidCiphertext = 'invalid-base64-data';

      await expect(
        service.decryptToken(invalidCiphertext)
      ).rejects.toThrow();
    });

    it('should reject decryption with truncated data', async () => {
      const encrypted = await (service as any).encryptToken(MOCK_TOKENS.VALID_OAUTH);
      const truncated = encrypted.substring(0, encrypted.length / 2);

      await expect(
        service.decryptToken(truncated)
      ).rejects.toThrow();
    });

    it('should handle binary-safe Base64 encoding', async () => {
      // Test with token that would fail with String.fromCharCode(...spread)
      const encrypted = await (service as any).encryptToken(MOCK_TOKENS.VALID_FINE_GRAINED);
      const decrypted = await service.decryptToken(encrypted);

      expect(decrypted).toBe(MOCK_TOKENS.VALID_FINE_GRAINED);
    });
  });

  describe('Key Derivation (PBKDF2)', () => {
    it('should derive consistent key from same password and salt', async () => {
      const password = 'test-password';
      const salt = new Uint8Array(16).fill(1);

      const key1 = await (service as any).deriveKey(password, salt);
      const key2 = await (service as any).deriveKey(password, salt);

      expect(key1).toEqual(key2);
    });

    it('should derive different keys for different salts', async () => {
      const password = 'test-password';
      const salt1 = new Uint8Array(16).fill(1);
      const salt2 = new Uint8Array(16).fill(2);

      const key1 = await (service as any).deriveKey(password, salt1);
      const key2 = await (service as any).deriveKey(password, salt2);

      expect(key1).not.toEqual(key2);
    });

    it('should use 600,000 PBKDF2 iterations (OWASP 2025)', async () => {
      const password = 'test-password';
      const salt = new Uint8Array(16).fill(1);

      const deriveBitsSpy = vi.spyOn(crypto.subtle, 'deriveBits');

      await (service as any).deriveKey(password, salt);

      expect(deriveBitsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'PBKDF2',
          iterations: 600000,
          hash: 'SHA-256'
        }),
        expect.anything(),
        256
      );

      deriveBitsSpy.mockRestore();
    });
  });

  describe('Database Operations', () => {
    it('should store encrypted token in database', async () => {
      const userId = 'test-user-123';
      const scopes = ['repo', 'user'];

      await service.storeToken(userId, MOCK_TOKENS.VALID_OAUTH, scopes);

      const retrieved = await service.getActiveToken(userId);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.token).toBe(MOCK_TOKENS.VALID_OAUTH);
      expect(retrieved?.scopes).toEqual(scopes);
    });

    it('should deactivate old token when storing new one', async () => {
      const userId = 'test-user-456';
      const scopes = ['repo'];

      await service.storeToken(userId, MOCK_TOKENS.VALID_OAUTH, scopes);
      await service.storeToken(userId, MOCK_TOKENS.VALID_PAT, scopes);

      const retrieved = await service.getActiveToken(userId);

      expect(retrieved?.token).toBe(MOCK_TOKENS.VALID_PAT);
    });

    it('should return null for user with no token', async () => {
      const retrieved = await service.getActiveToken('non-existent-user');
      expect(retrieved).toBeNull();
    });

    it('should update lastUsed timestamp on retrieval', async () => {
      const userId = 'test-user-789';
      const scopes = ['repo'];

      await service.storeToken(userId, MOCK_TOKENS.VALID_OAUTH, scopes);

      const before = Date.now();
      await service.getActiveToken(userId);
      const after = Date.now();

      // Verify timestamp was updated (check in database)
      const tokenRecord = await env.DB
        .select()
        .from(schema.githubTokens)
        .where(eq(schema.githubTokens.userId, userId))
        .get();

      expect(tokenRecord?.lastUsed).not.toBeNull();
      const lastUsedTime = new Date(tokenRecord!.lastUsed!).getTime();
      expect(lastUsedTime).toBeGreaterThanOrEqual(before);
      expect(lastUsedTime).toBeLessThanOrEqual(after);
    });

    it('should revoke token successfully', async () => {
      const userId = 'test-user-revoke';
      const scopes = ['repo'];

      await service.storeToken(userId, MOCK_TOKENS.VALID_OAUTH, scopes);
      await service.revokeToken(userId);

      const retrieved = await service.getActiveToken(userId);
      expect(retrieved).toBeNull();
    });

    it('should not retrieve revoked tokens', async () => {
      const userId = 'test-user-revoked';
      const scopes = ['repo'];

      await service.storeToken(userId, MOCK_TOKENS.VALID_OAUTH, scopes);
      await service.revokeToken(userId);

      const retrieved = await service.getActiveToken(userId);
      expect(retrieved).toBeNull();
    });
  });

  describe('Scope Validation', () => {
    it('should confirm user has required scopes', async () => {
      const userId = 'test-user-scopes';
      const scopes = ['repo', 'user', 'gist'];

      await service.storeToken(userId, MOCK_TOKENS.VALID_OAUTH, scopes);

      const hasRepoScope = await service.hasTokenWithScopes(userId, ['repo']);
      expect(hasRepoScope).toBe(true);
    });

    it('should confirm user has all required scopes', async () => {
      const userId = 'test-user-multi-scopes';
      const scopes = ['repo', 'user', 'gist'];

      await service.storeToken(userId, MOCK_TOKENS.VALID_OAUTH, scopes);

      const hasAllScopes = await service.hasTokenWithScopes(userId, ['repo', 'user']);
      expect(hasAllScopes).toBe(true);
    });

    it('should deny when user lacks required scope', async () => {
      const userId = 'test-user-missing-scope';
      const scopes = ['user'];

      await service.storeToken(userId, MOCK_TOKENS.VALID_OAUTH, scopes);

      const hasRepoScope = await service.hasTokenWithScopes(userId, ['repo']);
      expect(hasRepoScope).toBe(false);
    });

    it('should return false for user with no token', async () => {
      const hasScope = await service.hasTokenWithScopes('no-token-user', ['repo']);
      expect(hasScope).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should throw if SECRETS_ENCRYPTION_KEY is missing', async () => {
      const envWithoutKey = { ...env, SECRETS_ENCRYPTION_KEY: undefined } as Env;
      const serviceWithoutKey = new GitHubTokenService(envWithoutKey);

      await expect(
        (serviceWithoutKey as any).encryptToken(MOCK_TOKENS.VALID_OAUTH)
      ).rejects.toThrow('SECRETS_ENCRYPTION_KEY environment variable not set');
    });

    it('should handle database errors gracefully', async () => {
      const userId = 'test-user-db-error';

      vi.spyOn(env.DB, 'insert').mockRejectedValueOnce(new Error('Database error'));

      await expect(
        service.storeToken(userId, MOCK_TOKENS.VALID_OAUTH, ['repo'])
      ).rejects.toThrow('Database error');
    });
  });
});
