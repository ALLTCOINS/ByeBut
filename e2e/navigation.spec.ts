import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should have working back button on downloads page', async ({ page }) => {
    await page.goto('/downloads');
    const backButton = page.getByText('Volver al inicio');
    await backButton.click();
    await expect(page).toHaveURL('/');
  });

  test('should have working back button on terms page', async ({ page }) => {
    await page.goto('/terminos');
    const backButton = page.getByText('Volver al inicio');
    await backButton.click();
    await expect(page).toHaveURL('/');
  });
});
