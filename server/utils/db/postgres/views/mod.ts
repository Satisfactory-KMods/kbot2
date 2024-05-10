import { desc, eq, isNull, sql } from '@kmods/drizzle-pg';
import type { InferDynamic } from '@kmods/drizzle-pg/pg-core';
import { pgAggJsonBuildObject, pgAnyValue, pgCase, pgNull } from '@kmods/drizzle-pg/pg-core';
import { ficsitAppSchema, scModAuthors, scModCache, scModVersions } from '../schema';

export const viewMods = ficsitAppSchema.view('view_mods').as((db) => {
	const lastModVersion = db
		.select()
		.from(scModVersions)
		.orderBy(desc(scModVersions.updated_at))
		.where(eq(scModCache.mod_id, scModVersions.mod_id))
		.limit(1)
		.as('last_version');

	return db
		.select({
			mod_id: pgAnyValue(scModCache.mod_id).as('mod_id'),
			mod_reference: pgAnyValue(scModCache.mod_reference).as('mod_reference'),
			name: pgAnyValue(scModCache.name).as('name'),
			logo: pgAnyValue(scModCache.logo).as('logo'),
			source_url: pgAnyValue(scModCache.source_url).as('source_url'),
			short_description: pgAnyValue(scModCache.short_description).as('short_description'),
			views: pgAnyValue(scModCache.views).as('views'),
			creator_id: pgAnyValue(scModCache.creator_id).as('creator_id'),
			downloads: pgAnyValue(scModCache.downloads).as('downloads'),
			updated_at: pgAnyValue(scModCache.updated_at).as('updated_at'),
			created_at: pgAnyValue(scModCache.created_at).as('created_at'),
			last_version_at: pgAnyValue(scModCache.last_version_at).as('last_version_at'),
			hidden: pgAnyValue(scModCache.hidden).as('hidden'),
			last_version_date: pgAnyValue(scModCache.last_version_date).as('last_version_date'),
			last_versions: pgAnyValue(scModCache.last_versions).as('last_versions'),
			last_version: pgCase(
				isNull(pgAnyValue(lastModVersion.mod_id)),
				pgNull(),
				pgAggJsonBuildObject(lastModVersion, { aggregate: true, index: 0 })
			).as('last_version'),
			authors: pgCase(
				isNull(pgAnyValue(scModAuthors.mod_id)),
				sql<InferDynamic<typeof scModAuthors>[]>`'[]'::json`,
				pgAggJsonBuildObject(scModAuthors, { aggregate: true })
			).as('authors'),
			versions: pgCase(
				isNull(pgAnyValue(scModVersions.mod_id)),
				sql<InferDynamic<typeof scModVersions>[]>`'[]'::json`,
				pgAggJsonBuildObject(scModVersions, { aggregate: true })
			).as('versions')
		})
		.from(scModCache)
		.leftJoin(scModAuthors, ['mod_id'])
		.leftJoin(scModVersions, ['mod_id'])
		.leftJoin(lastModVersion, sql`true`, { lateral: true })
		.groupBy(scModCache.mod_id);
});
