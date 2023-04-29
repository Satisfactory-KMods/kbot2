import * as trpcExpress              from "@trpc/server/adapters/express";
import { BC }                        from "@server/lib/System.Lib";
import {
	MW_Auth,
	MW_AuthGuild
}                                    from "@server/lib/Express.Lib";
import { public_validate }           from "@server/trpc/routings/public/validate";
import { public_login }              from "@server/trpc/routings/public/login";
import { guild_validate }            from "@server/trpc/routings/guild/validate";
import { public_createAccount }      from "@server/trpc/routings/public/createAccount";
import { public_resetPassword }      from "@server/trpc/routings/public/resetPassword";
import { public_checkToken }         from "@server/trpc/routings/public/patreon";
import { auth_getGuilds }            from "@server/trpc/routings/auth/getGuilds";
import { guild_chatCommands }        from "@server/trpc/routings/guild/chatCommands";
import {
	createContext,
	router
}                                    from "@server/trpc/trpc";
import { guild_modUpdateAnnoucment } from "@server/trpc/routings/guild/modUpdateAnnoucment";
import { guild_channels }            from "@server/trpc/routings/guild/channels";
import { guild_roles }               from "@server/trpc/routings/guild/role";
import {
	Request,
	Response
}                                    from "express";
import DB_PatreonReleases            from "@server/mongodb/DB_PatreonReleases";
import path                          from "path";
import fs                            from "fs";
import { public_patreon }            from "@server/trpc/routings/public/patreonDownload";
import { guild_patreon }             from "@server/trpc/routings/guild/patreonSettings";


const publicRouter = router( {
	checktoken: public_checkToken,
	validate: public_validate,
	login: public_login,
	register: public_createAccount,
	resetpassword: public_resetPassword,
	patreon: public_patreon
} );
const authRouter = router( {
	getguilds: auth_getGuilds
} );
const guildRouter = router( {
	validate: guild_validate,
	chatcommands: guild_chatCommands,
	modupdates: guild_modUpdateAnnoucment,
	channels: guild_channels,
	roles: guild_roles,
	patreon: guild_patreon
} );


SystemLib.Log( "start", "register TRCP on", BC( "Red" ), "/api/v2/*" );
Api.use( "/api/v2/public", trpcExpress.createExpressMiddleware( {
	router: publicRouter,
	createContext
} ) );
Api.use( "/api/v2/auth", MW_Auth, trpcExpress.createExpressMiddleware( {
	router: authRouter,
	createContext
} ) );
Api.use( "/api/v2/guild", MW_AuthGuild, trpcExpress.createExpressMiddleware( {
	router: guildRouter,
	createContext
} ) );
Api.get( "/api/v2/download/:downloadId", async( req : Request, res : Response ) => {
	const { downloadId } = req.params;
	if ( downloadId && global.validDownloadUrls ) {
		const informationIdx = validDownloadUrls.findIndex( e => e.downloadId === downloadId );
		if ( validDownloadUrls[ informationIdx ] && validDownloadUrls[ informationIdx ].expiresAt.valueOf() >= Date.now() ) {
			const information = validDownloadUrls.splice( informationIdx, 1 )[ 0 ];
			const patreonDocument = await DB_PatreonReleases.findById( information.file );
			if ( patreonDocument ) {
				const file = path.join( __MountDir, "patreon", `${ patreonDocument._id }.zip` );
				if ( fs.existsSync( file ) ) {
					return res.status( 200 ).download( file );
				}
			}
		}
	}
	res.status( 401 );
} );

export type PublicRouter = typeof publicRouter;
export type AuthRouter = typeof authRouter;
export type GuildRouter = typeof guildRouter;