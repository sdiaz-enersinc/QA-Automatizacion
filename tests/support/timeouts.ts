/**
 * Shared timeouts for slow or cross-browser UI (QA env, WebKit, etc.).
 */
export const DASHBOARD_LOAD_TIMEOUT_MS = 10_000;

/**
 * Time to allow after "Continuar" on the email step while the app shows
 * "Verificando correo..." before the password view is interactive.
 */
export const CREDENTIALS_VIEW_TIMEOUT_MS = 10_000;
