import { test, expect } from '@playwright/test';
import { TEST_USERS, generateTestChild } from '../fixtures/test-data';
import { signIn, waitForDashboard } from '../fixtures/helpers';

test.describe('Child Management', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as parent before each test
    await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
    await waitForDashboard(page);
  });

  test.describe('Adding a New Child', () => {
    test('should navigate to add child page', async ({ page }) => {
      await page.click('text=Children');
      await expect(page).toHaveURL(/\/dashboard\/children/);

      await page.click('text=Add Child');
      await expect(page.locator('h1:has-text("Add Child")')).toBeVisible();
    });

    test('should add a new child with valid data', async ({ page }) => {
      const testChild = generateTestChild();

      await page.click('text=Children');
      await page.click('text=Add Child');

      // Fill form
      await page.fill('input[name="name"]', testChild.name);
      await page.fill('input[name="dateOfBirth"]', testChild.dateOfBirth);
      await page.selectOption('select[name="gender"]', testChild.gender);
      await page.fill('input[name="bloodGroup"]', testChild.bloodGroup || '');

      // Submit
      await page.click('button[type="submit"]');

      // Should redirect to children list
      await expect(page).toHaveURL(/\/dashboard\/children/);

      // Should show success message
      await expect(page.locator('text=Child added successfully')).toBeVisible();

      // Should display new child in list
      await expect(page.locator(`text=${testChild.name}`)).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.click('text=Children');
      await page.click('text=Add Child');

      // Try to submit without filling required fields
      await page.click('button[type="submit"]');

      // Should show validation errors
      await expect(page.locator('text=Name is required')).toBeVisible();
      await expect(page.locator('text=Date of birth is required')).toBeVisible();
    });

    test('should validate date of birth is not in future', async ({ page }) => {
      await page.click('text=Children');
      await page.click('text=Add Child');

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      await page.fill('input[name="name"]', 'Test Child');
      await page.fill('input[name="dateOfBirth"]', futureDateStr);
      await page.selectOption('select[name="gender"]', 'male');

      await page.click('button[type="submit"]');

      // Should show validation error
      await expect(page.locator('text=Date of birth cannot be in the future')).toBeVisible();
    });
  });

  test.describe('Viewing Child Details', () => {
    test('should display child list', async ({ page }) => {
      await page.click('text=Children');
      await expect(page).toHaveURL(/\/dashboard\/children/);

      // Should show children list
      await expect(page.locator('[data-testid="child-list"]')).toBeVisible();
    });

    test('should view child details', async ({ page }) => {
      await page.click('text=Children');

      // Click on first child
      await page.click('[data-testid="child-card"]:first-child');

      // Should navigate to child details
      await expect(page).toHaveURL(/\/dashboard\/children\/[a-z0-9-]+/);

      // Should display child information
      await expect(page.locator('[data-testid="child-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="child-age"]')).toBeVisible();
      await expect(page.locator('[data-testid="child-gender"]')).toBeVisible();
    });

    test('should display health metrics', async ({ page }) => {
      await page.click('text=Children');
      await page.click('[data-testid="child-card"]:first-child');

      // Should show health metrics section
      await expect(page.locator('text=Health Metrics')).toBeVisible();
      await expect(page.locator('[data-testid="height-metric"]')).toBeVisible();
      await expect(page.locator('[data-testid="weight-metric"]')).toBeVisible();
    });
  });

  test.describe('Editing Child Profile', () => {
    test('should navigate to edit page', async ({ page }) => {
      await page.click('text=Children');
      await page.click('[data-testid="child-card"]:first-child');

      await page.click('text=Edit Profile');

      // Should show edit form
      await expect(page.locator('h1:has-text("Edit Child")')).toBeVisible();
    });

    test('should update child information', async ({ page }) => {
      await page.click('text=Children');
      await page.click('[data-testid="child-card"]:first-child');
      await page.click('text=Edit Profile');

      // Update name
      const newName = 'Updated Child Name';
      await page.fill('input[name="name"]', newName);

      // Update blood group
      await page.fill('input[name="bloodGroup"]', 'O+');

      // Submit
      await page.click('button[type="submit"]');

      // Should show success message
      await expect(page.locator('text=Child updated successfully')).toBeVisible();

      // Should display updated information
      await expect(page.locator(`text=${newName}`)).toBeVisible();
      await expect(page.locator('text=O+')).toBeVisible();
    });

    test('should update health metrics', async ({ page }) => {
      await page.click('text=Children');
      await page.click('[data-testid="child-card"]:first-child');
      await page.click('text=Edit Profile');

      // Update health metrics
      await page.fill('input[name="height"]', '120');
      await page.fill('input[name="weight"]', '25');

      await page.click('button[type="submit"]');

      // Should show success message
      await expect(page.locator('text=Child updated successfully')).toBeVisible();

      // Should display updated metrics
      await expect(page.locator('text=120 cm')).toBeVisible();
      await expect(page.locator('text=25 kg')).toBeVisible();
    });

    test('should add allergies', async ({ page }) => {
      await page.click('text=Children');
      await page.click('[data-testid="child-card"]:first-child');
      await page.click('text=Edit Profile');

      // Add allergy
      await page.fill('input[name="allergies"]', 'Peanuts, Dairy');

      await page.click('button[type="submit"]');

      // Should show success message
      await expect(page.locator('text=Child updated successfully')).toBeVisible();

      // Should display allergies
      await expect(page.locator('text=Peanuts')).toBeVisible();
      await expect(page.locator('text=Dairy')).toBeVisible();
    });
  });

  test.describe('Child List Display', () => {
    test('should show all children', async ({ page }) => {
      await page.click('text=Children');

      // Should display multiple children if they exist
      const childCards = page.locator('[data-testid="child-card"]');
      await expect(childCards.first()).toBeVisible();
    });

    test('should show child age correctly', async ({ page }) => {
      await page.click('text=Children');

      // Should calculate and display age
      await expect(page.locator('[data-testid="child-age"]').first()).toBeVisible();
    });

    test('should show empty state when no children', async ({ page, context }) => {
      // Sign in as a new parent with no children
      await page.context().clearCookies();
      await signIn(page, TEST_USERS.newParent.email, TEST_USERS.newParent.password);
      await waitForDashboard(page);

      await page.click('text=Children');

      // Should show empty state
      await expect(page.locator('text=No children added yet')).toBeVisible();
      await expect(page.locator('text=Add your first child')).toBeVisible();
    });

    test('should filter children by name', async ({ page }) => {
      await page.click('text=Children');

      // Type in search box
      await page.fill('input[placeholder="Search children"]', 'Test');

      // Should filter results
      const visibleChildren = page.locator('[data-testid="child-card"]:visible');
      await expect(visibleChildren.first()).toBeVisible();
    });
  });

  test.describe('Child Profile Navigation', () => {
    test('should navigate between child profiles', async ({ page }) => {
      await page.click('text=Children');

      // Click first child
      await page.click('[data-testid="child-card"]:first-child');
      const firstChildUrl = page.url();

      // Go back to list
      await page.click('text=Back to Children');
      await expect(page).toHaveURL(/\/dashboard\/children$/);

      // Click second child
      await page.click('[data-testid="child-card"]:nth-child(2)');
      const secondChildUrl = page.url();

      // URLs should be different
      expect(firstChildUrl).not.toBe(secondChildUrl);
    });

    test('should show breadcrumb navigation', async ({ page }) => {
      await page.click('text=Children');
      await page.click('[data-testid="child-card"]:first-child');

      // Should show breadcrumbs
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=Children')).toBeVisible();
    });
  });
});
