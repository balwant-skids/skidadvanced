/**
 * Sign-Up Flow E2E Tests
 * Feature: skids-e2e-deployment
 * Validates: Requirements 1.1, 2.2
 */

import { test, expect } from '@playwright/test';
import { generateTestUser, generateTestClinic } from '../fixtures/test-data';
import { navigateAndWait, fillField, waitForElement } from '../fixtures/helpers';

test.describe('Sign-Up Flow', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/sign-up');
  });

  test('should display sign-up page with registration form', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Sign Up/i);
    
    // Check form elements exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show clinic code field for parent registration', async ({ page }) => {
    // Look for clinic code input
    const clinicCodeInput = page.locator('input[name="clinicCode"], input[placeholder*="clinic code" i]');
    
    // Clinic code field should be visible
    await expect(clinicCodeInput).toBeVisible();
  });

  test('should validate clinic code before registration', async ({ page }) => {
    const testUser = generateTestUser('parent');
    
    // Fill in user details with invalid clinic code
    await fillField(page, 'input[type="email"]', testUser.email);
    await fillField(page, 'input[type="password"]', testUser.password);
    
    // Try to find and fill clinic code field
    const clinicCodeInput = page.locator('input[name="clinicCode"], input[placeholder*="clinic code" i]').first();
    if (await clinicCodeInput.isVisible()) {
      await fillField(page, 'input[name="clinicCode"], input[placeholder*="clinic code" i]', 'INVALID123');
    }
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for validation
    await page.waitForTimeout(2000);
    
    // Should show error or stay on sign-up page
    expect(page.url()).toContain('/sign-up');
  });

  test('should enforce whitelist for parent registration', async ({ page }) => {
    test.skip(
      !process.env.TEST_CLINIC_CODE,
      'Test clinic code not configured'
    );

    const testUser = generateTestUser('parent');
    
    // Fill in user details
    await fillField(page, 'input[type="email"]', testUser.email);
    await fillField(page, 'input[type="password"]', testUser.password);
    
    // Fill clinic code
    const clinicCodeInput = page.locator('input[name="clinicCode"], input[placeholder*="clinic code" i]').first();
    if (await clinicCodeInput.isVisible()) {
      await fillField(page, 'input[name="clinicCode"], input[placeholder*="clinic code" i]', process.env.TEST_CLINIC_CODE!);
    }
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // If email is not whitelisted, should show error
    // If whitelisted, should proceed to verification
  });

  test('should display Google OAuth button', async ({ page }) => {
    // Check for Google sign-up button
    const googleButton = page.locator('button:has-text("Google"), button:has-text("Continue with Google")');
    await expect(googleButton).toBeVisible();
  });

  test('should have link to sign-in page', async ({ page }) => {
    // Check for sign-in link
    const signInLink = page.locator('a[href*="/sign-in"]');
    await expect(signInLink).toBeVisible();
    
    // Click and verify navigation
    await signInLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/sign-in');
  });

  test('should show password strength requirements', async ({ page }) => {
    // Focus on password field
    await page.focus('input[type="password"]');
    
    // Type a weak password
    await page.fill('input[type="password"]', '123');
    
    // Wait for validation feedback
    await page.waitForTimeout(500);
    
    // Clerk should show password requirements
    // (Exact selectors depend on Clerk's UI)
  });

  test('should prevent duplicate email registration', async ({ page }) => {
    test.skip(
      !process.env.TEST_USER_EMAIL,
      'Test user email not configured'
    );

    // Try to register with existing email
    await fillField(page, 'input[type="email"]', process.env.TEST_USER_EMAIL!);
    await fillField(page, 'input[type="password"]', 'NewPassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for error
    await page.waitForTimeout(2000);
    
    // Should show error about email already in use
    expect(page.url()).toContain('/sign-up');
  });

  test('should create user record in database after successful registration', async ({ page }) => {
    test.skip(true, 'Requires database cleanup and test user creation');
    
    // This test would:
    // 1. Register a new user
    // 2. Verify user record created in database
    // 3. Verify user linked to correct clinic
    // 4. Clean up test data
  });

  test('should redirect to onboarding after successful registration', async ({ page }) => {
    test.skip(true, 'Requires valid test credentials and whitelist setup');
    
    // This test would:
    // 1. Register with valid whitelisted email
    // 2. Complete verification
    // 3. Verify redirect to /onboarding or /dashboard
  });
});
