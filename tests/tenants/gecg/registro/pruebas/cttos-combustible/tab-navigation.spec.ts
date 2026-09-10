// spec: specs/Registro/cttos-combustible-navigation-playwright-test.plan.md
// seed: tests/tenants/gecg/registro/pruebas/cttos-combustible/seed-cttos-combustible.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES,
  RegistroCttosCombustibleNavigationPage,
} from '../../../../../support/pages/registro/cttos-combustible';

test.describe('Contratos combustible — Navegación entre pestañas', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosCombustible);
  });

  test('Navegación compartida — pestaña, breadcrumb y slug', async ({ page, dashboardPage }) => {
    test.setTimeout(120_000);
    const registro = new RegistroCttosCombustibleNavigationPage(page);

    await test.step('1. Abrir Contratos combustible desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosCombustibleFromSidebar(REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB);
      await registro.expectGestorDeDatosCttosCombustibleShell();
    });

    for (const tabName of REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES) {
      await test.step(`Abrir la pestaña «${tabName}» y validar selección, breadcrumb y slug`, async () => {
        await registro.openContratosCombustibleTab(tabName);
      });
    }

    await registro.restoreDefaultCombustibleView();
  });
});
