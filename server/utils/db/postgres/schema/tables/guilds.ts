import {
	boolean,
	char,
	colJson,
	colTimestamp,
	integer,
	numeric,
	primaryKey,
	varchar
} from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';

export type ModRoles = {
	modRef: string;
	roleId: string;
};

export const scGuild = kbot2Schema.table('discord_guild', {
	guild_id: numeric('guild_id').primaryKey().notNull(),
	total_members: integer('total_members').notNull().default(0),
	guild_created: colTimestamp('guild_created').notNull().defaultNow(),
	image: varchar('image', { length: 1024 }).notNull().default(''),
	name: varchar('name', { length: 512 }).notNull().default(''),
	owner_id: numeric('owner_id').notNull().default('0'),
	active: boolean('active').notNull().default(true)
});

export const scGuildAdmins = kbot2Schema.table(
	'discord_guild_admins',
	{
		guild_id: numeric('guild_id')
			.notNull()
			.references(
				() => {
					return scGuild.guild_id;
				},
				{ onDelete: 'cascade' }
			),
		user_id: numeric('user_id').notNull()
	},
	(t) => {
		return {
			primary: primaryKey({ columns: [t.guild_id, t.user_id] })
		};
	}
);

export const scGuildConfiguration = kbot2Schema.table('discord_guild_configuration', {
	guild_id: numeric('guild_id')
		.primaryKey()
		.notNull()
		.references(
			() => {
				return scGuild.guild_id;
			},
			{ onDelete: 'cascade' }
		),
	changelog_suggestion_channel_id: numeric('changelog_suggestion_channel_id')
		.notNull()
		.default('0'),
	changelog_bug_channel_id: numeric('changelog_bug_channel_id').notNull().default('0'),
	changelog_announce_hidden_mods: boolean('changelog_announce_hidden_mods')
		.notNull()
		.default(false),
	changelog_forum_id: numeric('changelog_forum_id').notNull().default('0'),
	update_text_channel_id: numeric('update_text_channel_id').notNull().default('0'),
	default_ping_role: numeric('default_ping_role').notNull().default('0'),
	blacklisted_mods: colJson('blacklisted_mods').notNull().default([]),
	ficsit_user_ids: colJson('ficsit_user_ids').notNull().default([]),
	mod_roles_map: colJson('mod_roles_map').$type<ModRoles[]>().notNull().default([]),
	chat_command_prefix: char('chat_command_prefix', { length: 1 }).notNull().default('.')
});

export const scGuildPatreons = kbot2Schema.table(
	'discord_guild_patreons',
	{
		guild_id: numeric('guild_id')
			.notNull()
			.references(
				() => {
					return scGuild.guild_id;
				},
				{ onDelete: 'cascade' }
			),
		user_id: numeric('user_id').notNull()
	},
	(t) => {
		return {
			primary: primaryKey({ columns: [t.guild_id, t.user_id] })
		};
	}
);

export const scGuildPatreonSettings = kbot2Schema.table('discord_guild_patreon_settings', {
	guild_id: numeric('guild_id')
		.primaryKey()
		.notNull()
		.references(
			() => {
				return scGuild.guild_id;
			},
			{ onDelete: 'cascade' }
		),
	ping_roles: colJson('ping_roles').notNull().default([]),
	announcement_channel_id: numeric('announcement_channel_id').notNull().default('0'),
	changelog_forum: numeric('changelog_forum').notNull().default('0'),
	patreon_release_text: varchar('patreon_release_text', { length: 8196 }).notNull().default('0')
});
