import { test } from '../../../../../support/fixtures';

test('seed', async ({ dashboardPage }) => {
  await dashboardPage.expectLoaded();
});
