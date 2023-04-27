import type { tRPC }                      from "@server/trpc/server";
import { IMO_ChatCommands }               from "@shared/types/MongoDB";
import { handleTRCPErr }                  from "@server/lib/Express.Lib";
import { TRPCError }                      from "@trpc/server";
import DB_ChatCommands, { ZChatCommands } from "@server/mongodb/DB_ChatCommands";
import z                                  from "zod";

export const guild_chatCommands = ( tRPC : tRPC ) => {
	const p = tRPC.procedure.input( z.object( {
		guildId: z.string()
	} ) );

	return tRPC.router( {
		getcommands: p.query<{
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


		add: p.input( z.object( {
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


		modify: p.input( z.object( {
			id: z.string().min( 5, { message: "empty chat command id" } ),
			data: ZChatCommands
		} ) ).mutation<{
			message : string,
			command : IMO_ChatCommands
		}>( async( { input } ) => {
			const { data, id } = input;
			try {
				if ( !await DB_ChatCommands.exists( {
					$or: [
						{ command: data.command },
						{ alias: data.command },
						{ alias: { $in: data.alias } },
						{ command: data.alias }
					]
				} ) ) {
					const commandDocument = await DB_ChatCommands.findByIdAndUpdate( id, data, { new: true } );
					if ( commandDocument ) {
						return {
							message: "Command modified!",
							command: commandDocument.toJSON()
						};
					}
					throw new TRPCError( {
						message: "Invalid command id. Looks like it was removed. or something went wrong.",
						code: "INTERNAL_SERVER_ERROR"
					} );
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


		rm: p.input( z.object( {
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
};