// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_COSTOS_REGAS_COLUMNS,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Layout B standard data-table grid', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'Costos Regas');
  });

  test('Layout B — Costos Regas grid and Cargar Archivo', async ({ page, dashboardPage }) => {
    test.setTimeout(120_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Open Costos Regas and assert grid columns.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('Costos Regas');
    await registro.expectPlantaConsumosTabActive('Costos Regas');
    await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_COSTOS_REGAS_COLUMNS);

    await registro.expectLayoutBTableToolbar(['Cargar Archivo']);

    // 3. Open Cargar Archivo file-upload dialog and close cleanly.
    await registro.expectFileUploadDialogOpensAndCloses('Cargar Archivo', { withTemplate: true });
  });
});
