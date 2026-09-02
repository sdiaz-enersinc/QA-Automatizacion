// spec: specs/Registro/emug-registro-restructure-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta rename ratification', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
  });

  test('Insumos oferta replaces Planta y consumos; Heat Rate removed; locked tabs populated', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    // 1. Expand Registro and confirm Insumos oferta is present and Planta y consumos is absent.
    await dashboardPage.expectLoaded();
    await registro.expectInsumosOfertaSubmenuPresentAndLegacyAbsent();

    // 2. Expand Insumos oferta and list nested items and hrefs.
    await registro.expectInsumosOfertaEnabledSidebarHrefs();
    await registro.expectInsumosOfertaNestedSidebarItems();

    // 3. Open Oferta Diaria and read the gestor shell breadcrumb and tab strip.
    await registro.openInsumosOfertaFromSidebar(REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB);
    await registro.expectGestorDeDatosInsumosOfertaShell();
    await registro.expectHeatRateAbsentFromTabs();
  });
});
