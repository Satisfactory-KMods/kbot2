import { log } from '~/utils/logger';
import { botClient } from '../bot';
import { DiscordGuildManager } from './guildManager';

export function initGuilds() {
	return botClient.guilds.fetch().then(async (guilds) => {
		for (const guild of guilds.values()) {
			await DiscordGuildManager.getGuild(guild.id);
			log('bot', `Guild ${guild.name} (${guild.id}) loaded`);
		}
	});
}
