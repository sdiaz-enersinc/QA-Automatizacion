// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroPlantaConsumosNavigationPage } from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Layout A calendar grid', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'Horario Promigas');
  });

  test('Layout A — Horario Promigas calendar and Nuevo Registro file upload', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Open Horario Promigas via sidebar.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('Horario Promigas');
    await registro.expectPlantaConsumosTabActive('Horario Promigas');

    // 2. Assert calendar toolbar with Nuevo Registro CTA (no Carga archivo).
    await registro.expectLayoutACalendarToolbar('Nuevo Registro');

    // 3. Exercise year/month dropdowns and Mes/Año toggle.
    await registro.expectCalendarControlsWork();

    // 4. Open Nuevo Registro file-upload dialog and close cleanly.
    await registro.expectFileUploadDialogOpensAndCloses('Nuevo Registro');
  });
});
