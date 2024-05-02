import { count, eq } from '@kmods/drizzle-pg';
import { getLimitOffset, getRouteBaseParams } from '~/server/bot/utils/routes';
import { db } from '~/server/utils/db/postgres/pg';
import { viewGuildReactionRoles } from '~/server/utils/db/postgres/views';
import type { Return } from '~/utils/typeUtils';

async function getReactionRolesForGuildId(guildId: string, limit = 20, offset = 0) {
	const total = await db
		.select({ count: count() })
		.from(viewGuildReactionRoles)
		.where(eq(viewGuildReactionRoles.guild_id, guildId))
		.first()
		.then((row) => {
			return row?.count ?? 0;
		});

	return db
		.select()
		.from(viewGuildReactionRoles)
		.limit(limit)
		.offset(offset)
		.where(eq(viewGuildReactionRoles.guild_id, guildId))
		.orderBy(viewGuildReactionRoles.message_id)
		.then((rows) => {
			return {
				total,
				data: rows
			};
		});
}

export type ReactionRoleData = Return<typeof getReactionRolesForGuildId>;

export default defineEventHandler(async (event) => {
	const { guildId } = await getRouteBaseParams(event);
	const { limit, offset } = getLimitOffset(event);

	return await getReactionRolesForGuildId(guildId, limit, offset);
});
