import { log } from '~/utils/logger';
import { startMat } from '../utils/db/postgres/mat';
import { startMigrate } from '../utils/db/postgres/pg';

export default defineNitroPlugin(async () => {
	log('log', 'Starting database migration');
	await startMigrate();
	await startMat();
});
