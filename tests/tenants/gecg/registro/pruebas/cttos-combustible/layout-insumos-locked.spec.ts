// plan: specs/Registro/cttos-combustible-navigation-playwright-test.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/cttos-combustible/seed-cttos-combustible.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB,
  RegistroCttosCombustibleNavigationPage,
} from '../../../../../support/pages/registro/cttos-combustible';

test.describe('Contratos combustible — Insumos bloqueada', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosCombustible);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosCombustible, REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB);
  });

  test('Insumos — visible y deshabilitada; el clic no navega', async ({ page, dashboardPage }) => {
    const registro = new RegistroCttosCombustibleNavigationPage(page);

    await test.step('1. Abrir Transporte y validar Insumos bloqueada en la tira', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosCombustibleFromSidebar(REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB);
      await registro.expectGestorDeDatosCttosCombustibleShell();
      await registro.expectLockedTabsDisabled();
    });

    await test.step('2. Forzar clic en Insumos y comprobar que no cambia la vista', async () => {
      await registro.expectLockedTabDoesNotNavigate(REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB);
    });
  });
});
