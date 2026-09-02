// spec: specs/Registro/historial-playwright-test.plan.md
// seed: tests/tenants/emug/registro/historial/seed-historial.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_HISTORIAL_OPERACIONES_INDIVIDUALES_COLUMNS,
  RegistroHistorialNavigationPage,
} from '../../../../../support/pages/registro/historial';

test.describe('Historial — Pestaña Operaciones individuales', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroHistorial);
    skipUnlessTabEnabled(MODULE_IDS.registroHistorial, 'Operaciones individuales');
  });

  test('Operaciones individuales — Pestañas, discrepancia del breadcrumb, filtros de toolbar y columnas de grilla', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroHistorialNavigationPage(page);

    await test.step('1. Abrir Operaciones individuales desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openHistorialFromSidebar('Operaciones individuales');
      await registro.expectGestorDeDatosHistorialShell();
      await registro.expectHistorialViewActive('Operaciones individuales');
    });

    await test.step('2. Validar la discrepancia entre pestaña y breadcrumb/URL', async () => {
      // PROBLEMA CONOCIDO — cuando se corrija, actualizar las aserciones para que coincidan con la etiqueta de la pestaña.
      await registro.expectHistorialTabBreadcrumbDiscrepancy('Operaciones individuales');
    });

    await test.step('3. Validar la barra de herramientas (búsqueda y Filtros; sin chips)', async () => {
      await registro.expectHistorialOperacionesToolbar();
    });

    await test.step('4. Abrir y cerrar el diálogo Filtros sin aplicar un filtro', async () => {
      await registro.expectFiltrosModalOpensAndCloses();
    });

    await test.step('5. Validar los encabezados de columna de la grilla', async () => {
      await registro.expectGridColumnHeaders(REGISTRO_HISTORIAL_OPERACIONES_INDIVIDUALES_COLUMNS);
    });
  });
});
