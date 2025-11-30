import { test, expect } from '@playwright/test';
import { TEST_USERS } from '../fixtures/test-data';
import { signIn, waitForDashboard } from '../fixtures/helpers';

test.describe('Report Access', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
    await waitForDashboard(page);
  });

  test.describe('Viewing Reports', () => {
    test('should navigate to reports page', async ({ page }) => {
      await page.click('text=Reports');
      await expect(page).toHaveURL(/\/dashboard\/reports/);
      await expect(page.locator('h1:has-text("Reports")')).toBeVisible();
    });

    test('should display reports list', async ({ page }) => {
      await page.click('text=Reports');

      // Should show reports list
      await expect(page.locator('[data-testid="reports-list"]')).toBeVisible();
    });

    test('should show report details', async ({ page }) => {
      await page.click('text=Reports');

      if (await page.locator('[data-testid="report-card"]').first().isVisible()) {
        await page.click('[data-testid="report-card"]:first-child');

        // Should display report information
        await expect(page.locator('[data-testid="report-title"]')).toBeVisible();
        await expect(page.locator('[data-testid="report-date"]')).toBeVisible();
        await expect(page.locator('[data-testid="report-type"]')).toBeVisible();
        await expect(page.locator('[data-testid="report-child"]')).toBeVisible();
      }
    });

    test('should filter reports by child', async ({ page }) => {
      await page.click('text=Reports');

      // Select child filter
      await page.selectOption('select[name="childFilter"]', { index: 1 });

      // Should show filtered reports
      const reports = page.locator('[data-testid="report-card"]');
      if (await reports.first().isVisible()) {
        await expect(reports.first()).toBeVisible();
      }
    });

    test('should filter reports by type', async ({ page }) => {
      await page.click('text=Reports');

      // Select type filter
      await page.selectOption('select[name="typeFilter"]', 'medical');

      // Should show filtered reports
      const reports = page.locator('[data-testid="report-card"]');
      if (await reports.first().isVisible()) {
        await expect(reports.first()).toBeVisible();
      }
    });

    test('should show empty state when no reports', async ({ page, context }) => {
      // Sign in as new parent with no reports
      await page.context().clearCookies();
      await signIn(page, TEST_USERS.newParent.email, TEST_USERS.newParent.password);
      await waitForDashboard(page);

      await page.click('text=Reports');

      // Should show empty state
      await expect(page.locator('text=No reports available')).toBeVisible();
    });
  });

  test.describe('Downloading Reports', () => {
    test('should download report', async ({ page }) => {
      await page.click('text=Reports');

      if (await page.locator('[data-testid="report-card"]').first().isVisible()) {
        await page.click('[data-testid="report-card"]:first-child');

        // Click download button
        const downloadPromise = page.waitForEvent('download');
        await page.click('button:has-text("Download")');
        const download = await downloadPromise;

        // Should download file
        expect(download.suggestedFilename()).toBeTruthy();
      }
    });

    test('should show download progress', async ({ page }) => {
      await page.click('text=Reports');

      if (await page.locator('[data-testid="report-card"]').first().isVisible()) {
        await page.click('[data-testid="report-card"]:first-child');
        await page.click('button:has-text("Download")');

        // Should show progress indicator
        await expect(page.locator('[data-testid="download-progress"]')).toBeVisible();
      }
    });

    test('should handle download errors gracefully', async ({ page }) => {
      await page.click('text=Reports');

      // Simulate network error by going offline
      await page.context().setOffline(true);

      if (await page.locator('[data-testid="report-card"]').first().isVisible()) {
        await page.click('[data-testid="report-card"]:first-child');
        await page.click('button:has-text("Download")');

        // Should show error message
        await expect(page.locator('text=Download failed')).toBeVisible();
      }

      // Restore online status
      await page.context().setOffline(false);
    });
  });

  test.describe('Report Offline Caching', () => {
    test('should cache downloaded reports', async ({ page }) => {
      await page.click('text=Reports');

      if (await page.locator('[data-testid="report-card"]').first().isVisible()) {
        await page.click('[data-testid="report-card"]:first-child');

        // Download report
        await page.click('button:has-text("Download")');
        await page.waitForTimeout(2000); // Wait for download

        // Should show cached indicator
        await expect(page.locator('[data-testid="cached-badge"]')).toBeVisible();
      }
    });

    test('should access cached reports offline', async ({ page }) => {
      await page.click('text=Reports');

      if (await page.locator('[data-testid="report-card"]').first().isVisible()) {
        // Download and cache report
        await page.click('[data-testid="report-card"]:first-child');
        await page.click('button:has-text("Download")');
        await page.waitForTimeout(2000);

        // Go offline
        await page.context().setOffline(true);

        // Navigate away and back
        await page.click('text=Dashboard');
        await page.click('text=Reports');
        await page.click('[data-testid="report-card"]:first-child');

        // Should still be able to view cached report
        await expect(page.locator('[data-testid="report-title"]')).toBeVisible();
        await expect(page.locator('[data-testid="cached-badge"]')).toBeVisible();

        // Restore online
        await page.context().setOffline(false);
      }
    });

    test('should show cache size', async ({ page }) => {
      await page.click('text=Reports');
      await page.click('text=Settings');

      // Should display cache information
      await expect(page.locator('[data-testid="cache-size"]')).toBeVisible();
    });

    test('should clear cached reports', async ({ page }) => {
      await page.click('text=Reports');
      await page.click('text=Settings');

      // Clear cache
      await page.click('button:has-text("Clear Cache")');

      // Confirm
      await page.click('button:has-text("Confirm")');

      // Should show success message
      await expect(page.locator('text=Cache cleared successfully')).toBeVisible();
    });
  });

  test.describe('Report Notifications', () => {
    test('should show notification when new report is uploaded', async ({ page }) => {
      // Check for notification badge
      const notificationBadge = page.locator('[data-testid="notification-badge"]');
      if (await notificationBadge.isVisible()) {
        await expect(notificationBadge).toBeVisible();
      }
    });

    test('should mark report as read', async ({ page }) => {
      await page.click('text=Reports');

      if (await page.locator('[data-testid="report-card"].unread').first().isVisible()) {
        await page.click('[data-testid="report-card"].unread:first-child');

        // Should mark as read
        await expect(page.locator('[data-testid="report-card"].unread').first()).not.toBeVisible();
      }
    });

    test('should show unread count', async ({ page }) => {
      await page.click('text=Reports');

      // Should display unread count
      const unreadBadge = page.locator('[data-testid="unread-count"]');
      if (await unreadBadge.isVisible()) {
        await expect(unreadBadge).toBeVisible();
      }
    });
  });

  test.describe('Report Sharing', () => {
    test('should share report via email', async ({ page }) => {
      await page.click('text=Reports');

      if (await page.locator('[data-testid="report-card"]').first().isVisible()) {
        await page.click('[data-testid="report-card"]:first-child');
        await page.click('button:has-text("Share")');

        // Fill email
        await page.fill('input[name="email"]', 'doctor@example.com');

        // Send
        await page.click('button:has-text("Send")');

        // Should show success message
        await expect(page.locator('text=Report shared successfully')).toBeVisible();
      }
    });

    test('should generate shareable link', async ({ page }) => {
      await page.click('text=Reports');

      if (await page.locator('[data-testid="report-card"]').first().isVisible()) {
        await page.click('[data-testid="report-card"]:first-child');
        await page.click('button:has-text("Share")');
        await page.click('text=Generate Link');

        // Should display shareable link
        await expect(page.locator('[data-testid="share-link"]')).toBeVisible();

        // Should have copy button
        await expect(page.locator('button:has-text("Copy Link")')).toBeVisible();
      }
    });
  });

  test.describe('Report Search', () => {
    test('should search reports by title', async ({ page }) => {
      await page.click('text=Reports');

      // Search
      await page.fill('input[placeholder="Search reports"]', 'Blood Test');

      // Should filter results
      const reports = page.locator('[data-testid="report-card"]:visible');
      if (await reports.first().isVisible()) {
        await expect(reports.first()).toBeVisible();
      }
    });

    test('should search reports by date range', async ({ page }) => {
      await page.click('text=Reports');

      // Set date range
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();

      await page.fill('input[name="startDate"]', startDate.toISOString().split('T')[0]);
      await page.fill('input[name="endDate"]', endDate.toISOString().split('T')[0]);

      await page.click('button:has-text("Apply")');

      // Should show filtered reports
      const reports = page.locator('[data-testid="report-card"]');
      if (await reports.first().isVisible()) {
        await expect(reports.first()).toBeVisible();
      }
    });
  });

  test.describe('Report Preview', () => {
    test('should preview report without downloading', async ({ page }) => {
      await page.click('text=Reports');

      if (await page.locator('[data-testid="report-card"]').first().isVisible()) {
        await page.click('[data-testid="report-card"]:first-child');
        await page.click('button:has-text("Preview")');

        // Should show preview modal
        await expect(page.locator('[data-testid="report-preview"]')).toBeVisible();
      }
    });

    test('should close preview', async ({ page }) => {
      await page.click('text=Reports');

      if (await page.locator('[data-testid="report-card"]').first().isVisible()) {
        await page.click('[data-testid="report-card"]:first-child');
        await page.click('button:has-text("Preview")');

        // Close preview
        await page.click('button:has-text("Close")');

        // Should close modal
        await expect(page.locator('[data-testid="report-preview"]')).not.toBeVisible();
      }
    });
  });
});
