// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_COLUMNS,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Layout B standard data-table grid', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'Heat Rate');
  });

  test('Layout B — Heat Rate grid, filters, and Nuevo Registro wizard', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Open Heat Rate via sidebar.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('Heat Rate');
    await registro.expectPlantaConsumosTabActive('Heat Rate');

    // 2. Assert toolbar controls.
    await registro.expectLayoutBTableToolbar();

    // 3. Assert Heat Rate grid column headers.
    await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_COLUMNS);

    // 4. Open and validate Heat Rate Nuevo Registro wizard fields and dropdowns.
    await registro.expectHeatRateWizardDialog();
  });
});
