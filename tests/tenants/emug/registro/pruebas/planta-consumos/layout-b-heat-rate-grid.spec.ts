// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_COLUMNS,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Layout B grilla', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'Heat Rate');
  });

  test('Layout B — Heat Rate grilla, filtros y wizard Nuevo Registro', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Abrir Heat Rate por menú lateral.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('Heat Rate');
    await registro.expectPlantaConsumosTabActive('Heat Rate');

    // 2. Verificar controles de la barra de herramientas.
    await registro.expectLayoutBTableToolbar();

    // 3. Verificar encabezados de columnas de la grilla Heat Rate.
    await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_COLUMNS);

    // 4. Abrir y validar campos y desplegables del wizard Nuevo Registro de Heat Rate.
    await registro.expectHeatRateWizardDialog();
  });
});
