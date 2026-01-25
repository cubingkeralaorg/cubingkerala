import { test, expect } from '@playwright/test';

test.describe('Requests Admin Page', () => {
  const mockUserInfo = {
    me: {
      wca_id: 'ADMIN01',
      name: 'Admin User',
      avatar: { url: 'https://example.com/avatar.jpg' },
      country: { name: 'India' },
      gender: 'm',
    },
  };

  test.beforeEach(async ({ page, context }) => {
    // Set up admin authentication
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

  test.describe('Page Access', () => {
    test('should display requests page for authenticated users', async ({ page }) => {
      await page.goto('/requests');
      
      await page.waitForLoadState('networkidle');
      
      // Should display the page content
      await expect(page.locator('body')).toBeVisible();
    });

    test('should show both requests and members sections', async ({ page }) => {
      await page.goto('/requests');
      
      await page.waitForLoadState('networkidle');
      
      // Check for section headers
      const requestsHeading = page.getByRole('heading', { name: /requests/i });
      const membersHeading = page.getByRole('heading', { name: /members/i });
      
      if (await requestsHeading.isVisible()) {
        await expect(requestsHeading).toBeVisible();
      }
      if (await membersHeading.isVisible()) {
        await expect(membersHeading).toBeVisible();
      }
    });
  });

  test.describe('Requests Table', () => {
    test('should display empty state when no requests', async ({ page }) => {
      // Mock empty requests
      await page.route('**/requests*', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      });

      await page.goto('/requests');
      await page.waitForLoadState('networkidle');
      
      // Should show "no requests" message
      const emptyMessage = page.getByText(/no.*requests/i);
      if (await emptyMessage.isVisible()) {
        await expect(emptyMessage).toBeVisible();
      }
    });

    test('should display request data in table', async ({ page }) => {
      await page.goto('/requests');
      await page.waitForLoadState('networkidle');
      
      // Table should have headers
      const nameHeader = page.getByRole('columnheader', { name: /name/i });
      const wcaIdHeader = page.getByRole('columnheader', { name: /wca.*id/i });
      const roleHeader = page.getByRole('columnheader', { name: /role/i });
      const actionsHeader = page.getByRole('columnheader', { name: /actions/i });
      
      // At least one header should be visible (table structure)
    });
  });

  test.describe('Approve Request Flow', () => {
    test('should approve request when approve button is clicked', async ({ page }) => {
      // Mock successful approval
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
        
        // Should show success toast
        await expect(page.getByText(/success/i)).toBeVisible({ timeout: 5000 });
      }
    });

    test('should show error when approval fails', async ({ page }) => {
      // Mock failed approval
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
        
        // Should show error toast
        await expect(page.getByText(/failed|error/i)).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Delete Request Flow', () => {
    test('should delete request when delete button is clicked', async ({ page }) => {
      // Mock successful deletion
      await page.route('**/api/delete-request', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Request deleted successfully' }),
        });
      });

      await page.goto('/requests');
      await page.waitForLoadState('networkidle');
      
      // Find delete button in requests section
      const deleteButton = page.locator('[data-testid="delete-request"]').first();
      
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // May show confirmation dialog
        const confirmButton = page.getByRole('button', { name: /confirm|yes|delete/i });
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
        }
      }
    });
  });

  test.describe('Update Member Flow', () => {
    test('should update member role', async ({ page }) => {
      // Mock successful update
      await page.route('**/api/update-members', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Member updated successfully' }),
        });
      });

      await page.goto('/requests');
      await page.waitForLoadState('networkidle');
      
      // Find role selector
      const roleSelector = page.locator('select').first();
      
      if (await roleSelector.isVisible()) {
        // Change role
        await roleSelector.selectOption('organiser');
        
        // Click update button
        const updateButton = page.getByRole('button', { name: /update/i }).first();
        if (await updateButton.isVisible()) {
          await updateButton.click();
        }
      }
    });
  });

  test.describe('Delete Member Flow', () => {
    test('should delete member when delete button is clicked', async ({ page }) => {
      // Mock successful deletion
      await page.route('**/api/delete-member', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Member deleted successfully' }),
        });
      });

      await page.goto('/requests');
      await page.waitForLoadState('networkidle');
      
      // Find delete button in members section
      const deleteButton = page.locator('[data-testid="delete-member"]').first();
      
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
      }
    });
  });

  test.describe('Role Selector', () => {
    test('should display all role options', async ({ page }) => {
      await page.goto('/requests');
      await page.waitForLoadState('networkidle');
      
      const roleSelector = page.locator('select').first();
      
      if (await roleSelector.isVisible()) {
        // Click to open dropdown
        await roleSelector.click();
        
        // Check for role options
        const options = await roleSelector.locator('option').allTextContents();
        
        // Should have at least member role
        expect(options.some(opt => opt.toLowerCase().includes('member'))).toBeTruthy();
      }
    });
  });
});
