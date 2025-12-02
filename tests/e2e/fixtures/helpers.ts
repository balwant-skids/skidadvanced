/**
 * Test Helper Functions for E2E Tests
 * Feature: skids-e2e-deployment
 */

import { Page, expect } from '@playwright/test';

/**
 * Navigate to a page and wait for it to load
 */
export async function navigateAndWait(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
}

/**
 * Fill a form field and wait for it to be filled
 */
export async function fillField(page: Page, selector: string, value: string) {
  await page.fill(selector, value);
  await expect(page.locator(selector)).toHaveValue(value);
}

/**
 * Click a button and wait for navigation
 */
export async function clickAndWait(page: Page, selector: string) {
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click(selector),
  ]);
}

/**
 * Wait for an element to be visible
 */
export async function waitForElement(page: Page, selector: string, timeout: number = 5000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Check if an element exists
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get text content of an element
 */
export async function getTextContent(page: Page, selector: string): Promise<string> {
  const element = await page.locator(selector);
  return (await element.textContent()) || '';
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}

/**
 * Simulate offline mode
 */
export async function goOffline(page: Page) {
  await page.context().setOffline(true);
}

/**
 * Simulate online mode
 */
export async function goOnline(page: Page) {
  await page.context().setOffline(false);
}

/**
 * Clear browser storage
 */
export async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Clear IndexedDB
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      const dbs = indexedDB.databases();
      dbs.then((databases) => {
        databases.forEach((db) => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
          }
        });
        resolve();
      });
    });
  });
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  action: () => Promise<void>
) {
  const responsePromise = page.waitForResponse(urlPattern);
  await action();
  return await responsePromise;
}

/**
 * Mock API response
 */
export async function mockAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  response: any,
  status: number = 200
) {
  await page.route(urlPattern, (route) => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Check for Clerk session
    const session = await page.evaluate(() => {
      return document.cookie.includes('__session');
    });
    return session;
  } catch {
    return false;
  }
}

/**
 * Sign out user
 */
export async function signOut(page: Page) {
  await page.goto('/sign-out');
  await page.waitForLoadState('networkidle');
}

/**
 * Sign in as a user
 */
export async function signIn(page: Page, email: string, password: string) {
  await page.goto('/sign-in');
  await page.waitForLoadState('networkidle');
  
  // Fill in credentials
  await fillField(page, 'input[name="email"]', email);
  await fillField(page, 'input[name="password"]', password);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for redirect after successful login
  await page.waitForLoadState('networkidle');
  
  // Verify we're logged in (should not be on sign-in page)
  await expect(page).not.toHaveURL(/\/sign-in/);
}

/**
 * Sign in as admin
 */
export async function signInAsAdmin(page: Page) {
  const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@test.skids.com';
  const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'Admin@1234';
  await signIn(page, adminEmail, adminPassword);
}

/**
 * Sign in as clinic manager
 */
export async function signInAsClinicManager(page: Page) {
  const managerEmail = process.env.TEST_MANAGER_EMAIL || 'manager@test.skids.com';
  const managerPassword = process.env.TEST_MANAGER_PASSWORD || 'Manager@1234';
  await signIn(page, managerEmail, managerPassword);
}

/**
 * Sign in as parent
 */
export async function signInAsParent(page: Page) {
  const parentEmail = process.env.TEST_PARENT_EMAIL || 'parent@test.skids.com';
  const parentPassword = process.env.TEST_PARENT_PASSWORD || 'Parent@1234';
  await signIn(page, parentEmail, parentPassword);
}
