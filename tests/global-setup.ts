import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getTenantManifest } from './support/config/load-tenant-config';

dotenv.config({ quiet: true });

const DEFAULT_TENANT = 'emug';

/**
 * Validates TEST_TENANT, the tenant spec directory, and tenant.json before the run.
 * Does not initialize CSV catalogs (reporters are out of scope for this slice).
 */
export default async function globalSetup(): Promise<void> {
  const tenant = process.env.TEST_TENANT ?? DEFAULT_TENANT;
  const tenantDir = path.join(__dirname, 'tenants', tenant);

  if (!fs.existsSync(tenantDir)) {
    throw new Error(
      `Tenant spec directory not found: ${tenantDir} (TEST_TENANT=${tenant})`,
    );
  }

  const tenantJson = path.join(tenantDir, 'tenant.json');
  if (!fs.existsSync(tenantJson)) {
    throw new Error(
      `Tenant manifest not found: ${tenantJson} (TEST_TENANT=${tenant})`,
    );
  }

  const manifest = getTenantManifest();
  const enabledCount = Object.values(manifest.modules).filter((entry) => entry.enabled).length;

  console.log(
    `[playwright] TEST_TENANT=${tenant} → tests/tenants/${tenant}/** (${enabledCount} módulos enabled)`,
  );
}
