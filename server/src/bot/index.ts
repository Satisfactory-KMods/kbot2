import {
	ActivityType,
	Client,
	GatewayIntentBits
}                from "discord.js";
import Package   from "@/package.json";
import * as fs   from "fs";
import * as path from "path";

const client = new Client( { intents: Object.entries( GatewayIntentBits ).map( R => parseInt( R[ 0 ] ) ).filter( R => !isNaN( R ) ) } );

client.on( "ready", async() => {
	if ( client.isReady() ) {
		global.DiscordBot = client;
		DiscordBot.user.setActivity( {
			url: "https://kbot.kyrium.space/signin",
			name: `v${ Package.version }`,
			type: ActivityType.Streaming
		} );
		SystemLib.Log( "bot", `Logged in as ${ DiscordBot.user.tag }!` );
		await DiscordBot.user.setUsername( "KBot" );
	}
} );

client.on( "interactionCreate", async interaction => {
	if ( !interaction.isChatInputCommand() ) {
		return;
	}

	if ( interaction.commandName === "ping" ) {
		await interaction.reply( "Pong!" );
	}
} );

export default async function() {
	for ( const Dir of fs.readdirSync( __dirname ) ) {
		const State = fs.statSync( path.join( __dirname, Dir ) );
		if ( State.isDirectory() ) {
			for ( const File of fs.readdirSync( path.join( __dirname, Dir ) ) ) {
				await import( path.join( __dirname, Dir, File ) );
				SystemLib.Log( "bot", "Loading Script:", path.join( Dir, File ) );
			}
		}
	}
	return await client.login( process.env.Token );
}
