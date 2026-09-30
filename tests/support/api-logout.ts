import { BrowserContext } from '@playwright/test';
import { logoutUrl } from './urls';

/**
 * Cierra la sesión del servidor con POST `api-token-logout/`.
 * Usa las cookies del contexto (`access_token`, `refresh_token`) y la cabecera QA bypass.
 * No lanza error si el logout falla, para no enmascarar fallos de los tests en el teardown.
 *
 * @param context - Contexto de Playwright con sesión autenticada.
 */
export async function logoutViaApi(context: BrowserContext): Promise<void> {
  try {
    const response = await context.request.post(logoutUrl(), {
      headers: {
        'QA-Bypass-Token': process.env.TOKEN_BYPASS || '',
      },
    });

    if (!response.ok()) {
      console.warn(`[logout] POST api-token-logout/ → HTTP ${response.status()}`);
    }
  } catch (error) {
    console.warn('[logout] POST api-token-logout/ failed:', error);
  }
}
