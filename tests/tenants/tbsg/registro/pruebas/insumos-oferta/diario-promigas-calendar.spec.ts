// plan: specs/Registro/tbsg-registro-ui.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_INSUMOS_OFERTA_DIARIO_PROMIGAS_TAB,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
    skipUnlessTabEnabled(MODULE_IDS.registroInsumosOferta, REGISTRO_INSUMOS_OFERTA_DIARIO_PROMIGAS_TAB);
  });

  test('Diario Promigas — calendario y diálogo Nuevo Registro', async ({ page, dashboardPage }) => {
    test.setTimeout(60_000);
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    await test.step('1. Abrir Diario Promigas y validar la barra del calendario', async () => {
      await dashboardPage.expectLoaded();
      await registro.openInsumosOfertaFromSidebar(REGISTRO_INSUMOS_OFERTA_DIARIO_PROMIGAS_TAB);
      await registro.expectInsumosOfertaTabActive(REGISTRO_INSUMOS_OFERTA_DIARIO_PROMIGAS_TAB);
      await registro.expectLayoutACalendarToolbar('Nuevo Registro');
    });

    await test.step('2. Ejercitar controles Mes/Año y desplegables', async () => {
      await registro.expectCalendarControlsWork();
    });

    await test.step('3. Validar apertura y cierre del diálogo Nuevo Registro', async () => {
      await registro.expectFileUploadDialogOpensAndCloses('Nuevo Registro');
    });
  });
});
