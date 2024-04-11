import { log } from '~/utils/logger';
import { discordInitBot } from '../bot';

export default defineNitroPlugin(async () => {
	log('log', 'Starting discordInitBot');
	await discordInitBot();
});
