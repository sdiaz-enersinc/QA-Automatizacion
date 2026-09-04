// spec: specs/Registro/otros-contratos-agr-navigation-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/otros-contratos/seed-otros-contratos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAnyTabEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_CONTRATOS_ENABLED_TAB_NAMES,
  RegistroOtrosContratosNavigationPage,
} from '../../../../../support/pages/registro/otros-contratos';

test.describe('Otros contratos — Path A y Path B (pestañas habilitadas, AGR incluida)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroOtrosContratos,
      REGISTRO_OTROS_CONTRATOS_ENABLED_TAB_NAMES,
    );
  });

  test('Path B — hover del tablero abre Otros contratos y la tira recorre las pestañas habilitadas', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroOtrosContratosNavigationPage(page);
    test.setTimeout(120_000);

    // 1. En el dashboard, localizar la tarjeta Registro, hacer hover y abrir Otros contratos por el icono eye.
    await dashboardPage.expectLoaded();
    await registro.openOtrosContratosFromDashboardHover();

    // 2. Pulsar en la tira cada pestaña habilitada (Miscelaneos, AGR) en cualquier orden. No pulsar las pestañas bloqueadas.
    for (const tabName of REGISTRO_OTROS_CONTRATOS_ENABLED_TAB_NAMES) {
      await registro.openOtrosContratosTab(tabName);
      await expect(page.getByRole('main')).toBeVisible();
    }
  });
});
