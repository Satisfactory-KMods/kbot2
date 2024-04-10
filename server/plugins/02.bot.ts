import { log } from '~/utils/logger';

export default defineNitroPlugin(async () => {
	log('log', 'Starting discordInitBot');
	await discordInitBot();
});
