/** Claves canónicas de ruta de módulo para el manifiesto del tenant y los guards. */
export const MODULE_IDS = {
  registroNavigation: 'registroNavigation',
  registroCttosCombustible: 'registroCttosCombustible',
  registroCttosEnergia: 'registroCttosEnergia',
  registroOtrosContratos: 'registroOtrosContratos',
  registroInsumosOferta: 'registroInsumosOferta',
  registroPlantaConsumos: 'registroPlantaConsumos',
  registroOtrosDocumentos: 'registroOtrosDocumentos',
  registroHistorial: 'registroHistorial',
  registroSireci: 'registroSireci',
  registroRpm: 'registroRpm',
  registroEmpresas: 'registroEmpresas',
} as const;

export type ModuleId = (typeof MODULE_IDS)[keyof typeof MODULE_IDS];

/** Claves de grupo padre en tenant.json que habilitan varios módulos a la vez. */
export const MODULE_GROUP_IDS = {
  registro: 'registro',
} as const;

export type ModuleGroupId = (typeof MODULE_GROUP_IDS)[keyof typeof MODULE_GROUP_IDS];

/** IDs de módulo que pertenecen al grupo Registro (gobernados por modules.registro en tenant.json). */
export const REGISTRO_MODULE_IDS: readonly ModuleId[] = (
  Object.values(MODULE_IDS) as ModuleId[]
).filter((id) => id !== MODULE_IDS.registroNavigation);

/**
 * Devuelve el id de grupo padre de un módulo, si existe.
 *
 * @param moduleId - Id canónico de módulo o clave string de tenant.json.
 */
export function getModuleGroupId(moduleId: ModuleId | string): ModuleGroupId | undefined {
  if ((REGISTRO_MODULE_IDS as readonly string[]).includes(moduleId)) {
    return MODULE_GROUP_IDS.registro;
  }

  return undefined;
}

/** Rutas relativas bajo tests/tenants/<tenant>/ para cada archivo de config de módulo. */
export const MODULE_CONFIG_PATHS: Record<ModuleId, string> = {
  registroNavigation: 'registro/config/navigation.json',
  registroCttosCombustible: 'registro/config/cttos-combustible.json',
  registroCttosEnergia: 'registro/config/cttos-energia.json',
  registroOtrosContratos: 'registro/config/otros-contratos.json',
  registroInsumosOferta: 'registro/config/insumos-oferta.json',
  registroPlantaConsumos: 'registro/config/planta-consumos.json',
  registroOtrosDocumentos: 'registro/config/otros-documentos.json',
  registroHistorial: 'registro/config/historial.json',
  registroSireci: 'registro/config/sireci.json',
  registroRpm: 'registro/config/rpm.json',
  registroEmpresas: 'registro/config/empresas.json',
};
