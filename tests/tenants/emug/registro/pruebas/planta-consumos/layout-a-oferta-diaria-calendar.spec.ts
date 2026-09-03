// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroPlantaConsumosNavigationPage } from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Layout A calendario', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'Oferta Diaria');
  });

  test('Layout A — Oferta Diaria controles de calendario y diálogo Carga archivo', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Abrir Oferta Diaria por menú lateral y verificar shell del gestor.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('Oferta Diaria');
    await registro.expectGestorDeDatosPlantaConsumosShell();
    await registro.expectPlantaConsumosTabActive('Oferta Diaria');

    // 2. Verificar barra de herramientas del calendario: selectores año/mes, radios Mes/Año, Carga archivo.
    await registro.expectLayoutACalendarToolbar('Carga archivo');

    // 3. Verificar grilla de vista Mes con encabezados de días de la semana y celdas de día.
    await registro.expectCalendarMesView();

    // 4–7. Ejercitar desplegables año/mes y alternancia Mes/Año.
    await registro.expectCalendarControlsWork();

    // 8. Abrir diálogo de carga de archivo Carga archivo y cerrar limpiamente.
    await registro.expectFileUploadDialogOpensAndCloses('Carga archivo', { withTemplate: true });
  });
});
