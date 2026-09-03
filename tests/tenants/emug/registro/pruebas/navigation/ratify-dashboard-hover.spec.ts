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

  test('La tarjeta Registro del tablero lista submódulos nuevos y renombrados en hover', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroNavigationPage(page);

    // 1. Desde el tablero, localizar la tarjeta del módulo Registro sin hacer hover.
    await dashboardPage.expectLoaded();
    await registro.expectRegistroDashboardPreviewRows();

    // 2. Hacer hover en la tarjeta Registro del tablero y esperar la lista completa de submódulos.
    await registro.expectRegistroDashboardHoverSubmodules();
    await registro.expectRegistroLegacySubmoduleAbsentOnCard();
  });
});
