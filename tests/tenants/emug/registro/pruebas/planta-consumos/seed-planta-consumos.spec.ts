import { test } from '../../../../../support/fixtures';

test('Seed — dashboard autenticado', async ({ dashboardPage }) => {
  await dashboardPage.expectLoaded();
});
