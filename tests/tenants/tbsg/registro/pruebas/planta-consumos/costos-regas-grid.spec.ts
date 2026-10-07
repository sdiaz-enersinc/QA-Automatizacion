// plan: specs/Registro/planta-consumos-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_COSTOS_REGAS_COLUMNS,
  REGISTRO_PLANTA_CONSUMOS_COSTOS_REGAS_TAB,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, REGISTRO_PLANTA_CONSUMOS_COSTOS_REGAS_TAB);
  });

  test('Costos Regas — grilla, filtros y Cargar Archivo', async ({ page, dashboardPage }) => {
    test.setTimeout(120_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    await test.step('1. Abrir Costos Regas y validar columnas', async () => {
      await dashboardPage.expectLoaded();
      await registro.openPlantaConsumosFromSidebar(REGISTRO_PLANTA_CONSUMOS_COSTOS_REGAS_TAB);
      await registro.expectPlantaConsumosTabActive(REGISTRO_PLANTA_CONSUMOS_COSTOS_REGAS_TAB);
      await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_COSTOS_REGAS_COLUMNS);
    });

    await test.step('2. Validar filtros Modo Yo, Estado y Usuarios', async () => {
      await registro.expectModoYoFilterToggle();
      await registro.expectEstadoFilterDialog();
      await registro.expectUsuariosFilterDialog();
    });

    await test.step('3. Validar apertura y cierre de Cargar Archivo', async () => {
      await registro.expectFileUploadDialogOpensAndCloses('Cargar Archivo', { withTemplate: true });
    });
  });
});
