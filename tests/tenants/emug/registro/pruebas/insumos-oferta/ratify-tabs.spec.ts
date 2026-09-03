// spec: specs/Registro/emug-registro-restructure-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta — ratificación de renombre', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
  });

  test('Insumos oferta reemplaza Planta y consumos; Heat Rate eliminado; pestañas bloqueadas con contenido', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    // 1. Expandir Registro y confirmar que Insumos oferta está presente y Planta y consumos está ausente.
    await dashboardPage.expectLoaded();
    await registro.expectInsumosOfertaSubmenuPresentAndLegacyAbsent();

    // 2. Expandir Insumos oferta y listar ítems anidados y hrefs.
    await registro.expectInsumosOfertaEnabledSidebarHrefs();
    await registro.expectInsumosOfertaNestedSidebarItems();

    // 3. Abrir Oferta Diaria y leer el breadcrumb y la tira de pestañas del shell del gestor.
    await registro.openInsumosOfertaFromSidebar(REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB);
    await registro.expectGestorDeDatosInsumosOfertaShell();
    await registro.expectHeatRateAbsentFromTabs();
  });
});
