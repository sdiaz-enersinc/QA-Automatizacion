import { expect } from '@playwright/test';
import {
  getRegistroCttosEnergiaConfig,
  getModuleEnabledTabNames,
  isModuleEnabled,
  toBreadcrumbMatcherRecord,
  toTabSlugRecord,
} from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroCttosEnergiaTabName } from '../../config/types/registro-cttos-energia';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
  RegistroNavigationBasePage,
  type RegistroWizardDropdownOptionsMap,
  type RegistroWizardFieldDefinition,
  type RegistroWizardFieldKind,
} from './registro-navigation-base';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';
import { assertTabStripMatchesConfig } from '../../registro/tab-strip';
import { assertSidebarLabelsMatchConfig } from '../../registro/sidebar-labels';

export type EnergiaWizardFieldKind = RegistroWizardFieldKind;
export type EnergiaWizardFieldDefinition = RegistroWizardFieldDefinition;
export type EnergiaWizardDropdownOptionsMap = RegistroWizardDropdownOptionsMap;
export type { RegistroCttosEnergiaTabName };

const cfg = getRegistroCttosEnergiaConfig();

/** Etiqueta visible del submenú y de la tarjeta del tablero para Cttos energía (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_SUBMODULE_LABEL = cfg.registroCttosEnergiaSubmoduleLabel;

/** Indica si el módulo Registro Contratos energía está habilitado para el tenant activo. */
export const REGISTRO_CTTS_ENERGIA_ENABLED = isModuleEnabled(MODULE_IDS.registroCttosEnergia);

/** Etiquetas de pestaña del módulo Contratos energía (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_TAB_NAMES = cfg.registroCttosEnergiaTabNames;

/** Pestañas alcanzables con las credenciales actuales del tenant. */
export const REGISTRO_CTTS_ENERGIA_ENABLED_TAB_NAMES = getModuleEnabledTabNames(
  MODULE_IDS.registroCttosEnergia,
);

export const REGISTRO_CTTS_ENERGIA_LOCKED_TAB_NAMES = cfg.registroCttosEnergiaLockedTabNames;

/** Pestaña de aterrizaje usada como ancla del menú lateral y semilla. */
export const REGISTRO_CTTS_ENERGIA_DEFAULT_TAB = cfg.registroCttosEnergiaDefaultTab;

/** Pestaña Layout A (grilla LP con Select all). */
export const REGISTRO_CTTS_ENERGIA_LAYOUT_A_TAB = cfg.registroCttosEnergiaLayoutATab;

/** Pestaña Layout C (barra DEC de CTAs duales). */
export const REGISTRO_CTTS_ENERGIA_LAYOUT_C_TAB = cfg.registroCttosEnergiaLayoutCTab;

/** Pestaña Layout D (registro de archivos de Respaldos); vacía cuando el tenant no tiene vista Respaldos. */
export const REGISTRO_CTTS_ENERGIA_LAYOUT_D_TAB = cfg.registroCttosEnergiaLayoutDTab;

/** Pestaña Layout B MISC; vacía cuando el tenant no tiene vista Contratos MISC. */
export const REGISTRO_CTTS_ENERGIA_LAYOUT_MISC_TAB = cfg.registroCttosEnergiaLayoutMiscTab;

/** Una pestaña por familia de layout para las comprobaciones puntuales de Ruta B. */
export const REGISTRO_CTTS_ENERGIA_LAYOUT_SPOT_CHECK_TABS =
  cfg.registroCttosEnergiaLayoutSpotCheckTabs.filter((tabName) => tabName.length > 0);

/** Columnas de la grilla de contratos estándar (Layout A/B), incluido Estado. */
export const REGISTRO_CTTS_ENERGIA_STANDARD_CONTRACT_COLUMNS =
  cfg.registroCttosEnergiaStandardContractColumns;

/** Columnas de la grilla DDV (config del tenant; en gecg no incluye Código IE). */
export const REGISTRO_CTTS_ENERGIA_DDV_CONTRACT_COLUMNS = cfg.registroCttosEnergiaDdvContractColumns;

/** Columnas de la grilla RMS (config del tenant; en gecg no incluye Código IE). */
export const REGISTRO_CTTS_ENERGIA_RMS_CONTRACT_COLUMNS = cfg.registroCttosEnergiaRmsContractColumns;

/** Columnas de la grilla estándar cuyos encabezados se parecen a los chips antiguos de la barra (Estado / Usuario). */
export const REGISTRO_CTTS_ENERGIA_TOOLBAR_CHIP_LOOKALIKE_COLUMNS =
  REGISTRO_CTTS_ENERGIA_STANDARD_CONTRACT_COLUMNS.filter(
    (name) => name === 'Estado' || name === 'Usuario',
  );

/** Columnas de la grilla de Contratos MISC (conjunto estándar más Producto Facturable). */
export const REGISTRO_CTTS_ENERGIA_MISC_CONTRACT_COLUMNS =
  cfg.registroCttosEnergiaMiscContractColumns;

/** Columnas de la grilla DEC (sin columna Estado en la fila de encabezado). */
export const REGISTRO_CTTS_ENERGIA_DEC_CONTRACT_COLUMNS = cfg.registroCttosEnergiaDecContractColumns;

/** Columnas del registro de archivos de Respaldos (Layout D). */
export const REGISTRO_CTTS_ENERGIA_RESPALDOS_COLUMNS = cfg.registroCttosEnergiaRespaldosColumns;

/** Etiqueta de pestaña DDV (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_DDV_TAB = cfg.registroCttosEnergiaDdvTab;

/** Etiqueta de pestaña RMS (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_RMS_TAB = cfg.registroCttosEnergiaRmsTab;

/** Pestañas de contrato estándar cuya grilla muestra columna de selección masiva (Layout A). */
export const REGISTRO_CTTS_ENERGIA_LAYOUT_A_STANDARD_TABS = cfg.registroCttosEnergiaLayoutAStandardTabs;

/** Títulos de paso del asistente Nuevo Contrato de LP. */
export const REGISTRO_CTTS_ENERGIA_LP_NUEVO_CONTRATO_WIZARD_STEPS =
  cfg.registroCttosEnergiaLpNuevoContratoWizardSteps;

/** Títulos de paso del asistente Nuevo Contrato de UNR. */
export const REGISTRO_CTTS_ENERGIA_UNR_NUEVO_CONTRATO_WIZARD_STEPS =
  cfg.registroCttosEnergiaUnrNuevoContratoWizardSteps;

/** Títulos de paso del asistente Nuevo Contrato de DDV. */
export const REGISTRO_CTTS_ENERGIA_DDV_NUEVO_CONTRATO_WIZARD_STEPS =
  cfg.registroCttosEnergiaDdvNuevoContratoWizardSteps;

/** Títulos de paso del asistente Nuevo Contrato de RMS. */
export const REGISTRO_CTTS_ENERGIA_RMS_NUEVO_CONTRATO_WIZARD_STEPS =
  cfg.registroCttosEnergiaRmsNuevoContratoWizardSteps;

/** Títulos de paso del asistente Nuevon contrato de DEC. */
export const REGISTRO_CTTS_ENERGIA_DEC_NUEVO_CONTRATO_WIZARD_STEPS =
  cfg.registroCttosEnergiaDecNuevoContratoWizardSteps;

/** Opciones esperadas por combobox del asistente LP (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_LP_NUEVO_CONTRATO_FIELDS_DROPDOWN_OPTIONS: EnergiaWizardDropdownOptionsMap =
  cfg.registroCttosEnergiaLpNuevoContratoFieldsDropdownOptions;

/** Opciones esperadas por combobox del asistente UNR (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_UNR_NUEVO_CONTRATO_FIELDS_DROPDOWN_OPTIONS: EnergiaWizardDropdownOptionsMap =
  cfg.registroCttosEnergiaUnrNuevoContratoFieldsDropdownOptions;

/** Opciones esperadas por combobox del asistente DDV (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_DDV_NUEVO_CONTRATO_FIELDS_DROPDOWN_OPTIONS: EnergiaWizardDropdownOptionsMap =
  cfg.registroCttosEnergiaDdvNuevoContratoFieldsDropdownOptions;

/** Opciones esperadas por combobox del asistente RMS (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_RMS_NUEVO_CONTRATO_FIELDS_DROPDOWN_OPTIONS: EnergiaWizardDropdownOptionsMap =
  cfg.registroCttosEnergiaRmsNuevoContratoFieldsDropdownOptions;

/** Opciones esperadas por combobox del asistente Nuevon contrato de DEC (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_DEC_NUEVO_CONTRATO_FIELDS_DROPDOWN_OPTIONS: EnergiaWizardDropdownOptionsMap =
  cfg.registroCttosEnergiaDecNuevoContratoFieldsDropdownOptions;

/** Opciones esperadas por combobox de Nuevo Registro MISC (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_MISC_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS: EnergiaWizardDropdownOptionsMap =
  cfg.registroCttosEnergiaMiscNuevoRegistroFieldsDropdownOptions;

/** Campos del paso 1 de Nuevo Contrato LP (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_LP_NUEVO_CONTRATO_FIELDS: readonly EnergiaWizardFieldDefinition[] =
  cfg.registroCttosEnergiaLpNuevoContratoFields;

/** Campos del paso 1 de Nuevo Contrato UNR (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_UNR_NUEVO_CONTRATO_FIELDS: readonly EnergiaWizardFieldDefinition[] =
  cfg.registroCttosEnergiaUnrNuevoContratoFields;

/** Campos del paso 1 de Nuevo Contrato DDV (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_DDV_NUEVO_CONTRATO_FIELDS: readonly EnergiaWizardFieldDefinition[] =
  cfg.registroCttosEnergiaDdvNuevoContratoFields;

/** Campos del paso 1 de Nuevo Contrato RMS (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_RMS_NUEVO_CONTRATO_FIELDS: readonly EnergiaWizardFieldDefinition[] =
  cfg.registroCttosEnergiaRmsNuevoContratoFields;

/** Campos del paso 1 de Nuevon contrato DEC (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_DEC_NUEVO_CONTRATO_FIELDS: readonly EnergiaWizardFieldDefinition[] =
  cfg.registroCttosEnergiaDecNuevoContratoFields;

/** Campos del formulario Nuevo Registro MISC (config del tenant). */
export const REGISTRO_CTTS_ENERGIA_MISC_NUEVO_REGISTRO_FIELDS: readonly EnergiaWizardFieldDefinition[] =
  cfg.registroCttosEnergiaMiscNuevoRegistroFields;

/**
 * Navegación y aserciones del submódulo Contratos energía bajo Registro.
 */
export class RegistroCttosEnergiaNavigationPage extends RegistroNavigationBasePage {
  /** Segmento de slug de URL por pestaña de Contratos energía (config del tenant). */
  static readonly REGISTRO_CTTS_ENERGIA_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroCttosEnergiaTabSlugs,
  );

  /** Texto del tercer segmento del breadcrumb por pestaña activa (Respaldos puede usar regex). */
  static readonly REGISTRO_CTTS_ENERGIA_TAB_BREADCRUMBS: Record<string, string | RegExp> =
    toBreadcrumbMatcherRecord(cfg.registroCttosEnergiaTabBreadcrumbs);

  /**
   * Expande Registro y el desplegable del submódulo Cttos energía en el menú lateral.
   */
  async expandCttosEnergiaSidebar(): Promise<void> {
    await this.expandRegistroSubmodule(REGISTRO_CTTS_ENERGIA_SUBMODULE_LABEL);
  }

  /**
   * Comprueba que los ítems anidados de Contratos energía coinciden exactamente con enabled + locked.
   */
  async expectCttosEnergiaSidebarLinksVisible(): Promise<void> {
    await this.expandCttosEnergiaSidebar();
    await assertSidebarLabelsMatchConfig(
      this.registroSubmoduleNestedItems(),
      [...REGISTRO_CTTS_ENERGIA_ENABLED_TAB_NAMES, ...REGISTRO_CTTS_ENERGIA_LOCKED_TAB_NAMES],
      { context: 'Contratos energía nested sidebar' },
    );
    for (const tabName of REGISTRO_CTTS_ENERGIA_ENABLED_TAB_NAMES) {
      await expect(this.registroSubmenu().getByRole('link', { name: tabName, exact: true })).toBeVisible();
    }
    for (const tabName of REGISTRO_CTTS_ENERGIA_LOCKED_TAB_NAMES) {
      await expect(
        this.registroSubmenu().getByRole('menuitem', { name: tabName, exact: true, disabled: true }),
      ).toBeVisible();
    }
  }

  /**
   * Hace clic en el enlace anidado de una pestaña de Contratos energía.
   *
   * Si esa pestaña no tiene enlace en el menú (mismo patrón que Inventarios en combustible),
   * abre la pestaña de aterrizaje y cambia desde la tira de pestañas.
   *
   * @param tabName - Etiqueta de pestaña del JSON del tenant.
   */
  async clickCttosEnergiaSidebarLink(tabName: RegistroCttosEnergiaTabName): Promise<void> {
    await this.ensureCttosEnergiaSidebarExpanded();
    const submenu = this.registroSubmenu();
    const nestedLink = submenu.getByRole('link', { name: tabName });
    const targetSlug = RegistroCttosEnergiaNavigationPage.REGISTRO_CTTS_ENERGIA_TAB_SLUGS[tabName];

    if (await nestedLink.isVisible()) {
      await this.clickRegistroSubmenuLink(tabName);
      await expect(this.page).toHaveURL(targetSlug, { timeout: 15_000 });
      return;
    }

    const landingLink = submenu.getByRole('link', { name: REGISTRO_CTTS_ENERGIA_DEFAULT_TAB });
    if (await landingLink.isVisible()) {
      await this.clickRegistroSubmenuLink(REGISTRO_CTTS_ENERGIA_DEFAULT_TAB);
      await expect(this.page).toHaveURL(
        RegistroCttosEnergiaNavigationPage.REGISTRO_CTTS_ENERGIA_TAB_SLUGS[
          REGISTRO_CTTS_ENERGIA_DEFAULT_TAB
        ],
        { timeout: 15_000 },
      );
      if (tabName !== REGISTRO_CTTS_ENERGIA_DEFAULT_TAB) {
        await this.openContratosEnergiaTab(tabName);
      }
      return;
    }

    throw new Error(
      `No hay enlace anidado de Cttos energía para «${tabName}» ni para la pestaña de aterrizaje «${REGISTRO_CTTS_ENERGIA_DEFAULT_TAB}»`,
    );
  }

  /**
   * Vuelve a expandir Registro y Cttos energía cuando la navegación plegó los menús laterales.
   */
  async ensureCttosEnergiaSidebarExpanded(): Promise<void> {
    await this.expandCttosEnergiaSidebar();
    const landingLink = this.registroSubmenu()
      .getByRole('link', { name: REGISTRO_CTTS_ENERGIA_DEFAULT_TAB })
      .first();
    if (await landingLink.isVisible()) {
      return;
    }
    await this.ensureRegistroSubmoduleNestedLinksVisible(
      REGISTRO_CTTS_ENERGIA_SUBMODULE_LABEL,
      REGISTRO_CTTS_ENERGIA_DEFAULT_TAB,
    );
  }

  /**
   * Abre una pestaña de Contratos energía por los enlaces anidados del menú lateral bajo Cttos energía.
   *
   * @param entryLink - Enlace anidado del menú lateral a abrir; por defecto, la pestaña de aterrizaje del tenant.
   */
  async openCttosEnergiaFromSidebar(
    entryLink: RegistroCttosEnergiaTabName = REGISTRO_CTTS_ENERGIA_DEFAULT_TAB,
  ): Promise<void> {
    await this.expandCttosEnergiaSidebar();
    await this.clickCttosEnergiaSidebarLink(entryLink);
  }

  /**
   * Abre Cttos energía desde la grilla del tablero (icono ojo bajo la tarjeta Registro).
   */
  async openCttosEnergiaFromDashboardGrid(): Promise<void> {
    await expect(async () => {
      await this.hoverRegistroDashboardCard();
      const eye = this.registroDashboardCard()
        .getByRole('listitem')
        .filter({ hasText: REGISTRO_CTTS_ENERGIA_SUBMODULE_LABEL })
        .getByLabel('eye');
      await expect(eye).toBeVisible();
      await eye.click();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Comprueba el shell del gestor de Contratos energía: URL, breadcrumb y tira de pestañas habilitadas.
   */
  async expectGestorDeDatosCttosEnergiaShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/contratos-energia\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText('Contratos energia');
    await assertTabStripMatchesConfig(this.page, {
      enabledTabs: REGISTRO_CTTS_ENERGIA_ENABLED_TAB_NAMES,
      lockedTabs: REGISTRO_CTTS_ENERGIA_LOCKED_TAB_NAMES,
      context: 'Contratos energía',
    });
  }

  /**
   * Abre una pestaña de Contratos energía y comprueba selección, breadcrumb y slug de URL.
   */
  async openContratosEnergiaTab(tabName: RegistroCttosEnergiaTabName): Promise<void> {
    await this.page.getByRole('tab', { name: tabName, exact: true }).click();
    await this.expectContratosEnergiaTabActive(tabName);
  }

  /**
   * Comprueba que la pestaña está seleccionada, el breadcrumb muestra su etiqueta y la URL coincide con el slug.
   */
  async expectContratosEnergiaTabActive(tabName: RegistroCttosEnergiaTabName): Promise<void> {
    await expect(this.page).toHaveURL(
      RegistroCttosEnergiaNavigationPage.REGISTRO_CTTS_ENERGIA_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
    const tab = this.page.getByRole('tab', { name: tabName, exact: true });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroCttosEnergiaNavigationPage.REGISTRO_CTTS_ENERGIA_TAB_BREADCRUMBS[tabName],
    );
  }

  /**
   * Comprueba la barra Layout B: búsqueda, Filtros y CTA Nuevo Contrato (chips Modo Yo / Estado / Usuarios ausentes).
   */
  async expectLayoutBStandardToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlVisible();
    await this.expectToolbarFilterChipsAbsent();
    await expect(this.page.getByRole('button', { name: 'Nuevo Contrato' })).toBeVisible();
  }

  /**
   * Comprueba la barra de DDV/RMS en gecg: Layout B más adjudicaciones y Cargar archivos.
   */
  async expectLayoutBAdjudicacionesToolbar(): Promise<void> {
    await this.expectLayoutBStandardToolbar();
    const main = this.gestorMain();
    await expect(main.getByRole('button', { name: 'Descargar Adjudicaciones', exact: true })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Cargar Adjudicaciones', exact: true })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Cargar archivos', exact: true })).toBeVisible();
  }

  /**
   * Comprueba los encabezados de columna de la grilla de contratos en la primera tabla principal; Acciones es visibilidad opcional.
   */
  async expectContractGridColumnHeaders(
    columnNames: readonly string[],
    options?: { assertAcciones?: boolean; allowSelectAll?: boolean },
  ): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    const additionalAllowedColumns: string[] = [];
    if (options?.allowSelectAll) {
      additionalAllowedColumns.push('Select all');
    }
    if (options?.assertAcciones ?? true) {
      additionalAllowedColumns.push('Acciones');
    }
    await assertTableColumnHeadersMatchConfig(table, columnNames, {
      additionalAllowedColumns,
    });
  }

  /**
   * Comprueba la presencia de la columna de selección masiva en una pestaña de grilla de contratos estándar.
   */
  async expectStandardContractGridBulkSelectLayout(tabName: RegistroCttosEnergiaTabName): Promise<void> {
    if (REGISTRO_CTTS_ENERGIA_LAYOUT_A_STANDARD_TABS.includes(tabName)) {
      await this.expectSelectAllColumnVisible();
      return;
    }
    await this.expectNoSelectAllColumn();
  }

  /**
   * Comprueba que el encabezado de la columna de selección masiva está ausente (grillas estándar Layout B).
   */
  async expectNoSelectAllColumn(): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await expect(table.getByRole('columnheader', { name: 'Select all' })).toHaveCount(0);
  }

  /**
   * Comprueba que el encabezado de la columna Select all está visible (grilla Layout A LP).
   */
  async expectSelectAllColumnVisible(): Promise<void> {
    await expect(
      this.gestorMain().getByRole('columnheader', { name: 'Select all' }),
    ).toBeVisible();
  }

  /**
   * Devuelve la etiqueta de pestaña DEC desde la config del tenant.
   */
  private decTabName(): RegistroCttosEnergiaTabName {
    return REGISTRO_CTTS_ENERGIA_LAYOUT_C_TAB;
  }

  /**
   * Espera a que la pestaña DEC renderice su barra de CTAs duales (evita un destello de la barra de LP).
   */
  async waitForDecTabToolbarReady(): Promise<void> {
    const main = this.gestorMain();
    const uploadButton = main.getByRole('button', { name: 'Cargar archivos' });
    const newContractButton = main.getByRole('button', { name: /Nuevo[n]? contrato/i });
    const decTab = this.decTabName();

    await expect(async () => {
      if (!(await uploadButton.isVisible())) {
        await this.page.getByRole('tab', { name: decTab, exact: true }).click();
        await this.expectContratosEnergiaTabActive(decTab);
      }
      await expect(uploadButton).toBeVisible();
      await expect(newContractButton).toBeVisible();
    }).toPass({ timeout: 30_000 });
  }

  /**
   * Comprueba la barra Layout C DEC y los CTAs duales (QA puede mostrar Nuevo contrato o el typo Nuevon).
   */
  async expectLayoutCDecToolbar(): Promise<void> {
    await this.waitForDecTabToolbarReady();
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlVisible();
    await this.expectToolbarFilterChipsAbsent();
    await expect(main.getByRole('button', { name: 'Cargar archivos' })).toBeVisible();
    await expect(main.getByRole('button', { name: /Nuevo[n]? contrato/i })).toBeVisible();
  }

  /**
   * Espera a que la pestaña Respaldos renderice su barra de registro de archivos (evita un destello de la barra de LP).
   */
  async waitForRespaldosTabToolbarReady(): Promise<void> {
    const main = this.gestorMain();
    const uploadButton = main.getByRole('button', { name: 'Cargar Archivo' });
    const respaldosTab = REGISTRO_CTTS_ENERGIA_LAYOUT_D_TAB;

    await expect(async () => {
      if (!(await uploadButton.isVisible())) {
        await this.page.getByRole('tab', { name: respaldosTab, exact: true }).click();
        await this.expectContratosEnergiaTabActive(respaldosTab);
      }
      await expect(uploadButton).toBeVisible();
      await expect(main.getByText('Modo Enfoque', { exact: true })).toBeVisible();
    }).toPass({ timeout: 30_000 });
  }

  /**
   * Comprueba la barra Layout D Respaldos: sin Filtros, con Modo Enfoque y CTA singular Cargar Archivo.
   */
  async expectLayoutDRespaldosToolbar(): Promise<void> {
    await this.waitForRespaldosTabToolbarReady();
    const main = this.gestorMain();
    await this.expectToolbarFilterChipsAbsent();
    await this.expectFiltrosControlAbsent();
    await expect(main.getByText('Modo Enfoque', { exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Cargar Archivo' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Nuevo Contrato' })).not.toBeVisible();
  }

  /**
   * Abre Nuevo Contrato LP, valida los campos y desplegables del paso 1, y cierra el asistente.
   */
  async expectLpNuevoContratoDialogOpensAndCloses(): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
      ctaName: 'Nuevo Contrato',
      stepTitle: /Nuevo contrato LP/i,
      wizardSteps: REGISTRO_CTTS_ENERGIA_LP_NUEVO_CONTRATO_WIZARD_STEPS,
      fields: REGISTRO_CTTS_ENERGIA_LP_NUEVO_CONTRATO_FIELDS,
      dropdownOptions: REGISTRO_CTTS_ENERGIA_LP_NUEVO_CONTRATO_FIELDS_DROPDOWN_OPTIONS,
    });
  }

  /**
   * Abre Nuevo Contrato UNR, valida los campos y desplegables del paso 1, y cierra el asistente.
   */
  async expectUnrNuevoContratoDialogOpensAndCloses(): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
      ctaName: 'Nuevo Contrato',
      stepTitle: /Nuevo contrato UNR/i,
      wizardSteps: REGISTRO_CTTS_ENERGIA_UNR_NUEVO_CONTRATO_WIZARD_STEPS,
      fields: REGISTRO_CTTS_ENERGIA_UNR_NUEVO_CONTRATO_FIELDS,
      dropdownOptions: REGISTRO_CTTS_ENERGIA_UNR_NUEVO_CONTRATO_FIELDS_DROPDOWN_OPTIONS,
    });
  }

  /**
   * Abre Nuevo Contrato DDV, valida campos y desplegables, y cierra.
   *
   * Si el tenant declara pasos de asistente, valida el pie estándar (Cancelar / Siguiente).
   * Si no hay pasos, el formulario es plano como MISC (Cancelar / Limpiar / Guardar, sin Siguiente).
   */
  async expectDdvNuevoContratoDialogOpensAndCloses(): Promise<void> {
    const wizardSteps = REGISTRO_CTTS_ENERGIA_DDV_NUEVO_CONTRATO_WIZARD_STEPS;
    const hasWizardSteps = wizardSteps.length > 0;
    await this.expectRegistroWizardDialogOpensAndCloses({
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
      ctaName: 'Nuevo Contrato',
      stepTitle: hasWizardSteps ? /Nuevo contrato DDV/i : 'Registrar Información',
      wizardSteps: hasWizardSteps ? wizardSteps : undefined,
      fields: REGISTRO_CTTS_ENERGIA_DDV_NUEVO_CONTRATO_FIELDS,
      dropdownOptions: REGISTRO_CTTS_ENERGIA_DDV_NUEVO_CONTRATO_FIELDS_DROPDOWN_OPTIONS,
      footerVariant: hasWizardSteps ? 'standard' : 'misc',
      absentWizardSteps: hasWizardSteps
        ? undefined
        : ['Nuevo contrato DDV', 'Código SIC', 'Datos macro', 'Carga archivos'],
    });
  }

  /**
   * Abre Nuevo Contrato RMS, valida campos y desplegables, y cierra.
   *
   * Si el tenant declara pasos de asistente, valida el pie estándar (Cancelar / Siguiente).
   * Si no hay pasos, el formulario es plano como MISC (Cancelar / Limpiar / Guardar, sin Siguiente).
   */
  async expectRmsNuevoContratoDialogOpensAndCloses(): Promise<void> {
    const wizardSteps = REGISTRO_CTTS_ENERGIA_RMS_NUEVO_CONTRATO_WIZARD_STEPS;
    const hasWizardSteps = wizardSteps.length > 0;
    await this.expectRegistroWizardDialogOpensAndCloses({
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
      ctaName: 'Nuevo Contrato',
      stepTitle: hasWizardSteps ? /Nuevo contrato RMS/i : 'Registrar Información',
      wizardSteps: hasWizardSteps ? wizardSteps : undefined,
      fields: REGISTRO_CTTS_ENERGIA_RMS_NUEVO_CONTRATO_FIELDS,
      dropdownOptions: REGISTRO_CTTS_ENERGIA_RMS_NUEVO_CONTRATO_FIELDS_DROPDOWN_OPTIONS,
      footerVariant: hasWizardSteps ? 'standard' : 'misc',
      absentWizardSteps: hasWizardSteps
        ? undefined
        : ['Nuevo contrato RMS', 'Código SIC', 'Datos macro', 'Carga archivos'],
    });
  }

  /**
   * Abre Nuevo contrato DEC, valida campos y desplegables, y cierra.
   *
   * Si el tenant declara pasos de asistente, valida el pie estándar (Cancelar / Siguiente).
   * Si no hay pasos, el formulario es plano como MISC (Cancelar / Limpiar / Guardar, sin Siguiente).
   */
  async expectDecNuevonContratoDialogOpensAndCloses(): Promise<void> {
    const wizardSteps = REGISTRO_CTTS_ENERGIA_DEC_NUEVO_CONTRATO_WIZARD_STEPS;
    const hasWizardSteps = wizardSteps.length > 0;
    await this.expectRegistroWizardDialogOpensAndCloses({
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
      ctaName: /Nuevo[n]? contrato/i,
      stepTitle: hasWizardSteps ? /Nuevo contrato DEC/i : 'Registrar Información',
      wizardSteps: hasWizardSteps ? wizardSteps : undefined,
      fields: REGISTRO_CTTS_ENERGIA_DEC_NUEVO_CONTRATO_FIELDS,
      dropdownOptions: REGISTRO_CTTS_ENERGIA_DEC_NUEVO_CONTRATO_FIELDS_DROPDOWN_OPTIONS,
      footerVariant: hasWizardSteps ? 'standard' : 'misc',
      absentWizardSteps: hasWizardSteps
        ? undefined
        : ['Nuevo contrato DEC', 'Código SIC', 'Datos macro', 'Carga archivos'],
    });
  }

  /**
   * Abre Nuevo Registro MISC, valida campos y desplegables (sin pasos de asistente), y cierra.
   *
   * Pie de formulario plano: Cancelar / Limpiar / Guardar (sin Siguiente).
   */
  async expectMiscNuevoRegistroDialogOpensAndCloses(): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
      ctaName: 'Nuevo Registro',
      stepTitle: 'Registrar Información',
      fields: REGISTRO_CTTS_ENERGIA_MISC_NUEVO_REGISTRO_FIELDS,
      dropdownOptions: REGISTRO_CTTS_ENERGIA_MISC_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS,
      footerVariant: 'misc',
      absentWizardSteps: ['Código SIC', 'Datos macro', 'Carga archivos'],
    });
  }

  /**
   * Abre el diálogo Cargar archivos de DEC, comprueba que no hay comboboxes, y cierra.
   */
  async expectDecUploadDialogOpensAndCloses(): Promise<void> {
    await this.expectEnergiaUploadDialogOpensAndCloses({
      buttonName: 'Cargar archivos',
      assertDescargarPlantilla: false,
    });
  }

  /**
   * Abre el diálogo Cargar Archivo de Respaldos, comprueba que no hay comboboxes y el CTA de plantilla.
   */
  async expectRespaldosUploadDialogOpensAndCloses(): Promise<void> {
    await this.expectEnergiaUploadDialogOpensAndCloses({
      buttonName: 'Cargar Archivo',
      assertDescargarPlantilla: true,
    });
  }

  /**
   * Abre un diálogo solo de carga, comprueba dropzone, Guardar, plantilla y que no hay comboboxes.
   *
   * @param options - Nombre del botón de la barra y si Descargar plantilla debe estar presente.
   */
  private async expectEnergiaUploadDialogOpensAndCloses(options: {
    buttonName: string;
    assertDescargarPlantilla: boolean;
  }): Promise<void> {
    const dialog = await this.openRegistrarInformacionDialog(options.buttonName);
    await this.expectCargarArchivoDropzone(dialog);
    if (options.assertDescargarPlantilla) {
      await expect(dialog.getByRole('button', { name: 'Descargar plantilla' })).toBeVisible();
    } else {
      await expect(dialog.getByRole('button', { name: 'Descargar plantilla' })).toHaveCount(0);
    }
    await expect(dialog.getByRole('combobox')).toHaveCount(0);

    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
  }
}
