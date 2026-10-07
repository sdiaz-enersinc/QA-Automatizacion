// plan: specs/Registro/planta-consumos-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_LAYOUT_A_TAB,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, REGISTRO_PLANTA_CONSUMOS_LAYOUT_A_TAB);
  });

  test('Oferta Diaria — calendario, controles Mes/Año y diálogo Carga archivo', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    await test.step('1. Abrir Oferta Diaria desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openPlantaConsumosFromSidebar(REGISTRO_PLANTA_CONSUMOS_LAYOUT_A_TAB);
      await registro.expectGestorDeDatosPlantaConsumosShell();
      await registro.expectPlantaConsumosTabActive(REGISTRO_PLANTA_CONSUMOS_LAYOUT_A_TAB);
    });

    await test.step('2. Validar la barra del calendario y la vista Mes', async () => {
      await registro.expectLayoutACalendarToolbar('Carga archivo');
      await registro.expectCalendarMesView();
      await registro.expectCalendarControlsWork();
    });

    await test.step('3. Validar apertura y cierre del diálogo Carga archivo', async () => {
      await registro.expectFileUploadDialogOpensAndCloses('Carga archivo', { withTemplate: true });
    });
  });
});
