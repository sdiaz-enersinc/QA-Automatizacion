import { expect } from '@playwright/test';
import { getRegistroEmpresasConfig, isModuleEnabled } from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
  RegistroNavigationBasePage,
  type RegistroWizardDropdownOptionsMap,
  type RegistroWizardFieldDefinition,
} from './registro-navigation-base';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';

const cfg = getRegistroEmpresasConfig();

/** Indica si el módulo Registro Empresas está habilitado para el tenant activo. */
export const REGISTRO_EMPRESAS_ENABLED = isModuleEnabled(MODULE_IDS.registroEmpresas);

/** Encabezados de columna de la grilla de Empresas (config del tenant). */
export const REGISTRO_EMPRESAS_COLUMNS = cfg.registroEmpresasColumns;

/** Campos del formulario plano Nuevo Cliente/Proveedor (config del tenant). */
export const REGISTRO_EMPRESAS_NUEVO_CLIENTE_PROVEEDOR_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroEmpresasNuevoClienteProveedorFields;

/** Opciones esperadas por combobox de Nuevo Cliente/Proveedor (config del tenant). */
export const REGISTRO_EMPRESAS_NUEVO_CLIENTE_PROVEEDOR_FIELDS_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroEmpresasNuevoClienteProveedorFieldsDropdownOptions;

/** Etiquetas de spinbutton en Nuevo Cliente/Proveedor (config del tenant). */
export const REGISTRO_EMPRESAS_NUEVO_CLIENTE_PROVEEDOR_SPINBUTTON_LABELS =
  cfg.registroEmpresasNuevoClienteProveedorSpinbuttonLabels;

/** Slug de URL del gestor de Empresas activo (la etiqueta de pestaña difiere del segmento del breadcrumb). */
export const REGISTRO_EMPRESAS_VIEW_URL = /gestor-de-datos\/empresas\/empresa/;

/**
 * Navegación y aserciones del submódulo Empresas bajo Registro.
 */
export class RegistroEmpresasNavigationPage extends RegistroNavigationBasePage {
  /**
   * Abre Empresas desde el menú lateral: expande Registro y luego hace clic en Empresas.
   */
  async openEmpresasFromSidebar(): Promise<void> {
    await this.expandRegistroSubmodule('Empresas');
    await this.clickRegistroSubmoduleLink('Empresas');
  }

  /**
   * Abre Empresas desde la grilla del tablero (icono ojo bajo la tarjeta Registro).
   */
  async openEmpresasFromDashboardGrid(): Promise<void> {
    await expect(async () => {
      await this.hoverRegistroDashboardCard();
      const eye = this.registroDashboardCard()
        .getByRole('listitem')
        .filter({ hasText: 'Empresas' })
        .getByLabel('eye');
      await expect(eye).toBeVisible();
      await eye.click();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Comprueba que el menú hover de la tarjeta Registro muestra Empresas con el icono ojo.
   */
  async expectEmpresasVisibleOnDashboardHover(): Promise<void> {
    await expect(async () => {
      await this.hoverRegistroDashboardCard();
      const card = this.registroDashboardCard();
      for (const label of ['Cttos energía', 'Cttos combustible', 'Insumos oferta']) {
        await expect(card.getByText(label, { exact: true })).toBeVisible();
      }
      await expect(
        card.getByRole('listitem').filter({ hasText: 'Empresas' }).getByLabel('eye'),
      ).toBeVisible();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Comprueba que la vista Empresas está activa: URL, pestaña seleccionada, breadcrumb, búsqueda y grilla.
   */
  async expectEmpresasViewActive(): Promise<void> {
    await expect(this.page).toHaveURL(REGISTRO_EMPRESAS_VIEW_URL, { timeout: 15_000 });
    const tab = this.page.getByRole('tab', { name: 'Empresas' });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText('Empresas');
    await expect(this.gestorMain().getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Comprueba la discrepancia conocida entre pestaña y breadcrumb (pestaña Empresas, breadcrumb Empresa).
   */
  async expectEmpresasTabBreadcrumbDiscrepancy(): Promise<void> {
    await expect(this.page.getByRole('tab', { name: 'Empresas' })).toBeVisible();
    await expect(this.page.getByRole('navigation')).toContainText('Empresa');
    await expect(this.page).toHaveURL(REGISTRO_EMPRESAS_VIEW_URL);
  }

  /**
   * Comprueba el shell del gestor de Empresas: URL, breadcrumb, pestaña, búsqueda y grilla de datos.
   */
  async expectGestorDeDatosEmpresasShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/empresas\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText('Empresas');
    await expect(this.page.getByRole('tab', { name: 'Empresas' })).toBeVisible();
    await expect(this.page.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await expect(this.page.getByRole('main').getByRole('table').first()).toBeVisible();
  }

  /**
   * Comprueba la barra de herramientas de Empresas: búsqueda y CTA Nuevo Cliente/Proveedor, sin Filtros ni chips de filtro.
   */
  async expectEmpresasToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlAbsent();
    await this.expectToolbarFilterChipsAbsent();
    await expect(main.getByRole('button', { name: 'Nuevo Cliente/Proveedor' })).toBeVisible();
  }

  /**
   * Comprueba los encabezados de columna de la grilla de Empresas en la primera tabla principal.
   */
  async expectEmpresasGridColumnHeaders(
    columnNames: readonly string[] = REGISTRO_EMPRESAS_COLUMNS,
  ): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames, {
      additionalAllowedColumns: ['Acciones'],
    });
  }

  /**
   * Abre Nuevo Cliente/Proveedor, valida los campos del formulario plano y las opciones de combobox, y cierra.
   */
  async expectNuevoClienteProveedorDialogOpensAndCloses(): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      ctaName: 'Nuevo Cliente/Proveedor',
      stepTitle: 'Registrar Información',
      fields: REGISTRO_EMPRESAS_NUEVO_CLIENTE_PROVEEDOR_FIELDS,
      dropdownOptions: REGISTRO_EMPRESAS_NUEVO_CLIENTE_PROVEEDOR_FIELDS_DROPDOWN_OPTIONS,
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
      footerVariant: 'misc',
      assertScrollableForm: true,
      extraExpectedLabels: REGISTRO_EMPRESAS_NUEVO_CLIENTE_PROVEEDOR_SPINBUTTON_LABELS,
      spinbuttonLabels: REGISTRO_EMPRESAS_NUEVO_CLIENTE_PROVEEDOR_SPINBUTTON_LABELS,
    });
  }
}
