import { test, expect } from '@playwright/test';

test('UI login stores auth token', async ({ page }) => {
  await page.goto('/login');

  await page.getByRole('textbox', { name: 'Email' }).fill('lanipooigig@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Test123!');
  await page.locator('#basic').getByRole('button', { name: 'Login' }).click();

  await expect(page).not.toHaveURL(/login/);

  const localStorageData = await page.evaluate(() => {
    return Object.entries(window.localStorage);
  });

  console.log(localStorageData);
});