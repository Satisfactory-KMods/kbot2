import { colJson, numeric, primaryKey, varchar } from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';
import { defaultGuildFields } from './guilds';

export type ReactionRole = {
	emoji: string;
	roleIds: string[];
};

export const scReactionRoles = kbot2Schema.table('discord_guild_reaction_roles_message', {
	message_id: numeric('message_id').notNull().primaryKey(),
	...defaultGuildFields,
	channel_id: numeric('channel_id').notNull(),
	name: varchar('name', { length: 128 }).notNull().default('')
});

export const scReactionRolesEmojies = kbot2Schema.table(
	'discord_guild_reaction_roles_message_emojies',
	{
		message_id: numeric('message_id').references(
			() => {
				return scReactionRoles.message_id;
			},
			{ onDelete: 'cascade' }
		),
		emoji: varchar('emoji', { length: 64 }).notNull(),
		role_ids: colJson('role_ids').notNull().$type<string[]>().default([])
	},
	(t) => {
		return {
			primary: primaryKey({ name: 'pk_message_emojies', columns: [t.message_id, t.emoji] })
		};
	}
);
