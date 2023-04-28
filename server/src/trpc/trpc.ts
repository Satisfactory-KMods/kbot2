import * as trpc        from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { User }         from "@shared/class/User.Class";
import { DiscordGuild } from "@server/lib/bot/guild.lib";
import z                from "zod";
import { rGuildId }     from "@server/zod/refineGuildId";

export interface Context {
	guildId? : string,
	token? : string,
	userClass? : User,
	guild? : DiscordGuild
}

export const createContext = async( {
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


export const router = t.router;
export const publicProcedure = t.procedure;
export const guildProcedure = t.procedure.input( z.object( { guildId: z.string().refine( rGuildId.c, rGuildId.m ) } ) );