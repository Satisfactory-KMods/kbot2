import { and, eq } from '@kmods/drizzle-pg';
import { getColumns } from '@kmods/drizzle-pg/pg-core';
import { getLimitOffset, getRouteBaseParams } from '~/server/bot/utils/routes';
import { db, scDownloads, scGuildPatreons } from '~/server/utils/db/postgres/pg';
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

export default defineEventHandler(async (event) => {
	const { user, guildId } = await getRouteBaseParams(event);

	const query = getQuery(event);
	const patreon = query.query === 'true';
	const { limit, offset } = getLimitOffset(event);

	return await getDownloadsForGuildId(guildId, user.discordId, patreon, limit, offset);
});
