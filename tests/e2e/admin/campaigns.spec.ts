import { test, expect } from '@playwright/test';
import { TEST_USERS, generateTestCampaign } from '../fixtures/test-data';
import { signIn } from '../fixtures/helpers';

test.describe('Campaign Management (Admin)', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
    await page.goto('/admin/campaigns');
  });

  test.describe('Creating Campaigns', () => {
    test('should create a new campaign', async ({ page }) => {
      const campaign = generateTestCampaign();

      await page.click('text=Create Campaign');
      await page.fill('input[name="title"]', campaign.title);
      await page.fill('textarea[name="description"]', campaign.description);
      await page.selectOption('select[name="targetAudience"]', 'all');
      await page.click('button[type="submit"]');

      await expect(page.locator('text=Campaign created successfully')).toBeVisible();
      await expect(page.locator(`text=${campaign.title}`)).toBeVisible();
    });

    test('should upload campaign media', async ({ page }) => {
      await page.click('text=Create Campaign');
      
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: 'campaign-image.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-data'),
      });

      await expect(page.locator('[data-testid="media-preview"]')).toBeVisible();
    });
  });

  test.describe('Viewing Campaigns', () => {
    test('should display campaigns list', async ({ page }) => {
      await expect(page.locator('[data-testid="campaigns-table"]')).toBeVisible();
    });

    test('should filter by status', async ({ page }) => {
      await page.selectOption('select[name="statusFilter"]', 'active');
      await expect(page.locator('[data-testid="campaign-row"]').first()).toBeVisible();
    });
  });

  test.describe('Campaign Targeting', () => {
    test('should target specific clinic', async ({ page }) => {
      await page.click('text=Create Campaign');
      await page.selectOption('select[name="targetAudience"]', 'clinic');
      await page.selectOption('select[name="clinicId"]', { index: 1 });
      await expect(page.locator('select[name="clinicId"]')).toBeVisible();
    });
  });
});
