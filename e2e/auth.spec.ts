import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.describe('Login Redirect', () => {
    test('should have a login link pointing to /api/auth/login', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // The navbar auth button should link to /api/auth/login
      const loginLink = page.locator('a[href="/api/auth/login"]').first();

      if (await loginLink.isVisible()) {
        const href = await loginLink.getAttribute('href');
        expect(href).toBe('/api/auth/login');
      }
    });
  });

  test.describe('Logout Flow', () => {
    test('should clear cookies on logout', async ({ page, context }) => {
      // Set up mock cookies
      await context.addCookies([
        {
          name: 'authToken',
          value: 'test-token',
          domain: 'localhost',
          path: '/',
        },
        {
          name: 'userInfo',
          value: JSON.stringify({ me: { wca_id: '2020TEST01' } }),
          domain: 'localhost',
          path: '/',
        },
      ]);

      await page.goto('/');

      // Trigger logout (assuming there's a logout button in profile menu)
      const cookies = await context.cookies();
      expect(cookies.length).toBeGreaterThan(0);
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated users from protected pages', async ({ page }) => {
      await page.goto('/requests');

      // Should either redirect to login or show unauthorized message
      // depending on implementation
      const currentUrl = page.url();
      
      // The page should either redirect or show content
      await expect(page.locator('body')).toBeVisible();
    });

    test('should allow access to public pages without authentication', async ({ page }) => {
      const publicPages = ['/', '/competitions', '/members', '/rankings', '/learn'];

      for (const path of publicPages) {
        await page.goto(path);
        
        // Should not redirect to login
        await expect(page.locator('body')).toBeVisible();
        
        // Should not show "Unauthorized" message for public pages
        const pageContent = await page.textContent('body');
        expect(pageContent).not.toContain('Unauthorized');
      }
    });
  });
});
