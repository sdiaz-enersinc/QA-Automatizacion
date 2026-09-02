import { BASE_URL } from './env';

/**
 * Builds the application entry URL from the configured BASE_URL,
 * normalizing any trailing slash so callers always get a single
 * trailing "/".
 */
export function entryUrl(): string {
  return `${BASE_URL.replace(/\/$/, '')}/`;
}
