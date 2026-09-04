// spec: specs/Registro/emug-registro-toolbar-chips-removed.plan.md
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
  REGISTRO_OTROS_DOCUMENTOS_ENABLED_VIEW_NAMES,
  RegistroOtrosDocumentosNavigationPage,
} from '../../../../../support/pages/registro/otros-documentos';

test.describe('Vistas que ya carecían de chips permanecen sin chips', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_ENABLED_VIEW_NAMES,
    );
  });

  test('Otros documentos hidrología y contadores sin Filtros ni chips', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroOtrosDocumentosNavigationPage(page);

    await dashboardPage.expectLoaded();

    // Hidrologia por menú lateral; Contadores por URL mientras el sidebar esté roto.
    for (const view of REGISTRO_OTROS_DOCUMENTOS_ENABLED_VIEW_NAMES) {
      await whenTabEnabled(
        MODULE_IDS.registroOtrosDocumentos,
        view,
        async () => {
          if (REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS.includes(view)) {
            await registro.openOtrosDocumentosByUrl(view);
          } else {
            await registro.openOtrosDocumentosFromSidebar(view);
          }
          await registro.expectOtrosDocumentosViewActive(view);
          await registro.expectOtrosDocumentosToolbar();
        },
        `view: ${view}`,
      );
    }
  });
});
