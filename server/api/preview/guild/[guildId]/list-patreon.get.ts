import { getDownloadsForGuildAndType } from '~/server/bot/utils/preview';
import { getLimitOffset, getRouteBaseParams } from '~/server/bot/utils/routes';

export default defineEventHandler(async (event) => {
	const { guildId, guildData, user } = await getRouteBaseParams(event, true);
	const { limit, offset } = getLimitOffset(event);

	// check if the user is a patreon if the file is a patreon file
	if (!(await guildData.isPatreon(user.discordId))) {
		throw createError({
			statusCode: 403,
			message: 'You must be a patreon to download this file'
		});
	}

	return await getDownloadsForGuildAndType(guildId, true, limit, offset);
});
