// plan: specs/Registro/planta-consumos-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_DIARIO_PROMIGAS_TAB,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, REGISTRO_PLANTA_CONSUMOS_DIARIO_PROMIGAS_TAB);
  });

  test('Diario Promigas — calendario y diálogo Nuevo Registro', async ({ page, dashboardPage }) => {
    test.setTimeout(60_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    await test.step('1. Abrir Diario Promigas y validar la barra del calendario', async () => {
      await dashboardPage.expectLoaded();
      await registro.openPlantaConsumosFromSidebar(REGISTRO_PLANTA_CONSUMOS_DIARIO_PROMIGAS_TAB);
      await registro.expectPlantaConsumosTabActive(REGISTRO_PLANTA_CONSUMOS_DIARIO_PROMIGAS_TAB);
      await registro.expectLayoutACalendarToolbar('Nuevo Registro');
    });

    await test.step('2. Ejercitar controles Mes/Año y desplegables', async () => {
      await registro.expectCalendarControlsWork();
    });

    await test.step('3. Validar apertura y cierre del diálogo Nuevo Registro', async () => {
      await registro.expectFileUploadDialogOpensAndCloses('Nuevo Registro');
    });
  });
});
