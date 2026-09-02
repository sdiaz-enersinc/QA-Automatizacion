// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_COLUMNS,
  REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_FORM_LABELS,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Layout B standard data-table grid', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'Parametros Regas');
  });

  test('Layout B — Parametros Regas grid, filters, and dual CTAs', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Open Parametros Regas via sidebar.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('Parametros Regas');
    await registro.expectPlantaConsumosTabActive('Parametros Regas');

    // 2. Assert toolbar with Cargar Archivo and Nuevo Registro CTAs.
    await registro.expectLayoutBTableToolbar(['Cargar Archivo', 'Nuevo Registro']);

    // 3. Assert Parametros Regas grid column headers.
    await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_COLUMNS);

    // 4. Open Cargar Archivo flat form dialog and close cleanly.
    await registro.expectParametrosRegasCargarArchivoDialog();

    // 6. Open Nuevo Registro flat form dialog and close cleanly.
    await registro.expectFlatFormDialogOpensAndCloses(
      'Nuevo Registro',
      REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_FORM_LABELS,
    );
  });
});
