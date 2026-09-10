import type {
  RegistroWizardDropdownOptionsMap,
  RegistroWizardFieldDefinition,
} from './registro-wizard';

/** Datos de prueba específicos del tenant para el módulo Registro Contratos combustible. */
export interface RegistroCttosCombustibleTenantConfig {
  registroCttosCombustibleTabNames: readonly string[];
  registroCttosCombustibleEnabledTabNames: readonly string[];
  registroCttosCombustibleLockedTabNames: readonly string[];
  registroCttosCombustibleDefaultTab: string;
  registroCttosCombustibleLayoutATab: string;
  registroCttosCombustibleLayoutBTab: string;
  registroCttosCombustibleLayoutCTab: string;
  registroCttosCombustibleTransporteColumns: readonly string[];
  registroCttosCombustibleSuministroColumns: readonly string[];
  registroCttosCombustibleTransporteNuevoRegistroWizardSteps: readonly string[];
  registroCttosCombustibleSuministroNuevoRegistroWizardSteps: readonly string[];
  registroCttosCombustibleTransporteNuevoRegistroFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroCttosCombustibleSuministroNuevoRegistroFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroCttosCombustibleTransporteNuevoRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroCttosCombustibleSuministroNuevoRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroCttosCombustibleTabSlugs: Record<string, string>;
  registroCttosCombustibleTabBreadcrumbs: Record<string, string>;
}

/** Etiqueta de pestaña habilitada de Contratos combustible (específica del tenant en runtime). */
export type RegistroCttosCombustibleTabName = string;
