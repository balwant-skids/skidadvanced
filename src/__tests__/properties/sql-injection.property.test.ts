/**
 * Property-Based Tests for SQL Injection Prevention
 * Feature: skids-e2e-deployment, Property 13: SQL Injection Prevention
 * Validates: Requirements 8.3
 */

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import {
  sanitizeInput,
  validateNoSQLInjection,
  sanitizeObject,
  validateEmail,
  validateAlphanumeric,
  validateUUID,
  buildSafeWhereClause,
  validateRequestBody,
} from '../../lib/sql-injection-prevention';

describe('SQL Injection Prevention Properties', () => {
  describe('Property 13: SQL Injection Prevention', () => {
    it('should detect and reject SQL injection patterns', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // Common SQL injection patterns
            fc.constant("' OR '1'='1"),
            fc.constant("1' OR '1' = '1"),
            fc.constant("admin'--"),
            fc.constant("' OR 1=1--"),
            fc.constant("' UNION SELECT * FROM users--"),
            fc.constant("'; DROP TABLE users--"),
            fc.constant("1; DELETE FROM users"),
            fc.constant("' OR 'x'='x"),
            fc.constant("1' AND '1'='1"),
            fc.constant("' OR 1=1#"),
            fc.constant("/**/SELECT/**/"),
            fc.constant("EXEC xp_cmdshell"),
            fc.constant("'; EXEC sp_"),
            // Generate random SQL keywords
            fc.constantFrom(
              'SELECT',
              'INSERT',
              'UPDATE',
              'DELETE',
              'DROP',
              'CREATE',
              'ALTER',
              'UNION'
            ).chain(keyword =>
              fc.string().map(str => `${keyword} ${str}`)
            )
          ),
          (maliciousInput) => {
            // Property: All SQL injection patterns should be detected
            const isValid = validateNoSQLInjection(maliciousInput);
            expect(isValid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should allow safe input without SQL patterns', () => {
      fc.assert(
        fc.property(
          fc.string().filter(str => {
            // Generate safe strings without SQL keywords
            const sqlKeywords = [
              'SELECT',
              'INSERT',
              'UPDATE',
              'DELETE',
              'DROP',
              'CREATE',
              'ALTER',
              'UNION',
              'EXEC',
              '--',
              '/*',
              '*/',
              ';',
            ];
            return !sqlKeywords.some(keyword =>
              str.toUpperCase().includes(keyword)
            );
          }),
          (safeInput) => {
            // Property: Safe input should pass validation
            const isValid = validateNoSQLInjection(safeInput);
            expect(isValid).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should sanitize input by removing dangerous characters', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (input) => {
            // Property: Sanitized input should not contain dangerous patterns
            const sanitized = sanitizeInput(input);

            // Should not contain SQL comment markers
            expect(sanitized).not.toContain('--');
            expect(sanitized).not.toContain('/*');
            expect(sanitized).not.toContain('*/');

            // Should not contain semicolons
            expect(sanitized).not.toContain(';');

            // Should not contain null bytes
            expect(sanitized).not.toContain('\0');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should sanitize all string values in objects', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string(),
            email: fc.string(),
            description: fc.string(),
            nested: fc.record({
              value: fc.string(),
            }),
          }),
          (obj) => {
            // Property: All string values in object should be sanitized
            const sanitized = sanitizeObject(obj);

            // Check all string values
            expect(sanitized.name).not.toContain('--');
            expect(sanitized.email).not.toContain(';');
            expect(sanitized.description).not.toContain('/*');
            expect(sanitized.nested.value).not.toContain('--');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate email format and reject SQL injection', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // Valid emails
            fc
              .tuple(
                fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
                fc.constantFrom('gmail.com', 'yahoo.com', 'test.com')
              )
              .map(([local, domain]) => `${local}@${domain}`),
            // Invalid emails with SQL injection
            fc.constant("admin'--@test.com"),
            fc.constant("user@test.com'; DROP TABLE users--")
          ),
          (email) => {
            // Property: Valid emails pass, SQL injection attempts fail
            const isValid = validateEmail(email);

            if (email.includes("'") || email.includes('--') || email.includes(';')) {
              expect(isValid).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate alphanumeric input strictly', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // Valid alphanumeric
            fc.stringOf(
              fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')),
              { minLength: 1 }
            ),
            // Invalid with special characters
            fc.string().filter(str => /[^a-zA-Z0-9]/.test(str))
          ),
          (input) => {
            // Property: Only alphanumeric strings should pass
            const isValid = validateAlphanumeric(input);

            if (/^[a-zA-Z0-9]+$/.test(input)) {
              expect(isValid).toBe(true);
            } else {
              expect(isValid).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate UUID format strictly', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // Valid UUIDs
            fc.uuid(),
            // Invalid UUIDs
            fc.string().filter(str => !str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i))
          ),
          (input) => {
            // Property: Only valid UUIDs should pass
            const isValid = validateUUID(input);

            if (input.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
              expect(isValid).toBe(true);
            } else {
              expect(isValid).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should build safe where clauses and reject dangerous input', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            name: fc.string(),
            email: fc.string(),
          }),
          (params) => {
            // Property: Safe params should build successfully, dangerous ones should throw
            try {
              const safeClause = buildSafeWhereClause(params);

              // If it succeeds, all values should be safe
              if (typeof safeClause.name === 'string') {
                expect(validateNoSQLInjection(safeClause.name)).toBe(true);
              }
              if (typeof safeClause.email === 'string') {
                expect(validateNoSQLInjection(safeClause.email)).toBe(true);
              }
            } catch (error) {
              // If it throws, it should be because of dangerous input
              expect(error).toBeInstanceOf(Error);
              expect((error as Error).message).toContain('Invalid input detected');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate request body and identify all dangerous inputs', () => {
      fc.assert(
        fc.property(
          fc.record({
            username: fc.string(),
            password: fc.string(),
            profile: fc.record({
              bio: fc.string(),
              website: fc.string(),
            }),
          }),
          (body) => {
            // Property: Validation should identify all dangerous patterns
            const result = validateRequestBody(body);

            // If any field contains SQL injection patterns, should be invalid
            const hasDangerousInput =
              !validateNoSQLInjection(body.username) ||
              !validateNoSQLInjection(body.password) ||
              !validateNoSQLInjection(body.profile.bio) ||
              !validateNoSQLInjection(body.profile.website);

            if (hasDangerousInput) {
              expect(result.isValid).toBe(false);
              expect(result.errors.length).toBeGreaterThan(0);
            } else {
              expect(result.isValid).toBe(true);
              expect(result.errors.length).toBe(0);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle nested objects and arrays in validation', () => {
      fc.assert(
        fc.property(
          fc.record({
            items: fc.array(fc.string()),
            nested: fc.record({
              deep: fc.record({
                value: fc.string(),
              }),
            }),
          }),
          (body) => {
            // Property: Nested validation should check all levels
            const result = validateRequestBody(body);

            // Check if any nested value is dangerous
            let hasDangerous = false;
            for (const item of body.items) {
              if (!validateNoSQLInjection(item)) {
                hasDangerous = true;
                break;
              }
            }
            if (!validateNoSQLInjection(body.nested.deep.value)) {
              hasDangerous = true;
            }

            if (hasDangerous) {
              expect(result.isValid).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
