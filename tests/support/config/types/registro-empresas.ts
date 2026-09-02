import type {
  RegistroWizardDropdownOptionsMap,
  RegistroWizardFieldDefinition,
} from './registro-wizard';

/** Datos de prueba específicos del tenant para el módulo Registro Empresas. */
export interface RegistroEmpresasTenantConfig {
  registroEmpresasColumns: readonly string[];
  registroEmpresasNuevoClienteProveedorFields: readonly RegistroWizardFieldDefinition[];
  registroEmpresasNuevoClienteProveedorSpinbuttonLabels: readonly string[];
  registroEmpresasNuevoClienteProveedorFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
}
