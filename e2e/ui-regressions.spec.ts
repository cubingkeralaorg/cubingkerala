import { test, expect } from '@playwright/test';

test.describe('UI Regression Coverage', () => {
  test('competitions loader uses full viewport height', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('competitions');
    });

    await page.route('**/api/get-competitions**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          upcomingCompetitions: [],
          pastCompetitions: [],
        }),
      });
    });

    await page.goto('/competitions');

    const loadingGraphic = page.locator('div[class*="w-[150px]"]').first();
    await expect(loadingGraphic).toBeVisible();

    const loaderContainer = page
      .locator('div.min-h-screen')
      .filter({ has: loadingGraphic })
      .first();

    await expect(loaderContainer).toBeVisible();

    const [viewportHeight, minHeight] = await Promise.all([
      page.evaluate(() => window.innerHeight),
      loaderContainer.evaluate((el) => parseFloat(getComputedStyle(el).minHeight)),
    ]);

    expect(minHeight).toBeGreaterThanOrEqual(viewportHeight - 1);
  });

  test('footer desktop alignment keeps logo and nav row balanced', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const footer = page.locator('footer').filter({ hasText: /all rights reserved\./i }).first();
    const logo = footer.locator('img[alt="Cubing Kerala Logo"]').first();
    const competitionsLink = footer.getByRole('link', { name: 'Competitions' }).first();

    await expect(logo).toBeVisible();
    await expect(competitionsLink).toBeVisible();

    const [logoBox, linkBox] = await Promise.all([
      logo.boundingBox(),
      competitionsLink.boundingBox(),
    ]);

    expect(logoBox).not.toBeNull();
    expect(linkBox).not.toBeNull();

    if (logoBox && linkBox) {
      expect(Math.abs(logoBox.y - linkBox.y)).toBeLessThan(24);
      expect(linkBox.x).toBeGreaterThan(logoBox.x + 200);
    }
  });

  test('mobile menu open does not shift background scroll position', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    const menuButton = page.getByRole('button', { name: /open menu/i });
    await expect(menuButton).toBeVisible();

    const scrollBefore = await page.evaluate(() => window.scrollY);

    await menuButton.click();
    await expect(page.getByRole('navigation', { name: /mobile menu/i })).toBeVisible();

    const [scrollAfter, bodyPosition] = await Promise.all([
      page.evaluate(() => window.scrollY),
      page.evaluate(() => getComputedStyle(document.body).position),
    ]);

    expect(scrollAfter).toBe(scrollBefore);
    expect(bodyPosition).toBe('fixed');
  });
});
