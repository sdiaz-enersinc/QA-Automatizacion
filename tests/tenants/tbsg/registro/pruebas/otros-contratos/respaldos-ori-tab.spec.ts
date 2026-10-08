// plan: specs/Registro/tbsg-registro-ui.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/otros-contratos/seed-otros-contratos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import { RegistroOtrosContratosNavigationPage } from '../../../../../support/pages/registro/otros-contratos';

const RESPALDOS_ORI_TAB = 'Respaldos ORI';

test.describe('Otros contratos — Respaldos ORI', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
    skipUnlessTabEnabled(MODULE_IDS.registroOtrosContratos, RESPALDOS_ORI_TAB);
  });

  test('Respaldos ORI — vista habilitada con Cargar Archivo y sin Nuevo Registro', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroOtrosContratosNavigationPage(page);

    await test.step('1. Abrir Respaldos ORI desde el menú lateral', async () => {
      await dashboardPage.expectLoaded();
      await registro.openOtrosContratosFromSidebar(RESPALDOS_ORI_TAB);
      await registro.expectOtrosContratosTabActive(RESPALDOS_ORI_TAB);
      await registro.expectGestorDeDatosOtrosContratosShell();
    });

    await test.step('2. Validar breadcrumb y barra propios de tbsg', async () => {
      await expect(page).toHaveURL(/contratos-respaldos-tbsg/);
      await expect(page.getByRole('navigation')).toContainText('Contratos respaldos tbsg');
      const main = page.getByRole('main');
      await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
      await expect(main.getByRole('button', { name: 'Cargar Archivo' })).toBeVisible();
      await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toHaveCount(0);
    });
  });
});
