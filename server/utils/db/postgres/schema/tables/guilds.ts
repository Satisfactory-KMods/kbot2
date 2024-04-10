import { boolean, char, colJson, primaryKey, varchar } from '@kmods/drizzle-pg/pg-core';
import { dbSchema } from '../pgSchema';

export type ModRoles = {
	modRef: string;
	roleId: string;
};

export const scGuild = dbSchema.table('discord_guild', {
	guild_id: varchar('guild_id', { length: 512 }).primaryKey().notNull(),
	active: boolean('active').notNull().default(true)
});

export const scGuildAdmins = dbSchema.table(
	'discord_guild_admins',
	{
		guild_id: varchar('guild_id', { length: 512 })
			.notNull()
			.references(
				() => {
					return scGuild.guild_id;
				},
				{ onDelete: 'cascade' }
			),
		user_id: varchar('user_id', { length: 512 }).notNull()
	},
	(t) => {
		return {
			primary: primaryKey({ columns: [t.guild_id, t.user_id] })
		};
	}
);

export const scGuildConfiguration = dbSchema.table('discord_guild_configuration', {
	guild_id: varchar('guild_id', { length: 512 })
		.primaryKey()
		.notNull()
		.references(
			() => {
				return scGuild.guild_id;
			},
			{ onDelete: 'cascade' }
		),
	changelog_suggestion_channel_id: varchar('changelog_suggestion_channel_id', { length: 512 }),
	changelog_bug_channel_id: varchar('changelog_bug_channel_id', { length: 512 })
		.notNull()
		.default('0'),
	changelog_announce_hidden_mods: boolean('changelog_announce_hidden_mods')
		.notNull()
		.default(false),
	changelog_forum_id: varchar('changelog_forum_id', { length: 512 }).notNull().default('0'),
	update_text_channel_id: varchar('update_text_channel_id', { length: 512 })
		.notNull()
		.default('0'),
	default_ping_role: varchar('default_ping_role', { length: 512 }).notNull().default('0'),
	blacklisted_mods: colJson('blacklisted_mods').notNull().default([]),
	ficsit_user_ids: colJson('ficsit_user_ids').notNull().default([]),
	mod_roles_map: colJson('mod_roles_map').$type<ModRoles[]>().notNull().default([]),
	chat_command_prefix: char('chat_command_prefix', { length: 1 }).notNull().default('.')
});

export const scGuildPatreons = dbSchema.table(
	'discord_guild_patreons',
	{
		guild_id: varchar('guild_id', { length: 512 })
			.notNull()
			.references(
				() => {
					return scGuild.guild_id;
				},
				{ onDelete: 'cascade' }
			),
		user_id: varchar('user_id', { length: 512 }).notNull()
	},
	(t) => {
		return {
			primary: primaryKey({ columns: [t.guild_id, t.user_id] })
		};
	}
);

export const scGuildPatreonSettings = dbSchema.table('discord_guild_patreon_settings', {
	guild_id: varchar('guild_id', { length: 512 })
		.primaryKey()
		.notNull()
		.references(
			() => {
				return scGuild.guild_id;
			},
			{ onDelete: 'cascade' }
		),
	ping_roles: colJson('ping_roles').notNull().default([]),
	announcement_channel_id: varchar('announcement_channel_id', { length: 512 })
		.notNull()
		.default('0'),
	changelog_forum: varchar('changelog_forum', { length: 512 }).notNull().default('0'),
	patreon_release_text: varchar('patreon_release_text', { length: 512 }).notNull().default('0')
});
