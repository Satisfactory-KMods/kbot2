import { DiscordGuildManager } from '~/server/bot/utils/guildManager';
import { hasPermissionForGuild } from '~/server/bot/utils/permissions';

export default defineEventHandler(async (event) => {
	const { user } = await getServerSessionChecked(event);
	const guildId = zodNumeric(getRouterParam(event, 'guildId'), 'Server Id must be numeric');
	await hasPermissionForGuild(guildId, user.discordId);

	// also intialize the guild if it doesn't exist
	const guildData = await DiscordGuildManager.getGuild(guildId, false);
	if (!guildData.isValid()) {
		throw createError({
			statusCode: 404,
			message: 'Guild not found'
		});
	}

	const guild = guildData.getGuild;

	return guild.roles.cache.map((c) => {
		return {
			id: c.id,
			name: c.name,
			color: c.color,
			icon: c.iconURL({ forceStatic: true }) ?? ''
		};
	});
});
