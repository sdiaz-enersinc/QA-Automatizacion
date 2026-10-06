// plan: specs/Registro/gecg-empresas-rpm-integration.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/rpm/seed-rpm.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import {
  REGISTRO_RPM_DEFAULT_TAB,
  RegistroRpmNavigationPage,
} from '../../../../../support/pages/registro/rpm';

test.describe('RPM XML — Ruta B (hover del tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroRpm);
    skipUnlessTabEnabled(MODULE_IDS.registroRpm, REGISTRO_RPM_DEFAULT_TAB);
  });

  test('Ruta B — El hover del tablero abre RPM en la pestaña XML', async ({ page, dashboardPage }) => {
    const registro = new RegistroRpmNavigationPage(page);

    await test.step('1. Validar el shell del tablero y el hover de RPM', async () => {
      await dashboardPage.expectLoaded();
      await expect(registro.registroDashboardCard()).toBeVisible();
      await registro.expectRpmVisibleOnDashboardHover();
    });

    await test.step('2. Abrir RPM desde el icono del ojo y validar XML', async () => {
      await registro.openRpmFromDashboardGrid();
      await registro.expectRpmViewActive(REGISTRO_RPM_DEFAULT_TAB);
      await expect(page.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
      await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();
    });
  });
});
