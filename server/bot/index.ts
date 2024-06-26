import { env } from '~/env';
import { log } from '~/utils/logger';
import { botClient } from './bot';
import { startUpReactionRoles } from './events/actions/reaction/reactionRole';
import { initSlashCommands } from './slashcommands';
import { initGuilds } from './utils/init';

export async function initDiscordBot() {
	log('bot', 'Initializing bot');

	await import('./events/clientReady');
	await import('./events/messageCreate');
	await import('./events/messageReactionAdd');
	await import('./events/guildUpdate');
	await import('./events/guildCreate');
	await import('./events/guildDelete');
	await import('./events/interactionCreate');

	await botClient.login(env.auth.discord.token).catch((err) => {
		log('bot-fatal', err, `| Token: ${env.auth.discord.token}`);
		process.exit(1);
	});

	await initSlashCommands();
	await startUpReactionRoles();
	await initGuilds();

	log('bot', 'Bot fully initialized');
}
