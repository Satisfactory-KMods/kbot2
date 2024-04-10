import { SlashCommandBuilder } from 'discord.js';
import type { Slashcommand } from '.';

export default {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	async execute(interaction) {
		if (!interaction.isAutocomplete()) {
			await interaction.reply({ content: 'Pong!', ephemeral: true });
		}
	}
} satisfies Slashcommand;
