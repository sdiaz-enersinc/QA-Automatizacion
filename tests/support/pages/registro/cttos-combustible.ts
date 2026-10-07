import { expect } from '@playwright/test';
import {
  getRegistroCttosCombustibleConfig,
  getModuleEnabledTabNames,
  isModuleEnabled,
  toTabSlugRecord,
} from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroCttosCombustibleTabName } from '../../config/types/registro-cttos-combustible';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';
import { assertTabStripMatchesConfig } from '../../registro/tab-strip';
import { assertSidebarLabelsMatchConfig } from '../../registro/sidebar-labels';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
  RegistroNavigationBasePage,
  type RegistroWizardDropdownOptionsMap,
  type RegistroWizardFieldDefinition,
  type RegistroWizardFieldKind,
} from './registro-navigation-base';

export type CombustibleWizardFieldKind = RegistroWizardFieldKind;
export type CombustibleWizardFieldDefinition = RegistroWizardFieldDefinition;
export type CombustibleWizardDropdownOptionsMap = RegistroWizardDropdownOptionsMap;
export type { RegistroCttosCombustibleTabName };

const cfg = getRegistroCttosCombustibleConfig();

/** Indica si el módulo Registro Contratos combustible está habilitado para el tenant activo. */
export const REGISTRO_CTTS_COMBUSTIBLE_ENABLED = isModuleEnabled(MODULE_IDS.registroCttosCombustible);

/** Etiquetas de pestaña del módulo Contratos combustible (config del tenant). */
export const REGISTRO_CTTS_COMBUSTIBLE_TAB_NAMES = cfg.registroCttosCombustibleTabNames;

/** Pestañas alcanzables con las credenciales actuales del tenant. */
export const REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES = getModuleEnabledTabNames(
  MODULE_IDS.registroCttosCombustible,
);

export const REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB_NAMES =
  cfg.registroCttosCombustibleLockedTabNames;

/** Pestaña de aterrizaje usada como ancla del menú lateral, semilla y recuperación tras Inventarios. */
export const REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB = cfg.registroCttosCombustibleDefaultTab;

/** Pestaña Layout A (grilla Transporte con Select all). */
export const REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_A_TAB = cfg.registroCttosCombustibleLayoutATab;

/** Pestaña Layout B (grilla Suministro sin Select all). */
export const REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_B_TAB = cfg.registroCttosCombustibleLayoutBTab;

/** Pestaña Layout C (Inventarios; actualmente un estado vacío 404 en QA). */
export const REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_C_TAB = cfg.registroCttosCombustibleLayoutCTab;

/** Primera pestaña bloqueada (Insumos); la usa la spec de pestaña bloqueada. */
export const REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB = REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB_NAMES[0];

/** Una pestaña por familia de layout para las comprobaciones puntuales de Ruta B. */
export const REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_SPOT_CHECK_TABS = [
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_A_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_B_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_C_TAB,
].filter((tabName) => tabName.length > 0);

/** Encabezados de columna de la grilla Transporte (Layout A, sin Select all ni Acciones). */
export const REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_COLUMNS =
  cfg.registroCttosCombustibleTransporteColumns;

/** Encabezados de columna de la grilla Suministro (Layout B, sin Acciones). */
export const REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_COLUMNS =
  cfg.registroCttosCombustibleSuministroColumns;

/** Títulos de paso del asistente Nuevo Registro de Transporte (pasos 1 y 2). */
export const REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_WIZARD_STEPS =
  cfg.registroCttosCombustibleTransporteNuevoRegistroWizardSteps;

/** Títulos de paso del asistente Nuevo Registro de Suministro (pasos 1 y 2). */
export const REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_NUEVO_REGISTRO_WIZARD_STEPS =
  cfg.registroCttosCombustibleSuministroNuevoRegistroWizardSteps;

/** Opciones esperadas por combobox del asistente de Transporte (config del tenant). */
export const REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS: CombustibleWizardDropdownOptionsMap =
  cfg.registroCttosCombustibleTransporteNuevoRegistroFieldsDropdownOptions;

/** Opciones esperadas por combobox del asistente de Suministro (config del tenant). */
export const REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS: CombustibleWizardDropdownOptionsMap =
  cfg.registroCttosCombustibleSuministroNuevoRegistroFieldsDropdownOptions;

/** Campos del paso 1 de Nuevo Registro de Transporte (config del tenant). */
export const REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_FIELDS: readonly CombustibleWizardFieldDefinition[] =
  cfg.registroCttosCombustibleTransporteNuevoRegistroFields;

/** Etiqueta visible del submenú y de la tarjeta del tablero para Cttos combustible (config del tenant). */
export const REGISTRO_CTTS_COMBUSTIBLE_SUBMODULE_LABEL =
  cfg.registroCttosCombustibleSubmoduleLabel;

/** Etiquetas del formulario de Transporte no modeladas como tipos de campo de asistente (config del tenant). */
export const REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_EXTRA_LABELS =
  cfg.registroCttosCombustibleTransporteNuevoRegistroExtraLabels;

/** Campos del paso 1 de Nuevo Registro de Suministro (config del tenant). */
export const REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_NUEVO_REGISTRO_FIELDS: readonly CombustibleWizardFieldDefinition[] =
  cfg.registroCttosCombustibleSuministroNuevoRegistroFields;

/**
 * Navegación y aserciones del submódulo Contratos combustible bajo Registro.
 */
export class RegistroCttosCombustibleNavigationPage extends RegistroNavigationBasePage {
  /** Segmento de slug de URL por pestaña de Contratos combustible (config del tenant). */
  static readonly REGISTRO_CTTS_COMBUSTIBLE_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroCttosCombustibleTabSlugs,
  );

  /** Texto del tercer segmento del breadcrumb por pestaña activa. */
  static readonly REGISTRO_CTTS_COMBUSTIBLE_TAB_BREADCRUMBS: Record<string, string> =
    cfg.registroCttosCombustibleTabBreadcrumbs;

  /**
   * Expande Registro y el desplegable del submódulo Cttos combustible en el menú lateral.
   */
  async expandCttosCombustibleSidebar(): Promise<void> {
    await this.expandRegistroSubmodule(REGISTRO_CTTS_COMBUSTIBLE_SUBMODULE_LABEL);
  }

  /**
   * Comprueba que los ítems anidados de Contratos combustible coinciden exactamente con enabled + locked.
   */
  async expectCttosCombustibleSidebarLinksVisible(): Promise<void> {
    await this.expandCttosCombustibleSidebar();
    await assertSidebarLabelsMatchConfig(
      this.registroSubmoduleNestedItems(),
      [...REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES, ...REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB_NAMES],
      { context: 'Contratos combustible nested sidebar' },
    );
    for (const tabName of REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES) {
      await expect(
        this.registroSubmenu().getByRole('menuitem', { name: tabName, exact: true }).first(),
      ).toBeVisible();
    }
    for (const tabName of REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB_NAMES) {
      await expect(
        this.registroSubmenu().getByRole('menuitem', { name: tabName, exact: true, disabled: true }),
      ).toBeVisible();
    }
  }

  /**
   * Vuelve a expandir Registro y Cttos combustible cuando la navegación plegó los menús laterales.
   */
  async ensureCttosCombustibleSidebarExpanded(): Promise<void> {
    await this.ensureRegistroSubmoduleNestedLinksVisible(
      REGISTRO_CTTS_COMBUSTIBLE_SUBMODULE_LABEL,
      REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB,
    );
  }

  /**
   * Hace clic en una fila del menú lateral de Contratos combustible. Las pestañas sin enlace anidado (Inventarios)
   * aterrizan en Transporte y luego cambian desde la tira de pestañas.
   */
  async clickCttosCombustibleSidebarLink(tabName: RegistroCttosCombustibleTabName): Promise<void> {
    await this.ensureCttosCombustibleSidebarExpanded();
    const link = this.registroSubmenu().getByRole('link', { name: tabName });
    if (await link.isVisible()) {
      await this.clickRegistroSubmenuLink(tabName);
      await expect(this.page).toHaveURL(
        RegistroCttosCombustibleNavigationPage.REGISTRO_CTTS_COMBUSTIBLE_TAB_SLUGS[tabName],
        { timeout: 15_000 },
      );
      return;
    }

    await this.clickRegistroSubmenuLink(REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB);
    await expect(this.page).toHaveURL(
      RegistroCttosCombustibleNavigationPage.REGISTRO_CTTS_COMBUSTIBLE_TAB_SLUGS[
        REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB
      ],
      { timeout: 15_000 },
    );
    if (tabName !== REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB) {
      await this.openContratosCombustibleTab(tabName);
    }
  }

  /**
   * Abre una pestaña de Contratos combustible por los enlaces anidados del menú lateral bajo Cttos combustible.
   */
  async openCttosCombustibleFromSidebar(tabName: RegistroCttosCombustibleTabName): Promise<void> {
    await this.expandCttosCombustibleSidebar();
    await this.clickCttosCombustibleSidebarLink(tabName);
  }

  /**
   * Abre Cttos combustible desde la grilla del tablero (icono ojo bajo la tarjeta Registro).
   */
  async openCttosCombustibleFromDashboardGrid(): Promise<void> {
    await this.registroDashboardCard()
      .getByRole('listitem')
      .filter({ hasText: REGISTRO_CTTS_COMBUSTIBLE_SUBMODULE_LABEL })
      .getByLabel('eye')
      .click();
  }

  /**
   * Comprueba que las pestañas bloqueadas de Contratos combustible (Insumos) son visibles pero están deshabilitadas.
   */
  async expectLockedTabsDisabled(): Promise<void> {
    for (const tabName of REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB_NAMES) {
      const tab = this.page.getByRole('tab', { name: tabName, exact: true });
      await expect(tab).toBeVisible();
      await expect(tab).toBeDisabled();
    }
  }

  /**
   * Comprueba que un clic forzado en una pestaña bloqueada no navega fuera de la vista actual.
   *
   * @param tabName - Etiqueta de pestaña bloqueada (p. ej. Insumos).
   */
  async expectLockedTabDoesNotNavigate(tabName: RegistroCttosCombustibleTabName): Promise<void> {
    const url = this.page.url();
    const selected = this.page.getByRole('tab', { selected: true });
    const selectedName = (await selected.textContent())?.trim() ?? '';
    await this.page.getByRole('tab', { name: tabName, exact: true }).click({ force: true });
    await expect(this.page).toHaveURL(url);
    if (selectedName) {
      await expect(this.page.getByRole('tab', { name: selectedName, exact: true })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    }
    await expect(this.page.getByRole('dialog')).toHaveCount(0);
  }

  /**
   * Comprueba el shell del gestor de Contratos combustible: URL, breadcrumb y estado de la tira de pestañas.
   */
  async expectGestorDeDatosCttosCombustibleShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/contratos-combustible\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText('Contratos combustible');
    await assertTabStripMatchesConfig(this.page, {
      enabledTabs: REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES,
      lockedTabs: REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB_NAMES,
      context: 'Contratos combustible',
    });
  }

  /**
   * Abre una pestaña de Contratos combustible y comprueba selección, breadcrumb y slug de URL.
   */
  async openContratosCombustibleTab(tabName: RegistroCttosCombustibleTabName): Promise<void> {
    await this.page.getByRole('tab', { name: tabName, exact: true }).click();
    await this.expectContratosCombustibleTabActive(tabName);
  }

  /**
   * Comprueba que la pestaña está seleccionada, el breadcrumb muestra su etiqueta y la URL coincide con el slug.
   */
  async expectContratosCombustibleTabActive(tabName: RegistroCttosCombustibleTabName): Promise<void> {
    await expect(this.page).toHaveURL(
      RegistroCttosCombustibleNavigationPage.REGISTRO_CTTS_COMBUSTIBLE_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
    const tab = this.page.getByRole('tab', { name: tabName, exact: true });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroCttosCombustibleNavigationPage.REGISTRO_CTTS_COMBUSTIBLE_TAB_BREADCRUMBS[tabName],
    );
  }

  /**
   * Comprueba la barra Layout A Transporte: búsqueda, Filtros y Nuevo Registro.
   */
  async expectLayoutATransporteToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlVisible();
    await this.expectToolbarFilterChipsAbsent();
    await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toBeVisible();
  }

  /**
   * Comprueba la barra Layout B Suministro: búsqueda, Filtros y Nuevo Registro.
   */
  async expectLayoutBSuministroToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlVisible();
    await this.expectToolbarFilterChipsAbsent();
    await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toBeVisible();
  }

  /**
   * Comprueba que Inventarios aterriza actualmente en el estado vacío 404 del Gestor (QA v2.7.0),
   * y luego vuelve a Transporte para no dejar la sesión compartida en la ruta rota.
   */
  async expectInventariosUnavailablePage(): Promise<void> {
    await expect(this.page.getByText('404')).toBeVisible();
    await expect(
      this.page.getByText(/la página que estás buscando no se encuentra disponible/i),
    ).toBeVisible();
    await expect(this.gestorMain().getByRole('table')).toHaveCount(0);
    await this.restoreDefaultCombustibleView();
  }

  /**
   * Sale de la ruta 404 de Inventarios seleccionando Transporte cuando esa pestaña está disponible.
   */
  async restoreDefaultCombustibleView(): Promise<void> {
    const defaultTab = this.page.getByRole('tab', { name: REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB, exact: true });
    if (!(await defaultTab.isVisible())) {
      return;
    }
    await defaultTab.click();
    await this.expectContratosCombustibleTabActive(REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB);
  }

  /**
   * Comprueba los encabezados de columna de la grilla Transporte, incluido Select all y Acciones.
   */
  async expectTransporteGridColumnHeaders(
    columnNames: readonly string[] = REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_COLUMNS,
  ): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames, {
      additionalAllowedColumns: ['Select all', 'Acciones'],
    });
    await expect(table.getByRole('columnheader', { name: 'Select all' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Acciones' })).toBeVisible();
  }

  /**
   * Comprueba los encabezados de columna de la grilla Suministro sin Select all; Acciones incluida.
   */
  async expectSuministroGridColumnHeaders(
    columnNames: readonly string[] = REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_COLUMNS,
  ): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames, {
      additionalAllowedColumns: ['Acciones'],
    });
    await expect(table.getByRole('columnheader', { name: 'Select all' })).toHaveCount(0);
    await expect(table.getByRole('columnheader', { name: 'Acciones' })).toBeVisible();
  }

  /**
   * Comprueba que el encabezado de la columna Select all está visible (grilla Layout A Transporte).
   */
  async expectSelectAllColumnVisible(): Promise<void> {
    await expect(
      this.gestorMain().getByRole('columnheader', { name: 'Select all' }),
    ).toBeVisible();
  }

  /**
   * Comprueba que el encabezado de la columna de selección masiva está ausente (grilla Layout B Suministro).
   */
  async expectNoSelectAllColumn(): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await expect(table.getByRole('columnheader', { name: 'Select all' })).toHaveCount(0);
  }

  /**
   * Abre Nuevo Registro de Transporte, valida los campos y desplegables del paso 1, y cierra el asistente.
   */
  async expectTransporteNuevoRegistroDialogOpensAndCloses(): Promise<void> {
    await this.expectCombustibleNuevoRegistroDialogOpensAndCloses({
      stepTitle: /Nuevo contrato Transporte/i,
      wizardSteps: REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_WIZARD_STEPS,
      fields: REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_FIELDS,
      dropdownOptions: REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS,
      extraExpectedLabels: REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_EXTRA_LABELS,
    });
  }

  /**
   * Abre Nuevo Registro de Suministro, valida los campos del paso 1 (incluidas filas con desplazamiento), y cierra.
   */
  async expectSuministroNuevoRegistroDialogOpensAndCloses(): Promise<void> {
    await this.expectCombustibleNuevoRegistroDialogOpensAndCloses({
      stepTitle: /Nuevo contrato Suministro/i,
      wizardSteps: REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_NUEVO_REGISTRO_WIZARD_STEPS,
      fields: REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_NUEVO_REGISTRO_FIELDS,
      dropdownOptions: REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS,
      assertScrollableForm: true,
    });
  }

  /**
   * Comprueba el contenedor, campos y pie del asistente Nuevo Registro de Transporte/Suministro, y cierra.
   */
  private async expectCombustibleNuevoRegistroDialogOpensAndCloses(options: {
    stepTitle: string | RegExp;
    wizardSteps: readonly string[];
    fields: readonly CombustibleWizardFieldDefinition[];
    dropdownOptions: CombustibleWizardDropdownOptionsMap;
    assertScrollableForm?: boolean;
    extraExpectedLabels?: readonly string[];
  }): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      ctaName: 'Nuevo Registro',
      fieldAssertOptions: {
        ...REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
        retryOpen: true,
      },
      ...options,
    });
  }
}
