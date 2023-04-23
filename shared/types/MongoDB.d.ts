import { ERoles }            from "@shared/Enum/ERoles";
import { IDiscordGuildData } from "@shared/types/discord";

export interface IMongoDB {
	_id? : string,
	__v? : number,
	createdAt? : Date | string, // string on client side
	updatedAt? : Date | string // string on client side
}

export interface IGuildDB {
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
	guilds : string[],
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
	expire : Date
}
