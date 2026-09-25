// Los tests que usen un fixture de este módulo DEBEN importar test/expect desde aquí,
// no desde '@playwright/test'; de lo contrario el fixture queda undefined.
import { expect } from '@playwright/test';
import { extendWithSharedSession } from './shared-session';
import { entryUrl } from './urls';
import { VALID_EMAIL } from './env';
import { EmailStepPage } from './pages/EmailStepPage';
import { PasswordStepPage } from './pages/PasswordStepPage';
import { DashboardPage } from './pages/DashboardPage';
import { CREDENTIALS_VIEW_TIMEOUT_MS } from './timeouts';

type AuthFixtures = {
  passwordStepPage: PasswordStepPage;
  dashboardPage: DashboardPage;
};

export const test = extendWithSharedSession<AuthFixtures>({
  /**
   * Recorre el paso de correo con VALID_EMAIL y entrega un PasswordStepPage
   * ya verificado como listo. Alcance de test: cada prueba obtiene una página
   * nueva y estado limpio. Usar solo en proyectos no autenticados (email-auth, password-auth).
   */
  passwordStepPage: async ({ page }, use) => {
    await page.goto(entryUrl());
    await new EmailStepPage(page).submit(VALID_EMAIL);

    const passwordStep = new PasswordStepPage(page);
    await passwordStep.expectReady(VALID_EMAIL, CREDENTIALS_VIEW_TIMEOUT_MS);

    await use(passwordStep);
  },

  /**
   * Abre el tablero autenticado en la sesión compartida del worker.
   * Navega de vuelta a la página principal antes de cada test para que el siguiente
   * arranque desde un shell autenticado conocido.
   */
  dashboardPage: async ({ page }, use) => {
    await page.goto(entryUrl());
    const dashboard = new DashboardPage(page);
    await dashboard.expectLoaded();
    await use(dashboard);
  },
});

export { expect };
