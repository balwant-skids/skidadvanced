/**
 * Property-Based Tests for Whitelist Enforcement
 * 
 * Feature: backend-integration, Property 3: Whitelist Enforcement
 * Validates: Requirements 3.1, 3.2
 * 
 * For any parent registration attempt with a clinic code, 
 * the parent's email SHALL exist in that clinic's whitelist.
 */

import * as fc from 'fast-check';

// Types for whitelist testing
interface WhitelistEntry {
  email: string;
  clinicId: string;
  isRegistered: boolean;
}

interface RegistrationAttempt {
  email: string;
  clinicCode: string;
}

// Simulated whitelist store
class WhitelistStore {
  private entries: Map<string, WhitelistEntry[]> = new Map();

  addToWhitelist(clinicId: string, email: string): void {
    const normalizedEmail = email.toLowerCase().trim();
    const clinicEntries = this.entries.get(clinicId) || [];
    
    if (!clinicEntries.some(e => e.email === normalizedEmail)) {
      clinicEntries.push({
        email: normalizedEmail,
        clinicId,
        isRegistered: false,
      });
      this.entries.set(clinicId, clinicEntries);
    }
  }

  isWhitelisted(clinicId: string, email: string): boolean {
    const normalizedEmail = email.toLowerCase().trim();
    const clinicEntries = this.entries.get(clinicId) || [];
    return clinicEntries.some(e => e.email === normalizedEmail);
  }

  removeFromWhitelist(clinicId: string, email: string): boolean {
    const normalizedEmail = email.toLowerCase().trim();
    const clinicEntries = this.entries.get(clinicId) || [];
    const index = clinicEntries.findIndex(e => e.email === normalizedEmail);
    
    if (index !== -1) {
      clinicEntries.splice(index, 1);
      this.entries.set(clinicId, clinicEntries);
      return true;
    }
    return false;
  }

  getWhitelist(clinicId: string): WhitelistEntry[] {
    return this.entries.get(clinicId) || [];
  }

  clear(): void {
    this.entries.clear();
  }
}

// Registration validation function
function canRegister(
  store: WhitelistStore,
  clinicId: string,
  email: string
): { allowed: boolean; reason?: string } {
  if (!email || !email.includes('@')) {
    return { allowed: false, reason: 'Invalid email format' };
  }
  
  if (!store.isWhitelisted(clinicId, email)) {
    return { allowed: false, reason: 'Email not in whitelist' };
  }
  
  return { allowed: true };
}

// Arbitraries for generating test data
const emailArbitrary = fc.tuple(
  fc.string({ minLength: 3, maxLength: 10, unit: fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')) }),
  fc.constantFrom('gmail.com', 'yahoo.com', 'outlook.com', 'example.com')
).map(([local, domain]) => `${local}@${domain}`);

const clinicIdArbitrary = fc.uuid();

describe('Whitelist Enforcement Properties', () => {
  let store: WhitelistStore;

  beforeEach(() => {
    store = new WhitelistStore();
  });

  /**
   * Feature: backend-integration, Property 3: Whitelist Enforcement
   * Validates: Requirements 3.1, 3.2
   * 
   * For any whitelisted email, registration should be allowed
   */
  it('should allow registration for whitelisted emails', () => {
    fc.assert(
      fc.property(clinicIdArbitrary, emailArbitrary, (clinicId, email) => {
        store.clear();
        store.addToWhitelist(clinicId, email);
        
        const result = canRegister(store, clinicId, email);
        expect(result.allowed).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 3: Whitelist Enforcement
   * Validates: Requirements 3.1, 3.2
   * 
   * For any non-whitelisted email, registration should be rejected
   */
  it('should reject registration for non-whitelisted emails', () => {
    fc.assert(
      fc.property(
        clinicIdArbitrary,
        emailArbitrary,
        emailArbitrary,
        (clinicId, whitelistedEmail, attemptEmail) => {
          // Skip if emails happen to be the same
          if (whitelistedEmail.toLowerCase() === attemptEmail.toLowerCase()) {
            return true;
          }
          
          store.clear();
          store.addToWhitelist(clinicId, whitelistedEmail);
          
          const result = canRegister(store, clinicId, attemptEmail);
          expect(result.allowed).toBe(false);
          expect(result.reason).toBe('Email not in whitelist');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 3: Whitelist Enforcement
   * Validates: Requirements 3.1, 3.2
   * 
   * Email matching should be case-insensitive
   */
  it('should match emails case-insensitively', () => {
    fc.assert(
      fc.property(clinicIdArbitrary, emailArbitrary, (clinicId, email) => {
        store.clear();
        store.addToWhitelist(clinicId, email.toLowerCase());
        
        // Should match uppercase version
        const upperResult = canRegister(store, clinicId, email.toUpperCase());
        expect(upperResult.allowed).toBe(true);
        
        // Should match mixed case
        const mixedCase = email.split('').map((c, i) => 
          i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()
        ).join('');
        const mixedResult = canRegister(store, clinicId, mixedCase);
        expect(mixedResult.allowed).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 3: Whitelist Enforcement
   * Validates: Requirements 3.4
   * 
   * After removal from whitelist, registration should be rejected
   */
  it('should reject registration after removal from whitelist', () => {
    fc.assert(
      fc.property(clinicIdArbitrary, emailArbitrary, (clinicId, email) => {
        store.clear();
        store.addToWhitelist(clinicId, email);
        
        // Should be allowed initially
        expect(canRegister(store, clinicId, email).allowed).toBe(true);
        
        // Remove from whitelist
        store.removeFromWhitelist(clinicId, email);
        
        // Should be rejected after removal
        const result = canRegister(store, clinicId, email);
        expect(result.allowed).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: backend-integration, Property 3: Whitelist Enforcement
   * Validates: Requirements 3.1, 3.2
   * 
   * Whitelist entries should be clinic-specific
   */
  it('should enforce clinic-specific whitelisting', () => {
    fc.assert(
      fc.property(
        clinicIdArbitrary,
        clinicIdArbitrary,
        emailArbitrary,
        (clinicId1, clinicId2, email) => {
          // Skip if clinic IDs happen to be the same
          if (clinicId1 === clinicId2) return true;
          
          store.clear();
          store.addToWhitelist(clinicId1, email);
          
          // Should be allowed for clinic1
          expect(canRegister(store, clinicId1, email).allowed).toBe(true);
          
          // Should be rejected for clinic2
          expect(canRegister(store, clinicId2, email).allowed).toBe(false);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
