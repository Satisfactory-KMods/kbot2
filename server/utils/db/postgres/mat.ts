import { migrateViews } from '@kmods/drizzle-pg/pg-core';
import { drizzle } from '@kmods/drizzle-pg/postgres-js';
import { poolConnection } from './pg';
import * as views from './views';

// we want to destory the views first before we do the migration to avoid any issues
export function destoryViews() {
	return migrateViews({
		imports: {},
		service: 'kbot-dev',
		migrationDb: drizzle(poolConnection, {})
	});
}

export function createViews() {
	return migrateViews({
		imports: views,
		service: 'kbot-dev',
		migrationDb: drizzle(poolConnection, {})
	});
}
