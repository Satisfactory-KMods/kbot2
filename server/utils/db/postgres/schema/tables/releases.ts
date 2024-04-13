import { boolean, colDate, uuid, varchar } from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';
import { defaultGuildFields } from './guilds';

export const scReleases = kbot2Schema.table('discord_guild_releases', {
	...defaultGuildFields,
	file: uuid('file').notNull().defaultRandom().primaryKey(),
	patreon: boolean('patreon').notNull().default(false),
	expires: colDate('expires'),
	mod_ref: varchar('mod_ref', { length: 256 }).notNull()
});
