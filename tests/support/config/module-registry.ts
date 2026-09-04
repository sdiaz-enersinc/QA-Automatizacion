/** Canonical module route keys for tenant manifest and guards. */
export const MODULE_IDS = {
  registroNavigation: 'registroNavigation',
  registroCttosCombustible: 'registroCttosCombustible',
  registroCttosEnergia: 'registroCttosEnergia',
  registroOtrosContratos: 'registroOtrosContratos',
  registroInsumosOferta: 'registroInsumosOferta',
  registroOtrosDocumentos: 'registroOtrosDocumentos',
  registroHistorial: 'registroHistorial',
  registroSireci: 'registroSireci',
  registroRpm: 'registroRpm',
  registroEmpresas: 'registroEmpresas',
} as const;

export type ModuleId = (typeof MODULE_IDS)[keyof typeof MODULE_IDS];

/** Parent group keys in tenant.json that gate multiple modules at once. */
export const MODULE_GROUP_IDS = {
  registro: 'registro',
} as const;

export type ModuleGroupId = (typeof MODULE_GROUP_IDS)[keyof typeof MODULE_GROUP_IDS];

/** Module IDs that belong to the Registro group (gated by modules.registro in tenant.json). */
export const REGISTRO_MODULE_IDS: readonly ModuleId[] = (
  Object.values(MODULE_IDS) as ModuleId[]
).filter((id) => id !== MODULE_IDS.registroNavigation);

/**
 * Returns the parent group id for a module, if any.
 *
 * @param moduleId - Canonical module id or a string key from tenant.json.
 */
export function getModuleGroupId(moduleId: ModuleId | string): ModuleGroupId | undefined {
  if ((REGISTRO_MODULE_IDS as readonly string[]).includes(moduleId)) {
    return MODULE_GROUP_IDS.registro;
  }

  return undefined;
}

/** Relative paths under tests/tenants/<tenant>/ for each module config file. */
export const MODULE_CONFIG_PATHS: Record<ModuleId, string> = {
  registroNavigation: 'registro/config/navigation.json',
  registroCttosCombustible: 'registro/config/cttos-combustible.json',
  registroCttosEnergia: 'registro/config/cttos-energia.json',
  registroOtrosContratos: 'registro/config/otros-contratos.json',
  registroInsumosOferta: 'registro/config/insumos-oferta.json',
  registroOtrosDocumentos: 'registro/config/otros-documentos.json',
  registroHistorial: 'registro/config/historial.json',
  registroSireci: 'registro/config/sireci.json',
  registroRpm: 'registro/config/rpm.json',
  registroEmpresas: 'registro/config/empresas.json',
};
