import { Client, GatewayIntentBits, Partials } from 'discord.js';

export const botClient = new Client({
	intents: [
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages
	],
	partials: [Partials.Channel, Partials.Channel, Partials.Reaction]
});

export const botRest = botClient.rest;
