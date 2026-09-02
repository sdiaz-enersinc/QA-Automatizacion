import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroOtrosDocumentosNavigationPage } from '../../../../../support/pages/registro/otros-documentos';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
  skipUnlessTabEnabled(MODULE_IDS.registroOtrosDocumentos, 'Hidrologia Horaria');
});

test('seed', async ({ page, dashboardPage }) => {
  const registro = new RegistroOtrosDocumentosNavigationPage(page);
  await dashboardPage.expectLoaded();
  await registro.openOtrosDocumentosFromSidebar('Hidrologia Horaria');
  await registro.expectOtrosDocumentosViewActive('Hidrologia Horaria');
});
