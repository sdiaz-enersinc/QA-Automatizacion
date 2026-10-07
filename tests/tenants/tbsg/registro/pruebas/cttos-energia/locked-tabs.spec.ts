// plan: specs/Registro/tbsg-cttos-energia-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_DEFAULT_TAB,
  REGISTRO_CTTS_ENERGIA_LOCKED_TAB_NAMES,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — pestañas bloqueadas', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, REGISTRO_CTTS_ENERGIA_DEFAULT_TAB);
  });

  test('Usuarios NR, DDV, RMS y DEC — visibles y deshabilitadas; el clic no navega', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await test.step('1. Abrir Largo plazo y validar pestañas bloqueadas en la tira', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosEnergiaFromSidebar(REGISTRO_CTTS_ENERGIA_DEFAULT_TAB);
      await registro.expectGestorDeDatosCttosEnergiaShell();
      await registro.expectLockedTabsDisabled();
    });

    for (const tabName of REGISTRO_CTTS_ENERGIA_LOCKED_TAB_NAMES) {
      await test.step(`Forzar clic en «${tabName}» y comprobar que no cambia la vista`, async () => {
        await registro.expectLockedTabDoesNotNavigate(tabName);
      });
    }
  });
});
