/**
 * Test Data Generators for E2E Tests
 * Feature: skids-e2e-deployment
 */

export interface TestUser {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'parent' | 'clinic_manager' | 'super_admin';
  clerkId?: string;
}

/**
 * Pre-configured test users for E2E tests
 * These should be seeded in the test database
 */
export const TEST_USERS = {
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'admin@test.skids.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'Admin@1234',
    name: 'Test Admin',
    phone: '+1234567890',
    role: 'super_admin' as const,
  },
  manager: {
    email: process.env.TEST_MANAGER_EMAIL || 'manager@test.skids.com',
    password: process.env.TEST_MANAGER_PASSWORD || 'Manager@1234',
    name: 'Test Manager',
    phone: '+1234567891',
    role: 'clinic_manager' as const,
  },
  parent: {
    email: process.env.TEST_PARENT_EMAIL || 'parent@test.skids.com',
    password: process.env.TEST_PARENT_PASSWORD || 'Parent@1234',
    name: 'Test Parent',
    phone: '+1234567892',
    role: 'parent' as const,
  },
};

export interface TestClinic {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface TestChild {
  name: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
}

/**
 * Generate a unique test email
 */
export function generateTestEmail(prefix: string = 'test'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${timestamp}-${random}@test.skids.com`;
}

/**
 * Generate a test user
 */
export function generateTestUser(role: TestUser['role'] = 'parent'): TestUser {
  return {
    email: generateTestEmail(role),
    password: 'Test@1234',
    name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
    phone: '+1234567890',
    role,
  };
}

/**
 * Generate a test clinic
 */
export function generateTestClinic(): TestClinic {
  const random = Math.floor(Math.random() * 100000);
  return {
    id: `clinic-${random}`,
    code: `TEST${random}`,
    name: `Test Clinic ${random}`,
    address: '123 Test Street, Test City',
    phone: '+1234567890',
    email: `clinic${random}@test.skids.com`,
  };
}

/**
 * Generate a test child
 */
export function generateTestChild(): TestChild {
  const random = Math.floor(Math.random() * 1000);
  return {
    name: `Test Child ${random}`,
    dateOfBirth: '2020-01-01',
    gender: 'male',
    bloodGroup: 'O+',
  };
}

/**
 * Test database cleanup utilities
 */
export async function cleanupTestData(email: string) {
  // This will be implemented to clean up test data after tests
  // For now, we'll use the API to delete test users
  console.log(`Cleaning up test data for ${email}`);
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Timeout waiting for condition after ${timeout}ms`);
}
