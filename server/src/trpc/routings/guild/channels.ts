import { handleTRCPErr } from '@server/lib/Express.Lib';
import { guildProcedure, router } from '@server/trpc/trpc';
import { EChannelType } from '@shared/Enum/EDiscord';
import { TRPCError } from '@trpc/server';
import { ChannelType } from 'discord.js';
import z from 'zod';

export const guild_channels = router({
	oftype: guildProcedure
		.input(
			z.object({
				type: z.nativeEnum(EChannelType)
			})
		)
		.query<{
			channels: any[];
		}>(async ({ input, ctx }) => {
			const { type } = input;
			const { guild } = ctx;
			try {
				if (guild) {
					let channels: any[] = [];
					switch (type) {
						case EChannelType.voice:
							channels = guild
								.getGuild!.channels.cache.filter((e) => e?.type === ChannelType.GuildVoice)
								.map((e) => e?.toJSON() as any);
							break;
						case EChannelType.text:
							channels = guild
								.getGuild!.channels.cache.filter(
									(e) => e?.type === ChannelType.GuildText || e?.type === ChannelType.GuildAnnouncement
								)
								.map((e) => e?.toJSON() as any);
							break;
						case EChannelType.forum:
							channels = guild
								.getGuild!.channels.cache.filter((e) => e?.type === ChannelType.GuildForum)
								.map((e) => e?.toJSON() as any);
							break;
					}
					return { channels };
				}
			} catch (e) {
				handleTRCPErr(e);
			}
			throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
		})
});
