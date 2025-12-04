import { test, expect } from '@playwright/test';

/**
 * E2E Tests for SKIDS Integration
 * Tests data synchronization between SKIDS and Digital Parenting platforms
 */

test.describe('SKIDS Integration E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login as parent user
    await page.goto('/sign-in');
    // TODO: Add actual login flow
  });

  test('should sync child profiles from SKIDS', async ({ page }) => {
    // Navigate to sync page
    await page.goto('/dashboard/sync');

    // Trigger sync
    await page.click('button:has-text("Sync with SKIDS")');

    // Wait for sync to complete
    await expect(page.locator('.sync-status')).toContainText('Sync completed', { timeout: 10000 });

    // Verify children are displayed
    await expect(page.locator('.child-card')).toHaveCount(1, { timeout: 5000 });
  });

  test('should import health data from SKIDS', async ({ page }) => {
    await page.goto('/dashboard/children');

    // Select a child
    await page.click('.child-card:first-child');

    // Trigger health data sync
    await page.click('button:has-text("Sync Health Data")');

    // Verify health data is displayed
    await expect(page.locator('.health-metrics')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.health-conditions')).toBeVisible();
  });

  test('should sync appointments from SKIDS', async ({ page }) => {
    await page.goto('/dashboard/appointments');

    // Trigger appointment sync
    await page.click('button:has-text("Sync Appointments")');

    // Verify appointments are displayed
    await expect(page.locator('.appointment-card')).toHaveCount(1, { timeout: 5000 });
  });

  test('should send development progress to SKIDS', async ({ page }) => {
    await page.goto('/dashboard/development');

    // Mark a milestone as achieved
    await page.click('.milestone-item:first-child .mark-achieved');

    // Trigger sync to SKIDS
    await page.click('button:has-text("Sync to SKIDS")');

    // Verify sync success
    await expect(page.locator('.sync-success-message')).toBeVisible({ timeout: 5000 });
  });

  test('should display health-based content recommendations', async ({ page }) => {
    await page.goto('/dashboard/recommendations');

    // Verify health-based recommendations are shown
    await expect(page.locator('.health-recommendation')).toBeVisible();
    await expect(page.locator('.recommendation-reason')).toContainText('health');
  });

  test('should deliver appointment preparation materials', async ({ page }) => {
    await page.goto('/dashboard/appointments');

    // Click on upcoming appointment
    await page.click('.appointment-card:first-child');

    // Verify preparation materials are shown
    await expect(page.locator('.preparation-materials')).toBeVisible();
    await expect(page.locator('.material-item')).toHaveCount(3, { timeout: 5000 });
  });
});

test.describe('SKIDS Integration API Tests', () => {
  test('POST /api/parenting/integration/sync should sync child profiles', async ({ request }) => {
    const response = await request.post('/api/parenting/integration/sync', {
      data: {
        syncType: 'child_profiles',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });

  test('POST /api/parenting/integration/sync should sync health data', async ({ request }) => {
    const response = await request.post('/api/parenting/integration/sync', {
      data: {
        syncType: 'health_data',
        childId: 'test-child-id',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('GET /api/parenting/integration/health-recommendations should return recommendations', async ({ request }) => {
    const response = await request.get('/api/parenting/integration/health-recommendations/test-child-id');

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.recommendedContent).toBeDefined();
  });
});