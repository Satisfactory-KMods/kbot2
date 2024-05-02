import { getRouteBaseParams } from '~/server/bot/utils/routes';

export default defineEventHandler(async (event) => {
	const { guildData } = await getRouteBaseParams(event);

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
