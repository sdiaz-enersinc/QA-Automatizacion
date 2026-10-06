import { expect, type Locator } from '@playwright/test';
import { getRegistroSireciConfig, getModuleEnabledTabNames, isModuleEnabled, toTabSlugRecord } from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroSireciTabName } from '../../config/types/registro-sireci';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
  RegistroNavigationBasePage,
  type RegistroWizardDropdownOptionsMap,
  type RegistroWizardFieldDefinition,
} from './registro-navigation-base';
import { assertRegistroWizardFieldsMatchConfig } from '../../registro/form-field-labels';
import { assertTabStripMatchesConfig } from '../../registro/tab-strip';
import { assertSidebarLabelsMatchConfig } from '../../registro/sidebar-labels';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';

export type { RegistroSireciTabName };

const cfg = getRegistroSireciConfig();

/** Indica si el módulo Registro Sireci está habilitado para el tenant activo. */
export const REGISTRO_SIRECI_ENABLED = isModuleEnabled(MODULE_IDS.registroSireci);

/** Etiquetas de pestaña del módulo Sireci (config del tenant). */
export const REGISTRO_SIRECI_TAB_NAMES = cfg.registroSireciTabNames;

/** Pestañas alcanzables con las credenciales actuales del tenant. */
export const REGISTRO_SIRECI_ENABLED_TAB_NAMES = getModuleEnabledTabNames(MODULE_IDS.registroSireci);

export const REGISTRO_SIRECI_LOCKED_TAB_NAMES = cfg.registroSireciLockedTabNames;

/** Etiqueta visible del submenú y de la tarjeta del tablero para Sireci (config del tenant). */
export const REGISTRO_SIRECI_SUBMODULE_LABEL = cfg.registroSireciSubmoduleLabel;

/** Pestaña de aterrizaje usada como ancla del menú lateral y semilla. */
export const REGISTRO_SIRECI_DEFAULT_TAB = cfg.registroSireciDefaultTab;

/** Etiqueta de pestaña Resumen (primera entrada de registroSireciTabNames). */
export const REGISTRO_SIRECI_RESUMEN_TAB = cfg.registroSireciTabNames[0];

/** Etiqueta de pestaña Reporte (segunda entrada de registroSireciTabNames). */
export const REGISTRO_SIRECI_REPORTE_TAB = cfg.registroSireciTabNames[1];

/** Encabezados de columna de la grilla Resumen (config del tenant). */
export const REGISTRO_SIRECI_RESUMEN_COLUMNS = cfg.registroSireciResumenColumns;

/** Encabezados de columna de la grilla Reporte (config del tenant). */
export const REGISTRO_SIRECI_REPORTE_COLUMNS = cfg.registroSireciReporteColumns;

/** Campos combobox del formulario plano Nuevo Registro (config del tenant). */
export const REGISTRO_SIRECI_NUEVO_REGISTRO_COMBOBOX_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroSireciNuevoRegistroComboboxFields;

/** Campos de texto y fecha del formulario plano Nuevo Registro (config del tenant). */
export const REGISTRO_SIRECI_NUEVO_REGISTRO_TEXT_DATE_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroSireciNuevoRegistroTextDateFields;

/** Etiquetas de spinbutton en Nuevo Registro (config del tenant). */
export const REGISTRO_SIRECI_NUEVO_REGISTRO_SPINBUTTON_LABELS =
  cfg.registroSireciNuevoRegistroSpinbuttonLabels;

/** Opciones esperadas por combobox de Nuevo Registro (config del tenant). */
export const REGISTRO_SIRECI_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroSireciNuevoRegistroFieldsDropdownOptions;

/**
 * Navegación y aserciones del submódulo Sireci bajo Registro.
 */
export class RegistroSireciNavigationPage extends RegistroNavigationBasePage {
  /** Segmento de slug de URL por pestaña de Sireci (config del tenant). */
  static readonly REGISTRO_SIRECI_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroSireciTabSlugs,
  );

  /** Texto del tercer segmento del breadcrumb por pestaña activa (config del tenant). */
  static readonly REGISTRO_SIRECI_TAB_BREADCRUMBS: Record<string, string> =
    cfg.registroSireciTabBreadcrumbs;

  /** Href del enlace anidado del menú lateral por pestaña (config del tenant). */
  static readonly REGISTRO_SIRECI_SIDEBAR_HREFS: Record<string, string> =
    cfg.registroSireciSidebarHrefs;

  /**
   * Expande Registro y el desplegable del submódulo Sireci en el menú lateral.
   */
  async expandSireciSidebar(): Promise<void> {
    await this.expandRegistroSubmodule(REGISTRO_SIRECI_SUBMODULE_LABEL);
  }

  /**
   * Asegura que Sireci está expandido y que los enlaces anidados Resumen / Reporte del menú lateral son visibles.
   */
  async ensureSireciSidebarExpanded(): Promise<void> {
    await this.expandRegistroSidebar();
    const row = this.registroSubmenu().getByRole('menuitem', { name: REGISTRO_SIRECI_SUBMODULE_LABEL }).first();
    const resumenLink = this.registroSubmenu().getByRole('link', { name: REGISTRO_SIRECI_DEFAULT_TAB });
    await expect(async () => {
      if ((await row.getAttribute('aria-expanded')) !== 'true') {
        await row.click();
      }
      await expect(resumenLink).toBeVisible();
    }).toPass({ timeout: 10_000 });
  }

  /**
   * Comprueba que Sireci aparece en el submenú expandido de Registro.
   */
  async expectSireciSubmenuEntryVisible(): Promise<void> {
    await this.expandRegistroSidebar();
    await expect(this.registroSubmenu().getByRole('menuitem', { name: REGISTRO_SIRECI_SUBMODULE_LABEL }).first()).toBeVisible();
  }

  /**
   * Comprueba que Sireci está expandido y que los enlaces anidados coinciden exactamente con la config del tenant.
   */
  async expectSireciNestedSidebarLinksVisible(): Promise<void> {
    await this.ensureSireciSidebarExpanded();
    const row = this.registroSubmenu().getByRole('menuitem', { name: REGISTRO_SIRECI_SUBMODULE_LABEL }).first();
    await expect(row).toHaveAttribute('aria-expanded', 'true');
    await assertSidebarLabelsMatchConfig(
      this.registroSubmoduleNestedItems(),
      REGISTRO_SIRECI_TAB_NAMES,
      { context: 'Sireci nested sidebar' },
    );
    for (const tabName of REGISTRO_SIRECI_TAB_NAMES) {
      const link = this.registroSubmenu().getByRole('link', { name: tabName, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute(
        'href',
        RegistroSireciNavigationPage.REGISTRO_SIRECI_SIDEBAR_HREFS[tabName],
      );
    }
  }

  /**
   * Abre una pestaña de Sireci por los enlaces anidados del menú lateral bajo Sireci.
   */
  async openSireciFromSidebar(tabName: RegistroSireciTabName): Promise<void> {
    await this.ensureSireciSidebarExpanded();
    const link = this.registroSubmenu().getByRole('link', { name: tabName }).first();
    await expect(link).toBeVisible();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect(this.page).toHaveURL(RegistroSireciNavigationPage.REGISTRO_SIRECI_TAB_SLUGS[tabName], {
      timeout: 15_000,
    });
  }

  /**
   * Abre Sireci desde la grilla del tablero (icono ojo bajo la tarjeta Registro).
   */
  async openSireciFromDashboardGrid(): Promise<void> {
    await expect(async () => {
      await this.hoverRegistroDashboardCard();
      const eye = this.registroDashboardCard()
        .getByRole('listitem')
        .filter({ hasText: REGISTRO_SIRECI_SUBMODULE_LABEL })
        .getByLabel('eye');
      await expect(eye).toBeVisible();
      await eye.click();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Comprueba que el menú hover de la tarjeta Registro muestra Sireci con el icono ojo.
   */
  async expectSireciVisibleOnDashboardHover(): Promise<void> {
    await this.expectRegistroDashboardHoverSubmoduleVisible(
      REGISTRO_SIRECI_SUBMODULE_LABEL,
      this.registroDashboardHoverLabelsFromInsumosOfertaThroughHistorial(),
    );
  }

  /**
   * Comprueba el shell del gestor de Sireci: URL, breadcrumb, tira de pestañas, búsqueda y grilla de datos.
   * El segmento del breadcrumb es "Sireci"; la etiqueta del menú lateral sigue siendo "SIRECI".
   */
  async expectGestorDeDatosSireciShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/sireci\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText('Sireci');
    await assertTabStripMatchesConfig(this.page, {
      enabledTabs: REGISTRO_SIRECI_ENABLED_TAB_NAMES,
      lockedTabs: REGISTRO_SIRECI_LOCKED_TAB_NAMES,
      context: 'Sireci',
    });
    await expect(this.gestorMain().getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Comprueba que la pestaña está seleccionada, el breadcrumb muestra su etiqueta y la URL coincide con el slug.
   */
  async expectSireciViewActive(tabName: RegistroSireciTabName): Promise<void> {
    await expect(this.page).toHaveURL(RegistroSireciNavigationPage.REGISTRO_SIRECI_TAB_SLUGS[tabName], {
      timeout: 15_000,
    });
    const tab = this.page.getByRole('tab', { name: tabName, exact: true });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroSireciNavigationPage.REGISTRO_SIRECI_TAB_BREADCRUMBS[tabName],
    );
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Abre una pestaña del módulo y comprueba URL, breadcrumb y estado aria-selected.
   */
  async openSireciTab(tabName: RegistroSireciTabName): Promise<void> {
    await this.page.getByRole('tab', { name: tabName, exact: true }).click();
    await this.expectSireciViewActive(tabName);
  }

  /**
   * Comprueba que la tira de pestañas coincide con la config del tenant y que la pestaña hermana es visible pero no está seleccionada.
   *
   * @param activeTab - Pestaña de Sireci actualmente seleccionada cuya pareja debe permanecer sin seleccionar.
   */
  async expectSireciPairTabVisible(activeTab: RegistroSireciTabName): Promise<void> {
    await assertTabStripMatchesConfig(this.page, {
      enabledTabs: REGISTRO_SIRECI_ENABLED_TAB_NAMES,
      lockedTabs: REGISTRO_SIRECI_LOCKED_TAB_NAMES,
      context: 'Sireci',
    });
    const enabledTabs = REGISTRO_SIRECI_ENABLED_TAB_NAMES.filter((tab) => tab !== activeTab);
    if (enabledTabs.length === 0) {
      return;
    }
    const mate = enabledTabs[0];
    const mateTab = this.page.getByRole('tab', { name: mate, exact: true });
    await expect(mateTab).toBeVisible();
    await expect(mateTab).toHaveAttribute('aria-selected', 'false');
  }

  /**
   * Comprueba que los encabezados de columna de la primera grilla principal coinciden exactamente con la config del tenant.
   *
   * @param columnNames - Etiquetas esperadas de encabezado de columna.
   */
  async expectGridColumnHeaders(columnNames: readonly string[]): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames, { context: 'Sireci' });
  }

  /**
   * Comprueba el pie de paginación con el recuento de ítems y el selector de tamaño de página.
   */
  async expectGridPaginationFooter(pageSizeLabel: string): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByText(/Total \d+ items?/)).toBeVisible();
    await expect(main.getByText(pageSizeLabel)).toBeVisible();
  }

  /**
   * Comprueba que la grilla muestra al menos una fila de datos o un encabezado explícito de estado vacío.
   */
  async expectGridHasDataOrEmptyState(): Promise<void> {
    const main = this.gestorMain();
    const table = main.getByRole('table').first();
    await expect(table).toBeVisible();
    const empty = main.getByRole('heading', { name: 'No se encontraron datos' });
    if (await empty.isVisible()) {
      await expect(empty).toBeVisible();
      return;
    }
    await expect(main.locator('table tbody tr td').first()).toBeVisible();
  }

  /**
   * Comprueba la barra de Resumen: búsqueda y CTAs, sin chip Filtros ni chips Modo Yo, Estado o Usuarios.
   */
  async expectSireciResumenToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await expect(main.getByRole('button', { name: 'search' })).toBeVisible();
    await this.expectFiltrosControlAbsent();
    await this.expectToolbarFilterChipsAbsent();
    await expect(main.getByRole('button', { name: 'Descargar Reporte' })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toBeVisible();
    await this.expectGridPaginationFooter('20 / página');
  }

  /**
   * Comprueba la barra de Reporte: búsqueda y Descargar Reporte, sin Filtros ni chips de filtro.
   */
  async expectSireciReporteToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await expect(main.getByRole('button', { name: 'search' })).toBeVisible();
    await this.expectFiltrosControlAbsent();
    await this.expectToolbarFilterChipsAbsent();
    await expect(main.getByRole('button', { name: 'Descargar Reporte' })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toHaveCount(0);
    await this.expectGridPaginationFooter('10 / página');
  }

  /**
   * Alterna Modo Yo encendido y luego apagado, y comprueba que se restaura la URL de la vista.
   * Descarta de forma activa cualquier popup disparado por el filtro en lugar de esperar el cierre automático.
   */
  async expectModoYoFilterToggle(): Promise<void> {
    const chip = this.filterChip('Modo Yo');
    const url = this.page.url();
    await chip.click();
    await this.dismissFilterPopups();
    await chip.click();
    await expect(this.page).toHaveURL(url);
  }

  /**
   * Comprueba los encabezados de columna de la grilla Reporte en la primera tabla principal.
   */
  async expectSireciReporteGridColumnHeaders(
    columnNames: readonly string[] = REGISTRO_SIRECI_REPORTE_COLUMNS,
  ): Promise<void> {
    await this.expectGridColumnHeaders(columnNames);
  }

  /**
   * Hace clic en el chip Filtros de Reporte y devuelve el localizador del diálogo abierto.
   */
  protected filtrosChip(): Locator {
    return this.gestorMain()
      .locator('div')
      .filter({ hasText: /^Filtros$/ })
      .first();
  }

  /**
   * Abre el modal Filtros, comprueba su estructura y lo cierra con Close.
   */
  async expectFiltrosModalOpensAndCloses(): Promise<void> {
    await this.expectNoVisibleModals();
    await this.filtrosChip().click();
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
   * Abre el diálogo de confirmación de Descargar Reporte, comprueba el contenido y lo cierra con Cancelar.
   */
  async expectDescargarReporteDialogOpensAndCloses(): Promise<void> {
    await this.expectNoVisibleModals();
    await this.gestorMain().getByRole('button', { name: 'Descargar Reporte' }).click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog).toContainText('Confirmar acción');
    await expect(dialog).toContainText(/reporte del SIRECI/i);
    await expect(dialog.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Aceptar' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancelar' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Abre el diálogo de filtro Estado, comprueba el placeholder del combobox y lo cierra con Close.
   */
  async expectEstadoFilterDialogWithCombobox(): Promise<void> {
    await this.dismissNotificationToasts();
    await this.filterChip('Estado').click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toContainText('Filtrar por Estado de simulación');
    await expect(dialog.getByText('Seleccione una opción')).toBeVisible();
    await this.dismissNotificationToasts();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible();
  }

  /**
   * Abre el diálogo de filtro Usuarios, comprueba el placeholder del combobox y lo cierra con Close.
   */
  async expectUsuariosFilterDialogWithCombobox(): Promise<void> {
    await this.dismissNotificationToasts();
    await this.filterChip('Usuarios').click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toContainText('Filtrar por usuarios');
    await expect(dialog.getByText('Seleccione una opción')).toBeVisible();
    await this.dismissNotificationToasts();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible();
  }

  /**
   * Comprueba que los campos spinbutton de Nuevo Registro están presentes en el formulario plano.
   */
  async expectNuevoRegistroSpinbuttonsPresent(dialog: Locator): Promise<void> {
    for (const label of REGISTRO_SIRECI_NUEVO_REGISTRO_SPINBUTTON_LABELS) {
      const name = label === 'Ctto valor inicial' ? `* ${label}` : label;
      const spinbutton = dialog.getByRole('spinbutton', { name });
      await spinbutton.scrollIntoViewIfNeeded();
      await expect(spinbutton).toBeVisible();
    }
  }

  /**
   * Abre Nuevo Registro, valida el contenedor, campos, desplegables y spinbuttons, y cierra.
   */
  async expectNuevoRegistroDialogOpensAndCloses(): Promise<void> {
    await this.expectNoVisibleModals();
    const dialog = await this.openRegistrarInformacionDialog('Nuevo Registro');
    await expect(dialog).toContainText('Registrar Información');
    await expect(dialog.getByRole('button', { name: 'Limpiar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Guardar' })).toBeVisible();
    await expect(
      dialog.getByRole('combobox', { name: '* Contrato', exact: true }),
    ).toBeVisible();
    await expect(
      dialog.getByRole('combobox', { name: '* Tipo seguimiento', exact: true }),
    ).toBeVisible();
    await expect(
      dialog.getByRole('spinbutton', { name: '* Ctto valor inicial', exact: true }),
    ).toBeVisible();

    await this.expectWizardScrollableFieldsReachable(
      dialog,
      [
        ...REGISTRO_SIRECI_NUEVO_REGISTRO_COMBOBOX_FIELDS,
        ...REGISTRO_SIRECI_NUEVO_REGISTRO_TEXT_DATE_FIELDS,
      ],
      REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
    );

    await assertRegistroWizardFieldsMatchConfig(
      dialog,
      [
        ...REGISTRO_SIRECI_NUEVO_REGISTRO_COMBOBOX_FIELDS,
        ...REGISTRO_SIRECI_NUEVO_REGISTRO_TEXT_DATE_FIELDS,
      ],
      { extraExpectedLabels: REGISTRO_SIRECI_NUEVO_REGISTRO_SPINBUTTON_LABELS },
    );

    for (const field of REGISTRO_SIRECI_NUEVO_REGISTRO_COMBOBOX_FIELDS) {
      await this.expectRegistroWizardField(
        dialog,
        field,
        REGISTRO_SIRECI_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS,
        REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
      );
    }

    for (const field of REGISTRO_SIRECI_NUEVO_REGISTRO_TEXT_DATE_FIELDS) {
      await this.expectRegistroWizardField(
        dialog,
        field,
        REGISTRO_SIRECI_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS,
        REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
      );
    }

    await this.expectNuevoRegistroSpinbuttonsPresent(dialog);

    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }
}
