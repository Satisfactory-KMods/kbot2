import { and, eq } from '@kmods/drizzle-pg';
import { pgAggJsonBuildObject } from '@kmods/drizzle-pg/pg-core';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db, scDownloadFiles, scDownloads, scModCache } from '~/server/utils/db/postgres/pg';

export default defineEventHandler(async (event) => {
	const { guildId } = await getRouteBaseParams(event, true);
	const id = zodNumeric(getRouterParam(event, 'id'), 'Preview Id must be numeric');

	const data = await db
		.select({
			download: pgAggJsonBuildObject(scDownloads, { aggregate: true, index: 0 }),
			files: pgAggJsonBuildObject(scDownloadFiles, { aggregate: true }),
			mod: pgAggJsonBuildObject(scModCache, { aggregate: true, index: 0 })
		})
		.from(scDownloads)
		.innerJoin(scDownloadFiles, eq(scDownloadFiles.download_id, scDownloads.id))
		.innerJoin(scModCache, ['mod_reference'])
		.where(and(eq(scDownloads.id, id), eq(scDownloads.guild_id, guildId)))
		.groupBy(scDownloads.id)
		.firstOrThrow('File not found');

	return data;
});
