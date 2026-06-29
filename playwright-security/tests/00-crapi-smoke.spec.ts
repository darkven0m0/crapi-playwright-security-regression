import { test, expect } from '@playwright/test';

test('crAPI web app is reachable', async ({ request }) => {
  const response = await request.get('/');

  expect([200, 301, 302]).toContain(response.status());
});