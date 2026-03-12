import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow access to public pages without authentication', async ({ page }) => {
    const publicPages = ['/', '/competitions', '/members', '/rankings', '/learn'];

    for (const path of publicPages) {
      await page.goto(path);
      
      await expect(page.locator('body')).toBeVisible();
      
      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('Unauthorized');
    }
  });
});
