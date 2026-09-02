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

  test('Sidebar Registro submenu labels match live order including new and renamed modules', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroNavigationPage(page);

    // 1. From the authenticated dashboard, expand the sidebar if it is collapsed, then expand the Registro menuitem.
    await dashboardPage.expectLoaded();
    await registro.expectRegistroSubmenuOrderAndLockState();
  });
});
