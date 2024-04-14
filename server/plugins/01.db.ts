import { log } from '~/utils/logger';
import { createViews, destoryViews } from '../utils/db/postgres/mat';
import { startMigrate } from '../utils/db/postgres/pg';

export default defineNitroPlugin(async () => {
	log('log', 'Starting database migration');
	await destoryViews();
	await startMigrate();
	await createViews();
});
