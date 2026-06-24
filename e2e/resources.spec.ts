import { test, expect } from '@playwright/test';

test.describe('Resources Page', () => {
  test('should load resources page', async ({ page }) => {
    await page.goto('/resources');
    await expect(page.getByText('Recursos').first()).toBeVisible();
  });

  test('should have link to changelog', async ({ page }) => {
    await page.goto('/resources');
    const changelogLink = page.getByText('Changelog');
    await expect(changelogLink).toBeVisible();
  });

  test('should have link to FAQ', async ({ page }) => {
    await page.goto('/resources');
    const faqLink = page.getByText('FAQs');
    await expect(faqLink).toBeVisible();
  });

  test('should have link to report bug', async ({ page }) => {
    await page.goto('/resources');
    const reportLink = page.getByText('Reportar un problema');
    await expect(reportLink).toBeVisible();
  });
});
