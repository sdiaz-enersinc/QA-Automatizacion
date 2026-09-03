// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_OEF_PROYECTADA_COLUMNS,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Layout B grilla', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'OEF Proyectada');
  });

  test('Layout B — OEF Proyectada grilla y wizard', async ({ page, dashboardPage }) => {
    test.setTimeout(60_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Abrir OEF Proyectada y verificar columnas de la grilla.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('OEF Proyectada');
    await registro.expectPlantaConsumosTabActive('OEF Proyectada');
    await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_OEF_PROYECTADA_COLUMNS);

    // 2. Ejercitar filtros estándar.
    // await registro.expectModoYoFilterToggle();
    // await registro.expectEstadoFilterDialog();
    // await registro.expectUsuariosFilterDialog();

    // 3. Abrir y validar wizard Nuevo Registro de OEF Proyectada.
    await registro.expectOefProyectadaWizardDialog();
  });
});
