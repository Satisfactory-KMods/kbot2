import { TaskManagerClass }         from "@server/tasks/TaskManager";
import http                         from "http";
import { SystemLib_Class }          from "@server/lib/System.Lib";
import core                         from "express";
import { Client }                   from "discord.js";
import { DiscordGuildManagerClass } from "@server/lib/bot/guild.lib";
import { MO_Mod }                   from "@shared/types/MongoDB";

export declare global {
	var modCache : MO_Mod[];
	var validDownloadUrls : { downloadId : string, file : string, expiresAt : Date }[];
	var Cached_DiscordGuildManager : DiscordGuildManagerClass;
	var SystemLib : SystemLib_Class;
	var Api : core.Express;
	var HttpServer : http.Server<
		typeof http.IncomingMessage,
		typeof http.ServerResponse
	>;
	var TaskManager : TaskManagerClass;
	var __BaseDir : string;
	var __RootDir : string;
	var __MountDir : string;
	var __LogFile : string;
	var DiscordBot : Client<true>;

}
