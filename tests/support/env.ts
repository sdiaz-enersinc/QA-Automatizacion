import dotenv from 'dotenv';

dotenv.config({ quiet: true });

/** Application base URL from `BASE_URL`. */
export const BASE_URL = process.env.BASE_URL ?? '';

/** Valid login email from `VALID_EMAIL`. */
export const VALID_EMAIL = process.env.VALID_EMAIL ?? '';

/** Invalid login email from `INVALID_EMAIL`. */
export const INVALID_EMAIL = process.env.INVALID_EMAIL ?? 'a';

/** Valid login password from `VALID_PASSWORD`. */
export const VALID_PASSWORD = process.env.VALID_PASSWORD ?? '';

/** Invalid login password from `INVALID_PASSWORD`. */
export const INVALID_PASSWORD = process.env.INVALID_PASSWORD ?? 'wrong-password';

/** Active tenant id from `TEST_TENANT`. Defaults to `emug` when unset. */
export const TEST_TENANT = process.env.TEST_TENANT ?? 'emug';
