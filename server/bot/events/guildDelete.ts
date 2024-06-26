import { Events } from 'discord.js';
import { log } from '~/utils/logger';
import { botClient } from '../bot';
import { DiscordGuildManager } from '../utils/guildManager';

botClient.on(Events.GuildDelete, async (event) => {
	await DiscordGuildManager.removeGuild(event.id);

	log('bot', `Left guild ${event.name} (${event.id})`);
});

log('bot', 'GuildDelete event loaded');

export {};
