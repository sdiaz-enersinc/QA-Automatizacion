import { expect } from '@playwright/test';
import { getRegistroNavigationConfig } from '../../config/load-tenant-config';
import {
  REGISTRO_NAVIGATION_SUBMENU_LABELS,
  RegistroNavigationBasePage,
} from './registro-navigation-base';

const cfg = getRegistroNavigationConfig();

export { REGISTRO_NAVIGATION_SUBMENU_LABELS };

/** Enabled Registro submenu rows (clickable with current tenant credentials). */
export const REGISTRO_NAVIGATION_ENABLED_SUBMENU_LABELS = cfg.registroNavigationEnabledSubmenuLabels;

/** Locked Registro submenu rows (visible and disabled). */
export const REGISTRO_NAVIGATION_LOCKED_SUBMENU_LABELS = cfg.registroNavigationLockedSubmenuLabels;

/** Legacy submodule labels that must not appear after the rename. */
export const REGISTRO_NAVIGATION_LEGACY_SUBMODULE_LABELS = cfg.registroNavigationLegacySubmoduleLabels;

/** Submodule rows visible on the Registro dashboard card without hovering. */
export const REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS =
  cfg.registroNavigationDashboardPreviewLabels;

/** Hover-card submodule labels (same order as the sidebar submenu). */
export const REGISTRO_NAVIGATION_DASHBOARD_HOVER_LABELS = REGISTRO_NAVIGATION_SUBMENU_LABELS;

/**
 * Strips the lock emoji prefix from a Registro submenu accessible name.
 *
 * @param label - Raw menuitem inner text, possibly prefixed with a lock emoji.
 */
export function stripRegistroLockPrefix(label: string): string {
  return label.replace(/^🔒\s*/, '').trim();
}

/**
 * Shared Registro dashboard and sidebar harvest assertions.
 */
export class RegistroNavigationPage extends RegistroNavigationBasePage {
  /**
   * Asserts the Registro card is visible with the preview submodule rows and eye icons, without hovering.
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
   * Hovers the Registro dashboard card and asserts every submodule row is visible with an eye icon.
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
   * Asserts legacy submodule names are absent from the Registro dashboard card.
   */
  async expectRegistroLegacySubmoduleAbsentOnCard(): Promise<void> {
    const card = this.registroDashboardCard();
    for (const label of REGISTRO_NAVIGATION_LEGACY_SUBMODULE_LABELS) {
      await expect(card.getByText(label, { exact: true })).toHaveCount(0);
    }
  }

  /**
   * Asserts legacy submodule names are absent from the expanded Registro sidebar submenu.
   */
  async expectRegistroLegacySubmoduleAbsentOnSidebar(): Promise<void> {
    const submenu = this.registroSubmenu();
    for (const label of REGISTRO_NAVIGATION_LEGACY_SUBMODULE_LABELS) {
      await expect(submenu.getByRole('menuitem', { name: label })).toHaveCount(0);
    }
  }

  /**
   * Asserts the Registro sidebar submenu order, enabled/locked state, and absence of legacy labels.
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
   * Asserts locked Registro submodule rows are visible and disabled in the sidebar.
   */
  async expectRegistroLockedSubmenuItemsVisible(): Promise<void> {
    await this.expandRegistroSidebar();
    const submenu = this.registroSubmenu();
    for (const label of REGISTRO_NAVIGATION_LOCKED_SUBMENU_LABELS) {
      await expect(submenu.getByRole('menuitem', { name: label, disabled: true }).first()).toBeVisible();
    }
  }
}
