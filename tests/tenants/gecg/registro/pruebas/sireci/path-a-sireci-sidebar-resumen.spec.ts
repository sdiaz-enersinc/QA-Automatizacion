// spec: specs/Registro/sireci-playwright-test.plan.md
// seed: tests/tenants/gecg/registro/pruebas/sireci/seed-sireci.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroSireciNavigationPage } from '../../../../../support/pages/registro/sireci';

test.describe('Sireci — Path A (menú lateral)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroSireci);
  });

  test('Path A — Sireci Resumen y Reporte accesibles por el menú lateral', async ({
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
      await registro.openSireciFromSidebar('Resumen');
      await registro.expectSireciViewActive('Resumen');
      await registro.expectGestorDeDatosSireciShell();
      await registro.openSireciFromSidebar('Reporte');
      await registro.expectSireciViewActive('Reporte');
      await registro.expectGestorDeDatosSireciShell();
    });
  });
});
