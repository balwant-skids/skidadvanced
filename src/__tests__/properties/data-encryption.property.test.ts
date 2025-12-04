/**
 * Property-Based Tests for Data Encryption
 * Feature: skids-e2e-deployment, Property 12: Data Encryption
 * Validates: Requirements 8.2
 * 
 * Property: For any sensitive data stored in the database, it should be
 * encrypted using AES-256 encryption
 */

import * as fc from 'fast-check';
import {
  encrypt,
  decrypt,
  encryptFields,
  decryptFields,
  hash,
  isEncrypted,
  maskSensitiveData,
  generateToken,
} from '../../lib/encryption';

// Set encryption key for testing
process.env.ENCRYPTION_KEY = 'test-encryption-key-for-testing-purposes-only-32-chars-long';

describe('Property 12: Data Encryption', () => {
  test('should encrypt and decrypt any string correctly (round trip)', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 1000 }), (plaintext) => {
        // Encrypt
        const encrypted = encrypt(plaintext);

        // Decrypt
        const decrypted = decrypt(encrypted);

        // Should match original
        expect(decrypted).toBe(plaintext);
      }),
      { numRuns: 200 }
    );
  });

  test('should produce different ciphertext for same plaintext (IV randomization)', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 100 }), (plaintext) => {
        // Encrypt same plaintext twice
        const encrypted1 = encrypt(plaintext);
        const encrypted2 = encrypt(plaintext);

        // Ciphertexts should be different (due to random IV)
        expect(encrypted1).not.toBe(encrypted2);

        // But both should decrypt to same plaintext
        expect(decrypt(encrypted1)).toBe(plaintext);
        expect(decrypt(encrypted2)).toBe(plaintext);
      }),
      { numRuns: 100 }
    );
  });

  test('should handle special characters and unicode', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        fc.unicodeString({ minLength: 1, maxLength: 200 }),
        (ascii, unicode) => {
          const combined = ascii + unicode;

          const encrypted = encrypt(combined);
          const decrypted = decrypt(encrypted);

          expect(decrypted).toBe(combined);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should encrypt and decrypt object fields correctly', () => {
    fc.assert(
      fc.property(
        fc.record({
          publicField: fc.string(),
          sensitiveField1: fc.string({ minLength: 1 }),
          sensitiveField2: fc.string({ minLength: 1 }),
          numericField: fc.integer(),
        }),
        (obj) => {
          // Encrypt sensitive fields
          const encrypted = encryptFields(obj, ['sensitiveField1', 'sensitiveField2']);

          // Sensitive fields should be encrypted
          expect(encrypted.sensitiveField1).not.toBe(obj.sensitiveField1);
          expect(encrypted.sensitiveField2).not.toBe(obj.sensitiveField2);

          // Public fields should remain unchanged
          expect(encrypted.publicField).toBe(obj.publicField);
          expect(encrypted.numericField).toBe(obj.numericField);

          // Decrypt
          const decrypted = decryptFields(encrypted, ['sensitiveField1', 'sensitiveField2']);

          // Should match original
          expect(decrypted.sensitiveField1).toBe(obj.sensitiveField1);
          expect(decrypted.sensitiveField2).toBe(obj.sensitiveField2);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should produce consistent hash for same input', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (data) => {
        const hash1 = hash(data);
        const hash2 = hash(data);

        // Hashes should be identical
        expect(hash1).toBe(hash2);

        // Hash should be hex string
        expect(hash1).toMatch(/^[a-f0-9]+$/);
      }),
      { numRuns: 100 }
    );
  });

  test('should produce different hashes for different inputs', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        (data1, data2) => {
          fc.pre(data1 !== data2); // Skip if inputs are the same

          const hash1 = hash(data1);
          const hash2 = hash(data2);

          // Hashes should be different
          expect(hash1).not.toBe(hash2);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should correctly identify encrypted data', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (plaintext) => {
        // Plaintext should not be identified as encrypted
        expect(isEncrypted(plaintext)).toBe(false);

        // Encrypted data should be identified as encrypted
        const encrypted = encrypt(plaintext);
        expect(isEncrypted(encrypted)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  test('should mask sensitive data correctly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 5, maxLength: 50 }),
        fc.integer({ min: 1, max: 4 }),
        (data, visibleChars) => {
          const masked = maskSensitiveData(data, visibleChars);

          // Should contain asterisks
          expect(masked).toContain('*');

          // Should show last N characters
          const lastChars = data.slice(-visibleChars);
          expect(masked.endsWith(lastChars)).toBe(true);

          // Length should match
          expect(masked.length).toBe(data.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should generate unique tokens', () => {
    fc.assert(
      fc.property(fc.integer({ min: 16, max: 64 }), (length) => {
        const tokens = new Set<string>();

        // Generate multiple tokens
        for (let i = 0; i < 10; i++) {
          const token = generateToken(length);
          tokens.add(token);

          // Token should be hex string
          expect(token).toMatch(/^[a-f0-9]+$/);

          // Token should have correct length
          expect(token.length).toBe(length * 2); // hex encoding doubles length
        }

        // All tokens should be unique
        expect(tokens.size).toBe(10);
      }),
      { numRuns: 50 }
    );
  });

  test('should handle empty strings gracefully', () => {
    // Empty string encryption should work
    const encrypted = encrypt('');
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe('');
  });

  test('should reject invalid ciphertext', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 100 }), (invalidCiphertext) => {
        // Random string should fail to decrypt
        expect(() => decrypt(invalidCiphertext)).toThrow();
      }),
      { numRuns: 50 }
    );
  });

  test('should handle very long strings', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1000, maxLength: 5000 }), (longString) => {
        const encrypted = encrypt(longString);
        const decrypted = decrypt(encrypted);

        expect(decrypted).toBe(longString);
      }),
      { numRuns: 20 }
    );
  });

  test('should maintain data integrity with encryption', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 }),
        (dataArray) => {
          // Encrypt all items
          const encrypted = dataArray.map((item) => encrypt(item));

          // Decrypt all items
          const decrypted = encrypted.map((item) => decrypt(item));

          // Should match original array
          expect(decrypted).toEqual(dataArray);
        }
      ),
      { numRuns: 100 }
    );
  });
});
