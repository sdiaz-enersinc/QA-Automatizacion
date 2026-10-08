// plan: specs/Registro/tbsg-registro-ui.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_INSUMOS_OFERTA_COSTOS_REGAS_COLUMNS,
  REGISTRO_INSUMOS_OFERTA_COSTOS_REGAS_TAB,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
    skipUnlessTabEnabled(MODULE_IDS.registroInsumosOferta, REGISTRO_INSUMOS_OFERTA_COSTOS_REGAS_TAB);
  });

  test('Costos Regas — grilla, filtros y Cargar Archivo', async ({ page, dashboardPage }) => {
    test.setTimeout(120_000);
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    await test.step('1. Abrir Costos Regas y validar columnas', async () => {
      await dashboardPage.expectLoaded();
      await registro.openInsumosOfertaFromSidebar(REGISTRO_INSUMOS_OFERTA_COSTOS_REGAS_TAB);
      await registro.expectInsumosOfertaTabActive(REGISTRO_INSUMOS_OFERTA_COSTOS_REGAS_TAB);
      await registro.expectGridColumnHeaders(REGISTRO_INSUMOS_OFERTA_COSTOS_REGAS_COLUMNS);
    });

    await test.step('2. Validar filtros Modo Yo, Estado y Usuarios', async () => {
      await registro.expectModoYoFilterToggle();
      await registro.expectEstadoFilterDialog();
      await registro.expectUsuariosFilterDialog();
    });

    await test.step('3. Validar apertura y cierre de Cargar Archivo', async () => {
      await registro.expectFileUploadDialogOpensAndCloses('Cargar Archivo', { withTemplate: true });
    });
  });
});
