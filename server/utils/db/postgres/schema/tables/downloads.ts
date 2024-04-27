import {
	bigint,
	bigserial,
	boolean,
	colTimestamp,
	index,
	text,
	unique,
	varchar
} from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';
import { accounts } from './auth';
import { defaultGuildFields } from './guilds';

export const scDownloads = kbot2Schema.table(
	'downloads',
	{
		...defaultGuildFields,
		id: bigserial('id').primaryKey().notNull(),
		version: varchar('version', { length: 64 }).notNull(),
		mod_reference: varchar('mod_reference', { length: 128 }).notNull(),
		patreon: boolean('patreon').notNull().default(false),
		uploaded_by: bigint('uploaded_by')
			.references(() => {
				return accounts.providerAccountId;
			})
			.notNull(),
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

export const scDownloadFiles = kbot2Schema.table(
	'download_files',
	{
		id: bigserial('id').primaryKey().notNull(),
		download_id: bigserial('download_id')
			.references(
				() => {
					return scDownloads.id;
				},
				{ onDelete: 'cascade' }
			)
			.notNull(),
		name: varchar('name', { length: 512 }).notNull(),
		mime: varchar('mime', { length: 64 }).notNull(),
		size: bigint('size', { mode: 'number' }).notNull().default(0)
	},
	(t) => {
		return {
			index: index().on(t.download_id)
		};
	}
);
