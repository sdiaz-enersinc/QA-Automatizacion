import { BASE_URL } from './env';

/**
 * Construye la URL de entrada a partir de `BASE_URL`,
 * normalizando la barra final para que siempre termine en `/`.
 */
export function entryUrl(): string {
  return `${BASE_URL.replace(/\/$/, '')}/`;
}

/**
 * URL del endpoint que invalida `access_token` y `refresh_token` del contexto autenticado.
 */
export function logoutUrl(): string {
  return `${BASE_URL.replace(/\/$/, '')}/api-token-logout/`;
}
