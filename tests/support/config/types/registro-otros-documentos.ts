/** Datos de prueba específicos del tenant para el módulo Registro Otros documentos. */
export interface RegistroOtrosDocumentosTenantConfig {
  registroOtrosDocumentosViewNames: readonly string[];
  registroOtrosDocumentosEnabledViewNames: readonly string[];
  registroOtrosDocumentosDefaultView: string;
  registroOtrosDocumentosHidrologiaViews: readonly string[];
  registroOtrosDocumentosContadoresViews: readonly string[];
  registroOtrosDocumentosHidrologiaHorariaColumns: readonly string[];
  registroOtrosDocumentosHidrologiaDiariaColumns: readonly string[];
  registroOtrosDocumentosContadoresColumns: readonly string[];
  registroOtrosDocumentosViewSlugs: Record<string, string>;
  registroOtrosDocumentosViewBreadcrumbs: Record<string, string>;
  registroOtrosDocumentosNestedGroup: Record<string, string>;
  registroOtrosDocumentosTabPairMate: Record<string, string>;
}

/** Etiqueta de vista de Otros documentos (específica del tenant en runtime). */
export type RegistroOtrosDocumentosViewName = string;
