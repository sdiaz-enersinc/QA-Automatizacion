// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroOtrosDocumentosNavigationPage } from '../../../../../support/pages/registro/otros-documentos';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
  skipUnlessTabEnabled(MODULE_IDS.registroOtrosDocumentos, 'Hidrologia Horaria');
});

/**
 * Abre Otros documentos en Hidrologia Horaria para que los specs de generador y layout partan de un shell conocido.
 */
test('Seed — shell de Otros documentos en Hidrologia Horaria', async ({ page, dashboardPage }) => {
  const registro = new RegistroOtrosDocumentosNavigationPage(page);
  await dashboardPage.expectLoaded();
  await registro.openOtrosDocumentosFromSidebar('Hidrologia Horaria');
  await registro.expectOtrosDocumentosViewActive('Hidrologia Horaria');
  await registro.expectGestorDeDatosOtrosDocumentosShell();
});
