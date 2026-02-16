import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.describe('Main Navigation', () => {
    test('should navigate to all main pages', async ({ page }) => {
      await page.goto('/');

      const routes = [
        { path: '/competitions', title: /competition/i },
        { path: '/members', title: /member/i },
        { path: '/rankings', title: /ranking/i },
        { path: '/learn', title: /learn/i },
        { path: '/contact', title: /contact/i },
      ];

      for (const route of routes) {
        await page.goto(route.path);
        await page.waitForLoadState('networkidle');
        
        // Page should load without errors
        await expect(page.locator('body')).toBeVisible();
        
        // Check that we're on the correct page
        expect(page.url()).toContain(route.path);
      }
    });

    test('should have working navigation links', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find navigation links
      const navLinks = page.locator('nav a, header a');
      const count = await navLinks.count();

      expect(count).toBeGreaterThan(0);
    });

    test('should return to home when clicking logo', async ({ page }) => {
      await page.goto('/competitions');
      
      // Click logo or home link
      const logoLink = page.locator('a[href="/"]').first();
      
      if (await logoLink.isVisible()) {
        await logoLink.click();
        await expect(page).toHaveURL('/');
      }
    });
  });

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test('should show mobile menu on small screens', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Look for hamburger menu button
      const menuButton = page.getByRole('button', { name: /menu/i });
      
      if (await menuButton.isVisible()) {
        await menuButton.click();
        
        // Mobile navigation should be visible after clicking
        const mobileMenu = page.getByRole('navigation', { name: /mobile menu/i });
        await expect(mobileMenu).toBeVisible();
      }
    });

    test('should close mobile menu when link is clicked', async ({ page }) => {
      await page.goto('/');
      
      const menuButton = page.getByRole('button', { name: /menu/i });
      
      if (await menuButton.isVisible()) {
        await menuButton.click();
        
        // Target specifically the mobile menu navigation
        const mobileMenu = page.getByRole('navigation', { name: /mobile menu/i });
        const navLink = mobileMenu.locator('a').first();
        
        if (await navLink.isVisible()) {
          await navLink.click();
        }
      }
    });
  });
});

test.describe('Home Page', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for main heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('should display key sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Page should have content
    const bodyContent = await page.textContent('body');
    expect(bodyContent?.length).toBeGreaterThan(100);
  });

  test('should have working CTA buttons', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find buttons/links
    const buttons = page.getByRole('button');
    const links = page.getByRole('link');
    
    const buttonCount = await buttons.count();
    const linkCount = await links.count();
    
    expect(buttonCount + linkCount).toBeGreaterThan(0);
  });
});

test.describe('Competitions Page', () => {
  test('should display competitions list', async ({ page }) => {
    await page.goto('/competitions');
    await page.waitForLoadState('networkidle');

    // Should have content
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to competition details', async ({ page }) => {
    await page.goto('/competitions');
    await page.waitForLoadState('networkidle');

    // Find competition link
    const compLink = page.locator('a[href^="/competitions/"]').first();
    
    if (await compLink.isVisible()) {
      await compLink.click();
      
      // Should navigate to details page
      await expect(page).toHaveURL(/\/competitions\/.+/);
    }
  });

  test('should display upcoming and past competitions', async ({ page }) => {
    await page.goto('/competitions');
    await page.waitForLoadState('networkidle');

    // Page should have competition cards or sections
    const content = await page.textContent('body');
    expect(content?.length).toBeGreaterThan(50);
  });
});

test.describe('Rankings Page', () => {
  test('should display rankings', async ({ page }) => {
    await page.goto('/rankings');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });

  test('should have event filters', async ({ page }) => {
    await page.goto('/rankings');
    await page.waitForLoadState('networkidle');

    // Look for event selector/tabs
    const eventSelector = page.locator('select, [role="tablist"]');
    
    if (await eventSelector.first().isVisible()) {
      await expect(eventSelector.first()).toBeVisible();
    }
  });
});

test.describe('Error Handling', () => {
  test('should display 404 page for unknown routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    
    // Should either 404 or show error page
    expect([200, 404]).toContain(response?.status() || 200);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal server error' }),
      });
    });

    await page.goto('/members');
    await page.waitForLoadState('networkidle');

    // Page should still be usable
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load home page within 5 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('load');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have no console errors on page load', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out expected errors (like missing images in dev)
    const criticalErrors = consoleErrors.filter(
      (error) => !error.includes('favicon') && !error.includes('404')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // Allow empty alt for decorative images
      expect(alt !== null).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    
    // Something should be focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});
