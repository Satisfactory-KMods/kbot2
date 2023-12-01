import { MakeRandomString } from '@kyri123/k-javascript-utils';
import { DiscordGuildManager } from '@server/lib/bot/guild.lib';
import DB_Patreon from '@server/mongodb/DB_Patreon';
import { CommandInteraction, GuildMemberRoleManager, PermissionFlagsBits, PermissionsBitField, SlashCommandBuilder } from 'discord.js';

const command = new SlashCommandBuilder().setName('patreon').setDescription('Create or get your patreon token to download dev builds!');

const exec = async (interaction: CommandInteraction) => {
	try {
		const guild = await DiscordGuildManager.GetGuild(interaction.guildId || '');
		if (interaction.inGuild() && guild?.IsValid) {
			const { patreonOptions } = (await guild.getGuildDb())!;
			if (interaction.member.roles instanceof GuildMemberRoleManager && interaction.member.permissions instanceof PermissionsBitField) {
				const roleTest = interaction.member.roles.cache.find((r) => patreonOptions?.pingRoles.includes(r.id));
				if (
					roleTest ||
					interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
					interaction.member.permissions.has(PermissionFlagsBits.BanMembers)
				) {
					let patreonDocument = await DB_Patreon.findOne({
						guildId: interaction.guildId,
						discordId: interaction.member.user.id
					});
					if (!patreonDocument) {
						patreonDocument = new DB_Patreon();
						patreonDocument.guildId = interaction.guildId;
						patreonDocument.discordId = interaction.member.user.id;
						patreonDocument.token = MakeRandomString(30, '-');
						await patreonDocument.save();
					}
					const token = patreonDocument.token;
					await interaction.reply({ ephemeral: true, content: `Here is your token: **${token}**` });
					return;
				}
			}
		}
	} catch (e) {
		if (e instanceof Error) {
			SystemLib.LogError('bot', e.message);
		}
	}
	await interaction.reply({ ephemeral: true, content: `You have no permissions for a Patreon token sorry!` });
};

export default {
	exec,
	command
};
