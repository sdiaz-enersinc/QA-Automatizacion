// plan: specs/Registro/planta-consumos-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_COLUMNS,
  REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_TAB,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_TAB);
  });

  test('Conceptos OC — grilla y diálogos Nuevo Concepto y Nuevo Registro', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    await test.step('1. Abrir Conceptos OC y validar barra y columnas', async () => {
      await dashboardPage.expectLoaded();
      await registro.openPlantaConsumosFromSidebar(REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_TAB);
      await registro.expectPlantaConsumosTabActive(REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_TAB);
      await registro.expectLayoutBTableToolbar(['Nuevo Concepto', 'Nuevo Registro']);
      await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_COLUMNS);
    });

    await test.step('2. Validar apertura y cierre de Nuevo Concepto', async () => {
      await registro.expectNuevoConceptoDialog();
    });

    await test.step('3. Validar apertura y cierre de Nuevo Registro', async () => {
      await registro.expectConceptosOcRegistroDialog();
    });
  });
});
