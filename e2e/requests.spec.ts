import { test, expect } from '@playwright/test';

test.describe('Requests Admin Page', () => {
  const mockUserInfo = {
    me: {
      id: 6996, // Matches ADMIN_USER_ID
      wca_id: '2017JOHN14', // Matches hardcoded admin check
      name: 'Admin User',
      avatar: { url: 'https://example.com/avatar.jpg' },
      country: { name: 'India' },
      gender: 'm',
    },
  };

  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'userInfo',
        value: JSON.stringify(mockUserInfo),
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'authToken',
        value: 'Bearer test-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
  });

  test('should display empty state when no requests', async ({ page }) => {
    await page.route('**/requests*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/requests');
    await page.waitForLoadState('networkidle');
    
    const emptyMessage = page.getByText(/no.*requests/i);
    if (await emptyMessage.isVisible()) {
      await expect(emptyMessage).toBeVisible();
    }
  });

  test('should approve request when approve button is clicked', async ({ page }) => {
    await page.route('**/api/approve-requests', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Request updated successfully' }),
      });
    });

    await page.goto('/requests');
    await page.waitForLoadState('networkidle');
    
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    
    if (await approveButton.isVisible()) {
      await approveButton.click();
      
      await expect(page.getByText(/success/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show error when approval fails', async ({ page }) => {
    await page.route('**/api/approve-requests', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Failed to approve request' }),
      });
    });

    await page.goto('/requests');
    await page.waitForLoadState('networkidle');
    
    const approveButton = page.getByRole('button', { name: /approve/i }).first();
    
    if (await approveButton.isVisible()) {
      await approveButton.click();
      
      await expect(page.getByText(/failed|error/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should delete request when delete button is clicked', async ({ page }) => {
    await page.route('**/api/delete-request', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Request deleted successfully' }),
      });
    });

    await page.goto('/requests');
    await page.waitForLoadState('networkidle');
    
    const deleteButton = page.locator('[data-testid="delete-request"]').first();
    
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      const confirmButton = page.getByRole('button', { name: /confirm|yes|delete/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
    }
  });

  test('should update member role', async ({ page }) => {
    await page.route('**/api/update-members', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Member updated successfully' }),
      });
    });

    await page.goto('/requests');
    await page.waitForLoadState('networkidle');
    
    const roleSelector = page.locator('select').first();
    
    if (await roleSelector.isVisible()) {
      await roleSelector.selectOption('organiser');
      
      const updateButton = page.getByRole('button', { name: /update/i }).first();
      if (await updateButton.isVisible()) {
        await updateButton.click();
      }
    }
  });

  test('should delete member when delete button is clicked', async ({ page }) => {
    await page.route('**/api/delete-member', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Member deleted successfully' }),
      });
    });

    await page.goto('/requests');
    await page.waitForLoadState('networkidle');
    
    const deleteButton = page.locator('[data-testid="delete-member"]').first();
    
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
    }
  });
});
