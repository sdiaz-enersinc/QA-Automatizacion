// spec: specs/Registro/otros-contratos-agr-navigation-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/otros-contratos/seed-otros-contratos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAnyTabEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
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

  test('Path A — cada pestaña habilitada por Registro → Otros contratos en el menú lateral', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(120_000);
    const registro = new RegistroOtrosContratosNavigationPage(page);

    // 1. Partir del dashboard autenticado. Expandir Registro y luego Otros contratos en el menú lateral hasta ver el submenú anidado.
    await dashboardPage.expectLoaded();
    await registro.expectOtrosContratosNestedSidebarItems();

    // 2. Para cada pestaña habilitada (Miscelaneos, AGR): reexpandir Registro → Otros contratos si el flyout se cerró y pulsar el ítem anidado (enlace si existe; si no, el menuitem).
    for (const tabName of REGISTRO_OTROS_CONTRATOS_ENABLED_TAB_NAMES) {
      await registro.openOtrosContratosFromSidebar(tabName);
      await registro.expectOtrosContratosTabActive(tabName);
      await registro.expectGestorDeDatosOtrosContratosShell();
    }
  });
});
