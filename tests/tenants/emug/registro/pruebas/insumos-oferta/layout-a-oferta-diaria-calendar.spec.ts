// spec: specs/Registro/insumos-oferta-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
    skipUnlessTabEnabled(MODULE_IDS.registroInsumosOferta, REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB);
  });

  test('Layout A — Oferta Diaria calendario, controles Mes/Año y diálogo Carga archivo', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    // 1. Abrir Oferta Diaria por sidebar.
    await dashboardPage.expectLoaded();
    await registro.openInsumosOfertaFromSidebar(REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB);
    await registro.expectGestorDeDatosInsumosOfertaShell();
    await registro.expectInsumosOfertaTabActive(REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB);

    // 2. Inspeccionar la barra del calendario (año, mes, Mes/Año, Carga archivo, sin Filtros).
    await registro.expectLayoutACalendarToolbar('Carga archivo');

    // 3. Validar vista Mes y ejercitar año, mes y toggle Mes/Año.
    await registro.expectCalendarMesView();
    await registro.expectCalendarControlsWork();

    // 4. Abrir Carga archivo y cerrar el diálogo Registrar Información.
    await registro.expectFileUploadDialogOpensAndCloses('Carga archivo', { withTemplate: true });
  });
});
