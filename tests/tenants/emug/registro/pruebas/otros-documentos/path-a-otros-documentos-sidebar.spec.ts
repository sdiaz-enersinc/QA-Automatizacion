// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import {
  skipUnlessAnyTabEnabled,
  skipUnlessModuleEnabled,
  whenTabEnabled,
} from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS,
  REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS,
  RegistroOtrosDocumentosNavigationPage,
} from '../../../../../support/pages/registro/otros-documentos';

test.describe('Escenario 2 — Navegación por menú lateral y cruce de pestañas', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
  });

  test('Path A — cada vista de Hidrologia accesible por enlaces anidados del menú lateral', async ({
    page,
    dashboardPage,
  }) => {
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS,
    );
    test.setTimeout(120_000);
    const registro = new RegistroOtrosDocumentosNavigationPage(page);

    // 1. Preparar: expandir menú lateral Registro hasta ver los grupos anidados.
    await dashboardPage.expectLoaded();
    await registro.expectOtrosDocumentosSubmenuGroupsVisible();

    // 2. Actuar + verificar: abrir cada vista de Hidrologia por menú lateral.
    for (const viewName of REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS) {
      await whenTabEnabled(
        MODULE_IDS.registroOtrosDocumentos,
        viewName,
        async () => {
          await registro.openOtrosDocumentosFromSidebar(viewName);
          await registro.expectOtrosDocumentosViewActive(viewName);
          await registro.expectOtrosDocumentosPairTabVisible(viewName);
          await registro.expectGestorDeDatosOtrosDocumentosShell();
        },
        `view: ${viewName}`,
      );
    }
  });

  test.fixme(
    'Acceso roto a Contadores lo daña / Path A — cada vista de Contadores accesible por enlaces anidados del menú lateral',
    async ({ page, dashboardPage }) => {
      skipUnlessAnyTabEnabled(
        MODULE_IDS.registroOtrosDocumentos,
        REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS,
      );
      test.setTimeout(120_000);
      const registro = new RegistroOtrosDocumentosNavigationPage(page);

      // 1. Preparar: expandir menú lateral Registro hasta ver los grupos anidados.
      await dashboardPage.expectLoaded();
      await registro.expectOtrosDocumentosSubmenuGroupsVisible();

      // 2. Actuar + verificar: abrir cada vista de Contadores por menú lateral.
      for (const viewName of REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS) {
        await whenTabEnabled(
          MODULE_IDS.registroOtrosDocumentos,
          viewName,
          async () => {
            await registro.openOtrosDocumentosFromSidebar(viewName);
            await registro.expectOtrosDocumentosViewActive(viewName);
            await registro.expectOtrosDocumentosPairTabVisible(viewName);
            await registro.expectGestorDeDatosOtrosDocumentosShell();
          },
          `view: ${viewName}`,
        );
      }
    },
  );
});
