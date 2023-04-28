import * as trpcExpress         from "@trpc/server/adapters/express";
import { BC }                   from "@server/lib/System.Lib";
import {
	MW_Auth,
	MW_AuthGuild
}                               from "@server/lib/Express.Lib";
import { public_validate }      from "@server/trpc/routings/public/validate";
import { public_login }         from "@server/trpc/routings/public/login";
import { guild_validate }       from "@server/trpc/routings/guild/validate";
import { public_createAccount } from "@server/trpc/routings/public/createAccount";
import { public_resetPassword } from "@server/trpc/routings/public/resetPassword";
import { public_checkToken }    from "@server/trpc/routings/public/checkToken";
import { auth_getGuilds }       from "@server/trpc/routings/auth/getGuilds";
import { guild_chatCommands }   from "@server/trpc/routings/guild/chatCommands";
import {
	createContext,
	router
}                               from "@server/trpc/trpc";


const publicRouter = router( {
	checktoken: public_checkToken,
	validate: public_validate,
	login: public_login,
	register: public_createAccount,
	resetpassword: public_resetPassword
} );
const authRouter = router( {
	getguilds: auth_getGuilds
} );
const guildRouter = router( {
	validate: guild_validate,
	chatcommands: guild_chatCommands
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

export type PublicRouter = typeof publicRouter;
export type AuthRouter = typeof authRouter;
export type GuildRouter = typeof guildRouter;