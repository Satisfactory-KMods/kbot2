import {
	boolean,
	colTimestamp,
	index,
	numeric,
	text,
	unique,
	uuid,
	varchar
} from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';
import { scGuild } from './guilds';

export const scDownloads = kbot2Schema.table(
	'downloads',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		version: varchar('version', { length: 64 }).notNull(),
		guild_id: numeric('guild_id')
			.notNull()
			.references(
				() => {
					return scGuild.guild_id;
				},
				{ onDelete: 'cascade' }
			),
		mod_reference: varchar('mod_reference', { length: 128 }).notNull(),
		patreon: boolean('patreon').notNull().default(false),
		uploaded_by: numeric('uploaded_by').notNull(),
		uploaded_at: colTimestamp('uploaded_at').notNull().defaultNow(),
		changelog: text('changelog').notNull()
	},
	(t) => {
		return {
			modRefIndex: index().on(t.mod_reference),
			unique: unique().on(t.version, t.mod_reference)
		};
	}
);
