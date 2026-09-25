// plan: specs/Registro/cttos-combustible-navigation-playwright-test.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/cttos-combustible/seed-cttos-combustible.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES,
  RegistroCttosCombustibleNavigationPage,
} from '../../../../../support/pages/registro/cttos-combustible';

test.describe('Contratos combustible — Ruta B (hover del tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosCombustible);
  });

  test('Ruta B — El hover del tablero abre Cttos combustible y renderiza las pestañas habilitadas', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroCttosCombustibleNavigationPage(page);

    await test.step('1. Validar el shell del tablero y la tarjeta de Registro', async () => {
      await dashboardPage.expectLoaded();
      await expect(registro.registroDashboardCard()).toBeVisible();
    });

    await test.step('2. Abrir Cttos combustible desde el hover de la tarjeta Registro', async () => {
      await registro.hoverRegistroDashboardCard();
      await expect(registro.registroDashboardCard().getByText('Cttos combustible')).toBeVisible();
      await registro.openCttosCombustibleFromDashboardGrid();
    });

    await test.step('3. Validar el shell del gestor de Contratos combustible', async () => {
      await registro.expectGestorDeDatosCttosCombustibleShell();
    });

    for (const tabName of REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES) {
      await test.step(`Abrir la pestaña «${tabName}» y validar el contenido principal`, async () => {
        await registro.openContratosCombustibleTab(tabName);
        await expect(page.getByRole('main')).toBeVisible();
      });
    }

    await registro.restoreDefaultCombustibleView();
  });
});
