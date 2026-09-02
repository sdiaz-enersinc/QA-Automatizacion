// spec: specs/Registro/cttos-energia-navigation-playwright-test.plan.md
// seed: tests/tenants/emug/registro/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_ENABLED_TAB_NAMES,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Path A (menú lateral)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
  });

  test('Path A — Cada pestaña accesible por Registro → Cttos energía en el menú lateral', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(120_000);
    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await dashboardPage.expectLoaded();

    for (const tabName of REGISTRO_CTTS_ENERGIA_ENABLED_TAB_NAMES) {
      await test.step(`Abrir «${tabName}» desde el menú lateral y validar pestaña, breadcrumb y slug`, async () => {
        await registro.openCttosEnergiaFromSidebar(tabName);
        await registro.expectContratosEnergiaTabActive(tabName);
      });
    }
  });
});
