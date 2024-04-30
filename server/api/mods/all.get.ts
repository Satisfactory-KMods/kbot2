import { and, desc, eq, isNull, sql } from '@kmods/drizzle-pg';
import { getColumns, pgAggJsonBuildObject, pgCase, pgNull } from '@kmods/drizzle-pg/pg-core';
import { z } from 'zod';
import { db, scModAuthors, scModCache, scModVersions } from '~/server/utils/db/postgres/pg';

export default defineEventHandler(async (event) => {
	const showHidden = z
		.array(z.string())
		.or(z.string())
		.or(z.boolean())
		.optional()
		.default(false)
		.transform((v) => {
			if (typeof v === 'string') {
				return v === 'true';
			}
			if (typeof v === 'boolean') {
				return v;
			}
			return !!v;
		})
		.parse(getQuery(event).showHidden);

	const lastModVersion = db
		.select()
		.from(scModVersions)
		.orderBy(desc(scModVersions.version))
		.where(eq(scModCache.mod_id, scModVersions.mod_id))
		.limit(1)
		.as('last_version');

	return await db
		.selectDistinctOn([scModCache.mod_id], {
			...getColumns(scModCache),
			last_versions: pgCase(
				isNull(lastModVersion.mod_id),
				pgNull(),
				pgAggJsonBuildObject(lastModVersion)
			)
		})
		.from(scModAuthors)
		.innerJoin(scModCache, ['mod_id'])
		.leftJoin(lastModVersion, sql`true`, { lateral: true })
		.where(and(showHidden ? undefined : eq(scModCache.hidden, false)))
		.then((mods) => {
			return {
				total: mods.length,
				mods
			};
		});
});
