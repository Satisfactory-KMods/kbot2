import { log } from '~/utils/logger';
import { initDiscordBot } from '../bot';

export default defineNitroPlugin(async () => {
	log('log', 'Starting initDiscordBot');
	await initDiscordBot();
});
