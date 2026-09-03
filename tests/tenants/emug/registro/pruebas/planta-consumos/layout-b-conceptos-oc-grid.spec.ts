// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_COLUMNS,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Layout B grilla', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, 'Conceptos OC');
  });

  test('Layout B — Conceptos OC grilla con CTAs duales', async ({ page, dashboardPage }) => {
    test.setTimeout(180_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Abrir Conceptos OC y verificar barra de herramientas con CTAs duales.
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar('Conceptos OC');
    await registro.expectPlantaConsumosTabActive('Conceptos OC');
    await registro.expectLayoutBTableToolbar(['Nuevo Concepto', 'Nuevo Registro']);
    await registro.expectGridColumnHeaders(REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_COLUMNS);

    // 2. Abrir formulario Nuevo Concepto con validación del desplegable Unidad.
    await registro.expectNuevoConceptoDialog();

    // 3. Abrir diálogo Nuevo Registro con validación del desplegable Concepto.
    await registro.expectConceptosOcRegistroDialog();

    // 4. Ejercitar filtros estándar.
    // await registro.expectModoYoFilterToggle();
    // await registro.expectEstadoFilterDialog();
    // await registro.expectUsuariosFilterDialog();
  });
});
