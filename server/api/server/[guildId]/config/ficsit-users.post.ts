import { and, eq, notInArray } from '@kmods/drizzle-pg';
import { z } from 'zod';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db } from '~/server/utils/db/postgres/pg';
import { scGuildConfigurationFicsitUserIds } from '../../../../utils/db/postgres/schema/tables/guilds';

export default defineEventHandler(async (event) => {
	const { guildId } = await getRouteBaseParams(event);
	const users = z.array(z.string().min(5)).parse(await readBody(event));

	return await db.transaction(async (trx) => {
		await trx
			.delete(scGuildConfigurationFicsitUserIds)
			.where(
				and(
					eq(scGuildConfigurationFicsitUserIds.guild_id, guildId),
					notInArray(scGuildConfigurationFicsitUserIds.ficsit_user_id, users)
				)
			);

		if (users.length === 0) return { success: true };
		await trx
			.insert(scGuildConfigurationFicsitUserIds)
			.values(
				users.map((ficsit_user_id) => {
					return {
						guild_id: guildId,
						ficsit_user_id
					};
				})
			)
			.onConflictDoNothing();

		return { success: true };
	});
});
