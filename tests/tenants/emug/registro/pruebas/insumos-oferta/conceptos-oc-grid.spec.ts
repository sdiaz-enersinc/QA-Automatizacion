// plan: specs/Registro/insumos-oferta-playwright-test.plan.md
// semilla: tests/tenants/emug/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_COLUMNS,
  REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_TAB,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
    skipUnlessTabEnabled(MODULE_IDS.registroInsumosOferta, REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_TAB);
  });

  test('Conceptos OC — grilla y diálogos Nuevo Concepto y Nuevo Registro', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    // 1. Abrir Conceptos OC por sidebar.
    await dashboardPage.expectLoaded();
    await registro.openInsumosOfertaFromSidebar(REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_TAB);
    await registro.expectInsumosOfertaTabActive(REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_TAB);
    await registro.expectLayoutBTableToolbar(['Nuevo Concepto', 'Nuevo Registro']);
    await registro.expectGridColumnHeaders(REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_COLUMNS);

    // 2. Abrir Nuevo Concepto, validar campos y cerrar.
    await registro.expectNuevoConceptoDialog();

    // 3. Abrir Nuevo Registro, validar campos y cerrar.
    await registro.expectConceptosOcRegistroDialog();
  });
});
