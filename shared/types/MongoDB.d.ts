import { ERoles }            from "@shared/Enum/ERoles";
import { IDiscordGuildData } from "@shared/types/discord";

export interface IMongoDB {
	_id? : string,
	__v? : number,
	createdAt? : Date | string, // string on client side
	updatedAt? : Date | string // string on client side
}

export interface IGuildDB extends IMongoDB {
	guildId : string;
}

export interface IMO_Guild extends IGuildDB {
	isInGuild : boolean,
	accountIds : string[]
	options : IMO_GuildOptions,
	guildData : IDiscordGuildData
}

export interface IMO_RolePingRule {
	roleId : string;
	modRefs : string[];
}

export interface IMO_GuildOptions extends IMongoDB {
	chatCommandPrefix : string,
	changelogForumId : string,
	updateTextChannelId : string,
	RolePingRules : IMO_RolePingRule[],
}

export interface IMO_TextReactions extends IGuildDB {
	command : string,
	alias : string[],
	reactionText : string,
	autoReactionMatches : string[]
}

export interface IMO_UserAccount extends IMongoDB {
	username : string,
	hash? : string,
	salt? : string,
	role : ERoles,
	discordId : string
}

export interface IMO_UserAccountToken extends IMongoDB {
	userid : string,
	token : string,
	expire : Date
}

export interface IMO_RegisterToken extends IGuildDB {
	userId : string,
	token : string,
	expire : Date,
	isPasswordResetToken : boolean
}


export interface IMO_Mod extends IMongoDB {
	id : string;
	mod_reference : string;
	name : string;
	logo : string;
	short_description : string;
	source_url : string;
	creator_id : string;
	views : number;
	downloads : number;
	updated_at : Date;
	created_at : Date;
	last_version_date : Date;
	hidden : boolean;
	authors : IAuthor[];
	latestVersions : ILatestVersions;
}

export interface IAuthor {
	user_id : string;
	mod_id : string;
	role : string;
	user : IUser;
}

export interface IUser {
	id : string;
	username : string;
}

export interface ILatestVersions {
	alpha : IVersion | undefined;
	beta : IVersion | undefined;
	release : IVersion | undefined;
}

export interface IVersion {
	version : string;
	sml_version : string;
	id : string;
}