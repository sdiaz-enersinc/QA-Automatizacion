// spec: specs/Registro/empresas-playwright-test.plan.md
// seed: tests/tenants/emug/registro/empresas/seed-empresas.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import { RegistroEmpresasNavigationPage } from '../../../../../support/pages/registro/empresas';

test.describe('Empresas — Path B (hover del tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroEmpresas);
  });

  test('Path B — El hover del tablero abre la grilla de Empresas', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroEmpresasNavigationPage(page);

    await test.step('1. Validar el shell del tablero y la tarjeta de Registro', async () => {
      await dashboardPage.expectLoaded();
      await expect(registro.registroDashboardCard()).toBeVisible();
      await expect(registro.registroDashboardCard().getByText('Empresas')).toBeVisible();
      await expect(registro.registroDashboardCard().getByText('Cttos energía')).toBeVisible();
      await expect(registro.registroDashboardCard().getByText('Cttos combustible')).toBeVisible();
    });

    await test.step('2. Abrir Empresas desde el hover de la tarjeta Registro', async () => {
      await registro.expectEmpresasVisibleOnDashboardHover();
      await registro.openEmpresasFromDashboardGrid();
    });

    await test.step('3. Validar el shell del gestor y la vista activa de Empresas', async () => {
      await registro.expectGestorDeDatosEmpresasShell();
      await registro.expectEmpresasViewActive();
      await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();
    });
  });
});
