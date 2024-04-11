import { colJson, numeric, uuid } from '@kmods/drizzle-pg/pg-core';
import { dbSchema } from '../pgSchema';
import { scGuild } from './guilds';

export type ReactionRole = {
	emoji: string;
	roleIds: string[];
};

export const scReactionRoles = dbSchema.table('discord_guild_reaction_roles', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	guild_id: numeric('guild_id')
		.notNull()
		.references(
			() => {
				return scGuild.guild_id;
			},
			{ onDelete: 'cascade' }
		),
	channel_id: numeric('channel_id').notNull(),
	message_id: numeric('message_id').notNull(),
	reactions: colJson('reactions').notNull().$type<ReactionRole[]>().default([])
});
