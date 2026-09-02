// spec: specs/Registro/historial-playwright-test.plan.md
// seed: tests/tenants/emug/registro/historial/seed-historial.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_HISTORIAL_ARCHIVOS_CARGADOS_COLUMNS,
  RegistroHistorialNavigationPage,
} from '../../../../../support/pages/registro/historial';

test.describe('Historial — Pestaña Archivos cargados', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroHistorial);
    skipUnlessTabEnabled(MODULE_IDS.registroHistorial, 'Archivos cargados');
  });

  test('Archivos cargados — Pestañas, breadcrumb alineado, filtros de toolbar (modal Filtros sin Añadir filtro) y columnas de grilla', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroHistorialNavigationPage(page);

    await test.step('1. Abrir Archivos cargados desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openHistorialFromSidebar('Archivos cargados');
      await registro.expectGestorDeDatosHistorialShell();
      await registro.expectHistorialViewActive('Archivos cargados');
    });

    await test.step('2. Validar la barra de herramientas (búsqueda y Filtros; sin chips)', async () => {
      await registro.expectHistorialOperacionesToolbar();
    });

    await test.step('3. Abrir y cerrar el modal Filtros sin pulsar Añadir filtro', async () => {
      await registro.expectFiltrosModalOpensAndCloses();
      // await registro.expectHistorialFiltrosApplyFilter('Producto', '<value>'); // bloqueado: problema conocido de Añadir filtro en Archivos cargados
    });

    await test.step('4. Validar los encabezados de columna de la grilla', async () => {
      await registro.expectGridColumnHeaders(REGISTRO_HISTORIAL_ARCHIVOS_CARGADOS_COLUMNS);
    });
  });
});
