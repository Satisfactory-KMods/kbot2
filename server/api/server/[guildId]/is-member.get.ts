import { getRouteBaseParams } from '~/server/bot/utils/routes';

export default defineEventHandler(async (event) => {
	const { user, guildData } = await getRouteBaseParams(event, true);

	const [isMember, isPatreon, isAdmin] = await Promise.all([
		guildData.isMember(user.discordId),
		guildData.isPatreon(user.discordId),
		guildData.isAdmin(user.discordId)
	]);

	return { isMember, isPatreon, isAdmin };
});
