import { z } from 'zod';
import { getRouteBaseParams } from '~/server/bot/utils/routes';

export default defineEventHandler(async (event) => {
	const { guildData } = await getRouteBaseParams(event);
	const channelId = zodNumeric(getRouterParam(event, 'channelId'), 'Channel Id must be numeric');
	const limit = z
		.string()
		.transform((v) => {
			const num = parseInt(v);
			if (isNaN(num)) {
				throw new TypeError('Invalid limit');
			}
			if (num <= 0 || num > 100) {
				throw new Error('Invalid limit must be between 1 and 100');
			}
			return num;
		})
		.parse(getQuery(event).limit ?? '10');

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
