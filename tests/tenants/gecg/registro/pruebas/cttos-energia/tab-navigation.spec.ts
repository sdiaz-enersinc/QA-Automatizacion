// spec: specs/Registro/cttos-energia-tabs-playwright-test.plan.md
// seed: tests/tenants/gecg/registro/pruebas/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_ENABLED_TAB_NAMES,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Navegación entre pestañas', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
  });

  test('Navegación compartida — pestaña, breadcrumb y slug', async ({ page, dashboardPage }) => {
    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await test.step('1. Abrir Contratos de energía desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosEnergiaFromSidebar();
      await registro.expectGestorDeDatosCttosEnergiaShell();
    });

    for (const tabName of REGISTRO_CTTS_ENERGIA_ENABLED_TAB_NAMES) {
      await test.step(`Abrir la pestaña «${tabName}» y validar selección, breadcrumb y slug`, async () => {
        await registro.openContratosEnergiaTab(tabName);
      });
    }
  });
});
