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

  test('Ventana nueva Recursos Generción (AGR) bloqueada; Heat Rate ausente; breadcrumb legado', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    // 1. Desde dashboard, expandir Registro → Insumos oferta y listar ítems anidados del submenú.
    await dashboardPage.expectLoaded();
    await registro.expectInsumosOfertaNestedSidebarItems();

    // 2. Abrir Oferta Diaria y leer breadcrumb y tira de pestañas.
    await registro.clickInsumosOfertaSidebarLink(REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB);
    await registro.expectInsumosOfertaTabActive(REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB);
    await registro.expectLegacyPlantasYConsumosBreadcrumb();
    await registro.expectGestorDeDatosInsumosOfertaShell();
    await registro.expectAgrTabLocked();
    await registro.expectHeatRateAbsentFromTabs();

    // 3. Intentar activar la pestaña Recursos Generción (AGR) (clic o teclado).
    await registro.expectAgrTabDoesNotNavigate();
  });
});
