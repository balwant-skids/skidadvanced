/**
 * Property-Based Tests for CORS Enforcement
 * Feature: skids-e2e-deployment, Property 15: CORS Policy Enforcement
 * Validates: Requirements 8.5
 * 
 * Property: For any cross-origin request, it should only be allowed if the
 * origin is in the whitelist
 */

import * as fc from 'fast-check';
import { getCORSHeaders, isAllowedOrigin, getAllowedOrigins } from '../../lib/cors';

describe('Property 15: CORS Policy Enforcement', () => {
  const allowedOrigins = getAllowedOrigins();

  function createMockRequest(origin: string): Request {
    return {
      headers: new Headers({
        origin,
      }),
      method: 'GET',
    } as Request;
  }

  test('should allow requests from whitelisted origins', () => {
    fc.assert(
      fc.property(fc.constantFrom(...allowedOrigins), (origin) => {
        const request = createMockRequest(origin);
        const headers = getCORSHeaders(request);

        // Should have CORS headers
        expect(headers.get('Access-Control-Allow-Origin')).toBe(origin);
        expect(headers.get('Access-Control-Allow-Credentials')).toBe('true');
      }),
      { numRuns: 100 }
    );
  });

  test('should reject requests from non-whitelisted origins', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        (origin) => {
          fc.pre(!allowedOrigins.includes(origin)); // Skip if origin is whitelisted

          const request = createMockRequest(origin);
          const headers = getCORSHeaders(request);

          // Should not have CORS headers
          expect(headers.get('Access-Control-Allow-Origin')).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should correctly identify allowed origins', () => {
    fc.assert(
      fc.property(fc.webUrl(), (origin) => {
        const request = createMockRequest(origin);
        const isAllowed = isAllowedOrigin(request);

        // Should match whitelist
        expect(isAllowed).toBe(allowedOrigins.includes(origin));
      }),
      { numRuns: 100 }
    );
  });

  test('should include all required CORS headers for allowed origins', () => {
    fc.assert(
      fc.property(fc.constantFrom(...allowedOrigins), (origin) => {
        const request = createMockRequest(origin);
        const headers = getCORSHeaders(request);

        // Check all required headers
        expect(headers.get('Access-Control-Allow-Origin')).toBe(origin);
        expect(headers.get('Access-Control-Allow-Credentials')).toBe('true');
        expect(headers.get('Access-Control-Allow-Methods')).toBeTruthy();
        expect(headers.get('Access-Control-Allow-Headers')).toBeTruthy();
        expect(headers.get('Access-Control-Max-Age')).toBeTruthy();
      }),
      { numRuns: 100 }
    );
  });

  test('should handle requests without origin header', () => {
    const request = {
      headers: new Headers(),
      method: 'GET',
    } as Request;

    const headers = getCORSHeaders(request);

    // Should not have CORS headers (same-origin request)
    expect(headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  test('should allow all HTTP methods for whitelisted origins', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allowedOrigins),
        fc.constantFrom('GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'),
        (origin, method) => {
          const request = {
            headers: new Headers({ origin }),
            method,
          } as Request;

          const headers = getCORSHeaders(request);
          const allowedMethods = headers.get('Access-Control-Allow-Methods');

          expect(allowedMethods).toContain(method);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should handle case-sensitive origin matching', () => {
    fc.assert(
      fc.property(fc.constantFrom(...allowedOrigins), (origin) => {
        // Test with different cases
        const upperOrigin = origin.toUpperCase();
        const lowerOrigin = origin.toLowerCase();

        const request1 = createMockRequest(origin);
        const request2 = createMockRequest(upperOrigin);
        const request3 = createMockRequest(lowerOrigin);

        const headers1 = getCORSHeaders(request1);
        const headers2 = getCORSHeaders(request2);
        const headers3 = getCORSHeaders(request3);

        // Original should work
        expect(headers1.get('Access-Control-Allow-Origin')).toBe(origin);

        // Case variations should be handled correctly
        // (URLs are case-sensitive, so different cases should not match)
        if (upperOrigin !== origin) {
          expect(headers2.get('Access-Control-Allow-Origin')).toBeNull();
        }
        if (lowerOrigin !== origin) {
          expect(headers3.get('Access-Control-Allow-Origin')).toBeNull();
        }
      }),
      { numRuns: 50 }
    );
  });

  test('should expose rate limit headers in CORS', () => {
    fc.assert(
      fc.property(fc.constantFrom(...allowedOrigins), (origin) => {
        const request = createMockRequest(origin);
        const headers = getCORSHeaders(request);

        const exposedHeaders = headers.get('Access-Control-Expose-Headers');
        expect(exposedHeaders).toContain('X-RateLimit-Limit');
        expect(exposedHeaders).toContain('X-RateLimit-Remaining');
        expect(exposedHeaders).toContain('X-RateLimit-Reset');
      }),
      { numRuns: 100 }
    );
  });

  test('should handle subdomain variations correctly', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allowedOrigins),
        fc.string({ minLength: 1, maxLength: 10 }),
        (origin, subdomain) => {
          // Try to add subdomain
          const url = new URL(origin);
          const subdomainOrigin = `${url.protocol}//${subdomain}.${url.host}`;

          const request = createMockRequest(subdomainOrigin);
          const headers = getCORSHeaders(request);

          // Subdomain should not be allowed unless explicitly whitelisted
          if (!allowedOrigins.includes(subdomainOrigin)) {
            expect(headers.get('Access-Control-Allow-Origin')).toBeNull();
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  test('should handle protocol variations correctly', () => {
    fc.assert(
      fc.property(fc.constantFrom(...allowedOrigins), (origin) => {
        const url = new URL(origin);

        // Try different protocol
        const altProtocol = url.protocol === 'https:' ? 'http:' : 'https:';
        const altOrigin = `${altProtocol}//${url.host}`;

        const request = createMockRequest(altOrigin);
        const headers = getCORSHeaders(request);

        // Different protocol should not be allowed unless explicitly whitelisted
        if (!allowedOrigins.includes(altOrigin)) {
          expect(headers.get('Access-Control-Allow-Origin')).toBeNull();
        }
      }),
      { numRuns: 50 }
    );
  });

  test('should handle port variations correctly', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allowedOrigins),
        fc.integer({ min: 3000, max: 9000 }),
        (origin, port) => {
          const url = new URL(origin);

          // Try different port
          const portOrigin = `${url.protocol}//${url.hostname}:${port}`;

          const request = createMockRequest(portOrigin);
          const headers = getCORSHeaders(request);

          // Different port should not be allowed unless explicitly whitelisted
          if (!allowedOrigins.includes(portOrigin)) {
            expect(headers.get('Access-Control-Allow-Origin')).toBeNull();
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  test('should maintain CORS headers consistency', () => {
    fc.assert(
      fc.property(fc.constantFrom(...allowedOrigins), (origin) => {
        const request = createMockRequest(origin);

        // Get headers multiple times
        const headers1 = getCORSHeaders(request);
        const headers2 = getCORSHeaders(request);

        // Should be consistent
        expect(headers1.get('Access-Control-Allow-Origin')).toBe(
          headers2.get('Access-Control-Allow-Origin')
        );
        expect(headers1.get('Access-Control-Allow-Methods')).toBe(
          headers2.get('Access-Control-Allow-Methods')
        );
      }),
      { numRuns: 100 }
    );
  });

  test('should handle malformed origins gracefully', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (malformedOrigin) => {
          fc.pre(!malformedOrigin.startsWith('http')); // Skip valid URLs

          const request = createMockRequest(malformedOrigin);
          const headers = getCORSHeaders(request);

          // Malformed origin should not be allowed
          expect(headers.get('Access-Control-Allow-Origin')).toBeNull();
        }
      ),
      { numRuns: 50 }
    );
  });
});
