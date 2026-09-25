// spec: specs/Registro/historial-playwright-test.plan.md
// seed: tests/tenants/gecg/registro/pruebas/historial/seed-historial.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_HISTORIAL_ARCHIVOS_CARGADOS_COLUMNS,
  REGISTRO_HISTORIAL_ARCHIVOS_CARGADOS_TAB,
  RegistroHistorialNavigationPage,
} from '../../../../../support/pages/registro/historial';

test.describe('Historial — Pestaña Archivos cargados', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroHistorial);
    skipUnlessTabEnabled(MODULE_IDS.registroHistorial, REGISTRO_HISTORIAL_ARCHIVOS_CARGADOS_TAB);
  });

  test('Archivos cargados — Pestañas, breadcrumb alineado, filtros de barra de herramientas y columnas de grilla', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroHistorialNavigationPage(page);

    await test.step('1. Abrir Archivos cargados desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openHistorialFromSidebar(REGISTRO_HISTORIAL_ARCHIVOS_CARGADOS_TAB);
      await registro.expectGestorDeDatosHistorialShell();
      await registro.expectHistorialViewActive(REGISTRO_HISTORIAL_ARCHIVOS_CARGADOS_TAB);
    });

    await test.step('2. Validar la barra de herramientas (búsqueda y Filtros; sin chips)', async () => {
      await registro.expectHistorialOperacionesToolbar();
    });

    await test.step('3. Abrir y cerrar el modal Filtros sin pulsar Añadir filtro', async () => {
      await registro.expectFiltrosModalOpensAndCloses();
    });

    await test.step('4. Validar los encabezados de columna de la grilla', async () => {
      await registro.expectGridColumnHeaders(REGISTRO_HISTORIAL_ARCHIVOS_CARGADOS_COLUMNS);
    });
  });
});
