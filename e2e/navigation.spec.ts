import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to all main pages', async ({ page }) => {
    await page.goto('/');

    const routes = [
      { path: '/competitions', title: /competition/i },
      { path: '/members', title: /member/i },
      { path: '/rankings', title: /ranking/i },
      { path: '/learn', title: /learn/i },
    ];

    for (const route of routes) {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toBeVisible();
      expect(page.url()).toContain(route.path);
    }
  });

  test('should return to home when clicking logo', async ({ page }) => {
    await page.goto('/competitions');
    
    const logoLink = page.locator('a[href="/"]').first();
    
    if (await logoLink.isVisible()) {
      await logoLink.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('should show mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const menuButton = page.getByRole('button', { name: /menu/i });
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      
      const mobileMenu = page.getByRole('navigation', { name: /mobile menu/i });
      await expect(mobileMenu).toBeVisible();
    }
  });
});

test.describe('Home Page', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });
});

test.describe('Competitions Page', () => {
  test('should navigate to competition details', async ({ page }) => {
    await page.goto('/competitions');
    await page.waitForLoadState('networkidle');

    const compLink = page.locator('a[href^="/competitions/"]').first();
    
    if (await compLink.isVisible()) {
      await compLink.click();
      
      await expect(page).toHaveURL(/\/competitions\/.+/);
    }
  });
});

test.describe('Performance', () => {
  test('should have no console errors on page load', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('third-party') &&
        !error.includes('hydrat') &&
        !error.includes('Failed to load resource') &&
        !error.includes('ERR_BLOCKED_BY_CLIENT') &&
        !error.includes('googletagmanager') &&
        !error.includes('analytics') &&
        !error.includes('gtag') &&
        !error.includes('Extra attributes from the server') &&
        !error.includes('Warning:')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Accessibility', () => {
  test('should have alt text on images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt !== null).toBeTruthy();
    }
  });
});
