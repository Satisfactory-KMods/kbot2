import { IMO_ChatCommands }               from "@shared/types/MongoDB";
import { handleTRCPErr }                  from "@server/lib/Express.Lib";
import { TRPCError }                      from "@trpc/server";
import DB_ChatCommands, { ZChatCommands } from "@server/mongodb/DB_ChatCommands";
import z                                  from "zod";
import {
	guildProcedure,
	router
}                                         from "@server/trpc/trpc";
import _                                  from "lodash";

export const guild_chatCommands =
	router( {
		getcommands: guildProcedure.query<{
			commands : IMO_ChatCommands[]
		}>( async( { ctx } ) => {
			const { userClass, guildId } = ctx;
			try {
				if ( userClass?.IsValid && guildId ) {
					return { commands: await DB_ChatCommands.find( { guildId } ) };
				}
			}
			catch ( e ) {
				handleTRCPErr( e );
			}
			throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
		} ),


		add: guildProcedure.input( z.object( {
			data: ZChatCommands
		} ) ).mutation<{
			message : string,
			command : IMO_ChatCommands
		}>( async( { input } ) => {
			const { data } = input;
			try {
				if ( !await DB_ChatCommands.exists( {
					$or: [
						{ command: data.command },
						{ alias: data.command },
						{ alias: { $in: data.alias } },
						{ command: data.alias }
					]
				} ) ) {
					const commandDocument = new DB_ChatCommands( data );
					if ( await commandDocument.save() ) {
						return {
							message: "Command added!",
							command: commandDocument.toJSON()
						};
					}
				}
				throw new TRPCError( {
					message: "Duplicate command or command alias found!",
					code: "INTERNAL_SERVER_ERROR"
				} );
			}
			catch ( e ) {
				handleTRCPErr( e );
			}
			throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
		} ),


		modify: guildProcedure.input( z.object( {
			id: z.string().min( 5, { message: "empty chat command id" } ),
			data: ZChatCommands
		} ) ).mutation<{
			message : string,
			command : IMO_ChatCommands
		}>( async( { input } ) => {
			const { data, id, guildId } = input;
			try {
				const commandDocument = await DB_ChatCommands.findById( id );
				if ( commandDocument ) {
					if ( !_.isEqual( commandDocument.command, data.command ) ) {
						const duplicated = !!( await DB_ChatCommands.exists( {
							guildId, $or: [
								{ command: data.command },
								{ alias: data.command }
							]
						} ) );
						if ( duplicated ) {
							throw new TRPCError( {
								message: `Duplicate command found! (${ data.command })`,
								code: "INTERNAL_SERVER_ERROR"
							} );
						}
					}

					if ( !_.isEqual( commandDocument.alias, data.alias ) ) {
						const duplicated = await DB_ChatCommands.findOne( {
							guildId, $or: [
								{ command: data.alias },
								{ alias: { $in: data.alias } }
							]
						} );
						if ( duplicated ) {
							throw new TRPCError( {
								message: `Duplicate command alias found! (${ data.alias.filter( e => duplicated.alias.includes( e ) || duplicated.command === e ) })`,
								code: "INTERNAL_SERVER_ERROR"
							} );
						}
					}

					const commandDocumentModified = await DB_ChatCommands.findByIdAndUpdate( id, data, { new: true } );
					if ( commandDocumentModified ) {
						return {
							message: "Command modified!",
							command: commandDocumentModified.toJSON()
						};
					}
				}
				throw new TRPCError( {
					message: "Invalid command id. Looks like it was removed. or something went wrong.",
					code: "INTERNAL_SERVER_ERROR"
				} );
			}
			catch ( e ) {
				handleTRCPErr( e );
			}
			throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
		} ),


		rm: guildProcedure.input( z.object( {
			guildId: z.string(),
			id: z.string()
		} ) ).mutation<{
			message : string
		}>( async( { input } ) => {
			const { id } = input;
			try {
				const commandDocument = await DB_ChatCommands.findById( id );
				if ( commandDocument ) {
					await commandDocument.deleteOne();
					return { message: "Chat command deleted!" };
				}
				throw new TRPCError( {
					message: "Invalid command id. Looks like it was removed.",
					code: "INTERNAL_SERVER_ERROR"
				} );
			}
			catch ( e ) {
				handleTRCPErr( e );
			}
			throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
		} )
	} );