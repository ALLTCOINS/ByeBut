import { test as base } from '@playwright/test';

// Extend base test with authentication fixture
export const test = base.extend<{
  authenticatedPage: typeof base.prototype.page;
}>({
  authenticatedPage: async ({ page }, use) => {
    // Mock authentication by setting localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'test-token',
        refresh_token: 'test-refresh',
        user: { id: 'test-user-id', email: 'test@example.com' }
      }));
    });
    await use(page);
  },
});

export const expect = base.expect;
