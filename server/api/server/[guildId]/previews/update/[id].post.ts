import { and, eq } from '@kmods/drizzle-pg';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db, scDownloads } from '~/server/utils/db/postgres/pg';

export default defineEventHandler(async (event) => {
	const { guildId } = await getRouteBaseParams(event);
	const id = zodNumeric(getRouterParam(event, 'id'), 'Preview Id must be numeric');
	const { version, mod_reference, patreon } = (await readBody(event)) as any;

	await db
		.update(scDownloads)
		.set({ version, mod_reference, patreon })
		.where(and(eq(scDownloads.id, id), eq(scDownloads.guild_id, guildId)))
		.returning()
		.firstOrThrow('Preview not found');

	return { success: true };
});
