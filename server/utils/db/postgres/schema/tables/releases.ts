import { boolean, colDate, numeric, uuid, varchar } from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';
import { scGuild } from './guilds';

export const scReleases = kbot2Schema.table('discord_guild_releases', {
	guild_id: numeric('guild_id')
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
	mod_ref: varchar('mod_ref', { length: 256 }).notNull()
});
