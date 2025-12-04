/**
 * Property-Based Tests for Rate Limiting
 * Feature: skids-e2e-deployment, Property 14: Rate Limiting Enforcement
 * Validates: Requirements 8.4
 * 
 * Property: For any IP address that exceeds the rate limit, subsequent requests
 * should be blocked for 15 minutes
 */

import * as fc from 'fast-check';
import { checkRateLimit, clearRateLimit } from '../../lib/rate-limiter';

describe('Property 14: Rate Limiting Enforcement', () => {
  beforeEach(() => {
    // Clear rate limit store before each test
    // This is a workaround since we can't easily clear the internal Map
    jest.clearAllMocks();
  });

  function createMockRequest(clientIp: string): Request {
    return {
      headers: new Headers({
        'x-forwarded-for': clientIp,
      }),
    } as Request;
  }

  test('should allow requests under the limit', () => {
    fc.assert(
      fc.property(
        fc.ipV4(),
        fc.integer({ min: 1, max: 50 }),
        (clientIp, numRequests) => {
          const request = createMockRequest(clientIp);

          // Make requests under the limit
          for (let i = 0; i < numRequests; i++) {
            const result = checkRateLimit(request, { maxRequests: 100 });
            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(100 - (i + 1));
          }

          // Clean up
          clearRateLimit(clientIp);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('should block requests that exceed the limit', () => {
    fc.assert(
      fc.property(
        fc.ipV4(),
        fc.integer({ min: 10, max: 20 }),
        (clientIp, maxRequests) => {
          const request = createMockRequest(clientIp);

          // Make requests up to the limit
          for (let i = 0; i < maxRequests; i++) {
            const result = checkRateLimit(request, { maxRequests });
            expect(result.allowed).toBe(true);
          }

          // Next request should be blocked
          const blockedResult = checkRateLimit(request, { maxRequests });
          expect(blockedResult.allowed).toBe(false);
          expect(blockedResult.remaining).toBe(0);
          expect(blockedResult.retryAfter).toBeGreaterThan(0);

          // Clean up
          clearRateLimit(clientIp);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('should track different clients independently', () => {
    fc.assert(
      fc.property(
        fc.array(fc.ipV4(), { minLength: 2, maxLength: 5 }),
        fc.integer({ min: 5, max: 10 }),
        (clientIps, requestsPerClient) => {
          // Make requests from each client
          for (const clientIp of clientIps) {
            const request = createMockRequest(clientIp);

            for (let i = 0; i < requestsPerClient; i++) {
              const result = checkRateLimit(request, { maxRequests: 100 });
              expect(result.allowed).toBe(true);
              expect(result.remaining).toBe(100 - (i + 1));
            }
          }

          // Clean up
          clientIps.forEach((ip) => clearRateLimit(ip));
        }
      ),
      { numRuns: 30 }
    );
  });

  test('should include retry-after header when blocked', () => {
    fc.assert(
      fc.property(
        fc.ipV4(),
        fc.integer({ min: 5, max: 10 }),
        (clientIp, maxRequests) => {
          const request = createMockRequest(clientIp);

          // Exceed limit
          for (let i = 0; i <= maxRequests; i++) {
            checkRateLimit(request, { maxRequests });
          }

          // Check blocked request
          const result = checkRateLimit(request, { maxRequests });
          expect(result.allowed).toBe(false);
          expect(result.retryAfter).toBeDefined();
          expect(result.retryAfter).toBeGreaterThan(0);

          // Clean up
          clearRateLimit(clientIp);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('should respect custom rate limit configuration', () => {
    fc.assert(
      fc.property(
        fc.ipV4(),
        fc.integer({ min: 5, max: 50 }),
        (clientIp, customLimit) => {
          const request = createMockRequest(clientIp);

          // Make requests up to custom limit
          for (let i = 0; i < customLimit; i++) {
            const result = checkRateLimit(request, { maxRequests: customLimit });
            expect(result.allowed).toBe(true);
          }

          // Next request should be blocked
          const result = checkRateLimit(request, { maxRequests: customLimit });
          expect(result.allowed).toBe(false);

          // Clean up
          clearRateLimit(clientIp);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('should maintain block duration', () => {
    fc.assert(
      fc.property(fc.ipV4(), (clientIp) => {
        const request = createMockRequest(clientIp);
        const maxRequests = 5;

        // Exceed limit
        for (let i = 0; i <= maxRequests; i++) {
          checkRateLimit(request, { maxRequests });
        }

        // Multiple blocked requests should maintain block
        const result1 = checkRateLimit(request, { maxRequests });
        const result2 = checkRateLimit(request, { maxRequests });

        expect(result1.allowed).toBe(false);
        expect(result2.allowed).toBe(false);

        // Clean up
        clearRateLimit(clientIp);
      }),
      { numRuns: 50 }
    );
  });

  test('should handle concurrent requests from same client', () => {
    fc.assert(
      fc.property(
        fc.ipV4(),
        fc.integer({ min: 3, max: 10 }),
        (clientIp, numConcurrent) => {
          const request = createMockRequest(clientIp);
          const results: any[] = [];

          // Simulate concurrent requests
          for (let i = 0; i < numConcurrent; i++) {
            const result = checkRateLimit(request, { maxRequests: 100 });
            results.push(result);
          }

          // All should be allowed (under limit)
          results.forEach((result) => {
            expect(result.allowed).toBe(true);
          });

          // Remaining count should decrease
          const remainingCounts = results.map((r) => r.remaining);
          for (let i = 1; i < remainingCounts.length; i++) {
            expect(remainingCounts[i]).toBeLessThan(remainingCounts[i - 1]);
          }

          // Clean up
          clearRateLimit(clientIp);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('should provide accurate remaining count', () => {
    fc.assert(
      fc.property(
        fc.ipV4(),
        fc.integer({ min: 10, max: 50 }),
        fc.integer({ min: 1, max: 10 }),
        (clientIp, maxRequests, numRequests) => {
          fc.pre(numRequests < maxRequests); // Ensure we don't exceed limit

          const request = createMockRequest(clientIp);

          // Make requests
          let lastResult;
          for (let i = 0; i < numRequests; i++) {
            lastResult = checkRateLimit(request, { maxRequests });
          }

          // Remaining should be accurate
          expect(lastResult!.remaining).toBe(maxRequests - numRequests);

          // Clean up
          clearRateLimit(clientIp);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should handle IPv6 addresses', () => {
    fc.assert(
      fc.property(fc.ipV6(), (clientIp) => {
        const request = createMockRequest(clientIp);

        const result = checkRateLimit(request, { maxRequests: 100 });
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(99);

        // Clean up
        clearRateLimit(clientIp);
      }),
      { numRuns: 50 }
    );
  });

  test('should reset count after window expires', () => {
    fc.assert(
      fc.property(fc.ipV4(), (clientIp) => {
        const request = createMockRequest(clientIp);
        const shortWindow = 100; // 100ms window for testing

        // Make some requests
        checkRateLimit(request, { maxRequests: 10, windowMs: shortWindow });
        checkRateLimit(request, { maxRequests: 10, windowMs: shortWindow });

        // Wait for window to expire
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            // Should reset to full limit
            const result = checkRateLimit(request, { maxRequests: 10, windowMs: shortWindow });
            expect(result.remaining).toBe(9); // First request in new window

            // Clean up
            clearRateLimit(clientIp);
            resolve();
          }, shortWindow + 50);
        });
      }),
      { numRuns: 10 } // Fewer runs due to async nature
    );
  });
});
