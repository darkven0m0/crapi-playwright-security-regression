import { test, expect } from '@playwright/test';

test('crAPI loads in the browser', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/8888/);
});