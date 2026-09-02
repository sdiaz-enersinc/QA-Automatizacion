// spec: specs/Registro/empresas-playwright-test.plan.md
// seed: tests/tenants/emug/registro/empresas/seed-empresas.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_EMPRESAS_COLUMNS,
  RegistroEmpresasNavigationPage,
} from '../../../../../support/pages/registro/empresas';

test.describe('Empresas — Grilla Layout A', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroEmpresas);
  });

  test('Layout A — Discrepancia del breadcrumb, barra de herramientas, columnas de grilla y diálogo Nuevo Cliente/Proveedor', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(120_000);
    const registro = new RegistroEmpresasNavigationPage(page);

    await test.step('1. Abrir Empresas desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openEmpresasFromSidebar();
      await registro.expectGestorDeDatosEmpresasShell();
      await registro.expectEmpresasViewActive();
    });

    await test.step('2. Validar la discrepancia entre pestaña y etiqueta del breadcrumb', async () => {
      await registro.expectEmpresasTabBreadcrumbDiscrepancy();
    });

    await test.step('3. Validar la barra de herramientas (búsqueda y CTA; sin chips de filtro)', async () => {
      await registro.expectEmpresasToolbar();
    });

    await test.step('4. Validar los encabezados de columna de la grilla', async () => {
      await registro.expectEmpresasGridColumnHeaders(REGISTRO_EMPRESAS_COLUMNS);
    });

    await test.step('5. Validar apertura y cierre del diálogo Nuevo Cliente/Proveedor', async () => {
      await registro.expectNuevoClienteProveedorDialogOpensAndCloses();
    });
  });
});
