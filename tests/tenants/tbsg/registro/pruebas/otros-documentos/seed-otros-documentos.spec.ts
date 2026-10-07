// plan: specs/Registro/otros-documentos-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_DOCUMENTOS_DEFAULT_VIEW,
  RegistroOtrosDocumentosNavigationPage,
} from '../../../../../support/pages/registro/otros-documentos';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
  skipUnlessTabEnabled(MODULE_IDS.registroOtrosDocumentos, REGISTRO_OTROS_DOCUMENTOS_DEFAULT_VIEW);
});

/**
 * Abre Otros documentos en Hidrologia Horaria para que los specs de generador y layout partan de un shell conocido.
 */
test('Semilla — shell de Otros documentos en Hidrologia Horaria', async ({ page, dashboardPage }) => {
  const registro = new RegistroOtrosDocumentosNavigationPage(page);
  await dashboardPage.expectLoaded();
  await registro.openOtrosDocumentosFromSidebar(REGISTRO_OTROS_DOCUMENTOS_DEFAULT_VIEW);
  await registro.expectOtrosDocumentosViewActive(REGISTRO_OTROS_DOCUMENTOS_DEFAULT_VIEW);
  await registro.expectGestorDeDatosOtrosDocumentosShell();
});
