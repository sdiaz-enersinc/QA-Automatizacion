// plan: specs/Registro/sireci-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/sireci/seed-sireci.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_SIRECI_DEFAULT_TAB,
  REGISTRO_SIRECI_REPORTE_TAB,
  RegistroSireciNavigationPage,
} from '../../../../../support/pages/registro/sireci';

test.describe('Sireci — Ruta A (menú lateral)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroSireci);
  });

  test('Ruta A — Sireci Resumen y Reporte accesibles por el menú lateral', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroSireciNavigationPage(page);

    await test.step('1. Expandir el menú lateral si está plegado', async () => {
      await dashboardPage.expectLoaded();
      await registro.expandSidebarIfCollapsed();
    });

    await test.step('2. Expandir Registro y validar la fila de Sireci', async () => {
      await registro.expandRegistroSidebar();
      await registro.expectSireciSubmenuEntryVisible();
    });

    await test.step('3. Expandir Sireci y validar enlaces anidados', async () => {
      await registro.expectSireciNestedSidebarLinksVisible();
    });

    await test.step('4. Abrir Resumen y Reporte desde el menú lateral', async () => {
      await registro.openSireciFromSidebar(REGISTRO_SIRECI_DEFAULT_TAB);
      await registro.expectSireciViewActive(REGISTRO_SIRECI_DEFAULT_TAB);
      await registro.expectGestorDeDatosSireciShell();
      await registro.openSireciFromSidebar(REGISTRO_SIRECI_REPORTE_TAB);
      await registro.expectSireciViewActive(REGISTRO_SIRECI_REPORTE_TAB);
      await registro.expectGestorDeDatosSireciShell();
    });
  });
});
