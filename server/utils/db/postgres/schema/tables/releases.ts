import { boolean, colDate, uuid, varchar } from '@kmods/drizzle-pg/pg-core';
import { dbSchema } from '../pgSchema';
import { scGuild } from './guilds';

export const scReleases = dbSchema.table('discord_guild_releases', {
	guild_id: varchar('guild_id', { length: 512 })
		.primaryKey()
		.notNull()
		.references(
			() => {
				return scGuild.guild_id;
			},
			{ onDelete: 'cascade' }
		),
	file: uuid('file').notNull().defaultRandom(),
	patreon: boolean('patreon').notNull().default(false),
	expires: colDate('expires'),
	mod_ref: varchar('mod_ref', { length: 512 }).notNull()
});
