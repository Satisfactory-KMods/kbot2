import { SystemLib_Class } from '@server/lib/System.Lib';
import { DiscordGuildManagerClass } from '@server/lib/bot/guild.lib';
import { TaskManagerClass } from '@server/tasks/TaskManager';
import { MO_Mod } from '@shared/types/MongoDB';
import { Client } from 'discord.js';
import core from 'express';
import http from 'http';

export declare global {
	var modCache: MO_Mod[];
	var validDownloadUrls: { downloadId: string; file: string; expiresAt: Date }[];
	var Cached_DiscordGuildManager: DiscordGuildManagerClass;
	var SystemLib: SystemLib_Class;
	var Api: core.Express;
	var HttpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
	var TaskManager: TaskManagerClass;
	var __BaseDir: string;
	var __RootDir: string;
	var __MountDir: string;
	var __LogFile: string;
	var DiscordBot: Client<true>;
}
