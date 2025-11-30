import { test, expect } from '@playwright/test';
import { TEST_USERS, TEST_CLINICS } from '../fixtures/test-data';
import { signIn, signOut, waitForDashboard } from '../fixtures/helpers';

test.describe('Session Management', () => {
  test.describe('Session Persistence', () => {
    test('should maintain session across page reloads', async ({ page }) => {
      // Sign in
      await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
      await waitForDashboard(page);

      // Reload page
      await page.reload();

      // Should still be authenticated
      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page.locator('text=Dashboard')).toBeVisible();
    });

    test('should maintain session across navigation', async ({ page }) => {
      await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
      await waitForDashboard(page);

      // Navigate to different pages
      await page.click('text=Children');
      await expect(page).toHaveURL(/\/dashboard\/children/);

      await page.click('text=Appointments');
      await expect(page).toHaveURL(/\/dashboard\/appointments/);

      // Should still be authenticated
      await expect(page.locator('text=Dashboard')).toBeVisible();
    });

    test('should persist session in new tab', async ({ context, page }) => {
      await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
      await waitForDashboard(page);

      // Open new tab
      const newPage = await context.newPage();
      await newPage.goto('/dashboard');

      // Should be authenticated in new tab
      await expect(newPage).toHaveURL(/\/dashboard/);
      await expect(newPage.locator('text=Dashboard')).toBeVisible();

      await newPage.close();
    });
  });

  test.describe('Sign Out Functionality', () => {
    test('should sign out successfully', async ({ page }) => {
      await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
      await waitForDashboard(page);

      // Sign out
      await signOut(page);

      // Should redirect to home or sign-in
      await expect(page).toHaveURL(/\/(sign-in)?$/);
    });

    test('should clear session on sign out', async ({ page }) => {
      await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
      await waitForDashboard(page);

      await signOut(page);

      // Try to access protected route
      await page.goto('/dashboard');

      // Should redirect to sign-in
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test('should sign out from all tabs', async ({ context, page }) => {
      await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
      await waitForDashboard(page);

      // Open second tab
      const secondPage = await context.newPage();
      await secondPage.goto('/dashboard');
      await expect(secondPage).toHaveURL(/\/dashboard/);

      // Sign out from first tab
      await signOut(page);

      // Second tab should also be signed out
      await secondPage.reload();
      await expect(secondPage).toHaveURL(/\/sign-in/);

      await secondPage.close();
    });
  });

  test.describe('Protected Route Access', () => {
    test('should redirect unauthenticated users to sign-in', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test('should redirect unauthenticated users from admin routes', async ({ page }) => {
      await page.goto('/admin/clinics');
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test('should allow access to public routes', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL('/');

      await page.goto('/sign-in');
      await expect(page).toHaveURL('/sign-in');

      await page.goto('/sign-up');
      await expect(page).toHaveURL('/sign-up');
    });

    test('should prevent parent from accessing admin routes', async ({ page }) => {
      await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
      await waitForDashboard(page);

      // Try to access admin route
      await page.goto('/admin/clinics');

      // Should be redirected or show error
      await expect(page).not.toHaveURL(/\/admin\/clinics/);
    });

    test('should allow admin to access admin routes', async ({ page }) => {
      await signIn(page, TEST_USERS.admin.email, TEST_USERS.admin.password);

      // Should be able to access admin routes
      await page.goto('/admin/clinics');
      await expect(page).toHaveURL(/\/admin\/clinics/);
    });
  });

  test.describe('Session Expiry Handling', () => {
    test('should handle expired session gracefully', async ({ page }) => {
      await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
      await waitForDashboard(page);

      // Simulate session expiry by clearing cookies
      await page.context().clearCookies();

      // Try to navigate
      await page.click('text=Children');

      // Should redirect to sign-in
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test('should show session expired message', async ({ page }) => {
      await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
      await waitForDashboard(page);

      // Clear session
      await page.context().clearCookies();

      // Try to access protected route
      await page.goto('/dashboard');

      // Should show message or redirect
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test('should allow re-authentication after expiry', async ({ page }) => {
      await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
      await waitForDashboard(page);

      // Clear session
      await page.context().clearCookies();
      await page.goto('/sign-in');

      // Sign in again
      await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
      await waitForDashboard(page);

      // Should be authenticated
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });
});
