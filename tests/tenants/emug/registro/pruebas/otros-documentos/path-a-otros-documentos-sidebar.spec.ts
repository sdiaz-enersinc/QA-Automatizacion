// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAnyTabEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_DOCUMENTOS_ENABLED_VIEW_NAMES,
  RegistroOtrosDocumentosNavigationPage,
} from '../../../../../support/pages/registro/otros-documentos';

test.describe('Escenario 2 — Navegación por menú lateral y cruce de pestañas', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_ENABLED_VIEW_NAMES,
    );
  });

  test.fixme('Acceso roto a Contadores lo daña / Path A — cada vista de Otros documentos accesible por enlaces anidados del menú lateral', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(120_000);
    const registro = new RegistroOtrosDocumentosNavigationPage(page);

    // 1. Preparar: expandir menú lateral Registro hasta que el submenú desplegable anidado de Otros documentos sea visible.
    await dashboardPage.expectLoaded();
    await registro.expectOtrosDocumentosSubmenuGroupsVisible();

    for (const viewName of REGISTRO_OTROS_DOCUMENTOS_ENABLED_VIEW_NAMES) {
      // 2–5. Actuar + verificar: abrir cada vista por menú lateral y verificar URL, breadcrumb, pestaña y grilla.
      await registro.openOtrosDocumentosFromSidebar(viewName);
      await registro.expectOtrosDocumentosViewActive(viewName);
      await registro.expectOtrosDocumentosPairTabVisible(viewName);
    }
  });
});
