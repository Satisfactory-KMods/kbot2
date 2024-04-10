import { Events, type Message } from 'discord.js';
import { log } from '~/utils/logger';

botClient.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;
	log('bot', `Message from ${message.author.tag}: ${message.content}`);
	if (message.inGuild()) {
		await handleInGuild(message);
	} else {
		await handleNotInGuild(message as Message<false>);
	}
});

async function handleInGuild(message: Message<true>) {
	if (message.content === 'ping') {
		await message.reply('Pong!');
	}
}

// eslint-disable-next-line unused-imports/no-unused-vars
async function handleNotInGuild(message: Message<false>) {}

export {};
