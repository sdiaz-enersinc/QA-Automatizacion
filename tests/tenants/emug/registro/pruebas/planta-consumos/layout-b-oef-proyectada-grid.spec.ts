// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_OEF_PROYECTADA_COLUMNS,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Layout B standard data-table grid', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'OEF Proyectada');
  });

  test('Layout B — OEF Proyectada grid and wizard', async ({ page, dashboardPage }) => {
    test.setTimeout(60_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Open OEF Proyectada and assert grid columns.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('OEF Proyectada');
    await registro.expectPlantaConsumosTabActive('OEF Proyectada');
    await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_OEF_PROYECTADA_COLUMNS);

    // 2. Exercise standard filters.
    // await registro.expectModoYoFilterToggle();
    // await registro.expectEstadoFilterDialog();
    // await registro.expectUsuariosFilterDialog();

    // 3. Open and validate OEF Proyectada Nuevo Registro wizard.
    await registro.expectOefProyectadaWizardDialog();
  });
});
