import { eq } from '@kmods/drizzle-pg';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db, scGuildConfiguration } from '~/server/utils/db/postgres/pg';

export default defineEventHandler(async (event) => {
	const { guildId } = await getRouteBaseParams(event);

	return await db
		.select()
		.from(scGuildConfiguration)
		.where(eq(scGuildConfiguration.guild_id, guildId))
		.firstOrThrow('Server not found or you are not an admin of this server');
});
