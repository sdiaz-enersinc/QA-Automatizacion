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

test.describe('Planta y consumos — Layout B grilla', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'Parametros Regas');
  });

  test('Layout B — Parametros Regas grilla, filtros y CTAs duales', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Abrir Parametros Regas por menú lateral.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('Parametros Regas');
    await registro.expectPlantaConsumosTabActive('Parametros Regas');

    // 2. Verificar barra de herramientas con CTAs Cargar Archivo y Nuevo Registro.
    await registro.expectLayoutBTableToolbar(['Cargar Archivo', 'Nuevo Registro']);

    // 3. Verificar encabezados de columnas de la grilla Parametros Regas.
    await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_COLUMNS);

    // 4. Abrir diálogo de formulario plano Cargar Archivo y cerrar limpiamente.
    await registro.expectParametrosRegasCargarArchivoDialog();

    // 6. Abrir diálogo de formulario plano Nuevo Registro y cerrar limpiamente.
    await registro.expectFlatFormDialogOpensAndCloses(
      'Nuevo Registro',
      REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_FORM_LABELS,
    );
  });
});
