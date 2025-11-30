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
