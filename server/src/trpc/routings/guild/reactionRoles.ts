import { MO_ReactionRoles }     from "@shared/types/MongoDB";
import { handleTRCPErr }        from "@server/lib/Express.Lib";
import { TRPCError }            from "@trpc/server";
import {
	guildProcedure,
	router
}                               from "@server/trpc/trpc";
import DB_ReactionRoles         from "@server/mongodb/DB_ReactionRoles";
import {
	DiscordMessage,
	DiscordTextChannel
}                               from "@shared/types/discord";
import z                        from "zod";
import _                        from "lodash";
import { reapplyReactionRoles } from "@server/lib/bot/guild.lib";

export const guild_reactionRoles =
	router( {
		getReactionRoles: guildProcedure.query<{
			commands : MO_ReactionRoles[],
			messages : Record<string, DiscordMessage>,
			channels : Record<string, DiscordTextChannel>,
		}>( async( { ctx } ) => {
			const { userClass, guildId, guild } = ctx;
			try {
				if ( userClass?.IsValid && guildId && guild ) {
					const commands : MO_ReactionRoles[] = [];
					const messages : Record<string, DiscordMessage> = {};
					const channels : Record<string, DiscordTextChannel> = {};

					for await ( const command of await DB_ReactionRoles.find( { guildId } ) ) {
						commands.push( command );
						const channel = await guild.textChannel( command.channelId );
						const message = await guild.message( command.messageId, command.channelId );
						if ( channel && message ) {
							channels[ channel.id ] = channel.toJSON() as DiscordTextChannel;
							messages[ message.id ] = message.toJSON() as DiscordMessage;
						}
					}

					return { commands, messages, channels };
				}
			}
			catch ( e ) {
				handleTRCPErr( e );
			}
			throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
		} ),


		modifyReactionRole: guildProcedure.input( z.object( {
			id: z.string().min( 10, "Id is to short" ).optional(),
			remove: z.boolean().optional(),
			data: z.object( {
				guildId: z.string().min( 10, "Guild id is to short" ),
				channelId: z.string().min( 10, "Channel id is to short" ),
				messageId: z.string().min( 10, "Message id is to short" ),
				reactions: z.array( z.object( {
					emoji: z.string().min( 1, "Emoji is empty" ),
					roleId: z.string().min( 10, "Channel id is to short" )
				} ) ).min( 1, "At least one reaction is required" )
			} )
		} ) ).mutation<{
			message : string,
			data? : MO_ReactionRoles
		}>( async( { ctx, input } ) => {
			const { guild } = ctx;
			const { id, remove, data } = input;
			try {
				let reactionRoleDocument = new DB_ReactionRoles();
				if ( id ) {
					reactionRoleDocument = ( await DB_ReactionRoles.findByIdAndUpdate( id, { data }, { new: true } ) )!;
				}
				else if ( !!remove && !!id ) {
					reactionRoleDocument = ( await DB_ReactionRoles.findByIdAndRemove( id ) )!;
				}
				else {
					reactionRoleDocument.guildId = data.guildId;
					reactionRoleDocument.channelId = data.channelId;
					reactionRoleDocument.messageId = data.messageId;
					reactionRoleDocument.reactions = data.reactions;
				}

				if ( reactionRoleDocument && guild ) {
					const message = await guild.message( reactionRoleDocument.messageId, reactionRoleDocument.channelId );
					if ( message ) {
						const copy : MO_ReactionRoles = _.cloneDeep( reactionRoleDocument.toJSON() );
						if ( remove ) {
							copy.reactions.length = 0;
						}
						await reapplyReactionRoles( message, copy );
					}
				}

				if ( !remove && await reactionRoleDocument.save() ) {
					return {
						data: reactionRoleDocument.toJSON(),
						message: id ? "Successfully modified" : "Successfully added"
					};
				}
				return { message: "Reaction role was removed" };
			}
			catch ( e ) {
				handleTRCPErr( e );
			}
			throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
		} )
	} );