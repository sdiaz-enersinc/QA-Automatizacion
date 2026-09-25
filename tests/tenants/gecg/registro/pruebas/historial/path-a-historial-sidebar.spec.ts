// spec: specs/Registro/historial-playwright-test.plan.md
// seed: tests/tenants/gecg/registro/pruebas/historial/seed-historial.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_HISTORIAL_ENABLED_TAB_NAMES,
  RegistroHistorialNavigationPage,
} from '../../../../../support/pages/registro/historial';

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

    for (const tabName of REGISTRO_HISTORIAL_ENABLED_TAB_NAMES) {
      await test.step(`Abrir «${tabName}» desde el menú lateral y validar la vista activa`, async () => {
        await registro.openHistorialFromSidebar(tabName);
        await registro.expectHistorialViewActive(tabName);
        await registro.expectGestorDeDatosHistorialShell();
      });
    }
  });
});
