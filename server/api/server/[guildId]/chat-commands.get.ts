import { count, eq } from '@kmods/drizzle-pg';
import { getColumns, pgAggJsonBuildObject, pgAnyValue } from '@kmods/drizzle-pg/pg-core';
import { z } from 'zod';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db, scChatCommands, scChatCommandsTrigger } from '~/server/utils/db/postgres/pg';
import type { Return } from '~/utils/typeUtils';

const cols = getColumns(scChatCommands);

async function getChatCommandsForGuildId(guildId: string, limit = 20, offset = 0) {
	const total = await db
		.select({ count: count() })
		.from(scChatCommands)
		.where(eq(scChatCommands.guild_id, guildId))
		.first()
		.then((row) => {
			return row?.count ?? 0;
		});

	return db
		.select({
			...(Object.entries(cols).reduce((acc, [key, value]) => {
				return {
					...acc,
					[key]: pgAnyValue(value).as(key)
				};
			}, {}) as typeof cols),
			triggers: pgAggJsonBuildObject(scChatCommandsTrigger, { aggregate: true }).as(
				'triggers'
			)
		})
		.from(scChatCommands)
		.leftJoin(scChatCommandsTrigger, ['command_id'])
		.groupBy(scChatCommands.command_id)
		.limit(limit)
		.offset(offset)
		.where(eq(scChatCommands.guild_id, guildId))
		.then((rows) => {
			return {
				total,
				data: rows
			};
		});
}

export type ChatCommandData = Return<typeof getChatCommandsForGuildId>;

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

	return await getChatCommandsForGuildId(guildId, limit, offset);
});
