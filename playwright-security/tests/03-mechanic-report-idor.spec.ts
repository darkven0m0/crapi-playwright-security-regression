import { test, expect } from '@playwright/test';

const testUser = {
  name: 'Playwright IDOR User',
  email: 'playwright-idor-user@test.com',
  number: '2238887879',
  password: 'Test123!',
};

test('blocks access to another user mechanic report', async ({ request }) => {
  await request.post('http://127.0.0.1:8888/identity/api/auth/signup', {
    data: testUser,
  });

  const loginResponse = await request.post('http://127.0.0.1:8888/identity/api/auth/login', {
    data: {
      email: testUser.email,
      password: testUser.password,
    },
  });

  expect(loginResponse.status()).toBe(200);

  const loginBody = await loginResponse.json();
  const token = loginBody.token;

  expect(token).toBeTruthy();

  const reportResponse = await request.get(
    'http://127.0.0.1:8888/workshop/api/mechanic/mechanic_report?report_id=1',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  expect(
    [403, 404],
    `Expected mechanic report access to be denied, but got ${reportResponse.status()}`
  ).toContain(reportResponse.status());
});