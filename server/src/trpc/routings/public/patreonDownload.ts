import { z }                   from "zod";
import { TRPCError }           from "@trpc/server";
import { handleTRCPErr }       from "@server/lib/Express.Lib";
import {
	publicProcedure,
	router
}                              from "@server/trpc/trpc";
import DB_Patreon              from "@server/mongodb/DB_Patreon";
import DB_PatreonReleases      from "@server/mongodb/DB_PatreonReleases";
import { MakeRandomString }    from "@kyri123/k-javascript-utils";
import { DiscordGuildManager } from "@server/lib/bot/guild.lib";
import _                       from "lodash";

export const public_patreon = router( {
	checkDownload: publicProcedure.input( z.object( {
		downloadId: z.string()
	} ) ).query<{
		valid : boolean
	}>( async( { input } ) => {
		const { downloadId } = input;
		try {
			return {
				valid: !!( await DB_PatreonReleases.exists( {
					_id: downloadId
				} ) )
			};
		}
		catch ( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { code: "BAD_REQUEST" } );
	} ),


	checkToken: publicProcedure.input( z.object( {
		token: z.string(),
		file: z.string()
	} ) ).mutation<{
		downloadId : string
	}>( async( { input } ) => {
		if ( !global.validDownloadUrls ) {
			global.validDownloadUrls = [];
		}
		const { token, file } = input;
		try {
			const patreonDocument = await DB_Patreon.findOne( { token } );
			if ( patreonDocument ) {
				const guild = await DiscordGuildManager.GetGuild( patreonDocument.guildId );
				const fileDocument = await DB_PatreonReleases.findById( file.clearWs() );
				if ( guild?.IsValid && fileDocument ) {
					const member = await guild.getGuild!.members.cache.find( e => _.isEqual( e.id, patreonDocument.discordId ) );
					const patreonOptions = await guild.getGuildDb();
					if ( _.isEqual( fileDocument.guildId, patreonDocument.guildId ) && member ) {
						if ( patreonOptions && member && member.roles.cache.find( r => patreonOptions.patreonOptions?.pingRoles.includes( r.id.toString().clearWs() ) ) ) {
							const downloadId = MakeRandomString( 50, "" );
							validDownloadUrls.push( {
								downloadId,
								file,
								expiresAt: new Date( Date.now() + 60 * 60 * 1000 )
							} );
							return { downloadId };
						}
					}
				}
				throw new TRPCError( {
					code: "BAD_REQUEST",
					message: "token is valid but user has no patreon on this server!"
				} );
			}
			throw new TRPCError( { code: "BAD_REQUEST", message: "token is invalid!" } );
		}
		catch ( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { code: "BAD_REQUEST", message: "token is invalid!" } );
	} )
} );
