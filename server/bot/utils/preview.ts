import { and, count, eq } from '@kmods/drizzle-pg';
import { getColumns, pgAggJsonBuildObject } from '@kmods/drizzle-pg/pg-core';
import { db, scDownloadFiles, scDownloads } from '~/server/utils/db/postgres/pg';

export async function getDownloadsForGuildAndType(
	guildId: string,
	type: boolean,
	limit: number,
	offset: number
) {
	const { total } = await db
		.select({
			total: count()
		})
		.from(scDownloads)
		.where(and(eq(scDownloads.guild_id, guildId), eq(scDownloads.patreon, type)))
		.firstOrThrow('Failed to get total downloads');
	return db
		.select({
			...getColumns(scDownloads),
			files: pgAggJsonBuildObject(scDownloadFiles, { aggregate: true })
		})
		.from(scDownloads)
		.innerJoin(scDownloadFiles, eq(scDownloads.id, scDownloadFiles.download_id))
		.where(and(eq(scDownloads.guild_id, guildId), eq(scDownloads.patreon, type)))
		.limit(limit)
		.offset(offset)
		.then((downloads) => {
			return {
				total,
				downloads
			};
		});
}

export async function getDownloadsForGuild(guildId: string, limit: number, offset: number) {
	const { total } = await db
		.select({
			total: count()
		})
		.from(scDownloads)
		.where(and(eq(scDownloads.guild_id, guildId)))
		.firstOrThrow('Failed to get total downloads');

	return db
		.select({
			...getColumns(scDownloads),
			files: pgAggJsonBuildObject(scDownloadFiles, { aggregate: true })
		})
		.from(scDownloads)
		.innerJoin(scDownloadFiles, eq(scDownloads.id, scDownloadFiles.download_id))
		.where(and(eq(scDownloads.guild_id, guildId)))
		.limit(limit)
		.offset(offset)
		.then((downloads) => {
			return {
				total,
				downloads
			};
		});
}
