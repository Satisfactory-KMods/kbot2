import { and, eq } from '@kmods/drizzle-pg';
import { getColumns } from '@kmods/drizzle-pg/pg-core';
import { z } from 'zod';
import { db, scDownloads, scGuildPatreons } from '~/server/utils/db/postgres/pg';
import { getServerSessionChecked } from '~/server/utils/session';
import { zodNumeric } from '~/server/utils/zodSchemas';
import type { Return } from '~/utils/typeUtils';

function getDownloadsForGuildId(
	guildId: string,
	discordId: string,
	patreon: boolean,
	limit: number,
	offset: number
) {
	return db
		.selectDistinctOn([scDownloads.id], getColumns(scDownloads))
		.from(scDownloads)
		.leftJoin(scGuildPatreons, ['guild_id'])
		.where(
			patreon
				? and(
						eq(scDownloads.guild_id, guildId),
						eq(scDownloads.patreon, true),
						eq(scGuildPatreons.user_id, discordId)
					)
				: and(eq(scDownloads.guild_id, guildId), eq(scDownloads.patreon, false))
		)
		.limit(limit)
		.offset(offset)
		.then((rows) => {
			return rows.map((row) => {
				return { ...row, download_url: `/api/server/${row.guild_id}/downloads/${row.id}` };
			});
		});
}

export type DiscordServerBaseData = Return<typeof getDownloadsForGuildId>;

const zNumber = z.number().min(0);

export default defineEventHandler(async (event) => {
	const { user } = await getServerSessionChecked(event);

	const query = getQuery(event);
	const patreon = query.query === 'true';
	const limit = zNumber.parse(query.limit ? parseInt(String(query.limit)) : 20);
	const offset = zNumber.parse(query.offset ? parseInt(String(query.offset)) : 20);
	const guildId = zodNumeric(getRouterParam(event, 'guildId'), 'Server Id must be numeric');

	return await getDownloadsForGuildId(guildId, user.discordId, patreon, limit, offset);
});
