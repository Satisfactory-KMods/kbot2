import {
	CommandInteraction,
	SlashCommandBuilder
}                           from "discord.js";
import DB_RegisterToken     from "@server/mongodb/DB_RegisterToken";
import { MakeRandomString } from "@kyri123/k-javascript-utils";

const command = new SlashCommandBuilder()
	.setName( "create-token" )
	.setDescription( "Create a token url for register on the admin Panel" );

const exec = async( interaction : CommandInteraction ) => {
	try {
		await DB_RegisterToken.deleteMany( { expire: { $lte: Date.now() } } );
	}
	catch ( e ) {
		if ( e instanceof Error ) {
			SystemLib.LogError( "bot", e.message );
		}
	}

	try {
		const registerDoc = new DB_RegisterToken();
		registerDoc.userId = interaction.user.id;
		registerDoc.expire = new Date( Date.now() + 1000 * 60 * 60 * 24 );
		registerDoc.guildId = interaction.guild!.id;
		registerDoc.token = MakeRandomString( 20, "-" );
		if ( await registerDoc.save() ) {
			await interaction.reply( {
				content: `Token created successfully!\n\nYou can now use this url **https://kbot2.kyrium.space/register/${ registerDoc.token }** to register on the admin panel.\n\nThis toke expires <t:${ Math.trunc( registerDoc.expire.valueOf() / 1000 ) }:R>`,
				ephemeral: true
			} );
		}
	}
	catch ( e ) {
		if ( e instanceof Error ) {
			SystemLib.LogError( "bot", e.message );
		}
		await interaction.reply( {
			content: "token cannot create... please try it again or contact by owner Kyrium#5643!",
			ephemeral: true
		} );
	}
};

export default {
	exec,
	command
};