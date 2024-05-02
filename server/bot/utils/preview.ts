import { and, count, desc, eq } from '@kmods/drizzle-pg';
import { getColumns, pgAggJsonBuildObject, pgAnyValue } from '@kmods/drizzle-pg/pg-core';
import { db, scDownloadFiles, scDownloads, scModCache } from '~/server/utils/db/postgres/pg';

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

	const cols = getColumns(scDownloads);

	return db
		.select({
			...(Object.keys(cols).reduce((acc, key) => {
				// @ts-ignore
				acc[key] = pgAnyValue(cols[key]);
				return acc;
			}, {} as any) as typeof cols),
			files: pgAggJsonBuildObject(scDownloadFiles, { aggregate: true }),
			mod: pgAggJsonBuildObject(scModCache, { aggregate: true, index: 0 })
		})
		.from(scDownloads)
		.innerJoin(scDownloadFiles, eq(scDownloads.id, scDownloadFiles.download_id))
		.innerJoin(scModCache, ['mod_reference'])
		.where(and(eq(scDownloads.guild_id, guildId), eq(scDownloads.patreon, type)))
		.groupBy(scDownloads.id, scDownloads.guild_id)
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

	const cols = getColumns(scDownloads);

	return db
		.select({
			...(Object.keys(cols).reduce((acc, key) => {
				// @ts-ignore
				acc[key] = pgAnyValue(cols[key]);
				return acc;
			}, {} as any) as typeof cols),
			files: pgAggJsonBuildObject(scDownloadFiles, { aggregate: true }),
			mod: pgAggJsonBuildObject(scModCache, { aggregate: true, index: 0 })
		})
		.from(scDownloads)
		.innerJoin(scDownloadFiles, eq(scDownloads.id, scDownloadFiles.download_id))
		.leftJoin(scModCache, ['mod_reference'])
		.where(and(eq(scDownloads.guild_id, guildId)))
		.groupBy(scDownloads.id, scDownloads.guild_id)
		.orderBy(desc(scDownloads.uploaded_at))
		.limit(limit)
		.offset(offset)
		.then((downloads) => {
			return {
				total,
				downloads
			};
		});
}
