// spec: specs/Registro/gecg-empresas-rpm-integration.plan.md
// seed: tests/tenants/gecg/registro/pruebas/rpm/seed-rpm.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroRpmNavigationPage } from '../../../../../support/pages/registro/rpm';

test.describe('RPM XML — Path A (menú lateral)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroRpm);
    skipUnlessTabEnabled(MODULE_IDS.registroRpm, 'XML');
  });

  test('Path A — RPM XML accesible por Registro → RPM → XML', async ({
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
      await registro.openRpmFromSidebar('XML');
      await registro.expectRpmViewActive('XML');
      await registro.expectGestorDeDatosRpmShell();
    });
  });
});
