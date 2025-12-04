import { test, expect } from '@playwright/test';
import { TEST_USERS, generateTestClinic } from '../fixtures/test-data';
import { signIn } from '../fixtures/helpers';

test.describe('Clinic Management (Admin)', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as admin
    await signIn(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
    await page.goto('/admin/clinics');
  });

  test.describe('Creating Clinics', () => {
    test('should navigate to create clinic page', async ({ page }) => {
      await page.click('text=Create Clinic');
      await expect(page.locator('h1:has-text("Create Clinic")')).toBeVisible();
    });

    test('should create a new clinic with valid data', async ({ page }) => {
      const clinic = generateTestClinic();

      await page.click('text=Create Clinic');

      // Fill form
      await page.fill('input[name="name"]', clinic.name);
      await page.fill('input[name="address"]', clinic.address);
      await page.fill('input[name="phone"]', clinic.phone);
      await page.fill('input[name="email"]', clinic.email);

      // Submit
      await page.click('button[type="submit"]');

      // Should show success message
      await expect(page.locator('text=Clinic created successfully')).toBeVisible();

      // Should display clinic code
      await expect(page.locator('[data-testid="clinic-code"]')).toBeVisible();

      // Should redirect to clinics list
      await expect(page).toHaveURL(/\/admin\/clinics/);

      // Should display new clinic
      await expect(page.locator(`text=${clinic.name}`)).toBeVisible();
    });

    test('should generate unique clinic code', async ({ page }) => {
      await page.click('text=Create Clinic');

      const clinic = generateTestClinic();
      await page.fill('input[name="name"]', clinic.name);
      await page.fill('input[name="address"]', clinic.address);
      await page.fill('input[name="phone"]', clinic.phone);
      await page.fill('input[name="email"]', clinic.email);

      await page.click('button[type="submit"]');

      // Should display 6-character alphanumeric code
      const codeElement = page.locator('[data-testid="clinic-code"]');
      await expect(codeElement).toBeVisible();

      const code = await codeElement.textContent();
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
    });

    test('should validate required fields', async ({ page }) => {
      await page.click('text=Create Clinic');

      // Try to submit without filling fields
      await page.click('button[type="submit"]');

      // Should show validation errors
      await expect(page.locator('text=Clinic name is required')).toBeVisible();
      await expect(page.locator('text=Address is required')).toBeVisible();
      await expect(page.locator('text=Phone is required')).toBeVisible();
      await expect(page.locator('text=Email is required')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.click('text=Create Clinic');

      const clinic = generateTestClinic();
      await page.fill('input[name="name"]', clinic.name);
      await page.fill('input[name="address"]', clinic.address);
      await page.fill('input[name="phone"]', clinic.phone);
      await page.fill('input[name="email"]', 'invalid-email');

      await page.click('button[type="submit"]');

      // Should show validation error
      await expect(page.locator('text=Invalid email format')).toBeVisible();
    });
  });

  test.describe('Viewing Clinics', () => {
    test('should display clinics list', async ({ page }) => {
      // Should show clinics table
      await expect(page.locator('[data-testid="clinics-table"]')).toBeVisible();
      await expect(page.locator('[data-testid="clinic-row"]').first()).toBeVisible();
    });

    test('should display clinic details', async ({ page }) => {
      await page.click('[data-testid="clinic-row"]:first-child');

      // Should show clinic information
      await expect(page.locator('[data-testid="clinic-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="clinic-code"]')).toBeVisible();
      await expect(page.locator('[data-testid="clinic-address"]')).toBeVisible();
      await expect(page.locator('[data-testid="clinic-phone"]')).toBeVisible();
      await expect(page.locator('[data-testid="clinic-email"]')).toBeVisible();
    });

    test('should display subscriber count', async ({ page }) => {
      // Should show subscriber counts in list
      await expect(page.locator('[data-testid="subscriber-count"]').first()).toBeVisible();
    });

    test('should filter clinics by status', async ({ page }) => {
      // Filter by active
      await page.selectOption('select[name="statusFilter"]', 'active');
      await expect(page.locator('[data-testid="clinic-row"]').first()).toBeVisible();

      // Filter by inactive
      await page.selectOption('select[name="statusFilter"]', 'inactive');
    });

    test('should search clinics by name', async ({ page }) => {
      await page.fill('input[placeholder="Search clinics"]', 'Test');

      // Should filter results
      const visibleClinics = page.locator('[data-testid="clinic-row"]:visible');
      await expect(visibleClinics.first()).toBeVisible();
    });
  });

  test.describe('Editing Clinics', () => {
    test('should navigate to edit page', async ({ page }) => {
      await page.click('[data-testid="clinic-row"]:first-child');
      await page.click('text=Edit Clinic');

      await expect(page.locator('h1:has-text("Edit Clinic")')).toBeVisible();
    });

    test('should update clinic information', async ({ page }) => {
      await page.click('[data-testid="clinic-row"]:first-child');
      await page.click('text=Edit Clinic');

      // Update name
      const newName = 'Updated Clinic Name';
      await page.fill('input[name="name"]', newName);

      // Update phone
      await page.fill('input[name="phone"]', '+1234567890');

      // Submit
      await page.click('button[type="submit"]');

      // Should show success message
      await expect(page.locator('text=Clinic updated successfully')).toBeVisible();

      // Should display updated information
      await expect(page.locator(`text=${newName}`)).toBeVisible();
    });

    test('should not allow changing clinic code', async ({ page }) => {
      await page.click('[data-testid="clinic-row"]:first-child');
      await page.click('text=Edit Clinic');

      // Clinic code field should be disabled or not editable
      const codeInput = page.locator('input[name="code"]');
      if (await codeInput.isVisible()) {
        await expect(codeInput).toBeDisabled();
      }
    });
  });

  test.describe('Deactivating Clinics', () => {
    test('should deactivate a clinic', async ({ page }) => {
      await page.click('[data-testid="clinic-row"]:first-child');
      await page.click('button:has-text("Deactivate")');

      // Confirm deactivation
      await page.click('button:has-text("Confirm")');

      // Should show success message
      await expect(page.locator('text=Clinic deactivated successfully')).toBeVisible();

      // Should update status
      await expect(page.locator('text=Inactive')).toBeVisible();
    });

    test('should require confirmation before deactivating', async ({ page }) => {
      await page.click('[data-testid="clinic-row"]:first-child');
      await page.click('button:has-text("Deactivate")');

      // Should show confirmation dialog
      await expect(page.locator('text=Are you sure you want to deactivate')).toBeVisible();
      await expect(page.locator('button:has-text("Confirm")')).toBeVisible();
      await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    });

    test('should reactivate a deactivated clinic', async ({ page }) => {
      // Filter to show inactive clinics
      await page.selectOption('select[name="statusFilter"]', 'inactive');

      if (await page.locator('[data-testid="clinic-row"]').first().isVisible()) {
        await page.click('[data-testid="clinic-row"]:first-child');
        await page.click('button:has-text("Reactivate")');

        // Should show success message
        await expect(page.locator('text=Clinic reactivated successfully')).toBeVisible();

        // Should update status
        await expect(page.locator('text=Active')).toBeVisible();
      }
    });
  });

  test.describe('Clinic Statistics', () => {
    test('should display clinic statistics', async ({ page }) => {
      await page.click('[data-testid="clinic-row"]:first-child');

      // Should show statistics
      await expect(page.locator('[data-testid="total-parents"]')).toBeVisible();
      await expect(page.locator('[data-testid="active-subscriptions"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-children"]')).toBeVisible();
    });

    test('should display registration trends', async ({ page }) => {
      await page.click('[data-testid="clinic-row"]:first-child');
      await page.click('text=Analytics');

      // Should show charts
      await expect(page.locator('[data-testid="registration-chart"]')).toBeVisible();
      await expect(page.locator('[data-testid="subscription-chart"]')).toBeVisible();
    });
  });

  test.describe('Clinic Code Management', () => {
    test('should display clinic code prominently', async ({ page }) => {
      await page.click('[data-testid="clinic-row"]:first-child');

      // Should show clinic code
      const codeElement = page.locator('[data-testid="clinic-code"]');
      await expect(codeElement).toBeVisible();

      // Should be formatted correctly
      const code = await codeElement.textContent();
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
    });

    test('should allow copying clinic code', async ({ page }) => {
      await page.click('[data-testid="clinic-row"]:first-child');

      // Click copy button
      await page.click('[data-testid="copy-code-button"]');

      // Should show copied confirmation
      await expect(page.locator('text=Code copied')).toBeVisible();
    });
  });

  test.describe('Bulk Operations', () => {
    test('should select multiple clinics', async ({ page }) => {
      // Select first clinic
      await page.click('[data-testid="clinic-checkbox"]:first-child');

      // Select second clinic
      await page.click('[data-testid="clinic-checkbox"]:nth-child(2)');

      // Should show bulk actions
      await expect(page.locator('[data-testid="bulk-actions"]')).toBeVisible();
    });

    test('should export clinic data', async ({ page }) => {
      await page.click('button:has-text("Export")');

      // Should trigger download
      const downloadPromise = page.waitForEvent('download');
      await page.click('button:has-text("Download CSV")');
      const download = await downloadPromise;

      // Should download CSV file
      expect(download.suggestedFilename()).toContain('.csv');
    });
  });
});
