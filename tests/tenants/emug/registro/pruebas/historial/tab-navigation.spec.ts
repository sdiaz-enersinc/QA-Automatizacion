// spec: specs/Registro/historial-playwright-test.plan.md
// seed: tests/tenants/emug/registro/historial/seed-historial.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import { RegistroHistorialNavigationPage } from '../../../../../support/pages/registro/historial';

test.describe('Historial — Navegación entre pestañas', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroHistorial);
  });

  test('Navegación cruzada — Operaciones multiples ↔ Operaciones individuales ↔ Archivos cargados', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroHistorialNavigationPage(page);

    await test.step('1. Abrir Operaciones multiples desde el menú lateral y validar la tira de pestañas', async () => {
      await dashboardPage.expectLoaded();
      await registro.openHistorialFromSidebar('Operaciones multiples');
      await registro.expectHistorialViewActive('Operaciones multiples');
      await registro.expectHistorialTabStripVisible();
    });

    await test.step('2. Abrir la pestaña Operaciones individuales y validar la tabla', async () => {
      await registro.openHistorialTab('Operaciones individuales');
      await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();
      // PROBLEMA CONOCIDO — el breadcrumb usa la etiqueta legacy del slug hasta corrección de producto.
      await expect(page.getByRole('navigation')).toContainText('Datos modificados');
      await expect(page.getByRole('navigation')).not.toContainText('Operaciones individuales');
    });

    await test.step('3. Abrir la pestaña Archivos cargados y validar la tabla', async () => {
      await registro.openHistorialTab('Archivos cargados');
      await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();
      await expect(page.getByRole('navigation')).toContainText('Archivos cargados');
    });

    await test.step('4. Volver a la pestaña Operaciones multiples', async () => {
      await registro.openHistorialTab('Operaciones multiples');
      // PROBLEMA CONOCIDO — el breadcrumb usa la etiqueta legacy del slug hasta corrección de producto.
      await expect(page.getByRole('navigation')).toContainText('Datos eliminados');
      await expect(page.getByRole('navigation')).not.toContainText('Operaciones multiples');
    });
  });
});
