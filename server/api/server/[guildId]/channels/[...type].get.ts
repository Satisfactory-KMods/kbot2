import type { ValueOf } from '@kmods/drizzle-pg/pg-core';
import { z } from 'zod';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { ChannelTypes } from '~/utils/enums';

export default defineEventHandler(async (event) => {
	const { guildData } = await getRouteBaseParams(event);
	const channelTypes = z
		.nativeEnum(ChannelTypes, {
			errorMap: () => {
				return {
					message: 'Unknown channel type'
				};
			}
		})
		.or(
			z
				.nativeEnum(ChannelTypes, {
					errorMap: () => {
						return {
							message: 'Unknown channel type'
						};
					}
				})
				.array()
		)
		.transform((v) => {
			if (Array.isArray(v)) {
				return v;
			}
			return [v];
		})
		.parse(getRouterParam(event, 'type')?.split('/') ?? []);

	const guild = guildData.getGuild;

	return guild.channels.cache
		.map((c) => {
			let type = ChannelTypes.unknown as ValueOf<typeof ChannelTypes>;
			if (c.isTextBased()) {
				type = ChannelTypes.text;
			}
			if (c.isVoiceBased()) {
				type = ChannelTypes.voice;
			}
			if (c.isThreadOnly() || c.isThread()) {
				type = ChannelTypes.forum;
			}

			return {
				id: c.id,
				name: c.name,
				type
			};
		})
		.filter((c) => {
			return (
				c.type !== ChannelTypes.unknown &&
				(channelTypes.includes(ChannelTypes.all) || channelTypes.includes(c.type))
			);
		});
});
