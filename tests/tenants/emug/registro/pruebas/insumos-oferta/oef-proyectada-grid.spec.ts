// plan: specs/Registro/insumos-oferta-playwright-test.plan.md
// semilla: tests/tenants/emug/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_INSUMOS_OFERTA_OEF_PROYECTADA_COLUMNS,
  REGISTRO_INSUMOS_OFERTA_OEF_PROYECTADA_TAB,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
    skipUnlessTabEnabled(MODULE_IDS.registroInsumosOferta, REGISTRO_INSUMOS_OFERTA_OEF_PROYECTADA_TAB);
  });

  test('OEF Proyectada — grilla y asistente Nueva Vigencia Oef', async ({ page, dashboardPage }) => {
    test.setTimeout(60_000);
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    // 1. Abrir OEF Proyectada por sidebar.
    await dashboardPage.expectLoaded();
    await registro.openInsumosOfertaFromSidebar(REGISTRO_INSUMOS_OFERTA_OEF_PROYECTADA_TAB);
    await registro.expectInsumosOfertaTabActive(REGISTRO_INSUMOS_OFERTA_OEF_PROYECTADA_TAB);

    // 2. Inspeccionar barra de herramientas y columnas Recurso, Fecha inicial, Fecha final, Usuario, Acciones.
    await registro.expectLayoutBTableToolbar(['Nuevo Registro']);
    await registro.expectGridColumnHeaders(REGISTRO_INSUMOS_OFERTA_OEF_PROYECTADA_COLUMNS);

    // 3. Abrir Nuevo Registro y validar el wizard; luego cerrar.
    await registro.expectOefProyectadaWizardDialog();
  });
});
