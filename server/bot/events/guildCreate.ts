import { Events } from 'discord.js';
import { log } from '~/utils/logger';
import { botClient } from '../bot';
import { DiscordGuildManager } from '../utils/guildManager';

botClient.on(Events.GuildCreate, async (event) => {
	const guild = await DiscordGuildManager.getGuild(event.id);

	log('bot', `Joined guild ${event.name} (${event.id})`);
});

log('bot', 'GuildCreate event loaded');

export {};
