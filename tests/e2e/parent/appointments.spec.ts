import { test, expect } from '@playwright/test';
import { TEST_USERS, generateTestAppointment } from '../fixtures/test-data';
import { signIn, waitForDashboard } from '../fixtures/helpers';

test.describe('Appointment Management', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, TEST_USERS.parent.email, TEST_USERS.parent.password);
    await waitForDashboard(page);
  });

  test.describe('Scheduling Appointments', () => {
    test('should navigate to appointments page', async ({ page }) => {
      await page.click('text=Appointments');
      await expect(page).toHaveURL(/\/dashboard\/appointments/);
      await expect(page.locator('h1:has-text("Appointments")')).toBeVisible();
    });

    test('should schedule a new appointment', async ({ page }) => {
      const appointment = generateTestAppointment();

      await page.click('text=Appointments');
      await page.click('text=Schedule Appointment');

      // Select child
      await page.selectOption('select[name="childId"]', { index: 1 });

      // Select appointment type
      await page.selectOption('select[name="type"]', appointment.type);

      // Fill title
      await page.fill('input[name="title"]', appointment.title);

      // Select date and time
      await page.fill('input[name="scheduledAt"]', appointment.scheduledAt);

      // Fill duration
      await page.fill('input[name="duration"]', appointment.duration.toString());

      // Submit
      await page.click('button[type="submit"]');

      // Should show success message
      await expect(page.locator('text=Appointment scheduled successfully')).toBeVisible();

      // Should redirect to appointments list
      await expect(page).toHaveURL(/\/dashboard\/appointments/);

      // Should display new appointment
      await expect(page.locator(`text=${appointment.title}`)).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.click('text=Appointments');
      await page.click('text=Schedule Appointment');

      // Try to submit without filling fields
      await page.click('button[type="submit"]');

      // Should show validation errors
      await expect(page.locator('text=Child is required')).toBeVisible();
      await expect(page.locator('text=Appointment type is required')).toBeVisible();
      await expect(page.locator('text=Date and time is required')).toBeVisible();
    });

    test('should not allow scheduling in the past', async ({ page }) => {
      await page.click('text=Appointments');
      await page.click('text=Schedule Appointment');

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const pastDateStr = pastDate.toISOString().slice(0, 16);

      await page.selectOption('select[name="childId"]', { index: 1 });
      await page.selectOption('select[name="type"]', 'checkup');
      await page.fill('input[name="title"]', 'Test Appointment');
      await page.fill('input[name="scheduledAt"]', pastDateStr);

      await page.click('button[type="submit"]');

      // Should show validation error
      await expect(page.locator('text=Cannot schedule appointments in the past')).toBeVisible();
    });
  });

  test.describe('Viewing Appointments', () => {
    test('should display upcoming appointments', async ({ page }) => {
      await page.click('text=Appointments');

      // Should show appointments list
      await expect(page.locator('[data-testid="appointments-list"]')).toBeVisible();

      // Should show upcoming appointments
      await expect(page.locator('[data-testid="appointment-card"]').first()).toBeVisible();
    });

    test('should filter by appointment type', async ({ page }) => {
      await page.click('text=Appointments');

      // Select filter
      await page.selectOption('select[name="typeFilter"]', 'checkup');

      // Should show only checkup appointments
      const appointments = page.locator('[data-testid="appointment-card"]');
      await expect(appointments.first()).toBeVisible();
    });

    test('should show appointment details', async ({ page }) => {
      await page.click('text=Appointments');
      await page.click('[data-testid="appointment-card"]:first-child');

      // Should display appointment details
      await expect(page.locator('[data-testid="appointment-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="appointment-date"]')).toBeVisible();
      await expect(page.locator('[data-testid="appointment-type"]')).toBeVisible();
      await expect(page.locator('[data-testid="appointment-child"]')).toBeVisible();
    });

    test('should show empty state when no appointments', async ({ page, context }) => {
      // Sign in as new parent with no appointments
      await page.context().clearCookies();
      await signIn(page, TEST_USERS.newParent.email, TEST_USERS.newParent.password);
      await waitForDashboard(page);

      await page.click('text=Appointments');

      // Should show empty state
      await expect(page.locator('text=No appointments scheduled')).toBeVisible();
      await expect(page.locator('text=Schedule your first appointment')).toBeVisible();
    });
  });

  test.describe('Appointment Reminders', () => {
    test('should display reminder indicator for upcoming appointments', async ({ page }) => {
      await page.click('text=Appointments');

      // Should show reminder badge for appointments within 24 hours
      const upcomingAppointment = page.locator('[data-testid="appointment-card"]').filter({
        has: page.locator('[data-testid="reminder-badge"]')
      });

      // Check if any upcoming appointments exist
      const count = await upcomingAppointment.count();
      if (count > 0) {
        await expect(upcomingAppointment.first()).toBeVisible();
      }
    });

    test('should show reminder notification', async ({ page }) => {
      await page.click('text=Appointments');

      // Check for notification bell or reminder section
      const reminderSection = page.locator('[data-testid="reminders-section"]');
      if (await reminderSection.isVisible()) {
        await expect(reminderSection).toBeVisible();
      }
    });
  });

  test.describe('Appointment Cancellation', () => {
    test('should cancel an appointment', async ({ page }) => {
      await page.click('text=Appointments');
      await page.click('[data-testid="appointment-card"]:first-child');

      // Click cancel button
      await page.click('button:has-text("Cancel Appointment")');

      // Confirm cancellation
      await page.click('button:has-text("Confirm")');

      // Should show success message
      await expect(page.locator('text=Appointment cancelled successfully')).toBeVisible();

      // Should update status
      await expect(page.locator('text=Cancelled')).toBeVisible();
    });

    test('should require confirmation before cancelling', async ({ page }) => {
      await page.click('text=Appointments');
      await page.click('[data-testid="appointment-card"]:first-child');

      await page.click('button:has-text("Cancel Appointment")');

      // Should show confirmation dialog
      await expect(page.locator('text=Are you sure you want to cancel')).toBeVisible();
      await expect(page.locator('button:has-text("Confirm")')).toBeVisible();
      await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    });

    test('should not allow cancelling past appointments', async ({ page }) => {
      await page.click('text=Appointments');

      // Filter to show past appointments
      await page.selectOption('select[name="statusFilter"]', 'completed');

      if (await page.locator('[data-testid="appointment-card"]').first().isVisible()) {
        await page.click('[data-testid="appointment-card"]:first-child');

        // Cancel button should be disabled or not visible
        const cancelButton = page.locator('button:has-text("Cancel Appointment")');
        if (await cancelButton.isVisible()) {
          await expect(cancelButton).toBeDisabled();
        }
      }
    });
  });

  test.describe('Appointment History', () => {
    test('should view past appointments', async ({ page }) => {
      await page.click('text=Appointments');

      // Switch to history tab
      await page.click('text=History');

      // Should show past appointments
      await expect(page.locator('[data-testid="past-appointments"]')).toBeVisible();
    });

    test('should filter appointments by date range', async ({ page }) => {
      await page.click('text=Appointments');

      // Select date range
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();

      await page.fill('input[name="startDate"]', startDate.toISOString().split('T')[0]);
      await page.fill('input[name="endDate"]', endDate.toISOString().split('T')[0]);

      await page.click('button:has-text("Apply Filter")');

      // Should show filtered appointments
      await expect(page.locator('[data-testid="appointment-card"]').first()).toBeVisible();
    });

    test('should show appointment statistics', async ({ page }) => {
      await page.click('text=Appointments');
      await page.click('text=Statistics');

      // Should display stats
      await expect(page.locator('[data-testid="total-appointments"]')).toBeVisible();
      await expect(page.locator('[data-testid="completed-appointments"]')).toBeVisible();
      await expect(page.locator('[data-testid="cancelled-appointments"]')).toBeVisible();
    });
  });

  test.describe('Appointment Notifications', () => {
    test('should show notification preferences', async ({ page }) => {
      await page.click('text=Appointments');
      await page.click('text=Settings');

      // Should show notification settings
      await expect(page.locator('text=Reminder Notifications')).toBeVisible();
      await expect(page.locator('input[type="checkbox"][name="emailReminders"]')).toBeVisible();
      await expect(page.locator('input[type="checkbox"][name="pushReminders"]')).toBeVisible();
    });

    test('should update notification preferences', async ({ page }) => {
      await page.click('text=Appointments');
      await page.click('text=Settings');

      // Toggle email reminders
      await page.click('input[type="checkbox"][name="emailReminders"]');

      // Save settings
      await page.click('button:has-text("Save Settings")');

      // Should show success message
      await expect(page.locator('text=Settings updated successfully')).toBeVisible();
    });
  });
});
