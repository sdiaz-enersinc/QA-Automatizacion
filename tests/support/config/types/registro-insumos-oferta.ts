import type {
  RegistroWizardDropdownOptionsMap,
  RegistroWizardFieldDefinition,
} from './registro-wizard';

/** Datos de prueba específicos del tenant para el módulo Registro Insumos oferta. */
export interface RegistroInsumosOfertaTenantConfig {
  registroInsumosOfertaSubmoduleLabel: string;
  registroInsumosOfertaLegacySubmoduleLabel: string;
  registroInsumosOfertaLegacyBreadcrumb: string;
  registroInsumosOfertaAgrLabel: string;
  registroInsumosOfertaAbsentLabels: readonly string[];
  registroInsumosOfertaTabNames: readonly string[];
  registroInsumosOfertaEnabledTabNames: readonly string[];
  registroInsumosOfertaLockedTabNames: readonly string[];
  registroInsumosOfertaCalendarWeekdayHeaders: readonly string[];
  registroInsumosOfertaCalendarAnoMonthCells: readonly string[];
  registroInsumosOfertaCalendarYearOptions: readonly string[];
  registroInsumosOfertaCalendarMonthOptions: readonly string[];
  registroInsumosOfertaCalendarMonthOptionsScroll: readonly string[];
  registroInsumosOfertaParametrosRegasColumns: readonly string[];
  registroInsumosOfertaOefProyectadaColumns: readonly string[];
  registroInsumosOfertaConceptosOcColumns: readonly string[];
  registroInsumosOfertaCostosRegasColumns: readonly string[];
  registroInsumosOfertaGestionConceptosColumns: readonly string[];
  registroInsumosOfertaOefNuevoRegistroWizardSteps: readonly string[];
  registroInsumosOfertaOefWizardDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroInsumosOfertaConceptoUnidadOptions: readonly string[];
  registroInsumosOfertaConceptosOcRegistroDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroInsumosOfertaOefNuevoRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroInsumosOfertaConceptoFormFields: readonly RegistroWizardFieldDefinition[];
  registroInsumosOfertaConceptosOcRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroInsumosOfertaConceptosOcRegistroSpinbuttonLabels: readonly string[];
  registroInsumosOfertaParametrosRegasFormLabels: readonly string[];
  registroInsumosOfertaTabSlugs: Record<string, string>;
  registroInsumosOfertaTabBreadcrumbs: Record<string, string>;
  registroInsumosOfertaSidebarHrefs: Record<string, string>;
}

/** Etiqueta de pestaña de Insumos oferta (específica del tenant en runtime). */
export type RegistroInsumosOfertaTabName = string;
