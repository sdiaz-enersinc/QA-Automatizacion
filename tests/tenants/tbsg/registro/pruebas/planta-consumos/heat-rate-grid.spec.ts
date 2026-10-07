// plan: specs/Registro/planta-consumos-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_COLUMNS,
  REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_TAB,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_TAB);
  });

  test('Heat Rate — grilla, filtros y asistente Nuevo Registro', async ({ page, dashboardPage }) => {
    test.setTimeout(180_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    await test.step('1. Abrir Heat Rate desde el menú lateral', async () => {
      await dashboardPage.expectLoaded();
      await registro.openPlantaConsumosFromSidebar(REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_TAB);
      await registro.expectPlantaConsumosTabActive(REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_TAB);
    });

    await test.step('2. Validar barra de herramientas y columnas de la grilla', async () => {
      await registro.expectLayoutBTableToolbar();
      await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_COLUMNS);
    });

    await test.step('3. Validar filtros Modo Yo, Estado y Usuarios', async () => {
      await registro.expectModoYoFilterToggle();
      await registro.expectEstadoFilterDialog();
      await registro.expectUsuariosFilterDialog();
    });

    await test.step('4. Validar apertura y cierre del asistente Nuevo Registro', async () => {
      await registro.expectHeatRateWizardDialog();
    });
  });
});
