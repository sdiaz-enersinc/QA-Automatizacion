import { expect } from '@playwright/test';
import {
  getRegistroOtrosContratosConfig,
  getModuleEnabledTabNames,
  isModuleEnabled,
  toTabSlugRecord,
} from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroOtrosContratosTabName } from '../../config/types/registro-otros-contratos';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
  RegistroNavigationBasePage,
} from './registro-navigation-base';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';
import { assertTabStripMatchesConfig } from '../../registro/tab-strip';
import { assertSidebarLabelsMatchConfig } from '../../registro/sidebar-labels';
import { REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS } from './navigation';

const cfg = getRegistroOtrosContratosConfig();

/** Indica si el módulo Registro Otros contratos está habilitado para el tenant activo. */
export const REGISTRO_OTROS_CONTRATOS_ENABLED = isModuleEnabled(MODULE_IDS.registroOtrosContratos);

/** Etiquetas de pestaña del módulo Otros contratos (config del tenant). */
export const REGISTRO_OTROS_CONTRATOS_TAB_NAMES = cfg.registroOtrosContratosTabNames;

/** Pestañas alcanzables con las credenciales actuales del tenant. */
export const REGISTRO_OTROS_CONTRATOS_ENABLED_TAB_NAMES = getModuleEnabledTabNames(
  MODULE_IDS.registroOtrosContratos,
);

export const REGISTRO_OTROS_CONTRATOS_LOCKED_TAB_NAMES = cfg.registroOtrosContratosLockedTabNames;

/** Pestaña de aterrizaje usada como ancla del menú lateral y semilla. */
export const REGISTRO_OTROS_CONTRATOS_DEFAULT_TAB = cfg.registroOtrosContratosDefaultTab;

/** Etiqueta de pestaña Miscelaneos (config del tenant). */
export const REGISTRO_OTROS_CONTRATOS_MISC_TAB = cfg.registroOtrosContratosMiscTab;

/** Etiqueta de pestaña AGR (config del tenant). */
export const REGISTRO_OTROS_CONTRATOS_AGR_TAB = cfg.registroOtrosContratosAgrTab;

/** Etiqueta de pestaña Excedentes (habilitada en algunos tenants). */
export const REGISTRO_OTROS_CONTRATOS_EXCEDENTES_TAB = 'Excedentes';

/** Columnas de la grilla Miscelaneos (conjunto estándar más Producto Facturable). */
export const REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS =
  cfg.registroOtrosContratosMiscContractColumns;

/** Columnas de la grilla AGR (conjunto de contrato estándar, sin Producto Facturable). */
export const REGISTRO_OTROS_CONTRATOS_AGR_CONTRACT_COLUMNS =
  cfg.registroOtrosContratosAgrContractColumns;

/**
 * Navegación y aserciones del submódulo Otros contratos bajo Registro.
 */
export class RegistroOtrosContratosNavigationPage extends RegistroNavigationBasePage {
  /** Segmento de slug de URL por pestaña de Otros contratos (config del tenant). */
  static readonly REGISTRO_OTROS_CONTRATOS_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroOtrosContratosTabSlugs,
  );

  /** Texto del tercer segmento del breadcrumb por pestaña activa. */
  static readonly REGISTRO_OTROS_CONTRATOS_TAB_BREADCRUMBS: Record<string, string> =
    cfg.registroOtrosContratosTabBreadcrumbs;

  /**
   * Expande Registro y el desplegable del submódulo Otros contratos en el menú lateral.
   */
  async expandOtrosContratosSidebar(): Promise<void> {
    await this.expandRegistroSubmodule('Otros contratos');
  }

  /**
   * Vuelve a expandir Registro y Otros contratos cuando la navegación plegó los menús laterales.
   */
  async ensureOtrosContratosSidebarExpanded(): Promise<void> {
    await this.ensureRegistroSubmoduleNestedLinksVisible(
      'Otros contratos',
      REGISTRO_OTROS_CONTRATOS_DEFAULT_TAB,
    );
  }

  /**
   * Hace clic en el enlace de una pestaña de Otros contratos dentro del submenú expandido.
   */
  async clickOtrosContratosSidebarLink(tabName: RegistroOtrosContratosTabName): Promise<void> {
    await this.ensureOtrosContratosSidebarExpanded();
    const submenu = this.registroSubmenu();
    const link = submenu.getByRole('link', { name: tabName });
    if ((await link.count()) > 0) {
      await this.clickRegistroSubmenuLink(tabName);
    } else {
      await submenu.getByRole('menuitem', { name: tabName }).first().click();
    }
    await expect(this.page).toHaveURL(
      RegistroOtrosContratosNavigationPage.REGISTRO_OTROS_CONTRATOS_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
  }

  /**
   * Abre una pestaña de Otros contratos por los enlaces anidados del menú lateral bajo Otros contratos.
   *
   * @param entryLink - Enlace anidado del menú lateral a abrir; por defecto, la pestaña de aterrizaje del tenant.
   */
  async openOtrosContratosFromSidebar(
    entryLink: RegistroOtrosContratosTabName = REGISTRO_OTROS_CONTRATOS_DEFAULT_TAB,
  ): Promise<void> {
    await this.expandOtrosContratosSidebar();
    await this.clickOtrosContratosSidebarLink(entryLink);
  }

  /**
   * Abre Otros contratos desde la grilla del tablero (icono ojo bajo la tarjeta Registro).
   */
  async openOtrosContratosFromDashboardGrid(): Promise<void> {
    await this.hoverRegistroDashboardCard();
    await this.registroDashboardCard()
      .getByRole('listitem')
      .filter({ hasText: 'Otros contratos' })
      .getByLabel('eye')
      .click();
  }

  /**
   * Ruta B: comprueba las filas fijas de la tarjeta Registro, pasa el cursor para revelar Otros contratos, lo abre y aterriza en Miscelaneos.
   */
  async openOtrosContratosFromDashboardHover(): Promise<void> {
    const card = this.registroDashboardCard();
    await expect(card).toBeVisible();
    for (const label of REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS) {
      await expect(card.getByText(label)).toBeVisible();
      await expect(
        card.getByRole('listitem').filter({ hasText: label }).getByLabel('eye'),
      ).toBeVisible();
    }
    await this.expectOtrosContratosVisibleOnDashboardHover();
    await this.openOtrosContratosFromDashboardGrid();
    await this.expectGestorDeDatosOtrosContratosShell();
    await this.expectOtrosContratosTabActive(REGISTRO_OTROS_CONTRATOS_DEFAULT_TAB);
  }

  /**
   * Comprueba que los ítems anidados de Otros contratos coinciden exactamente con la config del tenant, más href y ausencias legacy.
   */
  async expectOtrosContratosNestedSidebarItems(): Promise<void> {
    await this.expandOtrosContratosSidebar();
    const submenu = this.registroSubmenu();
    await assertSidebarLabelsMatchConfig(
      this.registroSubmoduleNestedItems(),
      REGISTRO_OTROS_CONTRATOS_TAB_NAMES,
      { context: 'Otros contratos nested sidebar' },
    );
    await expect(submenu.getByRole('link', { name: REGISTRO_OTROS_CONTRATOS_MISC_TAB, exact: true })).toHaveAttribute(
      'href',
      '/gestor-de-datos/otros-contratos/miscelaneos',
    );
    await expect(submenu.getByRole('menuitem', { name: REGISTRO_OTROS_CONTRATOS_AGR_TAB, exact: true })).toBeVisible();
    await expect(
      submenu.getByRole('menuitem', { name: REGISTRO_OTROS_CONTRATOS_AGR_TAB, exact: true, disabled: true }),
    ).toHaveCount(0);
    for (const tabName of REGISTRO_OTROS_CONTRATOS_LOCKED_TAB_NAMES) {
      await expect(
        submenu.getByRole('menuitem', { name: tabName, disabled: true }).first(),
      ).toBeVisible();
    }
    await expect(submenu.getByRole('link', { name: 'Contratos MISC', exact: true })).toHaveCount(0);
    await expect(submenu.getByRole('menuitem', { name: 'Contratos MISC', exact: true })).toHaveCount(0);
  }

  /**
   * Comprueba que Otros contratos aparece en la tarjeta hover de Registro con un icono ojo.
   */
  async expectOtrosContratosVisibleOnDashboardHover(): Promise<void> {
    await this.expectRegistroDashboardHoverSubmoduleVisible('Otros contratos');
  }

  /**
   * Comprueba que la primera tabla principal de contratos no tiene encabezado de columna Select all.
   */
  async expectSelectAllColumnAbsent(): Promise<void> {
    await expect(
      this.gestorMain().getByRole('table').first().getByRole('columnheader', { name: 'Select all' }),
    ).toHaveCount(0);
  }

  /**
   * Comprueba el shell del gestor de Otros contratos: URL, breadcrumb y tira de pestañas habilitadas/bloqueadas.
   */
  async expectGestorDeDatosOtrosContratosShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/(otros-contratos|contratos-energia)\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await assertTabStripMatchesConfig(this.page, {
      enabledTabs: REGISTRO_OTROS_CONTRATOS_ENABLED_TAB_NAMES,
      lockedTabs: REGISTRO_OTROS_CONTRATOS_LOCKED_TAB_NAMES,
      context: 'Otros contratos',
    });
  }

  /**
   * Abre una pestaña de Otros contratos y comprueba selección, breadcrumb y slug de URL.
   */
  async openOtrosContratosTab(tabName: RegistroOtrosContratosTabName): Promise<void> {
    await this.page.getByRole('tab', { name: tabName, exact: true }).click();
    await this.expectOtrosContratosTabActive(tabName);
  }

  /**
   * Comprueba que la pestaña está seleccionada, el breadcrumb muestra el segmento configurado y la URL coincide con el slug.
   */
  async expectOtrosContratosTabActive(tabName: RegistroOtrosContratosTabName): Promise<void> {
    await expect(this.page).toHaveURL(
      RegistroOtrosContratosNavigationPage.REGISTRO_OTROS_CONTRATOS_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
    const tab = this.page.getByRole('tab', { name: tabName, exact: true });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroOtrosContratosNavigationPage.REGISTRO_OTROS_CONTRATOS_TAB_BREADCRUMBS[tabName],
    );
  }

  /**
   * Comprueba la barra de Otros contratos: búsqueda, Filtros, Nuevo Registro y ausencia de chips Modo Yo / Estado / Usuarios.
   */
  async expectOtrosContratosToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlVisible();
    await this.expectToolbarFilterChipsAbsent();
    await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Nuevo Contrato' })).toHaveCount(0);
  }

  /**
   * Comprueba los encabezados de columna de la grilla de contratos en la primera tabla principal; Acciones es visibilidad opcional.
   */
  async expectContractGridColumnHeaders(columnNames: readonly string[]): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames, {
      additionalAllowedColumns: ['Acciones'],
    });
  }

  /**
   * Abre Nuevo Registro de Miscelaneos, valida campos y desplegables (sin pasos de asistente), y cierra.
   */
  async expectMiscNuevoRegistroDialogOpensAndCloses(): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
      ctaName: 'Nuevo Registro',
      stepTitle: 'Registrar Información',
      fields: cfg.registroOtrosContratosMiscNuevoRegistroFields,
      dropdownOptions: cfg.registroOtrosContratosMiscNuevoRegistroFieldsDropdownOptions,
      footerVariant: 'misc',
      absentWizardSteps: ['Código SIC', 'Datos macro', 'Carga archivos'],
    });
  }

  /**
   * Abre Nuevo Registro de AGR, valida campos sin Producto Facturable (sin pasos de asistente), y cierra.
   */
  async expectAgrNuevoRegistroDialogOpensAndCloses(): Promise<void> {
    await this.expectNuevoRegistroDialogWithoutProductoFacturable();
  }

  /**
   * Abre Nuevo Registro de Excedentes, valida campos sin Producto Facturable (sin pasos de asistente), y cierra.
   */
  async expectExcedentesNuevoRegistroDialogOpensAndCloses(): Promise<void> {
    await this.expectNuevoRegistroDialogWithoutProductoFacturable();
  }

  /**
   * Abre Nuevo Registro, valida el formulario de contrato sin Producto Facturable y cierra el diálogo.
   */
  private async expectNuevoRegistroDialogWithoutProductoFacturable(): Promise<void> {
    const fields = cfg.registroOtrosContratosMiscNuevoRegistroFields.filter(
      (field) => field.label !== 'Producto Facturable',
    );
    const dropdownOptions = Object.fromEntries(
      Object.entries(cfg.registroOtrosContratosMiscNuevoRegistroFieldsDropdownOptions).filter(
        ([label]) => label !== 'Producto Facturable',
      ),
    );

    await this.expectRegistroWizardDialogOpensAndCloses({
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
      ctaName: 'Nuevo Registro',
      stepTitle: 'Registrar Información',
      fields,
      dropdownOptions,
      footerVariant: 'misc',
      absentWizardSteps: ['Código SIC', 'Datos macro', 'Carga archivos'],
    });
  }
}
