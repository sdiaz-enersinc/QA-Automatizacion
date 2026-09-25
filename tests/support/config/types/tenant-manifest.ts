/** Entrada de habilitación por módulo o grupo en el manifiesto del tenant. */
export interface TenantModuleEntry {
  enabled: boolean;
  /** Si es true en un submódulo, todas las pestañas/vistas del JSON del módulo están activas (no solo *EnabledTabNames). */
  full?: boolean;
}

/** Valor de módulo en tenant.json: booleano corto o entrada explícita. */
export type TenantModuleManifestValue = boolean | TenantModuleEntry;

/** Manifiesto crudo de tenant.json (antes de normalizar). */
export interface TenantManifestRaw {
  modules: Record<string, TenantModuleManifestValue>;
}

/** Registro a nivel tenant de qué módulos de prueba están activos (fuente única de encendido/apagado). */
export interface TenantManifest {
  modules: Record<string, TenantModuleEntry>;
}
