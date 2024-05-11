import { and, eq } from '@kmods/drizzle-pg';
import { getColumns } from '@kmods/drizzle-pg/pg-core';
import type { Return } from '~/utils/typeUtils';
import { db, scGuild, scGuildAdmins } from '../utils/db/postgres/pg';
import { getServerSessionChecked } from '../utils/session';

function getServersByDiscordId(discordId: string) {
	return db
		.selectDistinctOn([scGuild.guild_id], getColumns(scGuild))
		.from(scGuild)
		.leftJoin(scGuildAdmins, ['guild_id'])
		.where(and(eq(scGuild.active, true), eq(scGuildAdmins.user_id, discordId)));
}

export type DiscordServerByUser = Return<typeof getServersByDiscordId>;

export default defineEventHandler(async (event) => {
	const { user } = await getServerSessionChecked(event);

	return await getServersByDiscordId(user.discordId);
});
