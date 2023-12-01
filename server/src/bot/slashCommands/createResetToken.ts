import { MakeRandomString } from '@kyri123/k-javascript-utils';
import DB_RegisterToken from '@server/mongodb/DB_RegisterToken';
import DB_UserAccount from '@server/mongodb/DB_UserAccount';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const command = new SlashCommandBuilder().setName('reset-password').setDescription('Create a token url for reset the password on the admin Panel');

const exec = async (interaction: CommandInteraction) => {
	try {
		await DB_RegisterToken.deleteMany({ expire: { $lte: Date.now() } });
	} catch (e) {
		if (e instanceof Error) {
			SystemLib.LogError('bot', e.message);
		}
	}

	try {
		if (await DB_UserAccount.exists({ discordId: interaction.user.id })) {
			const registerDoc = new DB_RegisterToken();
			registerDoc.userId = interaction.user.id;
			registerDoc.expire = new Date(Date.now() + 1000 * 60 * 60 * 24);
			registerDoc.guildId = interaction.guild!.id;
			registerDoc.token = MakeRandomString(20, '-');
			registerDoc.isPasswordResetToken = true;
			if (await registerDoc.save()) {
				await interaction.reply({
					content: `Token created successfully!\n\nYou can now use this url **${process.env.BASE_URL}reset/${
						registerDoc.token
					}** to reset your password on the admin panel.\n\nThis token expires <t:${Math.trunc(registerDoc.expire.valueOf() / 1000)}:R>`,
					ephemeral: true
				});
			}
		} else {
			await interaction.reply({
				content: `There is no account with this discord id!\n\nYou can now use this command to reset your password **/create-token**`,
				ephemeral: true
			});
		}
	} catch (e) {
		if (e instanceof Error) {
			SystemLib.LogError('bot', e.message);
		}
		await interaction.reply({
			content: 'token cannot create... please try it again or contact by owner Kyrium#5643!',
			ephemeral: true
		});
	}
};

export default {
	exec,
	command
};
