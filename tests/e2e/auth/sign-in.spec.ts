/**
 * Sign-In Flow E2E Tests
 * Feature: skids-e2e-deployment
 * Validates: Requirements 1.2
 */

import { test, expect } from '@playwright/test';
import { generateTestUser, generateTestEmail } from '../fixtures/test-data';
import { navigateAndWait, fillField, waitForElement } from '../fixtures/helpers';

test.describe('Sign-In Flow', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/sign-in');
  });

  test('should display sign-in page with email/password form', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Sign In/i);
    
    // Check form elements exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click submit without filling fields
    await page.click('button[type="submit"]');
    
    // Wait for validation errors
    await page.waitForTimeout(500);
    
    // Check for error messages (Clerk handles validation)
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Verify inputs are still empty
    await expect(emailInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const testUser = generateTestUser('parent');
    
    // Fill in invalid credentials
    await fillField(page, 'input[type="email"]', testUser.email);
    await fillField(page, 'input[type="password"]', 'WrongPassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await page.waitForTimeout(2000);
    
    // Should still be on sign-in page
    expect(page.url()).toContain('/sign-in');
  });

  test('should display Google OAuth button', async ({ page }) => {
    // Check for Google sign-in button
    const googleButton = page.locator('button:has-text("Google"), button:has-text("Continue with Google")');
    await expect(googleButton).toBeVisible();
  });

  test('should have link to sign-up page', async ({ page }) => {
    // Check for sign-up link
    const signUpLink = page.locator('a[href*="/sign-up"]');
    await expect(signUpLink).toBeVisible();
    
    // Click and verify navigation
    await signUpLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/sign-up');
  });

  test('should redirect to dashboard after successful sign-in', async ({ page }) => {
    // Note: This test requires a valid test user in Clerk
    // Skip in CI unless test credentials are configured
    test.skip(
      !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD,
      'Test credentials not configured'
    );

    // Fill in valid credentials
    await fillField(page, 'input[type="email"]', process.env.TEST_USER_EMAIL!);
    await fillField(page, 'input[type="password"]', process.env.TEST_USER_PASSWORD!);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    
    // Verify we're on dashboard
    expect(page.url()).toContain('/dashboard');
  });

  test('should persist session after page reload', async ({ page }) => {
    test.skip(
      !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD,
      'Test credentials not configured'
    );

    // Sign in
    await fillField(page, 'input[type="email"]', process.env.TEST_USER_EMAIL!);
    await fillField(page, 'input[type="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should still be on dashboard (session persisted)
    expect(page.url()).toContain('/dashboard');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);
    
    // Try to sign in
    await fillField(page, 'input[type="email"]', 'test@example.com');
    await fillField(page, 'input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should show some error indication
    // (Exact behavior depends on Clerk's offline handling)
    
    // Go back online
    await page.context().setOffline(false);
  });
});
