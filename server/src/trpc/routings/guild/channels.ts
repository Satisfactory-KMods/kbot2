import { handleTRCPErr } from "@server/lib/Express.Lib";
import { TRPCError }     from "@trpc/server";
import {
	guildProcedure,
	router
}                        from "@server/trpc/trpc";
import z                 from "zod";
import { EChannelType }  from "@shared/Enum/EDiscord";
import { ChannelType }   from "discord.js";

export const guild_channels =
	router( {
		oftype: guildProcedure.input( z.object( {
			type: z.nativeEnum( EChannelType )
		} ) ).query<{
			channels : any[]
		}>( async( { input, ctx } ) => {
			const { type } = input;
			const { guild } = ctx;
			try {
				if ( guild ) {
					let channels : any[] = [];
					switch ( type ) {
						case EChannelType.voice:
							channels = ( await guild.getGuild?.channels.fetch()
								.then( r => r.filter( e => e?.type === ChannelType.GuildVoice ) )
								.then( r => r.map( e => e?.toJSON() as any ) )
								.catch( e => [] as any[] ) ) || [];
							break;
						case EChannelType.text:
							channels = ( await guild.getGuild?.channels.fetch()
								.then( r => r.filter( e => e?.type === ChannelType.GuildText || e?.type === ChannelType.GuildAnnouncement ) )
								.then( r => r.map( e => e?.toJSON() as any ) )
								.catch( e => [] as any[] ) ) || [];
							break;
						case EChannelType.forum:
							channels = ( await guild.getGuild?.channels.fetch()
								.then( r => r.filter( e => e?.type === ChannelType.GuildForum ) )
								.then( r => r.map( e => e?.toJSON() as any ) )
								.catch( e => [] as any[] ) ) || [];
							break;
					}
					return { channels };
				}
			}
			catch ( e ) {
				handleTRCPErr( e );
			}
			throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
		} )
	} );