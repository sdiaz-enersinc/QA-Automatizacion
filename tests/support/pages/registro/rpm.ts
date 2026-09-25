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

/** Whether the Registro RPM module is enabled for the active tenant. */
export const REGISTRO_RPM_ENABLED = isModuleEnabled(MODULE_IDS.registroRpm);

/** Tab labels on the RPM module (tenant config). */
export const REGISTRO_RPM_TAB_NAMES = cfg.registroRpmTabNames;

/** Tabs reachable with current tenant credentials. */
export const REGISTRO_RPM_ENABLED_TAB_NAMES = getModuleEnabledTabNames(MODULE_IDS.registroRpm);

export const REGISTRO_RPM_LOCKED_TAB_NAMES = cfg.registroRpmLockedTabNames;

/** XML grid column headers (tenant config). */
export const REGISTRO_RPM_XML_COLUMNS = cfg.registroRpmXmlColumns;

/** Crear Registro / Cargar Archivo flat-form fields (tenant config). */
export const REGISTRO_RPM_CREAR_REGISTRO_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroRpmCrearRegistroFields;

/** Expected dropdown options per RPM flat-form combobox (tenant config). */
export const REGISTRO_RPM_CREAR_REGISTRO_FIELDS_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroRpmCrearRegistroFieldsDropdownOptions;

/**
 * Navigation and assertions for the RPM submodule under Registro.
 */
export class RegistroRpmNavigationPage extends RegistroNavigationBasePage {
  /** URL slug segment per RPM tab (tenant config). */
  static readonly REGISTRO_RPM_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroRpmTabSlugs,
  );

  /** Breadcrumb third-segment text per active tab (tenant config). */
  static readonly REGISTRO_RPM_TAB_BREADCRUMBS: Record<string, string> = cfg.registroRpmTabBreadcrumbs;

  /**
   * Expands Registro and the RPM submodule dropdown in the sidebar.
   */
  async expandRpmSidebar(): Promise<void> {
    await this.expandRegistroSubmodule('RPM');
  }

  /**
   * Ensures RPM is expanded and the nested XML sidebar entry is visible.
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
   * Asserts RPM appears in the expanded Registro sidebar submenu.
   */
  async expectRpmSubmenuEntryVisible(): Promise<void> {
    await this.expandRegistroSidebar();
    await expect(this.registroSubmenu().getByRole('menuitem', { name: 'RPM' }).first()).toBeVisible();
  }

  /**
   * Asserts RPM is expanded and nested sidebar entries match tenant config exactly.
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
   * Opens an RPM tab via sidebar nested menuitems under RPM.
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
   * Opens RPM from the dashboard grid (eye affordance under the Registro card).
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
   * Asserts the Registro dashboard hover menu exposes RPM with an eye affordance.
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
   * Asserts RPM gestor shell: URL, breadcrumb, tab strip, search, and data grid.
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
   * Asserts the tab is selected, breadcrumb shows the tab label, and URL matches the slug.
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
   * Asserts XML toolbar: search, Filtros chip, filter chips, and primary CTAs.
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
   * Asserts XML grid column headers in the first main table.
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
   * Opens the Filtros modal, asserts structure, then dismisses with Close.
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
   * Opens Crear Registro, validates flat-form fields and dropdowns, then closes.
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
   * Opens Cargar Archivo, validates shared fields, dropdowns, dropzone and Guardar, then closes.
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
