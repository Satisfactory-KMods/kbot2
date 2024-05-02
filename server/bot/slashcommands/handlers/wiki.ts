import { SlashCommandBuilder } from 'discord.js';
import type { Slashcommand } from '..';

export default {
	data: new SlashCommandBuilder()
		.setName('wiki')
		.setDescription('Search in the wiki. Use /wiki <search term> to search.')
		.addStringOption((option) => {
			return option.setName('search').setDescription('The search term').setRequired(true);
		}),
	async execute(interaction) {
		if (!interaction.isAutocomplete()) {
			await interaction.reply({ content: 'This feature comming soon ;)', ephemeral: true });
		}
	},
	disabled: true
} satisfies Slashcommand;
