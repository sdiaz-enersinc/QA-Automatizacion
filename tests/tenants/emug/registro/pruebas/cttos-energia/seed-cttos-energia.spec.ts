import { MODULE_IDS } from '../../../../../support/config/module-registry';
import {
  skipUnlessModuleEnabled,
  skipUnlessTabEnabled,
} from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroCttosEnergiaNavigationPage } from '../../../../../support/pages/registro/cttos-energia';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
  skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, 'Largo plazo');
});

test('Seed — shell de Contratos de energía por menú lateral', async ({ page, dashboardPage }) => {
  const registro = new RegistroCttosEnergiaNavigationPage(page);

  await test.step('Abrir Contratos de energía y validar el shell del gestor', async () => {
    await dashboardPage.expectLoaded();
    await registro.openCttosEnergiaFromSidebar();
    await registro.expectGestorDeDatosCttosEnergiaShell();
  });
});
