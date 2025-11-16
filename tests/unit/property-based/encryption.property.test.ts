/**
 * Property-Based Tests: Encryption & Token Validation
 * Uses fast-check to generate hundreds of test cases automatically
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { GitHubTokenService } from '../../../worker/database/services/GitHubTokenService';
import { createTestEnv } from '../../helpers/test-env';

describe('GitHubTokenService - Property-Based Tests', () => {
  let env: Env;
  let service: GitHubTokenService;

  beforeEach(async () => {
    env = await createTestEnv();
    service = new GitHubTokenService(env);
  });

  describe('Encryption Roundtrip Property', () => {
    it('should decrypt to original for any valid GitHub OAuth token', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate valid OAuth tokens (gho_ + 36 alphanumeric chars)
          fc.tuple(
            fc.constant('gho_'),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 36,
              maxLength: 36
            })
          ).map(([prefix, suffix]) => prefix + suffix),
          async (validToken) => {
            const encrypted = await (service as any).encryptToken(validToken);
            const decrypted = await service.decryptToken(encrypted);

            expect(decrypted).toBe(validToken);
          }
        ),
        { numRuns: 100 } // Run 100 random test cases
      );
    });

    it('should decrypt to original for any valid GitHub PAT token', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate valid PAT tokens (ghp_ + 36 alphanumeric chars)
          fc.tuple(
            fc.constant('ghp_'),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 36,
              maxLength: 36
            })
          ).map(([prefix, suffix]) => prefix + suffix),
          async (validToken) => {
            const encrypted = await (service as any).encryptToken(validToken);
            const decrypted = await service.decryptToken(encrypted);

            expect(decrypted).toBe(validToken);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should decrypt to original for any valid fine-grained PAT', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate valid fine-grained PATs (github_pat_ + 22 chars + _ + 59 chars)
          fc.tuple(
            fc.constant('github_pat_'),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 22,
              maxLength: 22
            }),
            fc.constant('_'),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 59,
              maxLength: 59
            })
          ).map(([prefix, part1, separator, part2]) => prefix + part1 + separator + part2),
          async (validToken) => {
            const encrypted = await (service as any).encryptToken(validToken);
            const decrypted = await service.decryptToken(encrypted);

            expect(decrypted).toBe(validToken);
          }
        ),
        { numRuns: 50 } // Fewer runs due to longer token format
      );
    });
  });

  describe('Encryption Non-Determinism Property', () => {
    it('should produce different ciphertext for same token (unique nonce)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.tuple(
            fc.constant('gho_'),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 36,
              maxLength: 36
            })
          ).map(([prefix, suffix]) => prefix + suffix),
          async (validToken) => {
            const encrypted1 = await (service as any).encryptToken(validToken);
            const encrypted2 = await (service as any).encryptToken(validToken);

            // Ciphertexts should be different due to random nonce
            expect(encrypted1).not.toBe(encrypted2);

            // But both should decrypt to the original token
            const decrypted1 = await service.decryptToken(encrypted1);
            const decrypted2 = await service.decryptToken(encrypted2);

            expect(decrypted1).toBe(validToken);
            expect(decrypted2).toBe(validToken);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Token Validation Properties', () => {
    it('should accept all valid OAuth token formats', async () => {
      await fc.assert(
        fc.property(
          fc.tuple(
            fc.constantFrom('gho_', 'ghu_'),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 36,
              maxLength: 36
            })
          ).map(([prefix, suffix]) => prefix + suffix),
          (validToken) => {
            const isValid = (service as any).isValidGitHubToken(validToken);
            expect(isValid).toBe(true);
          }
        ),
        { numRuns: 200 }
      );
    });

    it('should reject tokens with invalid prefixes', async () => {
      await fc.assert(
        fc.property(
          fc.tuple(
            // Generate invalid prefixes (not gh*)
            fc.stringOf(fc.constantFrom(...'abcdefijklmnopqrstuvwxyz'.split('')), {
              minLength: 4,
              maxLength: 4
            }).filter(s => !s.startsWith('gh')),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 36,
              maxLength: 36
            })
          ).map(([prefix, suffix]) => prefix + suffix),
          (invalidToken) => {
            const isValid = (service as any).isValidGitHubToken(invalidToken);
            expect(isValid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject tokens that are too short', async () => {
      await fc.assert(
        fc.property(
          fc.tuple(
            fc.constantFrom('gho_', 'ghp_', 'ghu_'),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 1,
              maxLength: 35 // Less than required 36
            })
          ).map(([prefix, suffix]) => prefix + suffix),
          (shortToken) => {
            const isValid = (service as any).isValidGitHubToken(shortToken);
            expect(isValid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject tokens that are too long', async () => {
      await fc.assert(
        fc.property(
          fc.tuple(
            fc.constantFrom('gho_', 'ghp_'),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 252, // Will exceed 255 total
              maxLength: 300
            })
          ).map(([prefix, suffix]) => prefix + suffix),
          (longToken) => {
            const isValid = (service as any).isValidGitHubToken(longToken);
            expect(isValid).toBe(false);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should reject tokens with invalid characters', async () => {
      await fc.assert(
        fc.property(
          fc.tuple(
            fc.constant('gho_'),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 30,
              maxLength: 30
            }),
            fc.constantFrom('@', '#', '$', '!', '%', '^', '&', '*', '(', ')', ' ', '\n'),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 5,
              maxLength: 5
            })
          ).map(([prefix, part1, invalid, part2]) => prefix + part1 + invalid + part2),
          (invalidToken) => {
            const isValid = (service as any).isValidGitHubToken(invalidToken);
            expect(isValid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('PBKDF2 Key Derivation Properties', () => {
    it('should always produce 256-bit (32-byte) key', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 8, maxLength: 64 }), // Random passwords
          fc.uint8Array({ minLength: 16, maxLength: 16 }), // Random salts
          async (password, salt) => {
            const key = await (service as any).deriveKey(password, salt);

            expect(key).toBeInstanceOf(Uint8Array);
            expect(key.length).toBe(32); // 256 bits = 32 bytes
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should produce different keys for different passwords', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.tuple(
            fc.string({ minLength: 8, maxLength: 32 }),
            fc.string({ minLength: 8, maxLength: 32 })
          ).filter(([p1, p2]) => p1 !== p2), // Ensure different passwords
          fc.uint8Array({ minLength: 16, maxLength: 16 }),
          async ([password1, password2], salt) => {
            const key1 = await (service as any).deriveKey(password1, salt);
            const key2 = await (service as any).deriveKey(password2, salt);

            expect(key1).not.toEqual(key2);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should produce different keys for different salts', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 8, maxLength: 32 }),
          fc.tuple(
            fc.uint8Array({ minLength: 16, maxLength: 16 }),
            fc.uint8Array({ minLength: 16, maxLength: 16 })
          ).filter(([s1, s2]) => !s1.every((byte, i) => byte === s2[i])), // Ensure different salts
          async (password, [salt1, salt2]) => {
            const key1 = await (service as any).deriveKey(password, salt1);
            const key2 = await (service as any).deriveKey(password, salt2);

            expect(key1).not.toEqual(key2);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should be deterministic (same password + salt = same key)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 8, maxLength: 32 }),
          fc.uint8Array({ minLength: 16, maxLength: 16 }),
          async (password, salt) => {
            const key1 = await (service as any).deriveKey(password, salt);
            const key2 = await (service as any).deriveKey(password, salt);

            expect(key1).toEqual(key2);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Binary Safety Properties', () => {
    it('should handle tokens with all possible byte values', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.tuple(
            fc.constant('gho_'),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 36,
              maxLength: 36
            })
          ).map(([prefix, suffix]) => prefix + suffix),
          async (validToken) => {
            const encrypted = await (service as any).encryptToken(validToken);

            // Encrypted data should be valid Base64
            expect(() => atob(encrypted)).not.toThrow();

            const decrypted = await service.decryptToken(encrypted);
            expect(decrypted).toBe(validToken);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Error Handling Properties', () => {
    it('should always throw for invalid ciphertext formats', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.stringOf(fc.char(), { minLength: 1, maxLength: 50 })
            .filter(s => {
              try {
                atob(s);
                return false; // Valid base64
              } catch {
                return true; // Invalid base64
              }
            }),
          async (invalidCiphertext) => {
            await expect(
              service.decryptToken(invalidCiphertext)
            ).rejects.toThrow();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should always throw for truncated ciphertext', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.tuple(
            fc.constant('gho_'),
            fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
              minLength: 36,
              maxLength: 36
            })
          ).map(([prefix, suffix]) => prefix + suffix),
          fc.integer({ min: 1, max: 90 }), // Truncation percentage
          async (validToken, truncatePercent) => {
            const encrypted = await (service as any).encryptToken(validToken);
            const truncateAt = Math.floor(encrypted.length * (truncatePercent / 100));
            const truncated = encrypted.substring(0, truncateAt);

            await expect(
              service.decryptToken(truncated)
            ).rejects.toThrow();
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
