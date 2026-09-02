import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroEmpresasNavigationPage } from '../../../../../support/pages/registro/empresas';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroEmpresas);
});

test('Seed — shell de Empresas por menú lateral', async ({ page, dashboardPage }) => {
  const registro = new RegistroEmpresasNavigationPage(page);

  await test.step('Abrir Empresas y validar el shell del gestor', async () => {
    await dashboardPage.expectLoaded();
    await registro.openEmpresasFromSidebar();
    await registro.expectGestorDeDatosEmpresasShell();
  });
});
