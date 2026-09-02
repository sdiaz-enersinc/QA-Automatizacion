// spec: specs/Registro/cttos-energia-navigation-playwright-test.plan.md
// seed: tests/tenants/emug/registro/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_ENABLED_TAB_NAMES,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Path B (hover del tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
  });

  test('Path B — El hover del tablero abre Cttos energía y renderiza todas las pestañas', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await test.step('1. Validar el shell del tablero y la tarjeta de Registro', async () => {
      await dashboardPage.expectLoaded();
      await expect(registro.registroDashboardCard()).toBeVisible();
    });

    await test.step('2. Abrir Cttos energía desde el hover de la tarjeta Registro', async () => {
      await registro.hoverRegistroDashboardCard();
      await expect(registro.registroDashboardCard().getByText('Cttos energía')).toBeVisible();
      await registro.openCttosEnergiaFromDashboardGrid();
    });

    await test.step('3. Validar el shell del gestor de Contratos de energía', async () => {
      await registro.expectGestorDeDatosCttosEnergiaShell();
    });

    for (const tabName of REGISTRO_CTTS_ENERGIA_ENABLED_TAB_NAMES) {
      await test.step(`Abrir la pestaña «${tabName}» y validar selección, breadcrumb y slug`, async () => {
        await registro.openContratosEnergiaTab(tabName);
        await expect(page.getByRole('main')).toBeVisible();
      });
    }
  });
});
