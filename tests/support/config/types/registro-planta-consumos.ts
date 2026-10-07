import type {
  RegistroWizardDropdownOptionsMap,
  RegistroWizardFieldDefinition,
} from './registro-wizard';

/** Datos de prueba específicos del tenant para el módulo Registro Planta y consumos. */
export interface RegistroPlantaConsumosTenantConfig {
  registroPlantaConsumosSubmoduleLabel: string;
  registroPlantaConsumosBreadcrumbSegment: string;
  registroPlantaConsumosTabNames: readonly string[];
  registroPlantaConsumosEnabledTabNames: readonly string[];
  registroPlantaConsumosLockedTabNames: readonly string[];
  registroPlantaConsumosDefaultTab: string;
  registroPlantaConsumosLayoutATab: string;
  registroPlantaConsumosHeatRateTab: string;
  registroPlantaConsumosParametrosRegasTab: string;
  registroPlantaConsumosOefProyectadaTab: string;
  registroPlantaConsumosConceptosOcTab: string;
  registroPlantaConsumosDiarioPromigasTab: string;
  registroPlantaConsumosHorarioPromigasTab: string;
  registroPlantaConsumosCostosRegasTab: string;
  registroPlantaConsumosGestionConceptosTab: string;
  registroPlantaConsumosCalendarWeekdayHeaders: readonly string[];
  registroPlantaConsumosCalendarAnoMonthCells: readonly string[];
  registroPlantaConsumosCalendarYearOptions: readonly string[];
  registroPlantaConsumosCalendarMonthOptions: readonly string[];
  registroPlantaConsumosCalendarMonthOptionsScroll: readonly string[];
  registroPlantaConsumosHeatRateColumns: readonly string[];
  registroPlantaConsumosParametrosRegasColumns: readonly string[];
  registroPlantaConsumosOefProyectadaColumns: readonly string[];
  registroPlantaConsumosConceptosOcColumns: readonly string[];
  registroPlantaConsumosCostosRegasColumns: readonly string[];
  registroPlantaConsumosGestionConceptosColumns: readonly string[];
  registroPlantaConsumosHeatRateNuevoRegistroWizardSteps: readonly string[];
  registroPlantaConsumosOefNuevoRegistroWizardSteps: readonly string[];
  registroPlantaConsumosHeatRateWizardDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroPlantaConsumosOefWizardDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroPlantaConsumosConceptoUnidadOptions: readonly string[];
  registroPlantaConsumosConceptosOcRegistroDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroPlantaConsumosHeatRateNuevoRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroPlantaConsumosOefNuevoRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroPlantaConsumosConceptoFormFields: readonly RegistroWizardFieldDefinition[];
  registroPlantaConsumosConceptosOcRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroPlantaConsumosConceptosOcRegistroSpinbuttonLabels: readonly string[];
  registroPlantaConsumosParametrosRegasFormLabels: readonly string[];
  registroPlantaConsumosTabSlugs: Record<string, string>;
  registroPlantaConsumosTabBreadcrumbs: Record<string, string>;
}

/** Etiqueta de pestaña de Planta y consumos (específica del tenant en runtime). */
export type RegistroPlantaConsumosTabName = string;
