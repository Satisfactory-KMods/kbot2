import { getLimitOffset, getRouteBaseParams } from '~/server/bot/utils/routes';

export default defineEventHandler(async (event) => {
	const { guildData } = await getRouteBaseParams(event);
	const channelId = zodNumeric(getRouterParam(event, 'channelId'), 'Channel Id must be numeric');
	const { limit } = getLimitOffset(event, {
		defaultLimit: 10
	});

	const channel = await guildData.textChannel(channelId);
	if (!channel) {
		throw createError({
			statusCode: 404,
			message: 'Channel not found'
		});
	}

	return await channel.messages.fetch({ limit, cache: true }).then((r) => {
		return r.map((message) => {
			return {
				content: message.content,
				id: message.id,
				from: {
					name: message.author.username,
					id: message.author.id,
					avatar: message.author.displayAvatarURL({ size: 64, forceStatic: true })
				}
			};
		});
	});
});
