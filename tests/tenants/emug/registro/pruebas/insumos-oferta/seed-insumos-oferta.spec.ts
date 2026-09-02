// spec: specs/Registro/insumos-oferta-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
    skipUnlessTabEnabled(MODULE_IDS.registroInsumosOferta, REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB);
  });

  test('Seed — dashboard autenticado y shell de Insumos oferta en Oferta Diaria', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    // 1. Partir de sesión autenticada (bypass) en el dashboard de Enersinc.
    await dashboardPage.expectLoaded();
    await expect(page.getByText('Bienvenido a Enersinc')).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Registro' })).toBeVisible();
    await expect(registro.registroDashboardCard()).toBeVisible();

    // 2. Expandir Registro en el menú lateral, expandir Insumos oferta y abrir el enlace Oferta Diaria.
    await registro.expectInsumosOfertaSubmenuPresentAndLegacyAbsent();
    await registro.openInsumosOfertaFromSidebar(REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB);
    await registro.expectInsumosOfertaTabActive(REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB);
    await expect(page.getByRole('navigation')).toContainText('Gestor de datos');
    await registro.expectLegacyPlantasYConsumosBreadcrumb();
    await expect(page.getByRole('tab', { name: REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
