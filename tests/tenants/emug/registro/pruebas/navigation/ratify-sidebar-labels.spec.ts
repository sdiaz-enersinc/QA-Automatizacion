// spec: specs/Registro/emug-registro-restructure-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/empresas/seed-empresas.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroNavigationPage } from '../../../../../support/pages/registro/navigation';

test.describe('Registro — recolección de navegación', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroNavigation);
  });

  test('Las etiquetas del submenú Registro en el menú lateral coinciden con el orden en vivo, incluyendo módulos nuevos y renombrados', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroNavigationPage(page);

    // 1. Desde el tablero autenticado, expandir el menú lateral si está colapsado y expandir el menuitem Registro.
    await dashboardPage.expectLoaded();
    await registro.expectRegistroSubmenuOrderAndLockState();
  });
});
