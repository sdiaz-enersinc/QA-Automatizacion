// plan: specs/Registro/tbsg-cttos-energia-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import {
  skipUnlessModuleEnabled,
  skipUnlessTabEnabled,
} from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_DEFAULT_TAB,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
  skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, REGISTRO_CTTS_ENERGIA_DEFAULT_TAB);
});

test('Semilla — shell de Contratos de energía por menú lateral', async ({ page, dashboardPage }) => {
  const registro = new RegistroCttosEnergiaNavigationPage(page);

  await test.step('Abrir Contratos de energía y validar el shell del gestor', async () => {
    await dashboardPage.expectLoaded();
    await registro.openCttosEnergiaFromSidebar();
    await registro.expectGestorDeDatosCttosEnergiaShell();
  });
});
