import { DiscordGuildManager } from './guildManager';
import { hasPermissionForGuild } from './permissions';

export async function getRouteBaseParams(event: any) {
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

	return { guildData, guildId, user };
}
