import { test, expect } from '@playwright/test';

const testUser = {
  name: 'Playwright Test User',
  email: 'playwright-user@test.com',
  number: '2238887879',
  password: 'Test123!',
};

test('UI login stores auth token', async ({ page, request }) => {
  await request.post('http://127.0.0.1:8888/identity/api/auth/signup', {
    data: testUser,
  });

  await page.goto('/login');

  await page.getByRole('textbox', { name: 'Email' }).fill(testUser.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(testUser.password);
  await page.locator('#basic').getByRole('button', { name: 'Login' }).click();

  await expect(page).not.toHaveURL(/login/);

  const localStorageData = await page.evaluate(() => {
    return Object.entries(window.localStorage);
  });

  console.log(localStorageData);
});