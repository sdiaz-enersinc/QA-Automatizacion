// spec: specs/Registro/historial-playwright-test.plan.md
// seed: tests/tenants/emug/registro/historial/seed-historial.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroHistorialNavigationPage } from '../../../../../support/pages/registro/historial';

test.describe('Historial — Path A (menú lateral)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroHistorial);
  });

  test('Path A — Historial accesible por enlaces anidados del menú lateral', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(60_000);
    const registro = new RegistroHistorialNavigationPage(page);

    await test.step('1. Expandir el menú lateral si está plegado', async () => {
      await dashboardPage.expectLoaded();
      await registro.expandSidebarIfCollapsed();
    });

    await test.step('2. Expandir Registro hasta ver la fila de Historial', async () => {
      await registro.expandRegistroSidebar();
      await registro.expectHistorialSubmenuEntryVisible();
    });

    await test.step('3. Expandir Historial y validar los enlaces anidados del menú', async () => {
      await registro.expectHistorialNestedSidebarLinksVisible();
    });

    await test.step('4. Abrir Operaciones multiples desde el menú lateral', async () => {
      await registro.openHistorialFromSidebar('Operaciones multiples');
      await registro.expectHistorialViewActive('Operaciones multiples');
    });

    await test.step('5. Abrir Operaciones individuales desde el menú lateral', async () => {
      await registro.openHistorialFromSidebar('Operaciones individuales');
      await registro.expectHistorialViewActive('Operaciones individuales');
    });

    await test.step('6. Abrir Archivos cargados desde el menú lateral', async () => {
      await registro.openHistorialFromSidebar('Archivos cargados');
      await registro.expectHistorialViewActive('Archivos cargados');
    });
  });
});
