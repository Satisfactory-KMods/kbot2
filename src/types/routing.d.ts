import { IMO_Guild } from "@shared/types/MongoDB";

export interface ILoaderDataBase {
	loggedIn : boolean;
}

export interface ILoaderGuild extends ILoaderDataBase {
	guildData : IMO_Guild | null;
}