import { Events } from 'discord.js';
import { log } from '~/utils/logger';

botClient.once(Events.ClientReady, (client) => {
	log('bot', `Logged in as ${client.user.tag}!`);
});

log('bot', 'Ready event loaded');

export {};
