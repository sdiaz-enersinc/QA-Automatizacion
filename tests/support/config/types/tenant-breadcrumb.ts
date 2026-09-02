/** Plain string or regex breadcrumb matcher stored in tenant JSON. */
export type TenantBreadcrumbMatcher =
  | string
  | {
      regex: string;
      flags?: string;
    };
