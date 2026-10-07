/** Etiquetas de navegación compartida de Registro específicas del tenant. */
export interface RegistroNavigationTenantConfig {
  registroNavigationSubmenuLabels: readonly string[];
  registroNavigationEnabledSubmenuLabels: readonly string[];
  registroNavigationLockedSubmenuLabels: readonly string[];
  registroNavigationLegacySubmoduleLabels: readonly string[];
  registroNavigationDashboardPreviewLabels: readonly string[];
  registroNavigationEmpresasHoverFromLabel: string;
  registroNavigationEmpresasHoverToLabel: string;
  registroNavigationLowerHoverFromLabel: string;
  registroNavigationLowerHoverToLabel: string;
}
