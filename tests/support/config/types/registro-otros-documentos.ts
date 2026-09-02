/** Tenant-specific test data for the Registro Otros documentos module. */
export interface RegistroOtrosDocumentosTenantConfig {
  registroOtrosDocumentosViewNames: readonly string[];
  registroOtrosDocumentosEnabledViewNames: readonly string[];
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

/** Otros documentos view label (tenant-specific at runtime). */
export type RegistroOtrosDocumentosViewName = string;
