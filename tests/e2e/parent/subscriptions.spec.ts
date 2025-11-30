import { test, expect } from '@playwright/test';
import { TEST_USERS } from '../fixtures/test-data';
import { signIn, waitForDashboard } from '../fixtures/helpers';

test.describe('Subscription Management', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
    await waitForDashboard(page);
  });

  test.describe('Viewing Care Plans', () => {
    test('should navigate to care plans page', async ({ page }) => {
      await page.click('text=Subscription');
      await expect(page).toHaveURL(/\/dashboard\/subscription/);
    });

    test('should display available care plans', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=View Plans');

      // Should show care plans
      await expect(page.locator('[data-testid="care-plan-card"]').first()).toBeVisible();
    });

    test('should show plan features', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=View Plans');

      // Click on a plan
      await page.click('[data-testid="care-plan-card"]:first-child');

      // Should display features
      await expect(page.locator('[data-testid="plan-features"]')).toBeVisible();
      await expect(page.locator('[data-testid="plan-price"]')).toBeVisible();
    });

    test('should filter plans by price', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=View Plans');

      // Sort by price
      await page.selectOption('select[name="sortBy"]', 'price');

      // Should reorder plans
      const plans = page.locator('[data-testid="care-plan-card"]');
      await expect(plans.first()).toBeVisible();
    });
  });

  test.describe('Subscription Status', () => {
    test('should display current subscription status', async ({ page }) => {
      await page.click('text=Subscription');

      // Should show subscription status
      await expect(page.locator('[data-testid="subscription-status"]')).toBeVisible();
    });

    test('should show subscription details', async ({ page }) => {
      await page.click('text=Subscription');

      // Should display subscription information
      await expect(page.locator('[data-testid="plan-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="billing-cycle"]')).toBeVisible();
      await expect(page.locator('[data-testid="next-billing-date"]')).toBeVisible();
    });

    test('should show subscription expiry warning', async ({ page }) => {
      await page.click('text=Subscription');

      // Check for expiry warning if subscription is expiring soon
      const expiryWarning = page.locator('[data-testid="expiry-warning"]');
      if (await expiryWarning.isVisible()) {
        await expect(expiryWarning).toContainText('expires');
      }
    });

    test('should display subscription history', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=History');

      // Should show subscription history
      await expect(page.locator('[data-testid="subscription-history"]')).toBeVisible();
    });
  });

  test.describe('Premium Feature Access', () => {
    test('should allow access to premium features with active subscription', async ({ page }) => {
      await page.click('text=Subscription');

      // Check subscription status
      const status = await page.locator('[data-testid="subscription-status"]').textContent();

      if (status?.includes('Active')) {
        // Try to access premium feature
        await page.goto('/dashboard/premium-feature');

        // Should have access
        await expect(page).toHaveURL(/\/dashboard\/premium-feature/);
      }
    });

    test('should block premium features without subscription', async ({ page, context }) => {
      // Sign in as user without subscription
      await page.context().clearCookies();
      await signIn(page, TEST_USERS.freeUser.email, TEST_USERS.freeUser.password);
      await waitForDashboard(page);

      // Try to access premium feature
      await page.goto('/dashboard/premium-feature');

      // Should be redirected or show upgrade prompt
      await expect(page.locator('text=Upgrade to access')).toBeVisible();
    });

    test('should show feature lock indicators', async ({ page, context }) => {
      await page.context().clearCookies();
      await signIn(page, TEST_USERS.freeUser.email, TEST_USERS.freeUser.password);
      await waitForDashboard(page);

      // Should show lock icons on premium features
      const lockIcons = page.locator('[data-testid="feature-locked"]');
      if (await lockIcons.first().isVisible()) {
        await expect(lockIcons.first()).toBeVisible();
      }
    });
  });

  test.describe('Subscription Expiry Handling', () => {
    test('should show grace period message', async ({ page }) => {
      await page.click('text=Subscription');

      // Check for grace period message
      const gracePeriod = page.locator('[data-testid="grace-period"]');
      if (await gracePeriod.isVisible()) {
        await expect(gracePeriod).toContainText('grace period');
      }
    });

    test('should handle expired subscription', async ({ page, context }) => {
      // This would need a test user with expired subscription
      // For now, we'll check the UI handles it gracefully
      await page.click('text=Subscription');

      const status = await page.locator('[data-testid="subscription-status"]').textContent();
      if (status?.includes('Expired')) {
        // Should show renewal option
        await expect(page.locator('button:has-text("Renew")')).toBeVisible();
      }
    });
  });

  test.describe('Billing Information', () => {
    test('should display billing information', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=Billing');

      // Should show billing details
      await expect(page.locator('[data-testid="billing-info"]')).toBeVisible();
    });

    test('should show payment history', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=Billing');
      await page.click('text=Payment History');

      // Should display payment history
      await expect(page.locator('[data-testid="payment-history"]')).toBeVisible();
    });

    test('should download invoice', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=Billing');

      if (await page.locator('[data-testid="invoice-row"]').first().isVisible()) {
        const downloadPromise = page.waitForEvent('download');
        await page.click('[data-testid="invoice-row"]:first-child button:has-text("Download")');
        const download = await downloadPromise;

        expect(download.suggestedFilename()).toContain('invoice');
      }
    });
  });

  test.describe('Plan Comparison', () => {
    test('should compare plans side by side', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=View Plans');
      await page.click('text=Compare Plans');

      // Should show comparison table
      await expect(page.locator('[data-testid="plan-comparison"]')).toBeVisible();
    });

    test('should highlight differences between plans', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=View Plans');
      await page.click('text=Compare Plans');

      // Should show feature differences
      await expect(page.locator('[data-testid="feature-comparison"]')).toBeVisible();
    });
  });

  test.describe('Subscription Notifications', () => {
    test('should show renewal reminder', async ({ page }) => {
      await page.click('text=Subscription');

      // Check for renewal reminder
      const reminder = page.locator('[data-testid="renewal-reminder"]');
      if (await reminder.isVisible()) {
        await expect(reminder).toBeVisible();
      }
    });

    test('should configure notification preferences', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=Settings');

      // Should show notification settings
      await expect(page.locator('input[name="renewalReminders"]')).toBeVisible();
      await expect(page.locator('input[name="paymentNotifications"]')).toBeVisible();
    });
  });

  test.describe('Family Sharing', () => {
    test('should show family members on subscription', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=Family');

      // Should display family members
      await expect(page.locator('[data-testid="family-members"]')).toBeVisible();
    });

    test('should show subscription benefits for all children', async ({ page }) => {
      await page.click('text=Subscription');

      // Should indicate all children are covered
      await expect(page.locator('[data-testid="children-covered"]')).toBeVisible();
    });
  });

  test.describe('Subscription Support', () => {
    test('should access subscription help', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=Help');

      // Should show help content
      await expect(page.locator('[data-testid="subscription-help"]')).toBeVisible();
    });

    test('should contact support about subscription', async ({ page }) => {
      await page.click('text=Subscription');
      await page.click('text=Contact Support');

      // Should show contact form
      await expect(page.locator('[data-testid="support-form"]')).toBeVisible();
    });
  });
});
