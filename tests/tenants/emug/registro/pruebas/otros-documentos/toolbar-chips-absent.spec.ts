// spec: specs/Registro/emug-registro-toolbar-chips-removed.plan.md
// seed: tests/tenants/emug/registro/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroOtrosDocumentosNavigationPage } from '../../../../../support/pages/registro/otros-documentos';

test.describe('Views that already lacked chips stay chip-free', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
  });

  test('Otros documentos hidrologia and contadores have no Filtros and no chips', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroOtrosDocumentosNavigationPage(page);

    // 1. Open Hidrologia Horaria and Contadores Frt.
    skipUnlessTabEnabled(MODULE_IDS.registroOtrosDocumentos, 'Hidrologia Horaria');
    await dashboardPage.expectLoaded();
    await registro.openOtrosDocumentosFromSidebar('Hidrologia Horaria');
    await registro.expectOtrosDocumentosViewActive('Hidrologia Horaria');
    await registro.expectOtrosDocumentosToolbar();

    skipUnlessTabEnabled(MODULE_IDS.registroOtrosDocumentos, 'Hidrologia Diaria');
    await registro.openOtrosDocumentosTab('Hidrologia Diaria');
    await registro.expectOtrosDocumentosViewActive('Hidrologia Diaria');
    await registro.expectOtrosDocumentosToolbar();

    skipUnlessTabEnabled(MODULE_IDS.registroOtrosDocumentos, 'Contadores Frt');
    await page.goto('/gestor-de-datos/otros-documentos/contadores-frt');
    await registro.expectOtrosDocumentosViewActive('Contadores Frt');
    await registro.expectOtrosDocumentosToolbar();

    skipUnlessTabEnabled(MODULE_IDS.registroOtrosDocumentos, 'Contadores INTI');
    await registro.openOtrosDocumentosTab('Contadores INTI');
    await registro.expectOtrosDocumentosViewActive('Contadores INTI');
    await registro.expectOtrosDocumentosToolbar();
  });
});
