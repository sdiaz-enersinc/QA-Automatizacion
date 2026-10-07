// plan: specs/Registro/tbsg-cttos-combustible-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/cttos-combustible/seed-cttos-combustible.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES,
  RegistroCttosCombustibleNavigationPage,
} from '../../../../../support/pages/registro/cttos-combustible';

test.describe('Contratos combustible — Ruta A (menú lateral)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosCombustible);
  });

  test('Ruta A — Cada pestaña habilitada accesible por Registro → Cttos combustible', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(30_000);
    const registro = new RegistroCttosCombustibleNavigationPage(page);

    await dashboardPage.expectLoaded();

    for (const tabName of REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES) {
      await test.step(`Abrir «${tabName}» desde el menú lateral y validar pestaña activa`, async () => {
        await registro.openCttosCombustibleFromSidebar(tabName);
        await registro.expectContratosCombustibleTabActive(tabName);
        if (tabName === REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB) {
          await registro.expectGestorDeDatosCttosCombustibleShell();
        }
      });
    }

    await registro.restoreDefaultCombustibleView();
  });
});
