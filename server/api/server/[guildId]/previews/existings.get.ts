import { getDownloadsForGuild } from '~/server/bot/utils/preview';
import { getLimitOffset, getRouteBaseParams } from '~/server/bot/utils/routes';

export default defineEventHandler(async (event) => {
	const { guildId } = await getRouteBaseParams(event);
	const { limit, offset } = getLimitOffset(event);
	const patreon = getQuery(event).type === 'patreon';

	return await getDownloadsForGuild(guildId, limit, offset, patreon);
});
