// plan: specs/Registro/historial-playwright-test.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/historial/seed-historial.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import {
  REGISTRO_HISTORIAL_ARCHIVOS_CARGADOS_TAB,
  REGISTRO_HISTORIAL_DEFAULT_TAB,
  REGISTRO_HISTORIAL_OPERACIONES_INDIVIDUALES_TAB,
  RegistroHistorialNavigationPage,
} from '../../../../../support/pages/registro/historial';

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
      await registro.openHistorialFromSidebar(REGISTRO_HISTORIAL_DEFAULT_TAB);
      await registro.expectHistorialViewActive(REGISTRO_HISTORIAL_DEFAULT_TAB);
      await registro.expectHistorialTabStripVisible();
    });

    await test.step('2. Abrir la pestaña Operaciones individuales y validar la tabla', async () => {
      await registro.openHistorialTab(REGISTRO_HISTORIAL_OPERACIONES_INDIVIDUALES_TAB);
      await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();
      await expect(page.getByRole('navigation')).toContainText('Datos modificados');
      await expect(page.getByRole('navigation')).not.toContainText(
        REGISTRO_HISTORIAL_OPERACIONES_INDIVIDUALES_TAB,
      );
    });

    await test.step('3. Abrir la pestaña Archivos cargados y validar la tabla', async () => {
      await registro.openHistorialTab(REGISTRO_HISTORIAL_ARCHIVOS_CARGADOS_TAB);
      await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();
      await expect(page.getByRole('navigation')).toContainText(REGISTRO_HISTORIAL_ARCHIVOS_CARGADOS_TAB);
    });

    await test.step('4. Volver a la pestaña Operaciones multiples', async () => {
      await registro.openHistorialTab(REGISTRO_HISTORIAL_DEFAULT_TAB);
      await expect(page.getByRole('navigation')).toContainText('Datos eliminados');
      await expect(page.getByRole('navigation')).not.toContainText(REGISTRO_HISTORIAL_DEFAULT_TAB);
    });
  });
});
