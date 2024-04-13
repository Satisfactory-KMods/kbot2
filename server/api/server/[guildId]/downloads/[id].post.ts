import { getRouteBaseParams } from '~/server/bot/utils/routes';

export default defineEventHandler(async (event) => {
	// eslint-disable-next-line no-empty-pattern
	const {} = await getRouteBaseParams(event);
});
