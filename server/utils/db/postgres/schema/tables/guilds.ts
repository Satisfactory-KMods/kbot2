import {
	bigint,
	boolean,
	char,
	colJson,
	colTimestamp,
	index,
	integer,
	primaryKey,
	unique,
	varchar
} from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';

export type ModRoles = {
	modRef: string;
	roleId: string;
};

export const defaultGuildFields = {
	guild_id: bigint('guild_id')
		.notNull()
		.references(
			() => {
				return scGuild.guild_id;
			},
			{ onDelete: 'cascade' }
		)
} as const;

export const scGuild = kbot2Schema.table('discord_guild', {
	guild_id: bigint('guild_id').primaryKey().notNull(),
	total_members: integer('total_members').notNull().default(0),
	guild_created: colTimestamp('guild_created').notNull().defaultNow(),
	image: varchar('image', { length: 1024 }).notNull().default(''),
	name: varchar('name', { length: 512 }).notNull().default(''),
	owner_id: bigint('owner_id').notNull().default('0'),
	active: boolean('active').notNull().default(true)
});

export const scGuildAdmins = kbot2Schema.table(
	'discord_guild_admins',
	{
		...defaultGuildFields,
		user_id: bigint('user_id').notNull()
	},
	(t) => {
		return {
			primary: primaryKey({ columns: [t.guild_id, t.user_id] })
		};
	}
);

export const scGuildConfiguration = kbot2Schema.table(
	'discord_guild_configuration',
	{
		...defaultGuildFields,
		changelog_suggestion_channel_id: bigint('changelog_suggestion_channel_id')
			.notNull()
			.default('0'),
		changelog_bug_channel_id: bigint('changelog_bug_channel_id').notNull().default('0'),
		changelog_announce_hidden_mods: boolean('changelog_announce_hidden_mods')
			.notNull()
			.default(false),
		changelog_forum_id: bigint('changelog_forum_id').notNull().default('0'),
		update_text_channel_id: bigint('update_text_channel_id').notNull().default('0'),
		default_ping_role: bigint('default_ping_role').notNull().default('0'),
		chat_command_prefix: char('chat_command_prefix', { length: 1 }).notNull().default('.'),
		patreon_ping_roles: colJson('patreon_ping_roles').notNull().$type<string[]>().default([]),
		patreon_release_text: varchar('patreon_release_text', { length: 8196 })
			.notNull()
			.default('0'),
		patreon_announcement_channel_id: bigint('patreon_announcement_channel_id')
			.notNull()
			.default('0'),
		patreon_changelog_forum: bigint('patreon_changelog_forum').notNull().default('0'),
		public_ping_roles: colJson('public_ping_roles').notNull().$type<string[]>().default([]),
		public_announcement_channel_id: bigint('public_announcement_channel_id')
			.notNull()
			.default('0'),
		public_changelog_forum: bigint('public_changelog_forum').notNull().default('0'),
		public_release_text: varchar('public_release_text', { length: 8196 }).notNull().default('0')
	},
	(t) => {
		return {
			primary: primaryKey({ columns: [t.guild_id] })
		};
	}
);

export const scGuildConfigurationModRoles = kbot2Schema.table(
	'discord_guild_configuration_mod_roles',
	{
		...defaultGuildFields,
		mod_reference: bigint('mod_reference').notNull(),
		role_id: bigint('role_id').notNull()
	},
	(t) => {
		return {
			primary: primaryKey({ columns: [t.guild_id, t.mod_reference] }),
			unique: unique().on(t.mod_reference, t.role_id),
			mod_index: index().on(t.mod_reference),
			role_index: index().on(t.role_id)
		};
	}
);

export const scGuildConfigurationBlacklistedMods = kbot2Schema.table(
	'discord_guild_configuration_blacklisted_mods',
	{
		...defaultGuildFields,
		mod_reference: varchar('mod_reference', { length: 128 }).notNull()
	},
	(t) => {
		return {
			mod_index: index().on(t.mod_reference),
			primary: primaryKey({ columns: [t.guild_id, t.mod_reference] })
		};
	}
);

export const scGuildConfigurationFicsitUserIds = kbot2Schema.table(
	'discord_guild_configuration_ficsit_user_ids',
	{
		...defaultGuildFields,
		ficsit_user_id: varchar('ficsit_user_id', { length: 32 }).notNull()
	},
	(t) => {
		return {
			ficsit_user_id_index: index().on(t.ficsit_user_id),
			primary: primaryKey({ columns: [t.guild_id, t.ficsit_user_id] })
		};
	}
);

export const scGuildPatreons = kbot2Schema.table(
	'discord_guild_patreons',
	{
		...defaultGuildFields,
		user_id: bigint('user_id').notNull()
	},
	(t) => {
		return {
			user_id_index: index().on(t.user_id),
			primary: primaryKey({ columns: [t.guild_id, t.user_id] })
		};
	}
);
