import {
	boolean,
	colJson,
	colTimestamp,
	integer,
	primaryKey,
	text,
	varchar
} from '@kmods/drizzle-pg/pg-core';
import { ficsitAppSchema } from '../pgSchema';

export type LastVersion = {
	id: string;
	updated_at: moment.MomentInput;
	created_at: moment.MomentInput;
	changelog: string;
	hash: string;
	version: string;
	sml_version: string;
};

export const scModCache = ficsitAppSchema.table('mod_cache', {
	mod_id: varchar('mod_id', { length: 128 }).primaryKey().notNull(),
	mod_reference: varchar('mod_reference', { length: 128 }).notNull().unique(),
	name: varchar('name', { length: 128 }).notNull(),
	logo: varchar('logo', { length: 1024 }).notNull(),
	source_url: varchar('source_url', { length: 1024 }).notNull(),
	short_description: varchar('short_description', { length: 512 }).notNull(),
	views: integer('views').notNull().default(0),
	creator_id: varchar('creator_id', { length: 128 }).notNull(),
	downloads: integer('downloads').notNull().default(0),
	updated_at: colTimestamp('updated_at').notNull().defaultNow(),
	created_at: colTimestamp('created_at').notNull().defaultNow(),
	last_version_at: colTimestamp('last_version_at').notNull().defaultNow(),
	hidden: boolean('hidden').notNull().default(false),
	last_version_date: colTimestamp('last_version_date'),
	last_versions: colJson('last_versions')
		.notNull()
		.$type<{
			alpha?: LastVersion | null;
			beta?: LastVersion | null;
			release?: LastVersion | null;
		}>()
		.default({})
});

export const scModAuthors = ficsitAppSchema.table(
	'mod_authors',
	{
		mod_id: varchar('mod_id', { length: 128 }).notNull(),
		user_id: varchar('user_id', { length: 128 }).notNull(),
		role: varchar('role', { length: 32 }).notNull(),
		name: varchar('name', { length: 128 }).notNull()
	},
	(t) => {
		return {
			primary: primaryKey({ columns: [t.mod_id, t.user_id] })
		};
	}
);

export const scModVersions = ficsitAppSchema.table(
	'mod_versions',
	{
		mod_id: varchar('mod_id', { length: 128 }).notNull(),
		id: varchar('id', { length: 128 }).notNull(),
		created_at: colTimestamp('created_at').notNull().defaultNow(),
		updated_at: colTimestamp('updated_at').notNull().defaultNow(),
		changelog: text('changelog').notNull(),
		hash: varchar('hash', { length: 64 }).notNull(),
		version: varchar('version', { length: 64 }).notNull(),
		sml_version: varchar('sml_version', { length: 64 }).notNull()
	},
	(t) => {
		return {
			primary: primaryKey({ columns: [t.mod_id, t.id] })
		};
	}
);
