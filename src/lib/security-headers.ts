/**
 * Security Headers Configuration
 * Feature: skids-e2e-deployment
 * Validates: Requirements 8.5
 */

import { NextResponse } from 'next/server';

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Enforce HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.skids.com https://*.clerk.accounts.dev",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.clerk.accounts.dev https://clerk.skids.com https://*.turso.io https://*.r2.cloudflarestorage.com https://fcm.googleapis.com",
    "frame-src 'self' https://*.clerk.accounts.dev",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
};

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: Response): Response {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  
  return response;
}

/**
 * Create response with security headers
 */
export function createSecureResponse(
  body: any,
  init?: ResponseInit
): Response {
  const response = NextResponse.json(body, init);
  return applySecurityHeaders(response);
}

/**
 * Wrap handler with security headers
 */
export function withSecurityHeaders(
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request) => {
    const response = await handler(request);
    return applySecurityHeaders(response);
  };
}

/**
 * Get CSP nonce for inline scripts
 */
export function generateCSPNonce(): string {
  const { randomBytes } = require('crypto');
  return randomBytes(16).toString('base64');
}

/**
 * Get CSP header with nonce
 */
export function getCSPWithNonce(nonce: string): string {
  return SECURITY_HEADERS['Content-Security-Policy']
    .replace("'unsafe-inline'", `'nonce-${nonce}'`);
}

/**
 * Validate security headers in response
 */
export function validateSecurityHeaders(response: Response): {
  valid: boolean;
  missing: string[];
  invalid: string[];
} {
  const missing: string[] = [];
  const invalid: string[] = [];
  
  for (const [key, expectedValue] of Object.entries(SECURITY_HEADERS)) {
    const actualValue = response.headers.get(key);
    
    if (!actualValue) {
      missing.push(key);
    } else if (actualValue !== expectedValue) {
      invalid.push(key);
    }
  }
  
  return {
    valid: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
  };
}
