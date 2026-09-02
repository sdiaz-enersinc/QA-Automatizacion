// spec: specs/Registro/emug-registro-restructure-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/empresas/seed-empresas.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroNavigationPage } from '../../../../../support/pages/registro/navigation';

test.describe('Registro navigation harvest', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroNavigation);
  });

  test('Dashboard Registro card lists new and renamed submodules on hover', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroNavigationPage(page);

    // 1. From the dashboard, locate the Registro module card without hovering.
    await dashboardPage.expectLoaded();
    await registro.expectRegistroDashboardPreviewRows();

    // 2. Hover the Registro dashboard card and wait for the full submodule list.
    await registro.expectRegistroDashboardHoverSubmodules();
    await registro.expectRegistroLegacySubmoduleAbsentOnCard();
  });
});
