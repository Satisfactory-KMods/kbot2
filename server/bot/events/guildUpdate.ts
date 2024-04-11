import { Events } from 'discord.js';
import { log } from '~/utils/logger';
import { botClient } from '../bot';
import { DiscordGuildManager } from '../utils/guildManager';

botClient.on(Events.GuildUpdate, async (event) => {
	const guild = await DiscordGuildManager.GetGuild(event.id);
	if (guild.isValid()) {
		await guild.updateGuildDatas();
	}

	log('bot', `Update guild ${event.name} (${event.id})`);
});

log('bot', 'GuildUpdate event loaded');

export {};
