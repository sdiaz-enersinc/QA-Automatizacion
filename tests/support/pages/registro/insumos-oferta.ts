import { expect, Locator } from '@playwright/test';
import {
  getRegistroInsumosOfertaConfig,
  getModuleEnabledTabNames,
  isModuleEnabled,
  toTabSlugRecord,
} from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroInsumosOfertaTabName } from '../../config/types/registro-insumos-oferta';
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

export type { RegistroInsumosOfertaTabName };

const cfg = getRegistroInsumosOfertaConfig();

/** Indica si el módulo Registro Insumos oferta está habilitado para el tenant activo. */
export const REGISTRO_INSUMOS_OFERTA_ENABLED = isModuleEnabled(MODULE_IDS.registroInsumosOferta);

/** Etiqueta visible del submenú para Insumos oferta (config del tenant). */
export const REGISTRO_INSUMOS_OFERTA_SUBMODULE_LABEL = cfg.registroInsumosOfertaSubmoduleLabel;

/** Etiqueta legacy del submenú que no debe aparecer tras el cambio de nombre. */
export const REGISTRO_INSUMOS_OFERTA_LEGACY_SUBMODULE_LABEL =
  cfg.registroInsumosOfertaLegacySubmoduleLabel;

/** Segundo segmento legacy del breadcrumb que aún se muestra en el shell del gestor. */
export const REGISTRO_INSUMOS_OFERTA_LEGACY_BREADCRUMB = cfg.registroInsumosOfertaLegacyBreadcrumb;

/** Etiqueta exacta de la UI para la pestaña y fila bloqueada Recursos Generción (AGR). */
export const REGISTRO_INSUMOS_OFERTA_AGR_LABEL = cfg.registroInsumosOfertaAgrLabel;

/** Etiquetas que deben estar ausentes del menú lateral y de la tira de pestañas (p. ej. Heat Rate). */
export const REGISTRO_INSUMOS_OFERTA_ABSENT_LABELS = cfg.registroInsumosOfertaAbsentLabels;

/** Etiquetas de pestaña y de menú anidado en orden de UI (incluye AGR). */
export const REGISTRO_INSUMOS_OFERTA_TAB_NAMES = cfg.registroInsumosOfertaTabNames;

/** Etiquetas del menú anidado (alias de los nombres de pestaña; AGR primero). */
export const REGISTRO_INSUMOS_OFERTA_NESTED_SIDEBAR_LABELS = REGISTRO_INSUMOS_OFERTA_TAB_NAMES;

/** Pestañas alcanzables con las credenciales actuales del tenant. */
export const REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES = getModuleEnabledTabNames(
  MODULE_IDS.registroInsumosOferta,
);

/** Enlaces anidados habilitados del menú lateral (alias de los nombres de pestaña habilitados). */
export const REGISTRO_INSUMOS_OFERTA_ENABLED_NESTED_LABELS = REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES;

/** Etiquetas de pestaña y de menú anidado bloqueadas (incluye AGR). */
export const REGISTRO_INSUMOS_OFERTA_LOCKED_TAB_NAMES = cfg.registroInsumosOfertaLockedTabNames;

/** Ítems de menú anidado bloqueados (alias de los nombres de pestaña bloqueados). */
export const REGISTRO_INSUMOS_OFERTA_LOCKED_NESTED_LABELS = REGISTRO_INSUMOS_OFERTA_LOCKED_TAB_NAMES;

/** Pestaña habilitada por defecto usada como ancla del menú lateral y vista de aterrizaje. */
export const REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB = cfg.registroInsumosOfertaDefaultTab;

/** Pestaña Layout A (calendario Oferta Diaria). */
export const REGISTRO_INSUMOS_OFERTA_LAYOUT_A_TAB = cfg.registroInsumosOfertaLayoutATab;

/** Pestaña Layout B OEF Proyectada. */
export const REGISTRO_INSUMOS_OFERTA_OEF_PROYECTADA_TAB = cfg.registroInsumosOfertaOefProyectadaTab;

/** Pestaña Layout B Conceptos OC. */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_TAB = cfg.registroInsumosOfertaConceptosOcTab;

/** Pestaña Layout B Gestion Conceptos. */
export const REGISTRO_INSUMOS_OFERTA_GESTION_CONCEPTOS_TAB =
  cfg.registroInsumosOfertaGestionConceptosTab;

/** Encabezados de columna de días de la semana del calendario (vista Mes). */
export const REGISTRO_INSUMOS_OFERTA_CALENDAR_WEEKDAY_HEADERS =
  cfg.registroInsumosOfertaCalendarWeekdayHeaders;

/** Etiquetas de mosaico de mes del calendario (vista Año). */
export const REGISTRO_INSUMOS_OFERTA_CALENDAR_ANO_MONTH_CELLS =
  cfg.registroInsumosOfertaCalendarAnoMonthCells;

/** Opciones esperadas de año en el desplegable de año del calendario. */
export const REGISTRO_INSUMOS_OFERTA_CALENDAR_YEAR_OPTIONS =
  cfg.registroInsumosOfertaCalendarYearOptions;

/** Opciones esperadas de mes visibles sin desplazamiento en el desplegable de mes del calendario. */
export const REGISTRO_INSUMOS_OFERTA_CALENDAR_MONTH_OPTIONS =
  cfg.registroInsumosOfertaCalendarMonthOptions;

/** Opciones adicionales de mes alcanzables al desplazar el desplegable de mes. */
export const REGISTRO_INSUMOS_OFERTA_CALENDAR_MONTH_OPTIONS_SCROLL =
  cfg.registroInsumosOfertaCalendarMonthOptionsScroll;

/** Encabezados de columna de la grilla OEF Proyectada (Layout B). */
export const REGISTRO_INSUMOS_OFERTA_OEF_PROYECTADA_COLUMNS =
  cfg.registroInsumosOfertaOefProyectadaColumns;

/** Encabezados de columna de la grilla Conceptos OC (Layout B). */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_COLUMNS =
  cfg.registroInsumosOfertaConceptosOcColumns;

/** Encabezados de columna de la grilla Gestion Conceptos (Layout B). */
export const REGISTRO_INSUMOS_OFERTA_GESTION_CONCEPTOS_COLUMNS =
  cfg.registroInsumosOfertaGestionConceptosColumns;

/** Títulos de paso del asistente Nuevo Registro de OEF Proyectada. */
export const REGISTRO_INSUMOS_OFERTA_OEF_NUEVO_REGISTRO_WIZARD_STEPS =
  cfg.registroInsumosOfertaOefNuevoRegistroWizardSteps;

/** Opciones esperadas por combobox del asistente de OEF Proyectada. */
export const REGISTRO_INSUMOS_OFERTA_OEF_WIZARD_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroInsumosOfertaOefWizardDropdownOptions;

/** Opciones compartidas de Unidad para los formularios de concepto. */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTO_UNIDAD_OPTIONS =
  cfg.registroInsumosOfertaConceptoUnidadOptions;

/** Opciones esperadas del desplegable de Nuevo Registro de Conceptos OC. */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroInsumosOfertaConceptosOcRegistroDropdownOptions;

/** Campos del paso 1 de Nuevo Registro de OEF Proyectada. */
export const REGISTRO_INSUMOS_OFERTA_OEF_NUEVO_REGISTRO_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroInsumosOfertaOefNuevoRegistroFields;

/** Campos del formulario Nuevo Concepto / Nuevo Registro de Gestion Conceptos. */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTO_FORM_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroInsumosOfertaConceptoFormFields;

/** Campos del formulario Nuevo Registro de Conceptos OC. */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroInsumosOfertaConceptosOcRegistroFields;

/** Etiquetas de spinbutton de Nuevo Registro de Conceptos OC (no modeladas como tipos de campo de asistente). */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_SPINBUTTON_LABELS =
  cfg.registroInsumosOfertaConceptosOcRegistroSpinbuttonLabels;

/**
 * Navegación y aserciones del submódulo Insumos oferta bajo Registro.
 */
export class RegistroInsumosOfertaNavigationPage extends RegistroNavigationBasePage {
  /** Segmento de slug de URL por pestaña navegable de Insumos oferta (config del tenant). */
  static readonly REGISTRO_INSUMOS_OFERTA_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroInsumosOfertaTabSlugs,
  );

  /** Texto del tercer segmento del breadcrumb por pestaña activa. */
  static readonly REGISTRO_INSUMOS_OFERTA_TAB_BREADCRUMBS: Record<string, string> =
    cfg.registroInsumosOfertaTabBreadcrumbs;

  /** Href de cada enlace anidado habilitado del menú lateral (config del tenant). */
  static readonly REGISTRO_INSUMOS_OFERTA_SIDEBAR_HREFS: Record<string, string> =
    cfg.registroInsumosOfertaSidebarHrefs;

  /**
   * Expande Registro y el desplegable del submódulo Insumos oferta en el menú lateral.
   */
  async expandInsumosOfertaSidebar(): Promise<void> {
    await this.expandRegistroSubmodule(REGISTRO_INSUMOS_OFERTA_SUBMODULE_LABEL);
  }

  /**
   * Vuelve a expandir Registro e Insumos oferta cuando la navegación plegó los menús laterales.
   */
  async ensureInsumosOfertaSidebarExpanded(): Promise<void> {
    await this.ensureRegistroSubmoduleNestedLinksVisible(
      REGISTRO_INSUMOS_OFERTA_SUBMODULE_LABEL,
      REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB,
    );
  }

  /**
   * Hace clic en el enlace de una pestaña de Insumos oferta dentro del submenú expandido.
   *
   * @param tabName - Etiqueta del enlace anidado habilitado del menú lateral.
   */
  async clickInsumosOfertaSidebarLink(tabName: RegistroInsumosOfertaTabName): Promise<void> {
    await this.ensureInsumosOfertaSidebarExpanded();
    await this.clickRegistroSubmenuLink(tabName);
    await expect(this.page).toHaveURL(
      RegistroInsumosOfertaNavigationPage.REGISTRO_INSUMOS_OFERTA_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
  }

  /**
   * Abre una pestaña de Insumos oferta por los enlaces anidados del menú lateral bajo Insumos oferta.
   *
   * @param tabName - Etiqueta del enlace anidado habilitado del menú lateral.
   */
  async openInsumosOfertaFromSidebar(tabName: RegistroInsumosOfertaTabName): Promise<void> {
    await this.expandInsumosOfertaSidebar();
    await this.clickInsumosOfertaSidebarLink(tabName);
  }

  /**
   * Comprueba que Insumos oferta aparece en la tarjeta hover de Registro y que el nombre legacy está ausente.
   */
  async expectInsumosOfertaVisibleOnDashboardHover(): Promise<void> {
    await this.expectRegistroDashboardHoverSubmoduleVisible(REGISTRO_INSUMOS_OFERTA_SUBMODULE_LABEL);
    await this.expectRegistroLegacySubmoduleAbsentOnDashboardCard();
  }

  /**
   * Comprueba que Insumos oferta está presente en el submenú de Registro y que la etiqueta legacy está ausente.
   */
  async expectInsumosOfertaSubmenuPresentAndLegacyAbsent(): Promise<void> {
    await this.expandRegistroSidebar();
    const submenu = this.registroSubmenu();
    await expect(
      submenu.getByRole('menuitem', { name: REGISTRO_INSUMOS_OFERTA_SUBMODULE_LABEL, disabled: false }),
    ).toBeVisible();
    await expect(
      submenu.getByRole('menuitem', { name: REGISTRO_INSUMOS_OFERTA_LEGACY_SUBMODULE_LABEL }),
    ).toHaveCount(0);
  }

  /**
   * Comprueba que los ítems anidados de Insumos oferta coinciden exactamente con la config del tenant, con AGR primero y bloqueado.
   */
  async expectInsumosOfertaNestedSidebarItems(): Promise<void> {
    await this.expandInsumosOfertaSidebar();
    const submenu = this.registroSubmenu();
    const nestedItems = this.registroSubmoduleNestedItems();
    await expect(nestedItems.first()).toContainText(REGISTRO_INSUMOS_OFERTA_AGR_LABEL);
    await expect(
      submenu.getByRole('menuitem', { name: REGISTRO_INSUMOS_OFERTA_AGR_LABEL, disabled: true }),
    ).toBeVisible();
    for (const label of REGISTRO_INSUMOS_OFERTA_ENABLED_NESTED_LABELS) {
      await expect(submenu.getByRole('link', { name: label })).toBeVisible();
    }
    for (const label of REGISTRO_INSUMOS_OFERTA_LOCKED_NESTED_LABELS) {
      await expect(submenu.getByRole('menuitem', { name: label, disabled: true })).toBeVisible();
    }
    await assertSidebarLabelsMatchConfig(
      nestedItems,
      REGISTRO_INSUMOS_OFERTA_NESTED_SIDEBAR_LABELS,
      { context: 'Insumos oferta nested sidebar' },
    );
    await this.expectHeatRateAbsentFromSidebar();
  }

  /**
   * Comprueba que los enlaces anidados habilitados del menú lateral exponen los hrefs esperados de la config del tenant.
   */
  async expectInsumosOfertaEnabledSidebarHrefs(): Promise<void> {
    await this.expandInsumosOfertaSidebar();
    const submenu = this.registroSubmenu();
    for (const [label, href] of Object.entries(
      RegistroInsumosOfertaNavigationPage.REGISTRO_INSUMOS_OFERTA_SIDEBAR_HREFS,
    )) {
      await expect(submenu.getByRole('link', { name: label })).toHaveAttribute('href', href);
    }
  }

  /**
   * Comprueba que Heat Rate está ausente del submenú de Registro.
   */
  async expectHeatRateAbsentFromSidebar(): Promise<void> {
    const submenu = this.registroSubmenu();
    for (const label of REGISTRO_INSUMOS_OFERTA_ABSENT_LABELS) {
      await expect(submenu.getByRole('menuitem', { name: label })).toHaveCount(0);
    }
  }

  /**
   * Comprueba que Heat Rate está ausente de la tira de pestañas del gestor.
   */
  async expectHeatRateAbsentFromTabs(): Promise<void> {
    for (const label of REGISTRO_INSUMOS_OFERTA_ABSENT_LABELS) {
      await expect(this.page.getByRole('tab', { name: label, exact: true })).toHaveCount(0);
    }
  }

  /**
   * Comprueba que Heat Rate está ausente tanto del menú lateral como de la tira de pestañas.
   */
  async expectHeatRateAbsent(): Promise<void> {
    await this.expectHeatRateAbsentFromSidebar();
    await this.expectHeatRateAbsentFromTabs();
  }

  /**
   * Comprueba que el breadcrumb del banner sigue mostrando el segmento legacy Plantas y consumos, no Insumos oferta.
   */
  async expectLegacyPlantasYConsumosBreadcrumb(): Promise<void> {
    const breadcrumb = this.page.getByRole('banner').getByRole('navigation');
    await expect(breadcrumb).toContainText(REGISTRO_INSUMOS_OFERTA_LEGACY_BREADCRUMB);
    await expect(breadcrumb).not.toContainText(REGISTRO_INSUMOS_OFERTA_SUBMODULE_LABEL);
  }

  /**
   * Comprueba que Recursos Generción (AGR) es la primera pestaña y está deshabilitada.
   */
  async expectAgrTabLocked(): Promise<void> {
    const agrTab = this.page.getByRole('tab', { name: REGISTRO_INSUMOS_OFERTA_AGR_LABEL, exact: true });
    await expect(this.page.getByRole('tab').first()).toHaveText(REGISTRO_INSUMOS_OFERTA_AGR_LABEL);
    await expect(agrTab).toBeVisible();
    await expect(agrTab).toBeDisabled();
  }

  /**
   * Comprueba que un clic forzado en Recursos Generción (AGR) no navega ni abre un diálogo.
   */
  async expectAgrTabDoesNotNavigate(): Promise<void> {
    const agrTab = this.page.getByRole('tab', { name: REGISTRO_INSUMOS_OFERTA_AGR_LABEL, exact: true });
    await agrTab.click({ force: true });
    await expect(this.page).toHaveURL(
      RegistroInsumosOfertaNavigationPage.REGISTRO_INSUMOS_OFERTA_TAB_SLUGS[
        REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB
      ],
    );
    await expect(
      this.page.getByRole('tab', { name: REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB, exact: true }),
    ).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('dialog')).toHaveCount(0);
  }

  /**
   * Comprueba que las pestañas bloqueadas del shell del gestor de Insumos oferta son visibles y están deshabilitadas.
   */
  async expectLockedTabsDisabled(): Promise<void> {
    for (const tabName of REGISTRO_INSUMOS_OFERTA_LOCKED_TAB_NAMES) {
      const tab = this.page.getByRole('tab', { name: tabName, exact: true });
      await expect(tab).toBeVisible();
      await expect(tab).toBeDisabled();
    }
  }

  /**
   * Comprueba el shell del gestor de Insumos oferta: URL, breadcrumb legacy y estado de la tira de pestañas.
   */
  async expectGestorDeDatosInsumosOfertaShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/plantas-y-consumos\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText(REGISTRO_INSUMOS_OFERTA_LEGACY_BREADCRUMB);
    await assertTabStripMatchesConfig(this.page, {
      enabledTabs: REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES,
      lockedTabs: REGISTRO_INSUMOS_OFERTA_LOCKED_TAB_NAMES,
      context: 'Insumos oferta',
    });
  }

  /**
   * Abre una pestaña de Insumos oferta y comprueba selección, breadcrumb y slug de URL.
   *
   * @param tabName - Etiqueta de pestaña habilitada.
   */
  async openInsumosOfertaTab(tabName: RegistroInsumosOfertaTabName): Promise<void> {
    await this.page.getByRole('tab', { name: tabName, exact: true }).click();
    await this.expectInsumosOfertaTabActive(tabName);
  }

  /**
   * Comprueba que la pestaña está seleccionada, el breadcrumb muestra su etiqueta y la URL coincide con el slug.
   *
   * @param tabName - Etiqueta de pestaña habilitada.
   */
  async expectInsumosOfertaTabActive(tabName: RegistroInsumosOfertaTabName): Promise<void> {
    await expect(this.page).toHaveURL(
      RegistroInsumosOfertaNavigationPage.REGISTRO_INSUMOS_OFERTA_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
    const tab = this.page.getByRole('tab', { name: tabName, exact: true });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroInsumosOfertaNavigationPage.REGISTRO_INSUMOS_OFERTA_TAB_BREADCRUMBS[tabName],
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
    for (const header of REGISTRO_INSUMOS_OFERTA_CALENDAR_WEEKDAY_HEADERS) {
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
    for (const month of REGISTRO_INSUMOS_OFERTA_CALENDAR_ANO_MONTH_CELLS) {
      await expect(table.locator('tbody td').getByText(month, { exact: true })).toBeVisible();
    }
    for (const header of REGISTRO_INSUMOS_OFERTA_CALENDAR_WEEKDAY_HEADERS) {
      await expect(table.getByRole('columnheader', { name: header, exact: true })).toHaveCount(0);
    }
  }

  /**
   * Abre el desplegable de año del calendario, comprueba que las opciones coinciden exactamente con la config del tenant y selecciona el año dado.
   *
   * @param selectYear - Opción de año a seleccionar después de listar todos los años.
   */
  async expectCalendarYearDropdownWorks(selectYear = '2025'): Promise<void> {
    const yearCombo = this.calendarYearCombobox();
    await yearCombo.click();
    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
    await expect(dropdown).toBeVisible();
    await this.expectWizardSelectOptionsMatch(dropdown, REGISTRO_INSUMOS_OFERTA_CALENDAR_YEAR_OPTIONS, {
      fieldLabel: 'año del calendario',
    });
    await dropdown.locator('.ant-select-item-option-content').getByText(selectYear, { exact: true }).click();
    await expect(this.calendarYearSelect()).toContainText(selectYear);
    await expect(this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')).toHaveCount(0);
  }

  /**
   * Abre el desplegable de mes del calendario, comprueba que el conjunto completo de opciones coincide con la config del tenant y selecciona el mes dado.
   *
   * @param selectMonth - Opción de mes a seleccionar después de listar los meses visibles.
   */
  async expectCalendarMonthDropdownWorks(selectMonth = 'mar'): Promise<void> {
    const monthCombo = this.calendarMonthCombobox();
    await monthCombo.click();
    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
    await expect(dropdown).toBeVisible();
    await this.expectWizardSelectOptionsMatch(
      dropdown,
      [
        ...REGISTRO_INSUMOS_OFERTA_CALENDAR_MONTH_OPTIONS,
        ...REGISTRO_INSUMOS_OFERTA_CALENDAR_MONTH_OPTIONS_SCROLL,
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
   * Comprueba la barra Layout B de tabla: búsqueda, sin Filtros, sin chips de filtro y CTAs extra opcionales.
   *
   * @param extraButtons - Nombres extra de botones de la barra esperados además de la búsqueda.
   */
  async expectLayoutBTableToolbar(extraButtons: readonly string[] = ['Nuevo Registro']): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible({timeout:10_000});
    await this.expectFiltrosControlAbsent();
    await this.expectToolbarFilterChipsAbsent();
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
   * Abre Nuevo Registro de OEF Proyectada, valida los campos del asistente y cierra.
   */
  async expectOefProyectadaWizardDialog(): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      ctaName: 'Nuevo Registro',
      stepTitle: /Nueva Vigencia Oef/i,
      wizardSteps: REGISTRO_INSUMOS_OFERTA_OEF_NUEVO_REGISTRO_WIZARD_STEPS,
      fields: REGISTRO_INSUMOS_OFERTA_OEF_NUEVO_REGISTRO_FIELDS,
      dropdownOptions: REGISTRO_INSUMOS_OFERTA_OEF_WIZARD_DROPDOWN_OPTIONS,
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
    });
  }

  /**
   * Abre el formulario Nuevo Concepto, valida campos y el desplegable Unidad, y cierra.
   */
  async expectNuevoConceptoDialog(): Promise<void> {
    await this.expectFlatFormDialogWithComboboxOpensAndCloses(
      'Nuevo Concepto',
      REGISTRO_INSUMOS_OFERTA_CONCEPTO_FORM_FIELDS,
      { Unidad: [...REGISTRO_INSUMOS_OFERTA_CONCEPTO_UNIDAD_OPTIONS] },
      { requiredDialogText: 'Nombre Concepto' },
    );
  }

  /**
   * Abre Nuevo Registro de Conceptos OC, valida campos y el desplegable Concepto, y cierra.
   */
  async expectConceptosOcRegistroDialog(): Promise<void> {
    await this.expectFlatFormDialogWithComboboxOpensAndCloses(
      'Nuevo Registro',
      REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_FIELDS,
      REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_DROPDOWN_OPTIONS,
      {
        extraExpectedLabels: REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_SPINBUTTON_LABELS,
        spinbuttonLabels: REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_SPINBUTTON_LABELS,
      },
    );
  }

  /**
   * Abre Nuevo Registro de Gestion Conceptos, valida los campos del formulario de concepto y cierra.
   */
  async expectGestionConceptosRegistroDialog(): Promise<void> {
    await this.expectFlatFormDialogWithComboboxOpensAndCloses(
      'Nuevo Registro',
      REGISTRO_INSUMOS_OFERTA_CONCEPTO_FORM_FIELDS,
      { Unidad: [...REGISTRO_INSUMOS_OFERTA_CONCEPTO_UNIDAD_OPTIONS] },
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
}
