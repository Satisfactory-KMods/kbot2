import { ERoles }           from "@shared/Enum/ERoles";
import { DiscordGuildData } from "@shared/types/discord";

export interface MongoDBSchema {
	_id? : string,
	__v? : number,
	createdAt? : Date | string, // string on client side
	updatedAt? : Date | string // string on client side
}

export interface GuildDB extends MongoDBSchema {
	guildId : string;
}

export interface MO_Guild extends GuildDB {
	isInGuild : boolean,
	accountIds : string[]
	options : MO_GuildOptions,
	guildData : DiscordGuildData,
	patreonOptions : MO_PatreonOptions
}

export interface MO_RolePingRule {
	roleId : string;
	modRefs : string[];
}

export interface ModToRole {
	modRef : string,
	roleId : string
}

export interface MO_GuildOptions extends MongoDBSchema {
	modToRole : ModToRole[];
	suggestionChannelId : string;
	bugChannelId : string;
	modsUpdateAnnouncement : boolean;
	modsAnnounceHiddenMods : boolean;
	blacklistedMods : string[],
	ficsitUserIds : string[],
	defaultPingRole : string,
	chatCommandPrefix : string,
	changelogForumId : string,
	updateTextChannelId : string,
	RolePingRules : MO_RolePingRule[],
}


export interface MO_PatreonOptions extends MongoDBSchema {
	pingRoles : string[];
	announcementChannel : string;
	changelogForum : string;
	patreonReleaseText : string;
}

export interface ReactionMatchRule {
	matchString : string;
	similarity : boolean;
}

export interface MO_ChatCommands extends GuildDB {
	command : string,
	alias : string[],
	reactionText : string,
	autoReactionMatches : ReactionMatchRule[]
}

export interface MO_UserAccount extends MongoDBSchema {
	username : string,
	hash? : string,
	salt? : string,
	role : ERoles,
	discordId : string
}

export interface MO_UserAccountToken extends MongoDBSchema {
	userid : string,
	token : string,
	expire : Date
}

export interface MO_ModUpdate extends GuildDB {
	modRef : string,
	hash : string,
	lastUpdate : Date,
	lastMessageId : string
}

export interface MO_RegisterToken extends GuildDB {
	userId : string,
	token : string,
	expire : Date,
	isPasswordResetToken : boolean
}

export interface MO_ReactionRoleMap {
	emoji : string,
	roleIds : string[]
}

export interface MO_ReactionRoles extends GuildDB {
	channelId : string,
	messageId : string,
	reactions : MO_ReactionRoleMap[]
}

export interface MO_Patreon extends GuildDB {
	discordId : string,
	token : string
}

export interface MO_PatreonReleases extends GuildDB {
	changelogContent : string,
	modRef : string,
	version : string
}


export interface MO_Mod extends MongoDBSchema {
	versions : ModVersion[],
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
	authors : Author[];
	latestVersions : LatestVersions;
}

export interface Author {
	user_id : string;
	mod_id : string;
	role : string;
	user : UserSchema;
}

export interface UserSchema {
	id : string;
	username : string;
}

export interface LatestVersions {
	alpha : ModVersion | undefined;
	beta : ModVersion | undefined;
	release : ModVersion | undefined;
}

export interface ModVersion {
	version : string;
	sml_version : string;
	id : string;
	created_at : Date,
	updated_at : Date,
	changelog : string,
	hash : string
}