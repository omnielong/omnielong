import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/login|accesso/i);
  });

  test('should login with valid PIN', async ({ page }) => {
    // Assuming there's a PIN input
    const pinInput = page.locator('input[type="password"], input[type="text"]').first();
    await pinInput.fill('1234');

    const loginButton = page.locator('button').filter({ hasText: /accedi|login|entra/i }).first();
    await loginButton.click();

    // Should redirect to dashboard or POS
    await expect(page).toHaveURL(/\/(dashboard|pos|role-selection)/);
  });

  test('should show error with invalid PIN', async ({ page }) => {
    const pinInput = page.locator('input[type="password"], input[type="text"]').first();
    await pinInput.fill('0000');

    const loginButton = page.locator('button').filter({ hasText: /accedi|login|entra/i }).first();
    await loginButton.click();

    // Should show error message
    await expect(page.locator('text=/errore|pin non valido|credenziali/i')).toBeVisible();
  });

  test('should allow logout', async ({ page }) => {
    // Login first
    const pinInput = page.locator('input[type="password"], input[type="text"]').first();
    await pinInput.fill('1234');

    const loginButton = page.locator('button').filter({ hasText: /accedi|login|entra/i }).first();
    await loginButton.click();

    await page.waitForURL(/\/(dashboard|pos|role-selection)/);

    // Find and click logout button
    const logoutButton = page.locator('button, a').filter({ hasText: /esci|logout/i }).first();
    await logoutButton.click();

    // Should return to login
    await expect(page).toHaveURL('/');
  });
});

test.describe('Role-based Access', () => {
  test('should restrict access to admin pages for non-admin users', async ({ page }) => {
    // Login as cashier (PIN: 5678)
    await page.goto('/');
    const pinInput = page.locator('input[type="password"], input[type="text"]').first();
    await pinInput.fill('5678');

    const loginButton = page.locator('button').filter({ hasText: /accedi|login|entra/i }).first();
    await loginButton.click();

    await page.waitForURL(/\/(dashboard|pos|role-selection)/);

    // Try to access operators management (admin only)
    await page.goto('/operators');

    // Should show access denied or redirect
    await expect(
      page.locator('text=/accesso negato|non autorizzato|permessi/i')
    ).toBeVisible();
  });
});
