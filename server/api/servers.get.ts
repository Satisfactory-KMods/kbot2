import { getServerSession } from '#auth';
import { eq } from '@kmods/drizzle-pg';
import { getColumns } from '@kmods/drizzle-pg/pg-core';
import { db, scGuild, scGuildAdmins } from '../utils/db/postgres/pg';

export default defineEventHandler(async (event) => {
	const session = await getServerSession(event);

	if (!session) {
		throw createError({
			status: 401,
			message: 'Unauthorized'
		});
	}

	return await db
		.selectDistinctOn([scGuild.guild_id], getColumns(scGuild))
		.from(scGuild)
		.leftJoin(scGuildAdmins, ['guild_id'])
		.where(eq(scGuildAdmins.user_id, session.user.discordId));
});
