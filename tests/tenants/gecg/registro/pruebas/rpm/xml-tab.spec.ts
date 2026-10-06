// plan: specs/Registro/gecg-empresas-rpm-integration.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/rpm/seed-rpm.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_RPM_DEFAULT_TAB,
  REGISTRO_RPM_XML_COLUMNS,
  RegistroRpmNavigationPage,
} from '../../../../../support/pages/registro/rpm';

test.describe('RPM XML — Grilla y diálogos', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroRpm);
    skipUnlessTabEnabled(MODULE_IDS.registroRpm, REGISTRO_RPM_DEFAULT_TAB);
  });

  test('XML — Grilla, barra de herramientas, filtros, Crear Registro y Cargar Archivo', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(300_000);
    const registro = new RegistroRpmNavigationPage(page);

    await test.step('1. Abrir RPM XML desde el menú lateral', async () => {
      await dashboardPage.expectLoaded();
      await registro.openRpmFromSidebar(REGISTRO_RPM_DEFAULT_TAB);
      await registro.expectRpmViewActive(REGISTRO_RPM_DEFAULT_TAB);
    });

    await test.step('2. Validar columnas, barra, filtros y diálogos', async () => {
      await registro.expectRpmXmlGridColumnHeaders(REGISTRO_RPM_XML_COLUMNS);
      await registro.expectRpmXmlToolbar();
      await registro.expectFiltrosModalOpensAndCloses();
      await registro.expectCrearRegistroDialogOpensAndCloses();
      await registro.expectCargarArchivoDialogOpensAndCloses();
    });
  });
});
