import { Events, type Message } from 'discord.js';
import { log } from '~/utils/logger';
import { botClient } from '../bot';
import { fuzzySearch, getChatMessageCommand, reactToCommand } from './actions/chat/commands';

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
	const command = await getChatMessageCommand(message);
	if (command) {
		await reactToCommand(message, command);
	} else {
		await fuzzySearch(message);
	}
}

// eslint-disable-next-line unused-imports/no-unused-vars
async function handleNotInGuild(message: Message<false>) {}

log('bot', 'MessageCreate event loaded');

export {};
