import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroSireciNavigationPage } from '../../../../../support/pages/registro/sireci';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroSireci);
  skipUnlessTabEnabled(MODULE_IDS.registroSireci, 'Resumen');
});

test('Seed — shell de Sireci por menú lateral', async ({ page, dashboardPage }) => {
  const registro = new RegistroSireciNavigationPage(page);

  await test.step('Abrir Sireci Resumen y validar el shell del gestor', async () => {
    await dashboardPage.expectLoaded();
    await registro.openSireciFromSidebar('Resumen');
    await registro.expectGestorDeDatosSireciShell();
  });
});
