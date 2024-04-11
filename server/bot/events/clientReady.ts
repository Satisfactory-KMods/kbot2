import { ActivityType, Events } from 'discord.js';
import { env } from '~/env';
import { log } from '~/utils/logger';
import { botClient } from '../bot';

botClient.once(Events.ClientReady, async (client) => {
	log('bot', `Logged in as ${client.user.tag}!`);

	client.user.setActivity({
		name: `v${env.version}`,
		type: ActivityType.Custom
	});

	await client.user.setUsername(`KBot 2.0${env.dev ? ' - Dev' : ''}`);
});

log('bot', 'ClientReady event loaded');

export {};
