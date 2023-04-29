import { handleTRCPErr } from "@server/lib/Express.Lib";
import { TRPCError }     from "@trpc/server";
import {
	guildProcedure,
	router
}                        from "@server/trpc/trpc";
import z                 from "zod";
import { ChannelType }   from "discord.js";
import DB_Guilds         from "@server/mongodb/DB_Guilds";

export const guild_patreon =
	router( {
		updateSettings: guildProcedure.input( z.object( {
			pingRoles: z.array( z.string() ),
			announcementChannel: z.string(),
			changelogForum: z.string(),
			patreonReleaseText: z.string()
		} ) ).mutation<{
			message : string;
		}>( async( { input, ctx } ) => {
			const { guild } = ctx;
			const { pingRoles, announcementChannel, changelogForum, patreonReleaseText } = input;
			try {
				if ( guild ) {
					await DB_Guilds.findOneAndUpdate( { guildId: guild.guildId }, {
						"patreonOptions.pingRoles": pingRoles,
						"patreonOptions.announcementChannel": announcementChannel,
						"patreonOptions.changelogForum": changelogForum,
						"patreonOptions.patreonReleaseText": patreonReleaseText
					} );
					return { message: "Settings saved." };
				}
			}
			catch ( e ) {
				handleTRCPErr( e );
			}
			throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
		} )
	} );