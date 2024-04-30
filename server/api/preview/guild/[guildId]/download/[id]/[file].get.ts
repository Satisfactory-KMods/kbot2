import { and, eq } from '@kmods/drizzle-pg';
import { getColumns } from '@kmods/drizzle-pg/pg-core';
import { join } from 'path';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db, scDownloadFiles, scDownloads } from '~/server/utils/db/postgres/pg';

export default defineEventHandler(async (event) => {
	const { guildId, guildData, user } = await getRouteBaseParams(event, true);
	const id = zodNumeric(getRouterParam(event, 'id'), 'Preview Id must be numeric');
	const file = zodNumeric(getRouterParam(event, 'file'), 'File Id must be numeric');

	const data = await db
		.select({
			...getColumns(scDownloadFiles),
			...getColumns(scDownloads)
		})
		.from(scDownloadFiles)
		.innerJoin(scDownloads, eq(scDownloads.id, scDownloadFiles.download_id))
		.where(
			and(
				eq(scDownloadFiles.id, file),
				eq(scDownloads.id, id),
				eq(scDownloads.guild_id, guildId)
			)
		)
		.firstOrThrow('File not found');

	// check if the user is a patreon if the file is a patreon file
	if (data.patreon && !(await guildData.isPatreon(user.discordId))) {
		throw createError({
			statusCode: 403,
			message: 'You must be a patreon to download this file'
		});
	}

	// create a stream to the file
	const stream = FileAdapter.createReadStream(join(process.cwd(), 'uploads', guildId, id, file));

	setHeader(event, 'Content-Type', data.mime);
	setHeader(event, 'Content-Length', data.size);
	setHeader(event, 'Content-Disposition', `attachment; filename="${data.name}"`);

	return stream;
});
