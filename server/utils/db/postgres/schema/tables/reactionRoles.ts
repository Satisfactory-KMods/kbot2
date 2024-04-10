import { colJson, uuid, varchar } from '@kmods/drizzle-pg/pg-core';
import { dbSchema } from '../pgSchema';
import { scGuild } from './guilds';

export type ReactionRole = {
	emoji: string;
	roleIds: string[];
};

export const scReactionRoles = dbSchema.table('discord_guild_reaction_roles', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	guild_id: varchar('guild_id', { length: 512 })
		.notNull()
		.references(
			() => {
				return scGuild.guild_id;
			},
			{ onDelete: 'cascade' }
		),
	channel_id: varchar('channel_id', { length: 512 }).notNull(),
	message_id: varchar('message_id', { length: 512 }).notNull(),
	reactions: colJson('reactions').notNull().$type<ReactionRole[]>().default([])
});
