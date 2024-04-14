import { count, eq } from '@kmods/drizzle-pg';
import { z } from 'zod';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
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

	const limit = z
		.string()
		.transform((v) => {
			const num = parseInt(v);
			if (isNaN(num)) {
				throw new TypeError('Invalid limit');
			}
			if (num <= 0 || num > 100) {
				throw new Error('Invalid limit must be between 1 and 100');
			}
			return num;
		})
		.parse(getQuery(event).limit ?? '20');
	const offset = z
		.string()
		.transform((v) => {
			const num = parseInt(v);
			if (isNaN(num)) {
				throw new TypeError('Invalid offset');
			}
			if (num < 0) {
				throw new Error('Invalid offset must bigger or equals than 0');
			}
			return num;
		})
		.parse(getQuery(event).offset ?? '0');

	return await getReactionRolesForGuildId(guildId, limit, offset);
});
