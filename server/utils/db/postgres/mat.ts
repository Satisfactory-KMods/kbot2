import { migrateViews } from '@kmods/drizzle-pg/pg-core';
import { drizzle } from '@kmods/drizzle-pg/postgres-js';
import { poolConnection } from './pg';

export function startMat() {
	return migrateViews({
		imports: {},
		service: 'kbot-dev',
		migrationDb: drizzle(poolConnection, {})
	});
}
