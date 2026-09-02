// spec: specs/Registro/insumos-oferta-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/insumos-oferta/seed-insumos-oferta.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAnyTabEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES,
  RegistroInsumosOfertaNavigationPage,
} from '../../../../../support/pages/registro/insumos-oferta';

test.describe('Insumos oferta', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroInsumosOferta);
    skipUnlessAnyTabEnabled(MODULE_IDS.registroInsumosOferta, REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES);
  });

  test('Path A — cada pestaña habilitada por Registro → Insumos oferta en el menú lateral', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(120_000);
    const registro = new RegistroInsumosOfertaNavigationPage(page);

    // 1. Desde dashboard, para cada pestaña habilitada expandir Registro → Insumos oferta y pulsar el enlace anidado.
    await dashboardPage.expectLoaded();

    for (const tabName of REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES) {
      await registro.openInsumosOfertaFromSidebar(tabName);
      await registro.expectInsumosOfertaTabActive(tabName);
      await expect(page.getByRole('tab', { name: tabName })).toHaveAttribute('aria-selected', 'true');

      if (tabName === REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES[0]) {
        await registro.expectGestorDeDatosInsumosOfertaShell();
        await registro.expectAgrTabLocked();
      }
    }
  });
});
