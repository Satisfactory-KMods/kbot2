import * as core        from "express-serve-static-core";
import {
	IRequestBody,
	IRequestGuildBody
}                       from "@shared/types/API_Request";
import { Request }      from "express";
import { DiscordGuild } from "@server/lib/bot/guild.lib";

export type TERes<T extends IRequestBody = IRequestBody<any>> = Request<
	core.ParamsDictionary,
	any,
	T
>

export type TEResG<T extends IRequestGuildBody = IRequestGuildBody<any>> = Request<
	core.ParamsDictionary,
	any,
	T & {
	guild : DiscordGuild
}
>