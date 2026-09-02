// spec: specs/Registro/emug-registro-toolbar-chips-removed.plan.md
// seed: tests/tenants/emug/registro/pruebas/empresas/seed-empresas.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroNavigationPage } from '../../../../../support/pages/registro/navigation';

test.describe('Negative coverage and shared helpers', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroNavigation);
  });

  test('Locked Registro modules are out of scope for this EMUG live pass', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroNavigationPage(page);

    // 1. Expand Registro and record locked items without force-navigating.
    await dashboardPage.expectLoaded();
    await registro.expectRegistroLockedSubmenuItemsVisible();
  });
});
