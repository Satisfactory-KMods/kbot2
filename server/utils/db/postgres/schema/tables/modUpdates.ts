import { boolean, colTimestamp, index, primaryKey, varchar } from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';
import { defaultGuildFields } from './guilds';

export const scModUpdates = kbot2Schema.table(
	'mod_updates',
	{
		...defaultGuildFields,
		mod_reference: varchar('mod_reference', { length: 128 }).notNull(),
		version: varchar('version', { length: 64 }).notNull(),
		announced: boolean('announced').notNull().default(false),
		updated_at: colTimestamp('updated_at').notNull().defaultNow(),
		announced_at: colTimestamp('announced_at').notNull().defaultNow()
	},
	(t) => {
		return {
			mod_index: index().on(t.mod_reference),
			primary: primaryKey({ columns: [t.guild_id, t.mod_reference] })
		};
	}
);
