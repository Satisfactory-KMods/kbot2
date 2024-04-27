import { and, eq } from '@kmods/drizzle-pg';
import { join } from 'path';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db, scDownloads } from '~/server/utils/db/postgres/pg';

export default defineEventHandler(async (event) => {
	const { guildId } = await getRouteBaseParams(event);
	const id = zodNumeric(getRouterParam(event, 'id'), 'Preview Id must be numeric');

	await db.transaction(async (trx) => {
		const removed = await trx
			.delete(scDownloads)
			.where(and(eq(scDownloads.id, id), eq(scDownloads.guild_id, guildId)))
			.returning()
			.firstOrThrow('Preview not found');

		await FileAdapter.remove(join(process.cwd(), 'uploads', guildId, removed.id));
	});

	return { success: true };
});
