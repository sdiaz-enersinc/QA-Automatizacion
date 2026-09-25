import { test as base, Browser, BrowserContext, Fixtures, Page } from '@playwright/test';
import { loginViaUi } from './ui-login';

type WorkerFixtures = {
  sharedAuthenticatedContext: BrowserContext | null;
};

/**
 * Indica si el proyecto de Playwright debe reutilizar un contexto de navegador autenticado.
 *
 * @param projectName - Nombre del proyecto de Playwright (worker o test info).
 */
export function usesSharedSession(projectName: string): boolean {
  return !projectName.startsWith('setup-') && !projectName.endsWith('-unauth');
}

/**
 * Crea un contexto de navegador con los mismos valores por defecto que `use` en playwright.config.
 *
 * @param browser - Navegador de Playwright usado para abrir el contexto compartido.
 */
async function createAuthenticatedContext(browser: Browser): Promise<BrowserContext> {
  return browser.newContext({
    baseURL: process.env.BASE_URL,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'QA-Bypass-Token': process.env.TOKEN_BYPASS || '',
    },
  });
}

/**
 * Devuelve la primera página abierta del contexto o crea una si no hay ninguna.
 *
 * @param context - Contexto autenticado compartido.
 */
async function getOrCreateSharedPage(context: BrowserContext): Promise<Page> {
  const openPage = context.pages().find((candidate) => !candidate.isClosed());
  return openPage ?? context.newPage();
}

/**
 * Extiende los fixtures del tenant con un contexto autenticado de alcance worker.
 * Los proyectos autenticados inician sesión una vez por worker; los proyectos unauth y setup
 * conservan el aislamiento por test de Playwright.
 *
 * @param tenantFixtures - Fixtures específicos del tenant (p. ej. dashboardPage).
 */
export function extendWithSharedSession<Extra extends object>(
  tenantFixtures: Fixtures<Extra, {}, Extra, {}>,
) {
  return base
    .extend<Extra, WorkerFixtures>(tenantFixtures)
    .extend<{}, WorkerFixtures>({
      sharedAuthenticatedContext: [
        async ({ browser }, use, workerInfo) => {
          if (!usesSharedSession(workerInfo.project.name)) {
            await use(null);
            return;
          }

          const context = await createAuthenticatedContext(browser);
          const page = await context.newPage();

          await loginViaUi(page);

          await use(context);
          await context.close();
        },
        { scope: 'worker' },
      ],

      context: async ({ context, sharedAuthenticatedContext }, use, testInfo) => {
        if (usesSharedSession(testInfo.project.name) && sharedAuthenticatedContext) {
          await use(sharedAuthenticatedContext);
          return;
        }

        await use(context);
      },

      page: async ({ page, context, sharedAuthenticatedContext }, use, testInfo) => {
        if (usesSharedSession(testInfo.project.name) && sharedAuthenticatedContext) {
          await use(await getOrCreateSharedPage(context));
          return;
        }

        await use(page);
      },
    });
}
