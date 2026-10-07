// plan: specs/Registro/planta-consumos-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_DEFAULT_TAB,
  REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Ruta A (menú lateral)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
  });

  test('Ruta A — Cada pestaña accesible por Registro → Planta y consumos en el menú lateral', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(120_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    await dashboardPage.expectLoaded();

    for (const tabName of REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES) {
      await test.step(`Abrir «${tabName}» desde el menú lateral y validar pestaña, breadcrumb y slug`, async () => {
        await registro.openPlantaConsumosFromSidebar(tabName);
        await registro.expectPlantaConsumosTabActive(tabName);
        if (tabName === REGISTRO_PLANTA_CONSUMOS_DEFAULT_TAB) {
          await registro.expectGestorDeDatosPlantaConsumosShell();
        }
      });
    }
  });
});
