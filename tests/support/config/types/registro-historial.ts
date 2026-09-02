/** Datos de prueba específicos del tenant para el módulo Registro Historial. */
export interface RegistroHistorialTenantConfig {
  registroHistorialTabNames: readonly string[];
  registroHistorialEnabledTabNames: readonly string[];
  registroHistorialLockedTabNames: readonly string[];
  registroHistorialOperacionesMultiplesColumns: readonly string[];
  registroHistorialOperacionesIndividualesColumns: readonly string[];
  registroHistorialArchivosCargadosColumns: readonly string[];
  registroHistorialTabSlugs: Record<string, string>;
  registroHistorialTabBreadcrumbs: Record<string, string>;
  registroHistorialSidebarHrefs: Record<string, string>;
}

/** Etiqueta de pestaña de Historial (específica del tenant en runtime). */
export type RegistroHistorialTabName = string;
