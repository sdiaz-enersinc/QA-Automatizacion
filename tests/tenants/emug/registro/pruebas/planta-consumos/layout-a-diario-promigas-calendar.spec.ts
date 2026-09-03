// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroPlantaConsumosNavigationPage } from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Layout A calendario', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'Diario Promigas');
  });

  test('Layout A — Diario Promigas calendario y carga de archivo Nuevo Registro', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(60_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Abrir Diario Promigas por menú lateral.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('Diario Promigas');
    await registro.expectPlantaConsumosTabActive('Diario Promigas');

    // 2. Verificar barra de herramientas del calendario con CTA Nuevo Registro (sin Carga archivo).
    await registro.expectLayoutACalendarToolbar('Nuevo Registro');

    // 3. Ejercitar desplegables año/mes y alternancia Mes/Año.
    await registro.expectCalendarControlsWork();

    // 4. Abrir diálogo de carga de archivo Nuevo Registro y cerrar limpiamente.
    await registro.expectFileUploadDialogOpensAndCloses('Nuevo Registro');
  });
});
