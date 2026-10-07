import { expect, Locator } from '@playwright/test';
import {
  getRegistroPlantaConsumosConfig,
  getModuleEnabledTabNames,
  isModuleEnabled,
  toTabSlugRecord,
} from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroPlantaConsumosTabName } from '../../config/types/registro-planta-consumos';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
  REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
  RegistroNavigationBasePage,
  type RegistroWizardDropdownOptionsMap,
  type RegistroWizardFieldDefinition,
} from './registro-navigation-base';
import { assertRegistroWizardFieldsMatchConfig } from '../../registro/form-field-labels';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';
import { assertTabStripMatchesConfig } from '../../registro/tab-strip';
import { assertSidebarLabelsMatchConfig } from '../../registro/sidebar-labels';

export type { RegistroPlantaConsumosTabName };

const cfg = getRegistroPlantaConsumosConfig();

/** Indica si el módulo Registro Planta y consumos está habilitado para el tenant activo. */
export const REGISTRO_PLANTA_CONSUMOS_ENABLED = isModuleEnabled(MODULE_IDS.registroPlantaConsumos);

/** Etiqueta visible del submenú y de la tarjeta del tablero para Planta y consumos. */
export const REGISTRO_PLANTA_CONSUMOS_SUBMODULE_LABEL = cfg.registroPlantaConsumosSubmoduleLabel;

/** Segundo segmento del breadcrumb del gestor (puede diferir de la etiqueta del submenú). */
export const REGISTRO_PLANTA_CONSUMOS_BREADCRUMB_SEGMENT = cfg.registroPlantaConsumosBreadcrumbSegment;

/** Etiquetas de pestaña del módulo Planta y consumos (config del tenant). */
export const REGISTRO_PLANTA_CONSUMOS_TAB_NAMES = cfg.registroPlantaConsumosTabNames;

/** Pestañas alcanzables con las credenciales actuales del tenant. */
export const REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES = getModuleEnabledTabNames(
  MODULE_IDS.registroPlantaConsumos,
);

/** Etiquetas de pestaña bloqueadas (visibles y deshabilitadas). */
export const REGISTRO_PLANTA_CONSUMOS_LOCKED_TAB_NAMES = cfg.registroPlantaConsumosLockedTabNames;

/** Pestaña de aterrizaje usada como ancla del menú lateral y semilla. */
export const REGISTRO_PLANTA_CONSUMOS_DEFAULT_TAB = cfg.registroPlantaConsumosDefaultTab;

/** Pestaña Layout A (calendario Oferta Diaria). */
export const REGISTRO_PLANTA_CONSUMOS_LAYOUT_A_TAB = cfg.registroPlantaConsumosLayoutATab;

/** Pestaña Heat Rate. */
export const REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_TAB = cfg.registroPlantaConsumosHeatRateTab;

/** Pestaña Parametros Regas. */
export const REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_TAB =
  cfg.registroPlantaConsumosParametrosRegasTab;

/** Pestaña OEF Proyectada. */
export const REGISTRO_PLANTA_CONSUMOS_OEF_PROYECTADA_TAB = cfg.registroPlantaConsumosOefProyectadaTab;

/** Pestaña Conceptos OC. */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_TAB = cfg.registroPlantaConsumosConceptosOcTab;

/** Pestaña Diario Promigas. */
export const REGISTRO_PLANTA_CONSUMOS_DIARIO_PROMIGAS_TAB =
  cfg.registroPlantaConsumosDiarioPromigasTab;

/** Pestaña Horario Promigas. */
export const REGISTRO_PLANTA_CONSUMOS_HORARIO_PROMIGAS_TAB =
  cfg.registroPlantaConsumosHorarioPromigasTab;

/** Pestaña Costos Regas. */
export const REGISTRO_PLANTA_CONSUMOS_COSTOS_REGAS_TAB = cfg.registroPlantaConsumosCostosRegasTab;

/** Pestaña Gestion Conceptos. */
export const REGISTRO_PLANTA_CONSUMOS_GESTION_CONCEPTOS_TAB =
  cfg.registroPlantaConsumosGestionConceptosTab;

/** Encabezados de columna de días de la semana del calendario (vista Mes). */
export const REGISTRO_PLANTA_CONSUMOS_CALENDAR_WEEKDAY_HEADERS =
  cfg.registroPlantaConsumosCalendarWeekdayHeaders;

/** Etiquetas de mosaico de mes del calendario (vista Año). */
export const REGISTRO_PLANTA_CONSUMOS_CALENDAR_ANO_MONTH_CELLS =
  cfg.registroPlantaConsumosCalendarAnoMonthCells;

/** Opciones esperadas de año en el desplegable de año del calendario. */
export const REGISTRO_PLANTA_CONSUMOS_CALENDAR_YEAR_OPTIONS =
  cfg.registroPlantaConsumosCalendarYearOptions;

/** Opciones esperadas de mes visibles sin desplazamiento en el desplegable de mes. */
export const REGISTRO_PLANTA_CONSUMOS_CALENDAR_MONTH_OPTIONS =
  cfg.registroPlantaConsumosCalendarMonthOptions;

/** Opciones adicionales de mes alcanzables al desplazar el desplegable de mes. */
export const REGISTRO_PLANTA_CONSUMOS_CALENDAR_MONTH_OPTIONS_SCROLL =
  cfg.registroPlantaConsumosCalendarMonthOptionsScroll;

/** Encabezados de columna de la grilla Heat Rate (Layout B). */
export const REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_COLUMNS = cfg.registroPlantaConsumosHeatRateColumns;

/** Encabezados de columna de la grilla Parametros Regas (Layout B). */
export const REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_COLUMNS =
  cfg.registroPlantaConsumosParametrosRegasColumns;

/** Encabezados de columna de la grilla OEF Proyectada (Layout B). */
export const REGISTRO_PLANTA_CONSUMOS_OEF_PROYECTADA_COLUMNS =
  cfg.registroPlantaConsumosOefProyectadaColumns;

/** Encabezados de columna de la grilla Conceptos OC (Layout B). */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_COLUMNS =
  cfg.registroPlantaConsumosConceptosOcColumns;

/** Encabezados de columna de la grilla Costos Regas (Layout B). */
export const REGISTRO_PLANTA_CONSUMOS_COSTOS_REGAS_COLUMNS =
  cfg.registroPlantaConsumosCostosRegasColumns;

/** Encabezados de columna de la grilla Gestion Conceptos (Layout B). */
export const REGISTRO_PLANTA_CONSUMOS_GESTION_CONCEPTOS_COLUMNS =
  cfg.registroPlantaConsumosGestionConceptosColumns;

/** Títulos de paso del asistente Nuevo Registro de Heat Rate. */
export const REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_NUEVO_REGISTRO_WIZARD_STEPS =
  cfg.registroPlantaConsumosHeatRateNuevoRegistroWizardSteps;

/** Títulos de paso del asistente Nuevo Registro de OEF Proyectada. */
export const REGISTRO_PLANTA_CONSUMOS_OEF_NUEVO_REGISTRO_WIZARD_STEPS =
  cfg.registroPlantaConsumosOefNuevoRegistroWizardSteps;

/** Opciones esperadas por combobox del asistente de Heat Rate. */
export const REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_WIZARD_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroPlantaConsumosHeatRateWizardDropdownOptions;

/** Opciones esperadas por combobox del asistente de OEF Proyectada. */
export const REGISTRO_PLANTA_CONSUMOS_OEF_WIZARD_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroPlantaConsumosOefWizardDropdownOptions;

/** Opciones compartidas de Unidad para los formularios de concepto. */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTO_UNIDAD_OPTIONS =
  cfg.registroPlantaConsumosConceptoUnidadOptions;

/** Opciones esperadas del desplegable de Nuevo Registro de Conceptos OC. */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroPlantaConsumosConceptosOcRegistroDropdownOptions;

/** Campos del paso 1 de Nuevo Registro de Heat Rate. */
export const REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_NUEVO_REGISTRO_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroPlantaConsumosHeatRateNuevoRegistroFields;

/** Campos del paso 1 de Nuevo Registro de OEF Proyectada. */
export const REGISTRO_PLANTA_CONSUMOS_OEF_NUEVO_REGISTRO_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroPlantaConsumosOefNuevoRegistroFields;

/** Campos del formulario Nuevo Concepto / Nuevo Registro de Gestion Conceptos. */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTO_FORM_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroPlantaConsumosConceptoFormFields;

/** Campos del formulario Nuevo Registro de Conceptos OC. */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroPlantaConsumosConceptosOcRegistroFields;

/** Etiquetas de spinbutton de Nuevo Registro de Conceptos OC. */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_SPINBUTTON_LABELS =
  cfg.registroPlantaConsumosConceptosOcRegistroSpinbuttonLabels;

/** Etiquetas de formulario plano de Parametros Regas. */
export const REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_FORM_LABELS =
  cfg.registroPlantaConsumosParametrosRegasFormLabels;

/**
 * Navegación y aserciones del submódulo Planta y consumos bajo Registro.
 */
export class RegistroPlantaConsumosNavigationPage extends RegistroNavigationBasePage {
  /** Segmento de slug de URL por pestaña de Planta y consumos (config del tenant). */
  static readonly REGISTRO_PLANTA_CONSUMOS_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroPlantaConsumosTabSlugs,
  );

  /** Texto del tercer segmento del breadcrumb por pestaña activa. */
  static readonly REGISTRO_PLANTA_CONSUMOS_TAB_BREADCRUMBS: Record<string, string> =
    cfg.registroPlantaConsumosTabBreadcrumbs;

  /**
   * Expande Registro y el desplegable del submódulo Planta y consumos en el menú lateral.
   */
  async expandPlantaConsumosSidebar(): Promise<void> {
    await this.expandRegistroSubmodule(REGISTRO_PLANTA_CONSUMOS_SUBMODULE_LABEL);
  }

  /**
   * Vuelve a expandir Registro y Planta y consumos cuando la navegación plegó los menús laterales.
   */
  async ensurePlantaConsumosSidebarExpanded(): Promise<void> {
    await this.ensureRegistroSubmoduleNestedLinksVisible(
      REGISTRO_PLANTA_CONSUMOS_SUBMODULE_LABEL,
      REGISTRO_PLANTA_CONSUMOS_DEFAULT_TAB,
    );
  }

  /**
   * Comprueba que los ítems anidados de Planta y consumos coinciden con enabled + locked.
   */
  async expectPlantaConsumosSidebarLinksVisible(): Promise<void> {
    await this.expandPlantaConsumosSidebar();
    await assertSidebarLabelsMatchConfig(
      this.registroSubmoduleNestedItems(),
      [...REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES, ...REGISTRO_PLANTA_CONSUMOS_LOCKED_TAB_NAMES],
      { context: 'Planta y consumos nested sidebar' },
    );
    for (const tabName of REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES) {
      await expect(this.registroSubmenu().getByRole('link', { name: tabName, exact: true })).toBeVisible();
    }
    for (const tabName of REGISTRO_PLANTA_CONSUMOS_LOCKED_TAB_NAMES) {
      await expect(
        this.registroSubmenu().getByRole('menuitem', { name: tabName, exact: true, disabled: true }),
      ).toBeVisible();
    }
  }

  /**
   * Hace clic en el enlace de una pestaña de Planta y consumos dentro del submenú expandido.
   *
   * @param tabName - Etiqueta del enlace anidado habilitado del menú lateral.
   */
  async clickPlantaConsumosSidebarLink(tabName: RegistroPlantaConsumosTabName): Promise<void> {
    await this.ensurePlantaConsumosSidebarExpanded();
    await this.clickRegistroSubmenuLink(tabName);
    await expect(this.page).toHaveURL(
      RegistroPlantaConsumosNavigationPage.REGISTRO_PLANTA_CONSUMOS_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
  }

  /**
   * Abre una pestaña de Planta y consumos por los enlaces anidados del menú lateral.
   *
   * @param tabName - Etiqueta del enlace anidado habilitado del menú lateral.
   */
  async openPlantaConsumosFromSidebar(tabName: RegistroPlantaConsumosTabName): Promise<void> {
    await this.expandPlantaConsumosSidebar();
    await this.clickPlantaConsumosSidebarLink(tabName);
  }

  /**
   * Comprueba que Planta y consumos aparece en la tarjeta hover de Registro con icono ojo.
   */
  async expectPlantaConsumosVisibleOnDashboardHover(): Promise<void> {
    await this.expectRegistroDashboardHoverSubmoduleVisible(
      REGISTRO_PLANTA_CONSUMOS_SUBMODULE_LABEL,
      this.registroDashboardHoverLabelsFromInsumosOfertaThroughHistorial(),
    );
  }

  /**
   * Abre Planta y consumos desde la grilla del tablero (icono ojo bajo la tarjeta Registro).
   */
  async openPlantaConsumosFromDashboardGrid(): Promise<void> {
    await expect(async () => {
      await this.hoverRegistroDashboardCard();
      const eye = this.registroDashboardCard()
        .getByRole('listitem')
        .filter({ hasText: REGISTRO_PLANTA_CONSUMOS_SUBMODULE_LABEL })
        .getByLabel('eye');
      await expect(eye).toBeVisible();
      await eye.click();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Comprueba que las pestañas bloqueadas del shell son visibles y están deshabilitadas.
   */
  async expectLockedTabsDisabled(): Promise<void> {
    for (const tabName of REGISTRO_PLANTA_CONSUMOS_LOCKED_TAB_NAMES) {
      const tab = this.page.getByRole('tab', { name: tabName, exact: true });
      await expect(tab).toBeVisible();
      await expect(tab).toBeDisabled();
    }
  }

  /**
   * Comprueba el shell del gestor de Planta y consumos: URL, breadcrumb y tira de pestañas.
   */
  async expectGestorDeDatosPlantaConsumosShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/plantas-y-consumos\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText(REGISTRO_PLANTA_CONSUMOS_BREADCRUMB_SEGMENT);
    await assertTabStripMatchesConfig(this.page, {
      enabledTabs: REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES,
      lockedTabs: REGISTRO_PLANTA_CONSUMOS_LOCKED_TAB_NAMES,
      context: 'Planta y consumos',
    });
  }

  /**
   * Abre una pestaña de Planta y consumos y comprueba selección, breadcrumb y slug de URL.
   *
   * @param tabName - Etiqueta de pestaña habilitada.
   */
  async openPlantaConsumosTab(tabName: RegistroPlantaConsumosTabName): Promise<void> {
    await this.page.getByRole('tab', { name: tabName, exact: true }).click();
    await this.expectPlantaConsumosTabActive(tabName);
  }

  /**
   * Comprueba que la pestaña está seleccionada, el breadcrumb muestra su etiqueta y la URL coincide con el slug.
   *
   * @param tabName - Etiqueta de pestaña habilitada.
   */
  async expectPlantaConsumosTabActive(tabName: RegistroPlantaConsumosTabName): Promise<void> {
    await expect(this.page).toHaveURL(
      RegistroPlantaConsumosNavigationPage.REGISTRO_PLANTA_CONSUMOS_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
    const tab = this.page.getByRole('tab', { name: tabName, exact: true });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroPlantaConsumosNavigationPage.REGISTRO_PLANTA_CONSUMOS_TAB_BREADCRUMBS[tabName],
    );
  }

  /**
   * Devuelve el combobox de año del calendario en la región de contenido principal.
   */
  protected calendarYearCombobox(): Locator {
    return this.gestorMain().getByRole('combobox').first();
  }

  /**
   * Devuelve el combobox de mes del calendario en la región de contenido principal.
   */
  protected calendarMonthCombobox(): Locator {
    return this.gestorMain().getByRole('combobox').nth(1);
  }

  /**
   * Devuelve el contenedor select de Ant Design del control de año del calendario.
   */
  protected calendarYearSelect(): Locator {
    return this.calendarYearCombobox().locator('xpath=ancestor::*[contains(@class,"ant-select")]').first();
  }

  /**
   * Devuelve el contenedor select de Ant Design del control de mes del calendario.
   */
  protected calendarMonthSelect(): Locator {
    return this.calendarMonthCombobox().locator('xpath=ancestor::*[contains(@class,"ant-select")]').first();
  }

  /**
   * Comprueba la barra Layout A del calendario: selectores de año/mes, radios Mes/Año y CTA principal.
   *
   * @param primaryCta - Acción principal visible en la barra del calendario.
   */
  async expectLayoutACalendarToolbar(
    primaryCta: 'Carga archivo' | 'Nuevo Registro' = 'Carga archivo',
  ): Promise<void> {
    const main = this.gestorMain();
    await expect(this.calendarYearCombobox()).toBeVisible();
    await expect(this.calendarMonthCombobox()).toBeVisible();
    await expect(main.getByText('Mes', { exact: true })).toBeVisible();
    await expect(main.getByText('Año', { exact: true })).toBeVisible();
    await expect(main.getByRole('button', { name: primaryCta })).toBeVisible();
    await this.expectFiltrosControlAbsent();
    await this.expectToolbarFilterChipsAbsent();
  }

  /**
   * Comprueba la grilla del calendario en vista Mes con encabezados de días de la semana y celdas de día.
   */
  async expectCalendarMesView(): Promise<void> {
    const table = this.gestorMain().locator('table').filter({ hasText: 'Lun' }).first();
    for (const header of REGISTRO_PLANTA_CONSUMOS_CALENDAR_WEEKDAY_HEADERS) {
      await expect(table.getByRole('columnheader', { name: header, exact: true })).toBeVisible();
    }
    await expect(table.locator('tbody td').first()).toBeVisible();
  }

  /**
   * Comprueba la grilla del calendario en vista Año con doce mosaicos de mes y sin encabezados de días de la semana.
   */
  async expectCalendarAnoView(): Promise<void> {
    const main = this.gestorMain();
    const table = main.locator('table').first();
    for (const month of REGISTRO_PLANTA_CONSUMOS_CALENDAR_ANO_MONTH_CELLS) {
      await expect(table.locator('tbody td').getByText(month, { exact: true })).toBeVisible();
    }
    for (const header of REGISTRO_PLANTA_CONSUMOS_CALENDAR_WEEKDAY_HEADERS) {
      await expect(table.getByRole('columnheader', { name: header, exact: true })).toHaveCount(0);
    }
  }

  /**
   * Abre el desplegable de año del calendario, comprueba que las opciones coinciden con la config y selecciona el año dado.
   *
   * @param selectYear - Opción de año a seleccionar después de listar todos los años.
   */
  async expectCalendarYearDropdownWorks(selectYear = '2025'): Promise<void> {
    const yearCombo = this.calendarYearCombobox();
    await yearCombo.click();
    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
    await expect(dropdown).toBeVisible();
    await this.expectWizardSelectOptionsMatch(dropdown, REGISTRO_PLANTA_CONSUMOS_CALENDAR_YEAR_OPTIONS, {
      fieldLabel: 'año del calendario',
    });
    await dropdown.locator('.ant-select-item-option-content').getByText(selectYear, { exact: true }).click();
    await expect(this.calendarYearSelect()).toContainText(selectYear);
    await expect(this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')).toHaveCount(0);
  }

  /**
   * Abre el desplegable de mes del calendario, comprueba el conjunto completo de opciones y selecciona el mes dado.
   *
   * @param selectMonth - Opción de mes a seleccionar después de listar los meses.
   */
  async expectCalendarMonthDropdownWorks(selectMonth = 'mar'): Promise<void> {
    const monthCombo = this.calendarMonthCombobox();
    await monthCombo.click();
    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
    await expect(dropdown).toBeVisible();
    await this.expectWizardSelectOptionsMatch(
      dropdown,
      [
        ...REGISTRO_PLANTA_CONSUMOS_CALENDAR_MONTH_OPTIONS,
        ...REGISTRO_PLANTA_CONSUMOS_CALENDAR_MONTH_OPTIONS_SCROLL,
      ],
      { fieldLabel: 'mes del calendario' },
    );
    await dropdown.locator('.ant-select-item-option-content').getByText(selectMonth, { exact: true }).click();
    await expect(this.calendarMonthSelect()).toContainText(selectMonth);
    await expect(this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')).toHaveCount(0);
  }

  /**
   * Alterna las vistas Mes/Año del calendario y valida cada layout.
   */
  async expectCalendarMesAnoToggleWorks(): Promise<void> {
    const main = this.gestorMain();
    await main.getByText('Año', { exact: true }).click();
    await this.expectCalendarAnoView();
    await main.getByText('Mes', { exact: true }).click();
    await this.expectCalendarMesView();
  }

  /**
   * Ejercita los desplegables de año/mes y el interruptor Mes/Año en una pestaña de calendario Layout A.
   */
  async expectCalendarControlsWork(): Promise<void> {
    await this.expectCalendarYearDropdownWorks();
    await this.expectCalendarMonthDropdownWorks();
    await this.expectCalendarMesAnoToggleWorks();
    await this.dismissOpenSelectDropdowns();
    await this.resetGestorToolbarFocus();
  }

  /**
   * Comprueba la barra Layout B de tabla: búsqueda y CTAs extra opcionales.
   *
   * @param extraButtons - Nombres extra de botones de la barra esperados además de la búsqueda.
   */
  async expectLayoutBTableToolbar(extraButtons: readonly string[] = ['Nuevo Registro']): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    for (const buttonName of extraButtons) {
      await expect(main.getByRole('button', { name: buttonName })).toBeVisible();
    }
  }

  /**
   * Comprueba los encabezados de columna de la primera grilla principal.
   *
   * @param columnNames - Etiquetas esperadas de encabezado de columna en orden.
   */
  async expectGridColumnHeaders(columnNames: readonly string[]): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames);
  }

  /**
   * Abre un CTA de formulario plano, valida etiquetas de campo y cierra el diálogo.
   *
   * @param buttonName - Botón de la barra que abre Registrar Información.
   * @param fieldLabels - Etiquetas visibles de campo en el formulario.
   */
  async expectFlatFormDialogOpensAndCloses(
    buttonName: string | RegExp,
    fieldLabels: readonly string[],
  ): Promise<void> {
    const dialog = await this.openRegistrarInformacionDialog(buttonName);
    const fields: RegistroWizardFieldDefinition[] = fieldLabels.map((label) => ({
      label,
      kind: 'textbox',
    }));
    await assertRegistroWizardFieldsMatchConfig(dialog, fields);
    for (const label of fieldLabels) {
      await expect(dialog.locator('.ant-form-item-label').filter({ hasText: label }).first()).toBeVisible();
    }
    await expect(dialog.getByRole('button', { name: 'Limpiar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Guardar' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.dismissOpenSelectDropdowns();
    await this.expectNoVisibleModals();
  }

  /**
   * Abre Nuevo Registro de Heat Rate, valida campos y desplegables del paso 1, y cierra.
   */
  async expectHeatRateWizardDialog(): Promise<void> {
    await this.expectNoVisibleModals();
    await this.gestorMain().getByRole('button', { name: 'Nuevo Registro' }).click();

    const dialog = this.registroWizardDialog(/Nuevo Heat Rate/i);
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog).toContainText('Registrar Información');
    for (const step of REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_NUEVO_REGISTRO_WIZARD_STEPS) {
      await expect(dialog.getByText(step, { exact: true })).toBeVisible();
    }

    await assertRegistroWizardFieldsMatchConfig(
      dialog,
      REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_NUEVO_REGISTRO_FIELDS,
    );

    for (const field of REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_NUEVO_REGISTRO_FIELDS) {
      await this.expectRegistroWizardField(
        dialog,
        field,
        REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_WIZARD_DROPDOWN_OPTIONS,
        REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
      );
    }

    const configCombo = dialog.getByRole('combobox').nth(2);
    if (await configCombo.isVisible()) {
      await configCombo.click();
      const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
      await expect(dropdown.locator('.ant-select-item-option').first()).toBeVisible();
      await this.dismissOpenWizardSelectDropdown(dialog, 'heading-click');
    }

    await expect(dialog.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Siguiente/i })).toBeDisabled();
    await expect(dialog.getByRole('button', { name: 'Limpiar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Guardar' })).toBeVisible();

    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
  }

  /**
   * Abre Nuevo Registro de OEF Proyectada, valida los campos del asistente y cierra.
   */
  async expectOefProyectadaWizardDialog(): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      ctaName: 'Nuevo Registro',
      stepTitle: /Nueva Vigencia Oef/i,
      wizardSteps: REGISTRO_PLANTA_CONSUMOS_OEF_NUEVO_REGISTRO_WIZARD_STEPS,
      fields: REGISTRO_PLANTA_CONSUMOS_OEF_NUEVO_REGISTRO_FIELDS,
      dropdownOptions: REGISTRO_PLANTA_CONSUMOS_OEF_WIZARD_DROPDOWN_OPTIONS,
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
    });
  }

  /**
   * Abre el formulario Nuevo Concepto, valida campos y el desplegable Unidad, y cierra.
   */
  async expectNuevoConceptoDialog(): Promise<void> {
    await this.expectFlatFormDialogWithComboboxOpensAndCloses(
      'Nuevo Concepto',
      REGISTRO_PLANTA_CONSUMOS_CONCEPTO_FORM_FIELDS,
      { Unidad: [...REGISTRO_PLANTA_CONSUMOS_CONCEPTO_UNIDAD_OPTIONS] },
      { requiredDialogText: 'Nombre Concepto' },
    );
  }

  /**
   * Abre Nuevo Registro de Conceptos OC, valida campos y el desplegable Concepto, y cierra.
   */
  async expectConceptosOcRegistroDialog(): Promise<void> {
    await this.expectFlatFormDialogWithComboboxOpensAndCloses(
      'Nuevo Registro',
      REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_FIELDS,
      REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_DROPDOWN_OPTIONS,
      {
        extraExpectedLabels: REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_SPINBUTTON_LABELS,
        spinbuttonLabels: REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_SPINBUTTON_LABELS,
      },
    );
  }

  /**
   * Abre Nuevo Registro de Gestion Conceptos, valida los campos del formulario de concepto y cierra.
   */
  async expectGestionConceptosRegistroDialog(): Promise<void> {
    await this.expectFlatFormDialogWithComboboxOpensAndCloses(
      'Nuevo Registro',
      REGISTRO_PLANTA_CONSUMOS_CONCEPTO_FORM_FIELDS,
      { Unidad: [...REGISTRO_PLANTA_CONSUMOS_CONCEPTO_UNIDAD_OPTIONS] },
    );
  }

  /**
   * Abre un CTA de formulario plano, valida etiquetas y desplegables de combobox, y cierra el diálogo.
   *
   * @param buttonName - Botón de la barra que abre Registrar Información.
   * @param fields - Definiciones de campo del asistente desde la config del tenant.
   * @param dropdownOptions - Opciones esperadas de combobox indexadas por etiqueta de campo.
   * @param options - Etiquetas extra y spinbuttons opcionales.
   */
  async expectFlatFormDialogWithComboboxOpensAndCloses(
    buttonName: string | RegExp,
    fields: readonly RegistroWizardFieldDefinition[],
    dropdownOptions: RegistroWizardDropdownOptionsMap,
    options?: {
      requiredDialogText?: string;
      extraExpectedLabels?: readonly string[];
      spinbuttonLabels?: readonly string[];
    },
  ): Promise<void> {
    const dialog = await this.openRegistrarInformacionDialog(buttonName);
    await expect(dialog).toContainText('Registrar Información');
    if (options?.requiredDialogText) {
      await expect(
        dialog.locator('.ant-form-item-label').filter({ hasText: options.requiredDialogText }).first(),
      ).toBeVisible();
    }
    await assertRegistroWizardFieldsMatchConfig(dialog, fields, {
      extraExpectedLabels: options?.extraExpectedLabels,
    });
    for (const field of fields) {
      await this.expectRegistroWizardField(
        dialog,
        field,
        dropdownOptions,
        REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
      );
    }
    if (options?.spinbuttonLabels?.length) {
      for (const label of options.spinbuttonLabels) {
        const spinbutton = dialog.getByRole('spinbutton', { name: `* ${label}`, exact: true });
        await expect(spinbutton).toBeVisible();
      }
    }
    await expect(dialog.getByRole('button', { name: 'Limpiar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Guardar' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.dismissOpenSelectDropdowns();
    await this.expectNoVisibleModals();
  }

  /**
   * Abre Cargar Archivo en Parametros Regas, valida los campos del formulario plano y cierra.
   */
  async expectParametrosRegasCargarArchivoDialog(): Promise<void> {
    await this.expectFlatFormDialogOpensAndCloses(
      'Cargar Archivo',
      REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_FORM_LABELS,
    );
  }
}
