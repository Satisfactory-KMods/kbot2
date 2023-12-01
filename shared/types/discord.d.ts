export interface DiscordGuildData {
	id: string;
	name: string;
	icon: null | string;
	features: string[];
	commands: string[];
	members: string[];
	channels: string[];
	bans: string[];
	roles: string[];
	stageInstances: [];
	invites: [];
	scheduledEvents: [];
	autoModerationRules: [];
	shardId: number;
	splash: null | string;
	banner: null | string;
	description: null | string;
	verificationLevel: 1;
	vanityURLCode: null | string;
	nsfwLevel: number;
	premiumSubscriptionCount: number;
	discoverySplash: null | string;
	memberCount: number;
	large: boolean;
	premiumProgressBarEnabled: boolean;
	applicationId: null | string;
	afkTimeout: number;
	afkChannelId: null | string;
	systemChannelId: string;
	premiumTier: number;
	widgetEnabled: null | string;
	widgetChannelId: null | string;
	explicitContentFilter: number;
	mfaLevel: number;
	joinedTimestamp: string;
	defaultMessageNotifications: number;
	systemChannelFlags: number;
	maximumMembers: number;
	maximumPresences: null | string;
	maxVideoChannelUsers: number;
	maxStageVideoChannelUsers: number;
	approximateMemberCount: null | string;
	approximatePresenceCount: null | string;
	vanityURLUses: null | string;
	rulesChannelId: null | string;
	publicUpdatesChannelId: null | string;
	preferredLocale: string;
	ownerId: string;
	emojis: string[];
	stickers: string[];
	createdTimestamp: number;
	nameAcronym: string;
	iconURL: null | string;
	splashURL: null | string;
	discoverySplashURL: null | string;
	bannerURL: null | string;
}

export interface DiscordRole {
	guild: string;
	icon: any;
	unicodeEmoji: any;
	id: string;
	name: string;
	color: number;
	hoist: boolean;
	rawPosition: number;
	permissions: string;
	managed: boolean;
	mentionable: boolean;
	tags: any;
	createdTimestamp: number;
}

export interface DiscordMessage {
	content: string;
}

export interface DiscordTextChannel {
	type: number;
	guild: string;
	guildId: string;
	parentId: string;
	permissionOverwrites: string[];
	messages: any[];
	threads: any[];
	nsfw: boolean;
	flags: number;
	id: string;
	name: string;
	rawPosition: number;
	topic: any;
	lastMessageId: string;
	rateLimitPerUser: number;
	createdTimestamp: number;
}

export interface DiscordVoiceChannel extends DiscordTextChannel {
	todo: true;
}

export interface DiscordForumChannel extends Omit<DiscordTextChannel, 'messages' | 'rateLimitPerUser' | 'lastMessageId'> {
	threads: string[];
	flags: number;
	availableTags: AvailableTag[];
	defaultReactionEmoji: any;
	defaultThreadRateLimitPerUser: number;
	rateLimitPerUser: number;
	defaultAutoArchiveDuration: number;
	defaultSortOrder: any;
	defaultForumLayout: number;
	createdTimestamp: number;
}

export interface AvailableTag {
	id: string;
	name: string;
	moderated: boolean;
	emoji?: Emoji;
}

export interface Emoji {
	id: any;
	name: string;
}
