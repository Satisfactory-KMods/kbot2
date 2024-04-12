import { and, eq } from '@kmods/drizzle-pg';
import { getColumns } from '@kmods/drizzle-pg/pg-core';
import { DiscordGuildManager } from '~/server/bot/utils/guildManager';
import { db, scGuild, scGuildAdmins } from '~/server/utils/db/postgres/pg';
import { getServerSessionChecked } from '~/server/utils/session';
import { zodNumeric } from '~/server/utils/zodSchemas';
import type { Return } from '~/utils/typeUtils';

function getServerBaseData(guildId: string, discordId: string) {
	return db
		.selectDistinctOn([scGuild.guild_id], getColumns(scGuild))
		.from(scGuild)
		.leftJoin(scGuildAdmins, ['guild_id'])
		.where(and(eq(scGuild.guild_id, guildId), eq(scGuildAdmins.user_id, discordId)))
		.firstOrThrow('Server not found or you are not an admin of this server');
}

export type DiscordServerBaseData = Return<typeof getServerBaseData>;

export default defineEventHandler(async (event) => {
	const { user } = await getServerSessionChecked(event);
	const guildId = zodNumeric(getRouterParam(event, 'guildId'), 'Server Id must be numeric');

	// Intialize the guild if it doesn't exist
	await DiscordGuildManager.getGuild(guildId);

	return await getServerBaseData(guildId, user.discordId);
});
