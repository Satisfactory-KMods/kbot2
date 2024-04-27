import { getDownloadsForGuildAndType } from '~/server/bot/utils/preview';
import { getLimitOffset, getRouteBaseParams } from '~/server/bot/utils/routes';

export default defineEventHandler(async (event) => {
	const { guildId } = await getRouteBaseParams(event, true);
	const { limit, offset } = getLimitOffset(event);

	return await getDownloadsForGuildAndType(guildId, false, limit, offset);
});
