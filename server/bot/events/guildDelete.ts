import { Events } from 'discord.js';
import { log } from '~/utils/logger';
import { botClient } from '../bot';
import { DiscordGuildManager } from '../utils/guildManager';

botClient.on(Events.GuildDelete, async (event) => {
	await DiscordGuildManager.RemoveGuild(event.id);

	log('bot', `Left guild ${event.name} (${event.id})`);
});
