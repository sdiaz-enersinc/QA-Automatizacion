// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import {
  skipUnlessAnyTabEnabled,
  skipUnlessModuleEnabled,
  skipUnlessTabEnabled,
} from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS,
  RegistroOtrosDocumentosNavigationPage,
} from '../../../../../support/pages/registro/otros-documentos';

test.describe('Escenario 3 — Validación de componentes e interactividad UI', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS,
    );
  });

  for (const view of REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS) {
    test(`Hidrologia — shell de grilla y diálogo Cargar archivo (${view})`, async ({
      page,
      dashboardPage,
    }) => {
      skipUnlessTabEnabled(MODULE_IDS.registroOtrosDocumentos, view);
      test.setTimeout(180_000);
      const registro = new RegistroOtrosDocumentosNavigationPage(page);

      // 1. Preparar: navegar a la vista por menú lateral.
      await dashboardPage.expectLoaded();
      await registro.openOtrosDocumentosFromSidebar(view);
      await registro.expectOtrosDocumentosViewActive(view);
      await registro.expectOtrosDocumentosToolbar();

      // 2. Verificar estructura de tabla (columnas + extras específicos de la vista).
      await registro.expectOtrosDocumentosLayout(view);

      // 3. Abrir y cerrar el diálogo Cargar archivo (dropzone + Guardar).
      await registro.expectFileUploadDialogOpensAndCloses('Cargar archivo');
    });
  }
});
