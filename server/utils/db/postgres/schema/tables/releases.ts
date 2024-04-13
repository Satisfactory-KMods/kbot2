import { boolean, colDate, index, uuid, varchar } from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';
import { defaultGuildFields } from './guilds';

export const scReleases = kbot2Schema.table(
	'discord_guild_releases',
	{
		...defaultGuildFields,
		file: uuid('file').notNull().defaultRandom().primaryKey(),
		patreon: boolean('patreon').notNull().default(false),
		expires: colDate('expires'),
		mod_reference: varchar('mod_reference', { length: 256 }).notNull()
	},
	(t) => {
		return {
			guild_id_idx: index().on(t.guild_id),
			mod_reference_idx: index().on(t.mod_reference)
		};
	}
);
