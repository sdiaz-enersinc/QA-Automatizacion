// plan: specs/Registro/cttos-combustible-navigation-playwright-test.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/cttos-combustible/seed-cttos-combustible.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_C_TAB,
  RegistroCttosCombustibleNavigationPage,
} from '../../../../../support/pages/registro/cttos-combustible';

test.describe('Contratos combustible — Layout C Inventarios (Ruta A)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosCombustible);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosCombustible, REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_C_TAB);
  });

  test('Inventarios — pestaña habilitada con ruta 404 en QA', async ({ page, dashboardPage }) => {
    test.setTimeout(90_000);
    const registro = new RegistroCttosCombustibleNavigationPage(page);

    await test.step('1. Abrir Contratos combustible y entrar a Inventarios por la tira de pestañas', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosCombustibleFromSidebar(REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB);
      await registro.openContratosCombustibleTab(REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_C_TAB);
      await registro.expectContratosCombustibleTabActive(REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_C_TAB);
    });

    await test.step('2. Validar el estado 404 de Inventarios (grilla aún no disponible)', async () => {
      // Inventarios is selected and enabled, but /gestor-de-datos/combustible/inventarios
      // currently renders the Gestor 404 empty state instead of a data grid.
      await registro.expectInventariosUnavailablePage();
    });
  });
});
