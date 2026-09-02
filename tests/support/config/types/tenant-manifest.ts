/** Per-module or module-group enable/disable entry in a tenant manifest. */
export interface TenantModuleEntry {
  enabled: boolean;
  /** When true on a submodule, all tabs/views from the module JSON are active (not only *EnabledTabNames). */
  full?: boolean;
}

/** Module value in tenant.json: boolean shorthand or explicit entry. */
export type TenantModuleManifestValue = boolean | TenantModuleEntry;

/** Raw tenant manifest as stored in tenant.json (before normalization). */
export interface TenantManifestRaw {
  modules: Record<string, TenantModuleManifestValue>;
}

/** Tenant-level registry of which test modules are active (single source for module on/off). */
export interface TenantManifest {
  modules: Record<string, TenantModuleEntry>;
}
