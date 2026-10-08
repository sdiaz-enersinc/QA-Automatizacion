// plan: specs/Registro/insumos-oferta-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAnyTabEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import { REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS } from '../../../../../support/pages/registro/navigation';
import {
  REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB,
  REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
    skipUnlessAnyTabEnabled(MODULE_IDS.registroInsumosOferta, REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES);
  });

  test('Ruta B — el hover de Registro lista Insumos oferta y la tira de pestañas recorre las habilitadas', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroInsumosOfertaNavigationPage(page);
    const card = registro.registroDashboardCard();

    // 1. En el tablero, localizar la tarjeta Registro y comprobar filas visibles de Empresas, Cttos energía y Cttos combustible.
    await dashboardPage.expectLoaded();
    await expect(card).toBeVisible();
    for (const label of REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS) {
      await expect(card.getByText(label)).toBeVisible();
      await expect(card.getByRole('listitem').filter({ hasText: label }).getByLabel('eye')).toBeVisible();
    }

    // 2. Hacer hover sobre la tarjeta Registro.
    await registro.expectInsumosOfertaVisibleOnDashboardHover();

    // 3. Abrir Oferta Diaria por menú lateral y luego pulsar en la tira cada pestaña habilitada.
    await registro.openInsumosOfertaFromSidebar(REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB);
    await registro.expectGestorDeDatosInsumosOfertaShell();
    for (const tabName of REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES) {
      await registro.openInsumosOfertaTab(tabName);
    }
  });
});
