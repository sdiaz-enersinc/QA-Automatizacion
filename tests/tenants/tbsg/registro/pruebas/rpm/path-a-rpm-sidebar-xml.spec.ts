// plan: specs/Registro/gecg-empresas-rpm-integration.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/rpm/seed-rpm.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_RPM_DEFAULT_TAB,
  RegistroRpmNavigationPage,
} from '../../../../../support/pages/registro/rpm';

test.describe('RPM XML — Ruta A (menú lateral)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroRpm);
    skipUnlessTabEnabled(MODULE_IDS.registroRpm, REGISTRO_RPM_DEFAULT_TAB);
  });

  test('Ruta A — RPM XML accesible por Registro → RPM → XML', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroRpmNavigationPage(page);

    await test.step('1. Expandir el menú lateral si está plegado', async () => {
      await dashboardPage.expectLoaded();
      await registro.expandSidebarIfCollapsed();
    });

    await test.step('2. Expandir Registro y RPM y abrir XML', async () => {
      await registro.expandRegistroSidebar();
      await registro.expectRpmSubmenuEntryVisible();
      await registro.expandRpmSidebar();
      await registro.expectRpmXmlSidebarEntryVisible();
      await registro.openRpmFromSidebar(REGISTRO_RPM_DEFAULT_TAB);
      await registro.expectRpmViewActive(REGISTRO_RPM_DEFAULT_TAB);
      await registro.expectGestorDeDatosRpmShell();
    });
  });
});
