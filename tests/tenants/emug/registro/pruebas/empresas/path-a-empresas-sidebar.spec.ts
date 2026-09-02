// spec: specs/Registro/empresas-playwright-test.plan.md
// seed: tests/tenants/emug/registro/empresas/seed-empresas.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroEmpresasNavigationPage } from '../../../../../support/pages/registro/empresas';

test.describe('Empresas — Path A (menú lateral)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroEmpresas);
  });

  test('Path A — Empresas accesible por Registro → Empresas en el menú lateral', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroEmpresasNavigationPage(page);

    await test.step('1. Expandir el menú lateral si está plegado', async () => {
      await dashboardPage.expectLoaded();
      await registro.expandSidebarIfCollapsed();
    });

    await test.step('2. Expandir Registro hasta ver las filas de submódulo', async () => {
      await registro.expandRegistroSidebar();
      await registro.expectRegistroSubmenuLabelsVisible();
    });

    await test.step('3. Abrir Empresas desde el menú lateral y validar el shell del gestor', async () => {
      await registro.openEmpresasFromSidebar();
      await registro.expectGestorDeDatosEmpresasShell();
      await registro.expectEmpresasViewActive();
    });
  });
});
