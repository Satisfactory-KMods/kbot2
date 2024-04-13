import { and, eq } from '@kmods/drizzle-pg';
import { getColumns } from '@kmods/drizzle-pg/pg-core';
import { DiscordGuildManager } from '~/server/bot/utils/guildManager';
import { db, scGuild, scGuildAdmins } from '~/server/utils/db/postgres/pg';
import { getServerSessionChecked } from '~/server/utils/session';
import { zodNumeric } from '~/server/utils/zodSchemas';
import type { Return } from '~/utils/typeUtils';

async function getServerBaseData(guildId: string, discordId: string) {
	// Intialize the guild if it doesn't exist
	const guildData = await DiscordGuildManager.getGuild(guildId, false);

	if (guildData.isValid()) {
		const guild = guildData.getGuild;
		const discordData = {
			count_users: guild.memberCount,
			online_users: guild.approximatePresenceCount ?? 0,
			premium_subscription_count: guild.premiumSubscriptionCount ?? 0,
			created_at: guild.createdTimestamp,
			name: guild.name,
			description: guild.description ?? '',
			banner: guild.bannerURL({ forceStatic: true }) ?? '',
			icon: guild.iconURL({ forceStatic: true }) ?? ''
		};

		return await db
			.selectDistinctOn([scGuild.guild_id], getColumns(scGuild))
			.from(scGuild)
			.leftJoin(scGuildAdmins, ['guild_id'])
			.where(and(eq(scGuild.guild_id, guildId), eq(scGuildAdmins.user_id, discordId)))
			.firstOrThrow('Server not found or you are not an admin of this server')
			.then((r) => {
				return {
					...r,
					...discordData
				};
			});
	}

	throw createError({
		statusCode: 404,
		message: 'Guild not found'
	});
}

export type DiscordServerBaseData = Return<typeof getServerBaseData>;

export default defineEventHandler(async (event) => {
	const { user } = await getServerSessionChecked(event);
	const guildId = zodNumeric(getRouterParam(event, 'guildId'), 'Server Id must be numeric');

	return await getServerBaseData(guildId, user.discordId);
});
