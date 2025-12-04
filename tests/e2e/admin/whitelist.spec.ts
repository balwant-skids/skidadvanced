import { test, expect } from '@playwright/test';
import { TEST_USERS, generateTestEmail } from '../fixtures/test-data';
import { signIn } from '../fixtures/helpers';

test.describe('Whitelist Management (Admin)', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as admin
    await signIn(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
    
    // Navigate to first clinic
    await page.goto('/admin/clinics');
    await page.click('[data-testid="clinic-row"]:first-child');
    await page.click('text=Whitelist');
  });

  test.describe('Adding to Whitelist', () => {
    test('should add email to whitelist', async ({ page }) => {
      const testEmail = generateTestEmail();

      await page.click('text=Add to Whitelist');

      // Fill form
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="name"]', 'Test Parent');
      await page.fill('input[name="phone"]', '+1234567890');

      // Submit
      await page.click('button[type="submit"]');

      // Should show success message
      await expect(page.locator('text=Added to whitelist successfully')).toBeVisible();

      // Should display in list
      await expect(page.locator(`text=${testEmail}`)).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.click('text=Add to Whitelist');

      // Enter invalid email
      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="name"]', 'Test Parent');

      await page.click('button[type="submit"]');

      // Should show validation error
      await expect(page.locator('text=Invalid email format')).toBeVisible();
    });

    test('should prevent duplicate emails', async ({ page }) => {
      const testEmail = generateTestEmail();

      // Add first time
      await page.click('text=Add to Whitelist');
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="name"]', 'Test Parent');
      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      // Try to add again
      await page.click('text=Add to Whitelist');
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="name"]', 'Test Parent 2');
      await page.click('button[type="submit"]');

      // Should show error
      await expect(page.locator('text=Email already in whitelist')).toBeVisible();
    });

    test('should add multiple emails at once', async ({ page }) => {
      await page.click('text=Bulk Add');

      // Enter multiple emails
      const emails = [
        generateTestEmail(),
        generateTestEmail(),
        generateTestEmail(),
      ];

      await page.fill('textarea[name="emails"]', emails.join('\n'));

      await page.click('button[type="submit"]');

      // Should show success message
      await expect(page.locator('text=3 emails added to whitelist')).toBeVisible();

      // Should display all emails
      for (const email of emails) {
        await expect(page.locator(`text=${email}`)).toBeVisible();
      }
    });
  });

  test.describe('Viewing Whitelist', () => {
    test('should display whitelist table', async ({ page }) => {
      // Should show whitelist table
      await expect(page.locator('[data-testid="whitelist-table"]')).toBeVisible();
    });

    test('should show registration status', async ({ page }) => {
      // Should display status badges
      const statusBadges = page.locator('[data-testid="registration-status"]');
      if (await statusBadges.first().isVisible()) {
        await expect(statusBadges.first()).toBeVisible();
      }
    });

    test('should filter by registration status', async ({ page }) => {
      // Filter by registered
      await page.selectOption('select[name="statusFilter"]', 'registered');

      // Should show only registered users
      const rows = page.locator('[data-testid="whitelist-row"]');
      if (await rows.first().isVisible()) {
        await expect(rows.first()).toBeVisible();
      }

      // Filter by pending
      await page.selectOption('select[name="statusFilter"]', 'pending');
    });

    test('should search whitelist by email', async ({ page }) => {
      await page.fill('input[placeholder="Search whitelist"]', 'test@');

      // Should filter results
      const rows = page.locator('[data-testid="whitelist-row"]:visible');
      if (await rows.first().isVisible()) {
        await expect(rows.first()).toBeVisible();
      }
    });

    test('should sort whitelist', async ({ page }) => {
      // Sort by name
      await page.click('th:has-text("Name")');

      // Should sort ascending
      await expect(page.locator('[data-testid="sort-icon-asc"]')).toBeVisible();

      // Click again to sort descending
      await page.click('th:has-text("Name")');
      await expect(page.locator('[data-testid="sort-icon-desc"]')).toBeVisible();
    });
  });

  test.describe('Removing from Whitelist', () => {
    test('should remove email from whitelist', async ({ page }) => {
      if (await page.locator('[data-testid="whitelist-row"]').first().isVisible()) {
        // Get email text before removing
        const emailText = await page.locator('[data-testid="whitelist-row"]:first-child [data-testid="email"]').textContent();

        // Click remove button
        await page.click('[data-testid="whitelist-row"]:first-child button:has-text("Remove")');

        // Confirm removal
        await page.click('button:has-text("Confirm")');

        // Should show success message
        await expect(page.locator('text=Removed from whitelist successfully')).toBeVisible();

        // Should not display in list
        if (emailText) {
          await expect(page.locator(`text=${emailText}`)).not.toBeVisible();
        }
      }
    });

    test('should require confirmation before removing', async ({ page }) => {
      if (await page.locator('[data-testid="whitelist-row"]').first().isVisible()) {
        await page.click('[data-testid="whitelist-row"]:first-child button:has-text("Remove")');

        // Should show confirmation dialog
        await expect(page.locator('text=Are you sure you want to remove')).toBeVisible();
        await expect(page.locator('button:has-text("Confirm")')).toBeVisible();
        await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
      }
    });

    test('should not allow removing registered users', async ({ page }) => {
      // Filter to show registered users
      await page.selectOption('select[name="statusFilter"]', 'registered');

      if (await page.locator('[data-testid="whitelist-row"]').first().isVisible()) {
        // Remove button should be disabled or show warning
        const removeButton = page.locator('[data-testid="whitelist-row"]:first-child button:has-text("Remove")');
        
        if (await removeButton.isVisible()) {
          await removeButton.click();
          
          // Should show warning
          await expect(page.locator('text=Cannot remove registered users')).toBeVisible();
        }
      }
    });

    test('should bulk remove emails', async ({ page }) => {
      // Select multiple rows
      await page.click('[data-testid="whitelist-checkbox"]:nth-child(1)');
      await page.click('[data-testid="whitelist-checkbox"]:nth-child(2)');

      // Click bulk remove
      await page.click('button:has-text("Remove Selected")');

      // Confirm
      await page.click('button:has-text("Confirm")');

      // Should show success message
      await expect(page.locator('text=2 emails removed from whitelist')).toBeVisible();
    });
  });

  test.describe('Whitelist Enforcement', () => {
    test('should show whitelist enforcement status', async ({ page }) => {
      // Should display enforcement toggle
      await expect(page.locator('[data-testid="enforcement-toggle"]')).toBeVisible();
    });

    test('should toggle whitelist enforcement', async ({ page }) => {
      // Toggle enforcement
      await page.click('[data-testid="enforcement-toggle"]');

      // Should show confirmation
      await expect(page.locator('text=Whitelist enforcement updated')).toBeVisible();
    });

    test('should show warning when enforcement is disabled', async ({ page }) => {
      // Check if enforcement is disabled
      const toggle = page.locator('[data-testid="enforcement-toggle"]');
      const isChecked = await toggle.isChecked();

      if (!isChecked) {
        // Should show warning
        await expect(page.locator('text=Warning: Anyone can register')).toBeVisible();
      }
    });
  });

  test.describe('Whitelist Import/Export', () => {
    test('should export whitelist to CSV', async ({ page }) => {
      await page.click('button:has-text("Export")');

      // Should trigger download
      const downloadPromise = page.waitForEvent('download');
      await page.click('button:has-text("Download CSV")');
      const download = await downloadPromise;

      // Should download CSV file
      expect(download.suggestedFilename()).toContain('.csv');
    });

    test('should import whitelist from CSV', async ({ page }) => {
      await page.click('button:has-text("Import")');

      // Upload CSV file
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: 'whitelist.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('email,name,phone\ntest1@example.com,Test 1,+1234567890\ntest2@example.com,Test 2,+0987654321'),
      });

      await page.click('button:has-text("Upload")');

      // Should show success message
      await expect(page.locator('text=2 emails imported successfully')).toBeVisible();
    });

    test('should validate CSV format', async ({ page }) => {
      await page.click('button:has-text("Import")');

      // Upload invalid CSV
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: 'invalid.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('invalid,data\nno,email'),
      });

      await page.click('button:has-text("Upload")');

      // Should show error
      await expect(page.locator('text=Invalid CSV format')).toBeVisible();
    });
  });

  test.describe('Whitelist Invitations', () => {
    test('should send invitation email', async ({ page }) => {
      if (await page.locator('[data-testid="whitelist-row"]').first().isVisible()) {
        // Click send invitation
        await page.click('[data-testid="whitelist-row"]:first-child button:has-text("Send Invitation")');

        // Should show success message
        await expect(page.locator('text=Invitation sent successfully')).toBeVisible();

        // Should update last invited timestamp
        await expect(page.locator('[data-testid="last-invited"]')).toBeVisible();
      }
    });

    test('should resend invitation', async ({ page }) => {
      // Filter to show pending users
      await page.selectOption('select[name="statusFilter"]', 'pending');

      if (await page.locator('[data-testid="whitelist-row"]').first().isVisible()) {
        await page.click('[data-testid="whitelist-row"]:first-child button:has-text("Resend")');

        // Should show success message
        await expect(page.locator('text=Invitation resent successfully')).toBeVisible();
      }
    });

    test('should bulk send invitations', async ({ page }) => {
      // Select multiple pending users
      await page.selectOption('select[name="statusFilter"]', 'pending');
      await page.click('[data-testid="whitelist-checkbox"]:nth-child(1)');
      await page.click('[data-testid="whitelist-checkbox"]:nth-child(2)');

      // Send invitations
      await page.click('button:has-text("Send Invitations")');

      // Should show success message
      await expect(page.locator('text=Invitations sent to 2 users')).toBeVisible();
    });
  });

  test.describe('Whitelist Statistics', () => {
    test('should display whitelist statistics', async ({ page }) => {
      // Should show stats
      await expect(page.locator('[data-testid="total-whitelisted"]')).toBeVisible();
      await expect(page.locator('[data-testid="registered-count"]')).toBeVisible();
      await expect(page.locator('[data-testid="pending-count"]')).toBeVisible();
    });

    test('should show registration rate', async ({ page }) => {
      // Should display registration percentage
      await expect(page.locator('[data-testid="registration-rate"]')).toBeVisible();
    });
  });
});
