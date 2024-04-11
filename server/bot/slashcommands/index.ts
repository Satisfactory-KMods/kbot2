import type { CacheType, Interaction, SlashCommandBuilder } from 'discord.js';
import { Events, Routes } from 'discord.js';
import { env } from '~/env';
import { log } from '~/utils/logger';
import { botClient, botRest } from '../bot';
import ping from './ping';

export type Slashcommand = {
	data: SlashCommandBuilder;
	execute: (interaction: Interaction<CacheType>) => void | Promise<void>;
};

const slashcommands = [ping];
export const slashcommandRegisterArray = slashcommands.map(({ data }) => {
	return data.toJSON();
});

export async function refreshSlashCommands() {
	try {
		slashcommands.forEach((cmd) => {
			const findExisting = slashcommands.find((existing) => {
				return existing.data.name === cmd.data.name && cmd.data !== existing.data;
			});
			if (findExisting) {
				log('bot-fatal', `Duplicate command found: ${cmd.data.name}`);
			}
		});

		await botRest.put(Routes.applicationCommands(env.auth.discord.clientId), {
			body: slashcommandRegisterArray
		});
		log('bot', 'Refreshing slash commands');
	} catch (error: any) {
		log('bot-error', `Error refreshing slash commands`, error.message);
	}
}

export async function initSlashCommands() {
	botClient.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		const command = slashcommands.find((cmd) => {
			return cmd.data.name === interaction.commandName;
		});
		if (!command) {
			log('bot-error', 'Command not found', interaction.commandName);
			return;
		}

		log(
			'bot-slashcommands',
			`Command: ${interaction.commandName} from ${interaction.user.tag}`
		);
		await command.execute(interaction);
	});

	await refreshSlashCommands();

	log('bot', 'Initializing slash commands');
}
