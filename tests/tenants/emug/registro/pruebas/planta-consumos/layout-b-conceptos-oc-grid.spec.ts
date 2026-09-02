// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_COLUMNS,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Layout B standard data-table grid', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'Conceptos OC');
  });

  test('Layout B — Conceptos OC grid with dual CTAs', async ({ page, dashboardPage }) => {
    test.setTimeout(180_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Open Conceptos OC and assert toolbar with dual CTAs.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('Conceptos OC');
    await registro.expectPlantaConsumosTabActive('Conceptos OC');
    await registro.expectLayoutBTableToolbar(['Nuevo Concepto', 'Nuevo Registro']);
    await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_COLUMNS);

    // 2. Open Nuevo Concepto form with Unidad dropdown validation.
    await registro.expectNuevoConceptoDialog();

    // 3. Open Nuevo Registro dialog with Concepto dropdown validation.
    await registro.expectConceptosOcRegistroDialog();

    // 4. Exercise standard filters.
    // await registro.expectModoYoFilterToggle();
    // await registro.expectEstadoFilterDialog();
    // await registro.expectUsuariosFilterDialog();
  });
});
