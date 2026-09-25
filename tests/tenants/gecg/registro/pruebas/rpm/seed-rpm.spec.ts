import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroRpmNavigationPage } from '../../../../../support/pages/registro/rpm';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroRpm);
  skipUnlessTabEnabled(MODULE_IDS.registroRpm, 'XML');
});

test('Semilla — shell de RPM por menú lateral', async ({ page, dashboardPage }) => {
  const registro = new RegistroRpmNavigationPage(page);

  await test.step('Abrir RPM XML y validar el shell del gestor', async () => {
    await dashboardPage.expectLoaded();
    await registro.openRpmFromSidebar('XML');
    await registro.expectGestorDeDatosRpmShell();
  });
});
