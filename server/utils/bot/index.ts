import { env } from '~/env';
import { log } from '~/utils/logger';
import { botClient } from './bot';
import { initSlashCommands } from './slashcommands';

export async function discordInitBot() {
	log('bot', 'Initializing bot');

	await import('./events/ready');
	await import('./events/messages');

	await botClient.login(env.auth.discord.token).catch((err) => {
		log('bot-fatal', err, `| Token: ${env.auth.discord.token}`);
		process.exit(1);
	});

	await initSlashCommands();
}
