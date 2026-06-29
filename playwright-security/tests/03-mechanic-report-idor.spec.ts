import { test, expect } from '@playwright/test';

test('blocks access to another user mechanic report', async ({ request }) => {
  const loginResponse = await request.post('http://127.0.0.1:8888/identity/api/auth/login', {
    data: {
      email: 'lanipooigig@test.com',
      password: 'Test123!',
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