// plan: specs/Registro/otros-documentos-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_VIEW,
  RegistroOtrosDocumentosNavigationPage,
} from '../../../../../support/pages/registro/otros-documentos';

test.describe('Escenario 3 — Validación de componentes e interactividad UI', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
    skipUnlessTabEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_VIEW,
    );
  });

  test('Hidrologia Horaria — shell de grilla y diálogo Cargar archivo', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroOtrosDocumentosNavigationPage(page);
    const view = REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_VIEW;

    await dashboardPage.expectLoaded();
    await registro.openOtrosDocumentosFromSidebar(view);
    await registro.expectOtrosDocumentosViewActive(view);
    await registro.expectOtrosDocumentosToolbar();

    await registro.expectOtrosDocumentosLayout(view);

    await registro.expectFileUploadDialogOpensAndCloses('Cargar archivo');
  });
});
