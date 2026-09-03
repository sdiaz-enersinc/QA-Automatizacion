// spec: specs/Registro/insumos-oferta-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_INSUMOS_OFERTA_OEF_PROYECTADA_COLUMNS,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
    skipUnlessTabEnabled(MODULE_IDS.registroInsumosOferta, 'OEF Proyectada');
  });

  test('Layout B — OEF Proyectada grilla y wizard Nueva Vigencia Oef', async ({ page, dashboardPage }) => {
    test.setTimeout(60_000);
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    // 1. Abrir OEF Proyectada por sidebar.
    await dashboardPage.expectLoaded();
    await registro.openInsumosOfertaFromSidebar('OEF Proyectada');
    await registro.expectInsumosOfertaTabActive('OEF Proyectada');

    // 2. Inspeccionar barra de herramientas y columnas Recurso, Fecha inicial, Fecha final, Usuario, Acciones.
    await registro.expectLayoutBTableToolbar(['Nuevo Registro']);
    await registro.expectGridColumnHeaders(REGISTRO_INSUMOS_OFERTA_OEF_PROYECTADA_COLUMNS);

    // 3. Abrir Nuevo Registro y validar el wizard; luego cerrar.
    await registro.expectOefProyectadaWizardDialog();
  });
});
