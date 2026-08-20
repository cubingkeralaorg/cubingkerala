import { test, expect } from '@playwright/test';

test.describe('UI Regression Coverage', () => {
  test('competitions refresh shows spinner without table', async ({ page }) => {
    await page.route('**/api/get-competitions**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          upcomingCompetitions: [],
          pastCompetitions: [],
          lastFetch: Date.now(),
        }),
      });
    });

    await page.goto('/competitions');
    await expect(page.getByRole('heading', { name: 'Competitions' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible({
      timeout: 15_000,
    });
    await page.getByRole('button', { name: 'Refresh' }).click();

    await expect(page.getByText('Fetching competitions...')).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole('status', { name: /loading/i })).toBeVisible();
    await expect(page.getByPlaceholder(/search competitions/i)).toHaveCount(0);
    await expect(page.locator('table')).toHaveCount(0);
  });

  test('footer desktop alignment keeps wordmark and nav on one row', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const footer = page.locator('footer').filter({ hasText: /all rights reserved\./i }).first();
    const wordmark = footer.getByRole('link', { name: 'Cubing Kerala' });
    const competitionsLink = footer
      .getByRole('navigation', { name: 'Footer' })
      .getByRole('link', { name: 'Competitions' });
    const github = footer.getByRole('button', { name: /open github/i });

    await expect(wordmark).toBeVisible();
    await expect(competitionsLink).toBeVisible();
    await expect(github).toBeVisible();

    const [wordmarkBox, linkBox, githubBox] = await Promise.all([
      wordmark.boundingBox(),
      competitionsLink.boundingBox(),
      github.boundingBox(),
    ]);

    expect(wordmarkBox).not.toBeNull();
    expect(linkBox).not.toBeNull();
    expect(githubBox).not.toBeNull();

    if (wordmarkBox && linkBox && githubBox) {
      expect(Math.abs(wordmarkBox.y - linkBox.y)).toBeLessThan(24);
      expect(linkBox.x).toBeGreaterThan(wordmarkBox.x);
      expect(githubBox.x).toBeGreaterThan(linkBox.x);
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
    await expect(page.getByRole('button', { name: /close menu/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /mobile menu/i })).toBeVisible();

    const scrollAfter = await page.evaluate(() => window.scrollY);

    expect(scrollAfter).toBe(scrollBefore);
  });
});
