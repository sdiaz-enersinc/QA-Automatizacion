import { expect } from '@playwright/test';
import { getRegistroNavigationConfig } from '../../config/load-tenant-config';
import {
  REGISTRO_NAVIGATION_SUBMENU_LABELS,
  RegistroNavigationBasePage,
} from './registro-navigation-base';

const cfg = getRegistroNavigationConfig();

export { REGISTRO_NAVIGATION_SUBMENU_LABELS };

/** Filas habilitadas del submenú de Registro (clicables con las credenciales actuales del tenant). */
export const REGISTRO_NAVIGATION_ENABLED_SUBMENU_LABELS = cfg.registroNavigationEnabledSubmenuLabels;

/** Filas bloqueadas del submenú de Registro (visibles y deshabilitadas). */
export const REGISTRO_NAVIGATION_LOCKED_SUBMENU_LABELS = cfg.registroNavigationLockedSubmenuLabels;

/** Etiquetas legacy de submódulo que no deben aparecer tras el cambio de nombre. */
export const REGISTRO_NAVIGATION_LEGACY_SUBMODULE_LABELS = cfg.registroNavigationLegacySubmoduleLabels;

/** Filas de submódulo visibles en la tarjeta Registro del tablero sin pasar el cursor. */
export const REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS =
  cfg.registroNavigationDashboardPreviewLabels;

/** Etiquetas de submódulo de la tarjeta hover (mismo orden que el submenú lateral). */
export const REGISTRO_NAVIGATION_DASHBOARD_HOVER_LABELS = REGISTRO_NAVIGATION_SUBMENU_LABELS;

/**
 * Quita el prefijo de emoji de candado del nombre accesible de un ítem del submenú de Registro.
 *
 * @param label - Texto interno crudo del menuitem, posiblemente prefijado con un emoji de candado.
 */
export function stripRegistroLockPrefix(label: string): string {
  return label.replace(/^🔒\s*/, '').trim();
}

/**
 * Aserciones compartidas de recolección del tablero y del menú lateral de Registro.
 */
export class RegistroNavigationPage extends RegistroNavigationBasePage {
  /**
   * Comprueba que la tarjeta Registro es visible con las filas de submódulo de vista previa y los iconos ojo, sin pasar el cursor.
   */
  async expectRegistroDashboardPreviewRows(): Promise<void> {
    const card = this.registroDashboardCard();
    await expect(card).toBeVisible();
    await expect(card.getByText('Registro', { exact: true }).first()).toBeVisible();
    for (const label of REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS) {
      await expect(card.getByRole('listitem').filter({ hasText: label }).getByLabel('eye')).toBeVisible();
    }
  }

  /**
   * Pasa el cursor sobre la tarjeta Registro del tablero y comprueba que cada fila de submódulo es visible con un icono ojo.
   */
  async expectRegistroDashboardHoverSubmodules(): Promise<void> {
    await this.hoverRegistroDashboardCard();
    const card = this.registroDashboardCard();
    for (const label of REGISTRO_NAVIGATION_DASHBOARD_HOVER_LABELS) {
      const row = card.getByRole('listitem').filter({ hasText: label });
      await expect(row).toBeVisible();
      await expect(row.getByLabel('eye')).toBeVisible();
    }
  }

  /**
   * Comprueba que los nombres legacy de submódulo están ausentes en la tarjeta Registro del tablero.
   */
  async expectRegistroLegacySubmoduleAbsentOnCard(): Promise<void> {
    const card = this.registroDashboardCard();
    for (const label of REGISTRO_NAVIGATION_LEGACY_SUBMODULE_LABELS) {
      await expect(card.getByText(label, { exact: true })).toHaveCount(0);
    }
  }

  /**
   * Comprueba que los nombres legacy de submódulo están ausentes en el submenú expandido de Registro.
   */
  async expectRegistroLegacySubmoduleAbsentOnSidebar(): Promise<void> {
    const submenu = this.registroSubmenu();
    for (const label of REGISTRO_NAVIGATION_LEGACY_SUBMODULE_LABELS) {
      await expect(submenu.getByRole('menuitem', { name: label })).toHaveCount(0);
    }
  }

  /**
   * Comprueba el orden del submenú lateral de Registro, el estado habilitado/bloqueado y la ausencia de etiquetas legacy.
   */
  async expectRegistroSubmenuOrderAndLockState(): Promise<void> {
    await this.expandRegistroSidebar();
    const submenu = this.registroSubmenu();
    await expect(submenu).toBeVisible();

    const items = submenu.getByRole('menuitem');
    const count = await items.count();
    const labels: string[] = [];
    for (let index = 0; index < count; index += 1) {
      labels.push(stripRegistroLockPrefix((await items.nth(index).innerText()).trim()));
    }

    expect(labels).toEqual([...REGISTRO_NAVIGATION_SUBMENU_LABELS]);
    await this.expectRegistroLegacySubmoduleAbsentOnSidebar();

    for (const label of REGISTRO_NAVIGATION_ENABLED_SUBMENU_LABELS) {
      await expect(submenu.getByRole('menuitem', { name: label, disabled: false }).first()).toBeVisible();
    }
    await this.expectRegistroLockedSubmenuItemsVisible();
  }

  /**
   * Comprueba que las filas bloqueadas de submódulo de Registro son visibles y están deshabilitadas en el menú lateral.
   */
  async expectRegistroLockedSubmenuItemsVisible(): Promise<void> {
    await this.expandRegistroSidebar();
    const submenu = this.registroSubmenu();
    for (const label of REGISTRO_NAVIGATION_LOCKED_SUBMENU_LABELS) {
      await expect(submenu.getByRole('menuitem', { name: label, disabled: true }).first()).toBeVisible();
    }
  }
}
