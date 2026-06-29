import { test, expect } from '@playwright/test';

test('blocks access to another user mechanic report', async ({ request }) => {
  const uniqueId = Date.now();

  const testUser = {
    name: 'Playwright IDOR User',
    email: `playwright-idor-${uniqueId}@test.com`,
    number: `223${String(uniqueId).slice(-7)}`,
    password: 'Test123!',
  };

  const signupResponse = await request.post('http://127.0.0.1:8888/identity/api/auth/signup', {
    data: testUser,
  });

  const signupBody = await signupResponse.text();

  console.log('Signup status:', signupResponse.status());
  console.log('Signup body:', signupBody);
  console.log('Test user email:', testUser.email);
  console.log('Test user number:', testUser.number);

  expect(
    [200, 201],
    `Expected signup to succeed, but got ${signupResponse.status()}`
  ).toContain(signupResponse.status());

  const loginResponse = await request.post('http://127.0.0.1:8888/identity/api/auth/login', {
    data: {
      email: testUser.email,
      password: testUser.password,
    },
  });

  const loginBodyText = await loginResponse.text();

  console.log('Login status:', loginResponse.status());
  console.log('Login body:', loginBodyText);

  expect(
    loginResponse.status(),
    `Expected login to succeed, but got ${loginResponse.status()}`
  ).toBe(200);

  const loginBody = JSON.parse(loginBodyText);
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