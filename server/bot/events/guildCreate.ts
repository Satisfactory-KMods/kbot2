import { Events } from 'discord.js';
import { log } from '~/utils/logger';
import { botClient } from '../bot';
import { DiscordGuildManager } from '../utils/guildManager';

botClient.on(Events.GuildCreate, async (event) => {
	// eslint-disable-next-line unused-imports/no-unused-vars
	const guild = await DiscordGuildManager.GetGuild(event.id);

	log('bot', `Joined guild ${event.name} (${event.id})`);
});
