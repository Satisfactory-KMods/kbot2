import { getRouteBaseParams } from '~/server/bot/utils/routes';

export default defineEventHandler(async (event) => {
	const { guildData } = await getRouteBaseParams(event);

	return guildData.config;
});
