import dotenv from 'dotenv';

dotenv.config({ quiet: true });

/** URL base de la aplicación desde `BASE_URL`. */
export const BASE_URL = process.env.BASE_URL ?? '';

/** Correo de login válido desde `VALID_EMAIL`. */
export const VALID_EMAIL = process.env.VALID_EMAIL ?? '';

/** Correo de login inválido desde `INVALID_EMAIL`. */
export const INVALID_EMAIL = process.env.INVALID_EMAIL ?? 'a';

/** Contraseña de login válida desde `VALID_PASSWORD`. */
export const VALID_PASSWORD = process.env.VALID_PASSWORD ?? '';

/** Contraseña de login inválida desde `INVALID_PASSWORD`. */
export const INVALID_PASSWORD = process.env.INVALID_PASSWORD ?? 'wrong-password';

/** Identificador del tenant activo desde `TEST_TENANT`. Vale `emug` si no se define. */
export const TEST_TENANT = process.env.TEST_TENANT ?? 'emug';
