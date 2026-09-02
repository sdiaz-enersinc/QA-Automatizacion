import { test as base, Browser, BrowserContext, Fixtures, Page } from '@playwright/test';
import { loginViaUi } from './ui-login';

type WorkerFixtures = {
  sharedAuthenticatedContext: BrowserContext | null;
};

/**
 * Returns whether the Playwright project should reuse one authenticated browser context.
 *
 * @param projectName - Playwright project name from worker or test info.
 */
export function usesSharedSession(projectName: string): boolean {
  return !projectName.startsWith('setup-') && !projectName.endsWith('-unauth');
}

/**
 * Creates a browser context with the same defaults as playwright.config `use`.
 *
 * @param browser - Playwright browser used to open the shared context.
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
 * Returns the first open page in a context or creates one when none exist.
 *
 * @param context - Shared authenticated browser context.
 */
async function getOrCreateSharedPage(context: BrowserContext): Promise<Page> {
  const openPage = context.pages().find((candidate) => !candidate.isClosed());
  return openPage ?? context.newPage();
}

/**
 * Extends tenant fixtures with a worker-scoped authenticated browser context.
 * Authenticated projects log in once per worker; unauth and setup projects keep
 * Playwright's default per-test isolation.
 *
 * @param tenantFixtures - Tenant-specific test fixtures (e.g. dashboardPage).
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
