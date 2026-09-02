// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroPlantaConsumosNavigationPage } from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Layout A calendar grid', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'Oferta Diaria');
  });

  test('Layout A — Oferta Diaria calendar controls and Carga archivo dialog', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Open Oferta Diaria via sidebar and assert gestor shell.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('Oferta Diaria');
    await registro.expectGestorDeDatosPlantaConsumosShell();
    await registro.expectPlantaConsumosTabActive('Oferta Diaria');

    // 2. Assert calendar toolbar: year/month selectors, Mes/Año radios, Carga archivo.
    await registro.expectLayoutACalendarToolbar('Carga archivo');

    // 3. Assert Mes view grid with weekday headers and day cells.
    await registro.expectCalendarMesView();

    // 4–7. Exercise year/month dropdowns and Mes/Año toggle.
    await registro.expectCalendarControlsWork();

    // 8. Open Carga archivo file-upload dialog and close cleanly.
    await registro.expectFileUploadDialogOpensAndCloses('Carga archivo', { withTemplate: true });
  });
});
