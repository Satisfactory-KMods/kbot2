import { getRouteBaseParams } from '~/server/bot/utils/routes';

export default defineEventHandler(async (event) => {
	const { guildData } = await getRouteBaseParams(event);
	const messageId = zodNumeric(getRouterParam(event, 'messageId'), 'Message Id must be numeric');
	const channelId = zodNumeric(getRouterParam(event, 'channelId'), 'Channel Id must be numeric');

	const channel = await guildData.textChannel(channelId);
	if (channel) {
		return channel.messages
			.fetch({ message: messageId, cache: true })
			.then((message) => {
				return {
					valid: true,
					message: {
						content: message.content,
						id: message.id,
						from: {
							name: message.author.username,
							id: message.author.id,
							avatar: message.author.displayAvatarURL({ size: 64, forceStatic: true })
						}
					}
				};
			})
			.catch(() => {
				return {
					valid: false
				};
			});
	}

	return {
		valid: false
	};
});
