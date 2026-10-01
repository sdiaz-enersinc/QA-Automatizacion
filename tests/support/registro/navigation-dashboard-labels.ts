import { getRegistroNavigationConfig } from '../config/load-tenant-config';

const cfg = getRegistroNavigationConfig();

/** Filas de submódulo visibles en la tarjeta Registro del tablero sin pasar el cursor. */
export const REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS =
  cfg.registroNavigationDashboardPreviewLabels;

/** Etiquetas de submódulo en el hover de la tarjeta Registro (mismo orden que el submenú lateral). */
export const REGISTRO_NAVIGATION_DASHBOARD_HOVER_LABELS = cfg.registroNavigationSubmenuLabels;

/** Etiquetas legacy que no deben aparecer en la tarjeta Registro tras renombres de submódulo. */
export const REGISTRO_NAVIGATION_LEGACY_SUBMODULE_LABELS =
  cfg.registroNavigationLegacySubmoduleLabels;

/**
 * Devuelve un rango inclusivo de etiquetas del hover del tablero entre dos submódulos de la config.
 *
 * @param fromLabel - Primera etiqueta del rango (debe existir en la config).
 * @param toLabel - Última etiqueta del rango (debe existir en la config).
 */
export function sliceRegistroDashboardHoverLabels(
  fromLabel: string,
  toLabel: string,
): readonly string[] {
  const labels = REGISTRO_NAVIGATION_DASHBOARD_HOVER_LABELS;
  const fromIndex = labels.indexOf(fromLabel);
  const toIndex = labels.indexOf(toLabel);
  if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) {
    throw new Error(
      `Rango de hover del tablero inválido (${fromLabel} → ${toLabel}); config: ${labels.join(', ')}`,
    );
  }
  return labels.slice(fromIndex, toIndex + 1);
}

/**
 * Etiquetas de contexto del hover al validar la fila Empresas (desde Cttos energía hasta Insumos oferta).
 */
export function registroDashboardHoverLabelsEmpresasContext(): readonly string[] {
  return sliceRegistroDashboardHoverLabels('Cttos energía', 'Insumos oferta');
}

/**
 * Etiquetas de contexto del hover para submódulos bajos de Registro (desde Insumos oferta hasta Historial).
 */
export function registroDashboardHoverLabelsFromInsumosOfertaThroughHistorial(): readonly string[] {
  return sliceRegistroDashboardHoverLabels('Insumos oferta', 'Historial');
}
