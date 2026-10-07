// plan: specs/Registro/planta-consumos-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_GESTION_CONCEPTOS_COLUMNS,
  REGISTRO_PLANTA_CONSUMOS_GESTION_CONCEPTOS_TAB,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, REGISTRO_PLANTA_CONSUMOS_GESTION_CONCEPTOS_TAB);
  });

  test('Gestion Conceptos — grilla y Nuevo Registro', async ({ page, dashboardPage }) => {
    test.setTimeout(60_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    await test.step('1. Abrir Gestion Conceptos y validar columnas', async () => {
      await dashboardPage.expectLoaded();
      await registro.openPlantaConsumosFromSidebar(REGISTRO_PLANTA_CONSUMOS_GESTION_CONCEPTOS_TAB);
      await registro.expectPlantaConsumosTabActive(REGISTRO_PLANTA_CONSUMOS_GESTION_CONCEPTOS_TAB);
      await registro.expectLayoutBTableToolbar(['Nuevo Registro']);
      await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_GESTION_CONCEPTOS_COLUMNS);
    });

    await test.step('2. Validar apertura y cierre de Nuevo Registro', async () => {
      await registro.expectGestionConceptosRegistroDialog();
    });
  });
});
