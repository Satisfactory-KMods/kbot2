import { Client, GatewayIntentBits } from 'discord.js';

export const botClient = new Client({
	intents: [
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages
	]
});

export const botRest = botClient.rest;
