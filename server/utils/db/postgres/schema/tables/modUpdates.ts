import { boolean, colTimestamp, numeric, primaryKey, varchar } from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';
import { scGuild } from './guilds';

export const scModUpdates = kbot2Schema.table(
	'mod_updates',
	{
		guild_id: numeric('guild_id')
			.notNull()
			.references(
				() => {
					return scGuild.guild_id;
				},
				{ onDelete: 'cascade' }
			),
		mod_reference: varchar('mod_reference', { length: 128 }).notNull(),
		version: varchar('version', { length: 64 }).notNull(),
		announced: boolean('announced').notNull().default(false),
		updated_at: colTimestamp('updated_at').notNull().defaultNow()
	},
	(t) => {
		return {
			primary: primaryKey({ columns: [t.guild_id, t.mod_reference] })
		};
	}
);
