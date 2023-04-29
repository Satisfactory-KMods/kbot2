import { handleTRCPErr } from "@server/lib/Express.Lib";
import { TRPCError }     from "@trpc/server";
import {
	guildProcedure,
	router
}                        from "@server/trpc/trpc";
import { ChannelType }   from "discord.js";
import { DiscordRole }   from "@shared/types/discord";

export const guild_roles =
	router( {
		getrole: guildProcedure.query<{
			roles : DiscordRole[]
		}>( async( { input, ctx } ) => {
			const { guild } = ctx;
			try {
				if ( guild ) {
					const roles : any[] = guild.getGuild?.roles.cache.map( e => e ) || [];
					return { roles };
				}
			}
			catch ( e ) {
				handleTRCPErr( e );
			}
			throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
		} )
	} );