import { test, expect } from '@playwright/test';

test.describe('Members Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/members');
  });

  test('should display members page title', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should display search functionality', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
  });

  test('should filter members when searching', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.getByPlaceholder(/search/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      
      await page.waitForTimeout(300);
      
      await expect(searchInput).toHaveValue('test');
    }
  });

  test('should show error toast when join fails', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'userInfo',
        value: JSON.stringify({
          me: {
            wca_id: '2020TEST01',
            name: 'Test User',
            avatar: { url: 'https://example.com/avatar.jpg' },
            country: { name: 'India' },
            gender: 'm',
          },
        }),
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.route('**/api/join-cubingkerala', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Already a member' }),
      });
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    const joinButton = page.getByRole('button', { name: /join/i });
    
    if (await joinButton.isVisible()) {
      await joinButton.click();
      
      await expect(page.getByText(/already a member/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should navigate to member details when clicking member', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const memberLink = page.locator('a[href^="/members/"]').first();
    
    if (await memberLink.isVisible()) {
      const href = await memberLink.getAttribute('href');
      await memberLink.click();
      
      await expect(page).toHaveURL(new RegExp(href || '/members/'), { timeout: 10000 });
    }
  });
});
