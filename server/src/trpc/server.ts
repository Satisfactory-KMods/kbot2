import * as trpc                from "@trpc/server";
import * as trpcExpress         from "@trpc/server/adapters/express";
import { BC }                   from "@server/lib/System.Lib";
import { User }                 from "@shared/class/User.Class";
import { DiscordGuild }         from "@server/lib/bot/guild.lib";
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

interface Context {
	guildId? : string,
	token? : string,
	userClass? : User,
	guild? : DiscordGuild
}

const createContext = async( {
	req
} : trpcExpress.CreateExpressContextOptions ) => {
	const ctx : Context = {
		token: req.body.JsonWebToken,
		userClass: req.body.UserClass,
		guildId: req.body.guild?.guildId,
		guild: req.body.guild
	};

	return ctx;
};

const t = trpc.initTRPC.context<Context>().create( {
	isServer: true,
	isDev: SystemLib.IsDevMode
} );

export type tRPC = typeof t;


const publicRouter = t.router( {
	checktoken: public_checkToken( t ),
	validate: public_validate( t ),
	login: public_login( t ),
	register: public_createAccount( t ),
	resetpassword: public_resetPassword( t )
} );
const authRouter = t.router( {
	getguilds: auth_getGuilds( t )
} );
const guildRouter = t.router( {
	validate: guild_validate( t ),
	chatcommands: guild_chatCommands( t )
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