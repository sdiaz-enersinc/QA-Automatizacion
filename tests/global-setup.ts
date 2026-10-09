import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getTenantManifest } from './support/config/load-tenant-config';

dotenv.config({ quiet: true });

const DEFAULT_TENANT = 'emug';

/**
 * Valida TEST_TENANT, el directorio de specs del tenant y tenant.json antes de la corrida.
 * No inicializa catálogos CSV (los reporters quedan fuera de alcance).
 */
export default async function globalSetup(): Promise<void> {
  const tenant = process.env.TEST_TENANT ?? DEFAULT_TENANT;
  const tenantDir = path.join(__dirname, 'tenants', tenant);

  if (!fs.existsSync(tenantDir)) {
    throw new Error(
      `No se encontró el directorio de specs del tenant: ${tenantDir} (TEST_TENANT=${tenant})`,
    );
  }

  const tenantJson = path.join(tenantDir, 'tenant.json');
  if (!fs.existsSync(tenantJson)) {
    throw new Error(
      `No se encontró el manifiesto del tenant: ${tenantJson} (TEST_TENANT=${tenant})`,
    );
  }

  const manifest = getTenantManifest();
  const enabledCount = Object.values(manifest.modules).filter((entry) => entry.enabled).length;

  console.log(
    `[playwright] TEST_TENANT=${tenant} → tests/tenants/${tenant}/** (${enabledCount} módulos habilitados)`,
  );
}
