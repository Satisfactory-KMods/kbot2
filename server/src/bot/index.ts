import {
	ActivityType,
	Client,
	GatewayIntentBits
}                from "discord.js";
import Package   from "@/package.json";
import * as fs   from "fs";
import * as path from "path";
import { BC }    from "@server/lib/System.Lib";

// use all Intents
// Todo: is that a good idea? Maybe needs to be a bit more specific?
const client = new Client( { intents: Object.entries( GatewayIntentBits ).map( R => parseInt( R[ 0 ] ) ).filter( R => !isNaN( R ) ) } );

// set Bot name and activity type
client.on( "ready", async() => {
	if ( client.isReady() ) {
		global.DiscordBot = client;
		DiscordBot.user.setActivity( {
			name: `v${ Package.version }`,
			type: ActivityType.Streaming
		} );
		SystemLib.Log( "bot", "Running on version:", `${ BC( "Red" ) }v${ Package.version }` );
		await DiscordBot.user.setUsername( "KBot" );
	}
} );

// Refresh the guild list if a guild is added, updated or removed
client.on( "guildCreate", () => TaskManager.RunTask( "DiscordGuilds", false ) );
client.on( "guildUpdate", () => TaskManager.RunTask( "DiscordGuilds", false ) );
client.on( "guildDelete", () => TaskManager.RunTask( "DiscordGuilds", false ) );


// Wait for the bot to be ready before start the frontend
export default async function() {
	await new Promise<void>( ( resolve ) => {
		const Do = async() => {
			// register all event listeners
			for ( const Dir of fs.readdirSync( __dirname ) ) {
				const State = fs.statSync( path.join( __dirname, Dir ) );
				if ( State.isDirectory() ) {
					for ( const File of fs.readdirSync( path.join( __dirname, Dir ) ) ) {
						import( path.join( __dirname, Dir, File ) );
						SystemLib.Log( "bot", "Loading Script:", path.join( Dir, File ) );
					}
				}
			}

			// fire once if the bot to be ready
			client.once( "ready", async() => {
				global.DiscordBot = client;
				SystemLib.Log( "bot", `Logged in as ${ DiscordBot.user.tag }!` );
				resolve();
			} );

			// start the client login
			await client.login( process.env.Token );
		};
		Do();
	} );
}
