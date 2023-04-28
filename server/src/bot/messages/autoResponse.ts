import { DiscordGuildManager } from "@server/lib/bot/guild.lib";
import DB_ChatCommands         from "@server/mongodb/DB_ChatCommands";
import _                       from "lodash";
import {
	Message,
	MessageType
}                              from "discord.js";
import { MO_ChatCommands }     from "@shared/types/MongoDB";
import similarity              from "similarity";

const responseToMessage = async( message : Message<true>, command : MO_ChatCommands, followResponse = false ) => {
	if ( followResponse && message.type === MessageType.Reply ) {
		if ( message.reference && message.reference.messageId ) {
			const ReplyMessage = await message.channel.messages.fetch( message.reference.messageId ).catch( () => {
			} );
			if ( ReplyMessage ) {
				if ( ReplyMessage.inGuild() ) {
					message = ReplyMessage;
				}
			}
		}
	}

	await message.reply( { content: command.reactionText } );
};

DiscordBot.on( "messageCreate", async( message ) => {
	if ( message.author.bot || !message.inGuild() ) {
		return;
	}

	const guild = await DiscordGuildManager.GetGuild( message.guildId as string );
	if ( guild?.IsValid ) {
		const guildDb = await guild.getGuildDb()!;
		const commands = await DB_ChatCommands.find( { guildId: guild.guildId } );
		if ( !!commands.length && guildDb ) {
			if ( message.content.startsWith( guildDb.options.chatCommandPrefix ) ) {
				const rawCommand = message.content.split( " " )[ 0 ].replace( guildDb.options.chatCommandPrefix, "" );
				const command = commands.find( c => _.isEqual( c.command.toLowerCase(), rawCommand.toLowerCase() ) || c.alias.includes( rawCommand.clearWs().toLowerCase() ) );
				if ( command ) {
					await responseToMessage( message, command, true );
					return;
				}
			}
			else {
				for ( const command of commands ) {
					for ( const reaction of command.autoReactionMatches ) {
						if ( reaction.similarity ) {
							const firstLetter = reaction.matchString.charAt( 0 ).toLowerCase();
							let i = 0;
							while ( i < message.content.length ) {
								const letter = message.content.charAt( i );
								if ( letter === firstLetter ) {
									const sentence = message.content.substring( i, i + reaction.matchString.length );
									if ( similarity( sentence, reaction.matchString ) >= 0.75 ) {
										await responseToMessage( message, command, false );
										return;
									}
								}
								++i;
							}
						}
						else {
							if ( message.content.toLowerCase().includes( reaction.matchString.toLowerCase() ) ) {
								await responseToMessage( message, command, false );
							}
						}
					}
				}
			}
		}
	}
} );