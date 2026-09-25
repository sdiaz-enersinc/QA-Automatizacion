import { expect } from '@playwright/test';
import { getRegistroRpmConfig, getModuleEnabledTabNames, isModuleEnabled, toTabSlugRecord } from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroRpmTabName } from '../../config/types/registro-rpm';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
  RegistroNavigationBasePage,
  type RegistroWizardDropdownOptionsMap,
  type RegistroWizardFieldDefinition,
} from './registro-navigation-base';
import { assertTabStripMatchesConfig } from '../../registro/tab-strip';
import { assertSidebarLabelsMatchConfig } from '../../registro/sidebar-labels';

export type { RegistroRpmTabName };

const cfg = getRegistroRpmConfig();

/** Indica si el módulo Registro RPM está habilitado para el tenant activo. */
export const REGISTRO_RPM_ENABLED = isModuleEnabled(MODULE_IDS.registroRpm);

/** Etiquetas de pestaña del módulo RPM (config del tenant). */
export const REGISTRO_RPM_TAB_NAMES = cfg.registroRpmTabNames;

/** Pestañas alcanzables con las credenciales actuales del tenant. */
export const REGISTRO_RPM_ENABLED_TAB_NAMES = getModuleEnabledTabNames(MODULE_IDS.registroRpm);

export const REGISTRO_RPM_LOCKED_TAB_NAMES = cfg.registroRpmLockedTabNames;

/** Encabezados de columna de la grilla XML (config del tenant). */
export const REGISTRO_RPM_XML_COLUMNS = cfg.registroRpmXmlColumns;

/** Campos del formulario plano Crear Registro / Cargar Archivo (config del tenant). */
export const REGISTRO_RPM_CREAR_REGISTRO_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroRpmCrearRegistroFields;

/** Opciones esperadas por combobox del formulario plano de RPM (config del tenant). */
export const REGISTRO_RPM_CREAR_REGISTRO_FIELDS_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroRpmCrearRegistroFieldsDropdownOptions;

/**
 * Navegación y aserciones del submódulo RPM bajo Registro.
 */
export class RegistroRpmNavigationPage extends RegistroNavigationBasePage {
  /** Segmento de slug de URL por pestaña de RPM (config del tenant). */
  static readonly REGISTRO_RPM_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroRpmTabSlugs,
  );

  /** Texto del tercer segmento del breadcrumb por pestaña activa (config del tenant). */
  static readonly REGISTRO_RPM_TAB_BREADCRUMBS: Record<string, string> = cfg.registroRpmTabBreadcrumbs;

  /**
   * Expande Registro y el desplegable del submódulo RPM en el menú lateral.
   */
  async expandRpmSidebar(): Promise<void> {
    await this.expandRegistroSubmodule('RPM');
  }

  /**
   * Asegura que RPM está expandido y que la entrada anidada XML del menú lateral es visible.
   */
  async ensureRpmSidebarExpanded(): Promise<void> {
    await this.expandRegistroSidebar();
    const rpmRow = this.registroSubmenu().getByRole('menuitem', { name: 'RPM' }).first();
    const xmlItem = this.registroSubmenu().getByRole('menuitem', { name: 'XML' }).first();
    await expect(async () => {
      if ((await rpmRow.getAttribute('aria-expanded')) !== 'true') {
        await rpmRow.click();
      }
      await expect(xmlItem).toBeVisible();
    }).toPass({ timeout: 10_000 });
  }

  /**
   * Comprueba que RPM aparece en el submenú expandido de Registro.
   */
  async expectRpmSubmenuEntryVisible(): Promise<void> {
    await this.expandRegistroSidebar();
    await expect(this.registroSubmenu().getByRole('menuitem', { name: 'RPM' }).first()).toBeVisible();
  }

  /**
   * Comprueba que RPM está expandido y que las entradas anidadas coinciden exactamente con la config del tenant.
   */
  async expectRpmXmlSidebarEntryVisible(): Promise<void> {
    await this.ensureRpmSidebarExpanded();
    const rpmRow = this.registroSubmenu().getByRole('menuitem', { name: 'RPM' }).first();
    await expect(rpmRow).toHaveAttribute('aria-expanded', 'true');
    await assertSidebarLabelsMatchConfig(
      this.registroSubmoduleNestedItems(),
      REGISTRO_RPM_TAB_NAMES,
      { context: 'RPM nested sidebar' },
    );
    await expect(this.registroSubmenu().getByRole('menuitem', { name: 'XML', exact: true }).first()).toBeVisible();
  }

  /**
   * Abre una pestaña de RPM por los ítems de menú anidados bajo RPM.
   */
  async openRpmFromSidebar(tabName: RegistroRpmTabName): Promise<void> {
    await this.ensureRpmSidebarExpanded();
    const item = this.registroSubmenu().getByRole('menuitem', { name: tabName }).first();
    await expect(item).toBeVisible();
    await item.scrollIntoViewIfNeeded();
    await item.click();
    await expect(this.page).toHaveURL(RegistroRpmNavigationPage.REGISTRO_RPM_TAB_SLUGS[tabName], {
      timeout: 15_000,
    });
  }

  /**
   * Abre RPM desde la grilla del tablero (icono ojo bajo la tarjeta Registro).
   */
  async openRpmFromDashboardGrid(): Promise<void> {
    await expect(async () => {
      await this.hoverRegistroDashboardCard();
      const eye = this.registroDashboardCard()
        .getByRole('listitem')
        .filter({ hasText: 'RPM' })
        .getByLabel('eye');
      await expect(eye).toBeVisible();
      await eye.click();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Comprueba que el menú hover de la tarjeta Registro muestra RPM con el icono ojo.
   */
  async expectRpmVisibleOnDashboardHover(): Promise<void> {
    await expect(async () => {
      await this.hoverRegistroDashboardCard();
      await expect(this.registroDashboardCard().getByText('RPM')).toBeVisible();
      await expect(
        this.registroDashboardCard().getByRole('listitem').filter({ hasText: 'RPM' }).getByLabel('eye'),
      ).toBeVisible();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Comprueba el shell del gestor de RPM: URL, breadcrumb, tira de pestañas, búsqueda y grilla de datos.
   */
  async expectGestorDeDatosRpmShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/rpm\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText('Rpm');
    await assertTabStripMatchesConfig(this.page, {
      enabledTabs: REGISTRO_RPM_ENABLED_TAB_NAMES,
      lockedTabs: REGISTRO_RPM_LOCKED_TAB_NAMES,
      context: 'RPM',
    });
    await expect(this.gestorMain().getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Comprueba que la pestaña está seleccionada, el breadcrumb muestra su etiqueta y la URL coincide con el slug.
   */
  async expectRpmViewActive(tabName: RegistroRpmTabName): Promise<void> {
    await expect(this.page).toHaveURL(RegistroRpmNavigationPage.REGISTRO_RPM_TAB_SLUGS[tabName], {
      timeout: 15_000,
    });
    const tab = this.page.getByRole('tab', { name: tabName, exact: true });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroRpmNavigationPage.REGISTRO_RPM_TAB_BREADCRUMBS[tabName],
    );
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Comprueba la barra XML: búsqueda, chip Filtros, chips de filtro y CTAs principales.
   */
  async expectRpmXmlToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await expect(main.getByRole('button', { name: 'search' })).toBeVisible();
    await expect(main.getByText('Filtros', { exact: true })).toBeVisible();
    await expect(this.filterChip('Modo Yo')).toBeVisible();
    await expect(this.filterChip('Estado')).toBeVisible();
    await expect(this.filterChip('Usuarios')).toBeVisible();
    await expect(main.getByRole('button', { name: 'Crear Registro' })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Cargar Archivo' })).toBeVisible();
  }

  /**
   * Comprueba los encabezados de columna de la grilla XML en la primera tabla principal.
   */
  async expectRpmXmlGridColumnHeaders(
    columnNames: readonly string[] = REGISTRO_RPM_XML_COLUMNS,
  ): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    for (const name of columnNames) {
      await expect(table.getByRole('columnheader', { name, exact: true })).toBeVisible();
    }
  }

  /**
   * Abre el modal Filtros, comprueba su estructura y lo cierra con Close.
   */
  async expectFiltrosModalOpensAndCloses(): Promise<void> {
    await this.expectNoVisibleModals();
    await this.gestorMain().getByText('Filtros', { exact: true }).click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog).toContainText('Filtros');
    await expect(dialog.getByRole('button', { name: /Añadir filtro/i })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Limpiar todo/i })).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
  }

  /**
   * Abre Crear Registro, valida los campos y desplegables del formulario plano, y cierra.
   */
  async expectCrearRegistroDialogOpensAndCloses(): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      ctaName: 'Crear Registro',
      stepTitle: 'Registrar Información',
      fields: REGISTRO_RPM_CREAR_REGISTRO_FIELDS,
      dropdownOptions: REGISTRO_RPM_CREAR_REGISTRO_FIELDS_DROPDOWN_OPTIONS,
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
      footerVariant: 'misc',
    });
  }

  /**
   * Abre Cargar Archivo, valida campos compartidos, desplegables, zona de carga y Guardar, y cierra.
   */
  async expectCargarArchivoDialogOpensAndCloses(): Promise<void> {
    await this.expectNoVisibleModals();
    const dialog = await this.openRegistrarInformacionDialog('Cargar Archivo');
    await expect(dialog).toContainText('Registrar Información');

    for (const field of REGISTRO_RPM_CREAR_REGISTRO_FIELDS) {
      await this.expectRegistroWizardField(
        dialog,
        field,
        REGISTRO_RPM_CREAR_REGISTRO_FIELDS_DROPDOWN_OPTIONS,
        REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
      );
    }

    await this.expectCargarArchivoDropzone(dialog);
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
  }
}
