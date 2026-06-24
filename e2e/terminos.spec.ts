import { test, expect } from '@playwright/test';

test.describe('Terms Page', () => {
  test('should load terms page', async ({ page }) => {
    await page.goto('/terminos');
    await expect(page.getByText('Términos y Condiciones de Uso')).toBeVisible();
  });

  test('should have all required sections', async ({ page }) => {
    await page.goto('/terminos');
    await expect(page.getByText('1. Introducción')).toBeVisible();
    await expect(page.getByText('2. Lo que ByeBut NO es')).toBeVisible();
    await expect(page.getByText('9. Ley Aplicable')).toBeVisible();
  });

  test('should have legal disclaimer', async ({ page }) => {
    await page.goto('/terminos');
    await expect(page.getByText('Aviso Legal')).toBeVisible();
  });
});
