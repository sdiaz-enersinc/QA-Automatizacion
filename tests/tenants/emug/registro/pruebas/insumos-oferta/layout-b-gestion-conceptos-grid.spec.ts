// spec: specs/Registro/insumos-oferta-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_INSUMOS_OFERTA_GESTION_CONCEPTOS_COLUMNS,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
    skipUnlessTabEnabled(MODULE_IDS.registroInsumosOferta, 'Gestion Conceptos');
  });

  test('Layout B — Gestion Conceptos grilla y Nuevo Registro', async ({ page, dashboardPage }) => {
    test.setTimeout(60_000);
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    // 1. Abrir Gestion Conceptos por sidebar.
    await dashboardPage.expectLoaded();
    await registro.openInsumosOfertaFromSidebar('Gestion Conceptos');
    await registro.expectInsumosOfertaTabActive('Gestion Conceptos');
    await registro.expectLayoutBTableToolbar(['Nuevo Registro']);
    await registro.expectGridColumnHeaders(REGISTRO_INSUMOS_OFERTA_GESTION_CONCEPTOS_COLUMNS);

    // 2. Abrir Nuevo Registro, validar el formulario de concepto y cerrar.
    await registro.expectGestionConceptosRegistroDialog();
  });
});
