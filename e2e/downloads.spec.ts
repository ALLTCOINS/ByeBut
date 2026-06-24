import { test, expect } from '@playwright/test';

test.describe('Downloads Page', () => {
  test('should load downloads page', async ({ page }) => {
    await page.goto('/downloads');
    // Just verify page loads without redirect
    await expect(page).toHaveURL('/downloads');
  });

  test('should show Windows download card', async ({ page }) => {
    await page.goto('/downloads');
    await expect(page.getByText('Windows').first()).toBeVisible();
  });

  test('should show macOS download card', async ({ page }) => {
    await page.goto('/downloads');
    await expect(page.getByText('macOS').first()).toBeVisible();
  });

  test('should show Linux download card', async ({ page }) => {
    await page.goto('/downloads');
    await expect(page.getByText('Linux').first()).toBeVisible();
  });

  test('should have silent installation section', async ({ page }) => {
    await page.goto('/downloads');
    await expect(page.getByText('Instalación silenciosa').first()).toBeVisible();
  });

  test('should have hash verification section', async ({ page }) => {
    await page.goto('/downloads');
    await expect(page.getByText('Verificación de integridad')).toBeVisible();
  });
});
