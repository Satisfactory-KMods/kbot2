import {
	ActivityType,
	Client,
	CommandInteraction,
	GatewayIntentBits,
	Partials,
	REST,
	Routes,
	SlashCommandBuilder
}                from "discord.js";
import Package   from "@/package.json";
import * as fs   from "fs";
import * as path from "path";
import {
	BC,
	SystemLib_Class
}                from "@server/lib/System.Lib";

const Options : SlashCommandConfig[] = [];

export interface SlashCommandConfig {
	command : SlashCommandBuilder,
	exec : ( interaction : CommandInteraction ) => Promise<void>,
}

// use all Intents
// Todo: is that a good idea? Maybe needs to be a bit more specific?
global.DiscordBot = new Client( {
	intents: Object.entries( GatewayIntentBits ).map( R => parseInt( R[ 0 ] ) ).filter( R => !isNaN( R ) ),
	partials: [ Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.User ]
} );

// set Bot name and activity type
DiscordBot.on( "ready", async() => {
	if ( DiscordBot.isReady() ) {
		DiscordBot.user.setActivity( {
			name: `v${ Package.version }`,
			type: ActivityType.Streaming
		} );
		SystemLib.Log( "bot", "Running on version:", `${ BC( "Red" ) }v${ Package.version }` );
		await DiscordBot.user.setUsername( `KBot 2.0${ SystemLib_Class.IsDev() ? " - Dev" : "" }` );
	}
} );

// Refresh the guild list if a guild is added, updated or removed
DiscordBot.on( "guildCreate", () => TaskManager.RunTask( "DiscordGuilds", false ) );
DiscordBot.on( "guildUpdate", () => TaskManager.RunTask( "DiscordGuilds", false ) );
DiscordBot.on( "guildDelete", () => TaskManager.RunTask( "DiscordGuilds", false ) );

DiscordBot.on( "interactionCreate", async( interaction ) => {
	if ( !interaction.isCommand() ) {
		return;
	}

	const Command = Options.find( E => E.command.name === interaction.commandName );
	if ( Command && interaction.isCommand() ) {
		await Command.exec( interaction );
	}
} );


// Wait for the bot to be ready before start the frontend
export default async function() {
	await new Promise<void>( ( resolve ) => {
		(async() => {
			// fire once if the bot to be ready
			DiscordBot.once( "ready", async() => {
				const rest = new REST( { version: "10" } ).setToken( process.env.TOKEN! );
				// register all event listeners
				for ( const Dir of fs.readdirSync( __dirname ) ) {
					const State = fs.statSync( path.join( __dirname, Dir ) );
					if ( State.isDirectory() ) {
						for ( const File of fs.readdirSync( path.join( __dirname, Dir ) ) ) {
							// gather alle slash commands
							if ( Dir === "slashCommands" ) {
								const Option : SlashCommandConfig = ( await import( path.join( __dirname, Dir, File ) ) ).default;
								if ( !Options.find( x => x.command.name === Option.command.name ) ) {
									Options.push( Option );
									SystemLib.Log( "bot", `Gather slash command:${ BC( "Cyan" ) }`, `/${ Option.command.name }` );
								}
								else {
									SystemLib.LogError( "bot", `Gather slash command FAILED reason DUPLICATED:${ BC( "Cyan" ) }`, `/${ Option.command.name }`, path.join( Dir, File ) );
								}
							}
							// import all other listeners
							else {
								const { startUp } = await import( path.join( __dirname, Dir, File ) );
								if ( startUp && typeof startUp === "function" ) {
									SystemLib.Log( "bot", `Loading startUp Script:${ BC( "Cyan" ) }`, path.join( Dir, File ) );
									await startUp();
								}
								SystemLib.Log( "bot", `Loading Script:${ BC( "Cyan" ) }`, path.join( Dir, File ) );
							}
						}
					}
				}

				// register all slash commands
				await rest.put( Routes.applicationCommands( DiscordBot.user.id ), { body: Options.map( E => E.command.toJSON() ) } );
				SystemLib.Log( "bot", `All slash command registered!` );
				resolve();
			} );

			// start the client login
			await DiscordBot.login( process.env.TOKEN );
		})();
	} );
}
