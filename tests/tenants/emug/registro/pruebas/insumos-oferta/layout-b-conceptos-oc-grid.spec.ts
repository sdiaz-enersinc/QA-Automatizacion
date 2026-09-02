// spec: specs/Registro/insumos-oferta-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_COLUMNS,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
    skipUnlessTabEnabled(MODULE_IDS.registroInsumosOferta, 'Conceptos OC');
  });

  test('Layout B — Conceptos OC grilla y diálogos Nuevo Concepto y Nuevo Registro', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    // 1. Abrir Conceptos OC por sidebar.
    await dashboardPage.expectLoaded();
    await registro.openInsumosOfertaFromSidebar('Conceptos OC');
    await registro.expectInsumosOfertaTabActive('Conceptos OC');
    await registro.expectLayoutBTableToolbar(['Nuevo Concepto', 'Nuevo Registro']);
    await registro.expectGridColumnHeaders(REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_COLUMNS);

    // 2. Abrir Nuevo Concepto, validar campos y cerrar.
    await registro.expectNuevoConceptoDialog();

    // 3. Abrir Nuevo Registro, validar campos y cerrar.
    await registro.expectConceptosOcRegistroDialog();
  });
});
