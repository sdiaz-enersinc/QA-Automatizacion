/** Coincidencia de miga de pan: texto plano o regex guardada en el JSON del tenant. */
export type TenantBreadcrumbMatcher =
  | string
  | {
      regex: string;
      flags?: string;
    };
