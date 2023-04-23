import { TaskManagerClass }         from "@server/tasks/TaskManager";
import {
	IEmitEvents,
	IListenEvents
}                                   from "@shared/types/SocketIO";
import { Server }                   from "socket.io";
import http                         from "http";
import { SystemLib_Class }          from "@server/lib/System.Lib";
import core                         from "express";
import { Client }                   from "discord.js";
import { DiscordGuildManagerClass } from "@server/lib/bot/guild.lib";

export declare global {
	var Cached_DiscordGuildManager : DiscordGuildManagerClass;
	var SystemLib : SystemLib_Class;
	var Api : core.Express;
	var Router : core.Router;
	var HttpServer : http.Server<
		typeof http.IncomingMessage,
		typeof http.ServerResponse
	>;
	var SocketIO : Server<IListenEvents, IEmitEvents>;
	var TaskManager : TaskManagerClass;
	var __BaseDir : string;
	var __RootDir : string;
	var __MountDir : string;
	var __LogFile : string;
	var DiscordBot : Client<true>;

}
