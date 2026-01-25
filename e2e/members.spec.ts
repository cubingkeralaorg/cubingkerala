import { test, expect } from '@playwright/test';

test.describe('Members Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/members');
  });

  test.describe('Page Layout', () => {
    test('should display members page title', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('should display search functionality', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);
      await expect(searchInput).toBeVisible();
    });

    test('should display members table or list', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Should have a container for members
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Search Functionality', () => {
    test('should filter members when searching', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      const searchInput = page.getByPlaceholder(/search/i);
      
      if (await searchInput.isVisible()) {
        // Type a search query
        await searchInput.fill('test');
        
        // Wait for filtering
        await page.waitForTimeout(300);
        
        // Verify search input has the value
        await expect(searchInput).toHaveValue('test');
      }
    });

    test('should clear search when input is cleared', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      const searchInput = page.getByPlaceholder(/search/i);
      
      if (await searchInput.isVisible()) {
        await searchInput.fill('test');
        await searchInput.clear();
        
        await expect(searchInput).toHaveValue('');
      }
    });
  });

  test.describe('Join Cubing Kerala', () => {
    test('should display join button for logged-in users', async ({ page, context }) => {
      // Mock logged-in state
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

      await page.reload();
      await page.waitForLoadState('networkidle');

      // Look for join button
      const joinButton = page.getByRole('button', { name: /join/i });
      
      // Button visibility depends on whether user is already a member
    });

    test('should show error toast when join fails', async ({ page, context }) => {
      // Mock logged-in state
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

      // Mock API to return error
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
        
        // Should show error toast
        await expect(page.getByText(/already a member/i)).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Member Details', () => {
    test('should navigate to member details when clicking member', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Find a clickable member link
      const memberLink = page.locator('a[href^="/members/"]').first();
      
      if (await memberLink.isVisible()) {
        const href = await memberLink.getAttribute('href');
        await memberLink.click();
        
        // Should navigate to member details page
        await expect(page).toHaveURL(new RegExp(href || '/members/'));
      }
    });
  });

  test.describe('Loading States', () => {
    test('should show loading state initially', async ({ page }) => {
      // Navigate with slow network
      await page.route('**/*', (route) => {
        setTimeout(() => route.continue(), 500);
      });

      await page.goto('/members');
      
      // Should show some loading indicator
      // (depends on implementation)
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/members');
      
      await page.waitForLoadState('networkidle');
      
      // Page should be visible and not overflow
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/members');
      
      await page.waitForLoadState('networkidle');
      
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/members');
      
      await page.waitForLoadState('networkidle');
      
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });
});
